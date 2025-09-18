'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Shield, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Settings, Plus, Minus, BarChart3 } from 'lucide-react';

interface TraderAllocation {
  id: string;
  name: string;
  avatar: string;
  allocation: number; // percentage
  amount: number; // dollar amount
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    return30d: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  status: 'active' | 'paused' | 'stopped';
}

interface RiskSettings {
  maxAllocationPerTrader: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  stopLossThreshold: number;
  takeProfitThreshold: number;
  enableAutoRebalancing: boolean;
  rebalanceFrequency: 'daily' | 'weekly' | 'monthly';
}

interface PortfolioMetrics {
  totalAllocated: number;
  availableBalance: number;
  totalReturn: number;
  dailyPnL: number;
  riskScore: number;
  diversificationScore: number;
}

const PortfolioAllocation: React.FC = () => {
  const [allocations, setAllocations] = useState<TraderAllocation[]>([]);
  const [riskSettings, setRiskSettings] = useState<RiskSettings>({
    maxAllocationPerTrader: 25,
    maxDailyLoss: 5,
    maxDrawdown: 15,
    stopLossThreshold: 10,
    takeProfitThreshold: 20,
    enableAutoRebalancing: true,
    rebalanceFrequency: 'weekly'
  });
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalAllocated: 0,
    availableBalance: 50000,
    totalReturn: 0,
    dailyPnL: 0,
    riskScore: 0,
    diversificationScore: 0
  });
  const [showRiskSettings, setShowRiskSettings] = useState(false);
  const [totalCapital] = useState(100000);

  // Mock trader data
  useEffect(() => {
    const mockAllocations: TraderAllocation[] = [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: 'AC',
        allocation: 30,
        amount: 30000,
        riskLevel: 'medium',
        performance: {
          return30d: 12.5,
          winRate: 68,
          maxDrawdown: -8.2,
          sharpeRatio: 1.85
        },
        status: 'active'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        riskLevel: 'low',
        allocation: 20,
        amount: 20000,
        performance: {
          return30d: 8.3,
          winRate: 75,
          maxDrawdown: -4.1,
          sharpeRatio: 2.12
        },
        status: 'active'
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        avatar: 'MR',
        allocation: 0,
        amount: 0,
        riskLevel: 'high',
        performance: {
          return30d: 25.8,
          winRate: 58,
          maxDrawdown: -18.5,
          sharpeRatio: 1.42
        },
        status: 'paused'
      }
    ];
    setAllocations(mockAllocations);
    
    // Calculate initial metrics
    const totalAllocated = mockAllocations.reduce((sum, trader) => sum + trader.amount, 0);
    const avgReturn = mockAllocations.reduce((sum, trader) => sum + (trader.performance.return30d * trader.allocation / 100), 0);
    
    setPortfolioMetrics(prev => ({
      ...prev,
      totalAllocated,
      availableBalance: totalCapital - totalAllocated,
      totalReturn: avgReturn,
      dailyPnL: (Math.random() - 0.5) * 2000,
      riskScore: calculateRiskScore(mockAllocations),
      diversificationScore: calculateDiversificationScore(mockAllocations)
    }));
  }, [totalCapital]);

  const calculateRiskScore = (allocations: TraderAllocation[]): number => {
    const activeAllocations = allocations.filter(a => a.status === 'active');
    if (activeAllocations.length === 0) return 0;
    
    const avgDrawdown = activeAllocations.reduce((sum, a) => sum + Math.abs(a.performance.maxDrawdown), 0) / activeAllocations.length;
    const concentrationRisk = Math.max(...activeAllocations.map(a => a.allocation));
    
    return Math.min(100, (avgDrawdown * 2) + (concentrationRisk * 1.5));
  };

  const calculateDiversificationScore = (allocations: TraderAllocation[]): number => {
    const activeAllocations = allocations.filter(a => a.status === 'active');
    if (activeAllocations.length === 0) return 0;
    
    const riskLevels = new Set(activeAllocations.map(a => a.riskLevel));
    const evenDistribution = 100 / activeAllocations.length;
    const distributionVariance = activeAllocations.reduce((sum, a) => sum + Math.pow(a.allocation - evenDistribution, 2), 0) / activeAllocations.length;
    
    return Math.max(0, 100 - (distributionVariance / 10) - ((3 - riskLevels.size) * 20));
  };

  const updateAllocation = (traderId: string, newAllocation: number) => {
    const maxAllowed = Math.min(riskSettings.maxAllocationPerTrader, 100);
    const clampedAllocation = Math.max(0, Math.min(newAllocation, maxAllowed));
    
    setAllocations(prev => {
      const updated = prev.map(trader => {
        if (trader.id === traderId) {
          const newAmount = (clampedAllocation / 100) * totalCapital;
          return {
            ...trader,
            allocation: clampedAllocation,
            amount: newAmount,
            status: clampedAllocation > 0 ? 'active' as const : 'paused' as const
          };
        }
        return trader;
      });
      
      // Update metrics
      const totalAllocated = updated.reduce((sum, trader) => sum + trader.amount, 0);
      const avgReturn = updated.reduce((sum, trader) => sum + (trader.performance.return30d * trader.allocation / 100), 0);
      
      setPortfolioMetrics(prev => ({
        ...prev,
        totalAllocated,
        availableBalance: totalCapital - totalAllocated,
        totalReturn: avgReturn,
        riskScore: calculateRiskScore(updated),
        diversificationScore: calculateDiversificationScore(updated)
      }));
      
      return updated;
    });
  };

  const autoRebalance = () => {
    const activeTraders = allocations.filter(a => a.status === 'active');
    if (activeTraders.length === 0) return;
    
    // Simple equal weight rebalancing
    const equalWeight = 100 / activeTraders.length;
    
    setAllocations(prev => prev.map(trader => {
      if (trader.status === 'active') {
        const newAmount = (equalWeight / 100) * totalCapital;
        return {
          ...trader,
          allocation: equalWeight,
          amount: newAmount
        };
      }
      return trader;
    }));
  };

  const pauseTrader = (traderId: string) => {
    setAllocations(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, status: 'paused', allocation: 0, amount: 0 }
        : trader
    ));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'stopped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score >= 70) return 'text-red-600';
      if (score >= 40) return 'text-yellow-600';
      return 'text-green-600';
    } else {
      if (score >= 70) return 'text-green-600';
      if (score >= 40) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <PieChart className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Allocation</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage copy trading allocations and risk</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={autoRebalance}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Auto Rebalance
          </button>
          <button
            onClick={() => setShowRiskSettings(!showRiskSettings)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Capital</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalCapital.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            ${portfolioMetrics.totalAllocated.toLocaleString()} allocated
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</span>
          </div>
          <div className={`text-2xl font-bold ${portfolioMetrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioMetrics.totalReturn >= 0 ? '+' : ''}{portfolioMetrics.totalReturn.toFixed(1)}%
          </div>
          <div className={`text-sm ${portfolioMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolioMetrics.dailyPnL >= 0 ? '+' : ''}${portfolioMetrics.dailyPnL.toFixed(0)} today
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Score</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(portfolioMetrics.riskScore, true)}`}>
            {portfolioMetrics.riskScore.toFixed(0)}/100
          </div>
          <div className="text-sm text-gray-500">
            {portfolioMetrics.riskScore < 30 ? 'Low Risk' : portfolioMetrics.riskScore < 70 ? 'Medium Risk' : 'High Risk'}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Diversification</span>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(portfolioMetrics.diversificationScore)}`}>
            {portfolioMetrics.diversificationScore.toFixed(0)}/100
          </div>
          <div className="text-sm text-gray-500">
            {portfolioMetrics.diversificationScore >= 70 ? 'Well Diversified' : portfolioMetrics.diversificationScore >= 40 ? 'Moderate' : 'Poor Diversification'}
          </div>
        </div>
      </div>

      {/* Risk Settings */}
      {showRiskSettings && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Management Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Allocation per Trader: {riskSettings.maxAllocationPerTrader}%
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={riskSettings.maxAllocationPerTrader}
                onChange={(e) => setRiskSettings(prev => ({ ...prev, maxAllocationPerTrader: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Daily Loss: {riskSettings.maxDailyLoss}%
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={riskSettings.maxDailyLoss}
                onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDailyLoss: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Drawdown: {riskSettings.maxDrawdown}%
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={riskSettings.maxDrawdown}
                onChange={(e) => setRiskSettings(prev => ({ ...prev, maxDrawdown: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={riskSettings.enableAutoRebalancing}
                  onChange={(e) => setRiskSettings(prev => ({ ...prev, enableAutoRebalancing: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Auto Rebalancing</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rebalance Frequency
              </label>
              <select
                value={riskSettings.rebalanceFrequency}
                onChange={(e) => setRiskSettings(prev => ({ ...prev, rebalanceFrequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Trader Allocations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trader Allocations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {allocations.map(trader => (
              <div key={trader.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{trader.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{trader.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(trader.riskLevel)}`}>
                          {trader.riskLevel} risk
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(trader.status)}`}>
                          {trader.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {trader.allocation.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${trader.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-sm font-medium ${trader.performance.return30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trader.performance.return30d >= 0 ? '+' : ''}{trader.performance.return30d.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">30d Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.performance.winRate.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-600">
                      {trader.performance.maxDrawdown.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Max Drawdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {trader.performance.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Sharpe Ratio</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Allocation</span>
                      <span>{trader.allocation.toFixed(1)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={riskSettings.maxAllocationPerTrader}
                      value={trader.allocation}
                      onChange={(e) => updateAllocation(trader.id, parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateAllocation(trader.id, Math.max(0, trader.allocation - 5))}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateAllocation(trader.id, Math.min(riskSettings.maxAllocationPerTrader, trader.allocation + 5))}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    {trader.status === 'active' && (
                      <button
                        onClick={() => pauseTrader(trader.id)}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                      >
                        Pause
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allocation Chart Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Allocation Breakdown</h3>
        <div className="space-y-3">
          {allocations.filter(t => t.allocation > 0).map(trader => (
            <div key={trader.id} className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded" style={{ backgroundColor: `hsl(${trader.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)` }} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{trader.name}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{trader.allocation.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${trader.allocation}%`,
                      backgroundColor: `hsl(${trader.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {portfolioMetrics.availableBalance > 0 && (
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Available</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {((portfolioMetrics.availableBalance / totalCapital) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gray-300 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(portfolioMetrics.availableBalance / totalCapital) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAllocation;