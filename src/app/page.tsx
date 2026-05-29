'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { RealtimeProvider, useRealtime } from '@/lib/realtime-context';
import Navbar from '@/components/portal/Navbar';
import Footer from '@/components/portal/Footer';
import HomeTab from '@/components/portal/HomeTab';
import GroupsTab from '@/components/portal/GroupsTab';
import ResultsTab from '@/components/portal/ResultsTab';
import ScorersTab from '@/components/portal/ScorersTab';
import RedCardsTab from '@/components/portal/RedCardsTab';
import SynthesisTab from '@/components/portal/SynthesisTab';
import VotingTab from '@/components/portal/VotingTab';
import AdminTab from '@/components/portal/AdminTab';
import EditorTab from '@/components/portal/EditorTab';
import ComercialTab from '@/components/portal/ComercialTab';
import LoginTab from '@/components/portal/LoginTab';
import BannerDisplay from '@/components/portal/BannerDisplay';
import { Wifi, WifiOff } from 'lucide-react';

const tabComponents: Record<string, React.ComponentType<{ onNavigate?: (tab: string) => void }>> = {
  inicio: HomeTab,
  grupos: GroupsTab,
  resultados: ResultsTab,
  goleadores: ScorersTab,
  expulsados: RedCardsTab,
  sintesis: SynthesisTab,
  votacion: VotingTab,
  admin: AdminTab,
  editor: EditorTab,
  comercial: ComercialTab,
  login: LoginTab,
};

function ConnectionIndicator({ connected }: { connected: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (connected) {
      const timer = setTimeout(() => setShowTooltip(false), 4000);
      setShowTooltip(true);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(true);
    }
  }, [connected]);

  if (!showTooltip) return null;

  return (
    <div className={`fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs font-semibold transition-all duration-500 ${
      connected
        ? 'bg-nd-green text-white'
        : 'bg-red-500 text-white animate-pulse'
    }`}>
      {connected ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>En vivo</span>
          <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse-live" />
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5" />
          <span>Conectando...</span>
        </>
      )}
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('inicio');
  const { connected, goalEvents } = useRealtime();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ActiveComponent = tabComponents[activeTab] ?? HomeTab;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Banner below navbar */}
      <BannerDisplay position="navbar-below" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <ActiveComponent onNavigate={handleTabChange} />
      </main>

      <Footer />

      {/* Real-time connection indicator */}
      <ConnectionIndicator connected={connected} />

      {/* Sticky bottom banner */}
      <BannerDisplay position="sticky-bottom" />

      {/* Floating side banners */}
      <BannerDisplay position="floating-left" />
      <BannerDisplay position="floating-right" />

      {/* Interstitial overlay */}
      <BannerDisplay position="interstitial" />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <AppContent />
      </RealtimeProvider>
    </AuthProvider>
  );
}
