// ==================== LIVESCORE API ADAPTER ====================
// Adaptador para LiveScore API (livescore-api.com)
// Autenticación: API Key + API Secret como query parameters
// Docs: https://livescore-api.com/documentation
// Dashboard: https://livescore-api.com/dashboard

import type { DataSourceConfig, LiveMatchData, LiveMatchEvent, LiveMatchStatistics } from '../live-data-config';

interface LiveScoreMatch {
  id: string;
  league_id: string;
  league_name: string;
  country_id: string;
  country_name: string;
  home_id: string;
  home_name: string;
  away_id: string;
  away_name: string;
  score: string;
  ht_score: string;
  ft_score: string;
  et_score: string;
  penalty_score: string;
  time: string;
  status: string;
  added: string;
  last_changed: string;
  home_yellow_cards: string;
  home_red_cards: string;
  away_yellow_cards: string;
  away_red_cards: string;
  home_penalties: string;
  away_penalties: string;
}

interface LiveScoreEvent {
  id: string;
  match_id: string;
  type: string;
  time: string;
  team: string;
  player: string;
  score: string;
  info: string;
}

// ==================== FETCH FUNCTION ====================
// LiveScore API usa key y secret como query parameters
// Base URL: https://livescore-api.com/api-client

async function liveScoreFetch(
  config: DataSourceConfig,
  endpoint: string,
  params: Record<string, string> = {}
): Promise<any> {
  const baseUrl = config.baseUrl || 'https://livescore-api.com/api-client';
  const url = new URL(`${baseUrl}${endpoint}`);

  // Autenticación obligatoria: key y secret como query params
  url.searchParams.set('key', config.apiKey);
  url.searchParams.set('secret', config.options.apiSecret || '');

  // Parámetros adicionales
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LiveScore API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Verificar errores de la API
  if (data.success === false) {
    throw new Error(`LiveScore: ${data.error || 'Error desconocido'}`);
  }

  return data.data || data;
}

// ==================== MAPPING FUNCTIONS ====================

function mapStatus(status: string): LiveMatchData['status'] {
  const statusMap: Record<string, LiveMatchData['status']> = {
    '0': 'not_started',   // Not started
    '1': 'in_play',       // 1st half
    '2': 'in_play',       // 2nd half
    '3': 'finished',      // Finished
    '4': 'in_play',       // Extra time
    '5': 'in_play',       // Penalties
    '6': 'half_time',     // Half time
    '7': 'postponed',     // Postponed
    '8': 'cancelled',     // Cancelled
    '9': 'in_play',       // Abandoned (treat as in play then finished)
    '10': 'in_play',      // 1st half extra
    '11': 'in_play',      // 2nd half extra
    '12': 'half_time',    // Half time extra
    '13': 'in_play',      //Awaiting extra time
    '14': 'in_play',      // Awaiting penalties
    // También soportar texto
    'LIVE': 'in_play',
    'HT': 'half_time',
    'FT': 'finished',
    'NS': 'not_started',
    'PST': 'postponed',
    'CANC': 'cancelled',
  };
  return statusMap[status] || 'not_started';
}

function parseScore(scoreStr: string): { home: number; away: number } {
  if (!scoreStr || scoreStr === '?') return { home: 0, away: 0 };
  const parts = scoreStr.split('-').map(s => parseInt(s.trim()) || 0);
  return { home: parts[0] || 0, away: parts[1] || 0 };
}

function parseMinute(timeStr: string, status: string): number {
  if (!timeStr) return 0;
  // LiveScore time format can be like "45'", "90+2", "HT", "FT"
  const match = timeStr.match(/(\d+)/);
  if (match) return parseInt(match[1]);
  if (status === '6' || status === 'HT') return 45;
  if (status === '3' || status === 'FT') return 90;
  return 0;
}

// ==================== LIGAS POPULARES PARA LIVESCORE ====================

export const LIVESCORE_POPULAR_LEAGUES = [
  { id: '100', name: 'Copa Libertadores', country: 'Sudamérica', flag: '🌎' },
  { id: '101', name: 'Copa Sudamericana', country: 'Sudamérica', flag: '🌎' },
  { id: '152', name: 'Liga Profesional Argentina', country: 'Argentina', flag: '🇦🇷' },
  { id: '153', name: 'Copa Argentina', country: 'Argentina', flag: '🇦🇷' },
  { id: '77', name: 'Premier League', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '78', name: 'Championship', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '79', name: 'FA Cup', country: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '87', name: 'La Liga', country: 'España', flag: '🇪🇸' },
  { id: '88', name: 'Copa del Rey', country: 'España', flag: '🇪🇸' },
  { id: '94', name: 'Serie A', country: 'Italia', flag: '🇮🇹' },
  { id: '95', name: 'Coppa Italia', country: 'Italia', flag: '🇮🇹' },
  { id: '80', name: 'Bundesliga', country: 'Alemania', flag: '🇩🇪' },
  { id: '81', name: 'DFB Pokal', country: 'Alemania', flag: '🇩🇪' },
  { id: '98', name: 'Ligue 1', country: 'Francia', flag: '🇫🇷' },
  { id: '90', name: 'Primeira Liga', country: 'Portugal', flag: '🇵🇹' },
  { id: '109', name: 'Serie A Brasil', country: 'Brasil', flag: '🇧🇷' },
  { id: '204', name: 'MLS', country: 'EE.UU.', flag: '🇺🇸' },
  { id: '86', name: 'Champions League', country: 'Europa', flag: '🇪🇺' },
  { id: '87', name: 'Europa League', country: 'Europa', flag: '🇪🇺' },
  { id: '3', name: 'FIFA World Cup', country: 'Mundial', flag: '🌍' },
  { id: '4', name: 'Euro Championship', country: 'Europa', flag: '🇪🇺' },
  { id: '5', name: 'Copa América', country: 'Sudamérica', flag: '🌎' },
];

// ==================== EXPORTED ADAPTER ====================

export const liveScoreAdapter = {
  name: 'LiveScore API',

  // Obtener todos los partidos en vivo actualmente
  async getLiveMatches(config: DataSourceConfig): Promise<LiveMatchData[]> {
    const data = await liveScoreFetch(config, '/scores/live.json');
    const matches: LiveScoreMatch[] = Array.isArray(data) ? data : (data?.match || []);

    return matches.map((m: LiveScoreMatch) => {
      const score = parseScore(m.score || m.ft_score);
      return {
        id: `ls_${m.id}`,
        homeTeam: m.home_name,
        awayTeam: m.away_name,
        homeTeamId: `ls_${m.home_id}`,
        awayTeamId: `ls_${m.away_id}`,
        homeScore: score.home,
        awayScore: score.away,
        minute: parseMinute(m.time, m.status),
        status: mapStatus(m.status),
        events: [],
        statistics: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          shotsOnTarget: { home: 0, away: 0 },
          corners: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 },
          offsides: { home: 0, away: 0 },
          yellowCards: { home: parseInt(m.home_yellow_cards) || 0, away: parseInt(m.away_yellow_cards) || 0 },
          redCards: { home: parseInt(m.home_red_cards) || 0, away: parseInt(m.away_red_cards) || 0 },
        },
      };
    });
  },

  // Obtener partidos por fecha (formato YYYYMMDD)
  async getMatchesByDate(config: DataSourceConfig, date: string): Promise<LiveMatchData[]> {
    // Convertir YYYY-MM-DD a YYYYMMDD
    const formattedDate = date.replace(/-/g, '');
    const data = await liveScoreFetch(config, '/scores/date.json', { date: formattedDate });
    const matches: LiveScoreMatch[] = Array.isArray(data) ? data : (data?.match || []);

    return matches.map((m: LiveScoreMatch) => {
      const score = parseScore(m.score || m.ft_score);
      return {
        id: `ls_${m.id}`,
        homeTeam: m.home_name,
        awayTeam: m.away_name,
        homeTeamId: `ls_${m.home_id}`,
        awayTeamId: `ls_${m.away_id}`,
        homeScore: score.home,
        awayScore: score.away,
        minute: parseMinute(m.time, m.status),
        status: mapStatus(m.status),
        events: [],
        statistics: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          shotsOnTarget: { home: 0, away: 0 },
          corners: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 },
          offsides: { home: 0, away: 0 },
          yellowCards: { home: parseInt(m.home_yellow_cards) || 0, away: parseInt(m.away_yellow_cards) || 0 },
          redCards: { home: parseInt(m.home_red_cards) || 0, away: parseInt(m.away_red_cards) || 0 },
        },
      };
    });
  },

  // Obtener partidos de una liga/competición
  async getLeagueMatches(config: DataSourceConfig, leagueId: string, date?: string): Promise<LiveMatchData[]> {
    const params: Record<string, string> = { league_id: String(leagueId) };
    if (date) params.date = date.replace(/-/g, '');

    const data = await liveScoreFetch(config, '/scores/date.json', params);
    const matches: LiveScoreMatch[] = Array.isArray(data) ? data : (data?.match || []);

    return matches.map((m: LiveScoreMatch) => {
      const score = parseScore(m.score || m.ft_score);
      return {
        id: `ls_${m.id}`,
        homeTeam: m.home_name,
        awayTeam: m.away_name,
        homeTeamId: `ls_${m.home_id}`,
        awayTeamId: `ls_${m.away_id}`,
        homeScore: score.home,
        awayScore: score.away,
        minute: parseMinute(m.time, m.status),
        status: mapStatus(m.status),
        events: [],
        statistics: {
          possession: { home: 50, away: 50 },
          shots: { home: 0, away: 0 },
          shotsOnTarget: { home: 0, away: 0 },
          corners: { home: 0, away: 0 },
          fouls: { home: 0, away: 0 },
          offsides: { home: 0, away: 0 },
          yellowCards: { home: parseInt(m.home_yellow_cards) || 0, away: parseInt(m.away_yellow_cards) || 0 },
          redCards: { home: parseInt(m.home_red_cards) || 0, away: parseInt(m.away_red_cards) || 0 },
        },
      };
    });
  },

  // Obtener eventos de un partido específico
  async getMatchEvents(config: DataSourceConfig, matchId: string): Promise<LiveMatchEvent[]> {
    try {
      const data = await liveScoreFetch(config, '/matches/get.json', { match_id: matchId });
      const events: LiveScoreEvent[] = Array.isArray(data) ? data : (data?.events || []);

      return events.map((e: LiveScoreEvent) => ({
        id: `evt_${e.id || Math.random().toString(36).slice(2)}`,
        type: mapEventType(e.type),
        minute: parseInt(e.time) || 0,
        player: e.player || 'Desconocido',
        team: e.team || '',
        detail: e.info || '',
        assist: undefined,
      }));
    } catch {
      return [];
    }
  },

  // Obtener lista de países disponibles
  async getCountries(config: DataSourceConfig): Promise<any> {
    return liveScoreFetch(config, '/countries/list.json');
  },

  // Obtener lista de competiciones disponibles
  async getCompetitions(config: DataSourceConfig, countryId?: string): Promise<any> {
    const params: Record<string, string> = {};
    if (countryId) params.country_id = countryId;
    return liveScoreFetch(config, '/competitions/list.json', params);
  },

  // Probar la conexión
  async testConnection(config: DataSourceConfig): Promise<{ success: boolean; message: string }> {
    try {
      const data = await liveScoreFetch(config, '/countries/list.json');
      const countries = Array.isArray(data) ? data : (data?.country || []);
      return {
        success: true,
        message: `Conectado a LiveScore API. ${countries.length} países disponibles.`,
      };
    } catch (error: any) {
      const msg = error.message || '';
      if (msg.includes('do not have access')) {
        return {
          success: false,
          message: 'Tu cuenta de LiveScore no tiene acceso a datos activado. Visitá https://livescore-api.com/dashboard para activar tu plan.',
        };
      }
      if (msg.includes('Invalid') || msg.includes('invalid')) {
        return {
          success: false,
          message: 'API Key o Secret inválidos. Verificá tus credenciales en https://livescore-api.com/dashboard',
        };
      }
      return { success: false, message: `Error: ${msg}` };
    }
  },
};

function mapEventType(type: string): LiveMatchEvent['type'] {
  const typeMap: Record<string, LiveMatchEvent['type']> = {
    'goal': 'goal',
    'penalty': 'penalty',
    'own_goal': 'own_goal',
    'yellow_card': 'yellow_card',
    'red_card': 'red_card',
    'substitution': 'substitution',
    'var': 'var',
  };
  return typeMap[type?.toLowerCase()] || 'goal';
}
