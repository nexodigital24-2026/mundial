'use client';

import { useState } from 'react';
import { getTeamById } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Zap } from 'lucide-react';

export default function ResultsTab() {
  const { allMatches, connected } = useRealtime();

  const completedMatches = allMatches.filter((m) => m.status === 'completed');
  const liveMatches = allMatches.filter((m) => m.status === 'live');

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Resultados de Partidos</h2>
        {connected && (
          <Badge className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Tiempo Real
          </Badge>
        )}
      </div>

      {/* Live matches in results */}
      {liveMatches.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-live" />
            <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider">En Vivo Ahora</h3>
          </div>
          <Accordion type="multiple" className="space-y-2">
            {liveMatches.map((match) => {
              const home = getTeamById(match.homeTeamId);
              const away = getTeamById(match.awayTeamId);
              return (
                <AccordionItem
                  key={match.id}
                  value={match.id}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-red-50/50 transition-colors">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="font-semibold text-sm text-foreground">{home?.name}</span>
                        <span className="text-lg">{home?.flag}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3">
                        <span className="text-lg font-bold text-red-600">{match.homeScore}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-lg font-bold text-red-600">{match.awayScore}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{away?.flag}</span>
                        <span className="font-semibold text-sm text-foreground">{away?.name}</span>
                      </div>
                      <Badge className="bg-red-100 text-red-700 text-xs ml-2 font-mono">
                        {match.minute}&apos;
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <MatchDetails match={match} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}

      {/* Completed matches */}
      <Accordion type="multiple" className="space-y-3">
        {completedMatches.map((match) => {
          const home = getTeamById(match.homeTeamId);
          const away = getTeamById(match.awayTeamId);

          return (
            <AccordionItem
              key={match.id}
              value={match.id}
              className="border rounded-xl overflow-hidden bg-card shadow-sm"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="font-semibold text-sm text-foreground">{home?.name}</span>
                    <span className="text-xl">{home?.flag}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-xl font-bold text-primary">{match.homeScore}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-xl font-bold text-primary">{match.awayScore}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xl">{away?.flag}</span>
                    <span className="font-semibold text-sm text-foreground">{away?.name}</span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <MatchDetails match={match} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

function MatchDetails({ match }: { match: ReturnType<typeof useRealtime>['allMatches'][0] }) {
  return (
    <div className="space-y-4 pt-2">
      {/* Synthesis */}
      {match.synthesis && (
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-foreground">{match.synthesis}</p>
        </div>
      )}

      {/* Standout player */}
      {match.standoutPlayer && (
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gold fill-gold" />
          <span className="text-sm font-medium text-foreground">
            Figura del partido: {match.standoutPlayer}
          </span>
        </div>
      )}

      {/* Stats */}
      {match.possession && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Estadísticas</h4>

          {/* Possession */}
          <StatBar
            label="Posesión"
            homeValue={match.possession.home}
            awayValue={match.possession.away}
            suffix="%"
          />

          {/* Shots */}
          {match.shots && (
            <StatBar
              label="Tiros"
              homeValue={match.shots.home}
              awayValue={match.shots.away}
            />
          )}

          {/* Corners */}
          {match.corners && (
            <StatBar
              label="Córners"
              homeValue={match.corners.home}
              awayValue={match.corners.away}
            />
          )}

          {/* Fouls */}
          {match.fouls && (
            <StatBar
              label="Faltas"
              homeValue={match.fouls.home}
              awayValue={match.fouls.away}
            />
          )}
        </div>
      )}

      {/* Scorers */}
      {match.scorers && match.scorers.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Goles</h4>
          <div className="flex flex-wrap gap-1.5">
            {match.scorers.map((s, i) => (
              <Badge key={`${s.player}-${s.minute}-${i}`} variant="secondary" className="text-xs">
                ⚽ {s.player} ({s.minute}&apos;) — {getTeamById(s.team)?.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Match info */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>📅 {match.date}</span>
        <span>🏟️ {match.venue}</span>
      </div>
    </div>
  );
}

function StatBar({
  label,
  homeValue,
  awayValue,
  suffix = '',
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  suffix?: string;
}) {
  const total = homeValue + awayValue;
  const homePercent = total > 0 ? Math.round((homeValue / total) * 100) : 50;

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-semibold text-primary">{homeValue}{suffix}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-primary">{awayValue}{suffix}</span>
      </div>
      <div className="flex gap-1">
        <div className="flex-1">
          <Progress value={homePercent} className="h-2 [&>div]:bg-primary" />
        </div>
        <div className="flex-1">
          <Progress value={100 - homePercent} className="h-2 [&>div]:bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
