'use client';

import { useState, useEffect, useCallback } from 'react';
import { votingMatches, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor, type VotingMatch } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Check, Vote } from 'lucide-react';

interface VotingState {
  [matchId: string]: string;
}

function loadVotesFromStorage(): VotingState {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem('ndm-votes');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return {};
}

function buildLocalVoteData(): VotingMatch[] {
  return votingMatches.map((vm) => ({
    ...vm,
    candidates: vm.candidates.map((c) => ({ ...c })),
  }));
}

export default function VotingTab() {
  const [votes, setVotes] = useState<VotingState>(loadVotesFromStorage);
  const [localVoteData, setLocalVoteData] = useState<VotingMatch[]>(buildLocalVoteData);
  const { allMatches } = useRealtime();

  useEffect(() => {
    localStorage.setItem('ndm-votes', JSON.stringify(votes));
  }, [votes]);

  const handleVote = useCallback((matchId: string, candidateId: string) => {
    setVotes((prev) => {
      if (prev[matchId]) return prev;
      return { ...prev, [matchId]: candidateId };
    });

    setLocalVoteData((prev) =>
      prev.map((vm) =>
        vm.matchId === matchId
          ? {
              ...vm,
              candidates: vm.candidates.map((c) =>
                c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
              ),
            }
          : vm
      )
    );
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 border-b-2 border-nd-orange pb-2">
        <Star className="w-5 h-5 text-nd-orange" />
        Votación — Figura del Partido
      </h2>

      <p className="text-sm text-muted-foreground">
        Elige a la figura del partido para cada encuentro. Tu voto se guarda y no puedes votar más de una vez por partido.
      </p>

      <div className="space-y-6">
        {localVoteData.map((vm) => {
          const match = allMatches.find((m) => m.id === vm.matchId);
          const home = match ? getTeamById(match.homeTeamId) : undefined;
          const away = match ? getTeamById(match.awayTeamId) : undefined;
          const hasVoted = !!votes[vm.matchId];
          const totalVotes = vm.candidates.reduce((sum, c) => sum + c.votes, 0);

          return (
            <Card key={vm.matchId} className="overflow-hidden shadow-sm">
              {/* Match header */}
              <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="text-base flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-2 flex-wrap">
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
                    <span>{home?.name}</span>
                    <span className="text-muted-foreground">vs</span>
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
                    <span>{away?.name}</span>
                  </span>
                  {hasVoted && (
                    <Badge className="bg-nd-orange-light text-nd-orange-dark hover:bg-nd-orange-light text-xs">
                      <Check className="w-3 h-3 mr-1" /> Votado
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4">
                {vm.candidates
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, idx) => {
                    const candidateTeam = getTeamById(candidate.teamId);
                    const votePercent =
                      totalVotes > 0
                        ? Math.round((candidate.votes / totalVotes) * 100)
                        : 0;
                    const isSelected = votes[vm.matchId] === candidate.id;
                    const isLeading = idx === 0;

                    return (
                      <div
                        key={candidate.id}
                        className={`rounded-xl p-3 sm:p-4 transition-all duration-300 ${
                          isSelected
                            ? 'bg-nd-orange/10 border-2 border-nd-orange'
                            : isLeading && hasVoted
                            ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-300 dark:border-yellow-700'
                            : 'bg-muted/30 border border-transparent hover:bg-muted/50 hover:border-nd-orange/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback
                              className={`font-semibold text-sm ${
                                isSelected
                                  ? 'bg-nd-orange text-white'
                                  : 'bg-nd-orange/10 text-nd-orange'
                              }`}
                            >
                              {candidate.name
                                .split('.')
                                .pop()
                                ?.trim()
                                ?.substring(0, 2)
                                .toUpperCase() ?? '??'}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm text-foreground">
                                {candidate.name}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                {(() => {
                                  const cFlagUrl = candidateTeam ? getTeamFlagUrl(candidateTeam.id, 40) : '';
                                  const cCode = candidateTeam ? getTeamCode(candidateTeam.id).toUpperCase() : '';
                                  const cColor = candidateTeam ? getTeamColor(candidateTeam.id) : '#666';
                                  const cTextColor = getContrastTextColor(cColor);
                                  return (
                                    <span className="inline-flex items-center gap-1 rounded px-1 py-0.5" style={{ backgroundColor: cColor }}>
                                      {cFlagUrl ? <img src={cFlagUrl} alt={candidateTeam?.name} className="w-3.5 h-2.5 object-cover rounded-sm" /> : <span>{candidateTeam?.flag}</span>}
                                      <span className="text-[7px] font-extrabold tracking-wider" style={{ color: cTextColor }}>{cCode}</span>
                                    </span>
                                  );
                                })()}
                                <span>{candidateTeam?.name}</span>
                              </span>
                              {isLeading && hasVoted && (
                                <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] py-0">
                                  Líder
                                </Badge>
                              )}
                            </div>

                            {/* Vote bar — orange fill */}
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <Progress
                                  value={votePercent}
                                  className="h-3 [&>div]:bg-nd-orange"
                                />
                              </div>
                              <span className="text-sm font-bold text-nd-orange w-12 text-right">
                                {votePercent}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {candidate.votes} votos
                            </p>
                          </div>

                          {/* Vote button — orange */}
                          {!hasVoted && (
                            <Button
                              size="sm"
                              onClick={() => handleVote(vm.matchId, candidate.id)}
                              className="flex-shrink-0 bg-nd-orange hover:bg-nd-orange-dark text-white"
                            >
                              <Vote className="w-4 h-4 mr-1" />
                              Votar
                            </Button>
                          )}
                          {isSelected && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nd-orange flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                <p className="text-xs text-muted-foreground text-center">
                  Total de votos: {totalVotes}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
