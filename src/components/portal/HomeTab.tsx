'use client';

import { useState } from 'react';
import { getTeamById, getTeamFlagUrl, type NewsItem } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { usePortalData } from '@/lib/portal-data-context';
import LiveMatch from './LiveMatch';
import MatchCard from './MatchCard';
import MatchSlider from './MatchSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Trophy,
  CircleDot,
  Flag,
  BarChart3,
  Users,
  Star,
  Newspaper,
  Radio,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  User,
  Globe,
  Tag,
} from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

// ===================== NEWS LIGHTBOX / GALLERY VIEWER =====================
function NewsGalleryViewer({
  newsItem,
  open,
  onClose,
}: {
  newsItem: NewsItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!newsItem || !open) return null;

  const allImages: { src: string; caption: string }[] = [];

  // Add cover image first
  const coverImage = newsItem.imageDataUrl || newsItem.imageUrl;
  if (coverImage) {
    allImages.push({ src: coverImage, caption: 'Portada' });
  }

  // Add gallery images
  if (newsItem.gallery && newsItem.gallery.length > 0) {
    newsItem.gallery
      .sort((a, b) => a.order - b.order)
      .forEach(img => {
        const src = img.dataUrl || img.url;
        if (src) allImages.push({ src, caption: img.caption || '' });
      });
  }

  const goNext = () => setCurrentIdx(prev => (prev + 1) % allImages.length);
  const goPrev = () => setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{newsItem.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Image viewer */}
          {allImages.length > 0 ? (
            <div className="relative bg-black flex-1 min-h-[300px] max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[currentIdx]?.src}
                alt={allImages[currentIdx]?.caption || newsItem.title}
                className="w-full h-full object-contain"
              />

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {currentIdx + 1} / {allImages.length}
              </div>

              {/* Caption */}
              {allImages[currentIdx]?.caption && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-1.5 rounded-lg max-w-[80%] text-center">
                  {allImages[currentIdx].caption}
                </div>
              )}

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-6 rounded overflow-hidden border-2 transition-all ${
                        idx === currentIdx ? 'border-nd-orange scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-muted/30 flex-1 min-h-[200px] flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* News details */}
          <div className="p-4 bg-card space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs bg-nd-orange-light text-nd-green-dark">
                {newsItem.category}
              </Badge>
              {newsItem.featured && (
                <Badge className="text-xs bg-yellow-100 text-yellow-700">
                  <Star className="w-3 h-3 mr-0.5" /> Destacada
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{newsItem.date}</span>
              {newsItem.author && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <User className="w-3 h-3" /> {newsItem.author}
                </span>
              )}
              {newsItem.source && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Globe className="w-3 h-3" /> {newsItem.source}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-foreground leading-tight">{newsItem.title}</h3>
            <p className="text-sm text-muted-foreground">{newsItem.summary}</p>

            {newsItem.content && (
              <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line border-t pt-3">
                {newsItem.content}
              </div>
            )}

            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {newsItem.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                    <Tag className="w-2.5 h-2.5 mr-0.5" /> #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {allImages.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Images className="w-3.5 h-3.5" />
                <span>{allImages.length} fotos en la galeria</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  const { allMatches, goalEvents, connected } = useRealtime();
  const { slides, news } = usePortalData();

  // Gallery viewer state
  const [galleryNews, setGalleryNews] = useState<NewsItem | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const openGallery = (item: NewsItem) => {
    setGalleryNews(item);
    setGalleryOpen(true);
  };

  const liveMatches = allMatches.filter((m) => m.status === 'live');
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming').slice(0, 3);

  const quickLinks = [
    { id: 'grupos', label: 'Grupos', icon: Flag, color: 'bg-nd-green', hoverColor: 'hover:bg-nd-green-dark', ring: 'ring-nd-green/40', shadow: 'shadow-nd-green/20' },
    { id: 'resultados', label: 'Resultados', icon: CircleDot, color: 'bg-[#0077CC]', hoverColor: 'hover:bg-[#005fa3]', ring: 'ring-[#0077CC]/40', shadow: 'shadow-[#0077CC]/20' },
    { id: 'goleadores', label: 'Goleadores', icon: Trophy, color: 'bg-nd-orange', hoverColor: 'hover:bg-nd-orange-dark', ring: 'ring-nd-orange/40', shadow: 'shadow-nd-orange/20' },
    { id: 'votacion', label: 'Votación', icon: Star, color: 'bg-[#CC5300]', hoverColor: 'hover:bg-[#a84200]', ring: 'ring-[#CC5300]/40', shadow: 'shadow-[#CC5300]/20' },
    { id: 'expulsados', label: 'Expulsados', icon: Users, color: 'bg-red-600', hoverColor: 'hover:bg-red-700', ring: 'ring-red-600/40', shadow: 'shadow-red-600/20' },
    { id: 'sintesis', label: 'Síntesis', icon: BarChart3, color: 'bg-nd-green', hoverColor: 'hover:bg-nd-green-dark', ring: 'ring-nd-green/40', shadow: 'shadow-nd-green/20' },
  ];

  // Map news keyword to team for flag image
  const newsTeamMap: Record<string, string> = {
    messi: 'arg', yamal: 'esp', haaland: 'nor', mexico: 'mex', spain: 'esp', ronaldo: 'por', usa: 'usa',
  };

  // Map news category to gradient colors — updated to blue tones
  const newsGradientMap: Record<string, string> = {
    'En Vivo': 'from-red-500/30 to-nd-orange/20',
    'Especial': 'from-nd-orange/30 to-yellow-400/20',
    'Análisis': 'from-nd-green/30 to-nd-green-light/20',
    'Resultados': 'from-blue-500/30 to-nd-green/20',
    'Clasificación': 'from-nd-green-dark/30 to-nd-orange/20',
  };

  return (
    <div className="relative space-y-8 animate-fade-in">
      {/* Match Slider - Nexo Digital branding */}
      <MatchSlider slides={slides} onNavigate={onNavigate} />

      {/* Live Matches with Real-time indicator */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
            <h2 className="text-xl font-bold text-foreground">Partidos en Vivo</h2>
            {connected && (
              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Tiempo Real
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Los goles y minutos se actualizan automáticamente en tu pantalla — sin recargar la página
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <LiveMatch key={match.id} match={match} />
            ))}
          </div>

          {/* Recent goal events ticker */}
          {goalEvents.length > 0 && (
            <div className="mt-4 bg-nd-orange/5 border border-nd-orange/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-nd-orange" />
                <span className="text-xs font-bold text-nd-orange uppercase tracking-wider">Últimos Goles</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {goalEvents.slice(0, 5).map((evt) => {
                  const team = getTeamById(evt.team);
                  return (
                    <Badge key={evt.id} variant="secondary" className="text-xs bg-white border border-nd-orange/30">
                      ⚽ {evt.player} ({team?.flag} {team?.name}) {evt.minute}&apos;
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* No live matches message */}
      {liveMatches.length === 0 && (
        <section className="bg-muted/50 rounded-xl p-6 text-center">
          <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground font-medium">No hay partidos en vivo en este momento</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Las actualizaciones aparecerán aquí automáticamente cuando comience el próximo partido</p>
        </section>
      )}

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-nd-green" />
          Próximos Partidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* News */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-nd-green" />
          Noticias Destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {news
            .filter(n => n.active !== false)
            .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
            .map((item) => {
            const customImage = item.imageDataUrl || item.imageUrl || '';
            const galleryImages = item.gallery || [];
            const teamId = newsTeamMap[item.imageKeyword];
            const team = teamId ? getTeamById(teamId) : null;
            const flagUrl = teamId ? getTeamFlagUrl(teamId, 320) : null;
            const gradient = newsGradientMap[item.category] || 'from-nd-green/20 to-nd-orange/10';
            const hasGallery = galleryImages.length > 0;
            const totalImages = (customImage ? 1 : 0) + galleryImages.length;

            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-nd-green/20"
                onClick={() => openGallery(item)}
              >
                <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
                  {customImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={customImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : hasGallery && galleryImages[0] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={galleryImages[0].dataUrl || galleryImages[0].url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : flagUrl ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={flagUrl}
                        alt={team?.name || item.imageKeyword}
                        className="w-20 h-14 object-cover rounded-md shadow-lg group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute -bottom-1 -right-1 text-xl">{team?.flag}</div>
                    </div>
                  ) : (
                    <span className="text-4xl group-hover:scale-110 transition-transform">⚽</span>
                  )}

                  {/* Featured badge */}
                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500 text-white border-0 text-[9px] px-1.5 py-0">
                        <Star className="w-2.5 h-2.5 mr-0.5" /> Destacada
                      </Badge>
                    </div>
                  )}

                  {/* Gallery indicator */}
                  {hasGallery && (
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/60 text-white border-0 text-[9px] px-1.5 py-0">
                        <Images className="w-2.5 h-2.5 mr-0.5" /> {totalImages}
                      </Badge>
                    </div>
                  )}

                  {/* Gallery thumbnails strip */}
                  {hasGallery && galleryImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 flex gap-1 overflow-hidden">
                      {galleryImages.slice(0, 4).map((img, i) => (
                        <div key={img.id} className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 border border-white/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {galleryImages.length > 4 && (
                        <span className="text-white text-[8px] self-center">+{galleryImages.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="w-fit text-xs bg-nd-orange-light text-nd-green-dark">
                      {item.category}
                    </Badge>
                    {item.author && (
                      <span className="text-[9px] text-muted-foreground">Por {item.author}</span>
                    )}
                  </div>
                  <CardTitle className="text-sm leading-snug line-clamp-2 group-hover:text-nd-green transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground">{item.date}</p>
                    {item.source && (
                      <span className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                        <Globe className="w-2.5 h-2.5" /> {item.source}
                      </span>
                    )}
                  </div>
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-[8px] px-1 py-0">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 ${link.ring} hover:shadow-lg ${link.shadow} hover:-translate-y-0.5 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-full ${link.color} ${link.hoverColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md ${link.shadow} ring-2 ring-white/30`}>
                <link.icon className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="text-sm font-bold text-foreground">{link.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* News Gallery Viewer Dialog */}
      <NewsGalleryViewer
        newsItem={galleryNews}
        open={galleryOpen}
        onClose={() => { setGalleryOpen(false); setGalleryNews(null); }}
      />
    </div>
  );
}
