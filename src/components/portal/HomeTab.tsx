'use client';

import { matches, news, getTeamById } from '@/lib/mock-data';
import LiveMatch from './LiveMatch';
import MatchCard from './MatchCard';
import BannerDisplay from './BannerDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Trophy,
  CircleDot,
  Flag,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Newspaper,
  Radio,
} from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming').slice(0, 3);

  const quickLinks = [
    { id: 'grupos', label: 'Grupos', icon: Flag, color: 'bg-nd-green' },
    { id: 'resultados', label: 'Resultados', icon: CircleDot, color: 'bg-nd-green-dark' },
    { id: 'goleadores', label: 'Goleadores', icon: Trophy, color: 'bg-nd-orange text-nd-black' },
    { id: 'votacion', label: 'Votación', icon: Star, color: 'bg-nd-orange-dark' },
    { id: 'expulsados', label: 'Expulsados', icon: Users, color: 'bg-red-500' },
    { id: 'sintesis', label: 'Síntesis', icon: BarChart3, color: 'bg-nd-green' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner - Nuevo Día branding */}
      <section className="relative bg-gradient-to-br from-nd-green via-nd-green-dark to-nd-green rounded-2xl overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-nd-orange blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-nd-orange blur-3xl" />
        </div>
        <div className="relative px-6 sm:px-10 py-8 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-nd-orange text-nd-black border-0 font-bold text-xs">
                  📻 100.9 FM
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  ⚽ Mundial 2026 — 12 Grupos
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-2 tracking-tight">
                Nuevo Día <span className="text-nd-orange">Mundial</span>
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-6 max-w-xl">
                Sigue en vivo todos los partidos, resultados y estadísticas del torneo más importante del mundo. 48 selecciones, 12 grupos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => onNavigate('grupos')}
                  className="bg-nd-orange text-nd-black hover:bg-nd-orange-dark font-bold"
                >
                  Ver Grupos <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('resultados')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Resultados
                </Button>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-center gap-2">
              <Image src="/logo-nuevo-dia.png" alt="Radio Nuevo Día" width={120} height={120} className="rounded-xl shadow-lg opacity-90 object-contain" />
              <span className="text-[10px] text-white/60 font-semibold tracking-wider">EL DIARIO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content-top Banner */}
      <BannerDisplay position="content-top" />

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
            <h2 className="text-xl font-bold text-foreground">Partidos en Vivo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <LiveMatch key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Hero Banner Ad */}
      <BannerDisplay position="hero" />

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
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border-nd-green/20">
              <div className="h-32 bg-gradient-to-br from-nd-green/20 to-nd-orange/10 flex items-center justify-center">
                <span className="text-4xl group-hover:scale-110 transition-transform">⚽</span>
              </div>
              <CardHeader className="pb-2">
                <Badge variant="secondary" className="w-fit text-xs bg-nd-orange-light text-nd-green-dark">
                  {item.category}
                </Badge>
                <CardTitle className="text-sm leading-snug line-clamp-2 group-hover:text-nd-green transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Content-bottom Banner */}
      <BannerDisplay position="content-bottom" />

      {/* Quick Access */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-nd-green/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
