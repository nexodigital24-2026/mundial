#!/bin/bash
# ============================================
# Nexo Digital Mundial - Quick Install
# Ejecutar en el VPS como root:
#   curl -sSL https://TU_SERVIDOR/install.sh | bash
# O clonar y ejecutar:
#   git clone TU_REPO /opt/nexo-mundial && cd /opt/nexo-mundial && ./deploy.sh --setup
# ============================================

set -e

DOMAIN="mundial.nexodigital24.com"
APP_DIR="/opt/nexo-mundial"

echo "=========================================="
echo "  Nexo Digital Mundial - Instalación VPS"
echo "  Dominio: $DOMAIN"
echo "=========================================="
echo ""

# 1. Sistema
echo "[1/7] Actualizando sistema..."
apt update && apt upgrade -y

# 2. Docker
echo "[2/7] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "Docker instalado."
else
    echo "Docker ya instalado, saltando."
fi

# 3. Docker Compose plugin
echo "[3/7] Verificando Docker Compose..."
apt install -y docker-compose-plugin 2>/dev/null || true

# 4. Nginx
echo "[4/7] Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo "Nginx instalado."
else
    echo "Nginx ya instalado, saltando."
fi

# 5. Certbot
echo "[5/7] Instalando Certbot..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo "Certbot instalado."
else
    echo "Certbot ya instalado, saltando."
fi

# 6. Firewall
echo "[6/7] Configurando firewall (UFW)..."
if command -v ufw &> /dev/null; then
    ufw --force enable
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    echo "Firewall configurado (puertos 22, 80, 443 abiertos)."
else
    apt install -y ufw
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "Firewall instalado y configurado."
fi

# 7. Directorio
echo "[7/7] Creando directorio de la app..."
mkdir -p $APP_DIR
mkdir -p /var/www/certbot

echo ""
echo "=========================================="
echo "  Setup inicial completado!"
echo "=========================================="
echo ""
echo "PRÓXIMOS PASOS:"
echo ""
echo "1) Subir el código al VPS:"
echo "   rsync -avz --exclude node_modules --exclude .next ./ usuario@TU_VPS:$APP_DIR/"
echo ""
echo "2) Copiar .env de producción:"
echo "   cp $APP_DIR/deploy/.env.production $APP_DIR/.env"
echo "   nano $APP_DIR/.env  # Editar con tus API keys reales"
echo ""
echo "3) Hacer deploy:"
echo "   cd $APP_DIR && chmod +x deploy.sh && ./deploy.sh --deploy"
echo ""
echo "4) Configurar DNS (en tu panel de nexodigital24.com):"
echo "   Tipo: A    Nombre: mundial    Valor: IP_DE_ESTE_VPS"
echo ""
echo "5) Activar SSL:"
echo "   cd $APP_DIR && ./deploy.sh --ssl"
echo ""
echo "6) Verificar:"
echo "   cd $APP_DIR && ./deploy.sh --status"
echo ""
