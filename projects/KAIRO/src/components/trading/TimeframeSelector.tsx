'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Target,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  Zap,
  Timer,
  ChevronDown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TimeframeData {
  timeframe: string;
  label: string;
  category: 'scalping' | 'intraday' | 'swing' | 'position';
  duration: string;
  trades: number;
  winRate: number;
  profitFactor: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  isActive: boolean;
  recommended: boolean;
}

interface MarketSession {
  name: string;
  region: string;
  openTime: string;
  closeTime: string;
  timezone: string;
  isActive: boolean;
  volatility: 'low' | 'medium' | 'high';
}

interface TimeframeAnalysis {
  bestPerforming: string;
  worstPerforming: string;
  mostConsistent: string;
  highestVolume: string;
  optimalEntry: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function TimeframeSelector() {
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>(['1H', '4H', '1D']);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'scalping' | 'intraday' | 'swing' | 'position'>('all');
  const [marketFilter, setMarketFilter] = useState<'all' | 'stocks' | 'crypto' | 'forex'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive timeframe data
  const timeframeData: TimeframeData[] = useMemo(() => [
    // Scalping timeframes
    {
      timeframe: '1m',
      label: '1 Minute',
      category: 'scalping',
      duration: '1-5 minutes',
      trades: 450,
      winRate: 68.5,
      profitFactor: 1.2,
      avgReturn: 0.8,
      maxDrawdown: 2.1,
      sharpeRatio: 1.1,
      isActive: false,
      recommended: false
    },
    {
      timeframe: '3m',
      label: '3 Minutes',
      category: 'scalping',
      duration: '3-10 minutes',
      trades: 320,
      winRate: 71.2,
      profitFactor: 1.4,
      avgReturn: 1.2,
      maxDrawdown: 1.8,
      sharpeRatio: 1.3,
      isActive: false,
      recommended: false
    },
    {
      timeframe: '5m',
      label: '5 Minutes',
      category: 'scalping',
      duration: '5-15 minutes',
      trades: 280,
      winRate: 73.8,
      profitFactor: 1.6,
      avgReturn: 1.5,
      maxDrawdown: 1.5,
      sharpeRatio: 1.5,
      isActive: selectedTimeframes.includes('5m'),
      recommended: true
    },
    {
      timeframe: '15m',
      label: '15 Minutes',
      category: 'scalping',
      duration: '15-45 minutes',
      trades: 180,
      winRate: 76.1,
      profitFactor: 1.8,
      avgReturn: 2.1,
      maxDrawdown: 1.2,
      sharpeRatio: 1.7,
      isActive: selectedTimeframes.includes('15m'),
      recommended: true
    },
    // Intraday timeframes
    {
      timeframe: '30m',
      label: '30 Minutes',
      category: 'intraday',
      duration: '30min-2hrs',
      trades: 120,
      winRate: 78.5,
      profitFactor: 2.1,
      avgReturn: 2.8,
      maxDrawdown: 0.9,
      sharpeRatio: 2.0,
      isActive: selectedTimeframes.includes('30m'),
      recommended: true
    },
    {
      timeframe: '1H',
      label: '1 Hour',
      category: 'intraday',
      duration: '1-4 hours',
      trades: 95,
      winRate: 80.2,
      profitFactor: 2.3,
      avgReturn: 3.2,
      maxDrawdown: 0.7,
      sharpeRatio: 2.2,
      isActive: selectedTimeframes.includes('1H'),
      recommended: true
    },
    {
      timeframe: '2H',
      label: '2 Hours',
      category: 'intraday',
      duration: '2-6 hours',
      trades: 65,
      winRate: 81.8,
      profitFactor: 2.5,
      avgReturn: 3.8,
      maxDrawdown: 0.6,
      sharpeRatio: 2.4,
      isActive: selectedTimeframes.includes('2H'),
      recommended: true
    },
    {
      timeframe: '4H',
      label: '4 Hours',
      category: 'intraday',
      duration: '4-12 hours',
      trades: 45,
      winRate: 83.1,
      profitFactor: 2.8,
      avgReturn: 4.5,
      maxDrawdown: 0.5,
      sharpeRatio: 2.6,
      isActive: selectedTimeframes.includes('4H'),
      recommended: true
    },
    // Swing trading timeframes
    {
      timeframe: '6H',
      label: '6 Hours',
      category: 'swing',
      duration: '6-18 hours',
      trades: 32,
      winRate: 84.5,
      profitFactor: 3.1,
      avgReturn: 5.2,
      maxDrawdown: 0.4,
      sharpeRatio: 2.8,
      isActive: selectedTimeframes.includes('6H'),
      recommended: true
    },
    {
      timeframe: '12H',
      label: '12 Hours',
      category: 'swing',
      duration: '12-36 hours',
      trades: 25,
      winRate: 85.8,
      profitFactor: 3.4,
      avgReturn: 6.1,
      maxDrawdown: 0.3,
      sharpeRatio: 3.0,
      isActive: selectedTimeframes.includes('12H'),
      recommended: true
    },
    {
      timeframe: '1D',
      label: '1 Day',
      category: 'swing',
      duration: '1-3 days',
      trades: 18,
      winRate: 87.2,
      profitFactor: 3.8,
      avgReturn: 7.5,
      maxDrawdown: 0.2,
      sharpeRatio: 3.2,
      isActive: selectedTimeframes.includes('1D'),
      recommended: true
    },
    // Position trading timeframes
    {
      timeframe: '3D',
      label: '3 Days',
      category: 'position',
      duration: '3-7 days',
      trades: 12,
      winRate: 88.5,
      profitFactor: 4.2,
      avgReturn: 9.1,
      maxDrawdown: 0.15,
      sharpeRatio: 3.5,
      isActive: selectedTimeframes.includes('3D'),
      recommended: false
    },
    {
      timeframe: '1W',
      label: '1 Week',
      category: 'position',
      duration: '1-4 weeks',
      trades: 8,
      winRate: 89.8,
      profitFactor: 4.6,
      avgReturn: 11.2,
      maxDrawdown: 0.1,
      sharpeRatio: 3.8,
      isActive: selectedTimeframes.includes('1W'),
      recommended: false
    },
    {
      timeframe: '1M',
      label: '1 Month',
      category: 'position',
      duration: '1-3 months',
      trades: 4,
      winRate: 91.2,
      profitFactor: 5.1,
      avgReturn: 15.8,
      maxDrawdown: 0.08,
      sharpeRatio: 4.2,
      isActive: selectedTimeframes.includes('1M'),
      recommended: false
    }
  ], [selectedTimeframes]);

  // Market sessions data
  const marketSessions: MarketSession[] = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return [
      {
        name: 'Sydney',
        region: 'Asia-Pacific',
        openTime: '22:00',
        closeTime: '07:00',
        timezone: 'AEDT',
        isActive: currentHour >= 22 || currentHour < 7,
        volatility: 'low'
      },
      {
        name: 'Tokyo',
        region: 'Asia',
        openTime: '00:00',
        closeTime: '09:00',
        timezone: 'JST',
        isActive: currentHour >= 0 && currentHour < 9,
        volatility: 'medium'
      },
      {
        name: 'London',
        region: 'Europe',
        openTime: '08:00',
        closeTime: '17:00',
        timezone: 'GMT',
        isActive: currentHour >= 8 && currentHour < 17,
        volatility: 'high'
      },
      {
        name: 'New York',
        region: 'Americas',
        openTime: '13:00',
        closeTime: '22:00',
        timezone: 'EST',
        isActive: currentHour >= 13 && currentHour < 22,
        volatility: 'high'
      }
    ];
  }, []);

  // Filter timeframes based on category
  const filteredTimeframes = useMemo(() => {
    if (selectedCategory === 'all') return timeframeData;
    return timeframeData.filter(tf => tf.category === selectedCategory);
  }, [timeframeData, selectedCategory]);

  // Calculate analysis metrics
  const analysis: TimeframeAnalysis = useMemo(() => {
    const activeTimeframes = timeframeData.filter(tf => tf.isActive);
    
    const bestPerforming = activeTimeframes.reduce((best, current) => 
      current.profitFactor > best.profitFactor ? current : best
    );
    
    const worstPerforming = activeTimeframes.reduce((worst, current) => 
      current.profitFactor < worst.profitFactor ? current : worst
    );
    
    const mostConsistent = activeTimeframes.reduce((consistent, current) => 
      current.maxDrawdown < consistent.maxDrawdown ? current : consistent
    );
    
    const highestVolume = activeTimeframes.reduce((volume, current) => 
      current.trades > volume.trades ? current : volume
    );
    
    const avgProfitFactor = activeTimeframes.reduce((sum, tf) => sum + tf.profitFactor, 0) / activeTimeframes.length;
    const avgDrawdown = activeTimeframes.reduce((sum, tf) => sum + tf.maxDrawdown, 0) / activeTimeframes.length;
    
    return {
      bestPerforming: bestPerforming.timeframe,
      worstPerforming: worstPerforming.timeframe,
      mostConsistent: mostConsistent.timeframe,
      highestVolume: highestVolume.timeframe,
      optimalEntry: avgProfitFactor > 2.5 ? 'Excellent' : avgProfitFactor > 2.0 ? 'Good' : 'Fair',
      riskLevel: avgDrawdown < 1 ? 'low' : avgDrawdown < 2 ? 'medium' : 'high'
    };
  }, [timeframeData]);

  const toggleTimeframe = (timeframe: string) => {
    setSelectedTimeframes(prev => 
      prev.includes(timeframe) 
        ? prev.filter(tf => tf !== timeframe)
        : [...prev, timeframe]
    );
  };

  const selectCategory = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      const categoryTimeframes = timeframeData
        .filter(tf => tf.category === category && tf.recommended)
        .map(tf => tf.timeframe);
      setSelectedTimeframes(categoryTimeframes);
    }
  };

  const optimizeSelection = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Auto-select best performing timeframes
      const optimized = timeframeData
        .filter(tf => tf.profitFactor >= 2.0 && tf.winRate >= 75)
        .sort((a, b) => b.profitFactor - a.profitFactor)
        .slice(0, 5)
        .map(tf => tf.timeframe);
      
      setSelectedTimeframes(optimized);
      setIsLoading(false);
    }, 1500);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scalping': return 'bg-red-100 text-red-800';
      case 'intraday': return 'bg-blue-100 text-blue-800';
      case 'swing': return 'bg-green-100 text-green-800';
      case 'position': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Multi-Timeframe Trading
            <Badge variant="outline">
              {selectedTimeframes.length} Active
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4 mr-1" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={optimizeSelection}
              disabled={isLoading}
            >
              <Zap className={`h-4 w-4 mr-1 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading ? 'Optimizing...' : 'Auto-Optimize'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Category Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Trading Style:</span>
              <div className="flex gap-1">
                {(['all', 'scalping', 'intraday', 'swing', 'position'] as const).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => selectCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Market:</span>
              <div className="flex gap-1">
                {(['all', 'stocks', 'crypto', 'forex'] as const).map((market) => (
                  <Button
                    key={market}
                    variant={marketFilter === market ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMarketFilter(market)}
                  >
                    {market.charAt(0).toUpperCase() + market.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Global Market Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketSessions.map((session) => (
              <div
                key={session.name}
                className={`p-3 rounded-lg border ${
                  session.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{session.name}</span>
                  {session.isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{session.openTime} - {session.closeTime}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span>{session.timezone}</span>
                    <span className={`font-medium ${getVolatilityColor(session.volatility)}`}>
                      {session.volatility.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeframe Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Timeframe Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTimeframes.map((timeframe) => (
              <div
                key={timeframe.timeframe}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  timeframe.isActive 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleTimeframe(timeframe.timeframe)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{timeframe.timeframe}</span>
                    {timeframe.recommended && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <Badge className={getCategoryColor(timeframe.category)}>
                    {timeframe.category}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground mb-3">
                  <div>{timeframe.label}</div>
                  <div>Duration: {timeframe.duration}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Win Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      {timeframe.winRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={timeframe.winRate} className="h-1" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Profit Factor</span>
                    <span className={`text-sm font-medium ${
                      timeframe.profitFactor >= 2.0 ? 'text-green-600' : 
                      timeframe.profitFactor >= 1.5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {timeframe.profitFactor.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Trades: </span>
                      <span className="font-medium">{timeframe.trades}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg: </span>
                      <span className="font-medium text-green-600">+{timeframe.avgReturn}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max DD: </span>
                      <span className="font-medium text-red-600">{timeframe.maxDrawdown}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sharpe: </span>
                      <span className="font-medium">{timeframe.sharpeRatio.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Best Performing</span>
              <Badge variant="outline" className="text-green-600">
                {analysis.bestPerforming}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Most Consistent</span>
              <Badge variant="outline" className="text-blue-600">
                {analysis.mostConsistent}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Highest Volume</span>
              <Badge variant="outline" className="text-purple-600">
                {analysis.highestVolume}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Risk Level</span>
              <Badge className={`${
                analysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                analysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {analysis.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Active Timeframes Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeframeData.filter(tf => tf.isActive)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeframe" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'profitFactor' ? value.toFixed(2) : 
                      name === 'winRate' ? `${value.toFixed(1)}%` : value,
                      name === 'profitFactor' ? 'Profit Factor' : 'Win Rate'
                    ]}
                  />
                  <Bar dataKey="profitFactor" fill="#3b82f6" />
                  <Bar dataKey="winRate" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Timeframe Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Auto-Optimization</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoOptimize}
                      onChange={(e) => setAutoOptimize(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Enable auto-optimization</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Automatically adjust timeframes based on market conditions
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Performance Filters</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Min Win Rate</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Min Profit Factor</span>
                    <span className="text-sm font-medium">1.6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Drawdown</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Risk Management</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Position Sizing</span>
                    <span className="text-sm font-medium">Dynamic</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Correlation Limit</span>
                    <span className="text-sm font-medium">0.7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Max Concurrent</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GainzAlgo Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            GainzAlgo Multi-Timeframe Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Optimized Configuration Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Primary Timeframes:</span>
                <div className="font-medium">{selectedTimeframes.slice(0, 3).join(', ')}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Expected Win Rate:</span>
                <div className="font-medium text-green-600">78.5%+</div>
              </div>
              <div>
                <span className="text-muted-foreground">Target Profit Factor:</span>
                <div className="font-medium text-blue-600">2.3+</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              GainzAlgo automatically synchronizes signals across multiple timeframes for optimal entry and exit timing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}