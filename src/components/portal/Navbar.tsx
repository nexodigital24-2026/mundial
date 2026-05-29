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
    if (isAdmin) return 'bg-nd-orange/40 text-nd-black hover:bg-nd-orange/40';
    if (isEditor) return 'bg-white/30 text-white hover:bg-white/30';
    if (isComercial) return 'bg-nd-orange/40 text-nd-black hover:bg-nd-orange/40';
    return '';
  };

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin';
    if (isEditor) return 'Editor';
    if (isComercial) return 'Comercial';
    return '';
  };

  return (
    <nav className="sticky top-0 z-50 shadow-lg">
      {/* Green top strip with FM frequency */}
      <div className="bg-nd-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider opacity-90">📻 100.9 FM</span>
          </div>
          <span className="text-[10px] font-medium tracking-widest uppercase opacity-70 hidden sm:block">Radio Nuevo Día — El Diario</span>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTabClick('login')}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-[8px] bg-white/20 text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-medium">{user.name}</span>
                  <Badge className={`text-[8px] py-0 ${getRoleBadgeColor()}`}>
                    {getRoleLabel()}
                  </Badge>
                </button>
                <button
                  onClick={logout}
                  className="text-white/70 hover:text-white transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('login')}
                className="flex items-center gap-1 text-[11px] font-medium hover:opacity-80 transition-opacity"
              >
                <LogIn className="w-3 h-3" />
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main nav bar - gradient from green to darker green */}
      <div className="bg-gradient-to-r from-nd-green via-nd-green-dark to-nd-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabClick('inicio')}>
              <Image src="/logo-nuevo-dia.png" alt="Radio Nuevo Día" width={40} height={40} className="object-contain" />
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Nuevo Día <span className="text-nd-orange">Mundial</span>
                </h1>
                <p className="text-[10px] text-white/60 hidden sm:block font-medium tracking-wide">PORTAL DEL MUNDIAL 2026</p>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {publicTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-nd-orange text-nd-black shadow-md'
                      : 'text-white/90 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Separator */}
              <div className="w-px h-5 bg-white/20 mx-1" />

              {adminTabs.map((tab) => {
                const accessible = hasAccess(tab.role);
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                      activeTab === tab.id
                        ? 'bg-nd-orange text-nd-black shadow-md'
                        : accessible
                        ? 'text-white/80 hover:bg-white/15 hover:text-white'
                        : 'text-white/35 cursor-not-allowed'
                    }`}
                    title={accessible ? tab.label : `Requiere rol ${tab.role}`}
                  >
                    <tab.icon className="w-3 h-3" />
                    <span className="hidden xl:inline">{tab.label}</span>
                    {!accessible && <Lock className="w-2.5 h-2.5" />}
                  </button>
                );
              })}
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
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-nd-green-dark border-t border-white/10 animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            {publicTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-nd-orange text-nd-black'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
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
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-nd-orange text-nd-black'
                      : accessible
                      ? 'text-white/80 hover:bg-white/10 hover:text-white'
                      : 'text-white/35 cursor-not-allowed'
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
                    <AvatarFallback className="text-xs bg-nd-orange text-nd-black font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <Badge className={`text-[9px] py-0 ${getRoleBadgeColor()}`}>
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-nd-orange text-nd-black hover:bg-nd-orange-dark font-semibold"
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
                className="w-full text-left px-4 py-2.5 rounded-md text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white flex items-center gap-2"
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
