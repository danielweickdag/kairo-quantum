'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Avatar component not available, using custom implementation
import {
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Award,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  ExternalLink,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Crown,
  Zap,
  Brain,
  Rocket,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Bell,
  BellOff,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  UserMinus,
  Settings,
  Edit,
  Camera,
  Upload,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Calculator,
  TrendingUp as TrendUp,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  verified: boolean
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  followers: number
  following: number
  totalReturn: number
  monthlyReturn: number
  winRate: number
  totalTrades: number
  copiers: number
  aum: number // Assets Under Management
  riskScore: number
  maxDrawdown: number
  sharpeRatio: number
  bio: string
  location: string
  joinedDate: string
  lastActive: string
  specialties: string[]
  socialLinks: {
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  isFollowing: boolean
  isCopying: boolean
  subscription: {
    price: number
    currency: string
    period: 'monthly' | 'yearly'
  }
  performance: {
    period: string
    return: number
    trades: number
    winRate: number
  }[]
  recentTrades: {
    id: string
    symbol: string
    type: 'buy' | 'sell'
    amount: number
    price: number
    profit: number
    timestamp: string
  }[]
  portfolio: {
    symbol: string
    allocation: number
    value: number
    change: number
  }[]
}

interface InvestorProfile {
  id: string
  name: string
  username: string
  avatar: string
  totalInvested: number
  totalReturn: number
  activeCopies: number
  portfolioValue: number
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  investmentGoals: string[]
  joinedDate: string
  lastActive: string
  copiedCreators: {
    creatorId: string
    creatorName: string
    allocation: number
    return: number
    startDate: string
  }[]
  performance: {
    period: string
    return: number
    invested: number
  }[]
}

const CreatorProfiles: React.FC = () => {
  const [activeTab, setActiveTab] = useState('creators')
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('totalReturn')
  const [filterTier, setFilterTier] = useState('all')
  const [showProfile, setShowProfile] = useState(false)

  // Mock data - in real app, this would come from API
  const [creators] = useState<Creator[]>([
    {
      id: '1',
      name: 'Alex Thompson',
      username: 'alextrader',
      avatar: '/avatars/alex.jpg',
      verified: true,
      tier: 'diamond',
      followers: 15420,
      following: 234,
      totalReturn: 156.7,
      monthlyReturn: 12.4,
      winRate: 78.5,
      totalTrades: 1247,
      copiers: 892,
      aum: 2450000,
      riskScore: 6.2,
      maxDrawdown: -8.3,
      sharpeRatio: 2.1,
      bio: 'Professional trader with 8+ years experience in crypto and forex markets. Specializing in swing trading and technical analysis.',
      location: 'New York, USA',
      joinedDate: '2020-03-15',
      lastActive: '2024-01-15T10:30:00Z',
      specialties: ['Crypto', 'Forex', 'Technical Analysis', 'Swing Trading'],
      socialLinks: {
        twitter: 'https://twitter.com/alextrader',
        linkedin: 'https://linkedin.com/in/alexthompson',
        youtube: 'https://youtube.com/alextrading'
      },
      isFollowing: false,
      isCopying: false,
      subscription: {
        price: 99,
        currency: 'USD',
        period: 'monthly'
      },
      performance: [
        { period: '1M', return: 12.4, trades: 45, winRate: 82.2 },
        { period: '3M', return: 34.7, trades: 128, winRate: 79.7 },
        { period: '6M', return: 67.3, trades: 256, winRate: 78.9 },
        { period: '1Y', return: 156.7, trades: 512, winRate: 78.5 }
      ],
      recentTrades: [
        {
          id: '1',
          symbol: 'BTC/USD',
          type: 'buy',
          amount: 0.5,
          price: 42500,
          profit: 1250,
          timestamp: '2024-01-15T09:30:00Z'
        },
        {
          id: '2',
          symbol: 'ETH/USD',
          type: 'sell',
          amount: 2.3,
          price: 2650,
          profit: 340,
          timestamp: '2024-01-14T15:45:00Z'
        }
      ],
      portfolio: [
        { symbol: 'BTC', allocation: 35, value: 857500, change: 2.4 },
        { symbol: 'ETH', allocation: 25, value: 612500, change: -1.2 },
        { symbol: 'SOL', allocation: 15, value: 367500, change: 5.7 },
        { symbol: 'USDC', allocation: 25, value: 612500, change: 0.0 }
      ]
    },
    {
      id: '2',
      name: 'Sarah Chen',
      username: 'sarahcrypto',
      avatar: '/avatars/sarah.jpg',
      verified: true,
      tier: 'platinum',
      followers: 8930,
      following: 156,
      totalReturn: 89.3,
      monthlyReturn: 8.7,
      winRate: 72.1,
      totalTrades: 892,
      copiers: 456,
      aum: 1230000,
      riskScore: 4.8,
      maxDrawdown: -12.1,
      sharpeRatio: 1.8,
      bio: 'DeFi specialist and yield farming expert. Focus on sustainable long-term growth strategies.',
      location: 'Singapore',
      joinedDate: '2021-01-20',
      lastActive: '2024-01-15T08:15:00Z',
      specialties: ['DeFi', 'Yield Farming', 'Long-term Growth'],
      socialLinks: {
        twitter: 'https://twitter.com/sarahcrypto',
        linkedin: 'https://linkedin.com/in/sarahchen'
      },
      isFollowing: true,
      isCopying: false,
      subscription: {
        price: 79,
        currency: 'USD',
        period: 'monthly'
      },
      performance: [
        { period: '1M', return: 8.7, trades: 32, winRate: 75.0 },
        { period: '3M', return: 23.1, trades: 89, winRate: 73.6 },
        { period: '6M', return: 45.8, trades: 178, winRate: 72.8 },
        { period: '1Y', return: 89.3, trades: 356, winRate: 72.1 }
      ],
      recentTrades: [],
      portfolio: []
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      username: 'mikeforex',
      avatar: '/avatars/mike.jpg',
      verified: false,
      tier: 'gold',
      followers: 3420,
      following: 89,
      totalReturn: 67.8,
      monthlyReturn: 6.2,
      winRate: 69.4,
      totalTrades: 567,
      copiers: 234,
      aum: 890000,
      riskScore: 5.5,
      maxDrawdown: -15.7,
      sharpeRatio: 1.5,
      bio: 'Forex trader with focus on major currency pairs and economic analysis.',
      location: 'London, UK',
      joinedDate: '2021-08-10',
      lastActive: '2024-01-14T16:20:00Z',
      specialties: ['Forex', 'Economic Analysis', 'Currency Pairs'],
      socialLinks: {
        twitter: 'https://twitter.com/mikeforex'
      },
      isFollowing: false,
      isCopying: true,
      subscription: {
        price: 59,
        currency: 'USD',
        period: 'monthly'
      },
      performance: [
        { period: '1M', return: 6.2, trades: 28, winRate: 71.4 },
        { period: '3M', return: 18.9, trades: 76, winRate: 70.3 },
        { period: '6M', return: 34.5, trades: 152, winRate: 69.7 },
        { period: '1Y', return: 67.8, trades: 304, winRate: 69.4 }
      ],
      recentTrades: [],
      portfolio: []
    }
  ])

  const [investorProfile] = useState<InvestorProfile>({
    id: 'investor1',
    name: 'John Investor',
    username: 'johninvestor',
    avatar: '/avatars/john.jpg',
    totalInvested: 50000,
    totalReturn: 23.4,
    activeCopies: 3,
    portfolioValue: 61700,
    riskTolerance: 'moderate',
    investmentGoals: ['Long-term Growth', 'Diversification', 'Passive Income'],
    joinedDate: '2023-06-15',
    lastActive: '2024-01-15T11:00:00Z',
    copiedCreators: [
      {
        creatorId: '1',
        creatorName: 'Alex Thompson',
        allocation: 40,
        return: 28.5,
        startDate: '2023-07-01'
      },
      {
        creatorId: '2',
        creatorName: 'Sarah Chen',
        allocation: 35,
        return: 19.2,
        startDate: '2023-08-15'
      },
      {
        creatorId: '3',
        creatorName: 'Mike Rodriguez',
        allocation: 25,
        return: 15.7,
        startDate: '2023-09-01'
      }
    ],
    performance: [
      { period: '1M', return: 2.1, invested: 50000 },
      { period: '3M', return: 8.7, invested: 50000 },
      { period: '6M', return: 18.3, invested: 50000 },
      { period: '1Y', return: 23.4, invested: 50000 }
    ]
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
      case 'platinum':
        return 'text-gray-300 bg-gray-500/20 border-gray-500/30'
      case 'gold':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'silver':
        return 'text-gray-400 bg-gray-600/20 border-gray-600/30'
      case 'bronze':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return <Crown className="w-4 h-4" />
      case 'platinum':
        return <Award className="w-4 h-4" />
      case 'gold':
        return <Star className="w-4 h-4" />
      case 'silver':
        return <Target className="w-4 h-4" />
      case 'bronze':
        return <Shield className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 3) return 'text-green-400'
    if (score <= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = filterTier === 'all' || creator.tier === filterTier
    return matchesSearch && matchesTier
  })

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'totalReturn':
        return b.totalReturn - a.totalReturn
      case 'followers':
        return b.followers - a.followers
      case 'winRate':
        return b.winRate - a.winRate
      case 'aum':
        return b.aum - a.aum
      default:
        return 0
    }
  })

  const handleFollowCreator = (creatorId: string) => {
    // In real app, this would make an API call
    console.log('Following creator:', creatorId)
  }

  const handleCopyCreator = (creatorId: string) => {
    // In real app, this would open copy trading modal
    console.log('Copying creator:', creatorId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Creator & Investor Profiles
            </h1>
            <p className="text-gray-300">
              Discover top traders, analyze performance, and manage your investment portfolio
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Become Creator
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="creators" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Top Creators
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="investor" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              My Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Top Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="all">All Tiers</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  <option value="totalReturn">Total Return</option>
                  <option value="followers">Followers</option>
                  <option value="winRate">Win Rate</option>
                  <option value="aum">AUM</option>
                </select>
              </div>
            </div>

            {/* Creators Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedCreators.map((creator) => (
                <Card key={creator.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl hover:bg-gray-800/70 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedCreator(creator)
                        setShowProfile(true)
                      }}>
                  <CardContent className="p-6">
                    {/* Creator Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{creator.name}</h3>
                            {creator.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">@{creator.username}</p>
                        </div>
                      </div>
                      
                      <Badge className={getTierColor(creator.tier)}>
                        {getTierIcon(creator.tier)}
                        <span className="ml-1 capitalize">{creator.tier}</span>
                      </Badge>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Total Return</p>
                        <p className={cn(
                          "text-lg font-bold",
                          creator.totalReturn >= 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {formatPercentage(creator.totalReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Win Rate</p>
                        <p className="text-lg font-bold text-white">
                          {creator.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Followers</p>
                        <p className="text-lg font-bold text-white">
                          {formatNumber(creator.followers)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">AUM</p>
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(creator.aum)}
                        </p>
                      </div>
                    </div>

                    {/* Risk Score */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm">Risk Score</span>
                      <span className={cn("font-semibold", getRiskColor(creator.riskScore))}>
                        {creator.riskScore}/10
                      </span>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {creator.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant={creator.isFollowing ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1",
                          creator.isFollowing 
                            ? "bg-blue-500 hover:bg-blue-600" 
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFollowCreator(creator.id)
                        }}
                      >
                        {creator.isFollowing ? (
                          <><UserMinus className="w-4 h-4 mr-1" />Unfollow</>
                        ) : (
                          <><UserPlus className="w-4 h-4 mr-1" />Follow</>
                        )}
                      </Button>
                      <Button
                        variant={creator.isCopying ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1",
                          creator.isCopying 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "border-gray-600 text-gray-300 hover:bg-gray-800"
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyCreator(creator.id)
                        }}
                      >
                        {creator.isCopying ? (
                          <><Check className="w-4 h-4 mr-1" />Copying</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" />Copy</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedCreators.slice(0, 10).map((creator, index) => (
                    <div key={creator.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                          index === 0 && "bg-yellow-500/20 text-yellow-400",
                          index === 1 && "bg-gray-500/20 text-gray-300",
                          index === 2 && "bg-orange-500/20 text-orange-400",
                          index > 2 && "bg-gray-600/20 text-gray-400"
                        )}>
                          {index + 1}
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-white">{creator.name}</p>
                            {creator.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-400" />
                            )}
                            <Badge className={getTierColor(creator.tier)}>
                              {getTierIcon(creator.tier)}
                              <span className="ml-1 capitalize">{creator.tier}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm">@{creator.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Total Return</p>
                          <p className={cn(
                            "font-bold",
                            creator.totalReturn >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {formatPercentage(creator.totalReturn)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Followers</p>
                          <p className="font-bold text-white">
                            {formatNumber(creator.followers)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">AUM</p>
                          <p className="font-bold text-white">
                            {formatCurrency(creator.aum)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investor Portfolio Tab */}
          <TabsContent value="investor" className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Portfolio Value</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(investorProfile.portfolioValue)}
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                      +{formatPercentage(investorProfile.totalReturn)}
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
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Return</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatPercentage(investorProfile.totalReturn)}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {formatCurrency(investorProfile.portfolioValue - investorProfile.totalInvested)} profit
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Copy className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Active Copies</p>
                    <p className="text-2xl font-bold text-white">
                      {investorProfile.activeCopies}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Copying {investorProfile.activeCopies} creators
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Risk Tolerance</p>
                    <p className="text-2xl font-bold text-white capitalize">
                      {investorProfile.riskTolerance}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Investment profile
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Copied Creators */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Copied Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investorProfile.copiedCreators.map((copy) => (
                    <div key={copy.creatorId} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {copy.creatorName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{copy.creatorName}</p>
                          <p className="text-gray-400 text-sm">
                            Started {new Date(copy.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Allocation</p>
                          <p className="font-bold text-white">{copy.allocation}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">Return</p>
                          <p className={cn(
                            "font-bold",
                            copy.return >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {formatPercentage(copy.return)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Creator Profile Modal */}
        {showProfile && selectedCreator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {selectedCreator.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-white">{selectedCreator.name}</h2>
                        {selectedCreator.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                        <Badge className={getTierColor(selectedCreator.tier)}>
                          {getTierIcon(selectedCreator.tier)}
                          <span className="ml-1 capitalize">{selectedCreator.tier}</span>
                        </Badge>
                      </div>
                      <p className="text-gray-400">@{selectedCreator.username}</p>
                      <p className="text-gray-300 mt-1">{selectedCreator.bio}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfile(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedCreator.performance.map((perf) => (
                    <div key={perf.period} className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">{perf.period}</p>
                      <p className={cn(
                        "text-lg font-bold",
                        perf.return >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {formatPercentage(perf.return)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {perf.trades} trades • {perf.winRate.toFixed(1)}% win rate
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    className={cn(
                      "flex-1",
                      selectedCreator.isFollowing 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    )}
                    onClick={() => handleFollowCreator(selectedCreator.id)}
                  >
                    {selectedCreator.isFollowing ? (
                      <><UserMinus className="w-4 h-4 mr-2" />Unfollow</>
                    ) : (
                      <><UserPlus className="w-4 h-4 mr-2" />Follow</>
                    )}
                  </Button>
                  <Button
                    className={cn(
                      "flex-1",
                      selectedCreator.isCopying 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    )}
                    onClick={() => handleCopyCreator(selectedCreator.id)}
                  >
                    {selectedCreator.isCopying ? (
                      <><Check className="w-4 h-4 mr-2" />Copying</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" />Copy Trader</>
                    )}
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
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

export default CreatorProfiles