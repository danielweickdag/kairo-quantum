'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter, RefreshCw, Target, DollarSign, Activity, Award } from 'lucide-react';

interface PerformanceData {
  id: string;
  strategyName: string;
  type: 'manual' | 'automated' | 'copy-trading' | 'ai-signals';
  period: '7d' | '30d' | '90d' | '1y' | 'all';
  metrics: {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    avgWin: number;
    avgLoss: number;
    calmarRatio: number;
    sortinoRatio: number;
  };
  dailyReturns: { date: string; return: number; cumulative: number }[];
  monthlyReturns: { month: string; return: number }[];
  trades: {
    date: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    pnl: number;
  }[];
}

interface BenchmarkData {
  name: string;
  returns: { date: string; return: number }[];
}

const PerformanceAnalytics: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [selectedPeriod, setPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');
  const [benchmarks] = useState<BenchmarkData[]>([
    { name: 'S&P 500', returns: [] },
    { name: 'Bitcoin', returns: [] },
    { name: 'Portfolio Benchmark', returns: [] }
  ]);

  // Mock performance data
  useEffect(() => {
    const generateDailyReturns = (days: number, volatility: number = 0.02) => {
      const returns = [];
      let cumulative = 100;
      
      for (let i = 0; i < days; i++) {
        const dailyReturn = (Math.random() - 0.48) * volatility;
        cumulative *= (1 + dailyReturn);
        returns.push({
          date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          return: dailyReturn * 100,
          cumulative: cumulative
        });
      }
      return returns;
    };

    const generateTrades = (count: number) => {
      const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'GOOGL'];
      const trades = [];
      
      for (let i = 0; i < count; i++) {
        const isWin = Math.random() > 0.35;
        trades.push({
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          side: Math.random() > 0.5 ? 'buy' as const : 'sell' as const,
          quantity: Math.random() * 10 + 1,
          price: Math.random() * 50000 + 1000,
          pnl: isWin ? Math.random() * 500 + 50 : -(Math.random() * 300 + 25)
        });
      }
      return trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const mockData: PerformanceData[] = [
      {
        id: 'ma-crossover',
        strategyName: 'MA Crossover Strategy',
        type: 'automated',
        period: '30d',
        metrics: {
          totalReturn: 12.5,
          annualizedReturn: 18.3,
          volatility: 15.2,
          sharpeRatio: 1.85,
          maxDrawdown: -8.2,
          winRate: 68.5,
          profitFactor: 2.34,
          totalTrades: 147,
          avgWin: 245.30,
          avgLoss: -128.75,
          calmarRatio: 2.23,
          sortinoRatio: 2.67
        },
        dailyReturns: generateDailyReturns(30, 0.015),
        monthlyReturns: [
          { month: 'Jan', return: 8.2 },
          { month: 'Feb', return: -2.1 },
          { month: 'Mar', return: 6.4 }
        ],
        trades: generateTrades(147)
      },
      {
        id: 'ai-signals',
        strategyName: 'AI Signal Strategy',
        type: 'ai-signals',
        period: '30d',
        metrics: {
          totalReturn: 18.7,
          annualizedReturn: 28.4,
          volatility: 22.1,
          sharpeRatio: 1.92,
          maxDrawdown: -12.3,
          winRate: 72.1,
          profitFactor: 2.89,
          totalTrades: 89,
          avgWin: 298.45,
          avgLoss: -95.20,
          calmarRatio: 2.31,
          sortinoRatio: 2.84
        },
        dailyReturns: generateDailyReturns(30, 0.022),
        monthlyReturns: [
          { month: 'Jan', return: 12.1 },
          { month: 'Feb', return: 3.2 },
          { month: 'Mar', return: 3.4 }
        ],
        trades: generateTrades(89)
      },
      {
        id: 'copy-trading',
        strategyName: 'Copy Trading Portfolio',
        type: 'copy-trading',
        period: '30d',
        metrics: {
          totalReturn: 9.3,
          annualizedReturn: 14.2,
          volatility: 12.8,
          sharpeRatio: 1.67,
          maxDrawdown: -6.1,
          winRate: 74.2,
          profitFactor: 2.12,
          totalTrades: 203,
          avgWin: 156.80,
          avgLoss: -73.90,
          calmarRatio: 2.33,
          sortinoRatio: 2.45
        },
        dailyReturns: generateDailyReturns(30, 0.013),
        monthlyReturns: [
          { month: 'Jan', return: 4.1 },
          { month: 'Feb', return: 2.8 },
          { month: 'Mar', return: 2.4 }
        ],
        trades: generateTrades(203)
      }
    ];

    setPerformanceData(mockData);
  }, []);

  const filteredData = selectedStrategy === 'all' 
    ? performanceData 
    : performanceData.filter(d => d.id === selectedStrategy);

  const aggregatedMetrics = filteredData.reduce((acc, strategy) => {
    const weight = 1 / filteredData.length;
    return {
      totalReturn: acc.totalReturn + (strategy.metrics.totalReturn * weight),
      annualizedReturn: acc.annualizedReturn + (strategy.metrics.annualizedReturn * weight),
      volatility: acc.volatility + (strategy.metrics.volatility * weight),
      sharpeRatio: acc.sharpeRatio + (strategy.metrics.sharpeRatio * weight),
      maxDrawdown: Math.min(acc.maxDrawdown, strategy.metrics.maxDrawdown),
      winRate: acc.winRate + (strategy.metrics.winRate * weight),
      profitFactor: acc.profitFactor + (strategy.metrics.profitFactor * weight),
      totalTrades: acc.totalTrades + strategy.metrics.totalTrades
    };
  }, {
    totalReturn: 0,
    annualizedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0,
    profitFactor: 0,
    totalTrades: 0
  });

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      strategies: filteredData.map(strategy => ({
        name: strategy.strategyName,
        type: strategy.type,
        metrics: strategy.metrics,
        recentTrades: strategy.trades.slice(0, 10)
      })),
      aggregatedMetrics,
      summary: {
        totalStrategies: filteredData.length,
        bestPerformer: filteredData.reduce((best, current) => 
          current.metrics.totalReturn > best.metrics.totalReturn ? current : best
        ).strategyName,
        totalTrades: aggregatedMetrics.totalTrades
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${selectedPeriod}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricColor = (value: number, type: 'return' | 'ratio' | 'drawdown' | 'percentage') => {
    switch (type) {
      case 'return':
        return value >= 0 ? 'text-green-600' : 'text-red-600';
      case 'ratio':
        return value >= 1.5 ? 'text-green-600' : value >= 1 ? 'text-yellow-600' : 'text-red-600';
      case 'drawdown':
        return value >= -5 ? 'text-green-600' : value >= -15 ? 'text-yellow-600' : 'text-red-600';
      case 'percentage':
        return value >= 70 ? 'text-green-600' : value >= 50 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'automated': return <Target className="h-4 w-4" />;
      case 'ai-signals': return <Activity className="h-4 w-4" />;
      case 'copy-trading': return <TrendingUp className="h-4 w-4" />;
      case 'manual': return <BarChart3 className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive strategy performance analysis</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>
        
        <select
          value={selectedStrategy}
          onChange={(e) => setSelectedStrategy(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Strategies</option>
          {performanceData.map(strategy => (
            <option key={strategy.id} value={strategy.id}>{strategy.strategyName}</option>
          ))}
        </select>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
          <option value="all">All Time</option>
        </select>
        
        <div className="flex bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
          {['overview', 'detailed', 'comparison'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-3 py-1 text-sm capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              } ${mode === 'overview' ? 'rounded-l-lg' : mode === 'comparison' ? 'rounded-r-lg' : ''}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(aggregatedMetrics.totalReturn, 'return')}`}>
            {aggregatedMetrics.totalReturn >= 0 ? '+' : ''}{aggregatedMetrics.totalReturn.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">
            {aggregatedMetrics.annualizedReturn.toFixed(1)}% annualized
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(aggregatedMetrics.sharpeRatio, 'ratio')}`}>
            {aggregatedMetrics.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            Risk-adjusted return
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Max Drawdown</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(aggregatedMetrics.maxDrawdown, 'drawdown')}`}>
            {aggregatedMetrics.maxDrawdown.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">
            Worst decline
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(aggregatedMetrics.winRate, 'percentage')}`}>
            {aggregatedMetrics.winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">
            {aggregatedMetrics.totalTrades} total trades
          </div>
        </div>
      </div>

      {/* Strategy Performance Table */}
      {viewMode === 'overview' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategy Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Return
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sharpe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Drawdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map(strategy => (
                  <tr key={strategy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {strategy.strategyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(strategy.type)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {strategy.type.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getMetricColor(strategy.metrics.totalReturn, 'return')}`}>
                        {strategy.metrics.totalReturn >= 0 ? '+' : ''}{strategy.metrics.totalReturn.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getMetricColor(strategy.metrics.sharpeRatio, 'ratio')}`}>
                        {strategy.metrics.sharpeRatio.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getMetricColor(strategy.metrics.maxDrawdown, 'drawdown')}`}>
                        {strategy.metrics.maxDrawdown.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${getMetricColor(strategy.metrics.winRate, 'percentage')}`}>
                        {strategy.metrics.winRate.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {strategy.metrics.totalTrades}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {viewMode === 'detailed' && filteredData.length > 0 && (
        <div className="space-y-6">
          {filteredData.map(strategy => (
            <div key={strategy.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{strategy.strategyName}</h3>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(strategy.type)}
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {strategy.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getMetricColor(strategy.metrics.totalReturn, 'return')}`}>
                      {strategy.metrics.totalReturn >= 0 ? '+' : ''}{strategy.metrics.totalReturn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.metrics.volatility.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Volatility</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getMetricColor(strategy.metrics.sharpeRatio, 'ratio')}`}>
                      {strategy.metrics.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.metrics.calmarRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Calmar Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.metrics.sortinoRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Sortino Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {strategy.metrics.profitFactor.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Profit Factor</div>
                  </div>
                </div>
                
                {/* Recent Trades */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Trades</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Symbol</th>
                          <th className="text-left py-2">Side</th>
                          <th className="text-left py-2">Quantity</th>
                          <th className="text-left py-2">Price</th>
                          <th className="text-left py-2">P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strategy.trades.slice(0, 5).map((trade, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 text-gray-600 dark:text-gray-400">{trade.date}</td>
                            <td className="py-2 text-gray-900 dark:text-white">{trade.symbol}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                trade.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {trade.side.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2 text-gray-900 dark:text-white">{trade.quantity.toFixed(2)}</td>
                            <td className="py-2 text-gray-900 dark:text-white">${trade.price.toFixed(2)}</td>
                            <td className={`py-2 font-medium ${
                              trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Strategy Comparison</h3>
          <div className="space-y-6">
            {/* Performance Comparison Chart */}
            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Performance comparison chart would be rendered here</p>
                <p className="text-sm text-gray-400">Integration with charting library required</p>
              </div>
            </div>
            
            {/* Metrics Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">Metric</th>
                    {filteredData.map(strategy => (
                      <th key={strategy.id} className="text-left py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {strategy.strategyName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'totalReturn', label: 'Total Return', format: (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%` },
                    { key: 'sharpeRatio', label: 'Sharpe Ratio', format: (v: number) => v.toFixed(2) },
                    { key: 'maxDrawdown', label: 'Max Drawdown', format: (v: number) => `${v.toFixed(1)}%` },
                    { key: 'winRate', label: 'Win Rate', format: (v: number) => `${v.toFixed(1)}%` },
                    { key: 'profitFactor', label: 'Profit Factor', format: (v: number) => v.toFixed(2) }
                  ].map(metric => (
                    <tr key={metric.key} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{metric.label}</td>
                      {filteredData.map(strategy => (
                        <td key={strategy.id} className="py-3 text-sm text-gray-900 dark:text-white">
                          {metric.format((strategy.metrics as any)[metric.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceAnalytics;