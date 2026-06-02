// ==================== SPORTMONKS ADAPTER ====================
// Adaptador para SportMonks Football API
// Docs: https://docs.sportmonks.com/football

import type { DataSourceConfig, LiveMatchData, LiveMatchEvent, LiveMatchStatistics } from '../live-data-config';

interface SMFixture {
  id: number;
  league_id: number;
  season_id: number;
  stage_id: number;
  round_id: number;
  group_id: number;
  aggregate_id: number;
  venue_id: number;
  referee_id: number;
  localteam_id: number;
  visitorteam_id: number;
  name: string;
  starting_at: string;
  result_info: string;
  leg: string;
  details: string;
  length: number;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  starting_at_timestamp: number;
  scores: {
    localteam_score: number;
    visitorteam_score: number;
    ht_score: string;
    ft_score: string;
    et_score: string | null;
    ps_score: string | null;
  };
  time: {
    status: string;
    starting_at: string;
    minute: number;
    second: number;
    added_time: number;
    extra_minute: number;
    injury_time: number;
  };
  localTeam: { data: { id: number; name: string; short_code: string; image_path: string } };
  visitorTeam: { data: { id: number; name: string; short_code: string; image_path: string } };
  events?: { data: SMEvent[] };
  stats?: { data: SMStat[] };
}

interface SMEvent {
  id: number;
  fixture_id: number;
  team_id: number;
  type: string;
  related_player_id: number;
  player: { data: { id: number; name: string; common_name: string } };
  minute: number;
  extra_minute: number;
  result: string;
  added_time: number;
  injuried: boolean;
  on_bench: boolean;
}

interface SMStat {
  id: number;
  fixture_id: number;
  type_id: number;
  type: { data: { id: number; name: string; code: string } };
  team_id: number;
  value: { data: { value: string } };
}

// ==================== FETCH FUNCTIONS ====================

async function sportmonksFetch(config: DataSourceConfig, endpoint: string, includes: string[] = []): Promise<any> {
  const url = new URL(`${config.baseUrl}${endpoint}`);
  url.searchParams.set('api_token', config.apiKey);
  if (includes.length > 0) {
    url.searchParams.set('include', includes.join(','));
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SportMonks error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`SportMonks API error: ${data.error.message}`);
  }

  return data.data;
}

// ==================== MAPPING FUNCTIONS ====================

function mapSMStatus(status: string): LiveMatchData['status'] {
  const statusMap: Record<string, LiveMatchData['status']> = {
    'NS': 'not_started',
    'LIVE': 'in_play',
    'HT': 'half_time',
    'FT': 'finished',
    'AET': 'finished',
    'PEN': 'finished',
    'PST': 'postponed',
    'CANC': 'cancelled',
    'SUSP': 'postponed',
    'INT': 'postponed',
    'ABD': 'cancelled',
    'AWD': 'finished',
    'WO': 'finished',
    'TBA': 'not_started',
  };
  return statusMap[status] || 'not_started';
}

function mapSMEventType(type: string): LiveMatchEvent['type'] {
  const normalized = type.toLowerCase();
  if (normalized.includes('goal')) return 'goal';
  if (normalized.includes('yellow')) return 'yellow_card';
  if (normalized.includes('red')) return 'red_card';
  if (normalized.includes('subst')) return 'substitution';
  if (normalized.includes('penalty')) return 'penalty';
  if (normalized.includes('own')) return 'own_goal';
  if (normalized.includes('var')) return 'var';
  return 'goal';
}

// ==================== EXPORTED ADAPTER ====================

export const sportmonksAdapter = {
  name: 'SportMonks',

  async getLiveMatches(config: DataSourceConfig): Promise<LiveMatchData[]> {
    const fixtures = await sportmonksFetch(config, '/livescores', ['localTeam', 'visitorTeam', 'events', 'stats']);

    return (Array.isArray(fixtures) ? fixtures : []).map((f: SMFixture) => ({
      id: `sm_${f.id}`,
      homeTeam: f.localTeam?.data?.name || 'Local',
      awayTeam: f.visitorTeam?.data?.name || 'Visitante',
      homeTeamId: String(f.localteam_id),
      awayTeamId: String(f.visitorteam_id),
      homeScore: f.scores?.localteam_score || 0,
      awayScore: f.scores?.visitorteam_score || 0,
      minute: f.time?.minute || 0,
      status: mapSMStatus(f.time?.status || 'NS'),
      events: (f.events?.data || []).map((e: SMEvent) => ({
        id: `evt_${e.id}`,
        type: mapSMEventType(e.type),
        minute: e.minute + (e.extra_minute || 0),
        player: e.player?.data?.common_name || e.player?.data?.name || 'Desconocido',
        team: String(e.team_id),
        detail: e.result,
      })),
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
    }));
  },

  async getWorldCupMatches(config: DataSourceConfig, seasonId: number): Promise<LiveMatchData[]> {
    const fixtures = await sportmonksFetch(
      config,
      `/seasons/${seasonId}/fixtures`,
      ['localTeam', 'visitorTeam', 'events']
    );

    return (Array.isArray(fixtures) ? fixtures : []).map((f: SMFixture) => ({
      id: `sm_${f.id}`,
      homeTeam: f.localTeam?.data?.name || 'Local',
      awayTeam: f.visitorTeam?.data?.name || 'Visitante',
      homeTeamId: String(f.localteam_id),
      awayTeamId: String(f.visitorteam_id),
      homeScore: f.scores?.localteam_score || 0,
      awayScore: f.scores?.visitorteam_score || 0,
      minute: f.time?.minute || 0,
      status: mapSMStatus(f.time?.status || 'NS'),
      events: (f.events?.data || []).map((e: SMEvent) => ({
        id: `evt_${e.id}`,
        type: mapSMEventType(e.type),
        minute: e.minute + (e.extra_minute || 0),
        player: e.player?.data?.common_name || e.player?.data?.name || 'Desconocido',
        team: String(e.team_id),
        detail: e.result,
      })),
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
    }));
  },

  async testConnection(config: DataSourceConfig): Promise<{ success: boolean; message: string }> {
    try {
      const data = await sportmonksFetch(config, '/leagues');
      const count = Array.isArray(data) ? data.length : 0;
      return {
        success: true,
        message: `Conectado a SportMonks. ${count} ligas disponibles.`,
      };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  },
};
