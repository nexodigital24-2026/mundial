// ==================== API-FOOTBALL / API-SPORTS ADAPTER ====================
// Adaptador para API-Sports (API-Football v3)
// Conexión directa usando header x-apisports-key
// Docs: https://www.api-football.com/documentation-v3
// Obtener API Key: https://dashboard.api-football.com/profile?access

import type { DataSourceConfig, LiveMatchData, LiveMatchEvent, LiveMatchStatistics } from '../live-data-config';

interface APIFootballMatch {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: { first: number; second: number };
    venue: { id: number; name: string; city: string };
    status: {
      long: string;
      short: string;
      elapsed: number;
    };
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number;
    away: number;
  };
  score: {
    halftime: { home: number; away: number };
    fulltime: { home: number; away: number };
    extratime: { home: number; away: number };
    penalty: { home: number; away: number };
  };
  league?: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
}

interface APIFootballEvent {
  time: { elapsed: number; extra: number | null };
  type: string;
  detail: string;
  comments: string;
  player: { id: number; name: string };
  team: { id: number; name: string };
  assist: { id: number; name: string } | null;
}

interface APIFootballStatistics {
  team: { id: number; name: string };
  statistics: {
    type: string;
    value: number | null;
  }[];
}

// ==================== FETCH FUNCTION ====================
// Usa el header x-apisports-key para autenticación directa
// Solo se aceptan solicitudes GET
// El API Key va en los headers, NO en la URL

async function apiFootballFetch(config: DataSourceConfig, endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const baseUrl = config.baseUrl || 'https://v3.football.api-sports.io';
  const url = new URL(`${baseUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  // IMPORTANTE: El API Key va en el header x-apisports-key, NO en la URL
  // Solo se aceptan solicitudes GET
  // No incluir headers adicionales
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-apisports-key': config.apiKey,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API-Sports error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Verificar errores de la API
  if (data.errors && Object.keys(data.errors).length > 0) {
    const errorMessages = Object.values(data.errors).join(', ');
    throw new Error(`API-Sports: ${errorMessages}`);
  }

  return data.response;
}

// ==================== MAPPING FUNCTIONS ====================

function mapStatus(shortStatus: string): LiveMatchData['status'] {
  const statusMap: Record<string, LiveMatchData['status']> = {
    'TBD': 'not_started',
    'NS': 'not_started',
    '1H': 'in_play',
    '2H': 'in_play',
    'HT': 'half_time',
    'ET': 'in_play',
    'BT': 'in_play',
    'P': 'in_play',
    'SUSP': 'postponed',
    'INT': 'postponed',
    'FT': 'finished',
    'AET': 'finished',
    'PEN': 'finished',
    'PST': 'postponed',
    'CANC': 'cancelled',
    'ABD': 'cancelled',
    'AWD': 'finished',
    'WO': 'finished',
    'LIVE': 'in_play',
  };
  return statusMap[shortStatus] || 'not_started';
}

function mapEventType(type: string, detail: string): LiveMatchEvent['type'] {
  if (type === 'Goal') {
    if (detail === 'Own Goal') return 'own_goal';
    if (detail === 'Penalty') return 'penalty';
    return 'goal';
  }
  if (type === 'Card') {
    if (detail.includes('Red')) return 'red_card';
    return 'yellow_card';
  }
  if (type === 'subst') return 'substitution';
  if (type === 'Var') return 'var';
  return 'goal'; // fallback
}

function mapStatistics(stats: APIFootballStatistics[]): LiveMatchStatistics {
  const homeStats: Record<string, number> = {};
  const awayStats: Record<string, number> = {};

  if (stats.length >= 2) {
    stats[0].statistics.forEach(s => {
      homeStats[s.type] = s.value || 0;
    });
    stats[1].statistics.forEach(s => {
      awayStats[s.type] = s.value || 0;
    });
  }

  return {
    possession: {
      home: homeStats['Ball Possession'] ? parseFloat(String(homeStats['Ball Possession'])) || 0 : 50,
      away: awayStats['Ball Possession'] ? parseFloat(String(awayStats['Ball Possession'])) || 0 : 50,
    },
    shots: { home: homeStats['Total Shots'] || 0, away: awayStats['Total Shots'] || 0 },
    shotsOnTarget: { home: homeStats['Shots on Goal'] || 0, away: awayStats['Shots on Goal'] || 0 },
    corners: { home: homeStats['Corner Kicks'] || 0, away: awayStats['Corner Kicks'] || 0 },
    fouls: { home: homeStats['Fouls'] || 0, away: awayStats['Fouls'] || 0 },
    offsides: { home: homeStats['Offsides'] || 0, away: awayStats['Offsides'] || 0 },
    yellowCards: { home: homeStats['Yellow Cards'] || 0, away: awayStats['Yellow Cards'] || 0 },
    redCards: { home: homeStats['Red Cards'] || 0, away: awayStats['Red Cards'] || 0 },
  };
}

function mapMatchToLiveMatch(m: APIFootballMatch): LiveMatchData {
  return {
    id: `af_${m.fixture.id}`,
    homeTeam: m.teams.home.name,
    awayTeam: m.teams.away.name,
    homeTeamId: String(m.teams.home.id),
    awayTeamId: String(m.teams.away.id),
    homeScore: m.goals.home || 0,
    awayScore: m.goals.away || 0,
    minute: m.fixture.status.elapsed || 0,
    status: mapStatus(m.fixture.status.short),
    events: [],
    statistics: {
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      offsides: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
    },
  };
}

// ==================== LIGAS POPULARES PARA TESTING ====================
// Estas ligas tienen partidos frecuentes y funcionan con el plan Free

export const POPULAR_LEAGUES = [
  { id: 128, name: 'Liga Profesional Argentina', country: 'Argentina', flag: '🇦🇷' },
  { id: 39, name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 140, name: 'La Liga', country: 'España', flag: '🇪🇸' },
  { id: 135, name: 'Serie A', country: 'Italia', flag: '🇮🇹' },
  { id: 78, name: 'Bundesliga', country: 'Alemania', flag: '🇩🇪' },
  { id: 61, name: 'Ligue 1', country: 'Francia', flag: '🇫🇷' },
  { id: 94, name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹' },
  { id: 71, name: 'Serie A Brasil', country: 'Brasil', flag: '🇧🇷' },
  { id: 253, name: 'MLS', country: 'EE.UU.', flag: '🇺🇸' },
  { id: 2, name: 'Champions League', country: 'Europa', flag: '🇪🇺' },
  { id: 3, name: 'Europa League', country: 'Europa', flag: '🇪🇺' },
  { id: 8, name: 'Copa Libertadores', country: 'Sudamérica', flag: '🌎' },
  { id: 10, name: 'Copa Sudamericana', country: 'Sudamérica', flag: '🌎' },
  { id: 1, name: 'FIFA World Cup', country: 'Mundial', flag: '🌍' },
  { id: 4, name: 'Euro Championship', country: 'Europa', flag: '🇪🇺' },
  { id: 16, name: 'Copa América', country: 'Sudamérica', flag: '🌎' },
];

// ==================== EXPORTED ADAPTER ====================

export const apiFootballAdapter = {
  name: 'API-Sports / API-Football',

  // Obtener todos los partidos en vivo actualmente
  async getLiveMatches(config: DataSourceConfig): Promise<LiveMatchData[]> {
    const matches = await apiFootballFetch(config, '/fixtures', { live: 'all' });
    return matches.map(mapMatchToLiveMatch);
  },

  // Obtener partidos por fecha (formato YYYY-MM-DD)
  async getMatchesByDate(config: DataSourceConfig, date: string): Promise<LiveMatchData[]> {
    const matches = await apiFootballFetch(config, '/fixtures', { date });
    return matches.map(mapMatchToLiveMatch);
  },

  // Obtener partidos por liga y temporada
  async getLeagueMatches(config: DataSourceConfig, leagueId: number, season: string = '2025'): Promise<LiveMatchData[]> {
    const matches = await apiFootballFetch(config, '/fixtures', {
      league: String(leagueId),
      season,
    });
    return matches.map(mapMatchToLiveMatch);
  },

  // Obtener partidos de hoy de una liga específica
  async getTodayLeagueMatches(config: DataSourceConfig, leagueId: number): Promise<LiveMatchData[]> {
    const today = new Date().toISOString().split('T')[0];
    const matches = await apiFootballFetch(config, '/fixtures', {
      league: String(leagueId),
      season: new Date().getFullYear().toString(),
      date: today,
    });
    return matches.map(mapMatchToLiveMatch);
  },

  // Obtener eventos de un partido específico (goles, tarjetas, sustituciones)
  async getMatchEvents(config: DataSourceConfig, fixtureId: number): Promise<LiveMatchEvent[]> {
    const events = await apiFootballFetch(config, '/fixtures/events', { fixture: String(fixtureId) });
    return events.map((e: APIFootballEvent) => ({
      id: `evt_${e.time.elapsed}_${e.player?.id || 0}`,
      type: mapEventType(e.type, e.detail),
      minute: e.time.elapsed + (e.time.extra || 0),
      player: e.player?.name || 'Desconocido',
      team: e.team.name,
      detail: e.detail,
      assist: e.assist?.name,
    }));
  },

  // Obtener estadísticas de un partido específico
  async getMatchStatistics(config: DataSourceConfig, fixtureId: number): Promise<LiveMatchStatistics> {
    try {
      const stats = await apiFootballFetch(config, '/fixtures/statistics', { fixture: String(fixtureId) });
      return mapStatistics(stats);
    } catch {
      return {
        possession: { home: 50, away: 50 },
        shots: { home: 0, away: 0 },
        shotsOnTarget: { home: 0, away: 0 },
        corners: { home: 0, away: 0 },
        fouls: { home: 0, away: 0 },
        offsides: { home: 0, away: 0 },
        yellowCards: { home: 0, away: 0 },
        redCards: { home: 0, away: 0 },
      };
    }
  },

  // Obtener todos los partidos del Mundial 2026
  async getWorldCupMatches(config: DataSourceConfig, tournamentId: number): Promise<LiveMatchData[]> {
    const matches = await apiFootballFetch(config, '/fixtures', {
      league: String(tournamentId),
      season: '2026',
    });
    return matches.map(mapMatchToLiveMatch);
  },

  // Obtener alineaciones de un partido
  async getMatchLineups(config: DataSourceConfig, fixtureId: number): Promise<any> {
    return apiFootballFetch(config, '/fixtures/lineups', { fixture: String(fixtureId) });
  },

  // Obtener la tabla de goleadores del torneo
  async getTopScorers(config: DataSourceConfig, leagueId: number, season: string = '2026'): Promise<any> {
    return apiFootballFetch(config, '/players/topscorers', {
      league: String(leagueId),
      season,
    });
  },

  // Obtener las clasificaciones de grupos del torneo
  async getStandings(config: DataSourceConfig, leagueId: number, season: string = '2026'): Promise<any> {
    return apiFootballFetch(config, '/standings', {
      league: String(leagueId),
      season,
    });
  },

  // Obtener ligas disponibles
  async getLeagues(config: DataSourceConfig): Promise<any> {
    return apiFootballFetch(config, '/leagues', {});
  },

  // Probar la conexión verificando el estado de la cuenta
  async testConnection(config: DataSourceConfig): Promise<{ success: boolean; message: string }> {
    try {
      const result = await apiFootballFetch(config, '/status');
      const account = result?.account;
      if (account) {
        const requests = account.requests?.current || 0;
        const limit = account.requests?.limit_day || 100;
        return {
          success: true,
          message: `Conectado a API-Sports. Plan: ${account.plan || 'Free'}. Requests hoy: ${requests}/${limit}`,
        };
      }
      return { success: true, message: 'Conexión exitosa a API-Sports / API-Football' };
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('suspended') || msg.includes('access')) {
        return {
          success: false,
          message: 'Tu cuenta está SUSPENDIDA. Visitá https://dashboard.api-football.com para reactivarla. Las cuentas Free se suspenden por inactividad.',
        };
      }
      return { success: false, message: `Error: ${msg}` };
    }
  },
};
