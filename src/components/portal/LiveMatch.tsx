'use client';

import { useEffect, useState, useRef } from 'react';
import { Match, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { Badge } from '@/components/ui/badge';
import { Timer, Wifi, Radio } from 'lucide-react';

interface LiveMatchProps {
  match: Match;
}

export default function LiveMatch({ match: initialMatch }: LiveMatchProps) {
  const { allMatches, goalEvents, connected } = useRealtime();

  // Find the latest version of this match from real-time state
  const match = allMatches.find(m => m.id === initialMatch.id) || initialMatch;

  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  const [goalFlash, setGoalFlash] = useState<'home' | 'away' | null>(null);
  const [latestGoal, setLatestGoal] = useState<string | null>(null);
  const prevHomeScore = useRef(match.homeScore);
  const prevAwayScore = useRef(match.awayScore);

  // Detect goal changes and flash
  useEffect(() => {
    if (match.homeScore !== prevHomeScore.current && match.homeScore !== null && prevHomeScore.current !== null) {
      if (match.homeScore > prevHomeScore.current) {
        setGoalFlash('home');
        const goalEvt = goalEvents.find(ge => ge.matchId === match.id);
        if (goalEvt) {
          setLatestGoal(`⚽ ¡GOL! ${goalEvt.player} (${home?.name}) ${goalEvt.minute}'`);
        }
        setTimeout(() => setGoalFlash(null), 3000);
        setTimeout(() => setLatestGoal(null), 6000);
      }
    }
    prevHomeScore.current = match.homeScore;
  }, [match.homeScore, match.id, goalEvents, home?.name]);

  useEffect(() => {
    if (match.awayScore !== prevAwayScore.current && match.awayScore !== null && prevAwayScore.current !== null) {
      if (match.awayScore > prevAwayScore.current) {
        setGoalFlash('away');
        const goalEvt = goalEvents.find(ge => ge.matchId === match.id);
        if (goalEvt) {
          setLatestGoal(`⚽ ¡GOL! ${goalEvt.player} (${away?.name}) ${goalEvt.minute}'`);
        }
        setTimeout(() => setGoalFlash(null), 3000);
        setTimeout(() => setLatestGoal(null), 6000);
      }
    }
    prevAwayScore.current = match.awayScore;
  }, [match.awayScore, match.id, goalEvents, away?.name]);

  const isMatchLive = match.status === 'live';
  const minute = match.minute || 0;
  const displayMinute = minute >= 45 && minute <= 48 ? `${minute}+` :
                        minute >= 90 ? '90+' :
                        `${minute}'`;

  return (
    <div className={`bg-white rounded-xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden relative ${
      isMatchLive ? 'border-red-500/40' : 'border-blue-500/40'
    }`}>
      {/* Goal flash overlay */}
      {goalFlash && (
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/30 to-transparent z-10 pointer-events-none animate-fade-in" />
      )}

      {/* Live header */}
      <div className={`px-4 py-2 flex items-center justify-between ${
        isMatchLive ? 'bg-red-600 text-white' : 'bg-nd-green text-white'
      }`}>
        <div className="flex items-center gap-2">
          {isMatchLive ? (
            <>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-live" />
              <span className="font-bold text-sm uppercase tracking-wider">En Vivo</span>
            </>
          ) : (
            <>
              <span className="font-bold text-sm uppercase tracking-wider">Finalizado</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {connected && (
            <Wifi className="w-3 h-3 opacity-70" />
          )}
          {isMatchLive && (
            <div className="flex items-center gap-1.5 text-sm">
              <Timer className="w-4 h-4" />
              <span className="font-semibold font-mono">{displayMinute}</span>
            </div>
          )}
        </div>
      </div>

      {/* Goal notification banner */}
      {latestGoal && (
        <div className="bg-nd-orange text-nd-black px-4 py-2 text-center font-bold text-sm animate-fade-in">
          {latestGoal}
        </div>
      )}

      {/* Match content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className={`flex-1 text-center transition-all duration-300 ${goalFlash === 'home' ? 'scale-105' : ''}`}>
            {(() => {
              const flagUrl = home ? getTeamFlagUrl(home.id, 160) : '';
              const code = home ? getTeamCode(home.id).toUpperCase() : '';
              const color = home ? getTeamColor(home.id) : '#666';
              const textColor = getContrastTextColor(color);
              return (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1"
                    style={{ backgroundColor: color }}
                  >
                    {flagUrl ? (
                      <img src={flagUrl} alt={home?.name} className="w-6 h-4 object-cover rounded-sm" />
                    ) : (
                      <span className="text-2xl">{home?.flag}</span>
                    )}
                    <span className="text-[10px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                  </div>
                </div>
              );
            })()}
            <p className="font-semibold text-sm sm:text-base mt-1 text-foreground">{home?.name}</p>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`text-3xl sm:text-4xl font-bold transition-all duration-300 ${
              goalFlash === 'home' ? 'text-nd-orange scale-110' : 'text-foreground'
            }`}>
              {match.homeScore ?? '-'}
            </span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className={`text-3xl sm:text-4xl font-bold transition-all duration-300 ${
              goalFlash === 'away' ? 'text-nd-orange scale-110' : 'text-foreground'
            }`}>
              {match.awayScore ?? '-'}
            </span>
          </div>

          {/* Away team */}
          <div className={`flex-1 text-center transition-all duration-300 ${goalFlash === 'away' ? 'scale-105' : ''}`}>
            {(() => {
              const flagUrl = away ? getTeamFlagUrl(away.id, 160) : '';
              const code = away ? getTeamCode(away.id).toUpperCase() : '';
              const color = away ? getTeamColor(away.id) : '#666';
              const textColor = getContrastTextColor(color);
              return (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1"
                    style={{ backgroundColor: color }}
                  >
                    {flagUrl ? (
                      <img src={flagUrl} alt={away?.name} className="w-6 h-4 object-cover rounded-sm" />
                    ) : (
                      <span className="text-2xl">{away?.flag}</span>
                    )}
                    <span className="text-[10px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                  </div>
                </div>
              );
            })()}
            <p className="font-semibold text-sm sm:text-base mt-1 text-foreground">{away?.name}</p>
          </div>
        </div>

        {/* Scorers */}
        {match.scorers && match.scorers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {match.scorers.map((s, i) => (
                <Badge key={`${s.player}-${s.minute}-${i}`} variant="secondary" className="text-xs">
                  ⚽ {s.player} {s.minute}&apos;
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Live stats mini-bar */}
        {isMatchLive && match.possession && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-semibold text-nd-green">{match.possession.home}%</span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-nd-green rounded-full transition-all duration-1000"
                  style={{ width: `${match.possession.home}%` }}
                />
              </div>
              <span className="font-semibold text-nd-orange">{match.possession.away}%</span>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              <span>Tiros: {match.shots?.home ?? 0}</span>
              <span>Posesión</span>
              <span>Tiros: {match.shots?.away ?? 0}</span>
            </div>
          </div>
        )}

        {/* Venue */}
        <p className="text-xs text-muted-foreground text-center mt-2">{match.venue}</p>
      </div>
    </div>
  );
}
