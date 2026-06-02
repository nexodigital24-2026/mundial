// Mock Data for "Nexo Digital Mundial" Sports Portal - World Cup 2026
// 12 Groups, 48 Teams

export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Team {
  id: string;
  name: string;
  flag: string;       // emoji flag
  code: string;       // ISO 2-letter country code (e.g. 'mx')
  color: string;      // distinctive team color for pastillas
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

export interface GalleryImage {
  id: string;
  url: string;           // Server URL (WebP)
  dataUrl: string;       // Base64 data URL for client preview
  caption: string;       // Photo caption
  order: number;         // Display order in gallery
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;         // Full article body text (rich content)
  category: string;
  date: string;
  imageKeyword: string;
  imageUrl: string;        // Main/cover image URL
  imageDataUrl: string;    // Main/cover image base64
  gallery: GalleryImage[]; // Photo gallery - multiple images
  author: string;          // Article author
  source: string;          // News source
  tags: string[];          // Tags for categorization
  featured: boolean;       // Featured/highlighted news
  order: number;
  active: boolean;
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
  position: BannerPosition;
  active: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  createdBy: string;
  // Nuevos campos — medidas y tiempo
  width: number;        // ancho en px
  height: number;       // alto en px
  displayDuration: number; // segundos que se muestra (rotación)
  targetType: '_blank' | '_self'; // cómo abre el enlace
  bgColor: string;      // color de fondo de la pastilla
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  imageDataUrl: string; // Base64 data URL for uploaded images (client-side)
}

export type BannerPosition =
  | 'hero'           // banner principal grande
  | 'sidebar'        // barra lateral
  | 'footer'         // pie de página
  | 'content-top'    // arriba del contenido
  | 'content-bottom' // abajo del contenido
  | 'navbar-below'   // debajo de la barra de navegación
  | 'between-matches' // entre partidos en vivo
  | 'sticky-bottom'  // barra sticky abajo
  | 'floating-left'  // flotante lateral izquierdo
  | 'floating-right' // flotante lateral derecho
  | 'interstitial';  // pantalla completa entre secciones

// ==================== TEAMS (48) ====================
export const teams: Team[] = [
  // Group A
  { id: 'mex', name: 'México', flag: '🇲🇽', code: 'mx', color: '#006847', group: 'A' },
  { id: 'rsa', name: 'Sudáfrica', flag: '🇿🇦', code: 'za', color: '#007749', group: 'A' },
  { id: 'kor', name: 'Corea del Sur', flag: '🇰🇷', code: 'kr', color: '#003478', group: 'A' },
  { id: 'cze', name: 'Chequia', flag: '🇨🇿', code: 'cz', color: '#11457E', group: 'A' },
  // Group B
  { id: 'can', name: 'Canadá', flag: '🇨🇦', code: 'ca', color: '#FF0000', group: 'B' },
  { id: 'bih', name: 'Bosnia y Herzegovina', flag: '🇧🇦', code: 'ba', color: '#002395', group: 'B' },
  { id: 'qat', name: 'Catar', flag: '🇶🇦', code: 'qa', color: '#8D1B3D', group: 'B' },
  { id: 'sui', name: 'Suiza', flag: '🇨🇭', code: 'ch', color: '#D52B1E', group: 'B' },
  // Group C
  { id: 'bra', name: 'Brasil', flag: '🇧🇷', code: 'br', color: '#009739', group: 'C' },
  { id: 'mar', name: 'Marruecos', flag: '🇲🇦', code: 'ma', color: '#C1272D', group: 'C' },
  { id: 'hai', name: 'Haití', flag: '🇭🇹', code: 'ht', color: '#00209F', group: 'C' },
  { id: 'sco', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', code: 'gb-sct', color: '#003087', group: 'C' },
  // Group D
  { id: 'usa', name: 'Estados Unidos', flag: '🇺🇸', code: 'us', color: '#3C3B6E', group: 'D' },
  { id: 'par', name: 'Paraguay', flag: '🇵🇾', code: 'py', color: '#0038A8', group: 'D' },
  { id: 'aus', name: 'Australia', flag: '🇦🇺', code: 'au', color: '#00008B', group: 'D' },
  { id: 'tur', name: 'Turquía', flag: '🇹🇷', code: 'tr', color: '#E30A17', group: 'D' },
  // Group E
  { id: 'ger', name: 'Alemania', flag: '🇩🇪', code: 'de', color: '#000000', group: 'E' },
  { id: 'cuw', name: 'Curazao', flag: '🇨🇼', code: 'cw', color: '#002B7F', group: 'E' },
  { id: 'civ', name: 'Costa de Marfil', flag: '🇨🇮', code: 'ci', color: '#F77F00', group: 'E' },
  { id: 'ecu', name: 'Ecuador', flag: '🇪🇨', code: 'ec', color: '#FFD100', group: 'E' },
  // Group F
  { id: 'ned', name: 'Países Bajos', flag: '🇳🇱', code: 'nl', color: '#FF6600', group: 'F' },
  { id: 'jpn', name: 'Japón', flag: '🇯🇵', code: 'jp', color: '#BC002D', group: 'F' },
  { id: 'swe', name: 'Suecia', flag: '🇸🇪', code: 'se', color: '#005293', group: 'F' },
  { id: 'tun', name: 'Túnez', flag: '🇹🇳', code: 'tn', color: '#E70013', group: 'F' },
  // Group G
  { id: 'bel', name: 'Bélgica', flag: '🇧🇪', code: 'be', color: '#2D2926', group: 'G' },
  { id: 'egy', name: 'Egipto', flag: '🇪🇬', code: 'eg', color: '#C8102E', group: 'G' },
  { id: 'iri', name: 'Irán', flag: '🇮🇷', code: 'ir', color: '#239F40', group: 'G' },
  { id: 'nzl', name: 'Nueva Zelanda', flag: '🇳🇿', code: 'nz', color: '#00247D', group: 'G' },
  // Group H
  { id: 'esp', name: 'España', flag: '🇪🇸', code: 'es', color: '#AA151B', group: 'H' },
  { id: 'cpv', name: 'Cabo Verde', flag: '🇨🇻', code: 'cv', color: '#003893', group: 'H' },
  { id: 'ksa', name: 'Arabia Saudita', flag: '🇸🇦', code: 'sa', color: '#006C35', group: 'H' },
  { id: 'uru', name: 'Uruguay', flag: '🇺🇾', code: 'uy', color: '#5DADE2', group: 'H' },
  // Group I
  { id: 'fra', name: 'Francia', flag: '🇫🇷', code: 'fr', color: '#002395', group: 'I' },
  { id: 'sen', name: 'Senegal', flag: '🇸🇳', code: 'sn', color: '#00853F', group: 'I' },
  { id: 'irq', name: 'Irak', flag: '🇮🇶', code: 'iq', color: '#CE1126', group: 'I' },
  { id: 'nor', name: 'Noruega', flag: '🇳🇴', code: 'no', color: '#BA0C2F', group: 'I' },
  // Group J
  { id: 'arg', name: 'Argentina', flag: '🇦🇷', code: 'ar', color: '#74ACDF', group: 'J' },
  { id: 'alg', name: 'Argelia', flag: '🇩🇿', code: 'dz', color: '#006233', group: 'J' },
  { id: 'aut', name: 'Austria', flag: '🇦🇹', code: 'at', color: '#ED2939', group: 'J' },
  { id: 'jor', name: 'Jordania', flag: '🇯🇴', code: 'jo', color: '#007A3D', group: 'J' },
  // Group K
  { id: 'por', name: 'Portugal', flag: '🇵🇹', code: 'pt', color: '#006600', group: 'K' },
  { id: 'cod', name: 'Congo DR', flag: '🇨🇩', code: 'cd', color: '#007FFF', group: 'K' },
  { id: 'uzb', name: 'Uzbekistán', flag: '🇺🇿', code: 'uz', color: '#1EB53A', group: 'K' },
  { id: 'col', name: 'Colombia', flag: '🇨🇴', code: 'co', color: '#FCD116', group: 'K' },
  // Group L
  { id: 'eng', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'gb-eng', color: '#FFFFFF', group: 'L' },
  { id: 'cro', name: 'Croacia', flag: '🇭🇷', code: 'hr', color: '#171796', group: 'L' },
  { id: 'gha', name: 'Ghana', flag: '🇬🇭', code: 'gh', color: '#CE1126', group: 'L' },
  { id: 'pan', name: 'Panamá', flag: '🇵🇦', code: 'pa', color: '#005293', group: 'L' },
];

// ==================== STANDINGS (12 groups) ====================
export const standings: Record<string, Standing[]> = {
  A: [
    { pos: 1, teamId: 'mex', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'kor', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'cze', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'rsa', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  B: [
    { pos: 1, teamId: 'can', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'bih', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'qat', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'sui', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  C: [
    { pos: 1, teamId: 'bra', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'mar', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'hai', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'sco', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  D: [
    { pos: 1, teamId: 'usa', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'par', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'aus', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'tur', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  E: [
    { pos: 1, teamId: 'ger', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'cuw', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'civ', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'ecu', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  F: [
    { pos: 1, teamId: 'ned', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'jpn', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'swe', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'tun', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  G: [
    { pos: 1, teamId: 'bel', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'egy', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'iri', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'nzl', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  H: [
    { pos: 1, teamId: 'esp', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'cpv', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'ksa', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'uru', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  I: [
    { pos: 1, teamId: 'fra', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'sen', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'irq', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'nor', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  J: [
    { pos: 1, teamId: 'arg', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'alg', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'aut', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'jor', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  K: [
    { pos: 1, teamId: 'por', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'cod', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'uzb', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'col', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  L: [
    { pos: 1, teamId: 'eng', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 2, teamId: 'cro', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 3, teamId: 'gha', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { pos: 4, teamId: 'pan', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
};

// ==================== MATCHES (72 group stage — all upcoming) ====================
export const matches: Match[] = [
  // ===== Matchday 1 =====
  { id: 'm1', homeTeamId: 'mex', awayTeamId: 'rsa', homeScore: null, awayScore: null, date: '2026-06-11', time: '15:00', venue: 'Estadio Azteca, CDMX', status: 'upcoming', group: 'A' },
  { id: 'm2', homeTeamId: 'kor', awayTeamId: 'cze', homeScore: null, awayScore: null, date: '2026-06-11', time: '22:00', venue: 'Estadio Akron, Guadalajara', status: 'upcoming', group: 'A' },
  { id: 'm3', homeTeamId: 'can', awayTeamId: 'bih', homeScore: null, awayScore: null, date: '2026-06-12', time: '15:00', venue: 'BMO Field, Toronto', status: 'upcoming', group: 'B' },
  { id: 'm4', homeTeamId: 'usa', awayTeamId: 'par', homeScore: null, awayScore: null, date: '2026-06-12', time: '21:00', venue: 'SoFi Stadium, Los Angeles', status: 'upcoming', group: 'D' },
  { id: 'm5', homeTeamId: 'qat', awayTeamId: 'sui', homeScore: null, awayScore: null, date: '2026-06-13', time: '15:00', venue: "Levi's Stadium, Santa Clara", status: 'upcoming', group: 'B' },
  { id: 'm6', homeTeamId: 'bra', awayTeamId: 'mar', homeScore: null, awayScore: null, date: '2026-06-13', time: '18:00', venue: 'MetLife Stadium, New Jersey', status: 'upcoming', group: 'C' },
  { id: 'm7', homeTeamId: 'hai', awayTeamId: 'sco', homeScore: null, awayScore: null, date: '2026-06-13', time: '21:00', venue: 'Gillette Stadium, Boston', status: 'upcoming', group: 'C' },
  { id: 'm8', homeTeamId: 'aus', awayTeamId: 'tur', homeScore: null, awayScore: null, date: '2026-06-14', time: '00:00', venue: 'BC Place, Vancouver', status: 'upcoming', group: 'D' },
  { id: 'm9', homeTeamId: 'ger', awayTeamId: 'cuw', homeScore: null, awayScore: null, date: '2026-06-14', time: '13:00', venue: 'NRG Stadium, Houston', status: 'upcoming', group: 'E' },
  { id: 'm10', homeTeamId: 'ned', awayTeamId: 'jpn', homeScore: null, awayScore: null, date: '2026-06-14', time: '16:00', venue: "AT&T Stadium, Arlington", status: 'upcoming', group: 'F' },
  { id: 'm11', homeTeamId: 'civ', awayTeamId: 'ecu', homeScore: null, awayScore: null, date: '2026-06-14', time: '19:00', venue: 'Lincoln Financial Field, Philadelphia', status: 'upcoming', group: 'E' },
  { id: 'm12', homeTeamId: 'swe', awayTeamId: 'tun', homeScore: null, awayScore: null, date: '2026-06-14', time: '22:00', venue: 'Estadio BBVA, Monterrey', status: 'upcoming', group: 'F' },
  { id: 'm13', homeTeamId: 'esp', awayTeamId: 'cpv', homeScore: null, awayScore: null, date: '2026-06-15', time: '12:00', venue: 'Mercedes-Benz Stadium, Atlanta', status: 'upcoming', group: 'H' },
  { id: 'm14', homeTeamId: 'bel', awayTeamId: 'egy', homeScore: null, awayScore: null, date: '2026-06-15', time: '15:00', venue: 'Lumen Field, Seattle', status: 'upcoming', group: 'G' },
  { id: 'm15', homeTeamId: 'ksa', awayTeamId: 'uru', homeScore: null, awayScore: null, date: '2026-06-15', time: '18:00', venue: 'Hard Rock Stadium, Miami', status: 'upcoming', group: 'H' },
  { id: 'm16', homeTeamId: 'iri', awayTeamId: 'nzl', homeScore: null, awayScore: null, date: '2026-06-15', time: '21:00', venue: 'SoFi Stadium, Los Angeles', status: 'upcoming', group: 'G' },
  { id: 'm17', homeTeamId: 'fra', awayTeamId: 'sen', homeScore: null, awayScore: null, date: '2026-06-16', time: '15:00', venue: 'MetLife Stadium, New Jersey', status: 'upcoming', group: 'I' },
  { id: 'm18', homeTeamId: 'irq', awayTeamId: 'nor', homeScore: null, awayScore: null, date: '2026-06-16', time: '18:00', venue: 'Gillette Stadium, Boston', status: 'upcoming', group: 'I' },
  { id: 'm19', homeTeamId: 'arg', awayTeamId: 'alg', homeScore: null, awayScore: null, date: '2026-06-16', time: '21:00', venue: 'Arrowhead Stadium, Kansas City', status: 'upcoming', group: 'J' },
  { id: 'm20', homeTeamId: 'aut', awayTeamId: 'jor', homeScore: null, awayScore: null, date: '2026-06-17', time: '00:00', venue: "Levi's Stadium, Santa Clara", status: 'upcoming', group: 'J' },
  { id: 'm21', homeTeamId: 'por', awayTeamId: 'cod', homeScore: null, awayScore: null, date: '2026-06-17', time: '13:00', venue: 'NRG Stadium, Houston', status: 'upcoming', group: 'K' },
  { id: 'm22', homeTeamId: 'eng', awayTeamId: 'cro', homeScore: null, awayScore: null, date: '2026-06-17', time: '16:00', venue: "AT&T Stadium, Arlington", status: 'upcoming', group: 'L' },
  { id: 'm23', homeTeamId: 'gha', awayTeamId: 'pan', homeScore: null, awayScore: null, date: '2026-06-17', time: '19:00', venue: 'BMO Field, Toronto', status: 'upcoming', group: 'L' },
  { id: 'm24', homeTeamId: 'uzb', awayTeamId: 'col', homeScore: null, awayScore: null, date: '2026-06-17', time: '22:00', venue: 'Estadio Azteca, CDMX', status: 'upcoming', group: 'K' },
  // ===== Matchday 2 =====
  { id: 'm25', homeTeamId: 'cze', awayTeamId: 'rsa', homeScore: null, awayScore: null, date: '2026-06-18', time: '12:00', venue: 'Mercedes-Benz Stadium, Atlanta', status: 'upcoming', group: 'A' },
  { id: 'm26', homeTeamId: 'sui', awayTeamId: 'bih', homeScore: null, awayScore: null, date: '2026-06-18', time: '15:00', venue: 'SoFi Stadium, Los Angeles', status: 'upcoming', group: 'B' },
  { id: 'm27', homeTeamId: 'can', awayTeamId: 'qat', homeScore: null, awayScore: null, date: '2026-06-18', time: '18:00', venue: 'BC Place, Vancouver', status: 'upcoming', group: 'B' },
  { id: 'm28', homeTeamId: 'mex', awayTeamId: 'kor', homeScore: null, awayScore: null, date: '2026-06-18', time: '21:00', venue: 'Estadio Akron, Guadalajara', status: 'upcoming', group: 'A' },
  { id: 'm29', homeTeamId: 'usa', awayTeamId: 'aus', homeScore: null, awayScore: null, date: '2026-06-19', time: '15:00', venue: 'Lumen Field, Seattle', status: 'upcoming', group: 'D' },
  { id: 'm30', homeTeamId: 'sco', awayTeamId: 'mar', homeScore: null, awayScore: null, date: '2026-06-19', time: '18:00', venue: 'Gillette Stadium, Boston', status: 'upcoming', group: 'C' },
  { id: 'm31', homeTeamId: 'bra', awayTeamId: 'hai', homeScore: null, awayScore: null, date: '2026-06-19', time: '20:30', venue: 'Lincoln Financial Field, Philadelphia', status: 'upcoming', group: 'C' },
  { id: 'm32', homeTeamId: 'tur', awayTeamId: 'par', homeScore: null, awayScore: null, date: '2026-06-19', time: '23:00', venue: "Levi's Stadium, Santa Clara", status: 'upcoming', group: 'D' },
  { id: 'm33', homeTeamId: 'ned', awayTeamId: 'swe', homeScore: null, awayScore: null, date: '2026-06-20', time: '13:00', venue: 'NRG Stadium, Houston', status: 'upcoming', group: 'F' },
  { id: 'm34', homeTeamId: 'ger', awayTeamId: 'civ', homeScore: null, awayScore: null, date: '2026-06-20', time: '16:00', venue: 'BMO Field, Toronto', status: 'upcoming', group: 'E' },
  { id: 'm35', homeTeamId: 'ecu', awayTeamId: 'cuw', homeScore: null, awayScore: null, date: '2026-06-20', time: '20:00', venue: 'Arrowhead Stadium, Kansas City', status: 'upcoming', group: 'E' },
  { id: 'm36', homeTeamId: 'tun', awayTeamId: 'jpn', homeScore: null, awayScore: null, date: '2026-06-21', time: '00:00', venue: 'Estadio BBVA, Monterrey', status: 'upcoming', group: 'F' },
  { id: 'm37', homeTeamId: 'esp', awayTeamId: 'ksa', homeScore: null, awayScore: null, date: '2026-06-21', time: '12:00', venue: 'Mercedes-Benz Stadium, Atlanta', status: 'upcoming', group: 'H' },
  { id: 'm38', homeTeamId: 'bel', awayTeamId: 'iri', homeScore: null, awayScore: null, date: '2026-06-21', time: '15:00', venue: 'SoFi Stadium, Los Angeles', status: 'upcoming', group: 'G' },
  { id: 'm39', homeTeamId: 'uru', awayTeamId: 'cpv', homeScore: null, awayScore: null, date: '2026-06-21', time: '18:00', venue: 'Hard Rock Stadium, Miami', status: 'upcoming', group: 'H' },
  { id: 'm40', homeTeamId: 'nzl', awayTeamId: 'egy', homeScore: null, awayScore: null, date: '2026-06-21', time: '21:00', venue: 'BC Place, Vancouver', status: 'upcoming', group: 'G' },
  { id: 'm41', homeTeamId: 'arg', awayTeamId: 'aut', homeScore: null, awayScore: null, date: '2026-06-22', time: '13:00', venue: "AT&T Stadium, Arlington", status: 'upcoming', group: 'J' },
  { id: 'm42', homeTeamId: 'fra', awayTeamId: 'irq', homeScore: null, awayScore: null, date: '2026-06-22', time: '17:00', venue: 'Lincoln Financial Field, Philadelphia', status: 'upcoming', group: 'I' },
  { id: 'm43', homeTeamId: 'nor', awayTeamId: 'sen', homeScore: null, awayScore: null, date: '2026-06-22', time: '20:00', venue: 'MetLife Stadium, New Jersey', status: 'upcoming', group: 'I' },
  { id: 'm44', homeTeamId: 'jor', awayTeamId: 'alg', homeScore: null, awayScore: null, date: '2026-06-22', time: '23:00', venue: "Levi's Stadium, Santa Clara", status: 'upcoming', group: 'J' },
  { id: 'm45', homeTeamId: 'por', awayTeamId: 'uzb', homeScore: null, awayScore: null, date: '2026-06-23', time: '13:00', venue: 'NRG Stadium, Houston', status: 'upcoming', group: 'K' },
  { id: 'm46', homeTeamId: 'eng', awayTeamId: 'gha', homeScore: null, awayScore: null, date: '2026-06-23', time: '16:00', venue: 'Gillette Stadium, Boston', status: 'upcoming', group: 'L' },
  { id: 'm47', homeTeamId: 'pan', awayTeamId: 'cro', homeScore: null, awayScore: null, date: '2026-06-23', time: '19:00', venue: 'BMO Field, Toronto', status: 'upcoming', group: 'L' },
  { id: 'm48', homeTeamId: 'col', awayTeamId: 'cod', homeScore: null, awayScore: null, date: '2026-06-23', time: '22:00', venue: 'Estadio Akron, Guadalajara', status: 'upcoming', group: 'K' },
  // ===== Matchday 3 =====
  { id: 'm49', homeTeamId: 'can', awayTeamId: 'sui', homeScore: null, awayScore: null, date: '2026-06-24', time: '15:00', venue: 'BC Place, Vancouver', status: 'upcoming', group: 'B' },
  { id: 'm50', homeTeamId: 'bih', awayTeamId: 'qat', homeScore: null, awayScore: null, date: '2026-06-24', time: '15:00', venue: 'Lumen Field, Seattle', status: 'upcoming', group: 'B' },
  { id: 'm51', homeTeamId: 'sco', awayTeamId: 'bra', homeScore: null, awayScore: null, date: '2026-06-24', time: '18:00', venue: 'Hard Rock Stadium, Miami', status: 'upcoming', group: 'C' },
  { id: 'm52', homeTeamId: 'mar', awayTeamId: 'hai', homeScore: null, awayScore: null, date: '2026-06-24', time: '18:00', venue: 'Mercedes-Benz Stadium, Atlanta', status: 'upcoming', group: 'C' },
  { id: 'm53', homeTeamId: 'mex', awayTeamId: 'cze', homeScore: null, awayScore: null, date: '2026-06-24', time: '21:00', venue: 'Estadio Azteca, CDMX', status: 'upcoming', group: 'A' },
  { id: 'm54', homeTeamId: 'rsa', awayTeamId: 'kor', homeScore: null, awayScore: null, date: '2026-06-24', time: '21:00', venue: 'Estadio BBVA, Monterrey', status: 'upcoming', group: 'A' },
  { id: 'm55', homeTeamId: 'ecu', awayTeamId: 'ger', homeScore: null, awayScore: null, date: '2026-06-25', time: '16:00', venue: 'MetLife Stadium, New Jersey', status: 'upcoming', group: 'E' },
  { id: 'm56', homeTeamId: 'cuw', awayTeamId: 'civ', homeScore: null, awayScore: null, date: '2026-06-25', time: '16:00', venue: 'Lincoln Financial Field, Philadelphia', status: 'upcoming', group: 'E' },
  { id: 'm57', homeTeamId: 'tun', awayTeamId: 'ned', homeScore: null, awayScore: null, date: '2026-06-25', time: '19:00', venue: 'Arrowhead Stadium, Kansas City', status: 'upcoming', group: 'F' },
  { id: 'm58', homeTeamId: 'jpn', awayTeamId: 'swe', homeScore: null, awayScore: null, date: '2026-06-25', time: '19:00', venue: "AT&T Stadium, Arlington", status: 'upcoming', group: 'F' },
  { id: 'm59', homeTeamId: 'usa', awayTeamId: 'tur', homeScore: null, awayScore: null, date: '2026-06-25', time: '22:00', venue: 'SoFi Stadium, Los Angeles', status: 'upcoming', group: 'D' },
  { id: 'm60', homeTeamId: 'par', awayTeamId: 'aus', homeScore: null, awayScore: null, date: '2026-06-25', time: '22:00', venue: "Levi's Stadium, Santa Clara", status: 'upcoming', group: 'D' },
  { id: 'm61', homeTeamId: 'nor', awayTeamId: 'fra', homeScore: null, awayScore: null, date: '2026-06-26', time: '15:00', venue: 'Gillette Stadium, Boston', status: 'upcoming', group: 'I' },
  { id: 'm62', homeTeamId: 'sen', awayTeamId: 'irq', homeScore: null, awayScore: null, date: '2026-06-26', time: '15:00', venue: 'BMO Field, Toronto', status: 'upcoming', group: 'I' },
  { id: 'm63', homeTeamId: 'uru', awayTeamId: 'esp', homeScore: null, awayScore: null, date: '2026-06-26', time: '20:00', venue: 'Estadio Akron, Guadalajara', status: 'upcoming', group: 'H' },
  { id: 'm64', homeTeamId: 'cpv', awayTeamId: 'ksa', homeScore: null, awayScore: null, date: '2026-06-26', time: '20:00', venue: 'NRG Stadium, Houston', status: 'upcoming', group: 'H' },
  { id: 'm65', homeTeamId: 'nzl', awayTeamId: 'bel', homeScore: null, awayScore: null, date: '2026-06-26', time: '23:00', venue: 'BC Place, Vancouver', status: 'upcoming', group: 'G' },
  { id: 'm66', homeTeamId: 'egy', awayTeamId: 'iri', homeScore: null, awayScore: null, date: '2026-06-26', time: '23:00', venue: 'Lumen Field, Seattle', status: 'upcoming', group: 'G' },
  { id: 'm67', homeTeamId: 'pan', awayTeamId: 'eng', homeScore: null, awayScore: null, date: '2026-06-27', time: '17:00', venue: 'MetLife Stadium, New Jersey', status: 'upcoming', group: 'L' },
  { id: 'm68', homeTeamId: 'cro', awayTeamId: 'gha', homeScore: null, awayScore: null, date: '2026-06-27', time: '17:00', venue: 'Lincoln Financial Field, Philadelphia', status: 'upcoming', group: 'L' },
  { id: 'm69', homeTeamId: 'col', awayTeamId: 'por', homeScore: null, awayScore: null, date: '2026-06-27', time: '19:30', venue: 'Hard Rock Stadium, Miami', status: 'upcoming', group: 'K' },
  { id: 'm70', homeTeamId: 'cod', awayTeamId: 'uzb', homeScore: null, awayScore: null, date: '2026-06-27', time: '19:30', venue: 'Mercedes-Benz Stadium, Atlanta', status: 'upcoming', group: 'K' },
  { id: 'm71', homeTeamId: 'jor', awayTeamId: 'arg', homeScore: null, awayScore: null, date: '2026-06-27', time: '22:00', venue: "AT&T Stadium, Arlington", status: 'upcoming', group: 'J' },
  { id: 'm72', homeTeamId: 'alg', awayTeamId: 'aut', homeScore: null, awayScore: null, date: '2026-06-27', time: '22:00', venue: 'Arrowhead Stadium, Kansas City', status: 'upcoming', group: 'J' },
];

// ==================== SCORERS ====================
export const scorers: Scorer[] = [];

// ==================== RED CARDS ====================
export const redCards: RedCard[] = [];

// ==================== NEWS (6 pre-tournament items) ====================
export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Cuenta regresiva: 10 días para el inicio del Mundial 2026',
    summary: 'La espera está por terminar. En solo 10 días, el Estadio Azteca será el escenario del partido inaugural entre México y Sudáfrica.',
    content: 'La cuenta regresiva ha comenzado y la emoción se siente en cada rincón del planeta. A solo 10 días del inicio de la Copa Mundial de la FIFA 2026, las 48 selecciones participantes afinan sus últimos detalles antes de la gran cita. El Estadio Azteca de la Ciudad de México se prepara para recibir el partido inaugural entre la selección mexicana y Sudáfrica el próximo 11 de junio.\n\nLas ciudades sede en los tres países anfitriones —México, Estados Unidos y Canadá— ultiman los preparativos logísticos y de seguridad para recibir a millones de aficionados. Se espera que este sea el Mundial con mayor asistencia en la historia del fútbol, con estadios que superan los 80,000 asientos.\n\nLos equipos ya han comenzado a llegar a sus bases de concentración y las primeras ruedas de prensa de los técnicos reflejan la enorme expectativa que genera este torneo. Desde la ciudad de México hasta Vancouver, la fiebre del fútbol está por alcanzar su punto máximo.',
    category: 'Mundial',
    date: '2026-06-01',
    imageKeyword: 'countdown-world-cup',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Redacción Nexo Digital',
    source: 'Nexo Digital',
    tags: ['Mundial 2026', 'Cuenta regresiva', 'Inauguración', 'Estadio Azteca'],
    featured: true,
    order: 1,
    active: true,
  },
  {
    id: 'n2',
    title: 'México se prepara para el partido inaugural ante Sudáfrica',
    summary: 'La selección mexicana busca empezar con victoria en casa. Jaime Lozano definió su once titular para el duelo del 11 de junio.',
    content: 'La selección mexicana de fútbol está lista para escribir una nueva página dorada en su historia. El próximo 11 de junio, en el colosal Estadio Azteca, México abrirá la Copa Mundial de la FIFA 2026 ante Sudáfrica en lo que promete ser una noche inolvidable para el fútbol azteca.\n\nEl técnico Jaime Lozano ha definido su esquema táctico y tendría listo su once titular para el partido inaugural. La expectativa es enorme: más de 87,000 aficionados llenarán el Coloso de Santa Úrsula para alentar a su selección. Los jugadores han mostrado gran nivel en los partidos preparatorios y la confianza del grupo está en su punto más alto.\n\nSudáfrica, por su parte, llega con un equipo joven y dinámico que buscará sorprender ante la presión del local. El técnico sudafricano ha trabajado en un sistema defensivo sólido que podría complicar las aspiraciones mexicanas. Sin embargo, el factor localía y el empuje de la afición serán armas fundamentales para el Tri en esta apertura mundialista.',
    category: 'Selección Mexicana',
    date: '2026-06-01',
    imageKeyword: 'mexico-south-africa-opener',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Carlos Mendoza',
    source: 'Nexo Digital',
    tags: ['México', 'Sudáfrica', 'Inauguración', 'Estadio Azteca', 'Grupo A'],
    featured: true,
    order: 2,
    active: true,
  },
  {
    id: 'n3',
    title: 'Estados Unidos busca brillar como local en el Grupo D',
    summary: 'Con Pulisic como estrella, la selección estadounidense afronta el Grupo D con Paraguay, Australia y Turquía.',
    content: 'La selección de Estados Unidos llega al Mundial 2026 con la presión y la ilusión de ser uno de los anfitriones. Con Christian Pulisic como su máxima estrella y un plantel que combina experiencia y juventud, el equipo dirigido por Gregg Berhalter buscará avanzar como líder del Grupo D.\n\nEl sorteo deparó un grupo accesible pero no fácil: Paraguay con su fútbol aguerrido, Australia con su garra característica y Turquía con su potencia ofensiva serán rivales exigentes. El debut será ante Paraguay el 12 de junio en el SoFi Stadium de Los Ángeles, un escenario que promete un ambiente espectacular.\n\nLa federación estadounidense ha invertido fuertemente en el desarrollo del fútbol y los resultados empiezan a verse. Jugadores como Gio Reyna, Folarin Balogun y Weston McKennie complementan a un Pulisic que llega en el mejor momento de su carrera. El objetivo es claro: superar los cuartos de final del 2002 y hacer historia en casa.',
    category: 'Selección USA',
    date: '2026-06-01',
    imageKeyword: 'usa-world-cup-team',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Michael Torres',
    source: 'Nexo Digital',
    tags: ['Estados Unidos', 'Pulisic', 'Grupo D', 'SoFi Stadium'],
    featured: false,
    order: 3,
    active: true,
  },
  {
    id: 'n4',
    title: 'Messi y Argentina: el último baile del astro en un Mundial',
    summary: 'Lionel Messi afronta lo que podría ser su último Mundial con la camiseta albiceleste. Argentina busca revalidar su título en el Grupo J.',
    content: 'Lionel Messi se prepara para lo que podría ser su última participación en una Copa del Mundo. El astro argentino, que cumplirá 39 años durante el torneo, llega con la ilusión de revalidar el título conseguido en Qatar 2022 y despedirse del máximo escenario con una nueva estrella para su selección.\n\nArgentina fue ubicada en el Grupo J junto a Argelia, Austria y Jordania. El debut será ante Argelia el 16 de junio en el Arrowhead Stadium de Kansas City. El equipo de Lionel Scaloni mantiene la base campeona del mundo y ha incorporado jóvenes talentos que le dan frescura al plantel.\n\nMessi ha declarado en múltiples ocasiones que este podría ser su último Mundial, aunque siempre deja una puerta abierta. La afición argentina sueña con ver a su ídolo levantar el trofeo una vez más, esta vez en tierras norteamericanas. La presión es enorme, pero si algo ha demostrado Messi a lo largo de su carrera es que sabe manejarla como nadie.',
    category: 'Argentina',
    date: '2026-06-01',
    imageKeyword: 'messi-argentina-world-cup',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Federico Ríos',
    source: 'Nexo Digital',
    tags: ['Messi', 'Argentina', 'Grupo J', 'Último Mundial', 'Campeón defensor'],
    featured: true,
    order: 4,
    active: true,
  },
  {
    id: 'n5',
    title: 'Las sedes del Mundial 2026: 16 estadios en 3 países',
    summary: 'México, Estados Unidos y Canadá compartirán la organización con 16 estadios de primer nivel que prometen un espectáculo único.',
    content: 'La Copa Mundial de la FIFA 2026 hará historia no solo por ser la primera con 48 equipos, sino también por la magnitud de su infraestructura. Seis ciudades mexicanas, once estadounidenses y una canadiense albergarán los 104 partidos del torneo, en lo que será el Mundial más extenso jamás realizado.\n\nMéxico aportará tres sedes: la Ciudad de México con el Estadio Azteca, Guadalajara con el Estadio Akron y Monterrey con el Estadio BBVA. Estas ciudades tienen una tradición futbolística profunda y sus aficiones son reconocidas mundialmente por su pasión. Canadá tendrá dos sedes: Toronto con el BMO Field y Vancouver con el BC Place.\n\nEstados Unidos será el país con más sedes: SoFi Stadium en Los Ángeles, MetLife Stadium en Nueva Jersey, AT&T Stadium en Arlington, NRG Stadium en Houston, Mercedes-Benz Stadium en Atlanta, Hard Rock Stadium en Miami, Lumen Field en Seattle, Gillette Stadium en Boston, Lincoln Financial Field en Filadelfia, Arrowhead Stadium en Kansas City y Levi\'s Stadium en Santa Clara. La final se disputará en el MetLife Stadium de Nueva Jersey.',
    category: 'Infraestructura',
    date: '2026-06-01',
    imageKeyword: 'world-cup-stadiums-2026',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Ana Martínez',
    source: 'Nexo Digital',
    tags: ['Sedes', 'Estadios', 'México', 'USA', 'Canadá', 'Infraestructura'],
    featured: false,
    order: 5,
    active: true,
  },
  {
    id: 'n6',
    title: 'El nuevo formato de 48 equipos: cómo funciona el Mundial 2026',
    summary: 'Por primera vez en la historia, 48 selecciones disputarán la Copa del Mundo con 12 grupos de 4 equipos y una nueva fase de octavos.',
    content: 'La Copa Mundial de la FIFA 2026 marca un hito en la historia del fútbol con la introducción del formato de 48 equipos, el cambio más significativo desde la expansión a 32 selecciones en Francia 1998. El nuevo sistema promete más partidos, más emoción y más oportunidades para las selecciones de todos los continentes.\n\nLas 48 selecciones fueron divididas en 12 grupos de 4 equipos cada uno. En la fase de grupos, cada equipo jugará 3 partidos. Clasificarán a la siguiente ronda los dos primeros de cada grupo (24 equipos) más los 8 mejores terceros, dando un total de 32 selecciones en la ronda eliminatoria. Esto significa que se incorpora una nueva ronda de octavos de final.\n\nEl torneo tendrá un total de 104 partidos, 40 más que en la edición de Qatar 2022. La fase de grupos se extenderá desde el 11 de junio hasta el 27 de junio, tras lo cual comenzará la fase eliminatoria. La gran final está programada para el 19 de julio en el MetLife Stadium de Nueva Jersey. Este formato ofrece más oportunidades a las selecciones emergentes y garantiza que el tercer lugar de cada grupo aún tenga opciones de clasificación.',
    category: 'Formato',
    date: '2026-06-01',
    imageKeyword: 'world-cup-format-48-teams',
    imageUrl: '',
    imageDataUrl: '',
    gallery: [],
    author: 'Diego Fernández',
    source: 'Nexo Digital',
    tags: ['Formato', '48 equipos', '12 grupos', 'Octavos de final', 'Reglamento'],
    featured: false,
    order: 6,
    active: true,
  },
];

// ==================== MATCH SYNTHESES ====================
export const matchSyntheses: MatchSynthesis[] = [];

// ==================== VOTING MATCHES ====================
export const votingMatches: VotingMatch[] = [];

// ==================== BANNERS ====================
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
    width: 728,
    height: 90,
    displayDuration: 10,
    targetType: '_blank',
    bgColor: '#E6F7FF',
    borderRadius: 'lg',
    imageDataUrl: '',
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
    width: 300,
    height: 250,
    displayDuration: 15,
    targetType: '_blank',
    bgColor: '#FFF3E0',
    borderRadius: 'md',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 10,
    targetType: '_blank',
    bgColor: '#FFF3E0',
    borderRadius: 'lg',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 8,
    targetType: '_blank',
    bgColor: '#F5F5F5',
    borderRadius: 'md',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 10,
    targetType: '_blank',
    bgColor: '#E6F7FF',
    borderRadius: 'lg',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 8,
    targetType: '_blank',
    bgColor: '#F5F5F5',
    borderRadius: 'lg',
    imageDataUrl: '',
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
    width: 300,
    height: 250,
    displayDuration: 15,
    targetType: '_blank',
    bgColor: '#FFF3E0',
    borderRadius: 'md',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 10,
    targetType: '_blank',
    bgColor: '#FFF3E0',
    borderRadius: 'lg',
    imageDataUrl: '',
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
    width: 728,
    height: 90,
    displayDuration: 8,
    targetType: '_self',
    bgColor: '#F5F5F5',
    borderRadius: 'lg',
    imageDataUrl: '',
  },
  {
    id: 'b10',
    title: 'Hisense - Smart Viewing',
    imageUrl: '/banners/hisense.jpg',
    linkUrl: 'https://hisense.com',
    position: 'sticky-bottom',
    active: true,
    priority: 1,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    impressions: 89000,
    clicks: 3200,
    createdBy: 'admin',
    width: 970,
    height: 50,
    displayDuration: 5,
    targetType: '_blank',
    bgColor: '#0099FF',
    borderRadius: 'full',
    imageDataUrl: '',
  },
  {
    id: 'b11',
    title: 'Wanda - Sponsors of Dreams',
    imageUrl: '/banners/wanda.jpg',
    linkUrl: 'https://wanda.com',
    position: 'floating-right',
    active: true,
    priority: 1,
    startDate: '2026-06-10',
    endDate: '2026-07-20',
    impressions: 41200,
    clicks: 1100,
    createdBy: 'comercial',
    width: 160,
    height: 600,
    displayDuration: 20,
    targetType: '_blank',
    bgColor: '#FF6800',
    borderRadius: 'md',
    imageDataUrl: '',
  },
  {
    id: 'b12',
    title: 'Coca-Cola Half-time Show',
    imageUrl: '/banners/cocacola-halftime.jpg',
    linkUrl: 'https://coca-cola.com',
    position: 'navbar-below',
    active: true,
    priority: 1,
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    impressions: 67800,
    clicks: 2340,
    createdBy: 'admin',
    width: 970,
    height: 66,
    displayDuration: 7,
    targetType: '_blank',
    bgColor: '#CC0000',
    borderRadius: 'none',
    imageDataUrl: '',
  },
];

// ==================== SLIDER SLIDES (4) ====================
export interface SliderSlide {
  id: string;
  title: string;          // Main headline (e.g., "Argentina golea 4-0")
  subtitle: string;       // Subheading (e.g., "Messi brillante con doblete")
  matchId: string | null; // Link to a match (optional)
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  category: string;       // e.g., "En Vivo", "Resultado", "Próximo Partido"
  imageUrl: string;       // Background image URL (can be empty)
  imageDataUrl: string;   // Base64 data URL for uploaded images (client-side)
  bgColor: string;        // Fallback background color
  active: boolean;
  order: number;          // Display order (1-4)
  linkTo: string;         // Navigation target tab
}

export const sliderSlides: SliderSlide[] = [
  {
    id: 'slide1',
    title: 'Argentina golea 4-0',
    subtitle: 'Messi brillante con doblete ante Argelia',
    matchId: 'm19',
    homeTeamId: 'arg',
    awayTeamId: 'alg',
    homeScore: 4,
    awayScore: 0,
    category: 'Resultado',
    imageUrl: '/slides/argentina-goleada.webp',
    imageDataUrl: '',
    bgColor: '#003366',
    active: true,
    order: 1,
    linkTo: 'resultados',
  },
  {
    id: 'slide2',
    title: 'México vs Chequia',
    subtitle: 'Empate emocionante en el Azteca — Min 62',
    matchId: 'm25',
    homeTeamId: 'mex',
    awayTeamId: 'cze',
    homeScore: 1,
    awayScore: 1,
    category: 'En Vivo',
    imageUrl: '/slides/mexico-vs-chequia.webp',
    imageDataUrl: '',
    bgColor: '#0D47A1',
    active: true,
    order: 2,
    linkTo: 'en-vivo',
  },
  {
    id: 'slide3',
    title: 'Francia vs Noruega',
    subtitle: 'Haaland da la vuelta con doblete — Min 58',
    matchId: 'm29',
    homeTeamId: 'fra',
    awayTeamId: 'nor',
    homeScore: 1,
    awayScore: 2,
    category: 'En Vivo',
    imageUrl: '/slides/francia-vs-noruega.webp',
    imageDataUrl: '',
    bgColor: '#BF360C',
    active: true,
    order: 3,
    linkTo: 'en-vivo',
  },
  {
    id: 'slide4',
    title: 'Próximos Partidos',
    subtitle: 'Jornada 3 — 12 partidos por jugar',
    matchId: null,
    homeTeamId: null,
    awayTeamId: null,
    homeScore: null,
    awayScore: null,
    category: 'Próximo',
    imageUrl: '/slides/proximos-partidos.webp',
    imageDataUrl: '',
    bgColor: '#4A148C',
    active: true,
    order: 4,
    linkTo: 'grupos',
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

export function getTeamCode(id: string): string {
  return teams.find(t => t.id === id)?.code ?? '';
}

export function getTeamColor(id: string): string {
  return teams.find(t => t.id === id)?.color ?? '#666666';
}

/**
 * Determine if a hex color is "light" (needs dark text) or "dark" (needs light text).
 * Uses the W3C relative luminance formula for brightness.
 */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
}

/**
 * Returns the appropriate text color for readability over a given background color.
 * Light backgrounds get dark text, dark backgrounds get white text.
 */
export function getContrastTextColor(bgColor: string): string {
  return isLightColor(bgColor) ? '#1a1a1a' : 'rgba(255,255,255,0.95)';
}

export function getTeamFlagUrl(id: string, width: number = 80): string {
  const code = teams.find(t => t.id === id)?.code;
  if (!code) return '';
  // flagcdn.com provides free flag images by country code
  return `https://flagcdn.com/w${width}/${code}.png`;
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
