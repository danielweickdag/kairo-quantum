'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Copy, 
  Pause, 
  Play, 
  Eye, 
  Filter,
  Award,
  Shield,
  Clock,
  Target,
  ChevronDown
} from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  followers: number;
  totalReturn: number;
  monthlyReturn: number;
  winRate: number;
  maxDrawdown: number;
  avgTradeDuration: string;
  riskScore: number;
  totalTrades: number;
  copiers: number;
  minCopyAmount: number;
  description: string;
  tags: string[];
  isFollowing: boolean;
  isCopying: boolean;
}

interface CopyPosition {
  id: string;
  trader: Trader;
  allocatedAmount: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  activeTrades: number;
  startDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'stopped';
}

const MOCK_TRADERS: Trader[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: '/api/placeholder/40/40',
    verified: true,
    rating: 4.8,
    followers: 2847,
    totalReturn: 156.7,
    monthlyReturn: 12.4,
    winRate: 73,
    maxDrawdown: 8.2,
    avgTradeDuration: '2.3 days',
    riskScore: 6,
    totalTrades: 1247,
    copiers: 342,
    minCopyAmount: 500,
    description: 'Swing trader focusing on tech stocks and crypto. 5+ years experience.',
    tags: ['Swing Trading', 'Tech Stocks', 'Crypto'],
    isFollowing: true,
    isCopying: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
    verified: true,
    rating: 4.6,
    followers: 1923,
    totalReturn: 89.3,
    monthlyReturn: 8.7,
    winRate: 68,
    maxDrawdown: 12.1,
    avgTradeDuration: '5.1 days',
    riskScore: 4,
    totalTrades: 892,
    copiers: 156,
    minCopyAmount: 1000,
    description: 'Conservative value investor with focus on dividend stocks.',
    tags: ['Value Investing', 'Dividends', 'Blue Chip'],
    isFollowing: false,
    isCopying: false
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    avatar: '/api/placeholder/40/40',
    verified: false,
    rating: 4.2,
    followers: 756,
    totalReturn: 234.1,
    monthlyReturn: 18.9,
    winRate: 61,
    maxDrawdown: 22.3,
    avgTradeDuration: '1.2 days',
    riskScore: 8,
    totalTrades: 2156,
    copiers: 89,
    minCopyAmount: 250,
    description: 'Day trader specializing in momentum and breakout strategies.',
    tags: ['Day Trading', 'Momentum', 'High Frequency'],
    isFollowing: false,
    isCopying: false
  }
];

const MOCK_POSITIONS: CopyPosition[] = [
  {
    id: '1',
    trader: MOCK_TRADERS[0],
    allocatedAmount: 5000,
    currentValue: 5620,
    profit: 620,
    profitPercentage: 12.4,
    activeTrades: 3,
    startDate: '2024-01-15',
    riskLevel: 'medium',
    status: 'active'
  },
  {
    id: '2',
    trader: MOCK_TRADERS[1],
    allocatedAmount: 3000,
    currentValue: 3261,
    profit: 261,
    profitPercentage: 8.7,
    activeTrades: 1,
    startDate: '2024-02-01',
    riskLevel: 'low',
    status: 'active'
  }
];

export default function CopyTradingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalReturn');
  const [filterRisk, setFilterRisk] = useState('all');
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [copyAmount, setCopyAmount] = useState('');
  const [positions, setPositions] = useState<CopyPosition[]>(MOCK_POSITIONS);

  const filteredTraders = MOCK_TRADERS.filter(trader => {
    const matchesSearch = trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trader.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = filterRisk === 'all' || 
                       (filterRisk === 'low' && trader.riskScore <= 3) ||
                       (filterRisk === 'medium' && trader.riskScore > 3 && trader.riskScore <= 6) ||
                       (filterRisk === 'high' && trader.riskScore > 6);
    return matchesSearch && matchesRisk;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'totalReturn': return b.totalReturn - a.totalReturn;
      case 'monthlyReturn': return b.monthlyReturn - a.monthlyReturn;
      case 'winRate': return b.winRate - a.winRate;
      case 'followers': return b.followers - a.followers;
      default: return 0;
    }
  });

  const toggleCopyTrader = (trader: Trader) => {
    if (trader.isCopying) {
      // Stop copying
      setPositions(prev => prev.filter(pos => pos.trader.id !== trader.id));
    } else {
      // Start copying
      const amount = parseFloat(copyAmount) || trader.minCopyAmount;
      const newPosition: CopyPosition = {
        id: `pos-${Date.now()}`,
        trader,
        allocatedAmount: amount,
        currentValue: amount,
        profit: 0,
        profitPercentage: 0,
        activeTrades: 0,
        startDate: new Date().toISOString().split('T')[0],
        riskLevel: trader.riskScore <= 3 ? 'low' : trader.riskScore <= 6 ? 'medium' : 'high',
        status: 'active'
      };
      setPositions(prev => [...prev, newPosition]);
    }
    
    // Update trader copy status
    MOCK_TRADERS.forEach(t => {
      if (t.id === trader.id) {
        t.isCopying = !t.isCopying;
      }
    });
  };

  const togglePositionStatus = (positionId: string) => {
    setPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { ...pos, status: pos.status === 'active' ? 'paused' : 'active' }
        : pos
    ));
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 3) return 'text-green-600 bg-green-100';
    if (riskScore <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLabel = (riskScore: number) => {
    if (riskScore <= 3) return 'Low Risk';
    if (riskScore <= 6) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Copy Trading</h2>
          <p className="text-gray-600">Discover and copy successful traders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Traders</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search traders by name or strategy..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48">
                      Sort by: {sortBy === 'totalReturn' ? 'Total Return' : sortBy === 'monthlyReturn' ? 'Monthly Return' : sortBy === 'winRate' ? 'Win Rate' : 'Followers'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('totalReturn')}>Total Return</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('monthlyReturn')}>Monthly Return</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('winRate')}>Win Rate</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('followers')}>Followers</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="w-40">
                       {filterRisk === 'all' ? 'All Risk' : filterRisk === 'low' ? 'Low Risk' : filterRisk === 'medium' ? 'Medium Risk' : 'High Risk'}
                       <ChevronDown className="ml-2 h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent>
                     <DropdownMenuItem onClick={() => setFilterRisk('all')}>All Risk</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterRisk('low')}>Low Risk</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterRisk('medium')}>Medium Risk</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setFilterRisk('high')}>High Risk</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Traders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTraders.map((trader) => (
              <Card key={trader.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{trader.name}</h3>
                          {trader.verified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{trader.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getRiskColor(trader.riskScore)}>
                      {getRiskLabel(trader.riskScore)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{trader.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {trader.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Return</div>
                      <div className="font-semibold text-green-600">+{trader.totalReturn}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Monthly Return</div>
                      <div className="font-semibold text-green-600">+{trader.monthlyReturn}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Win Rate</div>
                      <div className="font-semibold">{trader.winRate}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Max Drawdown</div>
                      <div className="font-semibold text-red-600">-{trader.maxDrawdown}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{trader.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Copy className="w-4 h-4" />
                      <span>{trader.copiers} copiers</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-gray-600">Min. Copy Amount</div>
                    <div className="font-semibold">${trader.minCopyAmount}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTrader(trader)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      variant={trader.isCopying ? 'destructive' : 'default'}
                      onClick={() => toggleCopyTrader(trader)}
                    >
                      {trader.isCopying ? 'Stop Copy' : 'Copy'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Invested</p>
                    <p className="text-2xl font-bold">${positions.reduce((sum, pos) => sum + pos.allocatedAmount, 0).toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Value</p>
                    <p className="text-2xl font-bold">${positions.reduce((sum, pos) => sum + pos.currentValue, 0).toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Profit</p>
                    <p className="text-2xl font-bold text-green-600">+${positions.reduce((sum, pos) => sum + pos.profit, 0).toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Positions</p>
                    <p className="text-2xl font-bold">{positions.filter(pos => pos.status === 'active').length}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Positions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Copy Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position) => (
                  <div key={position.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={position.trader.avatar} />
                          <AvatarFallback>{position.trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{position.trader.name}</h4>
                          <p className="text-sm text-gray-600">Started {position.startDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                          {position.status}
                        </Badge>
                        <Badge className={getRiskColor(position.trader.riskScore)}>
                          {getRiskLabel(position.trader.riskScore)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Invested</div>
                        <div className="font-semibold">${position.allocatedAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Current Value</div>
                        <div className="font-semibold">${position.currentValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Profit/Loss</div>
                        <div className={`font-semibold ${
                          position.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {position.profit >= 0 ? '+' : ''}${position.profit.toLocaleString()} ({position.profitPercentage >= 0 ? '+' : ''}{position.profitPercentage}%)
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Active Trades</div>
                        <div className="font-semibold">{position.activeTrades}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => togglePositionStatus(position.id)}
                        >
                          {position.status === 'active' ? (
                            <><Pause className="w-4 h-4 mr-1" /> Pause</>
                          ) : (
                            <><Play className="w-4 h-4 mr-1" /> Resume</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {positions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Copy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active copy positions</p>
                    <p className="text-sm">Start copying traders to see your positions here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Return</span>
                    <span className="font-semibold text-green-600">+{(
                      positions.reduce((sum, pos) => sum + pos.profit, 0) / 
                      positions.reduce((sum, pos) => sum + pos.allocatedAmount, 0) * 100
                    ).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Performing Trader</span>
                    <span className="font-semibold">{positions.sort((a, b) => b.profitPercentage - a.profitPercentage)[0]?.trader.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Risk Score</span>
                    <span className="font-semibold">{(
                      positions.reduce((sum, pos) => sum + pos.trader.riskScore, 0) / positions.length
                    ).toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['low', 'medium', 'high'].map((risk) => {
                    const count = positions.filter(pos => pos.riskLevel === risk).length;
                    const percentage = positions.length > 0 ? (count / positions.length) * 100 : 0;
                    return (
                      <div key={risk}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{risk} Risk</span>
                          <span>{count} positions</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}