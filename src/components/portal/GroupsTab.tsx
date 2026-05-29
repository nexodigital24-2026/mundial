'use client';

import { useState } from 'react';
import { matches, scorers, getTeamById, getTeamName, getTeamFlag, getStandingsByGroup, getTeamsByGroup, allGroups, type GroupLetter } from '@/lib/mock-data';
import StandingsTable from './StandingsTable';
import MatchCard from './MatchCard';
import BannerDisplay from './BannerDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GroupsTab() {
  const [activeGroup, setActiveGroup] = useState<string>('A');

  const groupStandings = getStandingsByGroup(activeGroup as GroupLetter);
  const groupMatches = matches.filter((m) => m.group === activeGroup);
  const upcomingGroupMatches = groupMatches.filter((m) => m.status === 'upcoming');
  const completedGroupMatches = groupMatches.filter((m) => m.status === 'completed');
  const liveGroupMatches = groupMatches.filter((m) => m.status === 'live');

  // Top scorer of the group
  const groupTeams = getTeamsByGroup(activeGroup as GroupLetter);
  const groupTeamIds = groupTeams.map(t => t.id);
  const groupScorers = scorers
    .filter((s) => groupTeamIds.includes(s.teamId))
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
  const topScorer = groupScorers[0];

  const currentGroupIndex = allGroups.indexOf(activeGroup as GroupLetter);
  const goToPrevGroup = () => {
    const prevIndex = currentGroupIndex > 0 ? currentGroupIndex - 1 : allGroups.length - 1;
    setActiveGroup(allGroups[prevIndex]);
  };
  const goToNextGroup = () => {
    const nextIndex = currentGroupIndex < allGroups.length - 1 ? currentGroupIndex + 1 : 0;
    setActiveGroup(allGroups[nextIndex]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group Navigation */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Grupos del Mundial
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevGroup} className="w-8 h-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground min-w-[80px] text-center">
            Grupo {activeGroup} / L
          </span>
          <Button variant="outline" size="icon" onClick={goToNextGroup} className="w-8 h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Group Tabs */}
      <div className="overflow-x-auto custom-scrollbar -mx-4 px-4">
        <Tabs value={activeGroup} onValueChange={setActiveGroup}>
          <TabsList className="inline-grid grid-cols-12 w-max min-w-full">
            {allGroups.map((g) => (
              <TabsTrigger key={g} value={g} className="font-semibold text-xs px-3 py-2">
                {g}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeGroup} className="mt-6 space-y-6">
            {/* Teams preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {groupTeams.map((team) => (
                <div key={team.id} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border hover:shadow-sm transition-all">
                  <span className="text-2xl">{team.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{team.name}</p>
                    <p className="text-[11px] text-muted-foreground">Grupo {team.group}</p>
                  </div>
                </div>
              ))}
            </div>

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

            {/* Live matches */}
            {liveGroupMatches.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-live" />
                  En Vivo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveGroupMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
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

      {/* Sidebar Banner */}
      <BannerDisplay position="sidebar" />
    </div>
  );
}
