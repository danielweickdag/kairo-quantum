'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Globe,
  Server,
  Download,
  Upload
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'exchange' | 'news' | 'social' | 'economic';
  status: 'connected' | 'disconnected' | 'error';
  latency: number;
  dataRate: number;
  lastUpdate: string;
  reliability: number;
}

interface PipelineMetrics {
  totalMessages: number;
  messagesPerSecond: number;
  errorRate: number;
  uptime: number;
  dataVolume: number;
  processedToday: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  source: string;
}

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'Binance WebSocket',
    type: 'exchange',
    status: 'connected',
    latency: 12,
    dataRate: 1250,
    lastUpdate: '2024-01-15T10:30:15Z',
    reliability: 99.8
  },
  {
    id: '2',
    name: 'Coinbase Pro API',
    type: 'exchange',
    status: 'connected',
    latency: 18,
    dataRate: 890,
    lastUpdate: '2024-01-15T10:30:12Z',
    reliability: 99.5
  },
  {
    id: '3',
    name: 'CryptoNews Feed',
    type: 'news',
    status: 'connected',
    latency: 45,
    dataRate: 25,
    lastUpdate: '2024-01-15T10:29:30Z',
    reliability: 98.2
  },
  {
    id: '4',
    name: 'Twitter Sentiment',
    type: 'social',
    status: 'error',
    latency: 0,
    dataRate: 0,
    lastUpdate: '2024-01-15T10:15:00Z',
    reliability: 95.1
  },
  {
    id: '5',
    name: 'Economic Calendar',
    type: 'economic',
    status: 'connected',
    latency: 120,
    dataRate: 5,
    lastUpdate: '2024-01-15T10:28:45Z',
    reliability: 99.9
  }
];

const mockMetrics: PipelineMetrics = {
  totalMessages: 15420000,
  messagesPerSecond: 2170,
  errorRate: 0.02,
  uptime: 99.95,
  dataVolume: 2.4,
  processedToday: 187000000
};

const mockMarketData: MarketData[] = [
  {
    symbol: 'BTCUSDT',
    price: 43250.50,
    change: 1250.30,
    changePercent: 2.98,
    volume: 28450000,
    timestamp: '2024-01-15T10:30:15Z',
    source: 'Binance'
  },
  {
    symbol: 'ETHUSDT',
    price: 2580.75,
    change: -45.20,
    changePercent: -1.72,
    volume: 15230000,
    timestamp: '2024-01-15T10:30:14Z',
    source: 'Coinbase'
  },
  {
    symbol: 'ADAUSDT',
    price: 0.4825,
    change: 0.0125,
    changePercent: 2.66,
    volume: 8920000,
    timestamp: '2024-01-15T10:30:13Z',
    source: 'Binance'
  },
  {
    symbol: 'SOLUSDT',
    price: 98.45,
    change: 3.20,
    changePercent: 3.36,
    volume: 12450000,
    timestamp: '2024-01-15T10:30:12Z',
    source: 'Binance'
  }
];

export default function DataPipeline() {
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [metrics, setMetrics] = useState<PipelineMetrics>(mockMetrics);
  const [marketData, setMarketData] = useState<MarketData[]>(mockMarketData);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        setMarketData(prev => prev.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * item.price * 0.001,
          change: item.change + (Math.random() - 0.5) * 10,
          timestamp: new Date().toISOString()
        })));
        
        setMetrics(prev => ({
          ...prev,
          messagesPerSecond: prev.messagesPerSecond + Math.floor((Math.random() - 0.5) * 100),
          totalMessages: prev.totalMessages + prev.messagesPerSecond
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exchange': return <BarChart3 className="h-4 w-4" />;
      case 'news': return <Globe className="h-4 w-4" />;
      case 'social': return <Activity className="h-4 w-4" />;
      case 'economic': return <TrendingUp className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Data Pipeline</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time market data processing and distribution</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Refresh</span>
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
          <Button onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Feed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages/sec</p>
                    <p className="text-2xl font-bold">{metrics.messagesPerSecond.toLocaleString()}</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                    <p className="text-2xl font-bold text-green-500">{metrics.uptime}%</p>
                  </div>
                  <Server className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</p>
                    <p className="text-2xl font-bold text-red-500">{metrics.errorRate}%</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Volume</p>
                    <p className="text-2xl font-bold">{metrics.dataVolume}GB</p>
                  </div>
                  <Download className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Messages Processed</span>
                  <span className="font-bold">{metrics.totalMessages.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Messages Today</span>
                  <span className="font-bold">{metrics.processedToday.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Sources</span>
                  <span className="font-bold text-green-500">
                    {dataSources.filter(s => s.status === 'connected').length}/{dataSources.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Latency</span>
                  <span className="font-bold">
                    {Math.round(dataSources.reduce((acc, s) => acc + s.latency, 0) / dataSources.length)}ms
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Sources Health</CardTitle>
                <CardDescription>Status of all connected data providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataSources.map(source => (
                    <div key={source.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(source.type)}
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {source.dataRate} msg/s • {source.latency}ms
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(source.status)}
                        <span className="text-sm font-medium">{source.reliability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dataSources.map(source => (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      {getTypeIcon(source.type)}
                      <span>{source.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />
                      <Badge variant="outline">{source.status}</Badge>
                    </div>
                  </div>
                  <CardDescription className="capitalize">{source.type} data source</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Latency</p>
                      <p className="font-bold">{source.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Data Rate</p>
                      <p className="font-bold">{source.dataRate}/s</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Reliability</p>
                      <p className="font-bold">{source.reliability}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Update</p>
                      <p className="font-bold text-xs">
                        {new Date(source.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      {source.status === 'connected' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Market Data Feed</span>
              </CardTitle>
              <CardDescription>Real-time price updates from connected exchanges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-bold text-lg">{data.symbol}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{data.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${data.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        {data.changePercent >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          data.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
                      <p className="font-medium">{(data.volume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(data.timestamp).toLocaleTimeString()}
                      </p>
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
                <CardTitle>Data Processing Analytics</CardTitle>
                <CardDescription>Performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Peak Messages/Second (24h)</span>
                    <span className="font-bold">3,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Processing Time</span>
                    <span className="font-bold">2.3ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Compression Ratio</span>
                    <span className="font-bold">4.2:1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage Efficiency</span>
                    <span className="font-bold text-green-500">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Individual data source statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dataSources.map(source => (
                    <div key={source.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{source.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${source.reliability}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{source.reliability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}