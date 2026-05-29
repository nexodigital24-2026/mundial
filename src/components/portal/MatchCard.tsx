'use client';

import { Match, getTeamById } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);

  const isCompleted = match.status === 'completed';
  const isUpcoming = match.status === 'upcoming';

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Status bar */}
      <div className={`px-3 py-1.5 text-xs font-medium ${
        isCompleted ? 'bg-green-50 text-green-700' : 'bg-celeste-light text-celeste-dark'
      }`}>
        {isCompleted ? 'Finalizado' : 'Próximo'}
      </div>

      {/* Match content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className="flex-1 flex items-center gap-2 justify-end">
            <span className="font-semibold text-sm text-foreground text-right">{home?.name}</span>
            <span className="text-xl">{home?.flag}</span>
          </div>

          {/* Score / Time */}
          <div className="flex-shrink-0 px-3">
            {isCompleted ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">{match.homeScore}</span>
                <span className="text-sm text-muted-foreground">-</span>
                <span className="text-xl font-bold text-foreground">{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-sm font-semibold text-primary">{match.time}</span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xl">{away?.flag}</span>
            <span className="font-semibold text-sm text-foreground">{away?.name}</span>
          </div>
        </div>

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

        {/* Scorers for completed */}
        {isCompleted && match.scorers && match.scorers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {match.scorers.map((s, i) => (
              <Badge key={i} variant="outline" className="text-[10px] py-0">
                ⚽ {s.player} {s.minute}&apos;
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
