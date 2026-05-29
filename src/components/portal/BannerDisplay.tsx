'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { banners as defaultBanners, type Banner, type BannerPosition } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerDisplayProps {
  position: BannerPosition;
  bannersOverride?: Banner[];
}

const positionLabels: Record<BannerPosition, string> = {
  hero: 'Patrocinador Principal',
  sidebar: 'Publicidad',
  footer: 'Patrocinador',
  'content-top': 'Publicidad Superior',
  'content-bottom': 'Publicidad Inferior',
  'navbar-below': 'Barra de Navegación',
  'between-matches': 'Entre Partidos',
  'sticky-bottom': 'Barra Inferior',
  'floating-left': 'Flotante Izquierdo',
  'floating-right': 'Flotante Derecho',
  interstitial: 'Pantalla Completa',
};

const borderRadiusMap: Record<Banner['borderRadius'], string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

function incrementImpressions(_bannerId: string) {
  // Mock: in a real app this would call an API
}

function BannerPastilla({ banner, style, className = '' }: { banner: Banner; style?: React.CSSProperties; className?: string }) {
  const aspectRatio = banner.width / banner.height;
  const radius = borderRadiusMap[banner.borderRadius];

  return (
    <a
      href={banner.linkUrl || '#'}
      target={banner.targetType === '_blank' ? '_blank' : '_self'}
      rel={banner.targetType === '_blank' ? 'noopener noreferrer' : undefined}
      className={`block group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${radius} ${className}`}
      style={{
        backgroundColor: banner.bgColor,
        aspectRatio: `${aspectRatio}`,
        maxWidth: `min(${banner.width}px, 100%)`,
        ...style,
      }}
      onClick={() => incrementImpressions(banner.id)}
    >
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-4 h-4 text-current opacity-70" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate group-hover:underline" style={{ color: getContrastColor(banner.bgColor) }}>
              {banner.title}
            </p>
            <Badge variant="secondary" className="text-[9px] mt-0.5">{positionLabels[banner.position]}</Badge>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: getContrastColor(banner.bgColor) }} />
      </div>
    </a>
  );
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
}

function useBannerRotation(activeBanners: Banner[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentBanner = activeBanners[currentIndex] ?? activeBanners[0];

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const duration = currentBanner?.displayDuration ?? 10;
    timerRef.current = setInterval(goToNext, duration * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, activeBanners.length, currentBanner?.displayDuration, goToNext]);

  // Track impressions on visibility
  useEffect(() => {
    if (currentBanner) {
      incrementImpressions(currentBanner.id);
    }
  }, [currentIndex, currentBanner]);

  return { currentIndex, currentBanner, goToNext, goToPrev };
}

export default function BannerDisplay({ position, bannersOverride }: BannerDisplayProps) {
  const allBanners = bannersOverride ?? defaultBanners;
  const activeBanners = allBanners
    .filter(b => b.active && b.position === position)
    .sort((a, b) => a.priority - b.priority);

  const [closed, setClosed] = useState(false);
  const [interstitialVisible, setInterstitialVisible] = useState(true);
  const [interstitialCountdown, setInterstitialCountdown] = useState(5);

  const { currentIndex, currentBanner, goToNext, goToPrev } = useBannerRotation(activeBanners);

  if (activeBanners.length === 0 || !currentBanner) return null;
  if (closed) return null;

  // Interstitial: full-screen overlay
  if (position === 'interstitial') {
    if (!interstitialVisible) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center animate-fade-in">
        <div className="relative max-w-3xl w-full mx-4">
          <div className="absolute -top-10 right-0 flex items-center gap-3">
            <span className="text-white text-sm font-medium">
              Cerrando en {interstitialCountdown}s
            </span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white/20 border-white/40 text-white hover:bg-white/30"
              onClick={() => setInterstitialVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <BannerPastilla banner={currentBanner} className="w-full" />
          {activeBanners.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-white hover:bg-white/20" onClick={goToPrev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                  onClick={() => {}}
                />
              ))}
              <Button variant="ghost" size="icon" className="w-8 h-8 text-white hover:bg-white/20" onClick={goToNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sticky bottom: fixed position at bottom
  if (position === 'sticky-bottom') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-2">
        <div className="relative w-full" style={{ maxWidth: `${currentBanner.width}px` }}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
            onClick={() => setClosed(true)}
          >
            <X className="w-3 h-3" />
          </Button>
          <BannerPastilla banner={currentBanner} className="w-full" />
          {activeBanners.length > 1 && (
            <div className="flex items-center justify-center gap-1 mt-1">
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-3' : 'bg-muted-foreground/40'}`}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Floating left/right: fixed on sides
  if (position === 'floating-left' || position === 'floating-right') {
    const isLeft = position === 'floating-left';
    return (
      <div
        className={`fixed z-40 ${isLeft ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2`}
        style={{ maxWidth: `${currentBanner.width}px` }}
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 w-5 h-5 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
            onClick={() => setClosed(true)}
          >
            <X className="w-3 h-3" />
          </Button>
          <BannerPastilla
            banner={currentBanner}
            className="w-full"
            style={{ width: `${currentBanner.width}px` }}
          />
          {activeBanners.length > 1 && (
            <div className="flex flex-col items-center gap-1 mt-2">
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToPrev}>
                <ChevronUp className="w-3 h-3" />
              </Button>
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-2.5 h-2.5' : 'bg-muted-foreground/40'}`}
                  onClick={() => {}}
                />
              ))}
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToNext}>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Navbar-below: full-width strip
  if (position === 'navbar-below') {
    return (
      <div className="w-full">
        <BannerPastilla
          banner={currentBanner}
          className="w-full"
          style={{ maxWidth: '100%', aspectRatio: `${currentBanner.width}/${currentBanner.height}` }}
        />
        {activeBanners.length > 1 && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToPrev}>
              <ChevronLeft className="w-3 h-3" />
            </Button>
            {activeBanners.map((_, i) => (
              <button
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-3' : 'bg-muted-foreground/40'}`}
                onClick={() => {}}
              />
            ))}
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToNext}>
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Between-matches: inline between match cards
  if (position === 'between-matches') {
    return (
      <div className="w-full my-2">
        <BannerPastilla
          banner={currentBanner}
          className="w-full"
          style={{ maxWidth: '100%' }}
        />
      </div>
    );
  }

  // Hero, sidebar, footer, content-top, content-bottom: carousel/rotation style
  if (position === 'sidebar') {
    return (
      <div className="space-y-3">
        {activeBanners.length > 1 ? (
          <div className="relative">
            <BannerPastilla banner={currentBanner} className="w-full" />
            <div className="flex items-center justify-center gap-1 mt-2">
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToPrev}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              {activeBanners.map((_, i) => (
                <button
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-3' : 'bg-muted-foreground/40'}`}
                  onClick={() => {}}
                />
              ))}
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToNext}>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ) : (
          <BannerPastilla banner={currentBanner} className="w-full" />
        )}
      </div>
    );
  }

  // hero, footer, content-top, content-bottom
  return (
    <div className="w-full">
      {activeBanners.length > 1 ? (
        <div className="relative">
          <BannerPastilla
            banner={currentBanner}
            className="w-full"
          />
          <div className="flex items-center justify-center gap-1 mt-2">
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToPrev}>
              <ChevronLeft className="w-3 h-3" />
            </Button>
            {activeBanners.map((_, i) => (
              <button
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-foreground w-3' : 'bg-muted-foreground/40'}`}
                onClick={() => {}}
              />
            ))}
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={goToNext}>
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <BannerPastilla banner={currentBanner} className="w-full" />
      )}
    </div>
  );
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m18 15-6-6-6 6"/>
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
