'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, Activity, BarChart3, Zap, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import AIAlertIndicator from './AIAlertIndicator'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high24h: number
  low24h: number
  marketCap: number
}

interface TechnicalIndicator {
  name: string
  value: number
  signal: 'BUY' | 'SELL' | 'NEUTRAL'
  strength: number
}

interface MarketSentiment {
  fearGreedIndex: number
  bullishPercent: number
  bearishPercent: number
  neutralPercent: number
}

const MarketAnalysis: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([])
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD')
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Simulate real-time data updates
  useEffect(() => {
    const mockData: MarketData[] = [
      {
        symbol: 'BTC/USD',
        price: 43250.50,
        change: 1250.30,
        changePercent: 2.98,
        volume: 28500000000,
        high24h: 44100.00,
        low24h: 41800.00,
        marketCap: 847000000000
      },
      {
        symbol: 'ETH/USD',
        price: 2650.75,
        change: -85.25,
        changePercent: -3.11,
        volume: 15200000000,
        high24h: 2780.00,
        low24h: 2620.00,
        marketCap: 318000000000
      },
      {
        symbol: 'AAPL',
        price: 185.42,
        change: 2.15,
        changePercent: 1.17,
        volume: 52000000,
        high24h: 186.50,
        low24h: 182.80,
        marketCap: 2850000000000
      }
    ]

    const mockIndicators: TechnicalIndicator[] = [
      { name: 'RSI (14)', value: 68.5, signal: 'NEUTRAL', strength: 65 },
      { name: 'MACD', value: 125.8, signal: 'BUY', strength: 78 },
      { name: 'Bollinger Bands', value: 0.85, signal: 'SELL', strength: 45 },
      { name: 'Moving Average (50)', value: 42800, signal: 'BUY', strength: 82 },
      { name: 'Stochastic', value: 72.3, signal: 'NEUTRAL', strength: 58 }
    ]

    const mockSentiment: MarketSentiment = {
      fearGreedIndex: 72,
      bullishPercent: 45,
      bearishPercent: 28,
      neutralPercent: 27
    }

    setMarketData(mockData)
    setIndicators(mockIndicators)
    setSentiment(mockSentiment)
    setIsConnected(true)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * 100,
        change: item.change + (Math.random() - 0.5) * 50,
        changePercent: item.changePercent + (Math.random() - 0.5) * 2
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'text-green-600 bg-green-100'
      case 'SELL': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getSentimentColor = (index: number) => {
    if (index >= 75) return 'text-red-600'
    if (index >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-Time Market Analysis</h2>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live Data' : 'Disconnected'}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="ai-alerts">AI Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Market Data Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.map((data) => (
              <Card key={data.symbol} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedSymbol(data.symbol)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{data.symbol}</CardTitle>
                    <Badge variant={data.change >= 0 ? 'default' : 'destructive'}>
                      {data.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {data.changePercent.toFixed(2)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{formatCurrency(data.price)}</div>
                    <div className={cn(
                      "text-sm font-medium",
                      data.change >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {data.change >= 0 ? '+' : ''}{formatCurrency(data.change)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>High: {formatCurrency(data.high24h)}</div>
                      <div>Low: {formatCurrency(data.low24h)}</div>
                      <div>Volume: {formatVolume(data.volume)}</div>
                      <div>MCap: {formatVolume(data.marketCap)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+2.4%</div>
                  <div className="text-sm text-gray-600">Market Avg</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-gray-600">Active Symbols</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$2.8T</div>
                  <div className="text-sm text-gray-600">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">68%</div>
                  <div className="text-sm text-gray-600">Volatility Index</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Technical Indicators - {selectedSymbol}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{indicator.name}</div>
                      <div className="text-sm text-gray-600">Value: {indicator.value.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={indicator.strength} className="h-2" />
                        <div className="text-xs text-center mt-1">{indicator.strength}%</div>
                      </div>
                      <Badge className={getSignalColor(indicator.signal)}>
                        {indicator.signal}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signal Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Signal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Buy Signals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-sm text-gray-600">Sell Signals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-sm text-gray-600">Neutral</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          {sentiment && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Fear & Greed Index */}
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Fear & Greed Index</div>
                      <div className={cn(
                        "text-4xl font-bold mb-2",
                        getSentimentColor(sentiment.fearGreedIndex)
                      )}>
                        {sentiment.fearGreedIndex}
                      </div>
                      <div className="text-sm text-gray-600">
                        {sentiment.fearGreedIndex >= 75 ? 'Extreme Greed' :
                         sentiment.fearGreedIndex >= 50 ? 'Greed' :
                         sentiment.fearGreedIndex >= 25 ? 'Fear' : 'Extreme Fear'}
                      </div>
                      <Progress value={sentiment.fearGreedIndex} className="mt-4" />
                    </div>

                    {/* Sentiment Distribution */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{sentiment.bullishPercent}%</div>
                        <div className="text-sm text-gray-600">Bullish</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{sentiment.neutralPercent}%</div>
                        <div className="text-sm text-gray-600">Neutral</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{sentiment.bearishPercent}%</div>
                        <div className="text-sm text-gray-600">Bearish</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* News Sentiment */}
              <Card>
                <CardHeader>
                  <CardTitle>News Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Bitcoin ETF Approval News</div>
                        <div className="text-sm text-gray-600">2 hours ago</div>
                      </div>
                      <Badge className="text-green-600 bg-green-100">Bullish</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Fed Interest Rate Decision</div>
                        <div className="text-sm text-gray-600">5 hours ago</div>
                      </div>
                      <Badge className="text-red-600 bg-red-100">Bearish</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Tech Earnings Season</div>
                        <div className="text-sm text-gray-600">1 day ago</div>
                      </div>
                      <Badge className="text-yellow-600 bg-yellow-100">Neutral</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Market Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <div className="font-medium text-red-800">High Volatility Alert</div>
                    <div className="text-sm text-red-600">BTC/USD volatility exceeded 5% threshold</div>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div>
                    <div className="font-medium text-yellow-800">Volume Spike</div>
                    <div className="text-sm text-yellow-600">ETH/USD volume 200% above average</div>
                  </div>
                  <Badge className="text-yellow-600 bg-yellow-100">Medium</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div>
                    <div className="font-medium text-blue-800">Technical Breakout</div>
                    <div className="text-sm text-blue-600">AAPL broke resistance at $185</div>
                  </div>
                  <Badge className="text-blue-600 bg-blue-100">Info</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full" variant="outline">
                  Create Price Alert
                </Button>
                <Button className="w-full" variant="outline">
                  Create Volume Alert
                </Button>
                <Button className="w-full" variant="outline">
                  Create Technical Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-alerts" className="space-y-4">
          <AIAlertIndicator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarketAnalysis