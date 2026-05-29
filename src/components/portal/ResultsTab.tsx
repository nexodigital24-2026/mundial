'use client';

import { useState } from 'react';
import { matches, getTeamById } from '@/lib/mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, Star } from 'lucide-react';

export default function ResultsTab() {
  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">Resultados de Partidos</h2>

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
                          <Badge key={i} variant="secondary" className="text-xs">
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
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
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
