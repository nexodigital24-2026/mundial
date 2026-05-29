// Mock Data for "Nuevo Día Mundial" Sports Portal - World Cup 2026
// 12 Groups, 48 Teams

export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Team {
  id: string;
  name: string;
  flag: string;
  group: GroupLetter;
}

export interface Standing {
  pos: number;
  teamId: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface Scorer {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  assists: number;
  position: string;
}

export interface RedCard {
  id: string;
  playerName: string;
  teamId: string;
  matchId: string;
  minute: number;
  reason: string;
  suspensionStatus: 'Cumplida' | 'Activa';
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  status: 'completed' | 'live' | 'upcoming';
  group: GroupLetter;
  minute?: number;
  scorers?: { player: string; team: string; minute: number }[];
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  standoutPlayer?: string;
  synthesis?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  imageKeyword: string;
}

export interface MatchSynthesis {
  matchId: string;
  strengths: { team: string; points: string[] };
  weaknesses: { team: string; points: string[] };
  keyMoments: string[];
  ratings: { team: string; rating: number }[];
}

export interface VotingMatch {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  candidates: { id: string; name: string; teamId: string; votes: number }[];
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'hero' | 'sidebar' | 'footer' | 'content-top' | 'content-bottom';
  active: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  createdBy: string;
}

// ==================== TEAMS (48) ====================
export const teams: Team[] = [
  // Group A
  { id: 'mex', name: 'México', flag: '🇲🇽', group: 'A' },
  { id: 'rsa', name: 'Sudáfrica', flag: '🇿🇦', group: 'A' },
  { id: 'kor', name: 'Corea del Sur', flag: '🇰🇷', group: 'A' },
  { id: 'cze', name: 'Chequia', flag: '🇨🇿', group: 'A' },
  // Group B
  { id: 'can', name: 'Canadá', flag: '🇨🇦', group: 'B' },
  { id: 'bih', name: 'Bosnia y Herzegovina', flag: '🇧🇦', group: 'B' },
  { id: 'qat', name: 'Catar', flag: '🇶🇦', group: 'B' },
  { id: 'sui', name: 'Suiza', flag: '🇨🇭', group: 'B' },
  // Group C
  { id: 'bra', name: 'Brasil', flag: '🇧🇷', group: 'C' },
  { id: 'mar', name: 'Marruecos', flag: '🇲🇦', group: 'C' },
  { id: 'hai', name: 'Haití', flag: '🇭🇹', group: 'C' },
  { id: 'sco', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  // Group D
  { id: 'usa', name: 'Estados Unidos', flag: '🇺🇸', group: 'D' },
  { id: 'par', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
  { id: 'aus', name: 'Australia', flag: '🇦🇺', group: 'D' },
  { id: 'tur', name: 'Turquía', flag: '🇹🇷', group: 'D' },
  // Group E
  { id: 'ger', name: 'Alemania', flag: '🇩🇪', group: 'E' },
  { id: 'cuw', name: 'Curazao', flag: '🇨🇼', group: 'E' },
  { id: 'civ', name: 'Costa de Marfil', flag: '🇨🇮', group: 'E' },
  { id: 'ecu', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
  // Group F
  { id: 'ned', name: 'Países Bajos', flag: '🇳🇱', group: 'F' },
  { id: 'jpn', name: 'Japón', flag: '🇯🇵', group: 'F' },
  { id: 'swe', name: 'Suecia', flag: '🇸🇪', group: 'F' },
  { id: 'tun', name: 'Túnez', flag: '🇹🇳', group: 'F' },
  // Group G
  { id: 'bel', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
  { id: 'egy', name: 'Egipto', flag: '🇪🇬', group: 'G' },
  { id: 'iri', name: 'Irán', flag: '🇮🇷', group: 'G' },
  { id: 'nzl', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'G' },
  // Group H
  { id: 'esp', name: 'España', flag: '🇪🇸', group: 'H' },
  { id: 'cpv', name: 'Cabo Verde', flag: '🇨🇻', group: 'H' },
  { id: 'ksa', name: 'Arabia Saudita', flag: '🇸🇦', group: 'H' },
  { id: 'uru', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
  // Group I
  { id: 'fra', name: 'Francia', flag: '🇫🇷', group: 'I' },
  { id: 'sen', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  { id: 'irq', name: 'Irak', flag: '🇮🇶', group: 'I' },
  { id: 'nor', name: 'Noruega', flag: '🇳🇴', group: 'I' },
  // Group J
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', group: 'J' },
  { id: 'alg', name: 'Argelia', flag: '🇩🇿', group: 'J' },
  { id: 'aut', name: 'Austria', flag: '🇦🇹', group: 'J' },
  { id: 'jor', name: 'Jordania', flag: '🇯🇴', group: 'J' },
  // Group K
  { id: 'por', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  { id: 'cod', name: 'Congo DR', flag: '🇨🇩', group: 'K' },
  { id: 'uzb', name: 'Uzbekistán', flag: '🇺🇿', group: 'K' },
  { id: 'col', name: 'Colombia', flag: '🇨🇴', group: 'K' },
  // Group L
  { id: 'eng', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { id: 'cro', name: 'Croacia', flag: '🇭🇷', group: 'L' },
  { id: 'gha', name: 'Ghana', flag: '🇬🇭', group: 'L' },
  { id: 'pan', name: 'Panamá', flag: '🇵🇦', group: 'L' },
];

// ==================== STANDINGS (12 groups) ====================
export const standings: Record<string, Standing[]> = {
  A: [
    { pos: 1, teamId: 'mex', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'kor', pj: 2, pg: 1, pe: 1, pp: 0, gf: 4, gc: 2, dg: 2, pts: 4 },
    { pos: 3, teamId: 'cze', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'rsa', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 5, dg: -4, pts: 0 },
  ],
  B: [
    { pos: 1, teamId: 'sui', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'can', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, dg: 0, pts: 3 },
    { pos: 3, teamId: 'bih', pj: 2, pg: 1, pe: 0, pp: 1, gf: 2, gc: 3, dg: -1, pts: 3 },
    { pos: 4, teamId: 'qat', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 4, dg: -3, pts: 0 },
  ],
  C: [
    { pos: 1, teamId: 'bra', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 2, dg: 4, pts: 6 },
    { pos: 2, teamId: 'mar', pj: 2, pg: 1, pe: 1, pp: 0, gf: 3, gc: 1, dg: 2, pts: 4 },
    { pos: 3, teamId: 'sco', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'hai', pj: 2, pg: 0, pe: 0, pp: 2, gf: 0, gc: 4, dg: -4, pts: 0 },
  ],
  D: [
    { pos: 1, teamId: 'usa', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'tur', pj: 2, pg: 1, pe: 0, pp: 1, gf: 4, gc: 3, dg: 1, pts: 3 },
    { pos: 3, teamId: 'par', pj: 2, pg: 1, pe: 0, pp: 1, gf: 2, gc: 3, dg: -1, pts: 3 },
    { pos: 4, teamId: 'aus', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 5, dg: -4, pts: 0 },
  ],
  E: [
    { pos: 1, teamId: 'ger', pj: 2, pg: 2, pe: 0, pp: 0, gf: 7, gc: 1, dg: 6, pts: 6 },
    { pos: 2, teamId: 'ecu', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, dg: 0, pts: 3 },
    { pos: 3, teamId: 'civ', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'cuw', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 5, dg: -4, pts: 1 },
  ],
  F: [
    { pos: 1, teamId: 'ned', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'jpn', pj: 2, pg: 1, pe: 1, pp: 0, gf: 4, gc: 2, dg: 2, pts: 4 },
    { pos: 3, teamId: 'swe', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'tun', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 5, dg: -4, pts: 0 },
  ],
  G: [
    { pos: 1, teamId: 'bel', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'egy', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 2, dg: 1, pts: 3 },
    { pos: 3, teamId: 'iri', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'nzl', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 4, dg: -3, pts: 1 },
  ],
  H: [
    { pos: 1, teamId: 'esp', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 1, dg: 5, pts: 6 },
    { pos: 2, teamId: 'uru', pj: 2, pg: 1, pe: 1, pp: 0, gf: 3, gc: 2, dg: 1, pts: 4 },
    { pos: 3, teamId: 'ksa', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'cpv', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 5, dg: -4, pts: 0 },
  ],
  I: [
    { pos: 1, teamId: 'fra', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 1, dg: 5, pts: 6 },
    { pos: 2, teamId: 'sen', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, dg: 0, pts: 3 },
    { pos: 3, teamId: 'nor', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'irq', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 4, dg: -3, pts: 1 },
  ],
  J: [
    { pos: 1, teamId: 'arg', pj: 2, pg: 2, pe: 0, pp: 0, gf: 7, gc: 1, dg: 6, pts: 6 },
    { pos: 2, teamId: 'aut', pj: 2, pg: 1, pe: 0, pp: 1, gf: 3, gc: 3, dg: 0, pts: 3 },
    { pos: 3, teamId: 'alg', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 5, dg: -3, pts: 1 },
    { pos: 4, teamId: 'jor', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 4, dg: -3, pts: 1 },
  ],
  K: [
    { pos: 1, teamId: 'por', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'col', pj: 2, pg: 1, pe: 1, pp: 0, gf: 4, gc: 2, dg: 2, pts: 4 },
    { pos: 3, teamId: 'cod', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'uzb', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 5, dg: -4, pts: 0 },
  ],
  L: [
    { pos: 1, teamId: 'eng', pj: 2, pg: 2, pe: 0, pp: 0, gf: 5, gc: 1, dg: 4, pts: 6 },
    { pos: 2, teamId: 'cro', pj: 2, pg: 1, pe: 0, pp: 1, gf: 4, gc: 3, dg: 1, pts: 3 },
    { pos: 3, teamId: 'gha', pj: 2, pg: 0, pe: 1, pp: 1, gf: 2, gc: 4, dg: -2, pts: 1 },
    { pos: 4, teamId: 'pan', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 4, dg: -3, pts: 1 },
  ],
};

// ==================== MATCHES ====================
export const matches: Match[] = [
  // ===== Group A =====
  {
    id: 'm1', homeTeamId: 'mex', awayTeamId: 'rsa', homeScore: 3, awayScore: 0,
    date: '2026-06-11', time: '14:00', venue: 'Estadio Azteca', status: 'completed', group: 'A',
    scorers: [
      { player: 'S. Giménez', team: 'mex', minute: 18 },
      { player: 'H. Lozano', team: 'mex', minute: 45 },
      { player: 'S. Giménez', team: 'mex', minute: 72 },
    ],
    possession: { home: 61, away: 39 }, shots: { home: 15, away: 5 },
    corners: { home: 7, away: 2 }, fouls: { home: 8, away: 12 },
    standoutPlayer: 'S. Giménez',
    synthesis: 'México arrasó con Sudáfrica en el Azteca con un doblete de Giménez. El equipo de Jaime Lozano fue una tromba.',
  },
  {
    id: 'm2', homeTeamId: 'kor', awayTeamId: 'cze', homeScore: 2, awayScore: 2,
    date: '2026-06-11', time: '17:00', venue: 'Estadio BBVA', status: 'completed', group: 'A',
    scorers: [
      { player: 'H. Son', team: 'kor', minute: 22 },
      { player: 'H. Son', team: 'kor', minute: 67 },
      { player: 'P. Šulc', team: 'cze', minute: 35 },
      { player: 'A. Hložek', team: 'cze', minute: 80 },
    ],
    possession: { home: 52, away: 48 }, shots: { home: 12, away: 10 },
    corners: { home: 5, away: 4 }, fouls: { home: 9, away: 11 },
    standoutPlayer: 'H. Son',
    synthesis: 'Empate emocionante en Monterrey. Son brilló con un doblete pero Chequia nunca se rindió y lo empató en el final.',
  },
  // ===== Group B =====
  {
    id: 'm3', homeTeamId: 'sui', awayTeamId: 'can', homeScore: 2, awayScore: 1,
    date: '2026-06-12', time: '14:00', venue: 'Estadio BMO Field', status: 'completed', group: 'B',
    scorers: [
      { player: 'B. Embolo', team: 'sui', minute: 15 },
      { player: 'G. Xhaka', team: 'sui', minute: 55 },
      { player: 'A. Davies', team: 'can', minute: 78 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 11, away: 8 },
    corners: { home: 5, away: 3 }, fouls: { home: 7, away: 10 },
    standoutPlayer: 'G. Xhaka',
    synthesis: 'Suiza doblegó a Canadá en Toronto con un golazo de Xhaka desde fuera del área. Davies descontó tarde.',
  },
  {
    id: 'm4', homeTeamId: 'bih', awayTeamId: 'qat', homeScore: 2, awayScore: 0,
    date: '2026-06-12', time: '17:00', venue: 'Estadio de Vancouver', status: 'completed', group: 'B',
    scorers: [
      { player: 'E. Džeko', team: 'bih', minute: 28 },
      { player: 'E. Džeko', team: 'bih', minute: 63 },
    ],
    possession: { home: 48, away: 52 }, shots: { home: 9, away: 6 },
    corners: { home: 3, away: 5 }, fouls: { home: 11, away: 8 },
    standoutPlayer: 'E. Džeko',
    synthesis: 'Džeko demostró su clase con un doblete que le dio la victoria a Bosnia. Catar no pudo generar peligro.',
  },
  // ===== Group C =====
  {
    id: 'm5', homeTeamId: 'bra', awayTeamId: 'mar', homeScore: 3, awayScore: 1,
    date: '2026-06-12', time: '20:00', venue: 'SoFi Stadium', status: 'completed', group: 'C',
    scorers: [
      { player: 'Vinicius Jr.', team: 'bra', minute: 12 },
      { player: 'R. Rodrygo', team: 'bra', minute: 44 },
      { player: 'Vinicius Jr.', team: 'bra', minute: 71 },
      { player: 'H. Ziyech', team: 'mar', minute: 55 },
    ],
    possession: { home: 58, away: 42 }, shots: { home: 16, away: 7 },
    corners: { home: 8, away: 3 }, fouls: { home: 9, away: 13 },
    standoutPlayer: 'Vinicius Jr.',
    synthesis: 'Brasil deslumbró en Los Ángeles con Vinicius Jr. como gran figura. Marruecos intentó pero fue superado.',
  },
  {
    id: 'm6', homeTeamId: 'sco', awayTeamId: 'hai', homeScore: 2, awayScore: 0,
    date: '2026-06-12', time: '17:00', venue: 'Estadio de Seattle', status: 'completed', group: 'C',
    scorers: [
      { player: 'S. McTominay', team: 'sco', minute: 33 },
      { player: 'J. McGinn', team: 'sco', minute: 68 },
    ],
    possession: { home: 60, away: 40 }, shots: { home: 14, away: 4 },
    corners: { home: 6, away: 1 }, fouls: { home: 7, away: 9 },
    standoutPlayer: 'S. McTominay',
    synthesis: 'Escocia ganó con autoridad ante Haití. McTominay y McGinn fueron suficientes para los escoceses.',
  },
  // ===== Group D =====
  {
    id: 'm7', homeTeamId: 'usa', awayTeamId: 'par', homeScore: 2, awayScore: 0,
    date: '2026-06-13', time: '14:00', venue: 'MetLife Stadium', status: 'completed', group: 'D',
    scorers: [
      { player: 'C. Pulisic', team: 'usa', minute: 20 },
      { player: 'F. Balogun', team: 'usa', minute: 58 },
    ],
    possession: { home: 54, away: 46 }, shots: { home: 13, away: 6 },
    corners: { home: 5, away: 3 }, fouls: { home: 8, away: 10 },
    standoutPlayer: 'C. Pulisic',
    synthesis: 'Estados Unidos venció a Paraguay en Nueva York con un Pulisic inspirado. La defensa estadounidense fue impecable.',
  },
  {
    id: 'm8', homeTeamId: 'tur', awayTeamId: 'aus', homeScore: 3, awayScore: 1,
    date: '2026-06-13', time: '17:00', venue: 'Estadio de Dallas', status: 'completed', group: 'D',
    scorers: [
      { player: 'H. Çalhanoğlu', team: 'tur', minute: 10 },
      { player: 'C. Ünder', team: 'tur', minute: 42 },
      { player: 'H. Çalhanoğlu', team: 'tur', minute: 75 },
      { player: 'M. Leckie', team: 'aus', minute: 60 },
    ],
    possession: { home: 57, away: 43 }, shots: { home: 14, away: 7 },
    corners: { home: 6, away: 2 }, fouls: { home: 6, away: 9 },
    standoutPlayer: 'H. Çalhanoğlu',
    synthesis: 'Turquía arrasó con Australia liderada por Çalhanoğlu que anotó un doblete. Los Socceroos no tuvieron respuesta.',
  },
  // ===== Group E =====
  {
    id: 'm9', homeTeamId: 'ger', awayTeamId: 'ecu', homeScore: 3, awayScore: 1,
    date: '2026-06-13', time: '20:00', venue: 'Estadio de Houston', status: 'completed', group: 'E',
    scorers: [
      { player: 'J. Musiala', team: 'ger', minute: 15 },
      { player: 'K. Havertz', team: 'ger', minute: 40 },
      { player: 'J. Musiala', team: 'ger', minute: 72 },
      { player: 'E. Valencia', team: 'ecu', minute: 55 },
    ],
    possession: { home: 63, away: 37 }, shots: { home: 18, away: 5 },
    corners: { home: 9, away: 1 }, fouls: { home: 5, away: 8 },
    standoutPlayer: 'J. Musiala',
    synthesis: 'Alemania mostró su poderío con Musiala como estrella. Ecuador solo pudo descontar con Valencia.',
  },
  {
    id: 'm10', homeTeamId: 'civ', awayTeamId: 'cuw', homeScore: 1, awayScore: 1,
    date: '2026-06-13', time: '17:00', venue: 'Estadio de San Francisco', status: 'completed', group: 'E',
    scorers: [
      { player: 'S. Haller', team: 'civ', minute: 50 },
      { player: 'L. Bacuna', team: 'cuw', minute: 82 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 10, away: 7 },
    corners: { home: 4, away: 3 }, fouls: { home: 9, away: 7 },
    standoutPlayer: 'S. Haller',
    synthesis: 'Empate agónico entre Costa de Marfil y Curazao. Bacuna empató en el minuto 82 para salvar un punto.',
  },
  // ===== Group F =====
  {
    id: 'm11', homeTeamId: 'ned', awayTeamId: 'jpn', homeScore: 2, awayScore: 1,
    date: '2026-06-14', time: '14:00', venue: 'Estadio de Boston', status: 'completed', group: 'F',
    scorers: [
      { player: 'C. Gakpo', team: 'ned', minute: 25 },
      { player: 'F. de Jong', team: 'ned', minute: 60 },
      { player: 'K. Mitoma', team: 'jpn', minute: 70 },
    ],
    possession: { home: 56, away: 44 }, shots: { home: 13, away: 9 },
    corners: { home: 6, away: 4 }, fouls: { home: 7, away: 8 },
    standoutPlayer: 'C. Gakpo',
    synthesis: 'Países Bajos venció a Japón en un partido intenso. Gakpo abrió el camino y De Jong sentenció.',
  },
  {
    id: 'm12', homeTeamId: 'swe', awayTeamId: 'tun', homeScore: 1, awayScore: 1,
    date: '2026-06-14', time: '17:00', venue: 'Estadio de Filadelfia', status: 'completed', group: 'F',
    scorers: [
      { player: 'V. Gyökeres', team: 'swe', minute: 38 },
      { player: 'Y. Meriah', team: 'tun', minute: 65 },
    ],
    possession: { home: 50, away: 50 }, shots: { home: 8, away: 8 },
    corners: { home: 3, away: 4 }, fouls: { home: 10, away: 7 },
    standoutPlayer: 'V. Gyökeres',
    synthesis: 'Empate justo entre Suecia y Túnez. Ambos equipos lucharon pero ning pudo imponerse.',
  },
  // ===== Group G =====
  {
    id: 'm13', homeTeamId: 'bel', awayTeamId: 'egy', homeScore: 2, awayScore: 1,
    date: '2026-06-14', time: '20:00', venue: 'Estadio de Atlanta', status: 'completed', group: 'G',
    scorers: [
      { player: 'R. Lukaku', team: 'bel', minute: 22 },
      { player: 'K. De Bruyne', team: 'bel', minute: 55 },
      { player: 'M. Salah', team: 'egy', minute: 78 },
    ],
    possession: { home: 58, away: 42 }, shots: { home: 14, away: 7 },
    corners: { home: 7, away: 3 }, fouls: { home: 6, away: 9 },
    standoutPlayer: 'K. De Bruyne',
    synthesis: 'Bélgica doblegó a Egipto con De Bruyne como director orquesta. Salah descontó pero fue tarde.',
  },
  {
    id: 'm14', homeTeamId: 'iri', awayTeamId: 'nzl', homeScore: 1, awayScore: 1,
    date: '2026-06-14', time: '17:00', venue: 'Estadio de Miami', status: 'completed', group: 'G',
    scorers: [
      { player: 'S. Azmoun', team: 'iri', minute: 44 },
      { player: 'C. Wood', team: 'nzl', minute: 71 },
    ],
    possession: { home: 53, away: 47 }, shots: { home: 9, away: 7 },
    corners: { home: 4, away: 3 }, fouls: { home: 8, away: 6 },
    standoutPlayer: 'S. Azmoun',
    synthesis: 'Irán y Nueva Zelanda repartieron puntos en Miami. Partido parejo sin un claro dominador.',
  },
  // ===== Group H =====
  {
    id: 'm15', homeTeamId: 'esp', awayTeamId: 'ksa', homeScore: 3, awayScore: 0,
    date: '2026-06-15', time: '14:00', venue: 'Estadio de Chicago', status: 'completed', group: 'H',
    scorers: [
      { player: 'L. Yamal', team: 'esp', minute: 11 },
      { player: 'D. Olmo', team: 'esp', minute: 39 },
      { player: 'P. Pedri', team: 'esp', minute: 63 },
    ],
    possession: { home: 72, away: 28 }, shots: { home: 20, away: 3 },
    corners: { home: 10, away: 0 }, fouls: { home: 4, away: 6 },
    standoutPlayer: 'L. Yamal',
    synthesis: 'España aplastó a Arabia Saudita con una exhibición de toque. Yamal sigue deslumbrando al mundo.',
  },
  {
    id: 'm16', homeTeamId: 'uru', awayTeamId: 'cpv', homeScore: 2, awayScore: 1,
    date: '2026-06-15', time: '17:00', venue: 'Estadio de Nashville', status: 'completed', group: 'H',
    scorers: [
      { player: 'D. Núñez', team: 'uru', minute: 28 },
      { player: 'F. Valverde', team: 'uru', minute: 56 },
      { player: 'R. Mendes', team: 'cpv', minute: 74 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 12, away: 8 },
    corners: { home: 5, away: 3 }, fouls: { home: 7, away: 10 },
    standoutPlayer: 'F. Valverde',
    synthesis: 'Uruguay se impuso a Cabo Verde con golazos de Núñez y Valverde. Los africanos pelearon hasta el final.',
  },
  // ===== Group I =====
  {
    id: 'm17', homeTeamId: 'fra', awayTeamId: 'sen', homeScore: 2, awayScore: 1,
    date: '2026-06-15', time: '20:00', venue: 'Estadio de Los Ángeles', status: 'completed', group: 'I',
    scorers: [
      { player: 'K. Mbappé', team: 'fra', minute: 18 },
      { player: 'A. Griezmann', team: 'fra', minute: 52 },
      { player: 'I. Sarr', team: 'sen', minute: 67 },
    ],
    possession: { home: 57, away: 43 }, shots: { home: 13, away: 7 },
    corners: { home: 6, away: 2 }, fouls: { home: 8, away: 11 },
    standoutPlayer: 'K. Mbappé',
    synthesis: 'Francia venció a Senegal con Mbappé desequilibrante. Sarr descontó pero no alcanzó para los africanos.',
  },
  {
    id: 'm18', homeTeamId: 'nor', awayTeamId: 'irq', homeScore: 1, awayScore: 1,
    date: '2026-06-15', time: '17:00', venue: 'Estadio de Denver', status: 'completed', group: 'I',
    scorers: [
      { player: 'E. Haaland', team: 'nor', minute: 35 },
      { player: 'A. Hussein', team: 'irq', minute: 88 },
    ],
    possession: { home: 54, away: 46 }, shots: { home: 11, away: 8 },
    corners: { home: 5, away: 3 }, fouls: { home: 7, away: 9 },
    standoutPlayer: 'E. Haaland',
    synthesis: 'Noruega e Irak empataron en Denver. Haaland abrió la cuenta pero Hussein empató agónicamente.',
  },
  // ===== Group J =====
  {
    id: 'm19', homeTeamId: 'arg', awayTeamId: 'alg', homeScore: 4, awayScore: 0,
    date: '2026-06-16', time: '14:00', venue: 'Estadio de Dallas', status: 'completed', group: 'J',
    scorers: [
      { player: 'L. Messi', team: 'arg', minute: 12 },
      { player: 'J. Álvarez', team: 'arg', minute: 34 },
      { player: 'L. Messi', team: 'arg', minute: 55 },
      { player: 'E. Fernández', team: 'arg', minute: 78 },
    ],
    possession: { home: 65, away: 35 }, shots: { home: 18, away: 4 },
    corners: { home: 8, away: 1 }, fouls: { home: 5, away: 10 },
    standoutPlayer: 'L. Messi',
    synthesis: 'Argentina goleó a Argelia con Messi brillante. El equipo de Scaloni fue una máquina de fútbol.',
  },
  {
    id: 'm20', homeTeamId: 'aut', awayTeamId: 'jor', homeScore: 2, awayScore: 1,
    date: '2026-06-16', time: '17:00', venue: 'Estadio de Austin', status: 'completed', group: 'J',
    scorers: [
      { player: 'M. Arnautović', team: 'aut', minute: 25 },
      { player: 'K. Laimer', team: 'aut', minute: 62 },
      { player: 'M. Al-Taamari', team: 'jor', minute: 80 },
    ],
    possession: { home: 56, away: 44 }, shots: { home: 12, away: 7 },
    corners: { home: 5, away: 3 }, fouls: { home: 8, away: 10 },
    standoutPlayer: 'M. Arnautović',
    synthesis: 'Austria superó a Jordania con goles de Arnautović y Laimer. Al-Taamari descontó tarde para los asiáticos.',
  },
  // ===== Group K =====
  {
    id: 'm21', homeTeamId: 'por', awayTeamId: 'cod', homeScore: 3, awayScore: 0,
    date: '2026-06-16', time: '20:00', venue: 'Estadio de Houston', status: 'completed', group: 'K',
    scorers: [
      { player: 'C. Ronaldo', team: 'por', minute: 18 },
      { player: 'B. Silva', team: 'por', minute: 45 },
      { player: 'C. Ronaldo', team: 'por', minute: 80 },
    ],
    possession: { home: 60, away: 40 }, shots: { home: 15, away: 5 },
    corners: { home: 7, away: 2 }, fouls: { home: 5, away: 8 },
    standoutPlayer: 'C. Ronaldo',
    synthesis: 'Ronaldo brilló con un doblete ante Congo DR. Portugal fue superior en todas las líneas.',
  },
  {
    id: 'm22', homeTeamId: 'col', awayTeamId: 'uzb', homeScore: 2, awayScore: 0,
    date: '2026-06-16', time: '17:00', venue: 'Estadio de Phoenix', status: 'completed', group: 'K',
    scorers: [
      { player: 'L. Díaz', team: 'col', minute: 30 },
      { player: 'J. Arias', team: 'col', minute: 68 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 11, away: 6 },
    corners: { home: 5, away: 3 }, fouls: { home: 7, away: 9 },
    standoutPlayer: 'L. Díaz',
    synthesis: 'Colombia venció a Uzbekistán con Luiz Díaz como figura. Los cafeteros se muestran sólidos.',
  },
  // ===== Group L =====
  {
    id: 'm23', homeTeamId: 'eng', awayTeamId: 'cro', homeScore: 2, awayScore: 1,
    date: '2026-06-17', time: '14:00', venue: 'Wembley Stadium', status: 'completed', group: 'L',
    scorers: [
      { player: 'H. Kane', team: 'eng', minute: 27 },
      { player: 'B. Saka', team: 'eng', minute: 55 },
      { player: 'L. Modrić', team: 'cro', minute: 70 },
    ],
    possession: { home: 51, away: 49 }, shots: { home: 10, away: 9 },
    corners: { home: 4, away: 5 }, fouls: { home: 11, away: 7 },
    standoutPlayer: 'B. Saka',
    synthesis: 'Inglaterra venció a Croacia en Wembley con Saka como figura. Modrić descontó pero no alcanzó.',
  },
  {
    id: 'm24', homeTeamId: 'gha', awayTeamId: 'pan', homeScore: 1, awayScore: 1,
    date: '2026-06-17', time: '17:00', venue: 'Estadio de Cardiff', status: 'completed', group: 'L',
    scorers: [
      { player: 'M. Kudus', team: 'gha', minute: 40 },
      { player: 'I. Díaz', team: 'pan', minute: 75 },
    ],
    possession: { home: 52, away: 48 }, shots: { home: 9, away: 7 },
    corners: { home: 4, away: 3 }, fouls: { home: 8, away: 7 },
    standoutPlayer: 'M. Kudus',
    synthesis: 'Ghana y Panamá empataron en un partido parejo. Kudus abrió pero Díaz empató en la recta final.',
  },

  // ===== LIVE MATCHES =====
  {
    id: 'm25', homeTeamId: 'mex', awayTeamId: 'cze', homeScore: 1, awayScore: 1,
    date: '2026-06-20', time: '14:00', venue: 'Estadio Azteca', status: 'live', group: 'A',
    minute: 62,
    scorers: [
      { player: 'S. Giménez', team: 'mex', minute: 15 },
      { player: 'A. Hložek', team: 'cze', minute: 44 },
    ],
    possession: { home: 56, away: 44 }, shots: { home: 9, away: 6 },
    corners: { home: 4, away: 2 }, fouls: { home: 5, away: 7 },
    standoutPlayer: 'S. Giménez',
  },
  {
    id: 'm26', homeTeamId: 'bra', awayTeamId: 'sco', homeScore: 2, awayScore: 0,
    date: '2026-06-20', time: '17:00', venue: 'SoFi Stadium', status: 'live', group: 'C',
    minute: 55,
    scorers: [
      { player: 'Vinicius Jr.', team: 'bra', minute: 20 },
      { player: 'R. Rodrygo', team: 'bra', minute: 48 },
    ],
    possession: { home: 62, away: 38 }, shots: { home: 12, away: 4 },
    corners: { home: 6, away: 1 }, fouls: { home: 4, away: 8 },
    standoutPlayer: 'Vinicius Jr.',
  },
  {
    id: 'm27', homeTeamId: 'esp', awayTeamId: 'uru', homeScore: 1, awayScore: 1,
    date: '2026-06-20', time: '20:00', venue: 'Estadio de Chicago', status: 'live', group: 'H',
    minute: 70,
    scorers: [
      { player: 'L. Yamal', team: 'esp', minute: 33 },
      { player: 'F. Valverde', team: 'uru', minute: 57 },
    ],
    possession: { home: 65, away: 35 }, shots: { home: 14, away: 5 },
    corners: { home: 7, away: 2 }, fouls: { home: 3, away: 6 },
    standoutPlayer: 'L. Yamal',
  },
  {
    id: 'm28', homeTeamId: 'arg', awayTeamId: 'aut', homeScore: 3, awayScore: 0,
    date: '2026-06-20', time: '20:00', venue: 'Estadio de Dallas', status: 'live', group: 'J',
    minute: 75,
    scorers: [
      { player: 'L. Messi', team: 'arg', minute: 8 },
      { player: 'J. Álvarez', team: 'arg', minute: 35 },
      { player: 'L. Messi', team: 'arg', minute: 68 },
    ],
    possession: { home: 64, away: 36 }, shots: { home: 15, away: 3 },
    corners: { home: 7, away: 1 }, fouls: { home: 4, away: 8 },
    standoutPlayer: 'L. Messi',
  },
  {
    id: 'm29', homeTeamId: 'fra', awayTeamId: 'nor', homeScore: 1, awayScore: 2,
    date: '2026-06-20', time: '17:00', venue: 'Estadio de Los Ángeles', status: 'live', group: 'I',
    minute: 58,
    scorers: [
      { player: 'K. Mbappé', team: 'fra', minute: 22 },
      { player: 'E. Haaland', team: 'nor', minute: 30 },
      { player: 'E. Haaland', team: 'nor', minute: 52 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 10, away: 9 },
    corners: { home: 4, away: 3 }, fouls: { home: 6, away: 7 },
    standoutPlayer: 'E. Haaland',
  },

  // ===== UPCOMING MATCHES =====
  {
    id: 'm30', homeTeamId: 'kor', awayTeamId: 'rsa', homeScore: null, awayScore: null,
    date: '2026-06-23', time: '14:00', venue: 'Estadio BBVA', status: 'upcoming', group: 'A',
  },
  {
    id: 'm31', homeTeamId: 'sui', awayTeamId: 'bih', homeScore: null, awayScore: null,
    date: '2026-06-23', time: '17:00', venue: 'Estadio BMO Field', status: 'upcoming', group: 'B',
  },
  {
    id: 'm32', homeTeamId: 'mar', awayTeamId: 'hai', homeScore: null, awayScore: null,
    date: '2026-06-23', time: '14:00', venue: 'SoFi Stadium', status: 'upcoming', group: 'C',
  },
  {
    id: 'm33', homeTeamId: 'usa', awayTeamId: 'tur', homeScore: null, awayScore: null,
    date: '2026-06-23', time: '20:00', venue: 'MetLife Stadium', status: 'upcoming', group: 'D',
  },
  {
    id: 'm34', homeTeamId: 'ger', awayTeamId: 'civ', homeScore: null, awayScore: null,
    date: '2026-06-24', time: '14:00', venue: 'Estadio de Houston', status: 'upcoming', group: 'E',
  },
  {
    id: 'm35', homeTeamId: 'ned', awayTeamId: 'swe', homeScore: null, awayScore: null,
    date: '2026-06-24', time: '17:00', venue: 'Estadio de Boston', status: 'upcoming', group: 'F',
  },
  {
    id: 'm36', homeTeamId: 'bel', awayTeamId: 'iri', homeScore: null, awayScore: null,
    date: '2026-06-24', time: '20:00', venue: 'Estadio de Atlanta', status: 'upcoming', group: 'G',
  },
  {
    id: 'm37', homeTeamId: 'esp', awayTeamId: 'cpv', homeScore: null, awayScore: null,
    date: '2026-06-24', time: '14:00', venue: 'Estadio de Chicago', status: 'upcoming', group: 'H',
  },
  {
    id: 'm38', homeTeamId: 'fra', awayTeamId: 'irq', homeScore: null, awayScore: null,
    date: '2026-06-25', time: '14:00', venue: 'Estadio de Los Ángeles', status: 'upcoming', group: 'I',
  },
  {
    id: 'm39', homeTeamId: 'arg', awayTeamId: 'jor', homeScore: null, awayScore: null,
    date: '2026-06-25', time: '17:00', venue: 'Estadio de Dallas', status: 'upcoming', group: 'J',
  },
  {
    id: 'm40', homeTeamId: 'por', awayTeamId: 'col', homeScore: null, awayScore: null,
    date: '2026-06-25', time: '20:00', venue: 'Estadio de Houston', status: 'upcoming', group: 'K',
  },
  {
    id: 'm41', homeTeamId: 'eng', awayTeamId: 'gha', homeScore: null, awayScore: null,
    date: '2026-06-26', time: '14:00', venue: 'Wembley Stadium', status: 'upcoming', group: 'L',
  },
  {
    id: 'm42', homeTeamId: 'cro', awayTeamId: 'pan', homeScore: null, awayScore: null,
    date: '2026-06-26', time: '17:00', venue: 'Estadio de Cardiff', status: 'upcoming', group: 'L',
  },
];

// ==================== SCORERS (30+) ====================
export const scorers: Scorer[] = [
  { id: 's1', name: 'L. Messi', teamId: 'arg', goals: 5, assists: 2, position: 'Delantero' },
  { id: 's2', name: 'S. Giménez', teamId: 'mex', goals: 4, assists: 1, position: 'Delantero' },
  { id: 's3', name: 'K. Mbappé', teamId: 'fra', goals: 4, assists: 1, position: 'Delantero' },
  { id: 's4', name: 'Vinicius Jr.', teamId: 'bra', goals: 4, assists: 2, position: 'Extremo' },
  { id: 's5', name: 'L. Yamal', teamId: 'esp', goals: 4, assists: 2, position: 'Extremo' },
  { id: 's6', name: 'E. Haaland', teamId: 'nor', goals: 3, assists: 0, position: 'Delantero' },
  { id: 's7', name: 'C. Ronaldo', teamId: 'por', goals: 3, assists: 1, position: 'Delantero' },
  { id: 's8', name: 'J. Musiala', teamId: 'ger', goals: 3, assists: 1, position: 'Mediocampista' },
  { id: 's9', name: 'H. Çalhanoğlu', teamId: 'tur', goals: 3, assists: 1, position: 'Mediocampista' },
  { id: 's10', name: 'H. Son', teamId: 'kor', goals: 3, assists: 1, position: 'Extremo' },
  { id: 's11', name: 'C. Pulisic', teamId: 'usa', goals: 2, assists: 2, position: 'Extremo' },
  { id: 's12', name: 'J. Álvarez', teamId: 'arg', goals: 2, assists: 1, position: 'Delantero' },
  { id: 's13', name: 'R. Lukaku', teamId: 'bel', goals: 2, assists: 1, position: 'Delantero' },
  { id: 's14', name: 'C. Gakpo', teamId: 'ned', goals: 2, assists: 2, position: 'Delantero' },
  { id: 's15', name: 'D. Núñez', teamId: 'uru', goals: 2, assists: 0, position: 'Delantero' },
  { id: 's16', name: 'R. Rodrygo', teamId: 'bra', goals: 2, assists: 1, position: 'Extremo' },
  { id: 's17', name: 'E. Džeko', teamId: 'bih', goals: 2, assists: 0, position: 'Delantero' },
  { id: 's18', name: 'H. Kane', teamId: 'eng', goals: 2, assists: 1, position: 'Delantero' },
  { id: 's19', name: 'L. Díaz', teamId: 'col', goals: 2, assists: 1, position: 'Extremo' },
  { id: 's20', name: 'K. De Bruyne', teamId: 'bel', goals: 1, assists: 3, position: 'Mediocampista' },
  { id: 's21', name: 'F. de Jong', teamId: 'ned', goals: 1, assists: 2, position: 'Mediocampista' },
  { id: 's22', name: 'B. Silva', teamId: 'por', goals: 1, assists: 2, position: 'Mediocampista' },
  { id: 's23', name: 'B. Saka', teamId: 'eng', goals: 1, assists: 2, position: 'Extremo' },
  { id: 's24', name: 'M. Salah', teamId: 'egy', goals: 1, assists: 1, position: 'Extremo' },
  { id: 's25', name: 'F. Valverde', teamId: 'uru', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's26', name: 'P. Pedri', teamId: 'esp', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's27', name: 'D. Olmo', teamId: 'esp', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's28', name: 'H. Lozano', teamId: 'mex', goals: 1, assists: 1, position: 'Extremo' },
  { id: 's29', name: 'K. Havertz', teamId: 'ger', goals: 1, assists: 1, position: 'Delantero' },
  { id: 's30', name: 'S. McTominay', teamId: 'sco', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's31', name: 'M. Kudus', teamId: 'gha', goals: 1, assists: 0, position: 'Mediocampista' },
  { id: 's32', name: 'V. Gyökeres', teamId: 'swe', goals: 1, assists: 1, position: 'Delantero' },
  { id: 's33', name: 'M. Arnautović', teamId: 'aut', goals: 1, assists: 1, position: 'Delantero' },
  { id: 's34', name: 'E. Fernández', teamId: 'arg', goals: 1, assists: 1, position: 'Mediocampista' },
];

// ==================== RED CARDS (8+) ====================
export const redCards: RedCard[] = [
  { id: 'rc1', playerName: 'T. Mosquera', teamId: 'rsa', matchId: 'm1', minute: 78, reason: 'Entrada violenta', suspensionStatus: 'Activa' },
  { id: 'rc2', playerName: 'V. Coufal', teamId: 'cze', matchId: 'm2', minute: 89, reason: 'Doble amarilla', suspensionStatus: 'Cumplida' },
  { id: 'rc3', playerName: 'A. Abdelkarim', teamId: 'qat', matchId: 'm4', minute: 55, reason: 'Mano intencional', suspensionStatus: 'Activa' },
  { id: 'rc4', playerName: 'B. Bello', teamId: 'hai', matchId: 'm6', minute: 43, reason: 'Última falta', suspensionStatus: 'Cumplida' },
  { id: 'rc5', playerName: 'K. Aziz', teamId: 'tun', matchId: 'm12', minute: 70, reason: 'Entrada por detrás', suspensionStatus: 'Activa' },
  { id: 'rc6', playerName: 'R. Mendes', teamId: 'cpv', matchId: 'm16', minute: 82, reason: 'Agresión', suspensionStatus: 'Activa' },
  { id: 'rc7', playerName: 'S. Al-Dawsari', teamId: 'ksa', matchId: 'm15', minute: 60, reason: 'Doble amarilla', suspensionStatus: 'Cumplida' },
  { id: 'rc8', playerName: 'M. Al-Rashdan', teamId: 'jor', matchId: 'm20', minute: 35, reason: 'Entrada violenta', suspensionStatus: 'Activa' },
  { id: 'rc9', playerName: 'A. Kudus', teamId: 'gha', matchId: 'm24', minute: 50, reason: 'Mano intencional', suspensionStatus: 'Cumplida' },
];

// ==================== NEWS (6+) ====================
export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Messi lidera la goleada de Argentina ante Argelia',
    summary: 'Con un doblete del astro argentino, la selección albiceleste aplastó 4-0 a los norteafricanos en Dallas.',
    category: 'En Vivo',
    date: '2026-06-16',
    imageKeyword: 'messi',
  },
  {
    id: 'n2',
    title: 'Yamal: la gran promesa que deslumbra al mundo',
    summary: 'El joven español suma 4 goles en el torneo y es candidato a la Bota de Oro. Su rendimiento es histórico para su edad.',
    category: 'Especial',
    date: '2026-06-15',
    imageKeyword: 'yamal',
  },
  {
    id: 'n3',
    title: 'Haaland doblega a Francia con un doblete histórico',
    summary: 'Noruega le da la vuelta al partido contra Francia con dos goles de Haaland en un partido que se juega actualmente.',
    category: 'En Vivo',
    date: '2026-06-20',
    imageKeyword: 'haaland',
  },
  {
    id: 'n4',
    title: 'México y Brasil lideran sus grupos con autoridad',
    summary: 'Ambas selecciones muestran un nivel de juego superior y se perfilan como candidatas al título mundial.',
    category: 'Análisis',
    date: '2026-06-18',
    imageKeyword: 'mexico',
  },
  {
    id: 'n5',
    title: 'España aplasta a Arabia Saudita con exhibición de toque',
    summary: 'La Roja demostró su dominio absoluto con un 72% de posesión y tres goles de lujo en Chicago.',
    category: 'Resultados',
    date: '2026-06-15',
    imageKeyword: 'spain',
  },
  {
    id: 'n6',
    title: 'Ronaldo sigue haciendo historia con Portugal',
    summary: 'CR7 anotó su doblete número 15 en mundiales y sigue ampliando su récord como máximo goleador en torneos FIFA.',
    category: 'Especial',
    date: '2026-06-16',
    imageKeyword: 'ronaldo',
  },
  {
    id: 'n7',
    title: 'Estados Unidos firma su pase a la siguiente ronda',
    summary: 'Con Pulisic como bandera, el equipo anfitrión venció a Paraguay y aseguró su clasificación al round of 32.',
    category: 'Clasificación',
    date: '2026-06-17',
    imageKeyword: 'usa',
  },
];

// ==================== MATCH SYNTHESES (8+) ====================
export const matchSyntheses: MatchSynthesis[] = [
  {
    matchId: 'm1',
    strengths: { team: 'México', points: ['Ataque vertical implacable', 'Giménez letal en el área', 'Presión alta efectiva'] },
    weaknesses: { team: 'Sudáfrica', points: ['Defensa desordenada', 'Sin generación de juego', 'Expulsión de Mosquera'] },
    keyMoments: ['Gol de Giménez a los 18\' para abrir el marcador', 'Expulsión de Mosquera a los 78\'', 'Doblete de Giménez sentencia el partido'],
    ratings: [{ team: 'México', rating: 8.5 }, { team: 'Sudáfrica', rating: 3.5 }],
  },
  {
    matchId: 'm5',
    strengths: { team: 'Brasil', points: ['Vinicius Jr. imparable', 'Velocidad en las bandas', 'Presión alta sofocante'] },
    weaknesses: { team: 'Marruecos', points: ['No pudo contener a Vinicius', 'Pocas opciones ofensivas', 'Ziyech muy solo'] },
    keyMoments: ['Gol de Vinicius a los 12\'', 'Gol de Rodrygo antes del descanso', 'Doblete de Vinicius en el 71\''],
    ratings: [{ team: 'Brasil', rating: 8.0 }, { team: 'Marruecos', rating: 5.0 }],
  },
  {
    matchId: 'm9',
    strengths: { team: 'Alemania', points: ['Musiala desequilibrante', 'Dominio absoluto del balón', 'Defensa sólida'] },
    weaknesses: { team: 'Ecuador', points: ['No pudo salir de su campo', 'Solo 3 tiros a puerta', 'Valencia muy aislado'] },
    keyMoments: ['Gol de Musiala a los 15\'', 'Gol de Havertz antes del descanso', 'Doblete de Musiala sentencia'],
    ratings: [{ team: 'Alemania', rating: 9.0 }, { team: 'Ecuador', rating: 4.0 }],
  },
  {
    matchId: 'm15',
    strengths: { team: 'España', points: ['Toque corto impecable', 'Yamal eléctrico por la banda', '72% de posesión'] },
    weaknesses: { team: 'Arabia Saudita', points: ['Sin respuesta al pressing', 'Cero tiros a puerta', 'Expulsión de Al-Dawsari'] },
    keyMoments: ['Gol de Yamal a los 11\'', 'Expulsión de Al-Dawsari a los 60\'', 'Gol de Pedri tras gran jugada colectiva'],
    ratings: [{ team: 'España', rating: 9.5 }, { team: 'Arabia Saudita', rating: 2.5 }],
  },
  {
    matchId: 'm17',
    strengths: { team: 'Francia', points: ['Mbappé desequilibrante', 'Velocidad en transición', 'Griezmann como enlace perfecto'] },
    weaknesses: { team: 'Senegal', points: ['Defensa frágil', 'Sarr muy solo arriba', 'Poca profundidad'] },
    keyMoments: ['Gol de Mbappé a los 18\'', 'Gol de Griezmann tras gran jugada', 'Descuento de Sarr insuficiente'],
    ratings: [{ team: 'Francia', rating: 7.5 }, { team: 'Senegal', rating: 5.0 }],
  },
  {
    matchId: 'm19',
    strengths: { team: 'Argentina', points: ['Messi en estado de gracia', 'Álvarez como socio perfecto', '65% de posesión'] },
    weaknesses: { team: 'Argelia', points: ['No pudieron salir de su campo', 'Sin llegada clara', 'Falta de intensidad'] },
    keyMoments: ['Gol de Messi a los 12\'', 'Doblete de Messi en el 55\'', 'Gol de Fernández para cerrar la goleada'],
    ratings: [{ team: 'Argentina', rating: 9.0 }, { team: 'Argelia', rating: 3.0 }],
  },
  {
    matchId: 'm23',
    strengths: { team: 'Inglaterra', points: ['Saka incisivo por la banda', 'Kane letal de penal', 'Defensa compacta'] },
    weaknesses: { team: 'Croacia', points: ['Modrić muy solo en mediocampo', 'Poca profundidad ofensiva', 'Lento en transición'] },
    keyMoments: ['Gol de Kane de penal a los 27\'', 'Golazo de Saka cortando por dentro', 'Descuento de Modrić en el 70\''],
    ratings: [{ team: 'Inglaterra', rating: 7.0 }, { team: 'Croacia', rating: 5.5 }],
  },
  {
    matchId: 'm21',
    strengths: { team: 'Portugal', points: ['Ronaldo letal en el área', 'Silva como director', 'Dominio del mediocampo'] },
    weaknesses: { team: 'Congo DR', points: ['Sin capacidad de reacción', 'Pocas llegadas', 'Desorden defensivo'] },
    keyMoments: ['Gol de Ronaldo a los 18\'', 'Gol de Silva antes del descanso', 'Doblete de Ronaldo en el 80\''],
    ratings: [{ team: 'Portugal', rating: 8.0 }, { team: 'Congo DR', rating: 3.5 }],
  },
  {
    matchId: 'm13',
    strengths: { team: 'Bélgica', points: ['De Bruyne como director orquesta', 'Lukaku implacable', 'Control del tempo'] },
    weaknesses: { team: 'Egipto', points: ['Dependencia excesiva de Salah', 'Poca profundidad colectiva', 'Defensa lenta'] },
    keyMoments: ['Gol de Lukaku a los 22\'', 'Golazo de De Bruyne desde fuera', 'Descuento de Salah en el 78\''],
    ratings: [{ team: 'Bélgica', rating: 7.5 }, { team: 'Egipto', rating: 5.0 }],
  },
];

// ==================== VOTING DATA (6+) ====================
export const votingMatches: VotingMatch[] = [
  {
    matchId: 'm25',
    homeTeamId: 'mex',
    awayTeamId: 'cze',
    candidates: [
      { id: 'v1', name: 'S. Giménez', teamId: 'mex', votes: 342 },
      { id: 'v2', name: 'H. Lozano', teamId: 'mex', votes: 128 },
      { id: 'v3', name: 'A. Hložek', teamId: 'cze', votes: 89 },
      { id: 'v4', name: 'P. Šulc', teamId: 'cze', votes: 45 },
    ],
  },
  {
    matchId: 'm26',
    homeTeamId: 'bra',
    awayTeamId: 'sco',
    candidates: [
      { id: 'v5', name: 'Vinicius Jr.', teamId: 'bra', votes: 456 },
      { id: 'v6', name: 'R. Rodrygo', teamId: 'bra', votes: 198 },
      { id: 'v7', name: 'S. McTominay', teamId: 'sco', votes: 67 },
      { id: 'v8', name: 'J. McGinn', teamId: 'sco', votes: 34 },
    ],
  },
  {
    matchId: 'm27',
    homeTeamId: 'esp',
    awayTeamId: 'uru',
    candidates: [
      { id: 'v9', name: 'L. Yamal', teamId: 'esp', votes: 389 },
      { id: 'v10', name: 'F. Valverde', teamId: 'uru', votes: 267 },
      { id: 'v11', name: 'P. Pedri', teamId: 'esp', votes: 112 },
      { id: 'v12', name: 'D. Núñez', teamId: 'uru', votes: 78 },
    ],
  },
  {
    matchId: 'm28',
    homeTeamId: 'arg',
    awayTeamId: 'aut',
    candidates: [
      { id: 'v13', name: 'L. Messi', teamId: 'arg', votes: 567 },
      { id: 'v14', name: 'J. Álvarez', teamId: 'arg', votes: 189 },
      { id: 'v15', name: 'M. Arnautović', teamId: 'aut', votes: 34 },
      { id: 'v16', name: 'K. Laimer', teamId: 'aut', votes: 22 },
    ],
  },
  {
    matchId: 'm29',
    homeTeamId: 'fra',
    awayTeamId: 'nor',
    candidates: [
      { id: 'v17', name: 'E. Haaland', teamId: 'nor', votes: 412 },
      { id: 'v18', name: 'K. Mbappé', teamId: 'fra', votes: 345 },
      { id: 'v19', name: 'A. Griezmann', teamId: 'fra', votes: 89 },
      { id: 'v20', name: 'M. Ødegaard', teamId: 'nor', votes: 56 },
    ],
  },
  {
    matchId: 'm19',
    homeTeamId: 'arg',
    awayTeamId: 'alg',
    candidates: [
      { id: 'v21', name: 'L. Messi', teamId: 'arg', votes: 523 },
      { id: 'v22', name: 'J. Álvarez', teamId: 'arg', votes: 145 },
      { id: 'v23', name: 'E. Fernández', teamId: 'arg', votes: 98 },
      { id: 'v24', name: 'I. Bennacer', teamId: 'alg', votes: 18 },
    ],
  },
];

// ==================== BANNERS (8+) ====================
export const banners: Banner[] = [
  {
    id: 'b1',
    title: 'Adidas - Impossible Is Nothing',
    imageUrl: '/banners/adidas.jpg',
    linkUrl: 'https://adidas.com',
    position: 'hero',
    active: true,
    priority: 1,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 45230,
    clicks: 1230,
    createdBy: 'admin',
  },
  {
    id: 'b2',
    title: 'Coca-Cola - Sabor del Mundial',
    imageUrl: '/banners/cocacola.jpg',
    linkUrl: 'https://coca-cola.com',
    position: 'sidebar',
    active: true,
    priority: 2,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 32100,
    clicks: 890,
    createdBy: 'comercial',
  },
  {
    id: 'b3',
    title: 'Visa - Tu Entrada al Mundial',
    imageUrl: '/banners/visa.jpg',
    linkUrl: 'https://visa.com',
    position: 'content-top',
    active: true,
    priority: 1,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 28700,
    clicks: 654,
    createdBy: 'comercial',
  },
  {
    id: 'b4',
    title: 'Hyundai - Drive the Game',
    imageUrl: '/banners/hyundai.jpg',
    linkUrl: 'https://hyundai.com',
    position: 'footer',
    active: true,
    priority: 3,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 19800,
    clicks: 432,
    createdBy: 'admin',
  },
  {
    id: 'b5',
    title: 'Qatar Airways - Viaja al Mundial',
    imageUrl: '/banners/qatar-airways.jpg',
    linkUrl: 'https://qatarairways.com',
    position: 'hero',
    active: true,
    priority: 2,
    startDate: '2026-06-10',
    endDate: '2026-07-15',
    impressions: 52400,
    clicks: 1870,
    createdBy: 'comercial',
  },
  {
    id: 'b6',
    title: "McDonald's - Sabor Ganador",
    imageUrl: '/banners/mcdonalds.jpg',
    linkUrl: 'https://mcdonalds.com',
    position: 'content-bottom',
    active: true,
    priority: 2,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 22100,
    clicks: 543,
    createdBy: 'comercial',
  },
  {
    id: 'b7',
    title: 'Wanda Group - Sponsor Oficial',
    imageUrl: '/banners/wanda.jpg',
    linkUrl: 'https://wanda-group.com',
    position: 'sidebar',
    active: true,
    priority: 1,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 15600,
    clicks: 321,
    createdBy: 'admin',
  },
  {
    id: 'b8',
    title: 'Hisense - Ve el Mundial en 4K',
    imageUrl: '/banners/hisense.jpg',
    linkUrl: 'https://hisense.com',
    position: 'content-top',
    active: true,
    priority: 2,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 18300,
    clicks: 478,
    createdBy: 'comercial',
  },
  {
    id: 'b9',
    title: 'Adidas - Nuevas Botas del Mundial',
    imageUrl: '/banners/adidas-boots.jpg',
    linkUrl: 'https://adidas.com/boots',
    position: 'content-bottom',
    active: false,
    priority: 3,
    startDate: '2026-06-15',
    endDate: '2026-07-20',
    impressions: 8200,
    clicks: 156,
    createdBy: 'comercial',
  },
];

// ==================== HELPERS ====================
export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getTeamName(id: string): string {
  return teams.find(t => t.id === id)?.name ?? id;
}

export function getTeamFlag(id: string): string {
  return teams.find(t => t.id === id)?.flag ?? '⚽';
}

export function getTeamsByGroup(group: GroupLetter): Team[] {
  return teams.filter(t => t.group === group);
}

export function getStandingsByGroup(group: GroupLetter): Standing[] {
  return standings[group] ?? [];
}

export function getMatchesByGroup(group: GroupLetter): Match[] {
  return matches.filter(m => m.group === group);
}

export const allGroups: GroupLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
