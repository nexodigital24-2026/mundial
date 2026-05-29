'use client';

import { useState } from 'react';
import { matches, standingsA, standingsB, scorers, getTeamById, getTeamName, getTeamFlag } from '@/lib/mock-data';
import StandingsTable from './StandingsTable';
import MatchCard from './MatchCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function GroupsTab() {
  const [activeGroup, setActiveGroup] = useState('A');

  const groupStandings = activeGroup === 'A' ? standingsA : standingsB;
  const groupMatches = matches.filter((m) => m.group === activeGroup);
  const upcomingGroupMatches = groupMatches.filter((m) => m.status === 'upcoming');
  const completedGroupMatches = groupMatches.filter((m) => m.status === 'completed');

  // Top scorer of the group
  const groupTeams = activeGroup === 'A'
    ? ['arg', 'bra', 'fra', 'ger']
    : ['esp', 'eng', 'por', 'ned'];
  const groupScorers = scorers
    .filter((s) => groupTeams.includes(s.teamId))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
  const topScorer = groupScorers[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeGroup} onValueChange={setActiveGroup}>
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="A" className="font-semibold">Grupo A</TabsTrigger>
          <TabsTrigger value="B" className="font-semibold">Grupo B</TabsTrigger>
        </TabsList>

        <TabsContent value={activeGroup} className="mt-6 space-y-6">
          {/* Standings */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <StandingsTable standings={groupStandings} groupName={activeGroup} />
            </CardContent>
          </Card>

          {/* Top scorer */}
          {topScorer && (
            <Card className="border-gold/50 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-900" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Goleador del Grupo {activeGroup}</p>
                    <p className="font-bold text-lg text-foreground">
                      {getTeamFlag(topScorer.teamId)} {topScorer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {topScorer.goals} goles · {topScorer.assists} asistencias · {getTeamName(topScorer.teamId)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completed matches */}
          {completedGroupMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">Partidos Jugados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedGroupMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming matches */}
          {upcomingGroupMatches.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3">Próximos Partidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingGroupMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
