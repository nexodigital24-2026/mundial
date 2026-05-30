'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { type SliderSlide, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flag,
} from 'lucide-react';

interface MatchSliderProps {
  slides: SliderSlide[];
  onNavigate: (tab: string) => void;
}

export default function MatchSlider({ slides, onNavigate }: MatchSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_CYCLES = 4; // 4 full passes then stop auto-rotation

  const activeSlides = slides.filter(s => s.active).sort((a, b) => a.order - b.order);
  const activeSlidesCount = activeSlides.length;
  const currentSlide = activeSlides[currentIndex];

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % activeSlidesCount;
    if (nextIndex === 0) {
      setCycleCount(prev => {
        if (prev + 1 >= MAX_CYCLES) {
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return prev + 1;
      });
    }
    goToSlide(nextIndex);
  }, [currentIndex, activeSlidesCount, goToSlide]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + activeSlidesCount) % activeSlidesCount;
    goToSlide(prevIndex);
  }, [currentIndex, activeSlidesCount, goToSlide]);

  useEffect(() => {
    if (activeSlidesCount <= 1 || cycleCount >= MAX_CYCLES) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(goNext, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, activeSlidesCount, goNext, cycleCount]);

  if (activeSlides.length === 0 || !currentSlide) return null;

  const homeTeam = currentSlide.homeTeamId ? getTeamById(currentSlide.homeTeamId) : null;
  const awayTeam = currentSlide.awayTeamId ? getTeamById(currentSlide.awayTeamId) : null;
  const isLive = currentSlide.category === 'En Vivo';
  const isUpcoming = currentSlide.category === 'Próximo';

  // Resolve image: prefer uploaded imageDataUrl, then imageUrl, then fallback to bgColor
  const slideImage = currentSlide.imageDataUrl || currentSlide.imageUrl || '';
  const hasImage = slideImage.length > 0 && !imgErrors[currentSlide.id];

  return (
    <section className="relative rounded-2xl overflow-hidden text-white shadow-xl min-h-[320px] sm:min-h-[380px]">
      <div className="transition-all duration-500 ease-in-out relative min-h-[320px] sm:min-h-[380px]">
        {/* Background image or gradient */}
        {hasImage ? (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slideImage}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(prev => ({ ...prev, [currentSlide.id]: true }))}
            />
            {/* Overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
            {/* Bottom gradient fade */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div
            style={{
              background: `linear-gradient(135deg, ${currentSlide.bgColor} 0%, ${currentSlide.bgColor}dd 40%, ${currentSlide.bgColor}99 100%)`,
            }}
            className="absolute inset-0"
          />
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-nd-orange blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-nd-orange blur-2xl" />
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 36px)',
        }} />

        <div className="relative px-5 sm:px-10 py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Left: Content */}
            <div className={`flex-1 max-w-3xl transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {/* Top tags */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge className="bg-nd-orange text-nd-black border-0 font-bold text-xs">
                  🌐 Nexo Digital
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  ⚽ Mundial 2026 — 12 Grupos
                </Badge>
                {isLive && (
                  <Badge className="bg-red-500 text-white border-0 text-xs flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    En Vivo
                  </Badge>
                )}
                {!isLive && !isUpcoming && (
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {currentSlide.category}
                  </Badge>
                )}
                {isUpcoming && (
                  <Badge className="bg-nd-orange/80 text-white border-0 text-xs flex items-center gap-1">
                    <Flag className="w-3 h-3" />
                    Próximo
                  </Badge>
                )}
              </div>

              {/* Main title */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1 tracking-tight">
                Nexo Digital <span className="text-nd-orange">Mundial</span>
              </h2>

              {/* Slide title & subtitle */}
              <h3 className="text-lg sm:text-2xl font-bold mb-1 text-white/90">
                {currentSlide.title}
              </h3>
              <p className="text-sm sm:text-base text-white/70 mb-4 max-w-xl">
                {currentSlide.subtitle}
              </p>

              {/* Match score display */}
              {(homeTeam && awayTeam) && (
                <div className="flex items-center gap-3 sm:gap-5 mb-5">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const flagUrl = getTeamFlagUrl(homeTeam.id, 160);
                      const code = getTeamCode(homeTeam.id).toUpperCase();
                      const color = getTeamColor(homeTeam.id);
                      const textColor = getContrastTextColor(color);
                      return (
                        <div className="flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ backgroundColor: color }}>
                          {flagUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={flagUrl} alt={homeTeam.name} className="w-6 h-4 object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span className="text-2xl">{homeTeam.flag}</span>
                          )}
                          <span className="text-[10px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                        </div>
                      );
                    })()}
                    <div>
                      <p className="font-bold text-sm sm:text-base">{homeTeam.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-4xl font-extrabold">
                      {currentSlide.homeScore ?? '-'}
                    </span>
                    <span className="text-lg sm:text-2xl text-white/50">:</span>
                    <span className="text-2xl sm:text-4xl font-extrabold">
                      {currentSlide.awayScore ?? '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-bold text-sm sm:text-base text-right">{awayTeam.name}</p>
                    </div>
                    {(() => {
                      const flagUrl = getTeamFlagUrl(awayTeam.id, 160);
                      const code = getTeamCode(awayTeam.id).toUpperCase();
                      const color = getTeamColor(awayTeam.id);
                      const textColor = getContrastTextColor(color);
                      return (
                        <div className="flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ backgroundColor: color }}>
                          {flagUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={flagUrl} alt={awayTeam.name} className="w-6 h-4 object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span className="text-2xl">{awayTeam.flag}</span>
                          )}
                          <span className="text-[10px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                {currentSlide.linkTo && (
                  <Button
                    onClick={() => onNavigate(currentSlide.linkTo)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30"
                  >
                    {isLive ? 'Ver En Vivo' : isUpcoming ? 'Ver Grupos' : 'Resultados'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
                <Button
                  onClick={() => onNavigate('grupos')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30"
                >
                  Ver Grupos
                </Button>
              </div>
            </div>

            {/* Right: Brand text */}
            <div className="hidden sm:flex flex-col items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex flex-col items-center">
                <span className="text-white font-extrabold text-xl tracking-tight">Nexo Digital</span>
                <span className="text-nd-orange font-extrabold text-xl tracking-tight">Mundial</span>
              </div>
              <span className="text-[10px] text-white/60 font-semibold tracking-wider">NEXO DIGITAL</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {activeSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => { goToSlide(i); setCycleCount(0); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'bg-nd-orange w-8'
                      : 'bg-white/40 hover:bg-white/60 w-2'
                  }`}
                  aria-label={`Ir a slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => { goPrev(); setCycleCount(0); }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => { goNext(); setCycleCount(0); }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
