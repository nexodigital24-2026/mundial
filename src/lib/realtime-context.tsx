'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { matches as initialMatches, Match, teams, getTeamById } from './mock-data';

// ==================== TYPES ====================
interface GoalEvent {
  id: string;
  matchId: string;
  player: string;
  team: string;
  minute: number;
  timestamp: number;
}

interface RealtimeState {
  liveMatches: Match[];
  allMatches: Match[];
  goalEvents: GoalEvent[];
  connected: boolean;
  lastUpdate: number | null;
}

interface RealtimeContextType extends RealtimeState {
  refreshMatches: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error('useRealtime must be used within RealtimeProvider');
  return ctx;
}

// ==================== SIMULATED WEBSOCKET ENGINE ====================
// This simulates a WebSocket connection to Firebase/Supabase Realtime.
// In production, replace the simulate* functions with actual WebSocket listeners.

const POSSIBLE_SCORERS: Record<string, string[]> = {
  mex: ['S. Giménez', 'H. Lozano', 'O. Pineda', 'L. Romo'],
  cze: ['A. Hložek', 'P. Šulc', 'V. Černý', 'M. Souček'],
  bra: ['Vinicius Jr.', 'R. Rodrygo', 'E. Paquetá', 'G. Martinelli'],
  sco: ['S. McTominay', 'J. McGinn', 'L. Shankland', 'A. Robertson'],
  esp: ['L. Yamal', 'D. Olmo', 'P. Pedri', 'M. Oyarzabal'],
  uru: ['D. Núñez', 'F. Valverde', 'G. Vina', 'M. Araújo'],
  arg: ['L. Messi', 'J. Álvarez', 'E. Fernández', 'A. Mac Allister'],
  aut: ['M. Arnautović', 'K. Laimer', 'M. Sabitzer', 'C. Baumgartner'],
  fra: ['K. Mbappé', 'A. Griezmann', 'O. Dembélé', 'M. Thuram'],
  nor: ['E. Haaland', 'M. Ødegaard', 'A. Sørloth', 'J. Hansen'],
};

function getRandomScorer(teamId: string): string {
  const scorers = POSSIBLE_SCORERS[teamId] || ['Jugador'];
  return scorers[Math.floor(Math.random() * scorers.length)];
}

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RealtimeState>({
    liveMatches: initialMatches.filter(m => m.status === 'live'),
    allMatches: [...initialMatches],
    goalEvents: [],
    connected: false,
    lastUpdate: null,
  });

  const matchesRef = useRef<Match[]>([...initialMatches]);
  const goalEventsRef = useRef<GoalEvent[]>([]);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const connectedRef = useRef(false);

  // Simulate connection establishment
  useEffect(() => {
    const connectTimer = setTimeout(() => {
      connectedRef.current = true;
      setState(prev => ({ ...prev, connected: true, lastUpdate: Date.now() }));
    }, 1500);

    return () => clearTimeout(connectTimer);
  }, []);

  // Main simulation loop - updates match minutes and occasionally adds goals
  useEffect(() => {
    // Minute tick - every 8 seconds (simulates 1 minute of match time)
    const minuteInterval = setInterval(() => {
      if (!connectedRef.current) return;

      matchesRef.current = matchesRef.current.map(match => {
        if (match.status !== 'live') return match;

        const currentMinute = (match.minute || 0) + 1;

        // If match reaches 90+, it ends
        if (currentMinute >= 91) {
          return {
            ...match,
            minute: 90,
            status: 'completed' as const,
          };
        }

        // Add injury time at 45 and 90
        const displayMinute = currentMinute;

        return {
          ...match,
          minute: displayMinute,
        };
      });

      setState(prev => ({
        ...prev,
        liveMatches: matchesRef.current.filter(m => m.status === 'live'),
        allMatches: [...matchesRef.current],
        lastUpdate: Date.now(),
      }));
    }, 8000);

    // Goal simulation - random chance every 15 seconds
    const goalInterval = setInterval(() => {
      if (!connectedRef.current) return;

      const liveMatches = matchesRef.current.filter(m => m.status === 'live');
      if (liveMatches.length === 0) return;

      // ~20% chance of a goal event each check
      if (Math.random() > 0.20) return;

      // Pick a random live match
      const match = liveMatches[Math.floor(Math.random() * liveMatches.length)];
      const currentMinute = match.minute || 0;

      // Decide which team scores (weighted by possession)
      const homePoss = match.possession?.home || 50;
      const isHome = Math.random() * 100 < homePoss;
      const scoringTeamId = isHome ? match.homeTeamId : match.awayTeamId;
      const scorerName = getRandomScorer(scoringTeamId);

      const goalEvent: GoalEvent = {
        id: generateId(),
        matchId: match.id,
        player: scorerName,
        team: scoringTeamId,
        minute: currentMinute,
        timestamp: Date.now(),
      };

      goalEventsRef.current = [goalEvent, ...goalEventsRef.current].slice(0, 20);

      // Update the match
      matchesRef.current = matchesRef.current.map(m => {
        if (m.id !== match.id) return m;

        const newHomeScore = isHome ? (m.homeScore || 0) + 1 : m.homeScore;
        const newAwayScore = !isHome ? (m.awayScore || 0) + 1 : m.awayScore;
        const newScorers = [
          ...(m.scorers || []),
          { player: scorerName, team: scoringTeamId, minute: currentMinute },
        ];

        // Slightly adjust possession after goal
        const possAdjust = isHome ? 1 : -1;

        return {
          ...m,
          homeScore: newHomeScore,
          awayScore: newAwayScore,
          scorers: newScorers,
          possession: m.possession ? {
            home: Math.min(75, Math.max(25, m.possession.home + possAdjust)),
            away: Math.min(75, Math.max(25, m.possession.away - possAdjust)),
          } : m.possession,
          shots: m.shots ? {
            home: isHome ? m.shots.home + 1 : m.shots.home,
            away: !isHome ? m.shots.away + 1 : m.shots.away,
          } : m.shots,
        };
      });

      setState(prev => ({
        ...prev,
        liveMatches: matchesRef.current.filter(m => m.status === 'live'),
        allMatches: [...matchesRef.current],
        goalEvents: [...goalEventsRef.current],
        lastUpdate: Date.now(),
      }));
    }, 15000);

    // Stats micro-update - every 12 seconds, slightly adjust live match stats
    const statsInterval = setInterval(() => {
      if (!connectedRef.current) return;

      matchesRef.current = matchesRef.current.map(match => {
        if (match.status !== 'live') return match;

        return {
          ...match,
          possession: match.possession ? {
            home: Math.min(70, Math.max(30, match.possession.home + (Math.random() > 0.5 ? 1 : -1))),
            away: Math.min(70, Math.max(30, match.possession.away + (Math.random() > 0.5 ? 1 : -1))),
          } : match.possession,
          shots: match.shots ? {
            home: match.shots.home + (Math.random() > 0.7 ? 1 : 0),
            away: match.shots.away + (Math.random() > 0.7 ? 1 : 0),
          } : match.shots,
          fouls: match.fouls ? {
            home: match.fouls.home + (Math.random() > 0.85 ? 1 : 0),
            away: match.fouls.away + (Math.random() > 0.85 ? 1 : 0),
          } : match.fouls,
          corners: match.corners ? {
            home: match.corners.home + (Math.random() > 0.9 ? 1 : 0),
            away: match.corners.away + (Math.random() > 0.9 ? 1 : 0),
          } : match.corners,
        };
      });

      setState(prev => ({
        ...prev,
        liveMatches: matchesRef.current.filter(m => m.status === 'live'),
        allMatches: [...matchesRef.current],
        lastUpdate: Date.now(),
      }));
    }, 12000);

    timersRef.current = [minuteInterval, goalInterval, statsInterval];

    return () => {
      timersRef.current.forEach(clearInterval);
    };
  }, []);

  const refreshMatches = useCallback(() => {
    setState(prev => ({
      ...prev,
      liveMatches: matchesRef.current.filter(m => m.status === 'live'),
      allMatches: [...matchesRef.current],
      goalEvents: [...goalEventsRef.current],
      lastUpdate: Date.now(),
    }));
  }, []);

  return (
    <RealtimeContext.Provider value={{ ...state, refreshMatches }}>
      {children}
    </RealtimeContext.Provider>
  );
}
