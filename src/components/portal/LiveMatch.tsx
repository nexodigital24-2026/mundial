'use client';

import { Match, getTeamById } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

interface LiveMatchProps {
  match: Match;
}

export default function LiveMatch({ match }: LiveMatchProps) {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  return (
    <div className="bg-white rounded-xl border-2 border-red-500/30 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Live header */}
      <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-live" />
          <span className="font-bold text-sm uppercase tracking-wider">En Vivo</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Timer className="w-4 h-4" />
          <span className="font-semibold">{match.minute}&apos;</span>
        </div>
      </div>

      {/* Match content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className="flex-1 text-center">
            <span className="text-3xl sm:text-4xl">{home?.flag}</span>
            <p className="font-semibold text-sm sm:text-base mt-1 text-foreground">{home?.name}</p>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-foreground">{match.homeScore}</span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className="text-3xl sm:text-4xl font-bold text-foreground">{match.awayScore}</span>
          </div>

          {/* Away team */}
          <div className="flex-1 text-center">
            <span className="text-3xl sm:text-4xl">{away?.flag}</span>
            <p className="font-semibold text-sm sm:text-base mt-1 text-foreground">{away?.name}</p>
          </div>
        </div>

        {/* Scorers */}
        {match.scorers && match.scorers.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {match.scorers.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  ⚽ {s.player} {s.minute}&apos;
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Venue */}
        <p className="text-xs text-muted-foreground text-center mt-2">{match.venue}</p>
      </div>
    </div>
  );
}
