'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bot, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BotConfig {
  id: string;
  name: string;
  strategy: string;
  isActive: boolean;
  balance: number;
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastTradeTime?: string;
}

interface BotTrade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  executedPrice: number;
  pnl: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  timestamp: string;
}

interface PerformanceData {
  timestamp: string;
  value: number;
  pnl: number;
}

const AIBotDashboard: React.FC = () => {
  const [botConfigs, setBotConfigs] = useState<BotConfig[]>([]);
  const [recentTrades, setRecentTrades] = useState<BotTrade[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Mock data for demonstration
  const mockBotConfigs: BotConfig[] = [
    {
      id: '1',
      name: 'Momentum Trader',
      strategy: 'momentum',
      isActive: true,
      balance: 10000,
      totalPnL: 1250.50,
      winRate: 68.5,
      totalTrades: 147,
      riskLevel: 'MEDIUM',
      lastTradeTime: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Mean Reversion Bot',
      strategy: 'mean_reversion',
      isActive: false,
      balance: 5000,
      totalPnL: -125.75,
      winRate: 45.2,
      totalTrades: 89,
      riskLevel: 'LOW',
      lastTradeTime: '2024-01-14T16:45:00Z'
    },
    {
      id: '3',
      name: 'Breakout Hunter',
      strategy: 'breakout',
      isActive: true,
      balance: 15000,
      totalPnL: 2890.25,
      winRate: 72.1,
      totalTrades: 203,
      riskLevel: 'HIGH',
      lastTradeTime: '2024-01-15T11:15:00Z'
    }
  ];

  const mockRecentTrades: BotTrade[] = [
    {
      id: '1',
      symbol: 'AAPL',
      side: 'BUY',
      quantity: 10,
      executedPrice: 185.50,
      pnl: 125.30,
      status: 'EXECUTED',
      timestamp: '2024-01-15T11:15:00Z'
    },
    {
      id: '2',
      symbol: 'TSLA',
      side: 'SELL',
      quantity: 5,
      executedPrice: 245.80,
      pnl: -45.20,
      status: 'EXECUTED',
      timestamp: '2024-01-15T10:45:00Z'
    },
    {
      id: '3',
      symbol: 'MSFT',
      side: 'BUY',
      quantity: 8,
      executedPrice: 378.90,
      pnl: 89.60,
      status: 'EXECUTED',
      timestamp: '2024-01-15T10:30:00Z'
    }
  ];

  const mockPerformanceData: PerformanceData[] = [
    { timestamp: '09:00', value: 10000, pnl: 0 },
    { timestamp: '09:30', value: 10150, pnl: 150 },
    { timestamp: '10:00', value: 10080, pnl: 80 },
    { timestamp: '10:30', value: 10250, pnl: 250 },
    { timestamp: '11:00', value: 10180, pnl: 180 },
    { timestamp: '11:30', value: 10320, pnl: 320 }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // In real implementation, fetch from API
      setTimeout(() => {
        setBotConfigs(mockBotConfigs);
        setRecentTrades(mockRecentTrades);
        setPerformanceData(mockPerformanceData);
        setLoading(false);
      }, 1000);
    };

    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const toggleBot = async (botId: string) => {
    setBotConfigs(prev => 
      prev.map(bot => 
        bot.id === botId 
          ? { ...bot, isActive: !bot.isActive }
          : bot
      )
    );
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const totalPnL = botConfigs.reduce((sum, bot) => sum + bot.totalPnL, 0);
  const activeBots = botConfigs.filter(bot => bot.isActive).length;
  const totalTrades = botConfigs.reduce((sum, bot) => sum + bot.totalTrades, 0);
  const avgWinRate = botConfigs.length > 0 
    ? botConfigs.reduce((sum, bot) => sum + bot.winRate, 0) / botConfigs.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Trading Bots</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage your automated trading strategies</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Bot className="h-4 w-4 mr-2" />
            New Bot
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalPnL.toFixed(2)}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            {totalPnL >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
            )}
            {totalPnL >= 0 ? '+' : ''}{((totalPnL / 25000) * 100).toFixed(2)}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Bots</h3>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeBots}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {botConfigs.length} total bots
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Trades</h3>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalTrades}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Across all bots
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Win Rate</h3>
            <Target className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgWinRate.toFixed(1)}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${avgWinRate}%`}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              Overview
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Bot Management
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Recent Trades
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300">
              Performance
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Performance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time P&L tracking</p>
              </div>
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Bots Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bot Status</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current bot activity</p>
              </div>
              <div className="space-y-4">
                {botConfigs.map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${bot.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{bot.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{bot.strategy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${bot.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${bot.totalPnL.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{bot.winRate}% win rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Management Tab Content - Hidden for now, would be shown based on active tab */}
        <div className="hidden space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {botConfigs.map((bot) => (
              <div key={bot.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bot.name}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={bot.isActive}
                        onChange={() => toggleBot(bot.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{bot.strategy} strategy</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bot.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {bot.isActive ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><Pause className="h-3 w-3 mr-1" /> Paused</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                    <span className="font-medium text-gray-900 dark:text-white">${bot.balance.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">P&L</span>
                    <span className={`font-medium ${bot.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${bot.totalPnL.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bot.winRate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bot.riskLevel === 'LOW' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      bot.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {bot.riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Trades</span>
                    <span className="font-medium text-gray-900 dark:text-white">{bot.totalTrades}</span>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </button>
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analytics
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades Tab Content */}
        <div className="hidden space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Trades</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest bot trading activity</p>
            </div>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      trade.side === 'BUY' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{trade.symbol}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {trade.side} {trade.quantity} @ ${trade.executedPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                    <p className={`text-sm mt-1 ${
                      trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Tab Content */}
        <div className="hidden space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Detailed performance metrics and trends</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Portfolio Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};

export default AIBotDashboard;