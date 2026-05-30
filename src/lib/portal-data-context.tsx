'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  sliderSlides as initialSliderSlides,
  matches as initialMatches,
  news as initialNews,
  scorers as initialScorers,
  redCards as initialRedCards,
  matchSyntheses as initialSyntheses,
  type SliderSlide,
  type Match,
  type NewsItem,
  type Scorer,
  type RedCard,
  type MatchSynthesis,
} from '@/lib/mock-data';

interface PortalDataContextType {
  slides: SliderSlide[];
  news: NewsItem[];
  matches: Match[];
  scorers: Scorer[];
  redCards: RedCard[];
  syntheses: MatchSynthesis[];
  updateSlides: (updater: (prev: SliderSlide[]) => SliderSlide[]) => void;
  updateNews: (updater: (prev: NewsItem[]) => NewsItem[]) => void;
  updateMatches: (updater: (prev: Match[]) => Match[]) => void;
  updateScorers: (updater: (prev: Scorer[]) => Scorer[]) => void;
  updateRedCards: (updater: (prev: RedCard[]) => RedCard[]) => void;
  updateSyntheses: (updater: (prev: MatchSynthesis[]) => MatchSynthesis[]) => void;
}

const PortalDataContext = createContext<PortalDataContextType | null>(null);

export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) {
    throw new Error('usePortalData must be used within a PortalDataProvider');
  }
  return ctx;
}

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [slides, setSlides] = useState<SliderSlide[]>(initialSliderSlides);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [scorers, setScorers] = useState<Scorer[]>(initialScorers);
  const [redCards, setRedCards] = useState<RedCard[]>(initialRedCards);
  const [syntheses, setSyntheses] = useState<MatchSynthesis[]>(initialSyntheses);

  const updateSlides = useCallback((updater: (prev: SliderSlide[]) => SliderSlide[]) => {
    setSlides(updater);
  }, []);

  const updateNews = useCallback((updater: (prev: NewsItem[]) => NewsItem[]) => {
    setNews(updater);
  }, []);

  const updateMatches = useCallback((updater: (prev: Match[]) => Match[]) => {
    setMatches(updater);
  }, []);

  const updateScorers = useCallback((updater: (prev: Scorer[]) => Scorer[]) => {
    setScorers(updater);
  }, []);

  const updateRedCards = useCallback((updater: (prev: RedCard[]) => RedCard[]) => {
    setRedCards(updater);
  }, []);

  const updateSyntheses = useCallback((updater: (prev: MatchSynthesis[]) => MatchSynthesis[]) => {
    setSyntheses(updater);
  }, []);

  return (
    <PortalDataContext.Provider
      value={{
        slides,
        news,
        matches,
        scorers,
        redCards,
        syntheses,
        updateSlides,
        updateNews,
        updateMatches,
        updateScorers,
        updateRedCards,
        updateSyntheses,
      }}
    >
      {children}
    </PortalDataContext.Provider>
  );
}
