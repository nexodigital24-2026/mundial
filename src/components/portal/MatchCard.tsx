'use client';

import { useEffect, useState, useRef } from 'react';
import { Match, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Timer, Wifi } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match: initialMatch }: MatchCardProps) {
  const { allMatches, connected } = useRealtime();

  // Find the latest version of this match from real-time state
  const match = allMatches.find(m => m.id === initialMatch.id) || initialMatch;

  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  const [goalFlash, setGoalFlash] = useState(false);
  const prevHomeScore = useRef(match.homeScore);
  const prevAwayScore = useRef(match.awayScore);

  // Detect goal changes
  useEffect(() => {
    const homeChanged = match.homeScore !== prevHomeScore.current;
    const awayChanged = match.awayScore !== prevAwayScore.current;

    if ((homeChanged || awayChanged) && prevHomeScore.current !== null && prevAwayScore.current !== null) {
      if (
        (match.homeScore !== null && prevHomeScore.current !== null && match.homeScore > prevHomeScore.current) ||
        (match.awayScore !== null && prevAwayScore.current !== null && match.awayScore > prevAwayScore.current)
      ) {
        setGoalFlash(true);
        setTimeout(() => setGoalFlash(false), 2500);
      }
    }
    prevHomeScore.current = match.homeScore;
    prevAwayScore.current = match.awayScore;
  }, [match.homeScore, match.awayScore]);

  const displayMinute = match.minute
    ? (match.minute >= 45 && match.minute <= 48 ? `${match.minute}+'` :
       match.minute >= 90 ? '90+' :
       `${match.minute}'`)
    : '';

  return (
    <div className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden relative ${
      goalFlash ? 'border-nd-orange shadow-nd-orange/20' : 'border-border'
    }`}>
      {/* Goal flash overlay */}
      {goalFlash && (
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/20 to-transparent z-10 pointer-events-none" />
      )}

      {/* Status bar */}
      <div className={`px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
        isLive ? 'bg-red-50 text-red-700' :
        isCompleted ? 'bg-green-50 text-green-700' :
        'bg-nd-orange-light text-nd-orange-dark'
      }`}>
        <span className="flex items-center gap-1.5">
          {isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse-live" />}
          {isLive ? 'En Vivo' : isCompleted ? 'Finalizado' : 'Próximo'}
        </span>
        {isLive && (
          <span className="flex items-center gap-1">
            {connected && <Wifi className="w-3 h-3 opacity-70" />}
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">{displayMinute}</span>
          </span>
        )}
      </div>

      {/* Match content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className={`flex-1 flex items-center gap-2 justify-end transition-transform duration-300 ${goalFlash ? 'scale-[1.02]' : ''}`}>
            <span className="font-semibold text-sm text-foreground text-right">{home?.name}</span>
            {(() => {
              const flagUrl = home ? getTeamFlagUrl(home.id, 80) : '';
              const code = home ? getTeamCode(home.id).toUpperCase() : '';
              const color = home ? getTeamColor(home.id) : '#666';
              const textColor = getContrastTextColor(color);
              return (
                <div
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
                  style={{ backgroundColor: color }}
                >
                  {flagUrl ? (
                    <img src={flagUrl} alt={home?.name} className="w-4 h-3 object-cover rounded-sm" />
                  ) : (
                    <span className="text-sm">{home?.flag}</span>
                  )}
                  <span className="text-[8px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                </div>
              );
            })()}
          </div>

          {/* Score / Time */}
          <div className="flex-shrink-0 px-3">
            {(isCompleted || isLive) ? (
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold transition-all duration-300 ${
                  goalFlash ? 'text-nd-orange scale-110' : 'text-foreground'
                }`}>
                  {match.homeScore ?? '-'}
                </span>
                <span className="text-sm text-muted-foreground">-</span>
                <span className={`text-xl font-bold transition-all duration-300 ${
                  goalFlash ? 'text-nd-orange scale-110' : 'text-foreground'
                }`}>
                  {match.awayScore ?? '-'}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-sm font-semibold text-primary">{match.time}</span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className={`flex-1 flex items-center gap-2 transition-transform duration-300 ${goalFlash ? 'scale-[1.02]' : ''}`}>
            {(() => {
              const flagUrl = away ? getTeamFlagUrl(away.id, 80) : '';
              const code = away ? getTeamCode(away.id).toUpperCase() : '';
              const color = away ? getTeamColor(away.id) : '#666';
              const textColor = getContrastTextColor(color);
              return (
                <div
                  className="flex items-center gap-1 rounded-md px-1.5 py-0.5"
                  style={{ backgroundColor: color }}
                >
                  {flagUrl ? (
                    <img src={flagUrl} alt={away?.name} className="w-4 h-3 object-cover rounded-sm" />
                  ) : (
                    <span className="text-sm">{away?.flag}</span>
                  )}
                  <span className="text-[8px] font-extrabold tracking-wider" style={{ color: textColor }}>{code}</span>
                </div>
              );
            })()}
            <span className="font-semibold text-sm text-foreground">{away?.name}</span>
          </div>
        </div>

        {/* Live mini possession bar */}
        {isLive && match.possession && (
          <div className="mt-3 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <span className="font-semibold text-nd-green">{match.possession.home}%</span>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-nd-green rounded-full transition-all duration-1000"
                  style={{ width: `${match.possession.home}%` }}
                />
              </div>
              <span className="font-semibold text-nd-orange">{match.possession.away}%</span>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{match.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{match.venue}</span>
          </div>
          {isCompleted && match.standoutPlayer && (
            <Badge variant="secondary" className="text-xs">
              ⭐ {match.standoutPlayer}
            </Badge>
          )}
        </div>

        {/* Scorers for completed/live */}
        {(isCompleted || isLive) && match.scorers && match.scorers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {match.scorers.map((s, i) => (
              <Badge key={`${s.player}-${s.minute}-${i}`} variant="outline" className="text-[10px] py-0">
                ⚽ {s.player} {s.minute}&apos;
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
