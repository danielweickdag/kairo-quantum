'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Play,
  Pause,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  Target,
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  settings: {
    riskLevel: 'low' | 'medium' | 'high';
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
  trades: {
    total: number;
    winning: number;
    losing: number;
    pending: number;
  };
  lastAction: {
    type: 'buy' | 'sell' | 'hold';
    symbol: string;
    amount: number;
    price: number;
    timestamp: string;
  };
}

interface MarketSignal {
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  indicators: {
    rsi: number;
    macd: number;
    bollinger: 'upper' | 'middle' | 'lower';
    volume: 'high' | 'normal' | 'low';
  };
}

const mockBots: TradingBot[] = [
  {
    id: '1',
    name: 'AI Momentum Bot',
    strategy: 'Momentum + AI Analysis',
    status: 'active',
    performance: {
      totalReturn: 24.5,
      winRate: 68.2,
      sharpeRatio: 1.85,
      maxDrawdown: -8.3
    },
    settings: {
      riskLevel: 'medium',
      maxPositionSize: 10000,
      stopLoss: 5,
      takeProfit: 15
    },
    trades: {
      total: 156,
      winning: 106,
      losing: 42,
      pending: 8
    },
    lastAction: {
      type: 'buy',
      symbol: 'BTCUSDT',
      amount: 0.25,
      price: 43250,
      timestamp: '2024-01-15T10:30:00Z'
    }
  },
  {
    id: '2',
    name: 'Mean Reversion AI',
    strategy: 'Mean Reversion + ML',
    status: 'active',
    performance: {
      totalReturn: 18.7,
      winRate: 72.1,
      sharpeRatio: 1.62,
      maxDrawdown: -6.1
    },
    settings: {
      riskLevel: 'low',
      maxPositionSize: 5000,
      stopLoss: 3,
      takeProfit: 10
    },
    trades: {
      total: 203,
      winning: 146,
      losing: 49,
      pending: 8
    },
    lastAction: {
      type: 'sell',
      symbol: 'ETHUSDT',
      amount: 2.5,
      price: 2580,
      timestamp: '2024-01-15T10:25:00Z'
    }
  },
  {
    id: '3',
    name: 'Scalping Bot Pro',
    strategy: 'High-Frequency Scalping',
    status: 'paused',
    performance: {
      totalReturn: 31.2,
      winRate: 64.8,
      sharpeRatio: 2.1,
      maxDrawdown: -12.5
    },
    settings: {
      riskLevel: 'high',
      maxPositionSize: 15000,
      stopLoss: 2,
      takeProfit: 8
    },
    trades: {
      total: 892,
      winning: 578,
      losing: 314,
      pending: 0
    },
    lastAction: {
      type: 'hold',
      symbol: 'ADAUSDT',
      amount: 0,
      price: 0.48,
      timestamp: '2024-01-15T09:45:00Z'
    }
  }
];

const mockSignals: MarketSignal[] = [
  {
    symbol: 'BTCUSDT',
    signal: 'buy',
    confidence: 85,
    reasoning: 'Strong bullish momentum with RSI oversold recovery and MACD crossover',
    indicators: {
      rsi: 35,
      macd: 0.8,
      bollinger: 'lower',
      volume: 'high'
    }
  },
  {
    symbol: 'ETHUSDT',
    signal: 'hold',
    confidence: 62,
    reasoning: 'Consolidation phase with mixed signals, waiting for clearer direction',
    indicators: {
      rsi: 52,
      macd: -0.2,
      bollinger: 'middle',
      volume: 'normal'
    }
  },
  {
    symbol: 'ADAUSDT',
    signal: 'sell',
    confidence: 78,
    reasoning: 'Bearish divergence with high RSI and decreasing volume',
    indicators: {
      rsi: 72,
      macd: -0.5,
      bollinger: 'upper',
      volume: 'low'
    }
  }
];

export default function TradingBot() {
  const [bots, setBots] = useState<TradingBot[]>(mockBots);
  const [signals, setSignals] = useState<MarketSignal[]>(mockSignals);
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [autoTrading, setAutoTrading] = useState(true);

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === 'active' ? 'paused' : 'active';
        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-500';
      case 'sell': return 'text-red-500';
      case 'hold': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">AI Trading Bots</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated trading with artificial intelligence</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Trading</span>
            <Switch checked={autoTrading} onCheckedChange={setAutoTrading} />
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bots">Bot Management</TabsTrigger>
          <TabsTrigger value="signals">AI Signals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bots</p>
                    <p className="text-2xl font-bold">{bots.filter(bot => bot.status === 'active').length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</p>
                    <p className="text-2xl font-bold text-green-500">+24.8%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold">68.4%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Trades</p>
                    <p className="text-2xl font-bold">16</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bot Activity</CardTitle>
              <CardDescription>Latest actions taken by your trading bots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bots.map(bot => (
                  <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`} />
                      <div>
                        <p className="font-medium">{bot.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{bot.strategy}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {bot.lastAction.type.toUpperCase()} {bot.lastAction.symbol}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(bot.lastAction.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {bots.map(bot => (
              <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedBot(bot)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(bot.status)}`} />
                      <Badge variant="outline">{bot.status}</Badge>
                    </div>
                  </div>
                  <CardDescription>{bot.strategy}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                      <p className={`font-bold ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="font-bold">{bot.performance.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
                      <p className={`font-bold ${getRiskColor(bot.settings.riskLevel)}`}>
                        {bot.settings.riskLevel.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Trades</p>
                      <p className="font-bold">{bot.trades.total}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={bot.status === 'active' ? 'destructive' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBotStatus(bot.id);
                      }}
                      className="flex-1"
                    >
                      {bot.status === 'active' ? (
                        <><Pause className="h-4 w-4 mr-1" /> Pause</>
                      ) : (
                        <><Play className="h-4 w-4 mr-1" /> Start</>
                      )}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Market Signals</span>
              </CardTitle>
              <CardDescription>Real-time AI analysis and trading recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signals.map((signal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-lg">{signal.symbol}</h3>
                        <Badge className={getSignalColor(signal.signal)}>
                          {signal.signal.toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                          <span className="font-medium">{signal.confidence}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {signal.confidence >= 80 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : signal.confidence >= 60 ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{signal.reasoning}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">RSI:</span>
                        <span className="ml-2 font-medium">{signal.indicators.rsi}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">MACD:</span>
                        <span className="ml-2 font-medium">{signal.indicators.macd}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Bollinger:</span>
                        <span className="ml-2 font-medium">{signal.indicators.bollinger}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                        <span className="ml-2 font-medium">{signal.indicators.volume}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Overall bot performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bots.map(bot => (
                    <div key={bot.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{bot.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe: {bot.performance.sharpeRatio}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${bot.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {bot.performance.totalReturn >= 0 ? '+' : ''}{bot.performance.totalReturn}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Max DD: {bot.performance.maxDrawdown}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade Statistics</CardTitle>
                <CardDescription>Detailed trading activity breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bots.map(bot => (
                    <div key={bot.id} className="p-3 border rounded">
                      <p className="font-medium mb-2">{bot.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-medium">{bot.trades.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Winning:</span>
                          <span className="font-medium text-green-500">{bot.trades.winning}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Losing:</span>
                          <span className="font-medium text-red-500">{bot.trades.losing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending:</span>
                          <span className="font-medium text-yellow-500">{bot.trades.pending}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}