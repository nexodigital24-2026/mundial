'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePortalData } from '@/lib/portal-data-context';
import { getTeamById, type Match, type Scorer } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SliderEditor from './SliderEditor';
import NewsEditor from './NewsEditor';
import {
  PenTool, Shield, Trophy, Newspaper,
  Plus, Edit, Trash2, Save, X, AlertTriangle, BarChart3,
} from 'lucide-react';

export default function EditorTab() {
  const { isEditor } = useAuth();
  const {
    matches: localMatches,
    scorers: localScorers,
    redCards: localRedCards,
    syntheses: localSyntheses,
    updateMatches: setLocalMatches,
    updateScorers: setLocalScorers,
    updateRedCards: setLocalRedCards,
    updateSyntheses: setLocalSyntheses,
  } = usePortalData();

  // Edit match dialog
  const [editMatchDialog, setEditMatchDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editHomeScore, setEditHomeScore] = useState('0');
  const [editAwayScore, setEditAwayScore] = useState('0');
  const [editSynthesis, setEditSynthesis] = useState('');

  // Scorer dialog
  const [scorerDialog, setScorerDialog] = useState(false);
  const [scorerForm, setScorerForm] = useState({ name: '', teamId: '', goals: 0, assists: 0, position: 'Delantero' });

  if (!isEditor) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <PenTool className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Solo los editores y administradores pueden acceder a este panel. Inicie sesión con una cuenta con permisos de edición.
        </p>
      </div>
    );
  }

  const openEditMatch = (match: Match) => {
    setEditingMatch(match);
    setEditHomeScore(String(match.homeScore ?? 0));
    setEditAwayScore(String(match.awayScore ?? 0));
    setEditSynthesis(match.synthesis ?? '');
    setEditMatchDialog(true);
  };

  const saveMatch = () => {
    if (!editingMatch) return;
    setLocalMatches(prev => prev.map(m =>
      m.id === editingMatch.id
        ? { ...m, homeScore: parseInt(editHomeScore) || 0, awayScore: parseInt(editAwayScore) || 0, synthesis: editSynthesis }
        : m
    ));
    setEditMatchDialog(false);
  };

  const saveScorer = () => {
    const newScorer: Scorer = {
      id: `s${Date.now()}`,
      name: scorerForm.name,
      teamId: scorerForm.teamId,
      goals: scorerForm.goals,
      assists: scorerForm.assists,
      position: scorerForm.position,
    };
    setLocalScorers(prev => [...prev, newScorer]);
    setScorerDialog(false);
    setScorerForm({ name: '', teamId: '', goals: 0, assists: 0, position: 'Delantero' });
  };

  const completedMatches = localMatches.filter(m => m.status === 'completed');
  const liveMatches = localMatches.filter(m => m.status === 'live');

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <PenTool className="w-5 h-5 text-primary" />
        Panel de Edición
      </h2>

      <Tabs defaultValue="slider">
        <TabsList className="grid w-full grid-cols-5 max-w-xl">
          <TabsTrigger value="slider" className="text-xs sm:text-sm">Slider</TabsTrigger>
          <TabsTrigger value="matches" className="text-xs sm:text-sm">Partidos</TabsTrigger>
          <TabsTrigger value="news" className="text-xs sm:text-sm">Noticias</TabsTrigger>
          <TabsTrigger value="players" className="text-xs sm:text-sm">Jugadores</TabsTrigger>
          <TabsTrigger value="synthesis" className="text-xs sm:text-sm">Síntesis</TabsTrigger>
        </TabsList>

        {/* SLIDER TAB — now uses dedicated SliderEditor component */}
        <TabsContent value="slider" className="mt-4">
          <SliderEditor />
        </TabsContent>

        {/* MATCHES TAB */}
        <TabsContent value="matches" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Editar Resultados de Partidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                {[...liveMatches, ...completedMatches].map((match) => {
                  const home = getTeamById(match.homeTeamId);
                  const away = getTeamById(match.awayTeamId);
                  return (
                    <div key={match.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge className={`text-[10px] flex-shrink-0 ${match.status === 'live' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-green-100 text-green-700 hover:bg-green-100'}`}>
                          {match.status === 'live' ? 'EN VIVO' : 'Final'}
                        </Badge>
                        <span className="text-sm truncate">
                          {home?.flag} {home?.name} <span className="font-bold text-primary">{match.homeScore}</span>
                          {' - '}
                          <span className="font-bold text-primary">{match.awayScore}</span> {away?.flag} {away?.name}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => openEditMatch(match)}>
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NEWS TAB — now uses dedicated NewsEditor component */}
        <TabsContent value="news" className="mt-4">
          <NewsEditor />
        </TabsContent>

        {/* PLAYERS TAB */}
        <TabsContent value="players" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Goleadores y Expulsados
              </CardTitle>
              <Button size="sm" onClick={() => setScorerDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Agregar Goleador
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jugador</TableHead>
                      <TableHead className="text-center">Goles</TableHead>
                      <TableHead className="text-center">Asist.</TableHead>
                      <TableHead>Posición</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localScorers.sort((a, b) => b.goals - a.goals).map((scorer) => {
                      const team = getTeamById(scorer.teamId);
                      return (
                        <TableRow key={scorer.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{team?.flag}</span>
                              <span className="text-sm font-medium">{scorer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-primary">{scorer.goals}</TableCell>
                          <TableCell className="text-center">{scorer.assists}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{scorer.position}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Tarjetas Rojas
                </h4>
                <div className="space-y-2">
                  {localRedCards.map((card) => {
                    const team = getTeamById(card.teamId);
                    return (
                      <div key={card.id} className="flex items-center gap-3 p-2 rounded-lg bg-red-50 text-sm">
                        <span>{team?.flag}</span>
                        <span className="font-medium">{card.playerName}</span>
                        <Badge variant="outline" className="text-[10px]">{card.reason}</Badge>
                        <Badge className={`text-[10px] ${card.suspensionStatus === 'Activa' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-green-100 text-green-700 hover:bg-green-100'}`}>
                          {card.suspensionStatus}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYNTHESIS TAB */}
        <TabsContent value="synthesis" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Síntesis de Partidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-3">
                {localSyntheses.map((synth) => {
                  const match = localMatches.find(m => m.id === synth.matchId);
                  const home = match ? getTeamById(match.homeTeamId) : undefined;
                  const away = match ? getTeamById(match.awayTeamId) : undefined;
                  return (
                    <div key={synth.matchId} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{home?.flag} {home?.name} vs {away?.flag} {away?.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-green-50 rounded p-2">
                          <p className="font-semibold text-green-800 mb-1">Fortalezas ({synth.strengths.team})</p>
                          <ul className="space-y-0.5">
                            {synth.strengths.points.map((p, i) => (
                              <li key={i} className="text-green-700">✓ {p}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded p-2">
                          <p className="font-semibold text-red-800 mb-1">Debilidades ({synth.weaknesses.team})</p>
                          <ul className="space-y-0.5">
                            {synth.weaknesses.points.map((p, i) => (
                              <li key={i} className="text-red-700">✗ {p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {synth.ratings.map((r) => (
                          <Badge key={r.team} variant="secondary" className="text-[10px]">
                            {r.team}: {r.rating}/10
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Match Dialog */}
      <Dialog open={editMatchDialog} onOpenChange={setEditMatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Resultado</DialogTitle>
          </DialogHeader>
          {editingMatch && (
            <div className="space-y-4 pt-2">
              <div className="text-center text-sm font-semibold">
                {getTeamById(editingMatch.homeTeamId)?.flag} {getTeamById(editingMatch.homeTeamId)?.name} vs {getTeamById(editingMatch.awayTeamId)?.flag} {getTeamById(editingMatch.awayTeamId)?.name}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Goles Local</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editHomeScore}
                    onChange={(e) => setEditHomeScore(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goles Visitante</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editAwayScore}
                    onChange={(e) => setEditAwayScore(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Síntesis del Partido</Label>
                <Textarea
                  placeholder="Resumen del partido..."
                  value={editSynthesis}
                  onChange={(e) => setEditSynthesis(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveMatch} className="flex-1">
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setEditMatchDialog(false)}>
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scorer Dialog */}
      <Dialog open={scorerDialog} onOpenChange={setScorerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Goleador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Nombre del Jugador</Label>
              <Input
                placeholder="Ej: L. Messi"
                value={scorerForm.name}
                onChange={(e) => setScorerForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Select value={scorerForm.teamId} onValueChange={(v) => setScorerForm(prev => ({ ...prev, teamId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {['arg','bra','mex','fra','esp','eng','ger','por','ned','bel','usa','kor','sui','can','tur','col','uru','nor','aut','sco','mar','egy','cze','par','rsa','bih','qat','hai','aus','cuw','civ','ecu','jpn','swe','tun','iri','nzl','ksa','cpv','sen','irq','alg','jor','cod','uzb','gha','pan','cro'].map(id => {
                    const team = getTeamById(id);
                    return team ? (
                      <SelectItem key={id} value={id}>{team.flag} {team.name}</SelectItem>
                    ) : null;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goles</Label>
                <Input
                  type="number"
                  min="0"
                  value={scorerForm.goals}
                  onChange={(e) => setScorerForm(prev => ({ ...prev, goals: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Asistencias</Label>
                <Input
                  type="number"
                  min="0"
                  value={scorerForm.assists}
                  onChange={(e) => setScorerForm(prev => ({ ...prev, assists: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Posición</Label>
              <Select value={scorerForm.position} onValueChange={(v) => setScorerForm(prev => ({ ...prev, position: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delantero">Delantero</SelectItem>
                  <SelectItem value="Extremo">Extremo</SelectItem>
                  <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                  <SelectItem value="Defensor">Defensor</SelectItem>
                  <SelectItem value="Portero">Portero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveScorer} className="flex-1" disabled={!scorerForm.name || !scorerForm.teamId}>
                <Save className="w-4 h-4 mr-1" />
                Crear
              </Button>
              <Button variant="outline" onClick={() => setScorerDialog(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
