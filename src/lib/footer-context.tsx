'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

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
  serverSynced: boolean;
  lastServerSync: number | null;
  syncNow: () => Promise<void>;
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
  const [serverSynced, setServerSynced] = useState(false);
  const [lastServerSync, setLastServerSync] = useState<number | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(false);

  // Load from localStorage first (instant), then from server (authoritative)
  useEffect(() => {
    // 1. Load from localStorage for instant display
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FooterData;
        if (parsed.brandName && parsed.sections && Array.isArray(parsed.sections)) {
          setFooterDataState(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }

    // 2. Load from server (source of truth)
    const loadFromServer = async () => {
      try {
        const res = await fetch('/api/footer');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const serverData = json.data as FooterData;
            if (serverData.brandName && serverData.sections && Array.isArray(serverData.sections)) {
              setFooterDataState(serverData);
              // Update localStorage with server data
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
              } catch { /* ignore */ }
              setServerSynced(true);
              setLastServerSync(json.timestamp || Date.now());
            }
          }
        }
      } catch {
        // Network error — keep using localStorage data
        console.log('Footer: No se pudo conectar al servidor, usando datos locales');
      }
      initialLoadRef.current = true;
    };

    loadFromServer();

    // 3. Poll server every 30 seconds for updates (for other devices' changes)
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/footer');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const serverData = json.data as FooterData;
            if (serverData.brandName && serverData.sections) {
              setFooterDataState(serverData);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
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

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(footerData));
    } catch {
      // Ignore storage errors
    }
  }, [footerData]);

  // Save to server with debounce (only when admin makes changes)
  const saveToServer = useCallback(async (data: FooterData) => {
    // Get auth info from localStorage
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

    // Only save to server if user is admin
    if (authRole !== 'admin') return;

    try {
      const res = await fetch('/api/footer', {
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
      console.log('Footer: No se pudo guardar en el servidor');
    }
  }, []);

  // Debounced server save — saves 1 second after last change
  const debouncedSave = useCallback((data: FooterData) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      saveToServer(data);
    }, 1000);
  }, [saveToServer]);

  const setFooterData = useCallback((data: FooterData) => {
    setFooterDataState(data);
    debouncedSave(data);
  }, [debouncedSave]);

  const updateFooterField = useCallback(<K extends keyof FooterData>(key: K, value: FooterData[K]) => {
    setFooterDataState(prev => {
      const updated = { ...prev, [key]: value };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateSection = useCallback((sectionId: string, updater: (section: FooterSection) => FooterSection) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: prev.sections.map(s => s.id === sectionId ? updater(s) : s),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addSection = useCallback((section: FooterSection) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: [...prev.sections, section],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeSection = useCallback((sectionId: string) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addLink = useCallback((sectionId: string, link: FooterLink) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: prev.sections.map(s =>
          s.id === sectionId ? { ...s, links: [...s.links, link] } : s
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeLink = useCallback((sectionId: string, linkId: string) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: prev.sections.map(s =>
          s.id === sectionId ? { ...s, links: s.links.filter(l => l.id !== linkId) } : s
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateLink = useCallback((sectionId: string, linkId: string, updater: (link: FooterLink) => FooterLink) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        sections: prev.sections.map(s =>
          s.id === sectionId
            ? { ...s, links: s.links.map(l => l.id === linkId ? updater(l) : l) }
            : s
        ),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const addSocial = useCallback((social: FooterSocial) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        socials: [...prev.socials, social],
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const removeSocial = useCallback((socialId: string) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        socials: prev.socials.filter(s => s.id !== socialId),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const updateSocial = useCallback((socialId: string, updater: (social: FooterSocial) => FooterSocial) => {
    setFooterDataState(prev => {
      const updated = {
        ...prev,
        socials: prev.socials.map(s => s.id === socialId ? updater(s) : s),
      };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const resetToDefault = useCallback(() => {
    setFooterDataState(DEFAULT_FOOTER_DATA);
    debouncedSave(DEFAULT_FOOTER_DATA);
  }, [debouncedSave]);

  const exportFooter = useCallback(() => {
    return JSON.stringify(footerData, null, 2);
  }, [footerData]);

  const importFooter = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as FooterData;
      if (parsed.brandName && parsed.sections && Array.isArray(parsed.sections)) {
        setFooterDataState(parsed);
        debouncedSave(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [debouncedSave]);

  const syncNow = useCallback(async () => {
    try {
      const res = await fetch('/api/footer');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const serverData = json.data as FooterData;
          if (serverData.brandName && serverData.sections) {
            setFooterDataState(serverData);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
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
        serverSynced,
        lastServerSync,
        syncNow,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}
