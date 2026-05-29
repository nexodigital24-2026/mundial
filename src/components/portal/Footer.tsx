'use client';

import Image from 'next/image';
import { Radio } from 'lucide-react';
import BannerDisplay from './BannerDisplay';

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Footer Banners */}
      <div className="bg-background border-b border-nd-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <BannerDisplay position="footer" />
        </div>
      </div>

      {/* Main footer - green background with yellow accents */}
      <div className="bg-gradient-to-b from-nd-green-dark to-nd-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image src="/logo-nuevo-dia.png" alt="Radio Nuevo Día" width={44} height={44} className="object-contain" />
                <div>
                  <span className="text-lg font-extrabold text-white">Nuevo Día <span className="text-nd-orange">Mundial</span></span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Radio className="w-3 h-3 text-nd-orange" />
                    <span className="text-[10px] text-nd-orange font-semibold tracking-wider">100.9 FM — EL DIARIO</span>
                  </div>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                El portal deportivo más completo del Mundial 2026. Resultados en vivo, estadísticas y toda la información del torneo con 48 selecciones y 12 grupos.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-nd-orange font-bold mb-3 text-sm tracking-wider uppercase">Secciones</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Grupos y Posiciones</li>
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Resultados</li>
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Goleadores</li>
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Expulsados</li>
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Síntesis</li>
                <li className="hover:text-nd-orange transition-colors cursor-pointer">Votación Figura</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-nd-orange font-bold mb-3 text-sm tracking-wider uppercase">Contacto</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>info@nuevodiawmundial.com</li>
                <li>@nuevodiawmundial</li>
                <li>© 2026 Radio Nuevo Día</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-[11px] text-white/50">Patrocinadores oficiales: Adidas, Coca-Cola, Visa, Hyundai, Qatar Airways, McDonald&apos;s, Wanda, Hisense</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/20 text-center text-xs text-white/50">
            Todos los derechos reservados © 2026 Radio Nuevo Día — El Diario. Datos de demostración con fines ilustrativos.
          </div>
        </div>
      </div>
    </footer>
  );
}
