// ==================== API ROUTE: LIVE MATCHES ====================
// GET /api/live/matches - Obtiene partidos del proveedor configurado
// Soporta: partidos en vivo, por fecha, por liga, y del Mundial 2026

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/lib/live-data-adapters';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || '';
    let apiKey = searchParams.get('apiKey') || '';
    const baseUrl = searchParams.get('baseUrl') || '';
    const pollInterval = parseInt(searchParams.get('pollInterval') || '30');
    const mode = searchParams.get('mode') || 'live'; // live, date, league, worldcup
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const leagueId = searchParams.get('league') || '';
    const season = searchParams.get('season') || new Date().getFullYear().toString();
    const apiSecret = searchParams.get('apiSecret') || '';

    // Si no hay proveedor o es mock, devolver modo simulación
    if (!provider || provider === 'mock') {
      return NextResponse.json({
        source: 'mock',
        matches: [],
        message: 'Modo simulación activo. Configurá un proveedor para datos reales.',
      });
    }

    // Fallback a env variables según el proveedor
    if (!apiKey && provider === 'api-football') {
      apiKey = process.env.API_SPORTS_KEY || '';
    }
    if (provider === 'livescore') {
      if (!apiKey) apiKey = process.env.LIVESCORE_API_KEY || '';
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key requerida. Ingresala en el panel de admin o configurá las variables de entorno.' },
        { status: 400 }
      );
    }

    const adapter = getAdapter(provider);
    if (!adapter) {
      return NextResponse.json(
        { error: `Proveedor "${provider}" no soportado. Usá: api-football, football-data, sportmonks, livescore` },
        { status: 400 }
      );
    }

    // Construir config con opciones (apiSecret para LiveScore)
    const options: Record<string, string> = {};
    if (provider === 'livescore') {
      options.apiSecret = apiSecret || process.env.LIVESCORE_API_SECRET || '';
    }

    const config = {
      provider: provider as any,
      apiKey,
      baseUrl: baseUrl || getProviderBaseUrl(provider),
      pollInterval,
      enabled: true,
      options,
    };

    let matches: any[] = [];

    switch (mode) {
      case 'live':
        matches = await adapter.getLiveMatches(config);
        break;

      case 'date':
        if (provider === 'api-football' && 'getMatchesByDate' in adapter) {
          matches = await (adapter as any).getMatchesByDate(config, date);
        } else if (provider === 'livescore' && 'getMatchesByDate' in adapter) {
          matches = await (adapter as any).getMatchesByDate(config, date);
        } else {
          matches = await adapter.getLiveMatches(config);
        }
        break;

      case 'league':
        if (provider === 'api-football' && 'getLeagueMatches' in adapter) {
          matches = await (adapter as any).getLeagueMatches(config, parseInt(leagueId), season);
        } else if (provider === 'livescore' && 'getLeagueMatches' in adapter) {
          matches = await (adapter as any).getLeagueMatches(config, leagueId, date.replace(/-/g, ''));
        } else {
          matches = await adapter.getLiveMatches(config);
        }
        break;

      case 'worldcup':
        if (provider === 'api-football' && 'getWorldCupMatches' in adapter) {
          matches = await (adapter as any).getWorldCupMatches(config, 1);
        } else if (provider === 'livescore' && 'getLeagueMatches' in adapter) {
          matches = await (adapter as any).getLeagueMatches(config, '3');
        } else {
          matches = await adapter.getLiveMatches(config);
        }
        break;

      default:
        matches = await adapter.getLiveMatches(config);
    }

    return NextResponse.json({
      source: provider,
      mode,
      matches,
      timestamp: Date.now(),
      count: matches.length,
      date: mode === 'date' ? date : undefined,
    });
  } catch (error: any) {
    console.error('Error fetching live matches:', error);

    // Detectar error de cuenta suspendida
    if (error.message?.includes('suspended') || error.message?.includes('access')) {
      return NextResponse.json({
        error: error.message.includes('suspended')
          ? 'Tu cuenta de API-Sports está suspendida.'
          : 'Tu cuenta de LiveScore no tiene acceso a datos activado.',
        errorType: 'account_suspended',
        helpUrl: error.message.includes('suspended')
          ? 'https://dashboard.api-football.com'
          : 'https://livescore-api.com/dashboard',
        matches: [],
      }, { status: 403 });
    }

    return NextResponse.json(
      { error: error.message || 'Error al obtener partidos', matches: [] },
      { status: 500 }
    );
  }
}

function getProviderBaseUrl(provider: string): string {
  const urls: Record<string, string> = {
    'api-football': 'https://v3.football.api-sports.io',
    'football-data': 'https://api.football-data.org/v4',
    'sportmonks': 'https://api.sportmonks.com/v3/football',
    'livescore': 'https://livescore-api.com/api-client',
  };
  return urls[provider] || '';
}
