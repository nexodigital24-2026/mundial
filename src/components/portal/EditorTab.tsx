'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { matches as initialMatches, news as initialNews, scorers as initialScorers, redCards as initialRedCards, matchSyntheses as initialSyntheses, sliderSlides as initialSliderSlides, getTeamById, type Match, type NewsItem, type Scorer, type RedCard, type MatchSynthesis, type SliderSlide } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  PenTool, Shield, Trophy, FileText, Newspaper,
  Plus, Edit, Trash2, Save, X, AlertTriangle, BarChart3,
  Image as ImageIcon, ChevronUp, ChevronDown, Eye, Palette
} from 'lucide-react';

export default function EditorTab() {
  const { isEditor } = useAuth();
  const [localMatches, setLocalMatches] = useState<Match[]>(initialMatches);
  const [localNews, setLocalNews] = useState<NewsItem[]>(initialNews);
  const [localScorers, setLocalScorers] = useState<Scorer[]>(initialScorers);
  const [localRedCards, setLocalRedCards] = useState<RedCard[]>(initialRedCards);
  const [localSyntheses, setLocalSyntheses] = useState<MatchSynthesis[]>(initialSyntheses);
  const [localSlides, setLocalSlides] = useState<SliderSlide[]>(initialSliderSlides);

  // Slider editing state
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState<Partial<SliderSlide>>({});

  // Edit match dialog
  const [editMatchDialog, setEditMatchDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editHomeScore, setEditHomeScore] = useState('0');
  const [editAwayScore, setEditAwayScore] = useState('0');
  const [editSynthesis, setEditSynthesis] = useState('');

  // News dialog
  const [newsDialog, setNewsDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({ title: '', summary: '', category: 'Resultados' });

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

  const saveNews = () => {
    if (editingNews) {
      setLocalNews(prev => prev.map(n =>
        n.id === editingNews.id
          ? { ...n, ...newsForm }
          : n
      ));
    } else {
      const newNewsItem: NewsItem = {
        id: `n${Date.now()}`,
        title: newsForm.title,
        summary: newsForm.summary,
        category: newsForm.category,
        date: new Date().toISOString().split('T')[0],
        imageKeyword: 'news',
      };
      setLocalNews(prev => [newNewsItem, ...prev]);
    }
    setNewsDialog(false);
    setEditingNews(null);
    setNewsForm({ title: '', summary: '', category: 'Resultados' });
  };

  const deleteNews = (id: string) => {
    setLocalNews(prev => prev.filter(n => n.id !== id));
  };

  const openEditNews = (item: NewsItem | null) => {
    if (item) {
      setEditingNews(item);
      setNewsForm({ title: item.title, summary: item.summary, category: item.category });
    } else {
      setEditingNews(null);
      setNewsForm({ title: '', summary: '', category: 'Resultados' });
    }
    setNewsDialog(true);
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

      <Tabs defaultValue="matches">
        <TabsList className="grid w-full grid-cols-5 max-w-xl">
          <TabsTrigger value="matches" className="text-xs sm:text-sm">Partidos</TabsTrigger>
          <TabsTrigger value="news" className="text-xs sm:text-sm">Noticias</TabsTrigger>
          <TabsTrigger value="players" className="text-xs sm:text-sm">Jugadores</TabsTrigger>
          <TabsTrigger value="synthesis" className="text-xs sm:text-sm">Síntesis</TabsTrigger>
          <TabsTrigger value="slider" className="text-xs sm:text-sm">Slider</TabsTrigger>
        </TabsList>

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

        {/* NEWS TAB */}
        <TabsContent value="news" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" />
                Gestión de Noticias
              </CardTitle>
              <Button size="sm" onClick={() => openEditNews(null)}>
                <Plus className="w-4 h-4 mr-1" />
                Nueva Noticia
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                {localNews.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                        <span className="text-[11px] text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEditNews(item)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-700" onClick={() => deleteNews(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

        {/* SLIDER TAB */}
        <TabsContent value="slider" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Gestión del Slider Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...localSlides].sort((a, b) => a.order - b.order).map((slide, idx) => {
                  const homeTeam = slide.homeTeamId ? getTeamById(slide.homeTeamId) : null;
                  const awayTeam = slide.awayTeamId ? getTeamById(slide.awayTeamId) : null;
                  const isEditing = editingSlideId === slide.id;

                  return (
                    <div key={slide.id} className={`rounded-lg border ${isEditing ? 'border-primary shadow-md' : 'border-border'} overflow-hidden`}>
                      {/* Slide header / preview */}
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer"
                        style={{ backgroundColor: slide.bgColor + '20' }}
                        onClick={() => {
                          if (isEditing) {
                            setEditingSlideId(null);
                            setSlideForm({});
                          } else {
                            setEditingSlideId(slide.id);
                            setSlideForm({ ...slide });
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex flex-col gap-0.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                const sorted = [...localSlides].sort((a, b) => a.order - b.order);
                                if (idx > 0) {
                                  const prevSlide = sorted[idx - 1];
                                  setLocalSlides(prev => prev.map(s => {
                                    if (s.id === slide.id) return { ...s, order: prevSlide.order };
                                    if (s.id === prevSlide.id) return { ...s, order: slide.order };
                                    return s;
                                  }));
                                }
                              }}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                              disabled={idx === localSlides.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                const sorted = [...localSlides].sort((a, b) => a.order - b.order);
                                if (idx < sorted.length - 1) {
                                  const nextSlide = sorted[idx + 1];
                                  setLocalSlides(prev => prev.map(s => {
                                    if (s.id === slide.id) return { ...s, order: nextSlide.order };
                                    if (s.id === nextSlide.id) return { ...s, order: slide.order };
                                    return s;
                                  }));
                                }
                              }}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">#{slide.order}</Badge>
                          <Badge className={`text-[10px] flex-shrink-0 ${slide.category === 'En Vivo' ? 'bg-red-100 text-red-700' : slide.category === 'Resultado' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                            {slide.category}
                          </Badge>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{slide.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
                          </div>
                          {homeTeam && awayTeam && (
                            <span className="text-xs flex-shrink-0">
                              {homeTeam.flag} {slide.homeScore} - {slide.awayScore} {awayTeam.flag}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch
                            checked={slide.active}
                            onCheckedChange={(checked) => {
                              setLocalSlides(prev => prev.map(s => s.id === slide.id ? { ...s, active: checked } : s));
                            }}
                          />
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Edit form */}
                      {isEditing && (
                        <div className="p-4 bg-muted/30 border-t space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Título</Label>
                              <Input
                                value={slideForm.title ?? ''}
                                onChange={(e) => setSlideForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Título del slide"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Subtítulo</Label>
                              <Input
                                value={slideForm.subtitle ?? ''}
                                onChange={(e) => setSlideForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                placeholder="Subtítulo del slide"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Categoría</Label>
                              <Select
                                value={slideForm.category ?? 'Resultado'}
                                onValueChange={(v) => setSlideForm(prev => ({ ...prev, category: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="En Vivo">En Vivo</SelectItem>
                                  <SelectItem value="Resultado">Resultado</SelectItem>
                                  <SelectItem value="Próximo">Próximo Partido</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Partido (Match ID)</Label>
                              <Select
                                value={slideForm.matchId ?? 'none'}
                                onValueChange={(v) => {
                                  const matchId = v === 'none' ? null : v;
                                  if (matchId) {
                                    const match = localMatches.find(m => m.id === matchId);
                                    if (match) {
                                      setSlideForm(prev => ({
                                        ...prev,
                                        matchId,
                                        homeTeamId: match.homeTeamId,
                                        awayTeamId: match.awayTeamId,
                                        homeScore: match.homeScore,
                                        awayScore: match.awayScore,
                                        title: prev.title || `${getTeamById(match.homeTeamId)?.name} vs ${getTeamById(match.awayTeamId)?.name}`,
                                      }));
                                    }
                                  } else {
                                    setSlideForm(prev => ({
                                      ...prev,
                                      matchId: null,
                                      homeTeamId: null,
                                      awayTeamId: null,
                                      homeScore: null,
                                      awayScore: null,
                                    }));
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Sin partido</SelectItem>
                                  {localMatches.filter(m => m.status === 'live' || m.status === 'completed').map(m => {
                                    const h = getTeamById(m.homeTeamId);
                                    const a = getTeamById(m.awayTeamId);
                                    return (
                                      <SelectItem key={m.id} value={m.id}>
                                        {h?.flag} {h?.name} vs {a?.flag} {a?.name}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Navegar a</Label>
                              <Select
                                value={slideForm.linkTo ?? 'grupos'}
                                onValueChange={(v) => setSlideForm(prev => ({ ...prev, linkTo: v }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grupos">Grupos</SelectItem>
                                  <SelectItem value="resultados">Resultados</SelectItem>
                                  <SelectItem value="en-vivo">En Vivo</SelectItem>
                                  <SelectItem value="goleadores">Goleadores</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Color de Fondo</Label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={slideForm.bgColor ?? '#1B5E20'}
                                  onChange={(e) => setSlideForm(prev => ({ ...prev, bgColor: e.target.value }))}
                                  className="w-10 h-10 rounded border cursor-pointer"
                                />
                                <Input
                                  value={slideForm.bgColor ?? '#1B5E20'}
                                  onChange={(e) => setSlideForm(prev => ({ ...prev, bgColor: e.target.value }))}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Orden</Label>
                              <Input
                                type="number"
                                min="1"
                                max="4"
                                value={slideForm.order ?? 1}
                                onChange={(e) => setSlideForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                              />
                            </div>
                          </div>

                          {/* Live Preview */}
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Vista Previa
                            </Label>
                            <div
                              className="rounded-lg p-4 text-white"
                              style={{ background: `linear-gradient(135deg, ${slideForm.bgColor ?? '#1B5E20'} 0%, ${slideForm.bgColor ?? '#1B5E20'}cc 100%)` }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-nd-orange text-nd-black border-0 font-bold text-[10px]">📻 100.9 FM</Badge>
                                {slideForm.category === 'En Vivo' && (
                                  <Badge className="bg-red-500 text-white border-0 text-[10px]">En Vivo</Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-bold mb-1">Nuevo Día <span className="text-nd-orange">Mundial</span></h3>
                              <p className="text-sm font-semibold">{slideForm.title ?? 'Título'}</p>
                              <p className="text-xs text-white/70">{slideForm.subtitle ?? 'Subtítulo'}</p>
                              {slideForm.homeTeamId && slideForm.awayTeamId && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span>{getTeamById(slideForm.homeTeamId)?.flag}</span>
                                  <span className="font-bold">{slideForm.homeScore ?? '-'}</span>
                                  <span className="text-white/50">:</span>
                                  <span className="font-bold">{slideForm.awayScore ?? '-'}</span>
                                  <span>{getTeamById(slideForm.awayTeamId)?.flag}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Save/Cancel */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setLocalSlides(prev => prev.map(s =>
                                  s.id === slide.id ? { ...s, ...slideForm } as SliderSlide : s
                                ));
                                setEditingSlideId(null);
                                setSlideForm({});
                              }}
                              className="flex-1"
                              disabled={!slideForm.title}
                            >
                              <Save className="w-4 h-4 mr-1" />
                              Guardar
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingSlideId(null);
                                setSlideForm({});
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
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

      {/* News Dialog */}
      <Dialog open={newsDialog} onOpenChange={setNewsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                placeholder="Título de la noticia"
                value={newsForm.title}
                onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Resumen</Label>
              <Textarea
                placeholder="Resumen de la noticia..."
                value={newsForm.summary}
                onChange={(e) => setNewsForm(prev => ({ ...prev, summary: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={newsForm.category} onValueChange={(v) => setNewsForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En Vivo">En Vivo</SelectItem>
                  <SelectItem value="Especial">Especial</SelectItem>
                  <SelectItem value="Análisis">Análisis</SelectItem>
                  <SelectItem value="Resultados">Resultados</SelectItem>
                  <SelectItem value="Clasificación">Clasificación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveNews} className="flex-1" disabled={!newsForm.title || !newsForm.summary}>
                <Save className="w-4 h-4 mr-1" />
                {editingNews ? 'Actualizar' : 'Crear'}
              </Button>
              <Button variant="outline" onClick={() => setNewsDialog(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
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
              <Input
                placeholder="ID del equipo (ej: arg, bra, mex)"
                value={scorerForm.teamId}
                onChange={(e) => setScorerForm(prev => ({ ...prev, teamId: e.target.value }))}
              />
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
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveScorer} className="w-full" disabled={!scorerForm.name || !scorerForm.teamId}>
              <Save className="w-4 h-4 mr-1" />
              Agregar Goleador
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
