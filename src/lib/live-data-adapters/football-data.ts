// ==================== FOOTBALL-DATA.ORG ADAPTER ====================
// Adaptador para Football-Data.org API
// Docs: https://www.football-data.org/documentation/api

import type { DataSourceConfig, LiveMatchData, LiveMatchEvent, LiveMatchStatistics } from '../live-data-config';

interface FDMatch {
  id: number;
  competition: { id: number; name: string };
  season: { id: number; startDate: string; endDate: string };
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  homeTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; tla: string; crest: string };
  score: {
    winner: string | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

interface FDEvent {
  id: number;
  type: string;
  minute: number;
  team: { id: number; name: string };
  player: { id: number; name: string };
}

// ==================== FETCH FUNCTIONS ====================

async function footballDataFetch(config: DataSourceConfig, endpoint: string): Promise<any> {
  const url = `${config.baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Auth-Token': config.apiKey,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Football-Data error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ==================== MAPPING FUNCTIONS ====================

function mapFDStatus(status: string): LiveMatchData['status'] {
  const statusMap: Record<string, LiveMatchData['status']> = {
    'SCHEDULED': 'not_started',
    'TIMED': 'not_started',
    'IN_PLAY': 'in_play',
    'PAUSED': 'half_time',
    'HALFTIME': 'half_time',
    'FINISHED': 'finished',
    'POSTPONED': 'postponed',
    'CANCELLED': 'cancelled',
    'SUSPENDED': 'postponed',
    'AWARDED': 'finished',
  };
  return statusMap[status] || 'not_started';
}

function mapFDEventType(type: string): LiveMatchEvent['type'] {
  if (type === 'Goal') return 'goal';
  if (type === 'YellowCard') return 'yellow_card';
  if (type === 'RedCard') return 'red_card';
  if (type === 'Substitution') return 'substitution';
  return 'goal';
}

// ==================== EXPORTED ADAPTER ====================

export const footballDataAdapter = {
  name: 'Football-Data.org',

  async getWorldCupMatches(config: DataSourceConfig, competitionId: string | number): Promise<LiveMatchData[]> {
    const data = await footballDataFetch(config, `/competitions/${competitionId}/matches?season=2026`);
    const matches: FDMatch[] = data.matches || [];

    return matches.map((m) => ({
      id: `fd_${m.id}`,
      homeTeam: m.homeTeam.shortName || m.homeTeam.name,
      awayTeam: m.awayTeam.shortName || m.awayTeam.name,
      homeTeamId: String(m.homeTeam.id),
      awayTeamId: String(m.awayTeam.id),
      homeScore: m.score.fullTime?.home || 0,
      awayScore: m.score.fullTime?.away || 0,
      minute: mapFDStatus(m.status) === 'in_play' ? 45 : 0, // FD no provee minuto exacto
      status: mapFDStatus(m.status),
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
    }));
  },

  async getMatchEvents(config: DataSourceConfig, matchId: number): Promise<LiveMatchEvent[]> {
    try {
      const data = await footballDataFetch(config, `/matches/${matchId}`);
      const events: FDEvent[] = data.head2head?.events || [];
      return events.map((e) => ({
        id: `evt_${e.id}`,
        type: mapFDEventType(e.type),
        minute: e.minute,
        player: e.player?.name || 'Desconocido',
        team: e.team.name,
      }));
    } catch {
      return [];
    }
  },

  async getLiveMatches(config: DataSourceConfig): Promise<LiveMatchData[]> {
    // Football-Data no tiene endpoint directo de "live", filtramos de todos
    const data = await footballDataFetch(config, '/matches?status=IN_PLAY');
    const matches: FDMatch[] = data.matches || [];

    return matches.map((m) => ({
      id: `fd_${m.id}`,
      homeTeam: m.homeTeam.shortName || m.homeTeam.name,
      awayTeam: m.awayTeam.shortName || m.awayTeam.name,
      homeTeamId: String(m.homeTeam.id),
      awayTeamId: String(m.awayTeam.id),
      homeScore: m.score.fullTime?.home || 0,
      awayScore: m.score.fullTime?.away || 0,
      minute: 45,
      status: 'in_play' as const,
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
    }));
  },

  async testConnection(config: DataSourceConfig): Promise<{ success: boolean; message: string }> {
    try {
      const data = await footballDataFetch(config, '/competitions?plan=TIER_ONE');
      const count = data.competitions?.length || 0;
      return {
        success: true,
        message: `Conectado a Football-Data.org. ${count} competiciones disponibles.`,
      };
    } catch (error: any) {
      return { success: false, message: `Error: ${error.message}` };
    }
  },
};
