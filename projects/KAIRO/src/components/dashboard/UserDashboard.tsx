'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  User,
  Settings,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Brain,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Crown,
  Star,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Calendar,
  Clock,
  Award,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Edit,
  Check,
  X,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Bookmark,
  Share,
  Heart,
  MessageSquare,
  Globe,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Wifi,
  Signal
} from 'lucide-react'
import { cn, formatCurrency as utilsFormatCurrency, formatPercent as utilsFormatPercent } from '@/lib/utils'

interface PortfolioData {
  totalValue: number
  todayChange: number
  todayChangePercent: number
  weekChange: number
  monthChange: number
  yearChange: number
}

interface SubscriptionData {
  plan: string
  status: string
  nextBilling: string
  amount: number
  features: string[]
  usage: {
    trades: { used: number; limit: number }
    copyTraders: { used: number; limit: number }
    aiInsights: { used: number; limit: number }
  }
}

interface TradeData {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  profit: number
  profitPercent: number
  timestamp: string
  status: 'completed' | 'pending' | 'cancelled'
}

interface CopyTraderData {
  id: string
  name: string
  avatar: string
  followers: number
  monthlyReturn: number
  totalReturn: number
  winRate: number
  riskScore: number
  isFollowing: boolean
  copiedAmount: number
}

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showBalance, setShowBalance] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  
  // Mock data - in real app, this would come from API
  const [portfolioData] = useState<PortfolioData>({
    totalValue: 125847.32,
    todayChange: 2847.21,
    todayChangePercent: 2.31,
    weekChange: 5234.12,
    monthChange: 12847.89,
    yearChange: 34521.67
  })
  
  const [subscriptionData] = useState<SubscriptionData>({
    plan: 'Pro Annual',
    status: 'active',
    nextBilling: '2024-12-15',
    amount: 89.99,
    features: [
      'Unlimited trades',
      'Follow up to 50 traders',
      'Advanced AI insights',
      'Priority support',
      'Advanced analytics',
      'Risk management tools'
    ],
    usage: {
      trades: { used: 1247, limit: -1 },
      copyTraders: { used: 12, limit: 50 },
      aiInsights: { used: 89, limit: -1 }
    }
  })
  
  const [recentTrades] = useState<TradeData[]>([
    {
      id: '1',
      symbol: 'BTC/USD',
      type: 'buy',
      amount: 0.5,
      price: 43250.00,
      profit: 1247.50,
      profitPercent: 5.76,
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      symbol: 'ETH/USD',
      type: 'sell',
      amount: 2.3,
      price: 2650.00,
      profit: -234.12,
      profitPercent: -3.84,
      timestamp: '2024-01-15T09:15:00Z',
      status: 'completed'
    },
    {
      id: '3',
      symbol: 'AAPL',
      type: 'buy',
      amount: 50,
      price: 185.50,
      profit: 425.00,
      profitPercent: 4.58,
      timestamp: '2024-01-14T16:45:00Z',
      status: 'completed'
    }
  ])
  
  const [copyTraders] = useState<CopyTraderData[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'SC',
      followers: 12847,
      monthlyReturn: 24.5,
      totalReturn: 156.7,
      winRate: 78.5,
      riskScore: 6.2,
      isFollowing: true,
      copiedAmount: 5000
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      avatar: 'MR',
      followers: 8934,
      monthlyReturn: 18.3,
      totalReturn: 134.2,
      winRate: 82.1,
      riskScore: 4.8,
      isFollowing: true,
      copiedAmount: 3000
    },
    {
      id: '3',
      name: 'Emily Watson',
      avatar: 'EW',
      followers: 15623,
      monthlyReturn: 31.2,
      totalReturn: 203.4,
      winRate: 75.9,
      riskScore: 7.1,
      isFollowing: false,
      copiedAmount: 0
    }
  ])
  
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2023-06-15',
    verified: true,
    twoFactorEnabled: true
  })

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00'
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(amount)
    } catch (error) {
      return '$0.00'
    }
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, {userProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-300">
              Here&apos;s your trading overview for today
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Trade
            </Button>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white"
                >
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">
                  {showBalance ? formatCurrency(portfolioData.totalValue) : '••••••'}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">
                    {formatPercent(portfolioData.todayChangePercent)}
                  </span>
                  <span className="text-gray-400 text-sm ml-1">today</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Today&apos;s P&L</p>
                <p className="text-2xl font-bold text-green-400">
                  {showBalance ? formatCurrency(portfolioData.todayChange) : '••••••'}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {formatPercent(portfolioData.todayChangePercent)} from yesterday
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {copyTraders.filter(t => t.isFollowing).length} Following
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Copy Trading</p>
                <p className="text-2xl font-bold text-white">
                  {copyTraders.filter(t => t.isFollowing).length} Traders
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {formatCurrency(copyTraders.reduce((sum, t) => sum + t.copiedAmount, 0))} allocated
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-orange-400" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {subscriptionData.plan}
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Subscription</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(subscriptionData.amount)}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Next billing: {formatDate(subscriptionData.nextBilling)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Recent Trades
            </TabsTrigger>
            <TabsTrigger value="copy-trading" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Copy Trading
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Crown className="w-4 h-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Portfolio Performance</span>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">1W</p>
                        <p className="text-lg font-semibold text-green-400">
                          {formatPercent(4.2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">1M</p>
                        <p className="text-lg font-semibold text-green-400">
                          {formatPercent(12.8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">1Y</p>
                        <p className="text-lg font-semibold text-green-400">
                          {formatPercent(38.5)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Mock chart area */}
                    <div className="h-48 bg-gray-900/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Performance Chart</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* AI Insights */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 text-purple-400 mr-2" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-purple-300 font-semibold mb-1">Market Opportunity</p>
                          <p className="text-gray-300 text-sm">
                            Strong bullish momentum detected in BTC. Consider increasing allocation by 5-10%.
                          </p>
                          <Badge className="mt-2 bg-purple-500/30 text-purple-300 border-purple-500/50">
                            92% Confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-blue-300 font-semibold mb-1">Risk Alert</p>
                          <p className="text-gray-300 text-sm">
                            Your portfolio concentration in tech stocks is above recommended levels.
                          </p>
                          <Badge className="mt-2 bg-blue-500/30 text-blue-300 border-blue-500/50">
                            Medium Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Trades Tab */}
          <TabsContent value="trades" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Trades</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          trade.type === 'buy' ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                          {trade.type === 'buy' ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{trade.symbol}</p>
                          <p className="text-gray-400 text-sm">
                            {trade.type.toUpperCase()} {trade.amount} @ {formatCurrency(trade.price)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          trade.profit >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                        </p>
                        <p className={cn(
                          "text-sm",
                          trade.profit >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatPercent(trade.profitPercent)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={cn(
                          trade.status === 'completed' && "bg-green-500/20 text-green-400 border-green-500/30",
                          trade.status === 'pending' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          trade.status === 'cancelled' && "bg-red-500/20 text-red-400 border-red-500/30"
                        )}>
                          {trade.status}
                        </Badge>
                        <p className="text-gray-400 text-sm mt-1">
                          {formatDate(trade.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Copy Trading Tab */}
          <TabsContent value="copy-trading" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Copy Trading Portfolio</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Find Traders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {copyTraders.map((trader) => (
                    <Card key={trader.id} className="bg-gray-900/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {trader.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{trader.name}</p>
                            <p className="text-gray-400 text-sm">{trader.followers.toLocaleString()} followers</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">Monthly Return</p>
                            <p className="text-green-400 font-semibold">{formatPercent(trader.monthlyReturn)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Win Rate</p>
                            <p className="text-white font-semibold">{trader.winRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Total Return</p>
                            <p className="text-green-400 font-semibold">{formatPercent(trader.totalReturn)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Risk Score</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      i <= trader.riskScore ? "bg-orange-400" : "bg-gray-600"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-orange-400 text-sm">{trader.riskScore}/10</span>
                            </div>
                          </div>
                        </div>
                        
                        {trader.isFollowing ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Copied Amount</span>
                              <span className="text-white font-semibold">{formatCurrency(trader.copiedAmount)}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                                Unfollow
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Follow Trader
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Plan */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 text-orange-400 mr-2" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white">{subscriptionData.plan}</p>
                        <p className="text-gray-400">{formatCurrency(subscriptionData.amount)}/year</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {subscriptionData.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="font-semibold text-white">Features Included:</p>
                      {subscriptionData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Next billing date</span>
                        <span className="text-white">{formatDate(subscriptionData.nextBilling)}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1 border-gray-600 text-gray-300">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Update Payment
                        </Button>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                          Cancel Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Usage Statistics */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Trades This Month</span>
                        <span className="text-white font-semibold">
                          {subscriptionData.usage.trades.used.toLocaleString()}
                          {subscriptionData.usage.trades.limit > 0 && ` / ${subscriptionData.usage.trades.limit.toLocaleString()}`}
                        </span>
                      </div>
                      {subscriptionData.usage.trades.limit > 0 && (
                        <Progress 
                          value={(subscriptionData.usage.trades.used / subscriptionData.usage.trades.limit) * 100} 
                          className="h-2"
                        />
                      )}
                      <p className="text-gray-400 text-sm mt-1">
                        {subscriptionData.usage.trades.limit === -1 ? 'Unlimited' : `${subscriptionData.usage.trades.limit - subscriptionData.usage.trades.used} remaining`}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">Copy Traders</span>
                        <span className="text-white font-semibold">
                          {subscriptionData.usage.copyTraders.used} / {subscriptionData.usage.copyTraders.limit}
                        </span>
                      </div>
                      <Progress 
                        value={(subscriptionData.usage.copyTraders.used / subscriptionData.usage.copyTraders.limit) * 100} 
                        className="h-2"
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        {subscriptionData.usage.copyTraders.limit - subscriptionData.usage.copyTraders.used} slots available
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300">AI Insights Used</span>
                        <span className="text-white font-semibold">
                          {subscriptionData.usage.aiInsights.used}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Unlimited AI insights included
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white">{userProfile.name}</p>
                        <p className="text-gray-400">Member since {formatDate(userProfile.joinDate)}</p>
                        {userProfile.verified && (
                          <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Email</p>
                          <p className="text-white">{userProfile.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white">{userProfile.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Location</p>
                          <p className="text-white">{userProfile.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="flex space-x-2 pt-4 border-t border-gray-700">
                        <Button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          <Check className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-600 text-gray-300">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Settings */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 text-green-400 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold">Two-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <Badge className={cn(
                        userProfile.twoFactorEnabled 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      )}>
                        {userProfile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Key className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Manage 2FA
                      </Button>
                      
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Download className="w-4 h-4 mr-2" />
                        Download Account Data
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-400 font-semibold">Danger Zone</span>
                      </div>
                      <Button variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default UserDashboard