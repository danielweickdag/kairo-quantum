'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Shield, 
  Clock, 
  Zap, 
  Brain,
  Search,
  Filter,
  Star,
  Download,
  Play,
  Settings,
  Copy,
  Eye,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Award,
  Users,
  Activity,
  DollarSign,
  Percent
} from 'lucide-react';

interface StrategyTemplate {
  id: string;
  name: string;
  category: 'trend_following' | 'mean_reversion' | 'momentum' | 'arbitrage' | 'scalping' | 'swing';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeframe: string;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  parameters: StrategyParameter[];
  backtest: BacktestResult;
  isPopular: boolean;
  isPremium: boolean;
}

interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  maxDrawdown: number;
  profitFactor: number;
}

const StrategyTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<StrategyTemplate | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);

  // Mock strategy templates
  const [templates] = useState<StrategyTemplate[]>([
    {
      id: '1',
      name: 'Golden Cross Momentum',
      category: 'trend_following',
      description: 'Classic trend-following strategy using 50/200 EMA crossover with momentum confirmation',
      difficulty: 'beginner',
      timeframe: '4H - 1D',
      winRate: 68.5,
      avgReturn: 12.3,
      maxDrawdown: 8.2,
      sharpeRatio: 1.45,
      rating: 4.6,
      downloads: 2847,
      author: 'TradingPro',
      tags: ['EMA', 'Crossover', 'Momentum', 'Trend'],
      isPopular: true,
      isPremium: false,
      parameters: [
        { name: 'Fast EMA', type: 'number', defaultValue: 50, min: 10, max: 100, description: 'Fast EMA period' },
        { name: 'Slow EMA', type: 'number', defaultValue: 200, min: 100, max: 300, description: 'Slow EMA period' },
        { name: 'Volume Filter', type: 'boolean', defaultValue: true, description: 'Enable volume confirmation' },
        { name: 'Risk %', type: 'number', defaultValue: 2, min: 0.5, max: 5, description: 'Risk per trade' }
      ],
      backtest: {
        totalTrades: 156,
        winningTrades: 107,
        losingTrades: 49,
        totalReturn: 234.7,
        annualizedReturn: 18.2,
        volatility: 12.5,
        maxDrawdown: 8.2,
        profitFactor: 1.68
      }
    },
    {
      id: '2',
      name: 'RSI Mean Reversion',
      category: 'mean_reversion',
      description: 'Mean reversion strategy using RSI oversold/overbought levels with support/resistance',
      difficulty: 'intermediate',
      timeframe: '1H - 4H',
      winRate: 72.1,
      avgReturn: 8.7,
      maxDrawdown: 5.4,
      sharpeRatio: 1.82,
      rating: 4.8,
      downloads: 1923,
      author: 'QuantMaster',
      tags: ['RSI', 'Mean Reversion', 'Support', 'Resistance'],
      isPopular: true,
      isPremium: true,
      parameters: [
        { name: 'RSI Period', type: 'number', defaultValue: 14, min: 7, max: 21, description: 'RSI calculation period' },
        { name: 'Oversold Level', type: 'number', defaultValue: 30, min: 20, max: 35, description: 'RSI oversold threshold' },
        { name: 'Overbought Level', type: 'number', defaultValue: 70, min: 65, max: 80, description: 'RSI overbought threshold' },
        { name: 'Confirmation', type: 'select', defaultValue: 'candlestick', options: ['candlestick', 'volume', 'both'], description: 'Entry confirmation method' }
      ],
      backtest: {
        totalTrades: 203,
        winningTrades: 146,
        losingTrades: 57,
        totalReturn: 187.3,
        annualizedReturn: 15.6,
        volatility: 8.9,
        maxDrawdown: 5.4,
        profitFactor: 2.14
      }
    },
    {
      id: '3',
      name: 'Breakout Scalper',
      category: 'scalping',
      description: 'High-frequency scalping strategy targeting breakouts from consolidation patterns',
      difficulty: 'advanced',
      timeframe: '1M - 15M',
      winRate: 58.3,
      avgReturn: 24.6,
      maxDrawdown: 12.1,
      sharpeRatio: 1.23,
      rating: 4.2,
      downloads: 1456,
      author: 'ScalpingKing',
      tags: ['Breakout', 'Scalping', 'Volume', 'Volatility'],
      isPopular: false,
      isPremium: true,
      parameters: [
        { name: 'Consolidation Period', type: 'number', defaultValue: 20, min: 10, max: 50, description: 'Bars for consolidation detection' },
        { name: 'Breakout Threshold', type: 'number', defaultValue: 1.5, min: 1, max: 3, description: 'Breakout strength multiplier' },
        { name: 'Volume Multiplier', type: 'number', defaultValue: 2, min: 1.5, max: 3, description: 'Volume confirmation multiplier' },
        { name: 'Quick Exit', type: 'boolean', defaultValue: true, description: 'Enable quick profit taking' }
      ],
      backtest: {
        totalTrades: 892,
        winningTrades: 520,
        losingTrades: 372,
        totalReturn: 312.4,
        annualizedReturn: 24.6,
        volatility: 18.7,
        maxDrawdown: 12.1,
        profitFactor: 1.45
      }
    },
    {
      id: '4',
      name: 'MACD Divergence Hunter',
      category: 'momentum',
      description: 'Advanced momentum strategy detecting MACD divergences for trend reversal signals',
      difficulty: 'intermediate',
      timeframe: '2H - 8H',
      winRate: 65.7,
      avgReturn: 16.8,
      maxDrawdown: 9.3,
      sharpeRatio: 1.56,
      rating: 4.5,
      downloads: 2134,
      author: 'DivergenceExpert',
      tags: ['MACD', 'Divergence', 'Momentum', 'Reversal'],
      isPopular: true,
      isPremium: false,
      parameters: [
        { name: 'MACD Fast', type: 'number', defaultValue: 12, min: 8, max: 16, description: 'MACD fast EMA period' },
        { name: 'MACD Slow', type: 'number', defaultValue: 26, min: 20, max: 35, description: 'MACD slow EMA period' },
        { name: 'Signal Line', type: 'number', defaultValue: 9, min: 5, max: 15, description: 'MACD signal line period' },
        { name: 'Divergence Strength', type: 'select', defaultValue: 'medium', options: ['weak', 'medium', 'strong'], description: 'Required divergence strength' }
      ],
      backtest: {
        totalTrades: 178,
        winningTrades: 117,
        losingTrades: 61,
        totalReturn: 198.5,
        annualizedReturn: 16.8,
        volatility: 11.2,
        maxDrawdown: 9.3,
        profitFactor: 1.78
      }
    },
    {
      id: '5',
      name: 'Grid Trading Bot',
      category: 'arbitrage',
      description: 'Automated grid trading system for ranging markets with dynamic grid adjustment',
      difficulty: 'advanced',
      timeframe: '15M - 1H',
      winRate: 78.9,
      avgReturn: 14.2,
      maxDrawdown: 6.8,
      sharpeRatio: 2.01,
      rating: 4.7,
      downloads: 3421,
      author: 'GridMaster',
      tags: ['Grid', 'Range', 'Automation', 'DCA'],
      isPopular: true,
      isPremium: true,
      parameters: [
        { name: 'Grid Size', type: 'number', defaultValue: 10, min: 5, max: 20, description: 'Number of grid levels' },
        { name: 'Grid Spacing %', type: 'number', defaultValue: 1, min: 0.5, max: 2, description: 'Distance between grid levels' },
        { name: 'Base Order Size', type: 'number', defaultValue: 100, min: 50, max: 500, description: 'Base order amount' },
        { name: 'Dynamic Adjustment', type: 'boolean', defaultValue: true, description: 'Enable dynamic grid adjustment' }
      ],
      backtest: {
        totalTrades: 1247,
        winningTrades: 984,
        losingTrades: 263,
        totalReturn: 156.8,
        annualizedReturn: 14.2,
        volatility: 7.1,
        maxDrawdown: 6.8,
        profitFactor: 2.34
      }
    },
    {
      id: '6',
      name: 'Swing Trading Master',
      category: 'swing',
      description: 'Multi-timeframe swing trading strategy combining technical and fundamental analysis',
      difficulty: 'intermediate',
      timeframe: '1D - 1W',
      winRate: 61.4,
      avgReturn: 22.1,
      maxDrawdown: 11.7,
      sharpeRatio: 1.34,
      rating: 4.4,
      downloads: 1789,
      author: 'SwingTrader',
      tags: ['Swing', 'Multi-timeframe', 'Technical', 'Fundamental'],
      isPopular: false,
      isPremium: false,
      parameters: [
        { name: 'Primary Timeframe', type: 'select', defaultValue: '1D', options: ['4H', '1D', '3D'], description: 'Main analysis timeframe' },
        { name: 'Confirmation Timeframe', type: 'select', defaultValue: '4H', options: ['1H', '4H', '1D'], description: 'Entry confirmation timeframe' },
        { name: 'Risk Reward Ratio', type: 'number', defaultValue: 3, min: 2, max: 5, description: 'Minimum risk/reward ratio' },
        { name: 'Fundamental Filter', type: 'boolean', defaultValue: true, description: 'Enable fundamental analysis filter' }
      ],
      backtest: {
        totalTrades: 89,
        winningTrades: 55,
        losingTrades: 34,
        totalReturn: 267.3,
        annualizedReturn: 22.1,
        volatility: 16.4,
        maxDrawdown: 11.7,
        profitFactor: 1.89
      }
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'trend_following', name: 'Trend Following', icon: TrendingUp },
    { id: 'mean_reversion', name: 'Mean Reversion', icon: Target },
    { id: 'momentum', name: 'Momentum', icon: Zap },
    { id: 'arbitrage', name: 'Arbitrage', icon: BarChart3 },
    { id: 'scalping', name: 'Scalping', icon: Clock },
    { id: 'swing', name: 'Swing Trading', icon: Activity }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend_following': return 'bg-blue-100 text-blue-800';
      case 'mean_reversion': return 'bg-purple-100 text-purple-800';
      case 'momentum': return 'bg-orange-100 text-orange-800';
      case 'arbitrage': return 'bg-cyan-100 text-cyan-800';
      case 'scalping': return 'bg-pink-100 text-pink-800';
      case 'swing': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Strategy Templates</h2>
          <p className="text-gray-600 dark:text-gray-400">Pre-built trading strategies ready to deploy</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Import Strategy
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Popular</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.filter(t => t.isPopular).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(templates.reduce((sum, t) => sum + t.winRate, 0) / templates.length).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {templates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="my-strategies">My Strategies</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search strategies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.isPopular && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                        {template.isPremium && <Award className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars(template.rating)}
                        <span className="text-sm text-gray-600 ml-2">({template.rating})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {template.timeframe}
                      </Badge>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Win Rate</p>
                        <p className="font-semibold text-green-600">{template.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Avg Return</p>
                        <p className="font-semibold text-blue-600">+{template.avgReturn}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Max Drawdown</p>
                        <p className="font-semibold text-red-600">-{template.maxDrawdown}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                        <p className="font-semibold">{template.sharpeRatio}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{template.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{template.author}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Clone
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Strategy Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No custom strategies created yet</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Strategy Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="strategy-name">Strategy Name</Label>
                    <Input id="strategy-name" placeholder="Enter strategy name" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1">
                      <option value="">Select category</option>
                      <option value="trend_following">Trend Following</option>
                      <option value="mean_reversion">Mean Reversion</option>
                      <option value="momentum">Momentum</option>
                      <option value="arbitrage">Arbitrage</option>
                      <option value="scalping">Scalping</option>
                      <option value="swing">Swing Trading</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    placeholder="Describe your strategy..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 h-24"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select id="difficulty" className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Input id="timeframe" placeholder="e.g., 1H - 4H" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" placeholder="RSI, MACD, Breakout" className="mt-1" />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Strategy Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Strategy Details</h4>
                  <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCategoryColor(selectedTemplate.category)}>
                        {selectedTemplate.category.replace('_', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                        {selectedTemplate.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-3 mt-6">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                      <p className="font-semibold text-green-600">{selectedTemplate.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Average Return</p>
                      <p className="font-semibold text-blue-600">+{selectedTemplate.avgReturn}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</p>
                      <p className="font-semibold text-red-600">-{selectedTemplate.maxDrawdown}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                      <p className="font-semibold">{selectedTemplate.sharpeRatio}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Backtest Results</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Total Trades</p>
                        <p className="font-semibold">{selectedTemplate.backtest.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Winning Trades</p>
                        <p className="font-semibold text-green-600">{selectedTemplate.backtest.winningTrades}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Total Return</p>
                        <p className="font-semibold text-blue-600">+{selectedTemplate.backtest.totalReturn}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Profit Factor</p>
                        <p className="font-semibold">{selectedTemplate.backtest.profitFactor}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-3 mt-6">Parameters</h4>
                  <div className="space-y-3">
                    {selectedTemplate.parameters.map((param, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{param.name}</span>
                          <Badge variant="outline">{param.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{param.description}</p>
                        <p className="text-sm font-medium mt-1">Default: {param.defaultValue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <Button className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Clone & Customize
                </Button>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Deploy Now
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyTemplates;