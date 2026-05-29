'use client';

import { redCards, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor } from '@/lib/mock-data';
import { useRealtime } from '@/lib/realtime-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, Clock, AlertTriangle } from 'lucide-react';

export default function RedCardsTab() {
  const { allMatches } = useRealtime();
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-red-500" />
        Registro de Expulsiones
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{redCards.length}</p>
            <p className="text-xs text-red-500 mt-1">Total Tarjetas Rojas</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {redCards.filter((r) => r.suspensionStatus === 'Activa').length}
            </p>
            <p className="text-xs text-orange-500 mt-1">Sanciones Activas</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50 col-span-2 sm:col-span-1">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {redCards.filter((r) => r.suspensionStatus === 'Cumplida').length}
            </p>
            <p className="text-xs text-green-500 mt-1">Sanciones Cumplidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Red cards list */}
      <div className="space-y-3">
        {redCards.map((card) => {
          const team = getTeamById(card.teamId);
          const match = allMatches.find((m) => m.id === card.matchId);
          const homeTeam = match ? getTeamById(match.homeTeamId) : undefined;
          const awayTeam = match ? getTeamById(match.awayTeamId) : undefined;

          return (
            <Card
              key={card.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                card.suspensionStatus === 'Activa'
                  ? 'border-l-4 border-l-red-500'
                  : 'border-l-4 border-l-green-500'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Player info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{card.playerName}</p>
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
                      </p>
                    </div>
                  </div>

                  {/* Match */}
                  <div className="text-sm text-muted-foreground">
                    {homeTeam?.name} vs {awayTeam?.name}
                  </div>

                  {/* Minute */}
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{card.minute}&apos;</span>
                  </div>

                  {/* Reason */}
                  <Badge variant="outline" className="text-xs w-fit">
                    {card.reason}
                  </Badge>

                  {/* Status */}
                  <Badge
                    className={`text-xs ${
                      card.suspensionStatus === 'Activa'
                        ? 'bg-red-100 text-red-700 hover:bg-red-100'
                        : 'bg-green-100 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {card.suspensionStatus === 'Activa' ? '🔴 Sanción Activa' : '✅ Sanción Cumplida'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
