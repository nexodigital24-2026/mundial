'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { RealtimeProvider, useRealtime } from '@/lib/realtime-context';
import { PortalDataProvider } from '@/lib/portal-data-context';
import { ThemeProvider } from '@/lib/theme-context';
import { FooterDataProvider } from '@/lib/footer-context';
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
import LoginTab from '@/components/portal/LoginTab';
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
        ? 'bg-[#1A1A1A] text-white'
        : 'bg-red-500 text-white animate-pulse'
    }`}>
      {connected ? (
        <>
          <Wifi className="w-3.5 h-3.5" />
          <span>En vivo</span>
          <span className="w-1.5 h-1.5 bg-nd-orange rounded-full animate-pulse-live" />
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

  // Listen for footer navigation events
  useEffect(() => {
    const handleFooterNav = (e: Event) => {
      const customEvent = e as CustomEvent;
      const tab = customEvent.detail as string;
      if (tab) {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('footer-navigate', handleFooterNav);
    return () => window.removeEventListener('footer-navigate', handleFooterNav);
  }, []);

  const ActiveComponent = tabComponents[activeTab] ?? HomeTab;

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background — clean gradient, no image */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Subtle orange/gray gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-nd-orange-light/40 via-white/50 to-background/70 dark:from-[#0D0D0D]/95 dark:via-[#0D0D0D]/97 dark:to-background/99" />
        {/* Subtle geometric accent dots — orange themed */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-[10%] left-[15%] w-2 h-2 rounded-full bg-nd-orange" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-[5%] left-[45%] w-1.5 h-1.5 rounded-full bg-nd-orange-accent" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          <div className="absolute top-[8%] left-[75%] w-2.5 h-2.5 rounded-sm bg-nd-orange/60" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-[3%] left-[30%] w-1 h-1 rounded-full bg-[#1A1A1A] dark:bg-white/30" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
          <div className="absolute top-[12%] left-[60%] w-2 h-2 rounded-full bg-nd-orange-dark" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }} />
          <div className="absolute top-[6%] left-[90%] w-1.5 h-1.5 rounded-sm bg-nd-orange-accent/60" style={{ animationDelay: '2.5s', animationDuration: '4.2s' }} />
        </div>
      </div>

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <ActiveComponent onNavigate={handleTabChange} />
      </main>

      <Footer />

      {/* Real-time connection indicator */}
      <ConnectionIndicator connected={connected} />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FooterDataProvider>
          <RealtimeProvider>
            <PortalDataProvider>
              <AppContent />
            </PortalDataProvider>
          </RealtimeProvider>
        </FooterDataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
