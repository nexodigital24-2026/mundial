'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ==================== FOOTER DATA TYPES ====================

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  id: string;
  platform: string;
  url: string;
  icon: string; // lucide icon name
}

export interface FooterData {
  // Brand section
  brandName: string;
  brandAccent: string;
  brandTagline: string;
  brandDescription: string;
  showRadioBadge: boolean;
  radioBadgeText: string;

  // Sections (editable columns)
  sections: FooterSection[];

  // Social media links
  socials: FooterSocial[];

  // Contact info
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;

  // Sponsors row
  showSponsors: boolean;
  sponsorsText: string;

  // Copyright
  copyrightText: string;
  copyrightYear: string;

  // Visibility
  showFooter: boolean;
}

// ==================== DEFAULT FOOTER DATA ====================

export const DEFAULT_FOOTER_DATA: FooterData = {
  brandName: 'Nexo Digital',
  brandAccent: 'Mundial',
  brandTagline: 'NEXO DIGITAL',
  brandDescription: 'El portal deportivo más completo del Mundial 2026. Resultados en vivo, estadísticas y toda la información del torneo con 48 selecciones y 12 grupos.',
  showRadioBadge: true,
  radioBadgeText: 'NEXO DIGITAL',

  sections: [
    {
      id: 'sec1',
      title: 'Secciones',
      links: [
        { id: 'l1', label: 'Grupos y Posiciones', url: '#grupos', target: '_self' },
        { id: 'l2', label: 'Resultados', url: '#resultados', target: '_self' },
        { id: 'l3', label: 'Goleadores', url: '#goleadores', target: '_self' },
        { id: 'l4', label: 'Expulsados', url: '#expulsados', target: '_self' },
        { id: 'l5', label: 'Síntesis', url: '#sintesis', target: '_self' },
        { id: 'l6', label: 'Votación Figura', url: '#votacion', target: '_self' },
      ],
    },
    {
      id: 'sec2',
      title: 'Recursos',
      links: [
        { id: 'l7', label: 'Calendario', url: '#resultados', target: '_self' },
        { id: 'l8', label: 'Estadísticas', url: '#goleadores', target: '_self' },
        { id: 'l9', label: 'En Vivo', url: '#inicio', target: '_self' },
        { id: 'l10', label: 'Noticias', url: '#inicio', target: '_self' },
      ],
    },
    {
      id: 'sec3',
      title: 'Legal',
      links: [
        { id: 'l11', label: 'Términos de Uso', url: '#', target: '_self' },
        { id: 'l12', label: 'Política de Privacidad', url: '#', target: '_self' },
        { id: 'l13', label: 'Contacto', url: '#', target: '_self' },
      ],
    },
  ],

  socials: [
    { id: 's1', platform: 'Instagram', url: 'https://instagram.com/nexodigitalmundial', icon: 'Instagram' },
    { id: 's2', platform: 'Twitter / X', url: 'https://x.com/nexodigitalmundial', icon: 'Twitter' },
    { id: 's3', platform: 'Facebook', url: 'https://facebook.com/nexodigitalmundial', icon: 'Facebook' },
    { id: 's4', platform: 'YouTube', url: 'https://youtube.com/@nexodigitalmundial', icon: 'Youtube' },
    { id: 's5', platform: 'TikTok', url: 'https://tiktok.com/@nexodigitalmundial', icon: 'Music' },
  ],

  contactEmail: 'info@nexodigitalmundial.com',
  contactPhone: '',
  contactAddress: '',

  showSponsors: true,
  sponsorsText: 'Patrocinadores oficiales: Adidas, Coca-Cola, Visa, Hyundai, Qatar Airways, McDonald\'s, Wanda, Hisense',

  copyrightText: 'Todos los derechos reservados',
  copyrightYear: '2026',

  showFooter: true,
};

// ==================== FOOTER CONTEXT ====================

interface FooterContextType {
  footerData: FooterData;
  setFooterData: (data: FooterData) => void;
  updateFooterField: <K extends keyof FooterData>(key: K, value: FooterData[K]) => void;
  updateSection: (sectionId: string, updater: (section: FooterSection) => FooterSection) => void;
  addSection: (section: FooterSection) => void;
  removeSection: (sectionId: string) => void;
  addLink: (sectionId: string, link: FooterLink) => void;
  removeLink: (sectionId: string, linkId: string) => void;
  updateLink: (sectionId: string, linkId: string, updater: (link: FooterLink) => FooterLink) => void;
  addSocial: (social: FooterSocial) => void;
  removeSocial: (socialId: string) => void;
  updateSocial: (socialId: string, updater: (social: FooterSocial) => FooterSocial) => void;
  resetToDefault: () => void;
  exportFooter: () => string;
  importFooter: (json: string) => boolean;
}

const FooterContext = createContext<FooterContextType | null>(null);

const STORAGE_KEY = 'nexo-digital-footer-data';

export function useFooterData() {
  const ctx = useContext(FooterContext);
  if (!ctx) {
    throw new Error('useFooterData must be used within a FooterDataProvider');
  }
  return ctx;
}

export function FooterDataProvider({ children }: { children: React.ReactNode }) {
  const [footerData, setFooterDataState] = useState<FooterData>(DEFAULT_FOOTER_DATA);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FooterData;
        // Basic validation
        if (parsed.brandName && parsed.sections && Array.isArray(parsed.sections)) {
          setFooterDataState(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(footerData));
    } catch {
      // Ignore storage errors
    }
  }, [footerData]);

  const setFooterData = useCallback((data: FooterData) => {
    setFooterDataState(data);
  }, []);

  const updateFooterField = useCallback(<K extends keyof FooterData>(key: K, value: FooterData[K]) => {
    setFooterDataState(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSection = useCallback((sectionId: string, updater: (section: FooterSection) => FooterSection) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? updater(s) : s),
    }));
  }, []);

  const addSection = useCallback((section: FooterSection) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: [...prev.sections, section],
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
  }, []);

  const addLink = useCallback((sectionId: string, link: FooterLink) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, links: [...s.links, link] } : s
      ),
    }));
  }, []);

  const removeLink = useCallback((sectionId: string, linkId: string) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, links: s.links.filter(l => l.id !== linkId) } : s
      ),
    }));
  }, []);

  const updateLink = useCallback((sectionId: string, linkId: string, updater: (link: FooterLink) => FooterLink) => {
    setFooterDataState(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, links: s.links.map(l => l.id === linkId ? updater(l) : l) }
          : s
      ),
    }));
  }, []);

  const addSocial = useCallback((social: FooterSocial) => {
    setFooterDataState(prev => ({
      ...prev,
      socials: [...prev.socials, social],
    }));
  }, []);

  const removeSocial = useCallback((socialId: string) => {
    setFooterDataState(prev => ({
      ...prev,
      socials: prev.socials.filter(s => s.id !== socialId),
    }));
  }, []);

  const updateSocial = useCallback((socialId: string, updater: (social: FooterSocial) => FooterSocial) => {
    setFooterDataState(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === socialId ? updater(s) : s),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setFooterDataState(DEFAULT_FOOTER_DATA);
  }, []);

  const exportFooter = useCallback(() => {
    return JSON.stringify(footerData, null, 2);
  }, [footerData]);

  const importFooter = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as FooterData;
      if (parsed.brandName && parsed.sections && Array.isArray(parsed.sections)) {
        setFooterDataState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <FooterContext.Provider
      value={{
        footerData,
        setFooterData,
        updateFooterField,
        updateSection,
        addSection,
        removeSection,
        addLink,
        removeLink,
        updateLink,
        addSocial,
        removeSocial,
        updateSocial,
        resetToDefault,
        exportFooter,
        importFooter,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}
