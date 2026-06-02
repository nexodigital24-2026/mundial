'use client';

import { matchSyntheses, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart3,
  Star,
} from 'lucide-react';

export default function SynthesisTab() {
  const { allMatches } = useRealtime();
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 border-b-2 border-nd-orange pb-2">
        <BarChart3 className="w-5 h-5 text-nd-orange" />
        Síntesis de Partidos
      </h2>

      <div className="space-y-6">
        {matchSyntheses.map((synth) => {
          const match = allMatches.find((m) => m.id === synth.matchId);
          if (!match) return null;
          const home = getTeamById(match.homeTeamId);
          const away = getTeamById(match.awayTeamId);

          return (
            <Card key={synth.matchId} className="overflow-hidden shadow-sm">
              {/* Match header */}
              <div className="bg-primary/5 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const hFlagUrl = home ? getTeamFlagUrl(home.id, 80) : '';
                      const hCode = home ? getTeamCode(home.id).toUpperCase() : '';
                      const hColor = home ? getTeamColor(home.id) : '#666';
                      const hTextColor = getContrastTextColor(hColor);
                      return (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ backgroundColor: hColor }}>
                          {hFlagUrl ? <img src={hFlagUrl} alt={home?.name} className="w-4 h-3 object-cover rounded-sm" /> : <span>{home?.flag}</span>}
                          <span className="text-[8px] font-extrabold tracking-wider" style={{ color: hTextColor }}>{hCode}</span>
                        </span>
                      );
                    })()}
                    <span className="font-semibold text-sm">{home?.name}</span>
                    <span className="font-bold text-lg text-primary mx-2">
                      {match.homeScore} - {match.awayScore}
                    </span>
                    {(() => {
                      const aFlagUrl = away ? getTeamFlagUrl(away.id, 80) : '';
                      const aCode = away ? getTeamCode(away.id).toUpperCase() : '';
                      const aColor = away ? getTeamColor(away.id) : '#666';
                      const aTextColor = getContrastTextColor(aColor);
                      return (
                        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ backgroundColor: aColor }}>
                          {aFlagUrl ? <img src={aFlagUrl} alt={away?.name} className="w-4 h-3 object-cover rounded-sm" /> : <span>{away?.flag}</span>}
                          <span className="text-[8px] font-extrabold tracking-wider" style={{ color: aTextColor }}>{aCode}</span>
                        </span>
                      );
                    })()}
                    <span className="font-semibold text-sm">{away?.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Finalizado</Badge>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-5">
                {/* Ratings — orange fill */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold" /> Calificaciones
                  </h4>
                  <div className="space-y-3">
                    {synth.ratings.map((r) => (
                      <div key={r.team}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{r.team}</span>
                          <span className="font-bold text-nd-orange">{r.rating.toFixed(1)}/10</span>
                        </div>
                        <Progress value={r.rating * 10} className="h-2.5 [&>div]:bg-nd-orange" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths — keep green (semantic) */}
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" /> Fortalezas — {synth.strengths.team}
                    </h4>
                    <ul className="space-y-1.5">
                      {synth.strengths.points.map((p, i) => (
                        <li key={i} className="text-xs text-green-700 dark:text-green-300 flex items-start gap-1.5">
                          <span className="mt-0.5">✅</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses — keep red (semantic) */}
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center gap-1">
                      <TrendingDown className="w-4 h-4" /> Debilidades — {synth.weaknesses.team}
                    </h4>
                    <ul className="space-y-1.5">
                      {synth.weaknesses.points.map((p, i) => (
                        <li key={i} className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5">
                          <span className="mt-0.5">❌</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key moments */}
                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1">
                    <Zap className="w-4 h-4" /> Momentos Clave
                  </h4>
                  <ul className="space-y-1.5">
                    {synth.keyMoments.map((moment, i) => (
                      <li key={i} className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                        <span className="mt-0.5">⚡</span>
                        <span>{moment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
