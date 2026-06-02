'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ==================== FOOTER CONTENT TYPE DEFINITIONS ====================

export interface TickerItem {
  id: string;
  text: string;
}

export interface TournamentStat {
  id: string;
  value: string;
  label: string;
  icon: string; // lucide icon name
}

export interface FooterSection {
  id: string;
  label: string;
  tab: string; // tab to navigate to
}

export interface InfoItem {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface SponsorItem {
  id: string;
  name: string;
}

export interface FooterContent {
  // Brand Section
  brandNamePart1: string;
  brandNamePart2: string;
  brandTagline: string;
  brandEmoji: string;

  // Ticker
  tickerItems: TickerItem[];

  // Tournament Stats
  tournamentStats: TournamentStat[];

  // Column 1 - Secciones
  sectionsTitle: string;
  sections: FooterSection[];

  // Column 2 - Info (Mundial 2026)
  infoTitle: string;
  infoItems: InfoItem[];

  // Column 3 - Contacto
  contactTitle: string;
  email: string;
  emailLabel: string;
  socialHandle: string;
  socialHandleLabel: string;
  socialLinks: SocialLink[];

  // Column 4 - En Vivo
  liveTitle: string;
  liveActiveTitle: string;       // "X partidos en vivo"
  liveActiveDescription: string;
  liveActiveButton: string;
  liveActiveButtonTab: string;
  liveInactiveTitle: string;
  liveInactiveDescription: string;
  liveInactiveButton: string;
  liveInactiveButtonTab: string;

  // Add to Home
  addHomeEmoji: string;
  addHomeTitle: string;
  addHomeDescription: string;

  // Sponsors
  sponsorsTitle: string;
  sponsors: SponsorItem[];

  // Bottom Bar
  copyright: string;
  statusText: string;
  madeWithText: string;
}

// ==================== DEFAULT FOOTER CONTENT ====================

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandNamePart1: 'Nexo Digital',
  brandNamePart2: 'Mundial',
  brandTagline: 'Tu pasión en tiempo real',
  brandEmoji: '⚽',

  tickerItems: [
    { id: 't1', text: '⚽ MUNDIAL 2026 — Estados Unidos, México y Canadá' },
    { id: 't2', text: '🏟️ 16 estadios en 3 países' },
    { id: 't3', text: '🏆 48 selecciones por primera vez en la historia' },
    { id: 't4', text: '📊 Sigue todos los resultados en tiempo real' },
    { id: 't5', text: '🌐 Nexo Digital Mundial — Tu portal del fútbol' },
    { id: 't6', text: '⭐ Vota por la figura del partido' },
    { id: 't7', text: '📱 Resultados actualizados sin recargar la página' },
  ],

  tournamentStats: [
    { id: 'ts1', value: '48', label: 'Selecciones', icon: 'Flag' },
    { id: 'ts2', value: '12', label: 'Grupos', icon: 'Shield' },
    { id: 'ts3', value: '104', label: 'Partidos', icon: 'Trophy' },
    { id: 'ts4', value: '3', label: 'Sedes', icon: 'MapPin' },
  ],

  sectionsTitle: 'Secciones',
  sections: [
    { id: 'grupos', label: 'Grupos', tab: 'grupos' },
    { id: 'resultados', label: 'Resultados', tab: 'resultados' },
    { id: 'goleadores', label: 'Goleadores', tab: 'goleadores' },
    { id: 'expulsados', label: 'Expulsados', tab: 'expulsados' },
    { id: 'sintesis', label: 'Síntesis', tab: 'sintesis' },
    { id: 'votacion', label: 'Votación', tab: 'votacion' },
  ],

  infoTitle: 'Mundial 2026',
  infoItems: [
    { id: 'i1', title: '3 Países Sede', description: 'Estados Unidos, México y Canadá', icon: 'MapPin' },
    { id: 'i2', title: '11 junio — 19 julio 2026', description: '39 días de fútbol mundial', icon: 'Calendar' },
    { id: 'i3', title: 'Formato Expandido', description: '12 grupos de 4 equipos, octavos nuevos', icon: 'Users' },
    { id: 'i4', title: 'En Vivo', description: 'Resultados y goles actualizados al instante', icon: 'Radio' },
  ],

  contactTitle: 'Contacto',
  email: 'info@nexodigitalmundial.com',
  emailLabel: 'Email',
  socialHandle: '@nexodigitalmundial',
  socialHandleLabel: 'Red Social',
  socialLinks: [
    { id: 's1', platform: 'twitter', label: '𝕏', url: '#' },
    { id: 's2', platform: 'instagram', label: 'IG', url: '#' },
    { id: 's3', platform: 'youtube', label: 'YT', url: '#' },
    { id: 's4', platform: 'tiktok', label: 'TT', url: '#' },
    { id: 's5', platform: 'facebook', label: 'FB', url: '#' },
  ],

  liveTitle: 'En Vivo Ahora',
  liveActiveTitle: 'partidos en vivo',
  liveActiveDescription: 'Goles, minutos y estadísticas actualizándose en tiempo real',
  liveActiveButton: 'Ver Resultados',
  liveActiveButtonTab: 'resultados',
  liveInactiveTitle: 'No hay partidos en vivo',
  liveInactiveDescription: 'Vuelve pronto para seguir la acción en tiempo real',
  liveInactiveButton: 'Votar Figura',
  liveInactiveButtonTab: 'votacion',

  addHomeEmoji: '📱',
  addHomeTitle: 'Lleva el Mundial en tu bolsillo',
  addHomeDescription: 'Agrega este portal a tu pantalla de inicio',

  sponsorsTitle: 'Patrocinadores Oficiales FIFA',
  sponsors: [
    { id: 'sp1', name: 'Adidas' },
    { id: 'sp2', name: 'Coca-Cola' },
    { id: 'sp3', name: 'Visa' },
    { id: 'sp4', name: 'Hyundai' },
    { id: 'sp5', name: 'Qatar Airways' },
    { id: 'sp6', name: "McDonald's" },
    { id: 'sp7', name: 'Wanda' },
    { id: 'sp8', name: 'Hisense' },
  ],

  copyright: '© 2026 Nexo Digital Mundial. Todos los derechos reservados. Datos ilustrativos con fines de demostración.',
  statusText: 'Sistema activo',
  madeWithText: 'Hecho con ⚽ y pasión',
};

// ==================== CONTEXT ====================

interface FooterContentContextType {
  content: FooterContent;
  updateContent: (updates: Partial<FooterContent>) => void;
  updateTickerItem: (id: string, text: string) => void;
  addTickerItem: () => void;
  removeTickerItem: (id: string) => void;
  updateTournamentStat: (id: string, updates: Partial<TournamentStat>) => void;
  addTournamentStat: () => void;
  removeTournamentStat: (id: string) => void;
  updateSection: (id: string, updates: Partial<FooterSection>) => void;
  addSection: () => void;
  removeSection: (id: string) => void;
  updateInfoItem: (id: string, updates: Partial<InfoItem>) => void;
  addInfoItem: () => void;
  removeInfoItem: (id: string) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  addSocialLink: () => void;
  removeSocialLink: (id: string) => void;
  updateSponsor: (id: string, updates: Partial<SponsorItem>) => void;
  addSponsor: () => void;
  removeSponsor: (id: string) => void;
  resetToDefault: () => void;
  exportContent: () => string;
  importContent: (json: string) => boolean;
}

const FooterContentContext = createContext<FooterContentContextType | null>(null);

const STORAGE_KEY = 'nexo-digital-footer-content';

export function useFooterContent() {
  const ctx = useContext(FooterContentContext);
  if (!ctx) {
    throw new Error('useFooterContent must be used within a FooterContentProvider');
  }
  return ctx;
}

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function FooterContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<FooterContent>(DEFAULT_FOOTER_CONTENT);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FooterContent;
        // Basic validation
        if (parsed && parsed.brandNamePart1 && parsed.sections && parsed.sponsors) {
          setContent(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage on content change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // Ignore storage errors
    }
  }, [content]);

  const updateContent = useCallback((updates: Partial<FooterContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTickerItem = useCallback((id: string, text: string) => {
    setContent(prev => ({
      ...prev,
      tickerItems: prev.tickerItems.map(item => item.id === id ? { ...item, text } : item),
    }));
  }, []);

  const addTickerItem = useCallback(() => {
    setContent(prev => ({
      ...prev,
      tickerItems: [...prev.tickerItems, { id: generateId(), text: 'Nuevo mensaje del ticker' }],
    }));
  }, []);

  const removeTickerItem = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      tickerItems: prev.tickerItems.filter(item => item.id !== id),
    }));
  }, []);

  const updateTournamentStat = useCallback((id: string, updates: Partial<TournamentStat>) => {
    setContent(prev => ({
      ...prev,
      tournamentStats: prev.tournamentStats.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const addTournamentStat = useCallback(() => {
    setContent(prev => ({
      ...prev,
      tournamentStats: [...prev.tournamentStats, { id: generateId(), value: '0', label: 'Nuevo', icon: 'Star' }],
    }));
  }, []);

  const removeTournamentStat = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      tournamentStats: prev.tournamentStats.filter(item => item.id !== id),
    }));
  }, []);

  const updateSection = useCallback((id: string, updates: Partial<FooterSection>) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const addSection = useCallback(() => {
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, { id: generateId(), label: 'Nueva Sección', tab: 'inicio' }],
    }));
  }, []);

  const removeSection = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(item => item.id !== id),
    }));
  }, []);

  const updateInfoItem = useCallback((id: string, updates: Partial<InfoItem>) => {
    setContent(prev => ({
      ...prev,
      infoItems: prev.infoItems.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const addInfoItem = useCallback(() => {
    setContent(prev => ({
      ...prev,
      infoItems: [...prev.infoItems, { id: generateId(), title: 'Nuevo Info', description: 'Descripción', icon: 'Star' }],
    }));
  }, []);

  const removeInfoItem = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      infoItems: prev.infoItems.filter(item => item.id !== id),
    }));
  }, []);

  const updateSocialLink = useCallback((id: string, updates: Partial<SocialLink>) => {
    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const addSocialLink = useCallback(() => {
    setContent(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { id: generateId(), platform: 'nuevo', label: 'NW', url: '#' }],
    }));
  }, []);

  const removeSocialLink = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(item => item.id !== id),
    }));
  }, []);

  const updateSponsor = useCallback((id: string, updates: Partial<SponsorItem>) => {
    setContent(prev => ({
      ...prev,
      sponsors: prev.sponsors.map(item => item.id === id ? { ...item, ...updates } : item),
    }));
  }, []);

  const addSponsor = useCallback(() => {
    setContent(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, { id: generateId(), name: 'Nuevo Patrocinador' }],
    }));
  }, []);

  const removeSponsor = useCallback((id: string) => {
    setContent(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter(item => item.id !== id),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setContent(DEFAULT_FOOTER_CONTENT);
  }, []);

  const exportContent = useCallback(() => {
    return JSON.stringify(content, null, 2);
  }, [content]);

  const importContent = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed && parsed.brandNamePart1 && parsed.sections && parsed.sponsors) {
        setContent(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <FooterContentContext.Provider
      value={{
        content,
        updateContent,
        updateTickerItem, addTickerItem, removeTickerItem,
        updateTournamentStat, addTournamentStat, removeTournamentStat,
        updateSection, addSection, removeSection,
        updateInfoItem, addInfoItem, removeInfoItem,
        updateSocialLink, addSocialLink, removeSocialLink,
        updateSponsor, addSponsor, removeSponsor,
        resetToDefault, exportContent, importContent,
      }}
    >
      {children}
    </FooterContentContext.Provider>
  );
}
