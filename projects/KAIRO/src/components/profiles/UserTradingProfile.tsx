'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Award, 
  BarChart3, 
  PieChart, 
  Activity, 
  Calendar,
  Settings,
  Bell,
  Share,
  Download,
  Eye,
  EyeOff,
  Star,
  Crown,
  Zap,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Globe,
  Wallet,
  CreditCard,
  LineChart,
  MoreHorizontal,
  Plus,
  Minus,
  RefreshCw,
  Play,
  Pause,
  Square,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  ExternalLink,
  Filter,
  Search,
  Volume2,
  VolumeX
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

// Import our trading components
import TradingPerformanceDashboard from '../trading/TradingPerformanceDashboard';
import TradingPanel from '@/components/trading/TradingPanel';
import UserStatsDisplay from '@/components/stats/UserStatsDisplay';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  tier: 'Free' | 'Pro' | 'Elite' | 'Master';
  verified: boolean;
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  accountBalance: number;
  roi: number;
  rank: number;
  followers: number;
  following: number;
  copiers: number;
  reputation: number;
  badges: string[];
}

interface LiveMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

interface TradingPosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export default function UserTradingProfile() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'trading' | 'portfolio' | 'social'>('overview');
  const [selectedMarket, setSelectedMarket] = useState<'crypto' | 'forex' | 'stocks'>('crypto');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('1h');
  const [showPrivateData, setShowPrivateData] = useState(true);
  const [isTrading, setIsTrading] = useState(false);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock user profile data
  const userProfile: UserProfile = useMemo(() => ({
    id: 'user_123',
    username: 'CryptoTrader_Pro',
    email: 'trader@gainzalgo.com',
    avatar: '/api/placeholder/100/100',
    joinDate: '2023-01-15',
    tier: 'Elite',
    verified: true,
    totalProfit: 47850.25,
    totalTrades: 342,
    winRate: 78.4,
    profitFactor: 2.3,
    maxDrawdown: 3.2,
    accountBalance: 147850.25,
    roi: 47.85,
    rank: 156,
    followers: 2847,
    following: 89,
    copiers: 1234,
    reputation: 4.8,
    badges: ['Top Trader', 'Consistent Performer', 'Risk Manager', 'Crypto Expert']
  }), []);

  // Mock live market data
  const marketData: LiveMarketData[] = useMemo(() => [
    {
      symbol: 'BTCUSDT',
      price: 45234.56,
      change: 1234.56,
      changePercent: 2.81,
      volume: 28456789,
      high24h: 46500.00,
      low24h: 43800.00,
      marketCap: 890000000000
    },
    {
      symbol: 'ETHUSDT',
      price: 2845.67,
      change: -45.23,
      changePercent: -1.56,
      volume: 15678234,
      high24h: 2950.00,
      low24h: 2780.00,
      marketCap: 342000000000
    },
    {
      symbol: 'ADAUSDT',
      price: 0.4567,
      change: 0.0234,
      changePercent: 5.41,
      volume: 89234567,
      high24h: 0.4890,
      low24h: 0.4123,
      marketCap: 16000000000
    },
    {
      symbol: 'SOLUSDT',
      price: 98.45,
      change: 3.67,
      changePercent: 3.88,
      volume: 12345678,
      high24h: 102.30,
      low24h: 94.20,
      marketCap: 42000000000
    }
  ], []);

  // Mock trading positions
  const positions: TradingPosition[] = useMemo(() => [
    {
      id: 'pos_1',
      symbol: 'BTCUSDT',
      type: 'BUY',
      size: 0.5,
      entryPrice: 44000.00,
      currentPrice: 45234.56,
      pnl: 617.28,
      pnlPercent: 2.81,
      timestamp: '2024-01-15T10:30:00Z',
      status: 'OPEN'
    },
    {
      id: 'pos_2',
      symbol: 'ETHUSDT',
      type: 'BUY',
      size: 2.0,
      entryPrice: 2900.00,
      currentPrice: 2845.67,
      pnl: -108.66,
      pnlPercent: -1.87,
      timestamp: '2024-01-15T09:15:00Z',
      status: 'OPEN'
    }
  ], []);

  // Mock order book data
  const orderBook = useMemo(() => {
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];
    const currentPrice = marketData.find(m => m.symbol === selectedSymbol)?.price || 45000;
    
    for (let i = 0; i < 10; i++) {
      asks.push({
        price: currentPrice + (i + 1) * 10,
        size: Math.random() * 5 + 0.1,
        total: 0
      });
      bids.push({
        price: currentPrice - (i + 1) * 10,
        size: Math.random() * 5 + 0.1,
        total: 0
      });
    }
    
    return { asks: asks.reverse(), bids };
  }, [selectedSymbol, marketData]);

  // Generate chart data
  const chartData = useMemo(() => {
    const data = [];
    const basePrice = marketData.find(m => m.symbol === selectedSymbol)?.price || 45000;
    
    for (let i = 0; i < 100; i++) {
      const time = new Date(Date.now() - (100 - i) * 60000).toISOString();
      const price = basePrice + (Math.random() - 0.5) * 1000;
      data.push({
        time,
        price,
        volume: Math.random() * 1000000
      });
    }
    
    return data;
  }, [selectedSymbol, marketData]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Master': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'Elite': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'Pro': return 'bg-gradient-to-r from-green-500 to-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    if (!showPrivateData) return '***,***';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const placeOrder = () => {
    if (!orderAmount || (orderType !== 'market' && !orderPrice)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success(`${orderSide.toUpperCase()} order placed for ${orderAmount} ${selectedSymbol}`);
    setOrderAmount('');
    setOrderPrice('');
  };

  const closePosition = (positionId: string) => {
    toast.success('Position closed successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-blue-500"
                />
                {userProfile.verified && (
                  <CheckCircle className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-blue-500 bg-white rounded-full" />
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {userProfile.username}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className={`${getTierColor(userProfile.tier)} text-white text-xs`}>
                    <Crown className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    {userProfile.tier}
                  </Badge>
                  <span className="text-xs sm:text-sm text-gray-500">Rank #{userProfile.rank}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivateData(!showPrivateData)}
                className="flex-1 sm:flex-none px-2 sm:px-3"
              >
                {showPrivateData ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex-1 sm:flex-none px-2 sm:px-3"
              >
                {soundEnabled ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none px-2 sm:px-3">
                <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none px-2 sm:px-3">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['overview', 'trading', 'portfolio', 'social'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {formatCurrency(userProfile.totalProfit)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Profit</div>
                    <div className="text-xs text-green-600 mt-1">
                      +{userProfile.roi.toFixed(2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">
                      {formatCurrency(userProfile.accountBalance)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Balance</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Available
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {userProfile.winRate.toFixed(1)}%
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Win Rate</div>
                    <Progress value={userProfile.winRate} className="h-1 sm:h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                      {userProfile.profitFactor.toFixed(2)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Profit Factor</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Target: 1.6+
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">
                      {formatNumber(userProfile.followers)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatNumber(userProfile.copiers)} copiers
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold flex items-center justify-center gap-1">
                      {userProfile.reputation.toFixed(1)}
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Reputation</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {userProfile.totalTrades} trades
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userProfile.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Statistics Display */}
            <UserStatsDisplay />
            
            {/* Performance Dashboard */}
            <TradingPerformanceDashboard />
          </div>
        )}

        {/* Trading Tab */}
        {selectedTab === 'trading' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Trading Panel */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
              <TradingPanel />

            </div>

            {/* Trading Controls */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              {/* Order Form */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    Place Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  {/* Order Type */}
                  <div className="flex gap-2">
                    {(['market', 'limit', 'stop'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={orderType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setOrderType(type)}
                        className="flex-1 capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>

                  {/* Buy/Sell Toggle */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={orderSide === 'buy' ? 'default' : 'outline'}
                      onClick={() => setOrderSide('buy')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      BUY
                    </Button>
                    <Button
                      variant={orderSide === 'sell' ? 'default' : 'outline'}
                      onClick={() => setOrderSide('sell')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      SELL
                    </Button>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                    />
                  </div>

                  {/* Price Input (for limit/stop orders) */}
                  {orderType !== 'market' && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-1 sm:gap-2">
                    {['25%', '50%', '75%', '100%'].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const balance = userProfile.accountBalance;
                          const percentage = parseInt(percent) / 100;
                          setOrderAmount((balance * percentage).toFixed(2));
                        }}
                        className="text-xs px-2"
                      >
                        {percent}
                      </Button>
                    ))}
                  </div>

                  {/* Place Order Button */}
                  <Button
                    onClick={placeOrder}
                    className={`w-full ${
                      orderSide === 'buy'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Place {orderSide.toUpperCase()} Order
                  </Button>
                </CardContent>
              </Card>

              {/* Order Book */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Order Book
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {/* Asks */}
                    <div className="space-y-1">
                      {orderBook.asks.slice(0, 5).map((ask, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-red-600 font-mono">
                            ${ask.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            {ask.size.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Current Price */}
                    <div className="py-2 border-y border-gray-200 dark:border-gray-700">
                      <div className="text-center font-mono font-bold text-xs sm:text-sm">
                        ${marketData.find(m => m.symbol === selectedSymbol)?.price.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Bids */}
                    <div className="space-y-1">
                      {orderBook.bids.slice(0, 5).map((bid, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-green-600 font-mono">
                            ${bid.price.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            {bid.size.toFixed(4)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Open Positions */}
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                    Open Positions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {positions.map((position) => (
                      <div key={position.id} className="p-2 sm:p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={position.type === 'BUY' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {position.type}
                            </Badge>
                            <span className="font-medium text-xs sm:text-sm">{position.symbol}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => closePosition(position.id)}
                            className="px-2"
                          >
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-1 font-mono">{position.size}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Entry:</span>
                            <span className="ml-1 font-mono">
                              ${position.entryPrice.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>
                            <span className="ml-1 font-mono">
                              ${position.currentPrice.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">P&L:</span>
                            <span className={`ml-1 font-mono ${
                              position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {positions.length === 0 && (
                      <div className="text-center text-muted-foreground py-4 text-xs sm:text-sm">
                        No open positions
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {selectedTab === 'portfolio' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Portfolio management features coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Social Tab */}
        {selectedTab === 'social' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Social trading features coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}