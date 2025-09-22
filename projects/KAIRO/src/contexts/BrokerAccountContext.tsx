'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrokerAccount {
  id: string;
  accountNumber: string;
  accountType: string;
  status: string;
  buyingPower: number;
  cashBalance: number;
  portfolioValue: number;
  currency: string;
  brokerConnection: {
    id: string;
    accountName: string;
    brokerType: string;
    environment: string;
  };
}

interface BrokerAccountContextType {
  selectedAccount: BrokerAccount | null;
  setSelectedAccount: (account: BrokerAccount | null) => void;
  accounts: BrokerAccount[];
  loading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
}

const BrokerAccountContext = createContext<BrokerAccountContextType | undefined>(undefined);

interface BrokerAccountProviderProps {
  children: ReactNode;
}

export function BrokerAccountProvider({ children }: BrokerAccountProviderProps) {
  const [selectedAccount, setSelectedAccount] = useState<BrokerAccount | null>(null);
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokerAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/brokers/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch broker accounts');
      }

      const data = await response.json();
      if (data.success) {
        setAccounts(data.data || []);
        
        // If there's a previously selected account, try to maintain it
        if (selectedAccount) {
          const stillExists = data.data.find((acc: BrokerAccount) => acc.id === selectedAccount.id);
          if (!stillExists) {
            setSelectedAccount(null);
          }
        }
        
        // Auto-select the first account if none is selected and accounts are available
        if (!selectedAccount && data.data.length > 0) {
          setSelectedAccount(data.data[0]);
        }
      } else {
        throw new Error(data.message || 'Failed to fetch accounts');
      }
    } catch (err) {
      console.error('Error fetching broker accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccounts = async () => {
    await fetchBrokerAccounts();
  };

  useEffect(() => {
    fetchBrokerAccounts();
  }, [fetchBrokerAccounts]);

  // Save selected account to localStorage
  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem('selectedBrokerAccount', JSON.stringify(selectedAccount));
    } else {
      localStorage.removeItem('selectedBrokerAccount');
    }
  }, [selectedAccount]);

  // Load selected account from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('selectedBrokerAccount');
    if (savedAccount) {
      try {
        const parsedAccount = JSON.parse(savedAccount);
        setSelectedAccount(parsedAccount);
      } catch (err) {
        console.error('Error parsing saved broker account:', err);
        localStorage.removeItem('selectedBrokerAccount');
      }
    }
  }, []);

  const value: BrokerAccountContextType = {
    selectedAccount,
    setSelectedAccount,
    accounts,
    loading,
    error,
    refreshAccounts
  };

  return (
    <BrokerAccountContext.Provider value={value}>
      {children}
    </BrokerAccountContext.Provider>
  );
}

export function useBrokerAccount() {
  const context = useContext(BrokerAccountContext);
  if (context === undefined) {
    throw new Error('useBrokerAccount must be used within a BrokerAccountProvider');
  }
  return context;
}

export type { BrokerAccount, BrokerAccountContextType };