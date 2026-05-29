'use client';

import { Scorer, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor } from '@/lib/mock-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

interface ScorerRowProps {
  scorer: Scorer;
  rank: number;
}

export default function ScorerRow({ scorer, rank }: ScorerRowProps) {
  const team = getTeamById(scorer.teamId);

  const getMedalColor = () => {
    if (rank === 1) return 'bg-gold text-yellow-900';
    if (rank === 2) return 'bg-silver text-gray-700';
    if (rank === 3) return 'bg-bronze text-amber-900';
    return 'bg-muted text-muted-foreground';
  };

  const getRowStyle = () => {
    if (rank === 1) return 'bg-yellow-50 border-l-4 border-l-gold';
    if (rank === 2) return 'bg-gray-50 border-l-4 border-l-silver';
    if (rank === 3) return 'bg-orange-50 border-l-4 border-l-bronze';
    return 'border-l-4 border-l-transparent';
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-4 p-3 rounded-lg ${getRowStyle()} hover:bg-muted/50 transition-colors`}>
      {/* Rank */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${getMedalColor()}`}>
        {rank <= 3 ? <Trophy className="w-4 h-4" /> : rank}
      </div>

      {/* Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {scorer.name.split('.').pop()?.trim()?.substring(0, 2).toUpperCase() ?? '??'}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{scorer.name}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {(() => {
            const flagUrl = team ? getTeamFlagUrl(team.id, 40) : '';
            const code = team ? getTeamCode(team.id).toUpperCase() : '';
            const color = team ? getTeamColor(team.id) : '#666';
            return (
              <span className="inline-flex items-center gap-1 rounded px-1 py-0.5" style={{ backgroundColor: color }}>
                {flagUrl ? (
                  <img src={flagUrl} alt={team?.name} className="w-3.5 h-2.5 object-cover rounded-sm" />
                ) : (
                  <span className="text-xs">{team?.flag}</span>
                )}
                <span className="text-[7px] font-extrabold tracking-wider text-white/80">{code}</span>
              </span>
            );
          })()}
          <span>{team?.name}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{scorer.position}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0 text-center">
        <div>
          <p className="text-lg font-bold text-primary">{scorer.goals}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Goles</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{scorer.assists}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Asist.</p>
        </div>
      </div>
    </div>
  );
}
