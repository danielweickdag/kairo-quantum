'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertCircle,
  Plus,
  Minus,
  BarChart3,
  Wallet
} from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface Position {
  id: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
  allocation: number
  sector: string
  type: 'stock' | 'crypto' | 'forex' | 'commodity'
}

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalPnL: number
  totalPnLPercent: number
  dayChange: number
  dayChangePercent: number
  availableCash: number
  marginUsed: number
  buyingPower: number
}

interface AssetAllocation {
  category: string
  value: number
  percentage: number
  target: number
  color: string
}

interface Transaction {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total: number
  fee: number
  date: string
}

const PortfolioManagement: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([])
  const [summary, setSummary] = useState<PortfolioSummary | null>(null)
  const [allocations, setAllocations] = useState<AssetAllocation[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  useEffect(() => {
    // Mock portfolio data
    const mockPositions: Position[] = [
      {
        id: '1',
        symbol: 'AAPL',
        quantity: 100,
        avgPrice: 175.50,
        currentPrice: 185.42,
        marketValue: 18542,
        unrealizedPnL: 992,
        unrealizedPnLPercent: 5.65,
        allocation: 25.3,
        sector: 'Technology',
        type: 'stock'
      },
      {
        id: '2',
        symbol: 'BTC',
        quantity: 0.5,
        avgPrice: 40000,
        currentPrice: 43250.50,
        marketValue: 21625.25,
        unrealizedPnL: 1625.25,
        unrealizedPnLPercent: 8.13,
        allocation: 29.5,
        sector: 'Cryptocurrency',
        type: 'crypto'
      },
      {
        id: '3',
        symbol: 'TSLA',
        quantity: 50,
        avgPrice: 220.00,
        currentPrice: 195.30,
        marketValue: 9765,
        unrealizedPnL: -1235,
        unrealizedPnLPercent: -11.23,
        allocation: 13.3,
        sector: 'Automotive',
        type: 'stock'
      },
      {
        id: '4',
        symbol: 'ETH',
        quantity: 5,
        avgPrice: 2800,
        currentPrice: 2650.75,
        marketValue: 13253.75,
        unrealizedPnL: -746.25,
        unrealizedPnLPercent: -5.33,
        allocation: 18.1,
        sector: 'Cryptocurrency',
        type: 'crypto'
      },
      {
        id: '5',
        symbol: 'GOOGL',
        quantity: 25,
        avgPrice: 140.00,
        currentPrice: 152.80,
        marketValue: 3820,
        unrealizedPnL: 320,
        unrealizedPnLPercent: 9.14,
        allocation: 5.2,
        sector: 'Technology',
        type: 'stock'
      }
    ]

    const mockSummary: PortfolioSummary = {
      totalValue: 73306,
      totalCost: 72350,
      totalPnL: 956,
      totalPnLPercent: 1.32,
      dayChange: 1250,
      dayChangePercent: 1.73,
      availableCash: 15000,
      marginUsed: 5000,
      buyingPower: 25000
    }

    const mockAllocations: AssetAllocation[] = [
      { category: 'Technology', value: 22362, percentage: 30.5, target: 35, color: '#3B82F6' },
      { category: 'Cryptocurrency', value: 34879, percentage: 47.6, target: 40, color: '#F59E0B' },
      { category: 'Automotive', value: 9765, percentage: 13.3, target: 15, color: '#EF4444' },
      { category: 'Cash', value: 15000, percentage: 20.5, target: 10, color: '#10B981' }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        symbol: 'AAPL',
        type: 'BUY',
        quantity: 50,
        price: 185.42,
        total: 9271,
        fee: 5,
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        symbol: 'BTC',
        type: 'BUY',
        quantity: 0.25,
        price: 43250.50,
        total: 10812.63,
        fee: 15,
        date: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        symbol: 'TSLA',
        type: 'SELL',
        quantity: 25,
        price: 195.30,
        total: 4882.50,
        fee: 5,
        date: '2024-01-13T09:15:00Z'
      }
    ]

    setPositions(mockPositions)
    setSummary(mockSummary)
    setAllocations(mockAllocations)
    setTransactions(mockTransactions)
  }, [])

  const getPositionColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto': return '₿'
      case 'stock': return '📈'
      case 'forex': return '💱'
      case 'commodity': return '🥇'
      default: return '💼'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total P&L</p>
                  <p className={cn("text-2xl font-bold", getPositionColor(summary.totalPnL))}>
                    {formatCurrency(summary.totalPnL)}
                  </p>
                  <p className={cn("text-sm", getPositionColor(summary.totalPnL))}>
                    {formatPercent(summary.totalPnLPercent)}
                  </p>
                </div>
                {summary.totalPnL >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-green-600" /> : 
                  <TrendingDown className="w-8 h-8 text-red-600" />
                }
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Day Change</p>
                  <p className={cn("text-2xl font-bold", getPositionColor(summary.dayChange))}>
                    {formatCurrency(summary.dayChange)}
                  </p>
                  <p className={cn("text-sm", getPositionColor(summary.dayChange))}>
                    {formatPercent(summary.dayChangePercent)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Buying Power</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.buyingPower)}</p>
                  <p className="text-sm text-gray-600">
                    Cash: {formatCurrency(summary.availableCash)}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positions
                  .sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent)
                  .slice(0, 3)
                  .map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getTypeIcon(position.type)}</span>
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-sm text-gray-600">{position.sector}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn("font-medium", getPositionColor(position.unrealizedPnL))}>
                          {formatCurrency(position.unrealizedPnL)}
                        </div>
                        <div className={cn("text-sm", getPositionColor(position.unrealizedPnL))}>
                          {formatPercent(position.unrealizedPnLPercent)}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Risk Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">6.8</div>
                  <div className="text-sm text-gray-600">Portfolio Beta</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1.45</div>
                  <div className="text-sm text-gray-600">Sharpe Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">-8.2%</div>
                  <div className="text-sm text-gray-600">Max Drawdown</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18.5%</div>
                  <div className="text-sm text-gray-600">Volatility</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positions.map((position) => (
                  <div key={position.id} 
                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                       onClick={() => setSelectedPosition(position)}>
                    <div className="flex items-center space-x-4">
                      <span className="text-xl">{getTypeIcon(position.type)}</span>
                      <div>
                        <div className="font-medium text-lg">{position.symbol}</div>
                        <div className="text-sm text-gray-600">
                          {position.quantity} shares @ {formatCurrency(position.avgPrice)}
                        </div>
                        <div className="text-sm text-gray-600">{position.sector}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-lg">{formatCurrency(position.marketValue)}</div>
                      <div className={cn("font-medium", getPositionColor(position.unrealizedPnL))}>
                        {formatCurrency(position.unrealizedPnL)} ({formatPercent(position.unrealizedPnLPercent)})
                      </div>
                      <div className="text-sm text-gray-600">
                        {position.allocation.toFixed(1)}% of portfolio
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allocations.map((allocation, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: allocation.color }}
                        />
                        <span className="font-medium">{allocation.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(allocation.value)}</div>
                        <div className="text-sm text-gray-600">
                          {allocation.percentage.toFixed(1)}% (Target: {allocation.target}%)
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <Progress value={allocation.percentage} className="flex-1" />
                      <div className="text-sm text-gray-600 w-12">
                        {allocation.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rebalancing Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Rebalancing Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="font-medium text-yellow-800">Cryptocurrency Overweight</div>
                  <div className="text-sm text-yellow-600">
                    Consider reducing crypto allocation by 7.6% to meet target
                  </div>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="font-medium text-blue-800">Technology Underweight</div>
                  <div className="text-sm text-blue-600">
                    Consider increasing tech allocation by 4.5% to meet target
                  </div>
                </div>
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="font-medium text-green-800">Cash Overweight</div>
                  <div className="text-sm text-green-600">
                    Consider deploying excess cash (10.5% above target)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant={transaction.type === 'BUY' ? 'default' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                      <div>
                        <div className="font-medium">{transaction.symbol}</div>
                        <div className="text-sm text-gray-600">
                          {transaction.quantity} @ {formatCurrency(transaction.price)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(transaction.total)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PortfolioManagement