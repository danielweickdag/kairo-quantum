'use client';

import React, { useState, useCallback } from 'react';
// Note: react-beautiful-dnd would need to be installed for full drag-and-drop functionality
// For now, we'll simulate the drag-and-drop interface
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Using native select for now - can be replaced with UI library select component
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  Shield,
  Clock,
  Zap,
  Brain
} from 'lucide-react';

interface StrategyBlock {
  id: string;
  type: 'indicator' | 'condition' | 'action' | 'risk';
  name: string;
  icon: React.ReactNode;
  config: Record<string, any>;
  description: string;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  blocks: StrategyBlock[];
  isActive: boolean;
  performance: {
    profit: number;
    winRate: number;
    trades: number;
  };
}

const AVAILABLE_BLOCKS: StrategyBlock[] = [
  {
    id: 'rsi',
    type: 'indicator',
    name: 'RSI',
    icon: <BarChart3 className="w-4 h-4" />,
    config: { period: 14, overbought: 70, oversold: 30 },
    description: 'Relative Strength Index momentum oscillator'
  },
  {
    id: 'macd',
    type: 'indicator',
    name: 'MACD',
    icon: <TrendingUp className="w-4 h-4" />,
    config: { fast: 12, slow: 26, signal: 9 },
    description: 'Moving Average Convergence Divergence'
  },
  {
    id: 'sma',
    type: 'indicator',
    name: 'SMA',
    icon: <TrendingUp className="w-4 h-4" />,
    config: { period: 20 },
    description: 'Simple Moving Average'
  },
  {
    id: 'price_above',
    type: 'condition',
    name: 'Price Above',
    icon: <TrendingUp className="w-4 h-4" />,
    config: { value: 0 },
    description: 'Price is above specified value'
  },
  {
    id: 'rsi_oversold',
    type: 'condition',
    name: 'RSI Oversold',
    icon: <TrendingDown className="w-4 h-4" />,
    config: { threshold: 30 },
    description: 'RSI below oversold threshold'
  },
  {
    id: 'buy_market',
    type: 'action',
    name: 'Buy Market',
    icon: <Zap className="w-4 h-4" />,
    config: { quantity: 100 },
    description: 'Execute market buy order'
  },
  {
    id: 'sell_market',
    type: 'action',
    name: 'Sell Market',
    icon: <Zap className="w-4 h-4" />,
    config: { quantity: 100 },
    description: 'Execute market sell order'
  },
  {
    id: 'stop_loss',
    type: 'risk',
    name: 'Stop Loss',
    icon: <Shield className="w-4 h-4" />,
    config: { percentage: 2 },
    description: 'Set stop loss percentage'
  },
  {
    id: 'take_profit',
    type: 'risk',
    name: 'Take Profit',
    icon: <Target className="w-4 h-4" />,
    config: { percentage: 5 },
    description: 'Set take profit percentage'
  }
];

const STRATEGY_TEMPLATES: Strategy[] = [
  {
    id: 'rsi_mean_reversion',
    name: 'RSI Mean Reversion',
    description: 'Buy when RSI is oversold, sell when overbought',
    blocks: [
      AVAILABLE_BLOCKS.find(b => b.id === 'rsi')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'rsi_oversold')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'buy_market')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'stop_loss')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'take_profit')!
    ],
    isActive: false,
    performance: { profit: 12.5, winRate: 68, trades: 45 }
  },
  {
    id: 'macd_crossover',
    name: 'MACD Crossover',
    description: 'Trade on MACD signal line crossovers',
    blocks: [
      AVAILABLE_BLOCKS.find(b => b.id === 'macd')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'buy_market')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'stop_loss')!,
      AVAILABLE_BLOCKS.find(b => b.id === 'take_profit')!
    ],
    isActive: true,
    performance: { profit: 18.3, winRate: 72, trades: 32 }
  }
];

export default function StrategyBuilder() {
  const [strategies, setStrategies] = useState<Strategy[]>(STRATEGY_TEMPLATES);
  const [activeTab, setActiveTab] = useState('builder');
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [strategyBlocks, setStrategyBlocks] = useState<StrategyBlock[]>([]);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<StrategyBlock | null>(null);

  // Simplified drag handling for native HTML5 drag and drop
  const addBlockToStrategy = useCallback((block: StrategyBlock) => {
    const newBlock = {
      ...block,
      id: `${block.id}-${Date.now()}`
    };
    setStrategyBlocks(prev => [...prev, newBlock]);
  }, []);

  const removeBlock = useCallback((blockId: string) => {
    setStrategyBlocks(blocks => blocks.filter(block => block.id !== blockId));
  }, []);

  const saveStrategy = useCallback(() => {
    if (!strategyName || strategyBlocks.length === 0) return;

    const newStrategy: Strategy = {
      id: `strategy-${Date.now()}`,
      name: strategyName,
      description: strategyDescription,
      blocks: strategyBlocks,
      isActive: false,
      performance: { profit: 0, winRate: 0, trades: 0 }
    };

    setStrategies(prev => [...prev, newStrategy]);
    setStrategyName('');
    setStrategyDescription('');
    setStrategyBlocks([]);
  }, [strategyName, strategyDescription, strategyBlocks]);

  const loadStrategy = useCallback((strategy: Strategy) => {
    setCurrentStrategy(strategy);
    setStrategyName(strategy.name);
    setStrategyDescription(strategy.description);
    setStrategyBlocks([...strategy.blocks]);
  }, []);

  const toggleStrategy = useCallback((strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, isActive: !strategy.isActive }
        : strategy
    ));
  }, []);

  const getBlockTypeColor = (type: string) => {
    switch (type) {
      case 'indicator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'condition': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'action': return 'bg-green-100 text-green-800 border-green-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Strategy Builder</h2>
          <p className="text-gray-600">Create and manage custom trading strategies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Strategy Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="my-strategies">My Strategies</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Blocks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Blocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {AVAILABLE_BLOCKS.map((block, index) => (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(block));
                      }}
                      className={`p-3 rounded-lg border cursor-move transition-all hover:shadow-md ${getBlockTypeColor(block.type)}`}
                    >
                      <div className="flex items-center gap-2">
                        {block.icon}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{block.name}</div>
                          <div className="text-xs opacity-70">{block.description}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {block.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategy Canvas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Strategy Canvas</CardTitle>
                <div className="space-y-2">
                  <Input
                    placeholder="Strategy Name"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                  />
                  <Input
                    placeholder="Strategy Description"
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[400px] p-4 border-2 border-dashed rounded-lg transition-colors border-gray-300 bg-gray-50"
                  onDrop={(e) => {
                    e.preventDefault();
                    try {
                      const blockData = JSON.parse(e.dataTransfer.getData('application/json'));
                      addBlockToStrategy(blockData);
                    } catch (error) {
                      console.error('Error parsing dropped data:', error);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {strategyBlocks.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Drag blocks here to build your strategy</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {strategyBlocks.map((block, index) => (
                        <div
                          key={block.id}
                          className={`p-4 rounded-lg border bg-white shadow-sm transition-all hover:shadow-md ${getBlockTypeColor(block.type)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {block.icon}
                              <div>
                                <div className="font-medium">{block.name}</div>
                                <div className="text-sm opacity-70">{block.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedBlock(block)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBlock(block.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => {
                    setStrategyBlocks([]);
                    setStrategyName('');
                    setStrategyDescription('');
                  }}>
                    Clear
                  </Button>
                  <Button onClick={saveStrategy} disabled={!strategyName || strategyBlocks.length === 0}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Strategy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STRATEGY_TEMPLATES.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Profit:</span>
                      <span className="font-medium text-green-600">+{template.performance.profit}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Win Rate:</span>
                      <span className="font-medium">{template.performance.winRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trades:</span>
                      <span className="font-medium">{template.performance.trades}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => loadStrategy(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-strategies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                    <Badge variant={strategy.isActive ? 'default' : 'secondary'}>
                      {strategy.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Profit:</span>
                      <span className={`font-medium ${
                        strategy.performance.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {strategy.performance.profit >= 0 ? '+' : ''}{strategy.performance.profit}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Win Rate:</span>
                      <span className="font-medium">{strategy.performance.winRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trades:</span>
                      <span className="font-medium">{strategy.performance.trades}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={strategy.isActive ? 'destructive' : 'default'}
                        onClick={() => toggleStrategy(strategy.id)}
                        className="flex-1"
                      >
                        {strategy.isActive ? (
                          <><Pause className="w-4 h-4 mr-1" /> Pause</>
                        ) : (
                          <><Play className="w-4 h-4 mr-1" /> Start</>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => loadStrategy(strategy)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}