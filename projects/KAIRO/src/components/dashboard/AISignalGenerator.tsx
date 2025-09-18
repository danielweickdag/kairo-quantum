'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  BarChart3, 
  Activity, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  Eye,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'neural_network' | 'random_forest' | 'svm' | 'lstm' | 'transformer';
  accuracy: number;
  status: 'training' | 'active' | 'inactive' | 'error';
  lastTrained: string;
  signals: number;
  winRate: number;
  description: string;
}

interface Signal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  price: number;
  timestamp: string;
  model: string;
  reasoning: string[];
  status: 'pending' | 'executed' | 'expired';
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  volatility: number;
  sentiment: number;
  technicalScore: number;
  fundamentalScore: number;
}

const AISignalGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signals');
  const [selectedModel, setSelectedModel] = useState<string>('ensemble');
  const [autoTrading, setAutoTrading] = useState(false);
  const [signalFilter, setSignalFilter] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);

  // Mock data
  const [aiModels] = useState<AIModel[]>([
    {
      id: 'ensemble',
      name: 'Ensemble Model',
      type: 'neural_network',
      accuracy: 87.3,
      status: 'active',
      lastTrained: '2024-01-15',
      signals: 1247,
      winRate: 73.2,
      description: 'Advanced ensemble combining multiple ML models'
    },
    {
      id: 'lstm',
      name: 'LSTM Predictor',
      type: 'lstm',
      accuracy: 82.1,
      status: 'active',
      lastTrained: '2024-01-14',
      signals: 892,
      winRate: 68.9,
      description: 'Long Short-Term Memory network for time series prediction'
    },
    {
      id: 'transformer',
      name: 'Transformer Model',
      type: 'transformer',
      accuracy: 84.7,
      status: 'training',
      lastTrained: '2024-01-13',
      signals: 634,
      winRate: 71.4,
      description: 'Attention-based transformer for market pattern recognition'
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      type: 'random_forest',
      accuracy: 79.5,
      status: 'active',
      lastTrained: '2024-01-12',
      signals: 1156,
      winRate: 65.8,
      description: 'Ensemble of decision trees for robust predictions'
    }
  ]);

  const [signals] = useState<Signal[]>([
    {
      id: '1',
      symbol: 'BTCUSDT',
      type: 'BUY',
      confidence: 89.2,
      price: 45250,
      timestamp: '2024-01-15 14:30:00',
      model: 'Ensemble Model',
      reasoning: ['Strong bullish momentum', 'Volume spike detected', 'Support level confirmed'],
      status: 'pending',
      expectedReturn: 12.5,
      riskLevel: 'medium'
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      type: 'SELL',
      confidence: 76.8,
      price: 2850,
      timestamp: '2024-01-15 14:25:00',
      model: 'LSTM Predictor',
      reasoning: ['Resistance level reached', 'Bearish divergence', 'Overbought conditions'],
      status: 'executed',
      expectedReturn: 8.3,
      riskLevel: 'low'
    },
    {
      id: '3',
      symbol: 'ADAUSDT',
      type: 'BUY',
      confidence: 82.4,
      price: 0.485,
      timestamp: '2024-01-15 14:20:00',
      model: 'Transformer Model',
      reasoning: ['Breakout pattern forming', 'Positive sentiment shift', 'Volume accumulation'],
      status: 'pending',
      expectedReturn: 15.7,
      riskLevel: 'high'
    }
  ]);

  const [marketData] = useState<MarketData[]>([
    {
      symbol: 'BTCUSDT',
      price: 45250,
      change: 2.34,
      volume: 1250000,
      volatility: 0.045,
      sentiment: 0.72,
      technicalScore: 78,
      fundamentalScore: 85
    },
    {
      symbol: 'ETHUSDT',
      price: 2850,
      change: -1.23,
      volume: 890000,
      volatility: 0.038,
      sentiment: 0.45,
      technicalScore: 65,
      fundamentalScore: 72
    },
    {
      symbol: 'ADAUSDT',
      price: 0.485,
      change: 5.67,
      volume: 450000,
      volatility: 0.062,
      sentiment: 0.68,
      technicalScore: 82,
      fundamentalScore: 69
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'executed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSignals = signals.filter(signal => {
    if (signalFilter === 'all') return true;
    if (signalFilter === 'high-confidence') return signal.confidence >= 80;
    if (signalFilter === 'pending') return signal.status === 'pending';
    if (signalFilter === 'executed') return signal.status === 'executed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Signal Generator</h2>
          <p className="text-gray-600 dark:text-gray-400">Advanced machine learning powered trading signals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-trading">Auto Trading</Label>
            <Switch
              id="auto-trading"
              checked={autoTrading}
              onCheckedChange={setAutoTrading}
            />
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Signals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">84.2%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">72.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Models Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3/4</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signals">Live Signals</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Live Trading Signals
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={signalFilter} 
                    onChange={(e) => setSignalFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Signals</option>
                    <option value="high-confidence">High Confidence</option>
                    <option value="pending">Pending</option>
                    <option value="executed">Executed</option>
                  </select>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSignals.map((signal) => (
                  <div key={signal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={signal.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {signal.type}
                        </Badge>
                        <span className="font-semibold text-lg">{signal.symbol}</span>
                        <Badge className={getSignalStatusColor(signal.status)}>
                          {signal.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{signal.timestamp}</p>
                        <p className="font-semibold">${signal.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={signal.confidence} className="flex-1" />
                          <span className="text-sm font-medium">{signal.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expected Return</p>
                        <p className="font-semibold text-green-600">+{signal.expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Risk Level</p>
                        <Badge className={getRiskColor(signal.riskLevel)}>
                          {signal.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Model</p>
                        <p className="font-medium">{signal.model}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Reasoning:</p>
                      <div className="flex flex-wrap gap-1">
                        {signal.reasoning.map((reason, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {signal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Execute Trade
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Models Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{model.name}</h3>
                      <Badge className={getStatusColor(model.status)}>
                        {model.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{model.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                        <p className="font-semibold text-green-600">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                        <p className="font-semibold">{model.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Signals Generated</p>
                        <p className="font-semibold">{model.signals.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last Trained</p>
                        <p className="font-semibold">{model.lastTrained}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {model.status === 'active' ? (
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retrain
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Real-time Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.map((data) => (
                  <div key={data.symbol} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-lg">{data.symbol}</span>
                        <Badge className={data.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {data.change >= 0 ? '+' : ''}{data.change}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${data.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Volume: {data.volume.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Volatility</p>
                        <Progress value={data.volatility * 1000} className="mt-1" />
                        <p className="text-xs mt-1">{(data.volatility * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sentiment</p>
                        <Progress value={data.sentiment * 100} className="mt-1" />
                        <p className="text-xs mt-1">{(data.sentiment * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Technical Score</p>
                        <Progress value={data.technicalScore} className="mt-1" />
                        <p className="text-xs mt-1">{data.technicalScore}/100</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fundamental Score</p>
                        <Progress value={data.fundamentalScore} className="mt-1" />
                        <p className="text-xs mt-1">{data.fundamentalScore}/100</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Signal Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="confidence-threshold">Minimum Confidence Threshold</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="range"
                    id="confidence-threshold"
                    min="50"
                    max="95"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-semibold">{confidenceThreshold}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Signal Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Enable BUY signals</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable SELL signals</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>High-risk signals</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Real-time notifications</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Risk Management</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="max-position">Max Position Size (%)</Label>
                      <Input id="max-position" type="number" defaultValue="5" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="stop-loss">Default Stop Loss (%)</Label>
                      <Input id="stop-loss" type="number" defaultValue="2" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="take-profit">Default Take Profit (%)</Label>
                      <Input id="take-profit" type="number" defaultValue="6" className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button>
                  Save Settings
                </Button>
                <Button variant="outline">
                  Reset to Default
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Config
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISignalGenerator;