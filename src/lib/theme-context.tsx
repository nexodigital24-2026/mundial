'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ==================== THEME TYPE DEFINITIONS ====================

export interface ThemeColors {
  ndGreen: string;
  ndGreenDark: string;
  ndGreenLight: string;
  ndOrange: string;
  ndOrangeDark: string;
  ndOrangeLight: string;
  ndOrangeAccent: string;
  ndBlack: string;
  ndYellow: string;
  ndYellowDark: string;
  ndYellowLight: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const DEFAULT_COLORS: ThemeColors = {
  ndGreen: '#026602',
  ndGreenDark: '#014C01',
  ndGreenLight: '#E8F5E9',
  ndOrange: '#FF6800',
  ndOrangeDark: '#CC5300',
  ndOrangeLight: '#FFF3E0',
  ndOrangeAccent: '#FF931E',
  ndBlack: '#1a1a1a',
  ndYellow: '#FFD700',
  ndYellowDark: '#CC5300',
  ndYellowLight: '#FFF8E1',
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default-green',
    name: 'Nexo Digital Original',
    description: 'Esquema clásico verde y naranja del portal Nexo Digital Mundial',
    colors: { ...DEFAULT_COLORS },
  },
  {
    id: 'sky-blue',
    name: 'Cielo Deportivo',
    description: 'Azul cielo con acentos dorados — fresco y profesional',
    colors: {
      ndGreen: '#0099FF',
      ndGreenDark: '#0077CC',
      ndGreenLight: '#E6F7FF',
      ndOrange: '#FFD700',
      ndOrangeDark: '#CC9900',
      ndOrangeLight: '#FFFDE7',
      ndOrangeAccent: '#FFE44D',
      ndBlack: '#231F20',
      ndYellow: '#FFD700',
      ndYellowDark: '#CC9900',
      ndYellowLight: '#FFF8E1',
    },
  },
  {
    id: 'midnight',
    name: 'Medianoche',
    description: 'Azul oscuro profundo con acentos rojo intenso — elegante y dramático',
    colors: {
      ndGreen: '#1A237E',
      ndGreenDark: '#0D1254',
      ndGreenLight: '#E8EAF6',
      ndOrange: '#D32F2F',
      ndOrangeDark: '#A42525',
      ndOrangeLight: '#FFEBEE',
      ndOrangeAccent: '#EF5350',
      ndBlack: '#0A0A1A',
      ndYellow: '#FFC107',
      ndYellowDark: '#FF8F00',
      ndYellowLight: '#FFF8E1',
    },
  },
  {
    id: 'tropical',
    name: 'Tropical',
    description: 'Verde esmeralda vibrante con amarillo tropical — energía y pasión',
    colors: {
      ndGreen: '#00897B',
      ndGreenDark: '#00695C',
      ndGreenLight: '#E0F2F1',
      ndOrange: '#FFB300',
      ndOrangeDark: '#FF8F00',
      ndOrangeLight: '#FFF8E1',
      ndOrangeAccent: '#FFCA28',
      ndBlack: '#1B1B1B',
      ndYellow: '#FFD740',
      ndYellowDark: '#FF8F00',
      ndYellowLight: '#FFF9C4',
    },
  },
  {
    id: 'crimson',
    name: 'Carmesí Real',
    description: 'Rojo carmesí con dorado — realeza y tradición deportiva',
    colors: {
      ndGreen: '#B71C1C',
      ndGreenDark: '#7F0000',
      ndGreenLight: '#FFEBEE',
      ndOrange: '#FFD700',
      ndOrangeDark: '#F9A825',
      ndOrangeLight: '#FFFDE7',
      ndOrangeAccent: '#FFE082',
      ndBlack: '#1A0A0A',
      ndYellow: '#FFD700',
      ndYellowDark: '#F9A825',
      ndYellowLight: '#FFF8E1',
    },
  },
  {
    id: 'ocean',
    name: 'Océano Profundo',
    description: 'Azul océano con coral — calma y determinación',
    colors: {
      ndGreen: '#0277BD',
      ndGreenDark: '#01579B',
      ndGreenLight: '#E1F5FE',
      ndOrange: '#FF7043',
      ndOrangeDark: '#E64A19',
      ndOrangeLight: '#FBE9E7',
      ndOrangeAccent: '#FF8A65',
      ndBlack: '#0D1B2A',
      ndYellow: '#FFD54F',
      ndYellowDark: '#FFB300',
      ndYellowLight: '#FFF9C4',
    },
  },
  {
    id: 'forest',
    name: 'Bosque Nativo',
    description: 'Verde bosque con terracota — naturaleza y autenticidad',
    colors: {
      ndGreen: '#2E7D32',
      ndGreenDark: '#1B5E20',
      ndGreenLight: '#E8F5E9',
      ndOrange: '#BF360C',
      ndOrangeDark: '#8D2B0B',
      ndOrangeLight: '#FBE9E7',
      ndOrangeAccent: '#E65100',
      ndBlack: '#1A1A1A',
      ndYellow: '#F9A825',
      ndYellowDark: '#F57F17',
      ndYellowLight: '#FFF9C4',
    },
  },
];

// ==================== THEME CONTEXT ====================

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  applyPreset: (presetId: string) => void;
  resetToDefault: () => void;
  activePresetId: string | null;
  exportTheme: () => string;
  importTheme: (json: string) => boolean;
  isCustom: boolean;
  serverSynced: boolean;
  lastServerSync: number | null;
  syncNow: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'nexo-digital-theme-colors';

function generateDerivedColors(base: string): { dark: string; light: string } {
  const hex = base.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const darkR = Math.max(0, Math.round(r * 0.7));
  const darkG = Math.max(0, Math.round(g * 0.7));
  const darkB = Math.max(0, Math.round(b * 0.7));
  const dark = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;

  const lightR = Math.round(r + (255 - r) * 0.9);
  const lightG = Math.round(g + (255 - g) * 0.9);
  const lightB = Math.round(b + (255 - b) * 0.9);
  const light = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;

  return { dark, light };
}

function checkPresetMatch(colors: ThemeColors): { presetId: string | null; isCustom: boolean } {
  const keys: (keyof ThemeColors)[] = [
    'ndGreen', 'ndGreenDark', 'ndGreenLight',
    'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
    'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
  ];
  const matchIdx = THEME_PRESETS.findIndex(p =>
    keys.every(k => p.colors[k].toLowerCase() === colors[k].toLowerCase())
  );
  if (matchIdx >= 0) {
    return { presetId: THEME_PRESETS[matchIdx].id, isCustom: false };
  }
  return { presetId: null, isCustom: true };
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>(DEFAULT_COLORS);
  const [activePresetId, setActivePresetId] = useState<string | null>('default-green');
  const [isCustom, setIsCustom] = useState(false);
  const [serverSynced, setServerSynced] = useState(false);
  const [lastServerSync, setLastServerSync] = useState<number | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage first (instant), then from server (authoritative)
  useEffect(() => {
    // 1. Load from localStorage for instant display
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ThemeColors;
        const keys: (keyof ThemeColors)[] = [
          'ndGreen', 'ndGreenDark', 'ndGreenLight',
          'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
          'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
        ];
        const isValid = keys.every(k => typeof parsed[k] === 'string' && parsed[k].startsWith('#'));
        if (isValid) {
          setColorsState(parsed);
          const match = checkPresetMatch(parsed);
          setActivePresetId(match.presetId);
          setIsCustom(match.isCustom);
        }
      }
    } catch {
      // Ignore parse errors
    }

    // 2. Load from server (source of truth)
    const loadFromServer = async () => {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const serverColors = json.data as ThemeColors;
            const keys: (keyof ThemeColors)[] = [
              'ndGreen', 'ndGreenDark', 'ndGreenLight',
              'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
              'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
            ];
            const isValid = keys.every(k => typeof serverColors[k] === 'string' && serverColors[k].startsWith('#'));
            if (isValid) {
              setColorsState(serverColors);
              const match = checkPresetMatch(serverColors);
              setActivePresetId(match.presetId);
              setIsCustom(match.isCustom);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverColors));
              } catch { /* ignore */ }
              setServerSynced(true);
              setLastServerSync(json.timestamp || Date.now());
            }
          }
        }
      } catch {
        console.log('Theme: No se pudo conectar al servidor, usando datos locales');
      }
    };

    loadFromServer();

    // 3. Poll server every 30 seconds for updates
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const serverColors = json.data as ThemeColors;
            const keys: (keyof ThemeColors)[] = [
              'ndGreen', 'ndGreenDark', 'ndGreenLight',
              'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
              'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
            ];
            const isValid = keys.every(k => typeof serverColors[k] === 'string' && serverColors[k].startsWith('#'));
            if (isValid) {
              setColorsState(serverColors);
              const match = checkPresetMatch(serverColors);
              setActivePresetId(match.presetId);
              setIsCustom(match.isCustom);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverColors));
              } catch { /* ignore */ }
              setServerSynced(true);
              setLastServerSync(json.timestamp || Date.now());
            }
          }
        }
      } catch {
        // Ignore polling errors
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Apply CSS variables whenever colors change
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--nd-green', colors.ndGreen);
    root.style.setProperty('--nd-green-dark', colors.ndGreenDark);
    root.style.setProperty('--nd-green-light', colors.ndGreenLight);
    root.style.setProperty('--nd-orange', colors.ndOrange);
    root.style.setProperty('--nd-orange-dark', colors.ndOrangeDark);
    root.style.setProperty('--nd-orange-light', colors.ndOrangeLight);
    root.style.setProperty('--nd-orange-accent', colors.ndOrangeAccent);
    root.style.setProperty('--nd-black', colors.ndBlack);
    root.style.setProperty('--nd-yellow', colors.ndYellow);
    root.style.setProperty('--nd-yellow-dark', colors.ndYellowDark);
    root.style.setProperty('--nd-yellow-light', colors.ndYellowLight);

    root.style.setProperty('--primary', colors.ndGreen);
    root.style.setProperty('--primary-foreground', '#ffffff');
    root.style.setProperty('--accent', colors.ndOrange);
    root.style.setProperty('--ring', colors.ndGreen);
    root.style.setProperty('--chart-1', colors.ndGreen);
    root.style.setProperty('--chart-2', colors.ndOrange);
    root.style.setProperty('--chart-3', colors.ndOrangeAccent);
    root.style.setProperty('--chart-4', colors.ndGreenDark);
    root.style.setProperty('--sidebar-primary', colors.ndGreen);
    root.style.setProperty('--sidebar-ring', colors.ndGreen);
    root.style.setProperty('--foreground', colors.ndBlack);

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch {
      // Ignore storage errors
    }
  }, [colors]);

  // Save to server with debounce
  const saveToServer = useCallback(async (data: ThemeColors) => {
    let authEmail = '';
    let authRole = '';
    try {
      const authStored = localStorage.getItem('ndm-auth-user');
      if (authStored) {
        const authParsed = JSON.parse(authStored);
        authEmail = authParsed.email || '';
        authRole = authParsed.role || '';
      }
    } catch { /* ignore */ }

    if (authRole !== 'admin') return;

    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, authEmail, authRole }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setServerSynced(true);
          setLastServerSync(json.timestamp || Date.now());
        }
      }
    } catch {
      console.log('Theme: No se pudo guardar en el servidor');
    }
  }, []);

  const debouncedSave = useCallback((data: ThemeColors) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveToServer(data);
    }, 1000);
  }, [saveToServer]);

  const setColors = useCallback((newColors: ThemeColors) => {
    setColorsState(newColors);
    const match = checkPresetMatch(newColors);
    setActivePresetId(match.presetId);
    setIsCustom(match.isCustom);
    debouncedSave(newColors);
  }, [debouncedSave]);

  const updateColor = useCallback((key: keyof ThemeColors, value: string) => {
    setColorsState(prev => {
      const updated = { ...prev, [key]: value };

      if (key === 'ndGreen') {
        const derived = generateDerivedColors(value);
        updated.ndGreenDark = derived.dark;
        updated.ndGreenLight = derived.light;
      }
      if (key === 'ndOrange') {
        const derived = generateDerivedColors(value);
        updated.ndOrangeDark = derived.dark;
        updated.ndOrangeLight = derived.light;
      }
      if (key === 'ndYellow') {
        const derived = generateDerivedColors(value);
        updated.ndYellowDark = derived.dark;
        updated.ndYellowLight = derived.light;
      }

      if (key === 'ndOrange' || key === 'ndOrangeDark') {
        const hex = updated.ndOrange.replace('#', '');
        const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 40);
        const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 40);
        const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 30);
        updated.ndOrangeAccent = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }

      const match = checkPresetMatch(updated);
      setActivePresetId(match.presetId);
      setIsCustom(match.isCustom);

      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const applyPreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setColorsState(preset.colors);
      setActivePresetId(presetId);
      setIsCustom(false);
      debouncedSave(preset.colors);
    }
  }, [debouncedSave]);

  const resetToDefault = useCallback(() => {
    setColorsState(DEFAULT_COLORS);
    setActivePresetId('default-green');
    setIsCustom(false);
    debouncedSave(DEFAULT_COLORS);
  }, [debouncedSave]);

  const exportTheme = useCallback(() => {
    return JSON.stringify(colors, null, 2);
  }, [colors]);

  const importTheme = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as ThemeColors;
      const keys: (keyof ThemeColors)[] = [
        'ndGreen', 'ndGreenDark', 'ndGreenLight',
        'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
        'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
      ];
      const isValid = keys.every(k => typeof parsed[k] === 'string' && parsed[k].startsWith('#'));
      if (!isValid) return false;
      setColors(parsed);
      return true;
    } catch {
      return false;
    }
  }, [setColors]);

  const syncNow = useCallback(async () => {
    try {
      const res = await fetch('/api/theme');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const serverColors = json.data as ThemeColors;
          const keys: (keyof ThemeColors)[] = [
            'ndGreen', 'ndGreenDark', 'ndGreenLight',
            'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
            'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
          ];
          const isValid = keys.every(k => typeof serverColors[k] === 'string' && serverColors[k].startsWith('#'));
          if (isValid) {
            setColorsState(serverColors);
            const match = checkPresetMatch(serverColors);
            setActivePresetId(match.presetId);
            setIsCustom(match.isCustom);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverColors));
            } catch { /* ignore */ }
            setServerSynced(true);
            setLastServerSync(json.timestamp || Date.now());
          }
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        setColors,
        updateColor,
        applyPreset,
        resetToDefault,
        activePresetId,
        exportTheme,
        importTheme,
        isCustom,
        serverSynced,
        lastServerSync,
        syncNow,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
