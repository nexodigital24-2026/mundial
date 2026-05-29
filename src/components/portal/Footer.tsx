'use client';

import { Trophy } from 'lucide-react';
import BannerDisplay from './BannerDisplay';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      {/* Footer Banners */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <BannerDisplay position="footer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">Nuevo Día Mundial</span>
            </div>
            <p className="text-white/70 text-sm">
              El portal deportivo más completo del Mundial 2026. Resultados en vivo, estadísticas y toda la información del torneo con 48 selecciones y 12 grupos.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Secciones</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="hover:text-white transition-colors cursor-pointer">Grupos y Posiciones</li>
              <li className="hover:text-white transition-colors cursor-pointer">Resultados</li>
              <li className="hover:text-white transition-colors cursor-pointer">Goleadores</li>
              <li className="hover:text-white transition-colors cursor-pointer">Expulsados</li>
              <li className="hover:text-white transition-colors cursor-pointer">Síntesis</li>
              <li className="hover:text-white transition-colors cursor-pointer">Votación Figura</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>info@nuevodiawmundial.com</li>
              <li>@nuevodiawmundial</li>
              <li>© 2026 Nuevo Día Mundial</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-[11px] text-white/50">Patrocinadores oficiales: Adidas, Coca-Cola, Visa, Hyundai, Qatar Airways, McDonald&apos;s, Wanda, Hisense</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center text-xs text-white/50">
          Todos los derechos reservados © 2026 Nuevo Día Mundial. Datos de demostración con fines ilustrativos.
        </div>
      </div>
    </footer>
  );
}
