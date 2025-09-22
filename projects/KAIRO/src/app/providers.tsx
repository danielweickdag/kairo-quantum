'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrokerAccountProvider } from '@/contexts/BrokerAccountContext';
import { TradingModeProvider } from '@/contexts/TradingModeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrokerAccountProvider>
            <TradingModeProvider>
              {children}
            </TradingModeProvider>
          </BrokerAccountProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}