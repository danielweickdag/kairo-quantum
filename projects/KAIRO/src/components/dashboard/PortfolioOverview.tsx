'use client';

import { useState, useEffect } from 'react';
import MarketDataWidget from './MarketDataWidget';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  PieChart,
  BarChart3,
  Eye,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

interface PortfolioStats {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  followers: number;
  copiers: number;
  rank: number;
}

interface Position {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
  sector: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function PortfolioOverview() {
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 247850.75,
    dayChange: 4320.50,
    dayChangePercent: 1.78,
    totalReturn: 47850.75,
    totalReturnPercent: 23.92,
    winRate: 78.5,
    profitFactor: 1.85,
    maxDrawdown: 4.2,
    sharpeRatio: 2.34,
    followers: 2847,
    copiers: 156,
    rank: 12
  });

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 100,
      currentPrice: 185.25,
      totalValue: 18525.00,
      dayChange: 285.50,
      dayChangePercent: 1.56,
      allocation: 7.5,
      sector: 'Technology',
      type: 'stock'
    },
    {
      id: '2',
      symbol: 'BTC',
      name: 'Bitcoin',
      shares: 2.5,
      currentPrice: 43250.00,
      totalValue: 108125.00,
      dayChange: 2150.00,
      dayChangePercent: 2.03,
      allocation: 43.6,
      sector: 'Cryptocurrency',
      type: 'crypto'
    },
    {
      id: '3',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 75,
      currentPrice: 245.80,
      totalValue: 18435.00,
      dayChange: -425.25,
      dayChangePercent: -2.26,
      allocation: 7.4,
      sector: 'Automotive',
      type: 'stock'
    },
    {
      id: '4',
      symbol: 'ETH',
      name: 'Ethereum',
      shares: 15,
      currentPrice: 2650.00,
      totalValue: 39750.00,
      dayChange: 795.00,
      dayChangePercent: 2.04,
      allocation: 16.0,
      sector: 'Cryptocurrency',
      type: 'crypto'
    }
  ]);

  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 25,
      price: 182.50,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      pnl: 68.75,
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'BTC',
      type: 'sell',
      quantity: 0.5,
      price: 42800.00,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      pnl: 225.00,
      status: 'completed'
    },
    {
      id: '3',
      symbol: 'MSFT',
      type: 'buy',
      quantity: 50,
      price: 378.90,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      pnl: 0,
      status: 'pending'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto': return '₿';
      case 'forex': return '💱';
      case 'commodity': return '🥇';
      default: return '📈';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(portfolioStats.totalValue)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium ${
                  portfolioStats.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatCurrency(portfolioStats.dayChange)} ({formatPercent(portfolioStats.dayChangePercent)})
                </span>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Return */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</p>
              <p className={`text-2xl font-bold ${
                portfolioStats.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(portfolioStats.totalReturn)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium ${
                  portfolioStats.totalReturnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatPercent(portfolioStats.totalReturnPercent)}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${
              portfolioStats.totalReturn >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              {portfolioStats.totalReturn >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {portfolioStats.winRate}%
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Profit Factor: {portfolioStats.profitFactor}
                </span>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Social Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Followers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {portfolioStats.followers.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Rank #{portfolioStats.rank}
                </span>
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                -{portfolioStats.maxDrawdown}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {portfolioStats.sharpeRatio}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                12.4%
              </span>
            </div>
          </div>
        </div>

        {/* Top Positions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Positions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {positions.slice(0, 4).map((position) => (
                <div key={position.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {getTypeIcon(position.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{position.symbol}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{position.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {position.shares} shares • {position.allocation}% allocation
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(position.totalValue)}
                    </p>
                    <div className="flex items-center space-x-1">
                      {position.dayChange >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        position.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatPercent(position.dayChangePercent)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatCurrency(position.currentPrice)}/share
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {trade.type === 'buy' ? '↗' : '↙'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {trade.type.toUpperCase()} {trade.symbol}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {trade.quantity} @ {formatCurrency(trade.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    trade.status === 'completed' ? (
                      trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    ) : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {trade.status === 'completed' ? formatCurrency(trade.pnl) : trade.status}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {trade.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Data Widget */}
      <div className="mt-8">
        <MarketDataWidget />
      </div>
    </div>
  );
}