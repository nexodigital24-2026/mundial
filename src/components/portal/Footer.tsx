'use client';

import { Radio, Instagram, Twitter, Facebook, Youtube, Music, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useFooterData } from '@/lib/footer-context';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram, Twitter, Facebook, Youtube, Music,
};

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = iconMap[icon];
  if (IconComponent) return <IconComponent className={className} />;
  return <Globe className={className} />;
}

export default function Footer() {
  const { footerData } = useFooterData();

  if (!footerData.showFooter) return null;

  const handleLinkClick = (url: string) => {
    if (url.startsWith('#')) {
      const tabName = url.substring(1);
      window.dispatchEvent(new CustomEvent('footer-navigate', { detail: tabName }));
    } else if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <footer className="mt-auto">
      {/* Orange accent line at top */}
      <div className="h-[3px] bg-nd-orange" />

      <div className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-white font-extrabold text-xl tracking-tight">{footerData.brandName}</span>
                  <span className="text-nd-orange font-extrabold text-xl tracking-tight">{footerData.brandAccent}</span>
                </div>
                {footerData.showRadioBadge && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Radio className="w-3 h-3 text-nd-orange" />
                    <span className="text-[10px] text-nd-orange font-semibold tracking-wider">{footerData.radioBadgeText}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {footerData.brandDescription}
              </p>

              {/* Social Icons */}
              {footerData.socials.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {footerData.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-nd-orange flex items-center justify-center transition-all duration-200 hover:scale-110 text-gray-400 hover:text-white"
                      title={social.platform}
                    >
                      <SocialIcon icon={social.icon} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Sections */}
            {footerData.sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-nd-orange font-bold mb-3 text-sm tracking-wider uppercase">{section.title}</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => handleLinkClick(link.url)}
                        className="hover:text-white transition-colors cursor-pointer text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Section */}
            <div>
              <h3 className="text-nd-orange font-bold mb-3 text-sm tracking-wider uppercase">Contacto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {footerData.contactEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${footerData.contactEmail}`} className="hover:text-white transition-colors">
                      {footerData.contactEmail}
                    </a>
                  </li>
                )}
                {footerData.contactPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <a href={`tel:${footerData.contactPhone}`} className="hover:text-white transition-colors">
                      {footerData.contactPhone}
                    </a>
                  </li>
                )}
                {footerData.contactAddress && (
                  <li className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span>{footerData.contactAddress}</span>
                  </li>
                )}
                {!footerData.contactEmail && !footerData.contactPhone && !footerData.contactAddress && (
                  <li className="text-gray-500">Sin datos de contacto</li>
                )}
              </ul>

              {footerData.showSponsors && footerData.sponsorsText && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-[11px] text-gray-500">{footerData.sponsorsText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Copyright bar */}
          <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-gray-500">
            {footerData.copyrightText} &copy; {footerData.copyrightYear} {footerData.brandName} {footerData.brandAccent}. Datos de demostración con fines ilustrativos.
          </div>
        </div>
      </div>

      {/* Deeper black bottom bar */}
      <div className="bg-[#0D0D0D] py-2 text-center text-[10px] text-gray-600 tracking-wider">
        NEXO DIGITAL MUNDIAL — FIFA WORLD CUP 2026
      </div>
    </footer>
  );
}
