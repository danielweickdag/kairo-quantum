'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Play,
  Pause,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Percent,
  RefreshCw
} from 'lucide-react';

interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  performance: {
    totalReturn: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    monthlyReturn: number;
  };
  followers: number;
  copiedAmount: number;
  allocation: number;
  status: 'active' | 'paused' | 'stopped';
  autoRebalance: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

interface CopyTrade {
  id: string;
  traderId: string;
  traderName: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  copiedAmount: number;
  status: 'pending' | 'executed' | 'failed';
  timestamp: string;
  pnl?: number;
}

interface PortfolioAllocation {
  traderId: string;
  traderName: string;
  allocation: number;
  currentValue: number;
  targetValue: number;
  rebalanceNeeded: boolean;
}

const mockCopyTraders: CopyTrader[] = [
  {
    id: '1',
    name: 'CryptoKing_Pro',
    avatar: 'CK',
    tier: 'platinum',
    performance: {
      totalReturn: 156.8,
      winRate: 78.5,
      sharpeRatio: 2.4,
      maxDrawdown: -12.3,
      monthlyReturn: 18.2
    },
    followers: 2847,
    copiedAmount: 25000,
    allocation: 40,
    status: 'active',
    autoRebalance: true,
    riskLevel: 'medium'
  },
  {
    id: '2',
    name: 'SafeTrader_AI',
    avatar: 'ST',
    tier: 'gold',
    performance: {
      totalReturn: 89.4,
      winRate: 82.1,
      sharpeRatio: 1.8,
      maxDrawdown: -8.7,
      monthlyReturn: 12.5
    },
    followers: 1923,
    copiedAmount: 15000,
    allocation: 30,
    status: 'active',
    autoRebalance: true,
    riskLevel: 'low'
  },
  {
    id: '3',
    name: 'MomentumMaster',
    avatar: 'MM',
    tier: 'silver',
    performance: {
      totalReturn: 234.7,
      winRate: 65.3,
      sharpeRatio: 2.1,
      maxDrawdown: -18.9,
      monthlyReturn: 25.8
    },
    followers: 1456,
    copiedAmount: 10000,
    allocation: 20,
    status: 'paused',
    autoRebalance: false,
    riskLevel: 'high'
  },
  {
    id: '4',
    name: 'DiversifyBot',
    avatar: 'DB',
    tier: 'gold',
    performance: {
      totalReturn: 67.2,
      winRate: 71.8,
      sharpeRatio: 1.6,
      maxDrawdown: -9.4,
      monthlyReturn: 8.9
    },
    followers: 892,
    copiedAmount: 8000,
    allocation: 10,
    status: 'active',
    autoRebalance: true,
    riskLevel: 'low'
  }
];

const mockCopyTrades: CopyTrade[] = [
  {
    id: '1',
    traderId: '1',
    traderName: 'CryptoKing_Pro',
    symbol: 'BTCUSDT',
    side: 'buy',
    amount: 0.5,
    price: 43250,
    copiedAmount: 0.2,
    status: 'executed',
    timestamp: '2024-01-15T10:30:00Z',
    pnl: 125.50
  },
  {
    id: '2',
    traderId: '2',
    traderName: 'SafeTrader_AI',
    symbol: 'ETHUSDT',
    side: 'sell',
    amount: 5.0,
    price: 2580,
    copiedAmount: 1.5,
    status: 'executed',
    timestamp: '2024-01-15T10:25:00Z',
    pnl: -45.20
  },
  {
    id: '3',
    traderId: '1',
    traderName: 'CryptoKing_Pro',
    symbol: 'ADAUSDT',
    side: 'buy',
    amount: 10000,
    price: 0.48,
    copiedAmount: 4000,
    status: 'pending',
    timestamp: '2024-01-15T10:32:00Z'
  },
  {
    id: '4',
    traderId: '4',
    traderName: 'DiversifyBot',
    symbol: 'SOLUSDT',
    side: 'buy',
    amount: 50,
    price: 98.45,
    copiedAmount: 5,
    status: 'failed',
    timestamp: '2024-01-15T10:28:00Z'
  }
];

const mockAllocations: PortfolioAllocation[] = [
  {
    traderId: '1',
    traderName: 'CryptoKing_Pro',
    allocation: 40,
    currentValue: 26500,
    targetValue: 25000,
    rebalanceNeeded: true
  },
  {
    traderId: '2',
    traderName: 'SafeTrader_AI',
    allocation: 30,
    currentValue: 14200,
    targetValue: 15000,
    rebalanceNeeded: true
  },
  {
    traderId: '3',
    traderName: 'MomentumMaster',
    allocation: 20,
    currentValue: 9800,
    targetValue: 10000,
    rebalanceNeeded: false
  },
  {
    traderId: '4',
    traderName: 'DiversifyBot',
    allocation: 10,
    currentValue: 8100,
    targetValue: 8000,
    rebalanceNeeded: false
  }
];

export default function AutoCopyTrading() {
  const [copyTraders, setCopyTraders] = useState<CopyTrader[]>(mockCopyTraders);
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>(mockCopyTrades);
  const [allocations, setAllocations] = useState<PortfolioAllocation[]>(mockAllocations);
  const [autoExecution, setAutoExecution] = useState(true);
  const [autoRebalancing, setAutoRebalancing] = useState(true);
  const [isRebalancing, setIsRebalancing] = useState(false);

  const toggleTraderStatus = (traderId: string) => {
    setCopyTraders(prev => prev.map(trader => {
      if (trader.id === traderId) {
        const newStatus = trader.status === 'active' ? 'paused' : 'active';
        return { ...trader, status: newStatus };
      }
      return trader;
    }));
  };

  const executeRebalance = async () => {
    setIsRebalancing(true);
    // Simulate rebalancing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAllocations(prev => prev.map(allocation => ({
      ...allocation,
      currentValue: allocation.targetValue,
      rebalanceNeeded: false
    })));
    
    setIsRebalancing(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-500';
      case 'gold': return 'text-yellow-500';
      case 'silver': return 'text-gray-400';
      case 'bronze': return 'text-orange-600';
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

  const getTradeStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
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

  const totalPortfolioValue = allocations.reduce((sum, allocation) => sum + allocation.currentValue, 0);
  const totalPnL = copyTrades.filter(trade => trade.pnl).reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const activeTrades = copyTrades.filter(trade => trade.status === 'pending').length;
  const successRate = (copyTrades.filter(trade => trade.status === 'executed').length / copyTrades.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Copy className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Automated Copy Trading</h1>
            <p className="text-gray-600 dark:text-gray-400">Intelligent portfolio rebalancing and trade execution</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Execution</span>
            <Switch checked={autoExecution} onCheckedChange={setAutoExecution} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Rebalancing</span>
            <Switch checked={autoRebalancing} onCheckedChange={setAutoRebalancing} />
          </div>
          <Button onClick={executeRebalance} disabled={isRebalancing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRebalancing ? 'animate-spin' : ''}`} />
            Rebalance
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traders">Copy Traders</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Value</p>
                    <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</p>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Trades</p>
                    <p className="text-2xl font-bold">{activeTrades}</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Status</CardTitle>
                <CardDescription>Current system settings and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Execution</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${autoExecution ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">{autoExecution ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto Rebalancing</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${autoRebalancing ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">{autoRebalancing ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Traders</span>
                  <span className="font-bold text-green-500">
                    {copyTraders.filter(t => t.status === 'active').length}/{copyTraders.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rebalance Needed</span>
                  <span className={`font-bold ${
                    allocations.some(a => a.rebalanceNeeded) ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {allocations.filter(a => a.rebalanceNeeded).length} traders
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest copy trading actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {copyTrades.slice(0, 4).map(trade => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{trade.symbol}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {trade.traderName} • {trade.side.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getTradeStatusColor(trade.status)}>
                          {trade.status}
                        </Badge>
                        {trade.pnl && (
                          <p className={`text-sm font-medium ${
                            trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {copyTraders.map(trader => (
              <Card key={trader.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {trader.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{trader.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTierColor(trader.tier)}>
                            {trader.tier.toUpperCase()}
                          </Badge>
                          <span className={`text-sm font-medium ${getRiskColor(trader.riskLevel)}`}>
                            {trader.riskLevel.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(trader.status)}`} />
                      <Badge variant="outline">{trader.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                      <p className={`font-bold ${trader.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trader.performance.totalReturn >= 0 ? '+' : ''}{trader.performance.totalReturn}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="font-bold">{trader.performance.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allocation</p>
                      <p className="font-bold">{trader.allocation}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Copied Amount</p>
                      <p className="font-bold">${trader.copiedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{trader.followers.toLocaleString()} followers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Auto Rebalance</span>
                      <Switch checked={trader.autoRebalance} />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={trader.status === 'active' ? 'destructive' : 'default'}
                      onClick={() => toggleTraderStatus(trader.id)}
                      className="flex-1"
                    >
                      {trader.status === 'active' ? (
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

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Copy Trades</CardTitle>
              <CardDescription>All executed and pending copy trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {copyTrades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold">{trade.symbol}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{trade.traderName}</p>
                      </div>
                      <Badge className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {trade.side.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{trade.copiedAmount} / {trade.amount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${trade.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                    </div>
                    <div className="text-center">
                      <Badge className={getTradeStatusColor(trade.status)}>
                        {trade.status}
                      </Badge>
                      {trade.pnl && (
                        <p className={`text-sm font-medium ${
                          trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Current vs target allocation for each trader</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocations.map(allocation => (
                  <div key={allocation.traderId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold">{allocation.traderName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Target: {allocation.allocation}% • Current: ${allocation.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {allocation.rebalanceNeeded ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <Badge variant={allocation.rebalanceNeeded ? 'destructive' : 'default'}>
                          {allocation.rebalanceNeeded ? 'Rebalance Needed' : 'Balanced'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: ${allocation.currentValue.toLocaleString()}</span>
                        <span>Target: ${allocation.targetValue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(allocation.currentValue / allocation.targetValue) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Difference: ${Math.abs(allocation.currentValue - allocation.targetValue).toLocaleString()}</span>
                        <span>{allocation.allocation}% target</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}