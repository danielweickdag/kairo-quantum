'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  DollarSign, 
  Percent, 
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Activity,
  Filter,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TradeResult {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  date: string;
  duration: number; // in hours
  marketType: 'STOCKS' | 'CRYPTO' | 'FOREX';
}

interface PerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  grossProfit: number;
  grossLoss: number;
  netProfit: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  expectancy: number;
  sharpeRatio: number;
  calmarRatio: number;
}

interface PeriodData {
  period: string;
  profitFactor: number;
  winRate: number;
  netPnL: number;
  trades: number;
}

export default function ProfitFactorTracker() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'STOCKS' | 'CRYPTO' | 'FOREX'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Mock trade data - in real app, this would come from API
  const mockTrades: TradeResult[] = useMemo(() => {
    const trades = [];
    const symbols = ['AAPL', 'BTCUSD', 'EURUSD', 'TSLA', 'ETHUSD', 'GBPUSD', 'MSFT', 'ADAUSD'];
    const markets: ('STOCKS' | 'CRYPTO' | 'FOREX')[] = ['STOCKS', 'CRYPTO', 'FOREX'];
    
    for (let i = 0; i < 150; i++) {
      const isWin = Math.random() > 0.25; // 75% win rate
      const entryPrice = Math.random() * 1000 + 50;
      const pnlPercent = isWin ? 
        (Math.random() * 8 + 2) : // 2-10% wins
        -(Math.random() * 4 + 1); // 1-5% losses
      
      const exitPrice = entryPrice * (1 + pnlPercent / 100);
      const quantity = Math.floor(Math.random() * 100) + 10;
      const pnl = (exitPrice - entryPrice) * quantity;
      
      trades.push({
        id: `trade_${i}`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        type: (Math.random() > 0.5 ? 'BUY' : 'SELL') as 'BUY' | 'SELL',
        entryPrice,
        exitPrice,
        quantity,
        pnl,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        duration: Math.random() * 48 + 1,
        marketType: markets[Math.floor(Math.random() * markets.length)]
      });
    }
    
    return trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Filter trades based on timeframe and market
  const filteredTrades = useMemo(() => {
    let filtered = [...mockTrades];
    
    // Filter by market
    if (marketFilter !== 'ALL') {
      filtered = filtered.filter(trade => trade.marketType === marketFilter);
    }
    
    // Filter by timeframe
    if (timeframe !== 'ALL') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeframe) {
        case '1D':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case '1W':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '1M':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3M':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '1Y':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(trade => new Date(trade.date) >= cutoffDate);
    }
    
    return filtered;
  }, [mockTrades, timeframe, marketFilter]);

  // Calculate performance metrics
  const metrics = useMemo((): PerformanceMetrics => {
    const trades = filteredTrades;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const netProfit = grossProfit - grossLoss;
    
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    
    const averageWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
    
    const expectancy = trades.length > 0 ? netProfit / trades.length : 0;
    
    // Calculate consecutive wins/losses
    let consecutiveWins = 0;
    let consecutiveLosses = 0;
    let maxConsecutiveWins = 0;
    let maxConsecutiveLosses = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    
    trades.forEach(trade => {
      if (trade.pnl > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
      }
    });
    
    consecutiveWins = currentWinStreak;
    consecutiveLosses = currentLossStreak;
    
    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      profitFactor,
      grossProfit,
      grossLoss,
      netProfit,
      averageWin,
      averageLoss,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
      consecutiveWins,
      consecutiveLosses,
      maxConsecutiveWins,
      maxConsecutiveLosses,
      expectancy,
      sharpeRatio: 2.1, // Mock value
      calmarRatio: 1.8   // Mock value
    };
  }, [filteredTrades]);

  // Generate chart data
  const chartData = useMemo(() => {
    const data: PeriodData[] = [];
    const trades = filteredTrades;
    
    // Group trades by week for the chart
    const weeks = new Map<string, TradeResult[]>();
    
    trades.forEach(trade => {
      const date = new Date(trade.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, []);
      }
      weeks.get(weekKey)!.push(trade);
    });
    
    Array.from(weeks.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([week, weekTrades]) => {
        const winningTrades = weekTrades.filter(t => t.pnl > 0);
        const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
        const grossLoss = Math.abs(weekTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 10 : 0;
        const winRate = weekTrades.length > 0 ? (winningTrades.length / weekTrades.length) * 100 : 0;
        const netPnL = grossProfit - grossLoss;
        
        data.push({
          period: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          profitFactor: Math.min(profitFactor, 10), // Cap at 10 for chart readability
          winRate,
          netPnL,
          trades: weekTrades.length
        });
      });
    
    return data.slice(-12); // Last 12 weeks
  }, [filteredTrades]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getProfitFactorColor = (pf: number) => {
    if (pf >= 2.0) return 'text-green-500';
    if (pf >= 1.6) return 'text-blue-500';
    if (pf >= 1.2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProfitFactorStatus = (pf: number) => {
    if (pf >= 2.0) return { text: 'Excellent', icon: Award, color: 'text-green-500' };
    if (pf >= 1.6) return { text: 'Target Met', icon: CheckCircle, color: 'text-blue-500' };
    if (pf >= 1.2) return { text: 'Good', icon: Activity, color: 'text-yellow-500' };
    return { text: 'Needs Improvement', icon: AlertCircle, color: 'text-red-500' };
  };

  const status = getProfitFactorStatus(metrics.profitFactor);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Profit Factor Tracker
            <Badge className={getProfitFactorColor(metrics.profitFactor)}>
              {metrics.profitFactor.toFixed(2)}
            </Badge>
            <Badge variant="outline" className={status.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.text}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Timeframe:</span>
              <div className="flex gap-1">
                {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
                  <Button
                    key={tf}
                    variant={timeframe === tf ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Market:</span>
              <div className="flex gap-1">
                {(['ALL', 'STOCKS', 'CRYPTO', 'FOREX'] as const).map((market) => (
                  <Button
                    key={market}
                    variant={marketFilter === market ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMarketFilter(market)}
                  >
                    {market}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={getProfitFactorColor(metrics.profitFactor)}>
                  {metrics.profitFactor.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Profit Factor</div>
              <Progress 
                value={Math.min((metrics.profitFactor / 3) * 100, 100)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Target: 1.6+
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2 text-green-600">
                {metrics.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mb-2">Win Rate</div>
              <Progress value={metrics.winRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {metrics.winningTrades}/{metrics.totalTrades} trades
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${metrics.netProfit.toFixed(0)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Net P&L</div>
              <div className="text-xs text-muted-foreground">
                <div className="text-green-600">+${metrics.grossProfit.toFixed(0)} profit</div>
                <div className="text-red-600">-${metrics.grossLoss.toFixed(0)} loss</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                ${metrics.expectancy.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Expectancy</div>
              <div className="text-xs text-muted-foreground">
                Per trade average
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Profit Factor Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'profitFactor' ? value.toFixed(2) : 
                    name === 'winRate' ? `${value.toFixed(1)}%` :
                    name === 'netPnL' ? `$${value.toFixed(0)}` : value,
                    name === 'profitFactor' ? 'Profit Factor' :
                    name === 'winRate' ? 'Win Rate' :
                    name === 'netPnL' ? 'Net P&L' : name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="profitFactor" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="winRate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Profit Factor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Win Rate (%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Winning Trades Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Winning Trades</span>
              <span className="font-semibold">{metrics.winningTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Win</span>
              <span className="font-semibold text-green-600">${metrics.averageWin.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Largest Win</span>
              <span className="font-semibold text-green-600">${metrics.largestWin.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Win Streak</span>
              <span className="font-semibold">{metrics.consecutiveWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Max Win Streak</span>
              <span className="font-semibold">{metrics.maxConsecutiveWins}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Losing Trades Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Losing Trades</span>
              <span className="font-semibold">{metrics.losingTrades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Loss</span>
              <span className="font-semibold text-red-600">-${metrics.averageLoss.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Largest Loss</span>
              <span className="font-semibold text-red-600">${metrics.largestLoss.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Loss Streak</span>
              <span className="font-semibold">{metrics.consecutiveLosses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Max Loss Streak</span>
              <span className="font-semibold">{metrics.maxConsecutiveLosses}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            GainzAlgo Performance Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profit Factor Target</span>
                {metrics.profitFactor >= 1.6 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">
                <span className={getProfitFactorColor(metrics.profitFactor)}>
                  {metrics.profitFactor.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">/ 1.60</span>
              </div>
              <Progress value={Math.min((metrics.profitFactor / 1.6) * 100, 100)} className="h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Win Rate Target</span>
                {metrics.winRate >= 75 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">
                <span className={metrics.winRate >= 75 ? 'text-green-500' : 'text-red-500'}>
                  {metrics.winRate.toFixed(1)}%
                </span>
                <span className="text-sm text-muted-foreground ml-1">/ 75%</span>
              </div>
              <Progress value={Math.min((metrics.winRate / 75) * 100, 100)} className="h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sharpe Ratio</span>
                {metrics.sharpeRatio >= 2.0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="text-2xl font-bold mb-1">
                <span className={metrics.sharpeRatio >= 2.0 ? 'text-green-500' : 'text-red-500'}>
                  {metrics.sharpeRatio.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">/ 2.0</span>
              </div>
              <Progress value={Math.min((metrics.sharpeRatio / 2.0) * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}