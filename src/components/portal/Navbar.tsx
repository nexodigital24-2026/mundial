'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const navTabs = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'goleadores', label: 'Goleadores' },
  { id: 'expulsados', label: 'Expulsados' },
  { id: 'sintesis', label: 'Síntesis' },
  { id: 'votacion', label: 'Votación' },
];

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
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
            {navTabs.map((tab) => (
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
            {navTabs.map((tab) => (
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
          </div>
        </div>
      )}
    </nav>
  );
}
