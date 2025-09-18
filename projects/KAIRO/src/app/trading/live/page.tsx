import React from 'react';
import LiveTradingDashboard from '@/components/trading/LiveTradingDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Trading - KAIRO',
  description: 'Real-time trading dashboard with live market data, portfolio tracking, and order management',
};

const LiveTradingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Live Trading Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your portfolio in real-time, execute trades, and manage positions with live market data.
        </p>
      </div>
      
      <LiveTradingDashboard />
    </div>
  );
};

export default LiveTradingPage;