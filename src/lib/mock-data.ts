// Mock Data for "Nuevo Día Mundial" Sports Portal

export interface Team {
  id: string;
  name: string;
  flag: string;
  group: 'A' | 'B';
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
  group: 'A' | 'B';
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

// TEAMS
export const teams: Team[] = [
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', group: 'A' },
  { id: 'bra', name: 'Brasil', flag: '🇧🇷', group: 'A' },
  { id: 'fra', name: 'Francia', flag: '🇫🇷', group: 'A' },
  { id: 'ger', name: 'Alemania', flag: '🇩🇪', group: 'A' },
  { id: 'esp', name: 'España', flag: '🇪🇸', group: 'B' },
  { id: 'eng', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'B' },
  { id: 'por', name: 'Portugal', flag: '🇵🇹', group: 'B' },
  { id: 'ned', name: 'Países Bajos', flag: '🇳🇱', group: 'B' },
];

// STANDINGS
export const standingsA: Standing[] = [
  { pos: 1, teamId: 'arg', pj: 3, pg: 2, pe: 1, pp: 0, gf: 7, gc: 2, dg: 5, pts: 7 },
  { pos: 2, teamId: 'fra', pj: 3, pg: 2, pe: 0, pp: 1, gf: 6, gc: 4, dg: 2, pts: 6 },
  { pos: 3, teamId: 'bra', pj: 3, pg: 1, pe: 1, pp: 1, gf: 5, gc: 5, dg: 0, pts: 4 },
  { pos: 4, teamId: 'ger', pj: 3, pg: 0, pe: 0, pp: 3, gf: 2, gc: 9, dg: -7, pts: 0 },
];

export const standingsB: Standing[] = [
  { pos: 1, teamId: 'esp', pj: 3, pg: 3, pe: 0, pp: 0, gf: 8, gc: 2, dg: 6, pts: 9 },
  { pos: 2, teamId: 'eng', pj: 3, pg: 2, pe: 0, pp: 1, gf: 5, gc: 3, dg: 2, pts: 6 },
  { pos: 3, teamId: 'por', pj: 3, pg: 1, pe: 0, pp: 2, gf: 4, gc: 6, dg: -2, pts: 3 },
  { pos: 4, teamId: 'ned', pj: 3, pg: 0, pe: 0, pp: 3, gf: 2, gc: 8, dg: -6, pts: 0 },
];

// MATCHES
export const matches: Match[] = [
  // Completed matches - Group A
  {
    id: 'm1', homeTeamId: 'arg', awayTeamId: 'bra', homeScore: 3, awayScore: 1,
    date: '2026-06-10', time: '15:00', venue: 'Estadio Nacional', status: 'completed', group: 'A',
    scorers: [
      { player: 'L. Messi', team: 'arg', minute: 12 },
      { player: 'J. Álvarez', team: 'arg', minute: 34 },
      { player: 'L. Messi', team: 'arg', minute: 78 },
      { player: 'Vinicius Jr.', team: 'bra', minute: 55 },
    ],
    possession: { home: 58, away: 42 }, shots: { home: 14, away: 8 },
    corners: { home: 6, away: 3 }, fouls: { home: 10, away: 14 },
    standoutPlayer: 'L. Messi',
    synthesis: 'Argentina dominó el partido con una exhibición de fútbol colectivo. Messi brilló con un doblete y fue la figura indiscutida.',
  },
  {
    id: 'm2', homeTeamId: 'fra', awayTeamId: 'ger', homeScore: 2, awayScore: 0,
    date: '2026-06-10', time: '18:00', venue: 'Estadio Central', status: 'completed', group: 'A',
    scorers: [
      { player: 'K. Mbappé', team: 'fra', minute: 23 },
      { player: 'A. Griezmann', team: 'fra', minute: 67 },
    ],
    possession: { home: 55, away: 45 }, shots: { home: 12, away: 6 },
    corners: { home: 5, away: 4 }, fouls: { home: 8, away: 11 },
    standoutPlayer: 'K. Mbappé',
    synthesis: 'Francia controló el ritmo del encuentro con velocidad en las bandas. Mbappé desequilibró cada vez que tocó la pelota.',
  },
  {
    id: 'm3', homeTeamId: 'arg', awayTeamId: 'fra', homeScore: 2, awayScore: 2,
    date: '2026-06-14', time: '15:00', venue: 'Estadio Monumental', status: 'completed', group: 'A',
    scorers: [
      { player: 'L. Messi', team: 'arg', minute: 8 },
      { player: 'J. Álvarez', team: 'arg', minute: 51 },
      { player: 'K. Mbappé', team: 'fra', minute: 30 },
      { player: 'K. Mbappé', team: 'fra', minute: 89 },
    ],
    possession: { home: 52, away: 48 }, shots: { home: 11, away: 13 },
    corners: { home: 4, away: 5 }, fouls: { home: 12, away: 9 },
    standoutPlayer: 'K. Mbappé',
    synthesis: 'Empate agónico. Mbappé rescató un punto con un gol en el minuto 89. Partido espectacular de ida y vuelta.',
  },
  {
    id: 'm4', homeTeamId: 'bra', awayTeamId: 'ger', homeScore: 3, awayScore: 2,
    date: '2026-06-14', time: '18:00', venue: 'Estadio Nacional', status: 'completed', group: 'A',
    scorers: [
      { player: 'Vinicius Jr.', team: 'bra', minute: 15 },
      { player: 'R. Rodrygo', team: 'bra', minute: 44 },
      { player: 'Vinicius Jr.', team: 'bra', minute: 71 },
      { player: 'K. Havertz', team: 'ger', minute: 33 },
      { player: 'J. Musiala', team: 'ger', minute: 82 },
    ],
    possession: { home: 50, away: 50 }, shots: { home: 15, away: 11 },
    corners: { home: 7, away: 5 }, fouls: { home: 13, away: 10 },
    standoutPlayer: 'Vinicius Jr.',
    synthesis: 'Brasil ganó un partido loco con Vinicius Jr. como gran figura. Alemania intentó hasta el final pero no alcanzó.',
  },
  // Completed matches - Group B
  {
    id: 'm5', homeTeamId: 'esp', awayTeamId: 'eng', homeScore: 2, awayScore: 1,
    date: '2026-06-11', time: '15:00', venue: 'Estadio Olímpico', status: 'completed', group: 'B',
    scorers: [
      { player: 'L. Yamal', team: 'esp', minute: 22 },
      { player: 'Á. Morata', team: 'esp', minute: 58 },
      { player: 'H. Kane', team: 'eng', minute: 75 },
    ],
    possession: { home: 63, away: 37 }, shots: { home: 16, away: 7 },
    corners: { home: 8, away: 2 }, fouls: { home: 6, away: 9 },
    standoutPlayer: 'L. Yamal',
    synthesis: 'España mostró su dominio del balón con un Yamal deslumbrante. Inglaterra reaccionó tarde y no logró el empate.',
  },
  {
    id: 'm6', homeTeamId: 'por', awayTeamId: 'ned', homeScore: 3, awayScore: 1,
    date: '2026-06-11', time: '18:00', venue: 'Estadio Municipal', status: 'completed', group: 'B',
    scorers: [
      { player: 'C. Ronaldo', team: 'por', minute: 18 },
      { player: 'B. Silva', team: 'por', minute: 45 },
      { player: 'C. Ronaldo', team: 'por', minute: 80 },
      { player: 'V. Depay', team: 'ned', minute: 62 },
    ],
    possession: { home: 54, away: 46 }, shots: { home: 13, away: 9 },
    corners: { home: 5, away: 4 }, fouls: { home: 7, away: 12 },
    standoutPlayer: 'C. Ronaldo',
    synthesis: 'Ronaldo demostró que la clase no se pierde con dos goles. Portugal fue sólido y efectivo.',
  },
  {
    id: 'm7', homeTeamId: 'esp', awayTeamId: 'por', homeScore: 3, awayScore: 0,
    date: '2026-06-15', time: '15:00', venue: 'Estadio Olímpico', status: 'completed', group: 'B',
    scorers: [
      { player: 'L. Yamal', team: 'esp', minute: 11 },
      { player: 'D. Olmo', team: 'esp', minute: 39 },
      { player: 'P. Pedri', team: 'esp', minute: 63 },
    ],
    possession: { home: 67, away: 33 }, shots: { home: 18, away: 5 },
    corners: { home: 9, away: 1 }, fouls: { home: 4, away: 8 },
    standoutPlayer: 'L. Yamal',
    synthesis: 'España aplastó a Portugal con una exhibición de toque y velocidad. Yamal es la gran promesa del torneo.',
  },
  {
    id: 'm8', homeTeamId: 'eng', awayTeamId: 'ned', homeScore: 2, awayScore: 1,
    date: '2026-06-15', time: '18:00', venue: 'Estadio Central', status: 'completed', group: 'B',
    scorers: [
      { player: 'H. Kane', team: 'eng', minute: 27 },
      { player: 'B. Saka', team: 'eng', minute: 55 },
      { player: 'V. Depay', team: 'ned', minute: 70 },
    ],
    possession: { home: 51, away: 49 }, shots: { home: 10, away: 9 },
    corners: { home: 4, away: 5 }, fouls: { home: 11, away: 7 },
    standoutPlayer: 'B. Saka',
    synthesis: 'Inglaterra ganó con autoridad. Saka fue incisivo y Kane resolvió cuando más se lo necesitaba.',
  },
  // Live matches
  {
    id: 'm9', homeTeamId: 'arg', awayTeamId: 'ger', homeScore: 4, awayScore: 0,
    date: '2026-06-18', time: '15:00', venue: 'Estadio Nacional', status: 'live', group: 'A',
    minute: 72,
    scorers: [
      { player: 'L. Messi', team: 'arg', minute: 5 },
      { player: 'J. Álvarez', team: 'arg', minute: 28 },
      { player: 'E. Fernández', team: 'arg', minute: 56 },
      { player: 'L. Messi', team: 'arg', minute: 68 },
    ],
    possession: { home: 62, away: 38 }, shots: { home: 16, away: 4 },
    corners: { home: 7, away: 1 }, fouls: { home: 5, away: 9 },
    standoutPlayer: 'L. Messi',
  },
  {
    id: 'm10', homeTeamId: 'esp', awayTeamId: 'ned', homeScore: 1, awayScore: 1,
    date: '2026-06-18', time: '15:00', venue: 'Estadio Olímpico', status: 'live', group: 'B',
    minute: 55,
    scorers: [
      { player: 'L. Yamal', team: 'esp', minute: 33 },
      { player: 'V. Depay', team: 'ned', minute: 47 },
    ],
    possession: { home: 60, away: 40 }, shots: { home: 10, away: 5 },
    corners: { home: 4, away: 2 }, fouls: { home: 3, away: 6 },
    standoutPlayer: 'V. Depay',
  },
  // Upcoming matches
  {
    id: 'm11', homeTeamId: 'bra', awayTeamId: 'fra', homeScore: null, awayScore: null,
    date: '2026-06-20', time: '15:00', venue: 'Estadio Central', status: 'upcoming', group: 'A',
  },
  {
    id: 'm12', homeTeamId: 'eng', awayTeamId: 'por', homeScore: null, awayScore: null,
    date: '2026-06-20', time: '18:00', venue: 'Estadio Municipal', status: 'upcoming', group: 'B',
  },
  {
    id: 'm13', homeTeamId: 'arg', awayTeamId: 'bra', homeScore: null, awayScore: null,
    date: '2026-06-22', time: '15:00', venue: 'Estadio Monumental', status: 'upcoming', group: 'A',
  },
  {
    id: 'm14', homeTeamId: 'esp', awayTeamId: 'eng', homeScore: null, awayScore: null,
    date: '2026-06-22', time: '18:00', venue: 'Estadio Olímpico', status: 'upcoming', group: 'B',
  },
];

// SCORERS
export const scorers: Scorer[] = [
  { id: 's1', name: 'L. Messi', teamId: 'arg', goals: 5, assists: 3, position: 'Delantero' },
  { id: 's2', name: 'K. Mbappé', teamId: 'fra', goals: 4, assists: 1, position: 'Delantero' },
  { id: 's3', name: 'L. Yamal', teamId: 'esp', goals: 4, assists: 2, position: 'Extremo' },
  { id: 's4', name: 'Vinicius Jr.', teamId: 'bra', goals: 3, assists: 2, position: 'Extremo' },
  { id: 's5', name: 'C. Ronaldo', teamId: 'por', goals: 3, assists: 0, position: 'Delantero' },
  { id: 's6', name: 'H. Kane', teamId: 'eng', goals: 2, assists: 1, position: 'Delantero' },
  { id: 's7', name: 'J. Álvarez', teamId: 'arg', goals: 3, assists: 1, position: 'Delantero' },
  { id: 's8', name: 'V. Depay', teamId: 'ned', goals: 3, assists: 0, position: 'Delantero' },
  { id: 's9', name: 'B. Saka', teamId: 'eng', goals: 1, assists: 2, position: 'Extremo' },
  { id: 's10', name: 'Á. Morata', teamId: 'esp', goals: 1, assists: 1, position: 'Delantero' },
  { id: 's11', name: 'B. Silva', teamId: 'por', goals: 1, assists: 2, position: 'Mediocampista' },
  { id: 's12', name: 'E. Fernández', teamId: 'arg', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's13', name: 'D. Olmo', teamId: 'esp', goals: 1, assists: 1, position: 'Mediocampista' },
  { id: 's14', name: 'R. Rodrygo', teamId: 'bra', goals: 1, assists: 0, position: 'Extremo' },
];

// RED CARDS
export const redCards: RedCard[] = [
  { id: 'rc1', playerName: 'A. Rüdiger', teamId: 'ger', matchId: 'm2', minute: 78, reason: 'Entrada violenta', suspensionStatus: 'Activa' },
  { id: 'rc2', playerName: 'Casemiro', teamId: 'bra', matchId: 'm4', minute: 89, reason: 'Doble amarilla', suspensionStatus: 'Cumplida' },
  { id: 'rc3', playerName: 'R. Dias', teamId: 'por', matchId: 'm7', minute: 55, reason: 'Mano intencional', suspensionStatus: 'Activa' },
  { id: 'rc4', playerName: 'M. Aké', teamId: 'ned', matchId: 'm8', minute: 43, reason: 'Última falta', suspensionStatus: 'Cumplida' },
  { id: 'rc5', playerName: 'N. Schlotterbeck', teamId: 'ger', matchId: 'm9', minute: 35, reason: 'Entrada por detrás', suspensionStatus: 'Activa' },
];

// NEWS
export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Messi lidera la goleada de Argentina ante Alemania',
    summary: 'Con un doblete del astro argentino, la selección albiceleste aplastó 4-0 a los germanos en un partido que se juega actualmente.',
    category: 'En Vivo',
    date: '2026-06-18',
    imageKeyword: 'messi',
  },
  {
    id: 'n2',
    title: 'Yamal: la gran promesa que deslumbra al mundo',
    summary: 'El joven español de 18 años suma 4 goles en el torneo y es candidato a la Bota de Oro. Su rendimiento es histórico para su edad.',
    category: 'Especial',
    date: '2026-06-17',
    imageKeyword: 'yamal',
  },
  {
    id: 'n3',
    title: 'España e Inglaterra se perfilan como favoritas',
    summary: 'Ambas selecciones lideran sus grupos con autoridad y muestran un nivel de juego superior al resto de los equipos.',
    category: 'Análisis',
    date: '2026-06-16',
    imageKeyword: 'spain',
  },
  {
    id: 'n4',
    title: 'Mbappé rescata un punto para Francia en el minuto 89',
    summary: 'El delantero francés volvió a ser decisivo con un gol agónico que mantuvo a Francia en la pelea por el liderato del Grupo A.',
    category: 'Resultados',
    date: '2026-06-14',
    imageKeyword: 'mbappe',
  },
];

// MATCH SYNTHESES
export const matchSyntheses: MatchSynthesis[] = [
  {
    matchId: 'm1',
    strengths: { team: 'Argentina', points: ['Pases precisos en el mediocampo', 'Presión alta efectiva', 'Messi desequilibrante'] },
    weaknesses: { team: 'Brasil', points: ['Defensa desordenada', 'Poca generación de juego', 'Falta de actitud en el segundo tiempo'] },
    keyMoments: ['Gol de Messi a los 12\' para abrir el marcador', 'Expulsión dudosa no cobrada a los 50\'', 'Golazo de Messi de tiro libre a los 78\''],
    ratings: [{ team: 'Argentina', rating: 8.5 }, { team: 'Brasil', rating: 4.5 }],
  },
  {
    matchId: 'm3',
    strengths: { team: 'Francia', points: ['Velocidad en el contraataque', 'Mbappé imparable', 'Reacción character en el final'] },
    weaknesses: { team: 'Argentina', points: ['Relajación en los últimos minutos', 'Perdida de balones innecesarios'] },
    keyMoments: ['Gol tempranero de Messi a los 8\'', 'Doblete de Mbappé', 'Gol agónico de Mbappé a los 89\''],
    ratings: [{ team: 'Argentina', rating: 6.5 }, { team: 'Francia', rating: 7.5 }],
  },
  {
    matchId: 'm5',
    strengths: { team: 'España', points: ['Dominio absoluto del balón', 'Yamal eléctrico por la banda', 'Defensa sólida'] },
    weaknesses: { team: 'Inglaterra', points: ['Imposibilidad de mantener la posesión', 'Pocas llegadas claras', 'Lento en la transición'] },
    keyMoments: ['Golazo de Yamal a los 22\'', 'Atajada clave de Unai Simón a los 65\'', 'Descuento insuficiente de Kane a los 75\''],
    ratings: [{ team: 'España', rating: 8.0 }, { team: 'Inglaterra', rating: 5.0 }],
  },
  {
    matchId: 'm7',
    strengths: { team: 'España', points: ['Toque corto impecable', 'Yamal y Olmo combinan a la perfección', 'Pedri controla el tempo'] },
    weaknesses: { team: 'Portugal', points: ['Sin respuesta al pressing español', 'Ronaldo aislado en ataque', 'Expulsión de R. Dias por mano'] },
    keyMoments: ['Gol de Yamal a los 11\' para abrir la cuenta', 'Expulsión de R. Dias a los 55\'', 'Gol de Pedri tras gran jugada colectiva'],
    ratings: [{ team: 'España', rating: 9.0 }, { team: 'Portugal', rating: 3.5 }],
  },
  {
    matchId: 'm8',
    strengths: { team: 'Inglaterra', points: ['Saka determinante en la banda', 'Kane letal en el área', 'Solididad defensiva'] },
    weaknesses: { team: 'Países Bajos', points: ['Poca profundidad en ataque', 'Depay muy solo arriba', 'Expulsión de Aké por falta'] },
    keyMoments: ['Gol de Kane de penal a los 27\'', 'Gran gol de Saka cortando por dentro a los 55\'', 'Descuento de Depay a los 70\''],
    ratings: [{ team: 'Inglaterra', rating: 7.0 }, { team: 'Países Bajos', rating: 4.0 }],
  },
];

// VOTING DATA
export const votingMatches: VotingMatch[] = [
  {
    matchId: 'm9',
    homeTeamId: 'arg',
    awayTeamId: 'ger',
    candidates: [
      { id: 'v1', name: 'L. Messi', teamId: 'arg', votes: 342 },
      { id: 'v2', name: 'J. Álvarez', teamId: 'arg', votes: 128 },
      { id: 'v3', name: 'E. Fernández', teamId: 'arg', votes: 89 },
      { id: 'v4', name: 'A. Rüdiger', teamId: 'ger', votes: 15 },
    ],
  },
  {
    matchId: 'm10',
    homeTeamId: 'esp',
    awayTeamId: 'ned',
    candidates: [
      { id: 'v5', name: 'L. Yamal', teamId: 'esp', votes: 267 },
      { id: 'v6', name: 'V. Depay', teamId: 'ned', votes: 198 },
      { id: 'v7', name: 'P. Pedri', teamId: 'esp', votes: 112 },
      { id: 'v8', name: 'F. de Jong', teamId: 'ned', votes: 54 },
    ],
  },
  {
    matchId: 'm1',
    homeTeamId: 'arg',
    awayTeamId: 'bra',
    candidates: [
      { id: 'v9', name: 'L. Messi', teamId: 'arg', votes: 456 },
      { id: 'v10', name: 'J. Álvarez', teamId: 'arg', votes: 134 },
      { id: 'v11', name: 'Vinicius Jr.', teamId: 'bra', votes: 89 },
      { id: 'v12', name: 'E. Martínez', teamId: 'arg', votes: 67 },
    ],
  },
];

// HELPER
export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getTeamName(id: string): string {
  return teams.find(t => t.id === id)?.name ?? id;
}

export function getTeamFlag(id: string): string {
  return teams.find(t => t.id === id)?.flag ?? '⚽';
}
