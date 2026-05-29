'use client';

import { matches, news, getTeamById, sliderSlides } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import LiveMatch from './LiveMatch';
import MatchCard from './MatchCard';
import MatchSlider from './MatchSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Zap,
  RadioTower,
} from 'lucide-react';

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  const { allMatches, goalEvents, connected } = useRealtime();

  const liveMatches = allMatches.filter((m) => m.status === 'live');
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming').slice(0, 3);

  const quickLinks = [
    { id: 'grupos', label: 'Grupos', icon: Flag, color: 'bg-nd-green', hoverColor: 'hover:bg-nd-green-dark' },
    { id: 'resultados', label: 'Resultados', icon: CircleDot, color: 'bg-nd-green-dark', hoverColor: 'hover:bg-[#1a5c1e]' },
    { id: 'goleadores', label: 'Goleadores', icon: Trophy, color: 'bg-nd-orange', hoverColor: 'hover:bg-nd-orange-dark' },
    { id: 'votacion', label: 'Votación', icon: Star, color: 'bg-nd-orange-dark', hoverColor: 'hover:bg-[#d46a00]' },
    { id: 'expulsados', label: 'Expulsados', icon: Users, color: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
    { id: 'sintesis', label: 'Síntesis', icon: BarChart3, color: 'bg-nd-green', hoverColor: 'hover:bg-nd-green-dark' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Match Slider - Nexo Digital branding */}
      <MatchSlider slides={sliderSlides} onNavigate={onNavigate} />

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

      {/* Quick Access */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 border-nd-green/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-full ${link.color} ${link.hoverColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-md`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground">{link.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
