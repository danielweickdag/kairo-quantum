'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Copy,
  Eye,
  DollarSign,
  BarChart3,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award
} from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  verified: boolean;
  followers: number;
  totalReturn: number;
  totalReturnPercent: number;
  monthlyReturn: number;
  monthlyReturnPercent: number;
  winRate: number;
  riskScore: number;
  copiers: number;
  minCopyAmount: number;
  description: string;
  tags: string[];
  isFollowing: boolean;
  isCopying: boolean;
}

interface CopyTrade {
  id: string;
  traderId: string;
  traderName: string;
  amount: number;
  startDate: string;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  status: 'active' | 'paused' | 'stopped';
}

export default function CopyTradePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'following' | 'my-copies'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'top-performers' | 'low-risk' | 'verified'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for traders
  const [traders, setTraders] = useState<Trader[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahtrader',
      verified: true,
      followers: 12500,
      totalReturn: 45000,
      totalReturnPercent: 28.5,
      monthlyReturn: 3200,
      monthlyReturnPercent: 4.2,
      winRate: 78,
      riskScore: 6,
      copiers: 850,
      minCopyAmount: 1000,
      description: 'Tech-focused growth investor with 8+ years experience. Specializing in AI and renewable energy stocks.',
      tags: ['Tech', 'Growth', 'AI', 'Clean Energy'],
      isFollowing: false,
      isCopying: false
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      username: '@valueinvestor',
      verified: true,
      followers: 8900,
      totalReturn: 32000,
      totalReturnPercent: 22.1,
      monthlyReturn: 1800,
      monthlyReturnPercent: 2.8,
      winRate: 85,
      riskScore: 4,
      copiers: 650,
      minCopyAmount: 500,
      description: 'Conservative value investor following Warren Buffett principles. Focus on dividend stocks and blue chips.',
      tags: ['Value', 'Dividends', 'Conservative', 'Blue Chip'],
      isFollowing: true,
      isCopying: true
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      username: '@cryptoqueen',
      verified: false,
      followers: 15200,
      totalReturn: 78000,
      totalReturnPercent: 45.2,
      monthlyReturn: 5600,
      monthlyReturnPercent: 8.1,
      winRate: 65,
      riskScore: 8,
      copiers: 1200,
      minCopyAmount: 2000,
      description: 'Crypto and DeFi specialist. High-risk, high-reward strategies with focus on emerging altcoins.',
      tags: ['Crypto', 'DeFi', 'High Risk', 'Altcoins'],
      isFollowing: false,
      isCopying: false
    }
  ]);

  // Mock data for user's copy trades
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([
    {
      id: '1',
      traderId: '2',
      traderName: 'Marcus Johnson',
      amount: 5000,
      startDate: '2024-01-15',
      currentValue: 5420,
      totalReturn: 420,
      totalReturnPercent: 8.4,
      status: 'active'
    },
    {
      id: '2',
      traderId: '1',
      traderName: 'Sarah Chen',
      amount: 3000,
      startDate: '2024-02-01',
      currentValue: 3180,
      totalReturn: 180,
      totalReturnPercent: 6.0,
      status: 'active'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFollowTrader = (traderId: string) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, isFollowing: !trader.isFollowing, followers: trader.isFollowing ? trader.followers - 1 : trader.followers + 1 }
        : trader
    ));
  };

  const handleCopyTrader = (traderId: string) => {
    // In a real app, this would open a modal to configure copy settings
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, isCopying: !trader.isCopying, copiers: trader.isCopying ? trader.copiers - 1 : trader.copiers + 1 }
        : trader
    ));
  };

  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trader.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trader.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    switch (filterBy) {
      case 'top-performers':
        return trader.totalReturnPercent > 20;
      case 'low-risk':
        return trader.riskScore <= 5;
      case 'verified':
        return trader.verified;
      default:
        return true;
    }
  });

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-600 dark:text-green-400';
    if (score <= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 6) return 'Medium Risk';
    return 'High Risk';
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Copy Trading
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Follow and automatically copy the trades of successful investors
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'discover', label: 'Discover Traders', icon: Search },
            { id: 'following', label: 'Following', icon: Users },
            { id: 'my-copies', label: 'My Copy Trades', icon: Copy }
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

        {/* Discover Traders Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search traders by name, username, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Traders</option>
                  <option value="top-performers">Top Performers</option>
                  <option value="low-risk">Low Risk</option>
                  <option value="verified">Verified Only</option>
                </select>
              </div>
            </div>

            {/* Traders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTraders.map((trader) => (
                <div key={trader.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  {/* Trader Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {trader.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{trader.name}</h3>
                          {trader.verified && (
                            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{trader.username}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(trader.riskScore)}`}>
                      {getRiskLabel(trader.riskScore)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                      <p className={`font-semibold ${
                        trader.totalReturnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {trader.totalReturnPercent >= 0 ? '+' : ''}{trader.totalReturnPercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trader.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trader.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Copiers</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{trader.copiers.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {trader.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {trader.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFollowTrader(trader.id)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                        trader.isFollowing
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {trader.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={() => handleCopyTrader(trader.id)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                        trader.isCopying
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {trader.isCopying ? 'Copying' : 'Copy'}
                    </button>
                  </div>

                  {/* Min Copy Amount */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Min. copy amount: ${trader.minCopyAmount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Copy Trades Tab */}
        {activeTab === 'my-copies' && (
          <div>
            {copyTrades.length === 0 ? (
              <div className="text-center py-12">
                <Copy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Copy Trades Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start copying successful traders to grow your portfolio automatically.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Discover Traders
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {copyTrades.map((copyTrade) => (
                  <div key={copyTrade.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {copyTrade.traderName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Started {new Date(copyTrade.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        copyTrade.status === 'active' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                        copyTrade.status === 'paused' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      }`}>
                        {copyTrade.status.charAt(0).toUpperCase() + copyTrade.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Initial Amount</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${copyTrade.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${copyTrade.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                        <p className={`font-semibold ${
                          copyTrade.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {copyTrade.totalReturn >= 0 ? '+' : ''}${copyTrade.totalReturn.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Return %</p>
                        <p className={`font-semibold ${
                          copyTrade.totalReturnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {copyTrade.totalReturnPercent >= 0 ? '+' : ''}{copyTrade.totalReturnPercent}%
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {copyTrade.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                      <button className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                        Stop Copying
                      </button>
                      <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div>
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Following Traders
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage the traders you&apos;re following.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}