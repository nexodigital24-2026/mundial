'use client';

import { useState, useMemo } from 'react';
import { scorers, teams, getTeamName } from '@/lib/mock-data';
import ScorerRow from './ScorerRow';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

export default function ScorersTab() {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<'all' | 'A' | 'B'>('all');

  const filteredScorers = useMemo(() => {
    let result = [...scorers].sort((a, b) => b.goals - a.goals || b.assists - a.assists);

    if (groupFilter !== 'all') {
      const groupTeamIds = teams
        .filter((t) => t.group === groupFilter)
        .map((t) => t.id);
      result = result.filter((s) => groupTeamIds.includes(s.teamId));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          getTeamName(s.teamId).toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, groupFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground">Tabla de Goleadores</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jugador o equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={groupFilter}
          onValueChange={(v) => setGroupFilter(v as 'all' | 'A' | 'B')}
        >
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grupos</SelectItem>
            <SelectItem value="A">Grupo A</SelectItem>
            <SelectItem value="B">Grupo B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scorers list */}
      <div className="space-y-2">
        {filteredScorers.map((scorer, index) => (
          <ScorerRow key={scorer.id} scorer={scorer} rank={index + 1} />
        ))}
        {filteredScorers.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No se encontraron goleadores con los filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
}
