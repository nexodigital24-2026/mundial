// ==================== API ROUTE: EXPLORE ====================
// GET /api/live/explore - Explora partidos y ligas disponibles
// Usa las API Keys del .env automáticamente para facilitar testing

import { NextResponse } from 'next/server';
import { liveScoreAdapter, LIVESCORE_POPULAR_LEAGUES } from '@/lib/live-data-adapters/livescore';
import { apiFootballAdapter, POPULAR_LEAGUES as API_FOOTBALL_LEAGUES } from '@/lib/live-data-adapters/api-football';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status'; // status, live, today, league
  const leagueId = searchParams.get('league') || '';
  const provider = searchParams.get('provider') || 'livescore'; // Default: livescore

  // Construir config según proveedor
  const livescoreKey = process.env.LIVESCORE_API_KEY || '';
  const livescoreSecret = process.env.LIVESCORE_API_SECRET || '';
  const apiSportsKey = process.env.API_SPORTS_KEY || '';

  const liveScoreConfig = {
    provider: 'livescore' as const,
    apiKey: livescoreKey,
    baseUrl: 'https://livescore-api.com/api-client',
    pollInterval: 30,
    enabled: true,
    options: { apiSecret: livescoreSecret },
  };

  const apiFootballConfig = {
    provider: 'api-football' as const,
    apiKey: apiSportsKey,
    baseUrl: 'https://v3.football.api-sports.io',
    pollInterval: 30,
    enabled: true,
    options: {} as Record<string, string>,
  };

  const config = provider === 'livescore' ? liveScoreConfig : apiFootballConfig;
  const adapter = provider === 'livescore' ? liveScoreAdapter : apiFootballAdapter;
  const popularLeagues = provider === 'livescore' ? LIVESCORE_POPULAR_LEAGUES : API_FOOTBALL_LEAGUES;

  if (!config.apiKey) {
    return NextResponse.json({
      error: `No hay API Key configurada para ${provider}. Agregá las credenciales al archivo .env`,
      popularLeagues,
      provider,
    }, { status: 400 });
  }

  try {
    switch (action) {
      case 'status': {
        const result = await adapter.testConnection(config);
        return NextResponse.json({
          ...result,
          popularLeagues,
          provider,
          keyConfigured: true,
          keyPrefix: config.apiKey.substring(0, 4) + '...',
        });
      }

      case 'live': {
        const matches = await adapter.getLiveMatches(config);
        return NextResponse.json({
          action: 'live',
          provider,
          matches,
          count: matches.length,
          timestamp: Date.now(),
        });
      }

      case 'today': {
        const today = new Date().toISOString().split('T')[0];
        let matches: any[];
        if ('getMatchesByDate' in adapter) {
          matches = await (adapter as any).getMatchesByDate(config, today);
        } else {
          matches = await adapter.getLiveMatches(config);
        }
        return NextResponse.json({
          action: 'today',
          provider,
          date: today,
          matches,
          count: matches.length,
          timestamp: Date.now(),
        });
      }

      case 'league': {
        if (!leagueId) {
          return NextResponse.json({
            error: 'Especificá una liga con ?league=ID',
            popularLeagues,
            provider,
          }, { status: 400 });
        }
        const season = searchParams.get('season') || new Date().getFullYear().toString();
        let matches: any[];
        if (provider === 'livescore' && 'getLeagueMatches' in adapter) {
          matches = await (adapter as any).getLeagueMatches(config, leagueId);
        } else if ('getLeagueMatches' in adapter) {
          matches = await (adapter as any).getLeagueMatches(config, parseInt(leagueId), season);
        } else {
          matches = await adapter.getLiveMatches(config);
        }
        return NextResponse.json({
          action: 'league',
          provider,
          leagueId,
          season,
          matches,
          count: matches.length,
          timestamp: Date.now(),
        });
      }

      default:
        return NextResponse.json({
          error: `Acción "${action}" no válida. Usá: status, live, today, league`,
          popularLeagues,
          provider,
        }, { status: 400 });
    }
  } catch (error: any) {
    const msg = error.message || '';
    const isSuspended = msg.includes('suspended') || msg.includes('access') || msg.includes('do not have access');

    return NextResponse.json({
      error: isSuspended
        ? provider === 'livescore'
          ? 'Tu cuenta de LiveScore no tiene acceso a datos activado. Visitá https://livescore-api.com/dashboard para activar tu plan.'
          : 'Tu cuenta de API-Sports está SUSPENDIDA. Visitá https://dashboard.api-football.com para reactivarla.'
        : msg,
      errorType: isSuspended ? 'account_suspended' : 'api_error',
      helpUrl: provider === 'livescore' ? 'https://livescore-api.com/dashboard' : 'https://dashboard.api-football.com',
      popularLeagues,
      provider,
    }, { status: isSuspended ? 403 : 500 });
  }
}
