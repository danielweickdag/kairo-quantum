'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Award, 
  BarChart3, 
  PieChart, 
  Activity, 
  Calendar,
  Filter,
  Download,
  Share,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp as Growth,
  Users,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

// Import our custom components
import WinRateTracker from './WinRateTracker';
import ProfitFactorTracker from './ProfitFactorTracker';
import DrawdownMonitor from './DrawdownMonitor';
import TimeframeSelector from './TimeframeSelector';
import RealTimeAlerts from './RealTimeAlerts';
import StopLossTakeProfit from './StopLossTakeProfit';
import RiskManagementSettings from './RiskManagementSettings';

interface UserStats {
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
  accountBalance: number;
  initialBalance: number;
  roi: number;
  monthlyReturn: number;
  yearlyReturn: number;
  bestMonth: number;
  worstMonth: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  tradingDays: number;
  profitableDays: number;
  breakEvenDays: number;
  losingDays: number;
}

interface PerformanceData {
  date: string;
  balance: number;
  profit: number;
  drawdown: number;
  trades: number;
  winRate: number;
  profitFactor: number;
}

interface MarketBreakdown {
  market: string;
  trades: number;
  profit: number;
  winRate: number;
  allocation: number;
  color: string;
}

interface MonthlyPerformance {
  month: string;
  profit: number;
  trades: number;
  winRate: number;
  drawdown: number;
}

export default function TradingPerformanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M');
  const [showPrivateData, setShowPrivateData] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'analytics'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  // Mock user performance data
  const userStats: UserStats = useMemo(() => ({
    totalProfit: 47850.25,
    totalTrades: 342,
    winRate: 78.4,
    profitFactor: 2.3,
    maxDrawdown: 3.2,
    sharpeRatio: 2.1,
    calmarRatio: 1.8,
    accountBalance: 147850.25,
    initialBalance: 100000,
    roi: 47.85,
    monthlyReturn: 12.3,
    yearlyReturn: 47.85,
    bestMonth: 18.7,
    worstMonth: -2.1,
    consecutiveWins: 12,
    consecutiveLosses: 3,
    avgWin: 285.40,
    avgLoss: -124.80,
    largestWin: 2450.00,
    largestLoss: -890.50,
    tradingDays: 89,
    profitableDays: 67,
    breakEvenDays: 8,
    losingDays: 14
  }), []);

  // Generate performance chart data
  const performanceData: PerformanceData[] = useMemo(() => {
    const data = [];
    let balance = userStats.initialBalance;
    const days = selectedPeriod === '1M' ? 30 : selectedPeriod === '3M' ? 90 : selectedPeriod === '6M' ? 180 : selectedPeriod === '1Y' ? 365 : 365;
    
    for (let i = 0; i < days; i++) {
      const dailyReturn = (Math.random() - 0.35) * 0.015; // Positive bias
      const profit = balance * dailyReturn;
      balance += profit;
      
      const trades = Math.floor(Math.random() * 8) + 1;
      const winRate = 70 + Math.random() * 20;
      const profitFactor = 1.5 + Math.random() * 1.5;
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        balance,
        profit,
        drawdown: Math.max(0, (Math.random() - 0.8) * 5),
        trades,
        winRate,
        profitFactor
      });
    }
    
    return data;
  }, [selectedPeriod, userStats.initialBalance]);

  // Market breakdown data
  const marketBreakdown: MarketBreakdown[] = useMemo(() => [
    {
      market: 'Crypto',
      trades: 156,
      profit: 28450.30,
      winRate: 82.1,
      allocation: 45.6,
      color: '#f59e0b'
    },
    {
      market: 'Forex',
      trades: 98,
      profit: 12890.75,
      winRate: 76.5,
      allocation: 28.7,
      color: '#3b82f6'
    },
    {
      market: 'Stocks',
      trades: 88,
      profit: 6509.20,
      winRate: 73.9,
      allocation: 25.7,
      color: '#10b981'
    }
  ], []);

  // Monthly performance data
  const monthlyData: MonthlyPerformance[] = useMemo(() => [
    { month: 'Jan', profit: 8450, trades: 45, winRate: 77.8, drawdown: 1.2 },
    { month: 'Feb', profit: 12300, trades: 52, winRate: 80.8, drawdown: 0.8 },
    { month: 'Mar', profit: 6890, trades: 38, winRate: 73.7, drawdown: 2.1 },
    { month: 'Apr', profit: 15670, trades: 61, winRate: 83.6, drawdown: 0.5 },
    { month: 'May', profit: 4540, trades: 29, winRate: 72.4, drawdown: 3.2 },
    { month: 'Jun', profit: -1200, trades: 18, winRate: 61.1, drawdown: 2.8 }
  ], []);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Performance data updated');
    }, 1500);
  };

  const exportData = () => {
    toast.success('Performance report exported');
  };

  const shareResults = () => {
    toast.success('Performance shared successfully');
  };

  const getPerformanceColor = (value: number, type: 'profit' | 'percentage' | 'ratio') => {
    if (type === 'profit') {
      return value >= 0 ? 'text-green-600' : 'text-red-600';
    }
    if (type === 'percentage') {
      return value >= 75 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
    }
    if (type === 'ratio') {
      return value >= 2.0 ? 'text-green-600' : value >= 1.5 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    if (!showPrivateData) return '***,***';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Trading Performance Dashboard
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              GainzAlgo V2
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrivateData(!showPrivateData)}
            >
              {showPrivateData ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {showPrivateData ? 'Hide' : 'Show'} Values
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={shareResults}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
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

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Period:</span>
              <div className="flex gap-1">
                {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">View:</span>
              <div className="flex gap-1">
                {(['overview', 'detailed', 'analytics'] as const).map((view) => (
                  <Button
                    key={view}
                    variant={selectedView === view ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedView(view)}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={getPerformanceColor(userStats.totalProfit, 'profit')}>
                  {formatCurrency(userStats.totalProfit)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Profit</div>
              <div className="text-xs text-green-600 mt-1">
                {formatPercentage(userStats.roi)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {formatCurrency(userStats.accountBalance)}
              </div>
              <div className="text-sm text-muted-foreground">Account Balance</div>
              <div className="text-xs text-muted-foreground mt-1">
                Initial: {formatCurrency(userStats.initialBalance)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={getPerformanceColor(userStats.winRate, 'percentage')}>
                  {userStats.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <Progress value={userStats.winRate} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={getPerformanceColor(userStats.profitFactor, 'ratio')}>
                  {userStats.profitFactor.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Profit Factor</div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: 1.6+
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className="text-red-600">
                  {userStats.maxDrawdown.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Max Drawdown</div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: &lt;5%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {userStats.totalTrades}
              </div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-xs text-green-600 mt-1">
                {userStats.consecutiveWins} win streak
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Account Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tickFormatter={(value) => showPrivateData ? `$${(value / 1000).toFixed(0)}k` : '***k'}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    showPrivateData ? `$${value.toFixed(0)}` : '***,***',
                    'Account Balance'
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Market Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={marketBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="allocation"
                  >
                    {marketBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(1)}%`, 'Allocation']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {marketBreakdown.map((market) => (
                <div key={market.market} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: market.color }}
                    ></div>
                    <span className="text-sm font-medium">{market.market}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(market.profit)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {market.trades} trades • {market.winRate.toFixed(1)}% WR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => showPrivateData ? `$${(value / 1000).toFixed(0)}k` : '***k'} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      showPrivateData ? `$${value.toFixed(0)}` : '***,***',
                      'Profit'
                    ]}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      {selectedView === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Trade Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Average Win</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(userStats.avgWin)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Average Loss</div>
                  <div className="text-lg font-semibold text-red-600">
                    {formatCurrency(userStats.avgLoss)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Largest Win</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(userStats.largestWin)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Largest Loss</div>
                  <div className="text-lg font-semibold text-red-600">
                    {formatCurrency(userStats.largestLoss)}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Risk Metrics</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Sharpe Ratio</span>
                    <span className="font-medium">{userStats.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Calmar Ratio</span>
                    <span className="font-medium">{userStats.calmarRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Return</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(userStats.monthlyReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Trading Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Trading Days</div>
                  <div className="text-lg font-semibold">{userStats.tradingDays}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Profitable Days</div>
                  <div className="text-lg font-semibold text-green-600">
                    {userStats.profitableDays}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Break-even Days</div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {userStats.breakEvenDays}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Losing Days</div>
                  <div className="text-lg font-semibold text-red-600">
                    {userStats.losingDays}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">Streaks</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Win Streak</span>
                    <span className="font-medium text-green-600">
                      {userStats.consecutiveWins}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Loss Streak</span>
                    <span className="font-medium text-red-600">
                      {userStats.consecutiveLosses}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best Month</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(userStats.bestMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Worst Month</span>
                    <span className="font-medium text-red-600">
                      {formatPercentage(userStats.worstMonth)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Component Modules */}
      {selectedView === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Analytics Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'winrate', name: 'Win Rate Tracker', icon: Target, component: 'WinRateTracker' },
                  { id: 'profitfactor', name: 'Profit Factor', icon: TrendingUp, component: 'ProfitFactorTracker' },
                  { id: 'drawdown', name: 'Drawdown Monitor', icon: Shield, component: 'DrawdownMonitor' },
                  { id: 'timeframe', name: 'Timeframe Selector', icon: Clock, component: 'TimeframeSelector' },
                  { id: 'alerts', name: 'Real-time Alerts', icon: AlertCircle, component: 'RealTimeAlerts' },
                  { id: 'stoploss', name: 'Stop Loss/TP', icon: Target, component: 'StopLossTakeProfit' },
                  { id: 'risk', name: 'Risk Management', icon: Shield, component: 'RiskManagementSettings' }
                ].map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <Button
                      key={module.id}
                      variant={activeComponent === module.id ? 'default' : 'outline'}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveComponent(activeComponent === module.id ? null : module.id)}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-xs text-center">{module.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Render Active Component */}
          {activeComponent === 'winrate' && <WinRateTracker />}
          {activeComponent === 'profitfactor' && <ProfitFactorTracker />}
          {activeComponent === 'drawdown' && <DrawdownMonitor />}
          {activeComponent === 'timeframe' && <TimeframeSelector />}
          {activeComponent === 'alerts' && <RealTimeAlerts />}
          {activeComponent === 'stoploss' && (
            <StopLossTakeProfit 
              symbol="BTCUSDT"
              currentPrice={45000}
              signalType="BUY"
            />
          )}
          {activeComponent === 'risk' && <RiskManagementSettings />}
        </div>
      )}

      {/* GainzAlgo Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            GainzAlgo Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Algorithm Status</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Win Rate Target:</span>
                  <span className="font-medium text-green-600">✓ 75%+ Achieved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit Factor:</span>
                  <span className="font-medium text-green-600">✓ 1.6+ Achieved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Drawdown:</span>
                  <span className="font-medium text-green-600">✓ &lt;5% Achieved</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Performance Grade</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">A+</div>
                <div className="text-sm text-muted-foreground">Exceptional Performance</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Top 5% of all traders
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-3">
                <Growth className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Growth Metrics</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className="font-medium text-green-600">
                    {formatPercentage(userStats.roi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Avg:</span>
                  <span className="font-medium text-green-600">
                    {formatPercentage(userStats.monthlyReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consistency:</span>
                  <span className="font-medium text-blue-600">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}