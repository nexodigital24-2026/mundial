'use client';

import { useState } from 'react';
import { Menu, X, Shield, PenTool, Briefcase, LogIn, LogOut, Lock } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';

const publicTabs = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'goleadores', label: 'Goleadores' },
  { id: 'expulsados', label: 'Expulsados' },
  { id: 'sintesis', label: 'Síntesis' },
  { id: 'votacion', label: 'Votación' },
];

const adminTabs = [
  { id: 'admin', label: 'Admin', icon: Shield, role: 'admin' as const },
  { id: 'editor', label: 'Editor', icon: PenTool, role: 'editor' as const },
  { id: 'comercial', label: 'Comercial', icon: Briefcase, role: 'comercial' as const },
];

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin, isEditor, isComercial, isAuthenticated } = useAuth();

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const hasAccess = (role: 'admin' | 'editor' | 'comercial') => {
    if (role === 'admin') return isAdmin;
    if (role === 'editor') return isEditor;
    if (role === 'comercial') return isComercial;
    return false;
  };

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-red-500/30 text-white hover:bg-red-500/30';
    if (isEditor) return 'bg-blue-500/30 text-white hover:bg-blue-500/30';
    if (isComercial) return 'bg-green-500/30 text-white hover:bg-green-500/30';
    return '';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin';
    if (isEditor) return 'Editor';
    if (isComercial) return 'Comercial';
    return '';
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar with logo */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('inicio')}>
            <Image src="/logo.png" alt="Nuevo Día Mundial" width={36} height={36} className="rounded-full" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Nuevo Día Mundial
              </h1>
              <p className="text-xs text-white/70 hidden sm:block">Portal del Mundial 2026</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {publicTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-white/20 mx-1" />

            {adminTabs.map((tab) => {
              const accessible = hasAccess(tab.role);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-inner'
                      : accessible
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-white/40 cursor-not-allowed'
                  }`}
                  title={accessible ? tab.label : `Requiere rol ${tab.role}`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{tab.label}</span>
                  {!accessible && <Lock className="w-3 h-3" />}
                </button>
              );
            })}

            {/* Login/User */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => handleTabClick('login')}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px] bg-white/20 text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-white font-medium hidden xl:inline">{user.name}</span>
                  <Badge className={`text-[9px] py-0 ${getRoleBadgeColor()}`}>
                    {getRoleLabel()}
                  </Badge>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8"
                  onClick={logout}
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 ml-2"
                onClick={() => handleTabClick('login')}
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Ingresar</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-primary-dark border-t border-white/10 animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            {publicTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="w-full h-px bg-white/20 my-2" />

            {adminTabs.map((tab) => {
              const accessible = hasAccess(tab.role);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : accessible
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-white/40 cursor-not-allowed'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {!accessible && <Lock className="w-3 h-3 ml-auto" />}
                </button>
              );
            })}

            <div className="w-full h-px bg-white/20 my-2" />

            {isAuthenticated && user ? (
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-white/20 text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <Badge className={`text-[9px] py-0 ${getRoleBadgeColor()}`}>
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 flex-1"
                    onClick={() => handleTabClick('login')}
                  >
                    Mi Cuenta
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-300 hover:text-red-200 hover:bg-white/10"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Salir
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('login')}
                className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
