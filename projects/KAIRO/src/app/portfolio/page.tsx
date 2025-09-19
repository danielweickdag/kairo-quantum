'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBrokerAccount } from '@/contexts/BrokerAccountContext';
import { BrokerAccountSelector } from '@/components/trading/BrokerAccountSelector';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  sector: string;
  type: 'stock' | 'crypto' | 'etf' | 'bond';
}

interface PortfolioStats {
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
  investedAmount: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend';
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  fees: number;
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const { selectedAccount, setSelectedAccount } = useBrokerAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'transactions' | 'analytics'>('overview');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [loading, setLoading] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);

  // Mock portfolio data
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 125750.50,
    totalReturn: 18250.50,
    totalReturnPercent: 16.98,
    dayChange: 1250.75,
    dayChangePercent: 1.01,
    cashBalance: 5250.00,
    investedAmount: 120500.50
  });

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 50,
      avgPrice: 150.25,
      currentPrice: 175.80,
      marketValue: 8790.00,
      totalReturn: 1277.50,
      totalReturnPercent: 17.01,
      dayChange: 125.50,
      dayChangePercent: 1.45,
      sector: 'Technology',
      type: 'stock'
    },
    {
      id: '2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 25,
      avgPrice: 220.50,
      currentPrice: 245.30,
      marketValue: 6132.50,
      totalReturn: 620.00,
      totalReturnPercent: 11.24,
      dayChange: -75.25,
      dayChangePercent: -1.21,
      sector: 'Automotive',
      type: 'stock'
    },
    {
      id: '3',
      symbol: 'BTC',
      name: 'Bitcoin',
      quantity: 0.5,
      avgPrice: 45000.00,
      currentPrice: 52000.00,
      marketValue: 26000.00,
      totalReturn: 3500.00,
      totalReturnPercent: 15.56,
      dayChange: 800.00,
      dayChangePercent: 3.17,
      sector: 'Cryptocurrency',
      type: 'crypto'
    },
    {
      id: '4',
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      quantity: 100,
      avgPrice: 420.00,
      currentPrice: 445.20,
      marketValue: 44520.00,
      totalReturn: 2520.00,
      totalReturnPercent: 6.00,
      dayChange: 220.00,
      dayChangePercent: 0.50,
      sector: 'ETF',
      type: 'etf'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'buy',
      symbol: 'AAPL',
      quantity: 10,
      price: 175.80,
      total: 1758.00,
      date: '2024-03-15',
      fees: 1.00
    },
    {
      id: '2',
      type: 'sell',
      symbol: 'MSFT',
      quantity: 5,
      price: 420.50,
      total: 2102.50,
      date: '2024-03-14',
      fees: 1.50
    },
    {
      id: '3',
      type: 'dividend',
      symbol: 'AAPL',
      quantity: 50,
      price: 0.24,
      total: 12.00,
      date: '2024-03-10',
      fees: 0
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    if (hideBalances) return '****';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    if (hideBalances) return '**%';
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'crypto': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'etf': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'bond': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Portfolio
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Track your investments and portfolio performance
                </p>
                {/* Broker Account Selector */}
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Active Broker Account
                  </label>
                  <BrokerAccountSelector
                    selectedAccount={selectedAccount}
                    onAccountSelect={setSelectedAccount}
                    placeholder="Select your trading account"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setHideBalances(!hideBalances)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {hideBalances ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Add Position
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</h3>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(portfolioStats.totalValue)}
            </p>
            <div className={`flex items-center mt-2 text-sm ${
              portfolioStats.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {portfolioStats.dayChange >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {formatCurrency(Math.abs(portfolioStats.dayChange))} ({formatPercent(portfolioStats.dayChangePercent)})
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</h3>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <p className={`text-2xl font-bold ${
              portfolioStats.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(portfolioStats.totalReturn)}
            </p>
            <p className={`text-sm mt-2 ${
              portfolioStats.totalReturnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercent(portfolioStats.totalReturnPercent)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Invested</h3>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(portfolioStats.investedAmount)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {((portfolioStats.investedAmount / portfolioStats.totalValue) * 100).toFixed(1)}% of total
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cash Balance</h3>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(portfolioStats.cashBalance)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Available for trading
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'positions', label: 'Positions', icon: PieChart },
            { id: 'transactions', label: 'Transactions', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Positions Tab */}
        {activeTab === 'positions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Positions</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Assets</option>
                    <option value="stocks">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="etf">ETFs</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Market Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Day Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Return
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {positions.map((position) => (
                    <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {position.symbol.slice(0, 2)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {position.symbol}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {position.name}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(position.type)}`}>
                              {position.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {position.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(position.avgPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(position.currentPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(position.marketValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center ${
                          position.dayChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {position.dayChange >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                          {formatCurrency(Math.abs(position.dayChange))}
                          <span className="ml-1">({formatPercent(position.dayChangePercent)})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center ${
                          position.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(position.totalReturn)}
                          <span className="ml-1">({formatPercent(position.totalReturnPercent)})</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Types</option>
                    <option value="buy">Buys</option>
                    <option value="sell">Sells</option>
                    <option value="dividend">Dividends</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fees
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                          transaction.type === 'sell' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                          'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(transaction.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(transaction.fees)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Allocation Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Allocation</h3>
              <div className="h-64 flex items-center justify-center">
                <PieChart className="h-16 w-16 text-gray-400" />
                <span className="ml-4 text-gray-500 dark:text-gray-400">Chart visualization would go here</span>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                <div className="flex space-x-1">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period as any)}
                      className={`px-3 py-1 text-xs font-medium rounded ${
                        timeframe === period
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-gray-400" />
                <span className="ml-4 text-gray-500 dark:text-gray-400">Performance chart would go here</span>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h3>
              <div className="space-y-3">
                {positions
                  .sort((a, b) => b.totalReturnPercent - a.totalReturnPercent)
                  .slice(0, 3)
                  .map((position) => (
                    <div key={position.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {position.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{position.symbol}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{position.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {formatPercent(position.totalReturnPercent)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(position.totalReturn)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' :
                        transaction.type === 'sell' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {transaction.type === 'buy' ? <Plus className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                         transaction.type === 'sell' ? <Minus className="h-4 w-4 text-red-600 dark:text-red-400" /> :
                         <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.type.toUpperCase()} {transaction.symbol}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(transaction.total)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.quantity} shares
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Advanced Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed portfolio analytics and insights coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}