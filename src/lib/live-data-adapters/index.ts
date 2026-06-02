// ==================== LIVE DATA ADAPTERS - INDEX ====================
// Exporta todos los adaptadores disponibles

export { apiFootballAdapter, POPULAR_LEAGUES as API_FOOTBALL_LEAGUES } from './api-football';
export { footballDataAdapter } from './football-data';
export { sportmonksAdapter } from './sportmonks';
export { liveScoreAdapter, LIVESCORE_POPULAR_LEAGUES } from './livescore';

import type { DataSourceConfig } from '../live-data-config';
import { apiFootballAdapter } from './api-football';
import { footballDataAdapter } from './football-data';
import { sportmonksAdapter } from './sportmonks';
import { liveScoreAdapter } from './livescore';

export interface LiveDataAdapter {
  name: string;
  getLiveMatches(config: DataSourceConfig): Promise<any[]>;
  testConnection(config: DataSourceConfig): Promise<{ success: boolean; message: string }>;
}

export function getAdapter(provider: string): LiveDataAdapter | null {
  switch (provider) {
    case 'api-football':
      return apiFootballAdapter;
    case 'football-data':
      return footballDataAdapter;
    case 'sportmonks':
      return sportmonksAdapter;
    case 'livescore':
      return liveScoreAdapter;
    default:
      return null;
  }
}
