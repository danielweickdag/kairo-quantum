'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, TrendingUp, TrendingDown, BarChart3, Zap, Target, Shield } from 'lucide-react';

interface Strategy {
  id: string;
  name: string;
  type: 'scalping' | 'swing' | 'momentum' | 'arbitrage';
  status: 'active' | 'paused' | 'stopped';
  profit: number;
  trades: number;
  winRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  allocation: number;
  description: string;
}

interface StrategyConfig {
  stopLoss: number;
  takeProfit: number;
  maxTrades: number;
  riskPerTrade: number;
  timeframe: string;
  indicators: string[];
}

const AutomatedStrategies: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Scalping Pro',
      type: 'scalping',
      status: 'active',
      profit: 2847.50,
      trades: 156,
      winRate: 68.5,
      riskLevel: 'medium',
      allocation: 25,
      description: 'High-frequency scalping with 1-5 minute timeframes'
    },
    {
      id: '2',
      name: 'Momentum Master',
      type: 'momentum',
      status: 'active',
      profit: 5234.80,
      trades: 89,
      winRate: 72.1,
      riskLevel: 'high',
      allocation: 35,
      description: 'Trend-following strategy with momentum indicators'
    },
    {
      id: '3',
      name: 'Swing Trader',
      type: 'swing',
      status: 'paused',
      profit: 1456.20,
      trades: 34,
      winRate: 61.8,
      riskLevel: 'low',
      allocation: 20,
      description: 'Medium-term swing trading with support/resistance'
    },
    {
      id: '4',
      name: 'Arbitrage Bot',
      type: 'arbitrage',
      status: 'active',
      profit: 892.40,
      trades: 203,
      winRate: 89.2,
      riskLevel: 'low',
      allocation: 20,
      description: 'Cross-exchange arbitrage opportunities'
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<StrategyConfig>({
    stopLoss: 2.0,
    takeProfit: 4.0,
    maxTrades: 10,
    riskPerTrade: 1.0,
    timeframe: '5m',
    indicators: ['RSI', 'MACD', 'EMA']
  });

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => {
      if (strategy.id === strategyId) {
        const newStatus = strategy.status === 'active' ? 'paused' : 'active';
        return { ...strategy, status: newStatus };
      }
      return strategy;
    }));
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'scalping': return <Zap className="w-4 h-4" />;
      case 'momentum': return <TrendingUp className="w-4 h-4" />;
      case 'swing': return <BarChart3 className="w-4 h-4" />;
      case 'arbitrage': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const totalProfit = strategies.reduce((sum, strategy) => sum + strategy.profit, 0);
  const activeStrategies = strategies.filter(s => s.status === 'active').length;
  const avgWinRate = strategies.reduce((sum, strategy) => sum + strategy.winRate, 0) / strategies.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Automated Strategies</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Strategy
        </button>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Strategies</p>
              <p className="text-2xl font-bold text-blue-600">{activeStrategies}</p>
            </div>
            <Play className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Win Rate</p>
              <p className="text-2xl font-bold text-purple-600">{avgWinRate.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Strategy List */}
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStrategyIcon(strategy.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{strategy.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{strategy.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profit</p>
                  <p className={`font-semibold ${strategy.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${strategy.profit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{strategy.winRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Risk</p>
                  <p className={`font-semibold ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(strategy.status)}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{strategy.status}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Trades: <span className="font-semibold text-gray-900 dark:text-white">{strategy.trades}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Allocation: <span className="font-semibold text-gray-900 dark:text-white">{strategy.allocation}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowConfig(true);
                  }}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleStrategy(strategy.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    strategy.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'
                      : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                  }`}
                >
                  {strategy.status === 'active' ? (
                    <><Pause className="w-3 h-3 inline mr-1" />Pause</>
                  ) : (
                    <><Play className="w-3 h-3 inline mr-1" />Start</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy Configuration Modal */}
      {showConfig && selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configure {selectedStrategy.name}
              </h3>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stop Loss (%)
                </label>
                <input
                  type="number"
                  value={config.stopLoss}
                  onChange={(e) => setConfig(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Take Profit (%)
                </label>
                <input
                  type="number"
                  value={config.takeProfit}
                  onChange={(e) => setConfig(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Concurrent Trades
                </label>
                <input
                  type="number"
                  value={config.maxTrades}
                  onChange={(e) => setConfig(prev => ({ ...prev, maxTrades: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  value={config.riskPerTrade}
                  onChange={(e) => setConfig(prev => ({ ...prev, riskPerTrade: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timeframe
                </label>
                <select
                  value={config.timeframe}
                  onChange={(e) => setConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="1m">1 Minute</option>
                  <option value="5m">5 Minutes</option>
                  <option value="15m">15 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="4h">4 Hours</option>
                  <option value="1d">1 Day</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save configuration logic here
                  setShowConfig(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedStrategies;