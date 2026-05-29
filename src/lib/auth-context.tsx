'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'comercial';
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isEditor: boolean;
  isComercial: boolean;
  isAuthenticated: boolean;
}

const DEFAULT_USERS: (AuthUser & { password: string })[] = [
  { id: 'u1', email: 'admin@nexodigitalmundial.com', name: 'Administrador', role: 'admin', avatar: undefined, password: 'admin123' },
  { id: 'u2', email: 'editor@nexodigitalmundial.com', name: 'Editor Deportivo', role: 'editor', avatar: undefined, password: 'editor123' },
  { id: 'u3', email: 'comercial@nexodigitalmundial.com', name: 'Comercial', role: 'comercial', avatar: undefined, password: 'comercial123' },
];

const AUTH_STORAGE_KEY = 'ndm-auth-user';

function loadUserFromStorage(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AuthUser;
    }
  } catch {
    // ignore
  }
  return null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);

  // Save to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const found = DEFAULT_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Credenciales inválidas. Verifique email y contraseña.' };
    }
    const { password: _, ...userData } = found;
    void _;
    setUser(userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor' || user?.role === 'admin';
  const isComercial = user?.role === 'comercial' || user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEditor, isComercial, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
