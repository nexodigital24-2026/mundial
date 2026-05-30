'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'nexo-digital-theme-colors';

function generateDerivedColors(base: string): { dark: string; light: string } {
  // Simple color derivation: darken for dark, lighten for light
  const hex = base.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Dark: reduce by ~30%
  const darkR = Math.max(0, Math.round(r * 0.7));
  const darkG = Math.max(0, Math.round(g * 0.7));
  const darkB = Math.max(0, Math.round(b * 0.7));
  const dark = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;

  // Light: mix with white at 90%
  const lightR = Math.round(r + (255 - r) * 0.9);
  const lightG = Math.round(g + (255 - g) * 0.9);
  const lightB = Math.round(b + (255 - b) * 0.9);
  const light = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;

  return { dark, light };
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ThemeColors;
        // Validate it has the expected keys
        const keys: (keyof ThemeColors)[] = [
          'ndGreen', 'ndGreenDark', 'ndGreenLight',
          'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
          'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
        ];
        const isValid = keys.every(k => typeof parsed[k] === 'string' && parsed[k].startsWith('#'));
        if (isValid) {
          setColorsState(parsed);
          // Check if matches a preset
          const matchIdx = THEME_PRESETS.findIndex(p =>
            keys.every(k => p.colors[k].toLowerCase() === parsed[k].toLowerCase())
          );
          if (matchIdx >= 0) {
            setActivePresetId(THEME_PRESETS[matchIdx].id);
            setIsCustom(false);
          } else {
            setActivePresetId(null);
            setIsCustom(true);
          }
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Apply CSS variables whenever colors change
  useEffect(() => {
    const root = document.documentElement;

    // Brand color variables
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

    // Semantic color variables derived from brand
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

  const setColors = useCallback((newColors: ThemeColors) => {
    setColorsState(newColors);
    // Check if matches a preset
    const keys: (keyof ThemeColors)[] = [
      'ndGreen', 'ndGreenDark', 'ndGreenLight',
      'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
      'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
    ];
    const matchIdx = THEME_PRESETS.findIndex(p =>
      keys.every(k => p.colors[k].toLowerCase() === newColors[k].toLowerCase())
    );
    if (matchIdx >= 0) {
      setActivePresetId(THEME_PRESETS[matchIdx].id);
      setIsCustom(false);
    } else {
      setActivePresetId(null);
      setIsCustom(true);
    }
  }, []);

  const updateColor = useCallback((key: keyof ThemeColors, value: string) => {
    setColorsState(prev => {
      const updated = { ...prev, [key]: value };

      // Auto-derive dark/light variants for primary colors
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

      // Auto-derive orange accent (lighter orange)
      if (key === 'ndOrange' || key === 'ndOrangeDark') {
        const hex = updated.ndOrange.replace('#', '');
        const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + 40);
        const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + 40);
        const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + 30);
        updated.ndOrangeAccent = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }

      // Check if matches a preset
      const allKeys: (keyof ThemeColors)[] = [
        'ndGreen', 'ndGreenDark', 'ndGreenLight',
        'ndOrange', 'ndOrangeDark', 'ndOrangeLight', 'ndOrangeAccent',
        'ndBlack', 'ndYellow', 'ndYellowDark', 'ndYellowLight',
      ];
      const matchIdx = THEME_PRESETS.findIndex(p =>
        allKeys.every(k => p.colors[k].toLowerCase() === updated[k].toLowerCase())
      );
      if (matchIdx >= 0) {
        setActivePresetId(THEME_PRESETS[matchIdx].id);
        setIsCustom(false);
      } else {
        setActivePresetId(null);
        setIsCustom(true);
      }

      return updated;
    });
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setColorsState(preset.colors);
      setActivePresetId(presetId);
      setIsCustom(false);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setColorsState(DEFAULT_COLORS);
    setActivePresetId('default-green');
    setIsCustom(false);
  }, []);

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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
