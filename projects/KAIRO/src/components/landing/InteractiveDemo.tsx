'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Play,
  Pause,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  aiScore: number
  recommendation: 'BUY' | 'SELL' | 'HOLD'
}

interface Trade {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  profit: number
  timestamp: string
}

const InteractiveDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(125000)
  const [totalProfit, setTotalProfit] = useState(0)
  const [aiAnalysisProgress, setAiAnalysisProgress] = useState(0)
  
  const [stocks, setStocks] = useState<Stock[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.25,
      change: 2.45,
      changePercent: 1.42,
      aiScore: 8.7,
      recommendation: 'BUY'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 245.80,
      change: -3.20,
      changePercent: -1.28,
      aiScore: 7.3,
      recommendation: 'HOLD'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.90,
      change: 5.67,
      changePercent: 1.52,
      aiScore: 9.1,
      recommendation: 'BUY'
    }
  ])
  
  const [trades, setTrades] = useState<Trade[]>([])
  
  const demoSteps = [
    {
      title: "AI Market Analysis",
      description: "KAIRO&apos;s AI analyzes thousands of market indicators in real-time",
      duration: 3000
    },
    {
      title: "Smart Recommendations",
      description: "AI provides intelligent buy/sell recommendations with confidence scores",
      duration: 2500
    },
    {
      title: "Automated Trading",
      description: "Execute trades automatically based on AI signals",
      duration: 3000
    },
    {
      title: "Portfolio Growth",
      description: "Watch your portfolio grow with AI-optimized strategies",
      duration: 2500
    }
  ]
  
  const benefits = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Advanced machine learning analyzes market patterns 24/7",
      color: "text-purple-400"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Execution",
      description: "Execute trades in milliseconds with optimal timing",
      color: "text-yellow-400"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Precision Trading",
      description: "95% accuracy rate with risk-optimized strategies",
      color: "text-green-400"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Maximize Profits",
      description: "Average 23% higher returns compared to manual trading",
      color: "text-blue-400"
    }
  ]
  
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPlaying) {
      interval = setInterval(() => {
        // Simulate AI analysis progress
        setAiAnalysisProgress(prev => {
          if (prev >= 100) {
            return 0
          }
          return prev + 2
        })
        
        // Update stock prices
        setStocks(prevStocks => 
          prevStocks.map(stock => ({
            ...stock,
            price: stock.price + (Math.random() - 0.5) * 2,
            change: stock.change + (Math.random() - 0.5) * 0.5,
            changePercent: stock.changePercent + (Math.random() - 0.5) * 0.2
          }))
        )
        
        // Simulate trades
        if (Math.random() > 0.7) {
          const randomStock = stocks[Math.floor(Math.random() * stocks.length)]
          const newTrade: Trade = {
            id: Date.now().toString(),
            symbol: randomStock.symbol,
            type: Math.random() > 0.5 ? 'BUY' : 'SELL',
            quantity: Math.floor(Math.random() * 100) + 10,
            price: randomStock.price,
            profit: (Math.random() - 0.3) * 1000,
            timestamp: new Date().toLocaleTimeString()
          }
          
          setTrades(prev => [newTrade, ...prev.slice(0, 4)])
          setTotalProfit(prev => prev + newTrade.profit)
          setPortfolioValue(prev => prev + newTrade.profit)
        }
      }, 100)
    }
    
    return () => clearInterval(interval)
  }, [isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    if (isPlaying) {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % demoSteps.length)
      }, 3000)
      
      return () => clearInterval(stepInterval)
    }
  }, [isPlaying, demoSteps.length])
  
  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }
  
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setPortfolioValue(125000)
    setTotalProfit(0)
    setAiAnalysisProgress(0)
    setTrades([])
  }
  
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Demo Controls */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handlePlay}
            className="bg-purple-500 hover:bg-purple-600"
            size="sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'} Demo
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Portfolio Value</div>
          <div className="text-xl font-bold text-green-400">
            ${portfolioValue.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Current Step Indicator */}
      {isPlaying && (
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div>
              <div className="font-semibold text-white">{demoSteps[currentStep].title}</div>
              <div className="text-sm text-gray-300">{demoSteps[currentStep].description}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-96 overflow-y-auto">
        {/* AI Analysis Panel */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-400" />
                AI Market Analysis
              </h3>
              <div className="text-sm text-gray-400">
                {aiAnalysisProgress}% Complete
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${aiAnalysisProgress}%` }}
              ></div>
            </div>
            
            <div className="space-y-3">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-semibold text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">${stock.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      stock.recommendation === 'BUY' ? 'bg-green-500/20 text-green-400' :
                      stock.recommendation === 'SELL' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {stock.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Trading Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Live Trading
              </h3>
              <div className="text-sm text-gray-400">
                Total P&L: <span className={`font-semibold ${
                  totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${totalProfit.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {trades.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Waiting for trading signals...</p>
                </div>
              ) : (
                trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        trade.type === 'BUY' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <div>
                        <div className="font-semibold text-white">
                          {trade.type} {trade.symbol}
                        </div>
                        <div className="text-sm text-gray-400">
                          {trade.quantity} shares @ ${trade.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        trade.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{trade.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Why Choose KAIRO AI Trading?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center p-4 bg-gray-700 rounded-lg">
              <div className={`${benefit.color} mb-2 flex justify-center`}>
                {benefit.icon}
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">{benefit.title}</h4>
              <p className="text-xs text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InteractiveDemo