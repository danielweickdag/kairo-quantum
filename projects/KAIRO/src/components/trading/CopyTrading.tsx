'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  SortDesc,
  Eye,
  Copy,
  Settings,
  Plus,
  Minus,
  DollarSign,
  Target,
  Shield,
  Award,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Clock,
  Globe,
  Smartphone,
  Mail,
  ExternalLink,
  Heart,
  MessageSquare,
  Share,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Info,
  Crown,
  Zap,
  Brain,
  Rocket,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  Download,
  Upload,
  Edit,
  X,
  Check,
  Lock,
  Unlock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Trader {
  id: string
  name: string
  username: string
  avatar: string
  verified: boolean
  premium: boolean
  followers: number
  following: number
  totalReturn: number
  monthlyReturn: number
  weeklyReturn: number
  winRate: number
  totalTrades: number
  avgHoldTime: string
  riskScore: number
  maxDrawdown: number
  sharpeRatio: number
  copiers: number
  aum: number // Assets Under Management
  joinDate: string
  lastActive: string
  bio: string
  strategies: string[]
  markets: string[]
  isFollowing: boolean
  copyAmount: number
  rating: number
  reviews: number
  country: string
  languages: string[]
  socialLinks: {
    twitter?: string
    linkedin?: string
    telegram?: string
  }
}

interface TradeHistory {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  entryPrice: number
  exitPrice?: number
  profit: number
  profitPercent: number
  openTime: string
  closeTime?: string
  status: 'open' | 'closed' | 'cancelled'
}

interface CopySettings {
  traderId: string
  copyAmount: number
  maxRiskPerTrade: number
  stopLoss: number
  takeProfit: number
  copyRatio: number
  autoRebalance: boolean
  maxOpenTrades: number
  allowedMarkets: string[]
}

const CopyTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('return')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [copyAmount, setCopyAmount] = useState(1000)

  // Mock data - in real app, this would come from API
  const [traders] = useState<Trader[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      username: 'sarahtrader',
      avatar: 'SC',
      verified: true,
      premium: true,
      followers: 12847,
      following: 234,
      totalReturn: 156.7,
      monthlyReturn: 24.5,
      weeklyReturn: 8.3,
      winRate: 78.5,
      totalTrades: 1247,
      avgHoldTime: '3.2 days',
      riskScore: 6.2,
      maxDrawdown: 12.4,
      sharpeRatio: 2.1,
      copiers: 3421,
      aum: 2450000,
      joinDate: '2022-03-15',
      lastActive: '2024-01-15T10:30:00Z',
      bio: 'Professional trader with 8+ years experience in crypto and forex markets. Specializing in swing trading and technical analysis.',
      strategies: ['Swing Trading', 'Technical Analysis', 'Risk Management'],
      markets: ['Crypto', 'Forex', 'Stocks'],
      isFollowing: true,
      copyAmount: 5000,
      rating: 4.8,
      reviews: 234,
      country: 'Singapore',
      languages: ['English', 'Mandarin'],
      socialLinks: {
        twitter: 'https://twitter.com/sarahtrader',
        linkedin: 'https://linkedin.com/in/sarahchen'
      }
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      username: 'cryptoking',
      avatar: 'MR',
      verified: true,
      premium: false,
      followers: 8934,
      following: 156,
      totalReturn: 134.2,
      monthlyReturn: 18.3,
      weeklyReturn: 5.7,
      winRate: 82.1,
      totalTrades: 892,
      avgHoldTime: '1.8 days',
      riskScore: 4.8,
      maxDrawdown: 8.9,
      sharpeRatio: 1.9,
      copiers: 2156,
      aum: 1890000,
      joinDate: '2021-11-22',
      lastActive: '2024-01-15T09:15:00Z',
      bio: 'Crypto enthusiast and day trader. Focus on momentum trading and market psychology.',
      strategies: ['Day Trading', 'Momentum', 'Scalping'],
      markets: ['Crypto', 'DeFi'],
      isFollowing: true,
      copyAmount: 3000,
      rating: 4.6,
      reviews: 187,
      country: 'United States',
      languages: ['English', 'Spanish'],
      socialLinks: {
        twitter: 'https://twitter.com/cryptoking',
        telegram: 'https://t.me/cryptoking'
      }
    },
    {
      id: '3',
      name: 'Emily Watson',
      username: 'emilyinvests',
      avatar: 'EW',
      verified: true,
      premium: true,
      followers: 15623,
      following: 89,
      totalReturn: 203.4,
      monthlyReturn: 31.2,
      weeklyReturn: 12.1,
      winRate: 75.9,
      totalTrades: 2134,
      avgHoldTime: '5.7 days',
      riskScore: 7.1,
      maxDrawdown: 15.2,
      sharpeRatio: 2.4,
      copiers: 4892,
      aum: 3670000,
      joinDate: '2020-08-10',
      lastActive: '2024-01-15T11:45:00Z',
      bio: 'Institutional trader turned retail educator. Specializing in algorithmic trading and portfolio optimization.',
      strategies: ['Algorithmic Trading', 'Portfolio Optimization', 'Quantitative Analysis'],
      markets: ['Stocks', 'Options', 'Futures'],
      isFollowing: false,
      copyAmount: 0,
      rating: 4.9,
      reviews: 312,
      country: 'United Kingdom',
      languages: ['English'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilywatson',
        twitter: 'https://twitter.com/emilyinvests'
      }
    },
    {
      id: '4',
      name: 'Alex Kim',
      username: 'alexquant',
      avatar: 'AK',
      verified: false,
      premium: false,
      followers: 3421,
      following: 67,
      totalReturn: 89.3,
      monthlyReturn: 12.7,
      weeklyReturn: 3.2,
      winRate: 68.4,
      totalTrades: 567,
      avgHoldTime: '2.1 days',
      riskScore: 5.5,
      maxDrawdown: 11.8,
      sharpeRatio: 1.6,
      copiers: 892,
      aum: 567000,
      joinDate: '2023-02-28',
      lastActive: '2024-01-14T16:20:00Z',
      bio: 'Quantitative analyst with background in machine learning. Building systematic trading strategies.',
      strategies: ['Quantitative Analysis', 'Machine Learning', 'Statistical Arbitrage'],
      markets: ['Crypto', 'Stocks'],
      isFollowing: false,
      copyAmount: 0,
      rating: 4.3,
      reviews: 45,
      country: 'South Korea',
      languages: ['English', 'Korean'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/alexkim'
      }
    }
  ])

  const [myFollowing] = useState<Trader[]>(
    traders.filter(trader => trader.isFollowing)
  )

  const [tradeHistory] = useState<TradeHistory[]>([
    {
      id: '1',
      symbol: 'BTC/USD',
      type: 'buy',
      amount: 0.5,
      entryPrice: 43250.00,
      exitPrice: 45123.50,
      profit: 936.75,
      profitPercent: 4.33,
      openTime: '2024-01-10T09:30:00Z',
      closeTime: '2024-01-12T14:15:00Z',
      status: 'closed'
    },
    {
      id: '2',
      symbol: 'ETH/USD',
      type: 'buy',
      amount: 2.0,
      entryPrice: 2650.00,
      profit: 234.50,
      profitPercent: 4.42,
      openTime: '2024-01-13T11:20:00Z',
      status: 'open'
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trader.username.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filterBy === 'verified') return matchesSearch && trader.verified
    if (filterBy === 'premium') return matchesSearch && trader.premium
    if (filterBy === 'high-return') return matchesSearch && trader.monthlyReturn > 20
    
    return matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'return':
        return b.monthlyReturn - a.monthlyReturn
      case 'followers':
        return b.followers - a.followers
      case 'winrate':
        return b.winRate - a.winRate
      case 'aum':
        return b.aum - a.aum
      default:
        return 0
    }
  })

  const TraderCard: React.FC<{ trader: Trader; showDetails?: boolean }> = ({ trader, showDetails = false }) => (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {trader.avatar}
              </div>
              {trader.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-white">{trader.name}</p>
                {trader.premium && (
                  <Crown className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <p className="text-gray-400 text-sm">@{trader.username}</p>
              <div className="flex items-center space-x-1 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-3 h-3",
                      i <= Math.floor(trader.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                    )} 
                  />
                ))}
                <span className="text-gray-400 text-xs ml-1">({trader.reviews})</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTrader(trader)}
              className="text-gray-400 hover:text-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Monthly Return</p>
            <p className={cn(
              "text-lg font-semibold",
              trader.monthlyReturn >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {formatPercent(trader.monthlyReturn)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-lg font-semibold text-white">{trader.winRate}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Followers</p>
            <p className="text-lg font-semibold text-white">{formatNumber(trader.followers)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">AUM</p>
            <p className="text-lg font-semibold text-white">{formatCurrency(trader.aum)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Risk Score</p>
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
        
        <div className="flex items-center space-x-2 mb-4">
          {trader.strategies.slice(0, 2).map((strategy, index) => (
            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
              {strategy}
            </Badge>
          ))}
          {trader.strategies.length > 2 && (
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              +{trader.strategies.length - 2}
            </Badge>
          )}
        </div>
        
        {trader.isFollowing ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Copy Amount</span>
              <span className="text-white font-semibold">{formatCurrency(trader.copyAmount)}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Unfollow
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={() => {
              setSelectedTrader(trader)
              setShowCopyModal(true)
            }}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Trader
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Copy Trading
            </h1>
            <p className="text-gray-300">
              Follow and copy successful traders automatically
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Become a Trader
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Following</p>
                <p className="text-2xl font-bold text-white">{myFollowing.length} Traders</p>
                <p className="text-gray-400 text-sm mt-2">
                  {formatCurrency(myFollowing.reduce((sum, t) => sum + t.copyAmount, 0))} allocated
                </p>
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
                  +18.5%
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Profit</p>
                <p className="text-2xl font-bold text-green-400">+$12,847</p>
                <p className="text-gray-400 text-sm mt-2">This month</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Excellent
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-white">76.8%</p>
                <p className="text-gray-400 text-sm mt-2">Average across all traders</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  24 Trades
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Trades</p>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-gray-400 text-sm mt-2">Across all copied traders</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="discover" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="following" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Following ({myFollowing.length})
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Trade History
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search traders by name or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="return">Sort by Return</option>
                      <option value="followers">Sort by Followers</option>
                      <option value="winrate">Sort by Win Rate</option>
                      <option value="aum">Sort by AUM</option>
                    </select>
                    
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="bg-gray-900/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="all">All Traders</option>
                      <option value="verified">Verified Only</option>
                      <option value="premium">Premium Only</option>
                      <option value="high-return">High Return (&gt;20%)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Traders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTraders.map((trader) => (
                <TraderCard key={trader.id} trader={trader} />
              ))}
            </div>
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myFollowing.map((trader) => (
                <TraderCard key={trader.id} trader={trader} showDetails={true} />
              ))}
            </div>
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="trades" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Copy Trade History</CardTitle>
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
                  {tradeHistory.map((trade) => (
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
                            {trade.type.toUpperCase()} {trade.amount} @ ${trade.entryPrice.toLocaleString()}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Opened: {formatDate(trade.openTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          trade.profit >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
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
                          trade.status === 'closed' && "bg-gray-500/20 text-gray-400 border-gray-500/30",
                          trade.status === 'open' && "bg-green-500/20 text-green-400 border-green-500/30",
                          trade.status === 'cancelled' && "bg-red-500/20 text-red-400 border-red-500/30"
                        )}>
                          {trade.status}
                        </Badge>
                        {trade.closeTime && (
                          <p className="text-gray-400 text-sm mt-1">
                            Closed: {formatDate(trade.closeTime)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 text-yellow-400 mr-2" />
                  Top Performers This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traders
                    .sort((a, b) => b.monthlyReturn - a.monthlyReturn)
                    .slice(0, 10)
                    .map((trader, index) => (
                    <div key={trader.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          index === 0 && "bg-yellow-500 text-black",
                          index === 1 && "bg-gray-400 text-black",
                          index === 2 && "bg-orange-600 text-white",
                          index > 2 && "bg-gray-600 text-white"
                        )}>
                          {index + 1}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {trader.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-white">{trader.name}</p>
                            {trader.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            )}
                            {trader.premium && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{formatNumber(trader.followers)} followers</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">
                          {formatPercent(trader.monthlyReturn)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {trader.winRate}% win rate
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        onClick={() => {
                          setSelectedTrader(trader)
                          setShowCopyModal(true)
                        }}
                      >
                        {trader.isFollowing ? 'Following' : 'Copy'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Copy Modal */}
        {showCopyModal && selectedTrader && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Copy {selectedTrader.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCopyModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Copy Amount</label>
                  <Input
                    type="number"
                    value={copyAmount}
                    onChange={(e) => setCopyAmount(Number(e.target.value))}
                    className="bg-gray-900/50 border-gray-600 text-white"
                    placeholder="Enter amount to copy"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Minimum: $100 • Maximum: $50,000
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Monthly Return</span>
                    <span className="text-green-400 font-semibold">
                      {formatPercent(selectedTrader.monthlyReturn)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Win Rate</span>
                    <span className="text-white font-semibold">{selectedTrader.winRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Risk Score</span>
                    <span className="text-orange-400 font-semibold">{selectedTrader.riskScore}/10</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300"
                    onClick={() => setShowCopyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    onClick={() => {
                      // Handle copy logic here
                      setShowCopyModal(false)
                    }}
                  >
                    Start Copying
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default CopyTrading