'use client';

import { useState } from 'react';
import Navbar from '@/components/portal/Navbar';
import Footer from '@/components/portal/Footer';
import HomeTab from '@/components/portal/HomeTab';
import GroupsTab from '@/components/portal/GroupsTab';
import ResultsTab from '@/components/portal/ResultsTab';
import ScorersTab from '@/components/portal/ScorersTab';
import RedCardsTab from '@/components/portal/RedCardsTab';
import SynthesisTab from '@/components/portal/SynthesisTab';
import VotingTab from '@/components/portal/VotingTab';

const tabComponents: Record<string, React.ComponentType<{ onNavigate?: (tab: string) => void }>> = {
  inicio: HomeTab,
  grupos: GroupsTab,
  resultados: ResultsTab,
  goleadores: ScorersTab,
  expulsados: RedCardsTab,
  sintesis: SynthesisTab,
  votacion: VotingTab,
};

export default function HomePage() {
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
