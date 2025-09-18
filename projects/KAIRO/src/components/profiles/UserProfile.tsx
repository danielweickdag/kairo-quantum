'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Copy,
  Share2,
  Settings,
  Eye,
  ThumbsUp,
  MessageSquare,
  Crown,
  Shield,
  Zap,
  Globe,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  TrendingUpIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  userId?: string;
}

interface TradeHistory {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  profit: number;
  profitPercentage: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data - in real app, this would come from API
  const userData = {
    id: userId || 'user-123',
    name: 'Alex Thompson',
    username: '@alextrader',
    avatar: '/api/placeholder/150/150',
    bio: 'Professional trader with 8+ years experience in equity markets. Specializing in growth stocks and momentum trading strategies.',
    location: 'New York, NY',
    joinDate: 'January 2020',
    verified: true,
    tier: 'Pro',
    followers: 12847,
    following: 234,
    copiers: 1523,
    totalReturn: 156.7,
    monthlyReturn: 12.4,
    winRate: 73.2,
    totalTrades: 1247,
    portfolioValue: 284750,
    riskScore: 6.8,
    maxDrawdown: -8.3,
    sharpeRatio: 1.84,
    avgHoldTime: '12 days',
    successfulTrades: 913,
    topSector: 'Technology'
  };

  const recentTrades: TradeHistory[] = [
    {
      id: '1',
      symbol: 'AAPL',
      type: 'buy',
      amount: 50,
      price: 175.23,
      profit: 1247.50,
      profitPercentage: 14.2,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'TSLA',
      type: 'sell',
      amount: 25,
      price: 248.67,
      profit: -523.75,
      profitPercentage: -8.4,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      symbol: 'NVDA',
      type: 'buy',
      amount: 30,
      price: 421.89,
      profit: 2156.80,
      profitPercentage: 17.1,
      date: '2024-01-13',
      status: 'completed'
    }
  ];

  const portfolioHoldings: PortfolioHolding[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 150,
      currentPrice: 189.45,
      totalValue: 28417.50,
      dayChange: 2.34,
      dayChangePercent: 1.25,
      allocation: 18.7
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      shares: 85,
      currentPrice: 378.92,
      totalValue: 32208.20,
      dayChange: -4.67,
      dayChangePercent: -1.22,
      allocation: 21.2
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      shares: 45,
      currentPrice: 495.33,
      totalValue: 22289.85,
      dayChange: 12.45,
      dayChangePercent: 2.58,
      allocation: 14.7
    }
  ];

  const performanceMetrics = [
    {
      label: 'Total Return',
      value: `${userData.totalReturn}%`,
      change: '+12.4%',
      positive: true,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      label: 'Win Rate',
      value: `${userData.winRate}%`,
      change: '+2.1%',
      positive: true,
      icon: <Target className="w-4 h-4" />
    },
    {
      label: 'Sharpe Ratio',
      value: userData.sharpeRatio.toString(),
      change: '+0.12',
      positive: true,
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: 'Max Drawdown',
      value: `${userData.maxDrawdown}%`,
      change: '-1.2%',
      positive: true,
      icon: <ArrowDownRight className="w-4 h-4" />
    }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleCopyTrader = () => {
    // Handle copy trader logic
    console.log('Copy trader:', userData.username);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                    {userData.verified && (
                      <Shield className="w-6 h-6 text-blue-500" />
                    )}
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Crown className="w-3 h-3 mr-1" />
                      {userData.tier}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">{userData.username}</p>
                  <p className="text-gray-700 max-w-2xl">{userData.bio}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {userData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {userData.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 ml-auto">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollow}
                  className="flex items-center gap-2"
                >
                  {isFollowing ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCopyTrader}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  Copy Trader
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{userData.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{userData.copiers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Copiers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${userData.portfolioValue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Portfolio Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userData.totalTrades}</div>
                <div className="text-sm text-gray-500">Total Trades</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600 text-sm">{metric.label}</div>
                  <div className={cn(
                    "p-2 rounded-full",
                    metric.positive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {metric.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className={cn(
                  "text-sm flex items-center gap-1",
                  metric.positive ? "text-green-600" : "text-red-600"
                )}>
                  {metric.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Trading Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Successful Trades</span>
                      <span className="font-semibold">{userData.successfulTrades}/{userData.totalTrades}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Hold Time</span>
                      <span className="font-semibold">{userData.avgHoldTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk Score</span>
                      <Badge variant={userData.riskScore > 7 ? "destructive" : userData.riskScore > 5 ? "secondary" : "default"}>
                        {userData.riskScore}/10
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Top Sector</span>
                      <span className="font-semibold">{userData.topSector}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Return</span>
                      <span className="font-semibold text-green-600">+{userData.monthlyReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Return</span>
                      <span className="font-semibold text-green-600">+{userData.totalReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Win Rate</span>
                      <span className="font-semibold">{userData.winRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Max Drawdown</span>
                      <span className="font-semibold text-red-600">{userData.maxDrawdown}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Current Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioHoldings.map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">{holding.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{holding.symbol}</div>
                          <div className="text-sm text-gray-500">{holding.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${holding.totalValue.toLocaleString()}</div>
                        <div className={cn(
                          "text-sm flex items-center gap-1",
                          holding.dayChange >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {holding.dayChange >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {holding.dayChangePercent}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                          trade.type === 'buy' ? "bg-green-500" : "bg-red-500"
                        )}>
                          {trade.type === 'buy' ? 'B' : 'S'}
                        </div>
                        <div>
                          <div className="font-semibold">{trade.symbol}</div>
                          <div className="text-sm text-gray-500">{trade.amount} shares @ ${trade.price}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "font-semibold",
                          trade.profit >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </div>
                        <div className={cn(
                          "text-sm",
                          trade.profitPercentage >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {trade.profitPercentage >= 0 ? '+' : ''}{trade.profitPercentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Performance chart would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-2" />
                      <p>Risk analysis chart would be rendered here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;