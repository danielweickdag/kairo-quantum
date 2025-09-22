'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TradingModeContextType {
  isPaperTrading: boolean;
  setIsPaperTrading: (value: boolean) => void;
  tradingMode: 'paper' | 'live';
  toggleTradingMode: () => void;
}

const TradingModeContext = createContext<TradingModeContextType | undefined>(undefined);

interface TradingModeProviderProps {
  children: ReactNode;
}

export function TradingModeProvider({ children }: TradingModeProviderProps) {
  const [isPaperTrading, setIsPaperTrading] = useState(true); // Default to paper trading (demo mode)

  // Load trading mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('tradingMode');
    if (savedMode) {
      setIsPaperTrading(savedMode === 'paper');
    }
  }, []);

  // Save trading mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('tradingMode', isPaperTrading ? 'paper' : 'live');
  }, [isPaperTrading]);

  const tradingMode = isPaperTrading ? 'paper' : 'live';

  const toggleTradingMode = () => {
    setIsPaperTrading(!isPaperTrading);
  };

  return (
    <TradingModeContext.Provider
      value={{
        isPaperTrading,
        setIsPaperTrading,
        tradingMode,
        toggleTradingMode,
      }}
    >
      {children}
    </TradingModeContext.Provider>
  );
}

export function useTradingMode() {
  const context = useContext(TradingModeContext);
  if (context === undefined) {
    throw new Error('useTradingMode must be used within a TradingModeProvider');
  }
  return context;
}

export { TradingModeContext };