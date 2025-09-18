'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Percent,
  Target,
  Clock,
  Award,
  AlertTriangle,
  Activity,
  Zap
} from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface PerformanceMetric {
  label: string
  value: number
  change: number
  format: 'currency' | 'percentage' | 'number'
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
}

interface TradeRecord {
  id: string
  symbol: string
  side: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  pnlPercent: number
  entryTime: Date
  exitTime: Date
  duration: number
  strategy: string
}

interface MonthlyPerformance {
  month: string
  return: number
  trades: number
  winRate: number
}

interface RiskMetric {
  name: string
  value: number
  threshold: number
  status: 'good' | 'warning' | 'danger'
}

const PerformanceAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('1M')
  const [selectedStrategy, setSelectedStrategy] = useState('all')
  const [showBenchmark, setShowBenchmark] = useState(true)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>([])
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([])

  const timeRanges = [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'ALL' }
  ]

  const strategies = [
    { label: 'All Strategies', value: 'all' },
    { label: 'Momentum Strategy', value: 'momentum' },
    { label: 'Mean Reversion', value: 'mean_reversion' },
    { label: 'Breakout Strategy', value: 'breakout' },
    { label: 'Scalping Bot', value: 'scalping' }
  ]

  useEffect(() => {
    // Generate mock performance data
    const generateMockData = () => {
      // Performance Metrics
      const metrics: PerformanceMetric[] = [
        {
          label: 'Total P&L',
          value: 45230.50,
          change: 12.5,
          format: 'currency',
          icon: <DollarSign className="w-4 h-4" />,
          trend: 'up'
        },
        {
          label: 'Total Return',
          value: 23.8,
          change: 5.2,
          format: 'percentage',
          icon: <TrendingUp className="w-4 h-4" />,
          trend: 'up'
        },
        {
          label: 'Win Rate',
          value: 68.5,
          change: -2.1,
          format: 'percentage',
          icon: <Target className="w-4 h-4" />,
          trend: 'down'
        },
        {
          label: 'Sharpe Ratio',
          value: 1.85,
          change: 0.15,
          format: 'number',
          icon: <Award className="w-4 h-4" />,
          trend: 'up'
        },
        {
          label: 'Max Drawdown',
          value: -8.2,
          change: 1.3,
          format: 'percentage',
          icon: <TrendingDown className="w-4 h-4" />,
          trend: 'up'
        },
        {
          label: 'Avg Trade Duration',
          value: 4.2,
          change: -0.8,
          format: 'number',
          icon: <Clock className="w-4 h-4" />,
          trend: 'down'
        }
      ]

      // Trade History
      const trades: TradeRecord[] = []
      const symbols = ['BTC/USD', 'ETH/USD', 'ADA/USD', 'SOL/USD', 'MATIC/USD']
      const strategies = ['momentum', 'mean_reversion', 'breakout', 'scalping']
      
      for (let i = 0; i < 50; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)]
        const side = Math.random() > 0.5 ? 'long' : 'short'
        const entryPrice = Math.random() * 50000 + 20000
        const priceChange = (Math.random() - 0.5) * 0.1
        const exitPrice = entryPrice * (1 + priceChange)
        const quantity = Math.random() * 2 + 0.1
        const pnl = (exitPrice - entryPrice) * quantity * (side === 'short' ? -1 : 1)
        const pnlPercent = ((exitPrice - entryPrice) / entryPrice) * 100 * (side === 'short' ? -1 : 1)
        const entryTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        const duration = Math.random() * 24 * 60 * 60 * 1000 // Random duration up to 24 hours
        const exitTime = new Date(entryTime.getTime() + duration)
        
        trades.push({
          id: `trade_${i}`,
          symbol,
          side,
          entryPrice,
          exitPrice,
          quantity,
          pnl,
          pnlPercent,
          entryTime,
          exitTime,
          duration: duration / (1000 * 60 * 60), // Convert to hours
          strategy: strategies[Math.floor(Math.random() * strategies.length)]
        })
      }

      // Monthly Performance
      const months: MonthlyPerformance[] = [
        { month: 'Jan 2024', return: 8.5, trades: 45, winRate: 72 },
        { month: 'Feb 2024', return: -2.1, trades: 38, winRate: 58 },
        { month: 'Mar 2024', return: 12.3, trades: 52, winRate: 75 },
        { month: 'Apr 2024', return: 5.7, trades: 41, winRate: 65 },
        { month: 'May 2024', return: -1.8, trades: 33, winRate: 55 },
        { month: 'Jun 2024', return: 15.2, trades: 48, winRate: 78 }
      ]

      // Risk Metrics
      const risks: RiskMetric[] = [
        { name: 'Portfolio Risk', value: 15.2, threshold: 20, status: 'good' },
        { name: 'Concentration Risk', value: 25.8, threshold: 30, status: 'warning' },
        { name: 'Leverage Ratio', value: 2.1, threshold: 3, status: 'good' },
        { name: 'VaR (95%)', value: 8.5, threshold: 10, status: 'good' },
        { name: 'Correlation Risk', value: 0.65, threshold: 0.8, status: 'good' }
      ]

      setPerformanceMetrics(metrics)
      setTradeHistory(trades.sort((a, b) => b.exitTime.getTime() - a.exitTime.getTime()))
      setMonthlyPerformance(months)
      setRiskMetrics(risks)
    }

    generateMockData()
  }, [timeRange, selectedStrategy])

  const exportData = () => {
    console.log('Exporting performance data...')
  }

  const refreshData = () => {
    console.log('Refreshing data...')
  }

  const getMetricColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'danger': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency': return formatCurrency(value)
      case 'percentage': return formatPercent(value)
      default: return value.toFixed(2)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <Badge variant="outline">Live</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label>Time Range:</Label>
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label>Strategy:</Label>
          <select 
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="px-3 py-1 border rounded text-sm"
          >
            {strategies.map((strategy) => (
              <option key={strategy.value} value={strategy.value}>
                {strategy.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch checked={showBenchmark} onCheckedChange={setShowBenchmark} />
          <Label>Show Benchmark</Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {metric.icon}
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <Badge variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {formatValue(metric.value, metric.format)}
                  </div>
                  <div className={cn('text-sm', getMetricColor(metric.trend))}>
                    {metric.change > 0 ? '+' : ''}{formatPercent(metric.change)} vs last period
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Equity Curve */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Portfolio Value Over Time</p>
                    <p className="text-sm">Interactive chart would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drawdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Drawdown Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingDown className="w-12 h-12 mx-auto mb-2" />
                    <p>Drawdown Periods</p>
                    <p className="text-sm">Risk visualization would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Strategy Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {strategies.slice(1).map((strategy, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="font-medium mb-2">{strategy.label}</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Return:</span>
                        <span className="font-medium text-green-600">+{(Math.random() * 20 + 5).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trades:</span>
                        <span>{Math.floor(Math.random() * 50 + 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Win Rate:</span>
                        <span>{(Math.random() * 30 + 50).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Recent Trades</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Side</th>
                      <th className="text-left p-2">Entry</th>
                      <th className="text-left p-2">Exit</th>
                      <th className="text-left p-2">P&L</th>
                      <th className="text-left p-2">P&L %</th>
                      <th className="text-left p-2">Duration</th>
                      <th className="text-left p-2">Strategy</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.slice(0, 10).map((trade) => (
                      <tr key={trade.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{trade.symbol}</td>
                        <td className="p-2">
                          <Badge variant={trade.side === 'long' ? 'default' : 'destructive'}>
                            {trade.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2">{formatCurrency(trade.entryPrice)}</td>
                        <td className="p-2">{formatCurrency(trade.exitPrice)}</td>
                        <td className={cn('p-2 font-medium', trade.pnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(trade.pnl)}
                        </td>
                        <td className={cn('p-2 font-medium', trade.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatPercent(trade.pnlPercent)}
                        </td>
                        <td className="p-2">{trade.duration.toFixed(1)}h</td>
                        <td className="p-2">
                          <Badge variant="outline">{trade.strategy}</Badge>
                        </td>
                        <td className="p-2">{trade.exitTime.toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyPerformance.map((month, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="font-medium mb-2">{month.month}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Return:</span>
                        <span className={cn('font-medium', month.return >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatPercent(month.return)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trades:</span>
                        <span>{month.trades}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Win Rate:</span>
                        <span>{month.winRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Monthly Returns Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Monthly Performance Visualization</p>
                  <p className="text-sm">Bar chart would render here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskMetrics.map((risk, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{risk.name}</span>
                    <AlertTriangle className={cn('w-4 h-4', getRiskColor(risk.status))} />
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {risk.value.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Threshold: {risk.threshold}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={cn(
                        'h-2 rounded-full',
                        risk.status === 'good' ? 'bg-green-500' :
                        risk.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min((risk.value / risk.threshold) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <PieChart className="w-12 h-12 mx-auto mb-2" />
                    <p>Portfolio Risk Breakdown</p>
                    <p className="text-sm">Pie chart would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">VaR Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p>Value at Risk Over Time</p>
                    <p className="text-sm">Risk timeline would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PerformanceAnalytics