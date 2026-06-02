// ==================== API ROUTE: SYNC DATA ====================
// POST /api/live/sync - Sincroniza datos del proveedor con el sistema local

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/lib/live-data-adapters';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, apiKey, baseUrl, options, tournamentId } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Provider y API Key son requeridos' },
        { status: 400 }
      );
    }

    const adapter = getAdapter(provider);
    if (!adapter) {
      return NextResponse.json(
        { error: `Proveedor "${provider}" no soportado` },
        { status: 400 }
      );
    }

    const config = {
      provider,
      apiKey,
      baseUrl: baseUrl || getProviderBaseUrl(provider),
      pollInterval: 30,
      enabled: true,
      options: options || {},
    };

    // Obtener todos los partidos del torneo
    let matches;
    if (provider === 'api-football' && tournamentId) {
      const { apiFootballAdapter } = await import('@/lib/live-data-adapters/api-football');
      matches = await apiFootballAdapter.getWorldCupMatches(config, parseInt(tournamentId));
    } else if (provider === 'football-data' && tournamentId) {
      const { footballDataAdapter } = await import('@/lib/live-data-adapters/football-data');
      matches = await footballDataAdapter.getWorldCupMatches(config, tournamentId);
    } else if (provider === 'sportmonks' && tournamentId) {
      const { sportmonksAdapter } = await import('@/lib/live-data-adapters/sportmonks');
      matches = await sportmonksAdapter.getWorldCupMatches(config, parseInt(tournamentId));
    } else {
      matches = await adapter.getLiveMatches(config);
    }

    // Calcular estadísticas
    const liveMatches = matches.filter((m: any) => m.status === 'in_play' || m.status === 'half_time');
    const completedMatches = matches.filter((m: any) => m.status === 'finished');
    const upcomingMatches = matches.filter((m: any) => m.status === 'not_started');

    const totalGoals = matches.reduce((acc: number, m: any) => acc + m.homeScore + m.awayScore, 0);
    const allEvents = matches.flatMap((m: any) => m.events || []);
    const goalEvents = allEvents.filter((e: any) => e.type === 'goal' || e.type === 'penalty' || e.type === 'own_goal');
    const redCards = allEvents.filter((e: any) => e.type === 'red_card');

    return NextResponse.json({
      success: true,
      source: provider,
      timestamp: Date.now(),
      summary: {
        totalMatches: matches.length,
        live: liveMatches.length,
        completed: completedMatches.length,
        upcoming: upcomingMatches.length,
        totalGoals,
        totalEvents: allEvents.length,
        goalEvents: goalEvents.length,
        redCards: redCards.length,
      },
      matches,
    });
  } catch (error: any) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al sincronizar datos' },
      { status: 500 }
    );
  }
}

function getProviderBaseUrl(provider: string): string {
  const urls: Record<string, string> = {
    'api-football': 'https://v3.football.api-sports.io',
    'football-data': 'https://api.football-data.org/v4',
    'sportmonks': 'https://api.sportmonks.com/v3/football',
  };
  return urls[provider] || '';
}
