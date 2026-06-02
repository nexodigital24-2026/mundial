'use client';

import { Standing, getTeamById, getTeamFlagUrl, getTeamCode, getTeamColor, getContrastTextColor, isLightColor } from '@/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StandingsTableProps {
  standings: Standing[];
  groupName: string;
}

export default function StandingsTable({ standings, groupName }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-bold text-foreground mb-3">
        Tabla de Posiciones — Grupo {groupName}
      </h3>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            <TableHead className="w-10 text-center font-bold text-nd-orange">#</TableHead>
            <TableHead className="font-bold">Equipo</TableHead>
            <TableHead className="text-center font-bold">PJ</TableHead>
            <TableHead className="text-center font-bold">PG</TableHead>
            <TableHead className="text-center font-bold">PE</TableHead>
            <TableHead className="text-center font-bold">PP</TableHead>
            <TableHead className="text-center font-bold">GF</TableHead>
            <TableHead className="text-center font-bold">GC</TableHead>
            <TableHead className="text-center font-bold">DG</TableHead>
            <TableHead className="text-center font-bold">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((s, idx) => {
            const team = getTeamById(s.teamId);
            const isQualified = s.pos <= 2;
            const teamColor = team?.color ?? '#666666';
            const textColor = getContrastTextColor(teamColor);
            const flagUrl = team ? getTeamFlagUrl(team.id, 80) : '';
            const code = team ? getTeamCode(team.id).toUpperCase() : '';
            return (
              <TableRow
                key={s.teamId}
                className={`transition-colors ${
                  isQualified
                    ? 'bg-nd-orange-light/50 dark:bg-nd-orange/10 hover:bg-nd-orange-light/70 dark:hover:bg-nd-orange/15 border-l-4 border-l-nd-orange'
                    : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                } ${idx % 2 === 1 ? 'bg-[#F5F5F5]/50 dark:bg-white/[0.02]' : ''}`}
              >
                <TableCell className="text-center font-semibold">{s.pos}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* Colored pastilla badge */}
                    <div
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                      style={{ backgroundColor: teamColor }}
                    >
                      {flagUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={flagUrl}
                          alt={team?.name}
                          className="w-5 h-3.5 object-cover rounded-sm"
                        />
                      ) : (
                        <span className="text-sm">{team?.flag}</span>
                      )}
                      <span
                        className="text-[9px] font-extrabold tracking-wider"
                        style={{ color: textColor }}
                      >
                        {code}
                      </span>
                    </div>
                    <span className="font-medium">{team?.name}</span>
                    {isQualified && (
                      <span className="text-[10px] bg-nd-orange text-white px-1.5 py-0.5 rounded-full font-semibold">
                        CLASIFICA
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">{s.pj}</TableCell>
                <TableCell className="text-center">{s.pg}</TableCell>
                <TableCell className="text-center">{s.pe}</TableCell>
                <TableCell className="text-center">{s.pp}</TableCell>
                <TableCell className="text-center">{s.gf}</TableCell>
                <TableCell className="text-center">{s.gc}</TableCell>
                <TableCell className={`text-center font-semibold ${s.dg > 0 ? 'text-green-600' : s.dg < 0 ? 'text-red-500' : ''}`}>
                  {s.dg > 0 ? '+' : ''}{s.dg}
                </TableCell>
                <TableCell className="text-center font-bold text-primary text-lg">{s.pts}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
