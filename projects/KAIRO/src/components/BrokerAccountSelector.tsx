'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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

interface BrokerAccountSelectorProps {
  selectedAccount?: BrokerAccount | null;
  onAccountSelect: (account: BrokerAccount | null) => void;
  className?: string;
  placeholder?: string;
}

export default function BrokerAccountSelector({
  selectedAccount,
  onAccountSelect,
  className = '',
  placeholder = 'Select a broker account'
}: BrokerAccountSelectorProps) {
  const [accounts, setAccounts] = useState<BrokerAccount[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchBrokerAccounts();
  }, []);

  const fetchBrokerAccounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // User is not authenticated, set empty accounts and return
        setIsAuthenticated(false);
        setAccounts([]);
        setLoading(false);
        return;
      }
      
      setIsAuthenticated(true);

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
      } else {
        throw new Error(data.message || 'Failed to fetch accounts');
      }
    } catch (err) {
      console.error('Error fetching broker accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getBrokerDisplayName = (brokerType: string) => {
    const brokerNames: { [key: string]: string } = {
      'ALPACA': 'Alpaca',
      'INTERACTIVE_BROKERS': 'Interactive Brokers',
      'TD_AMERITRADE': 'TD Ameritrade',
      'SCHWAB': 'Charles Schwab',
      'FIDELITY': 'Fidelity',
      'E_TRADE': 'E*TRADE'
    };
    return brokerNames[brokerType] || brokerType;
  };

  const getAccountTypeDisplay = (accountType: string) => {
    const typeNames: { [key: string]: string } = {
      'CASH': 'Cash Account',
      'MARGIN': 'Margin Account',
      'RETIREMENT': 'Retirement Account',
      'CRYPTO': 'Crypto Account'
    };
    return typeNames[accountType] || accountType;
  };

  const handleAccountSelect = (account: BrokerAccount) => {
    onAccountSelect(account);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          Loading accounts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full px-3 py-2 border border-red-300 rounded-md bg-red-50 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className={`relative ${className}`}>
        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-center">
              No broker accounts found. Please connect a broker first.
            </div>
            <Link href="/brokers">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                <PlusIcon className="h-4 w-4 mr-2" />
                Connect Broker
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-center">
            Please log in to view broker accounts.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
      >
        <span className="block truncate">
          {selectedAccount ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {getBrokerDisplayName(selectedAccount.brokerConnection.brokerType)}
                </span>
                <span className="ml-2 text-gray-500">
                  {selectedAccount.brokerConnection.accountName}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(selectedAccount.portfolioValue, selectedAccount.currency)}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div
            className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-50"
            onClick={() => handleAccountSelect(null as any)}
          >
            <span className="block truncate text-gray-500">Clear selection</span>
          </div>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-50"
              onClick={() => handleAccountSelect(account)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">
                      {getBrokerDisplayName(account.brokerConnection.brokerType)}
                    </span>
                    <span className="ml-2 text-gray-500">
                      {account.brokerConnection.accountName}
                    </span>
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {account.brokerConnection.environment}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>{getAccountTypeDisplay(account.accountType)}</span>
                    <span className="mx-2">•</span>
                    <span>Account: {account.accountNumber}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Portfolio: {formatCurrency(account.portfolioValue, account.currency)}</span>
                    <span className="mx-2">•</span>
                    <span>Cash: {formatCurrency(account.cashBalance, account.currency)}</span>
                    <span className="mx-2">•</span>
                    <span>Buying Power: {formatCurrency(account.buyingPower, account.currency)}</span>
                  </div>
                </div>
              </div>

              {selectedAccount?.id === account.id && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}