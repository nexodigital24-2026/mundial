'use client';

import { banners as defaultBanners, type Banner } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Megaphone } from 'lucide-react';

interface BannerDisplayProps {
  position: Banner['position'];
  bannersOverride?: Banner[];
}

const positionLabels: Record<Banner['position'], string> = {
  hero: 'Patrocinador Principal',
  sidebar: 'Publicidad',
  footer: 'Patrocinador',
  'content-top': 'Publicidad Superior',
  'content-bottom': 'Publicidad Inferior',
};

const positionColors: Record<Banner['position'], string> = {
  hero: 'from-nd-green/20 to-primary/10 border-nd-green/30',
  sidebar: 'from-nd-gray to-white border-nd-gray-dark',
  footer: 'from-nd-gray to-white border-nd-gray-dark',
  'content-top': 'from-nd-orange-light to-white border-nd-orange/20',
  'content-bottom': 'from-nd-orange-light to-white border-nd-orange/20',
};

export default function BannerDisplay({ position, bannersOverride }: BannerDisplayProps) {
  const allBanners = bannersOverride ?? defaultBanners;
  const activeBanners = allBanners
    .filter(b => b.active && b.position === position)
    .sort((a, b) => a.priority - b.priority);

  if (activeBanners.length === 0) return null;

  if (position === 'hero') {
    const banner = activeBanners[0];
    return (
      <a
        href={banner.linkUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <Card className="overflow-hidden border-2 border-nd-green/30 hover:border-nd-green/60 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${positionColors.hero} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMEFFRUYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTIwIDBMMCAyMGwyMCAyMCAyMC0yMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
              <div className="relative px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{banner.title}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">{positionLabels[position]}</Badge>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      </a>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className="space-y-3">
        {activeBanners.map(banner => (
          <a
            key={banner.id}
            href={banner.linkUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {banner.title}
                  </span>
                </div>
                <Badge variant="secondary" className="text-[9px] mt-1.5">{positionLabels[position]}</Badge>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    );
  }

  // content-top, content-bottom, footer
  return (
    <div className="space-y-2">
      {activeBanners.map(banner => (
        <a
          key={banner.id}
          href={banner.linkUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className={`overflow-hidden border bg-gradient-to-r ${positionColors[position]} hover:shadow-md transition-all duration-300`}>
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {banner.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[9px]">{positionLabels[position]}</Badge>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
