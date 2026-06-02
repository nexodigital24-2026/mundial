#!/bin/bash
# ============================================
# Nexo Digital Mundial - Deploy Script
# Uso: ./deploy.sh [--setup | --deploy | --ssl | --update | --status]
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="mundial.nexodigital24.com"
APP_DIR="/opt/nexo-mundial"
DOCKER_COMPOSE="$APP_DIR/docker-compose.yml"

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err()   { echo -e "${RED}[ERROR]${NC} $1"; }

# ---- SETUP INICIAL ----
setup() {
    log_info "=== Configuración inicial del VPS para $DOMAIN ==="

    # 1. Actualizar sistema
    log_info "Actualizando paquetes del sistema..."
    sudo apt update && sudo apt upgrade -y

    # 2. Instalar Docker
    if ! command -v docker &> /dev/null; then
        log_info "Instalando Docker..."
        curl -fsSL https://get.docker.com | sudo sh
        sudo usermod -aG docker $USER
        log_ok "Docker instalado. Cerrá sesión y volvé a entrar para que aplique."
    else
        log_ok "Docker ya está instalado"
    fi

    # 3. Instalar Docker Compose
    if ! command -v docker compose &> /dev/null; then
        log_info "Instalando Docker Compose plugin..."
        sudo apt install -y docker-compose-plugin
    else
        log_ok "Docker Compose ya está instalado"
    fi

    # 4. Instalar Nginx
    if ! command -v nginx &> /dev/null; then
        log_info "Instalando Nginx..."
        sudo apt install -y nginx
        sudo systemctl enable nginx
        sudo systemctl start nginx
        log_ok "Nginx instalado"
    else
        log_ok "Nginx ya está instalado"
    fi

    # 5. Instalar Certbot
    if ! command -v certbot &> /dev/null; then
        log_info "Instalando Certbot..."
        sudo apt install -y certbot python3-certbot-nginx
        log_ok "Certbot instalado"
    else
        log_ok "Certbot ya está instalado"
    fi

    # 6. Crear directorio de la app
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR

    # 7. Crear directorio para certbot
    sudo mkdir -p /var/www/certbot

    log_ok "=== Setup inicial completado ==="
    log_warn "Recordá cerrar sesión y volver a entrar para que Docker aplique los permisos."
    echo ""
    log_info "Próximos pasos:"
    echo "  1. Subir el código al VPS (rsync o git clone)"
    echo "  2. Ejecutar: ./deploy.sh --deploy"
    echo "  3. Ejecutar: ./deploy.sh --ssl"
}

# ---- DEPLOY ----
deploy() {
    log_info "=== Desplegando Nexo Digital Mundial ==="

    cd $APP_DIR

    # Build y levantar con Docker
    log_info "Construyendo imagen Docker..."
    docker compose build --no-cache

    log_info "Levantando contenedores..."
    docker compose up -d

    # Esperar a que arranque
    log_info "Esperando que la app arranque..."
    sleep 10

    # Verificar
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        log_ok "App corriendo en http://localhost:3000"
    else
        log_warn "La app aún no responde, puede necesitar más tiempo..."
        docker compose logs --tail=20
    fi

    log_ok "=== Deploy completado ==="
}

# ---- SSL ----
setup_ssl() {
    log_info "=== Configurando SSL para $DOMAIN ==="

    # Copiar configuración de Nginx
    if [ -f "$APP_DIR/deploy/nginx/nexo-mundial.conf" ]; then
        sudo cp $APP_DIR/deploy/nginx/nexo-mundial.conf /etc/nginx/sites-available/nexo-mundial
        sudo ln -sf /etc/nginx/sites-available/nexo-mundial /etc/nginx/sites-enabled/
        log_ok "Configuración Nginx copiada"
    else
        log_err "No se encontró deploy/nginx/nexo-mundial.conf"
        exit 1
    fi

    # Test nginx config (sin SSL primero)
    log_info "Configurando Nginx en modo HTTP-only para certbot..."
    # Temporalmente remover el bloque HTTPS para que certbot pueda validar
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email || {
        log_err "Certbot falló. Verificá que el DNS apunte a este servidor."
        exit 1
    }

    # Recargar nginx con config completa
    sudo cp $APP_DIR/deploy/nginx/nexo-mundial.conf /etc/nginx/sites-available/nexo-mundial
    sudo nginx -t && sudo systemctl reload nginx

    # Auto-renovación
    log_info "Configurando auto-renovación de SSL..."
    sudo crontab -l 2>/dev/null | grep -v certbot > /tmp/cron.tmp
    echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'" >> /tmp/cron.tmp
    sudo crontab /tmp/cron.tmp
    rm /tmp/cron.tmp

    log_ok "=== SSL configurado ==="
    log_ok "Tu sitio está en: https://$DOMAIN"
}

# ---- UPDATE ----
update() {
    log_info "=== Actualizando Nexo Digital Mundial ==="

    cd $APP_DIR

    # Rebuild y restart
    docker compose build --no-cache
    docker compose up -d --force-recreate

    # Limpiar imágenes viejas
    docker image prune -f

    log_ok "=== Actualización completada ==="
    log_info "Verificando estado..."
    sleep 5
    docker compose ps
}

# ---- STATUS ----
status() {
    log_info "=== Estado del servicio ==="
    cd $APP_DIR 2>/dev/null || { log_err "Directorio $APP_DIR no existe"; exit 1; }

    echo ""
    echo "Containers:"
    docker compose ps

    echo ""
    echo "Uptime check:"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        log_ok "App respondiendo (HTTP $HTTP_CODE)"
    else
        log_err "App NO responde (HTTP $HTTP_CODE)"
    fi

    echo ""
    echo "SSL check:"
    SSL_CHECK=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
    if [ "$SSL_CHECK" = "200" ] || [ "$SSL_CHECK" = "301" ]; then
        log_ok "SSL funcionando (HTTP $SSL_CHECK)"
    else
        log_warn "SSL no configurado o con problemas (HTTP $SSL_CHECK)"
    fi

    echo ""
    echo "Últimos logs:"
    docker compose logs --tail=10
}

# ---- MAIN ----
case "${1:-}" in
    --setup)
        setup
        ;;
    --deploy)
        deploy
        ;;
    --ssl)
        setup_ssl
        ;;
    --update)
        update
        ;;
    --status)
        status
        ;;
    *)
        echo "Nexo Digital Mundial - Deploy Script"
        echo ""
        echo "Uso: $0 {--setup|--deploy|--ssl|--update|--status}"
        echo ""
        echo "  --setup   Primera vez: instala Docker, Nginx, Certbot"
        echo "  --deploy  Build + levantar la app con Docker"
        echo "  --ssl     Configurar certificado SSL con Let's Encrypt"
        echo "  --update  Actualizar app (rebuild + restart)"
        echo "  --status  Ver estado del servicio"
        ;;
esac
