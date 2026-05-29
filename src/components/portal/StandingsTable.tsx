'use client';

import { Standing, getTeamById } from '@/lib/mock-data';
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
            <TableHead className="w-10 text-center font-bold">#</TableHead>
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
          {standings.map((s) => {
            const team = getTeamById(s.teamId);
            const isQualified = s.pos <= 2;
            return (
              <TableRow
                key={s.teamId}
                className={`transition-colors ${
                  isQualified
                    ? 'bg-green-50 hover:bg-green-100/70 border-l-4 border-l-green-500'
                    : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                }`}
              >
                <TableCell className="text-center font-semibold">{s.pos}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{team?.flag}</span>
                    <span className="font-medium">{team?.name}</span>
                    {isQualified && (
                      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
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
