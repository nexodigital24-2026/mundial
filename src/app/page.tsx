'use client';

import { useState } from 'react';
import { AuthProvider } from '@/lib/auth-context';
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

function AppContent() {
  const [activeTab, setActiveTab] = useState('inicio');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ActiveComponent = tabComponents[activeTab] ?? HomeTab;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <ActiveComponent onNavigate={handleTabChange} />
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
