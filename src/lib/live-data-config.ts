// ==================== LIVE DATA CONFIGURATION ====================
// Sistema de configuración para datos en vivo del Mundial 2026
// Permite alternar entre datos simulados (mock) y datos reales de APIs

export type DataSourceProvider = 'mock' | 'api-football' | 'football-data' | 'sportmonks' | 'livescore' | 'custom';

export interface DataSourceConfig {
  provider: DataSourceProvider;
  apiKey: string;
  baseUrl: string;
  pollInterval: number; // segundos entre consultas
  enabled: boolean;
  // Configuración específica del proveedor
  options: Record<string, string>;
}

export interface LiveDataState {
  dataSource: DataSourceConfig;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastSync: number | null;
  errorCount: number;
  totalRequests: number;
  lastError: string | null;
  // Estadísticas
  matchesSynced: number;
  goalsSynced: number;
  eventsSynced: number;
}

// ==================== PROVEEDORES DISPONIBLES ====================

export const DATA_PROVIDERS: Record<Exclude<DataSourceProvider, 'mock' | 'custom'>, {
  name: string;
  description: string;
  baseUrl: string;
  docsUrl: string;
  pricing: string;
  features: string[];
  requiredFields: { key: string; label: string; type: 'text' | 'password'; placeholder: string }[];
}> = {
  'api-football': {
    name: 'API-Sports / API-Football',
    description: 'El proveedor más popular de datos de fútbol. Conexión directa con API-Sports usando el header x-apisports-key. Cobertura completa de la FIFA World Cup 2026 con datos en tiempo real, estadísticas, alineaciones y eventos minuto a minuto.',
    baseUrl: 'https://v3.football.api-sports.io',
    docsUrl: 'https://www.api-football.com/documentation-v3',
    pricing: 'Gratis: 100 req/día (sin acceso a World Cup 2026) | Pro: $9.99/mes (3000 req/día + World Cup 2026) | Ultra: $29.99/mes (ilimitado)',
    features: [
      'Resultados en vivo minuto a minuto',
      'Alineaciones y formaciones',
      'Estadísticas avanzadas (posesión, tiros, faltas)',
      'Eventos: goles, tarjetas, sustituciones',
      'Odds en vivo',
      'Head-to-head',
      'Clasificación de grupos actualizada',
      'Goleadores en tiempo real',
    ],
    requiredFields: [
      { key: 'apiKey', label: 'API Key (x-apisports-key)', type: 'password', placeholder: 'tu-api-key-de-api-sports' },
    ],
  },
  'football-data': {
    name: 'Football-Data.org',
    description: 'API gratuita y de código abierto para datos de fútbol europeo e internacional. Ideal para comenzar sin inversión. Soporta competiciones FIFA.',
    baseUrl: 'https://api.football-data.org/v4',
    docsUrl: 'https://www.football-data.org/documentation/api',
    pricing: 'Gratis: 10 req/min | Standard: €19/mes (30 req/min) | Pro: €99/mes (100 req/min)',
    features: [
      'Partidos en vivo',
      'Clasificaciones de grupos',
      'Goleadores',
      'Alineaciones',
      'Eventos de partido',
      'Cobertura FIFA World Cup',
    ],
    requiredFields: [
      { key: 'apiKey', label: 'API Key (X-Auth-Token)', type: 'password', placeholder: 'tu-auth-token' },
    ],
  },
  'sportmonks': {
    name: 'SportMonks',
    description: 'Proveedor premium con datos ultra-detallados. La mejor opción para cobertura profesional del Mundial con datos enriquecidos y estadísticas avanzadas.',
    baseUrl: 'https://api.sportmonks.com/v3/football',
    docsUrl: 'https://docs.sportmonks.com/football',
    pricing: 'Gratis: limitado | Standard: €29/mes | Advanced: €79/mes | Enterprise: custom',
    features: [
      'Datos en vivo con latencia < 30 segundos',
      'Estadísticas avanzadas por jugador',
      'Heatmaps de jugadores',
      'Datos de posesión en tiempo real',
      'Probabilidades en vivo (win probability)',
      'Datos de árbitros',
      'Información de estadios',
      'Cobertura completa de World Cup',
    ],
    requiredFields: [
      { key: 'apiKey', label: 'API Token', type: 'password', placeholder: 'tu-api-token-sportmonks' },
    ],
  },
  'livescore': {
    name: 'LiveScore API',
    description: 'API oficial de LiveScore con datos en tiempo real de fútbol de todo el mundo. Usa API Key + API Secret para autenticación. Cobertura de más de 200 ligas y competiciones internacionales incluyendo la FIFA World Cup.',
    baseUrl: 'https://livescore-api.com/api-client',
    docsUrl: 'https://livescore-api.com/documentation',
    pricing: 'Gratis: limitado (1 req/min) | Standard: €9.99/mes (30 req/min) | Pro: €49.99/mes (100 req/min) | Ultra: €99.99/mes (ilimitado)',
    features: [
      'Resultados en vivo de +200 ligas',
      'Datos minuto a minuto',
      'Tarjetas amarillas y rojas',
      'Goles y goleadores',
      'Partidos por fecha y competición',
      'Lista de países y competiciones',
      'Cobertura FIFA World Cup',
      'Eventos de partido en detalle',
    ],
    requiredFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'tu-api-key-de-livescore' },
      { key: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'tu-api-secret-de-livescore' },
    ],
  },
};

// ==================== CONFIGURACIÓN POR DEFECTO ====================

export const DEFAULT_DATA_SOURCE: DataSourceConfig = {
  provider: 'mock',
  apiKey: '',
  baseUrl: '',
  pollInterval: 30,
  enabled: false,
  options: {},
};

export const DEFAULT_LIVE_STATE: LiveDataState = {
  dataSource: DEFAULT_DATA_SOURCE,
  connectionStatus: 'disconnected',
  lastSync: null,
  errorCount: 0,
  totalRequests: 0,
  matchesSynced: 0,
  goalsSynced: 0,
  eventsSynced: 0,
  lastError: null,
};

// ==================== HELPERS ====================

const STORAGE_KEY = 'nexo-live-data-config';

export function saveDataSourceConfig(config: DataSourceConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving live data config:', e);
  }
}

export function loadDataSourceConfig(): DataSourceConfig {
  try {
    if (typeof window === 'undefined') return DEFAULT_DATA_SOURCE;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_DATA_SOURCE, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading live data config:', e);
  }
  return DEFAULT_DATA_SOURCE;
}

export function isLiveDataEnabled(): boolean {
  const config = loadDataSourceConfig();
  return config.provider !== 'mock' && config.enabled && config.apiKey.length > 0;
}

// ==================== MAPEO DE EQUIPOS ====================
// Mapeo de IDs internos a IDs de los proveedores de API

export const TEAM_ID_MAPPING: Record<string, Record<Exclude<DataSourceProvider, 'mock' | 'custom'>, string | number>> = {
  // Group A
  mex: { 'api-football': 505, 'football-data': 1550, 'sportmonks': 1541 },
  rsa: { 'api-football': 497, 'football-data': 766, 'sportmonks': 1623 },
  kor: { 'api-football': 498, 'football-data': 1553, 'sportmonks': 1570 },
  cze: { 'api-football': 503, 'football-data': 766, 'sportmonks': 1589 },
  // Group B
  can: { 'api-football': 494, 'football-data': 1559, 'sportmonks': 1586 },
  bih: { 'api-football': 508, 'football-data': 769, 'sportmonks': 1600 },
  qat: { 'api-football': 510, 'football-data': 780, 'sportmonks': 1632 },
  sui: { 'api-football': 507, 'football-data': 783, 'sportmonks': 1640 },
  // Group C
  bra: { 'api-football': 489, 'football-data': 764, 'sportmonks': 1570 },
  mar: { 'api-football': 519, 'football-data': 770, 'sportmonks': 1619 },
  hai: { 'api-football': 951, 'football-data': 1574, 'sportmonks': 1700 },
  sco: { 'api-football': 496, 'football-data': 782, 'sportmonks': 1634 },
  // Group D
  usa: { 'api-football': 494, 'football-data': 786, 'sportmonks': 1650 },
  par: { 'api-football': 522, 'football-data': 775, 'sportmonks': 1626 },
  aus: { 'api-football': 492, 'football-data': 763, 'sportmonks': 1573 },
  tur: { 'api-football': 511, 'football-data': 785, 'sportmonks': 1648 },
  // Group E
  ger: { 'api-football': 491, 'football-data': 759, 'sportmonks': 1603 },
  cuw: { 'api-football': 952, 'football-data': 1572, 'sportmonks': 1702 },
  civ: { 'api-football': 516, 'football-data': 1571, 'sportmonks': 1701 },
  ecu: { 'api-football': 523, 'football-data': 772, 'sportmonks': 1611 },
  // Group F
  ned: { 'api-football': 493, 'football-data': 774, 'sportmonks': 1622 },
  jpn: { 'api-football': 500, 'football-data': 766, 'sportmonks': 1620 },
  swe: { 'api-football': 506, 'football-data': 784, 'sportmonks': 1641 },
  tun: { 'api-football': 524, 'football-data': 787, 'sportmonks': 1649 },
  // Group G
  bel: { 'api-football': 488, 'football-data': 804, 'sportmonks': 1574 },
  egy: { 'api-football': 515, 'football-data': 773, 'sportmonks': 1610 },
  iri: { 'api-football': 504, 'football-data': 1575, 'sportmonks': 1703 },
  nzl: { 'api-football': 525, 'football-data': 777, 'sportmonks': 1627 },
  // Group H
  esp: { 'api-football': 9, 'football-data': 780, 'sportmonks': 1587 },
  cpv: { 'api-football': 953, 'football-data': 1570, 'sportmonks': 1704 },
  ksa: { 'api-football': 498, 'football-data': 779, 'sportmonks': 1631 },
  uru: { 'api-football': 487, 'football-data': 788, 'sportmonks': 1652 },
  // Group I
  fra: { 'api-football': 2, 'football-data': 773, 'sportmonks': 1596 },
  sen: { 'api-football': 517, 'football-data': 781, 'sportmonks': 1635 },
  irq: { 'api-football': 520, 'football-data': 1576, 'sportmonks': 1705 },
  nor: { 'api-football': 501, 'football-data': 776, 'sportmonks': 1624 },
  // Group J
  arg: { 'api-football': 26, 'football-data': 762, 'sportmonks': 1571 },
  alg: { 'api-football': 512, 'football-data': 761, 'sportmonks': 1578 },
  aut: { 'api-football': 486, 'football-data': 763, 'sportmonks': 1575 },
  jor: { 'api-football': 521, 'football-data': 1577, 'sportmonks': 1706 },
  // Group K
  por: { 'api-football': 495, 'football-data': 778, 'sportmonks': 1628 },
  cod: { 'api-football': 514, 'football-data': 1569, 'sportmonks': 1707 },
  uzb: { 'api-football': 527, 'football-data': 789, 'sportmonks': 1654 },
  col: { 'api-football': 487, 'football-data': 767, 'sportmonks': 1592 },
  // Group L
  eng: { 'api-football': 10, 'football-data': 770, 'sportmonks': 1605 },
  cro: { 'api-football': 499, 'football-data': 768, 'sportmonks': 1593 },
  gha: { 'api-football': 518, 'football-data': 773, 'sportmonks': 1602 },
  pan: { 'api-football': 526, 'football-data': 775, 'sportmonks': 1625 },
};

// ==================== WORLD CUP 2026 TOURNAMENT IDS ====================

export const TOURNAMENT_IDS: Record<Exclude<DataSourceProvider, 'mock' | 'custom'>, number | string> = {
  'api-football': 1,    // World Cup en API-Football (se actualiza para 2026)
  'football-data': 2000, // World Cup en football-data.org
  'sportmonks': 1700,    // World Cup en SportMonks
  'livescore': 3,        // World Cup en LiveScore API
};

// ==================== TIPOS DE DATOS UNIFICADOS ====================

export interface LiveMatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'not_started' | 'in_play' | 'half_time' | 'finished' | 'postponed' | 'cancelled';
  events: LiveMatchEvent[];
  statistics: LiveMatchStatistics;
}

export interface LiveMatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'penalty' | 'own_goal';
  minute: number;
  player: string;
  team: string;
  detail?: string;
  assist?: string;
}

export interface LiveMatchStatistics {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}
