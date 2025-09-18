'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, DollarSign, Target, Activity, Play, Pause, RotateCcw, Download, Settings } from 'lucide-react';

interface BacktestResult {
  id: string;
  strategyName: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  status: 'running' | 'completed' | 'failed';
  progress: number;
}

interface BacktestConfig {
  strategyId: string;
  symbol: string;
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  slippage: number;
}

const BacktestingEngine: React.FC = () => {
  const [backtests, setBacktests] = useState<BacktestResult[]>([]);
  const [config, setConfig] = useState<BacktestConfig>({
    strategyId: '',
    symbol: 'BTC/USD',
    timeframe: '1h',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    initialCapital: 10000,
    commission: 0.1,
    slippage: 0.05
  });
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBacktest, setSelectedBacktest] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const strategies = [
    { id: 'ma-cross', name: 'Moving Average Crossover' },
    { id: 'rsi-mean', name: 'RSI Mean Reversion' },
    { id: 'bollinger', name: 'Bollinger Bands' },
    { id: 'macd-signal', name: 'MACD Signal' },
    { id: 'custom-ai', name: 'Custom AI Strategy' }
  ];

  const symbols = ['BTC/USD', 'ETH/USD', 'AAPL', 'TSLA', 'GOOGL', 'EUR/USD', 'GBP/USD'];
  const timeframes = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' }
  ];

  // Mock backtest data
  useEffect(() => {
    const mockBacktests: BacktestResult[] = [
      {
        id: '1',
        strategyName: 'Moving Average Crossover',
        symbol: 'BTC/USD',
        timeframe: '1h',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        initialCapital: 10000,
        finalCapital: 15420,
        totalReturn: 54.2,
        annualizedReturn: 42.8,
        maxDrawdown: -18.5,
        sharpeRatio: 1.85,
        winRate: 68.5,
        profitFactor: 2.34,
        totalTrades: 147,
        winningTrades: 101,
        losingTrades: 46,
        avgWin: 245.30,
        avgLoss: -128.75,
        status: 'completed',
        progress: 100
      },
      {
        id: '2',
        strategyName: 'RSI Mean Reversion',
        symbol: 'ETH/USD',
        timeframe: '4h',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-31'),
        initialCapital: 10000,
        finalCapital: 12850,
        totalReturn: 28.5,
        annualizedReturn: 35.2,
        maxDrawdown: -12.3,
        sharpeRatio: 1.92,
        winRate: 72.1,
        profitFactor: 2.89,
        totalTrades: 89,
        winningTrades: 64,
        losingTrades: 25,
        avgWin: 198.45,
        avgLoss: -95.20,
        status: 'completed',
        progress: 100
      },
      {
        id: '3',
        strategyName: 'Custom AI Strategy',
        symbol: 'BTC/USD',
        timeframe: '15m',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        initialCapital: 10000,
        finalCapital: 10000,
        totalReturn: 0,
        annualizedReturn: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        winRate: 0,
        profitFactor: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgWin: 0,
        avgLoss: 0,
        status: 'running',
        progress: 45
      }
    ];
    setBacktests(mockBacktests);
  }, []);

  const runBacktest = () => {
    if (!config.strategyId) return;
    
    setIsRunning(true);
    const strategy = strategies.find(s => s.id === config.strategyId);
    
    const newBacktest: BacktestResult = {
      id: Date.now().toString(),
      strategyName: strategy?.name || 'Unknown Strategy',
      symbol: config.symbol,
      timeframe: config.timeframe,
      startDate: new Date(config.startDate),
      endDate: new Date(config.endDate),
      initialCapital: config.initialCapital,
      finalCapital: config.initialCapital,
      totalReturn: 0,
      annualizedReturn: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      winRate: 0,
      profitFactor: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      avgWin: 0,
      avgLoss: 0,
      status: 'running',
      progress: 0
    };
    
    setBacktests(prev => [newBacktest, ...prev]);
    
    // Simulate backtest progress
    const progressInterval = setInterval(() => {
      setBacktests(prev => prev.map(bt => {
        if (bt.id === newBacktest.id && bt.status === 'running') {
          const newProgress = Math.min(bt.progress + Math.random() * 15, 100);
          if (newProgress >= 100) {
            // Generate random results
            const totalReturn = (Math.random() - 0.3) * 100; // -30% to +70%
            const finalCapital = config.initialCapital * (1 + totalReturn / 100);
            const totalTrades = Math.floor(Math.random() * 200) + 50;
            const winRate = Math.random() * 40 + 50; // 50-90%
            const winningTrades = Math.floor(totalTrades * winRate / 100);
            
            return {
              ...bt,
              status: 'completed' as const,
              progress: 100,
              finalCapital,
              totalReturn,
              annualizedReturn: totalReturn * 1.2,
              maxDrawdown: -(Math.random() * 25 + 5),
              sharpeRatio: Math.random() * 2 + 0.5,
              winRate,
              profitFactor: Math.random() * 2 + 1,
              totalTrades,
              winningTrades,
              losingTrades: totalTrades - winningTrades,
              avgWin: Math.random() * 300 + 100,
              avgLoss: -(Math.random() * 150 + 50)
            };
          }
          return { ...bt, progress: newProgress };
        }
        return bt;
      }));
    }, 1000);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsRunning(false);
    }, 8000);
  };

  const stopBacktest = (backtestId: string) => {
    setBacktests(prev => prev.map(bt => 
      bt.id === backtestId ? { ...bt, status: 'failed' as const } : bt
    ));
  };

  const deleteBacktest = (backtestId: string) => {
    setBacktests(prev => prev.filter(bt => bt.id !== backtestId));
  };

  const exportResults = (backtest: BacktestResult) => {
    const data = {
      strategy: backtest.strategyName,
      symbol: backtest.symbol,
      timeframe: backtest.timeframe,
      period: `${backtest.startDate.toISOString().split('T')[0]} to ${backtest.endDate.toISOString().split('T')[0]}`,
      results: {
        initialCapital: backtest.initialCapital,
        finalCapital: backtest.finalCapital,
        totalReturn: `${backtest.totalReturn}%`,
        annualizedReturn: `${backtest.annualizedReturn}%`,
        maxDrawdown: `${backtest.maxDrawdown}%`,
        sharpeRatio: backtest.sharpeRatio,
        winRate: `${backtest.winRate}%`,
        profitFactor: backtest.profitFactor,
        totalTrades: backtest.totalTrades,
        winningTrades: backtest.winningTrades,
        losingTrades: backtest.losingTrades,
        avgWin: backtest.avgWin,
        avgLoss: backtest.avgLoss
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest-${backtest.strategyName}-${backtest.symbol}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: BacktestResult['status']) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
    }
  };

  const getReturnColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategy Backtesting</h2>
            <p className="text-gray-600 dark:text-gray-400">Test your strategies against historical data</p>
          </div>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>New Backtest</span>
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backtest Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Strategy
              </label>
              <select
                value={config.strategyId}
                onChange={(e) => setConfig(prev => ({ ...prev, strategyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a strategy</option>
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symbol
              </label>
              <select
                value={config.symbol}
                onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeframe
              </label>
              <select
                value={config.timeframe}
                onChange={(e) => setConfig(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {timeframes.map(tf => (
                  <option key={tf.value} value={tf.value}>{tf.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Initial Capital ($)
              </label>
              <input
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                runBacktest();
                setShowConfig(false);
              }}
              disabled={!config.strategyId || isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Run Backtest
            </button>
          </div>
        </div>
      )}

      {/* Backtests List */}
      <div className="space-y-4">
        {backtests.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No backtests yet. Create your first backtest to get started.</p>
          </div>
        ) : (
          backtests.map(backtest => (
            <div
              key={backtest.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {backtest.strategyName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(backtest.status)}`}>
                      {backtest.status.charAt(0).toUpperCase() + backtest.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{backtest.symbol}</span>
                    <span>{backtest.timeframe}</span>
                    <span>
                      {backtest.startDate.toLocaleDateString()} - {backtest.endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {backtest.status === 'running' && (
                    <button
                      onClick={() => stopBacktest(backtest.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  )}
                  {backtest.status === 'completed' && (
                    <button
                      onClick={() => exportResults(backtest)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteBacktest(backtest.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {backtest.status === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(backtest.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${backtest.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {backtest.status === 'completed' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getReturnColor(backtest.totalReturn)}`}>
                      {backtest.totalReturn > 0 ? '+' : ''}{backtest.totalReturn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${backtest.finalCapital.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Final Capital</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getReturnColor(backtest.maxDrawdown)}`}>
                      {backtest.maxDrawdown.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Max Drawdown</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {backtest.sharpeRatio.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sharpe Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {backtest.winRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {backtest.totalTrades}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Trades</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BacktestingEngine;