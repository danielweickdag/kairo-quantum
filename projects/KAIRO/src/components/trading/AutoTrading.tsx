'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Play,
  Pause,
  Square,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  Target,
  Shield,
  Zap,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bot,
  Code,
  FileText
} from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface TradingBot {
  id: string
  name: string
  strategy: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  isActive: boolean
  totalPnL: number
  todayPnL: number
  winRate: number
  totalTrades: number
  todayTrades: number
  maxDrawdown: number
  riskLevel: 'low' | 'medium' | 'high'
  allocatedCapital: number
  createdAt: Date
  lastActivity: Date
  settings: BotSettings
}

interface BotSettings {
  maxPositionSize: number
  stopLoss: number
  takeProfit: number
  maxDailyLoss: number
  maxDailyTrades: number
  allowedSymbols: string[]
  timeframes: string[]
  riskPerTrade: number
  enableTrailingStop: boolean
  trailingStopDistance: number
}

interface TradeExecution {
  id: string
  botId: string
  botName: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  quantity: number
  price: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  timestamp: Date
  pnl?: number
  reason: string
}

interface RiskRule {
  id: string
  name: string
  type: 'position_size' | 'daily_loss' | 'drawdown' | 'correlation' | 'volatility'
  threshold: number
  action: 'pause' | 'reduce' | 'stop' | 'alert'
  isEnabled: boolean
}

const AutoTrading: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bots')
  const [bots, setBots] = useState<TradingBot[]>([])
  const [executions, setExecutions] = useState<TradeExecution[]>([])
  const [riskRules, setRiskRules] = useState<RiskRule[]>([])
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [globalPause, setGlobalPause] = useState(false)
  const [emergencyStop, setEmergencyStop] = useState(false)

  useEffect(() => {
    // Generate mock data
    const generateMockData = () => {
      const mockBots: TradingBot[] = [
        {
          id: 'bot1',
          name: 'Momentum Scalper',
          strategy: 'momentum_scalping',
          status: 'running',
          isActive: true,
          totalPnL: 12450.75,
          todayPnL: 850.25,
          winRate: 68.5,
          totalTrades: 1247,
          todayTrades: 23,
          maxDrawdown: -5.2,
          riskLevel: 'medium',
          allocatedCapital: 50000,
          createdAt: new Date('2024-01-15'),
          lastActivity: new Date(Date.now() - 2 * 60 * 1000),
          settings: {
            maxPositionSize: 5000,
            stopLoss: 2,
            takeProfit: 4,
            maxDailyLoss: 1000,
            maxDailyTrades: 50,
            allowedSymbols: ['BTC/USD', 'ETH/USD', 'ADA/USD'],
            timeframes: ['1m', '5m'],
            riskPerTrade: 1,
            enableTrailingStop: true,
            trailingStopDistance: 1.5
          }
        },
        {
          id: 'bot2',
          name: 'Mean Reversion Pro',
          strategy: 'mean_reversion',
          status: 'paused',
          isActive: false,
          totalPnL: 8920.50,
          todayPnL: -125.75,
          winRate: 72.3,
          totalTrades: 892,
          todayTrades: 8,
          maxDrawdown: -3.8,
          riskLevel: 'low',
          allocatedCapital: 30000,
          createdAt: new Date('2024-02-01'),
          lastActivity: new Date(Date.now() - 15 * 60 * 1000),
          settings: {
            maxPositionSize: 3000,
            stopLoss: 1.5,
            takeProfit: 3,
            maxDailyLoss: 500,
            maxDailyTrades: 20,
            allowedSymbols: ['BTC/USD', 'ETH/USD'],
            timeframes: ['15m', '1h'],
            riskPerTrade: 0.5,
            enableTrailingStop: false,
            trailingStopDistance: 0
          }
        },
        {
          id: 'bot3',
          name: 'Breakout Hunter',
          strategy: 'breakout',
          status: 'error',
          isActive: false,
          totalPnL: -1250.25,
          todayPnL: 0,
          winRate: 45.2,
          totalTrades: 156,
          todayTrades: 0,
          maxDrawdown: -12.5,
          riskLevel: 'high',
          allocatedCapital: 20000,
          createdAt: new Date('2024-03-10'),
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          settings: {
            maxPositionSize: 8000,
            stopLoss: 3,
            takeProfit: 6,
            maxDailyLoss: 2000,
            maxDailyTrades: 30,
            allowedSymbols: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'MATIC/USD'],
            timeframes: ['5m', '15m', '1h'],
            riskPerTrade: 2,
            enableTrailingStop: true,
            trailingStopDistance: 2
          }
        }
      ]

      const mockExecutions: TradeExecution[] = [
        {
          id: 'exec1',
          botId: 'bot1',
          botName: 'Momentum Scalper',
          symbol: 'BTC/USD',
          side: 'buy',
          type: 'market',
          quantity: 0.1,
          price: 43250,
          status: 'filled',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          pnl: 125.50,
          reason: 'Momentum breakout signal'
        },
        {
          id: 'exec2',
          botId: 'bot1',
          botName: 'Momentum Scalper',
          symbol: 'ETH/USD',
          side: 'sell',
          type: 'limit',
          quantity: 2.5,
          price: 2450,
          status: 'pending',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          reason: 'Take profit target reached'
        },
        {
          id: 'exec3',
          botId: 'bot2',
          botName: 'Mean Reversion Pro',
          symbol: 'BTC/USD',
          side: 'buy',
          type: 'limit',
          quantity: 0.05,
          price: 42800,
          status: 'cancelled',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          reason: 'Price moved away from target'
        }
      ]

      const mockRiskRules: RiskRule[] = [
        {
          id: 'rule1',
          name: 'Daily Loss Limit',
          type: 'daily_loss',
          threshold: 2000,
          action: 'pause',
          isEnabled: true
        },
        {
          id: 'rule2',
          name: 'Max Drawdown',
          type: 'drawdown',
          threshold: 10,
          action: 'stop',
          isEnabled: true
        },
        {
          id: 'rule3',
          name: 'Position Size Limit',
          type: 'position_size',
          threshold: 10000,
          action: 'reduce',
          isEnabled: true
        },
        {
          id: 'rule4',
          name: 'High Volatility',
          type: 'volatility',
          threshold: 5,
          action: 'alert',
          isEnabled: false
        }
      ]

      setBots(mockBots)
      setExecutions(mockExecutions)
      setRiskRules(mockRiskRules)
    }

    generateMockData()
  }, [])

  const toggleBot = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { 
            ...bot, 
            isActive: !bot.isActive,
            status: !bot.isActive ? 'running' : 'paused'
          }
        : bot
    ))
  }

  const stopBot = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, isActive: false, status: 'stopped' }
        : bot
    ))
  }

  const deleteBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId))
  }

  const toggleGlobalPause = () => {
    setGlobalPause(!globalPause)
    setBots(prev => prev.map(bot => ({
      ...bot,
      isActive: globalPause ? bot.isActive : false,
      status: globalPause ? bot.status : 'paused'
    })))
  }

  const handleEmergencyStop = () => {
    setEmergencyStop(true)
    setBots(prev => prev.map(bot => ({
      ...bot,
      isActive: false,
      status: 'stopped'
    })))
  }

  const toggleRiskRule = (ruleId: string) => {
    setRiskRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isEnabled: !rule.isEnabled }
        : rule
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'stopped': return 'text-gray-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'stopped': return <Square className="w-4 h-4" />
      case 'error': return <XCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Auto Trading</h2>
          <Badge variant="outline">
            {bots.filter(bot => bot.isActive).length} / {bots.length} active
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={globalPause ? 'default' : 'outline'} 
            size="sm"
            onClick={toggleGlobalPause}
          >
            {globalPause ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {globalPause ? 'Resume All' : 'Pause All'}
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleEmergencyStop}
            disabled={emergencyStop}
          >
            <Square className="w-4 h-4 mr-2" />
            Emergency Stop
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Bot
          </Button>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencyStop && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Emergency stop activated. All trading bots have been stopped. Review your positions and restart manually when ready.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-4">
          {/* Bot Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card key={bot.id} className={cn(
                "relative",
                bot.isActive && "ring-2 ring-green-200"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5" />
                      <CardTitle className="text-sm">{bot.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={cn('flex items-center space-x-1', getStatusColor(bot.status))}>
                        {getStatusIcon(bot.status)}
                        <span className="text-xs font-medium">{bot.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{bot.strategy}</Badge>
                    <Badge className={cn('text-xs', getRiskLevelColor(bot.riskLevel))}>
                      {bot.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-600">Total P&L</div>
                      <div className={cn('font-medium', bot.totalPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(bot.totalPnL)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Today P&L</div>
                      <div className={cn('font-medium', bot.todayPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(bot.todayPnL)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Win Rate</div>
                      <div className="font-medium">{bot.winRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Trades</div>
                      <div className="font-medium">{bot.todayTrades} / {bot.totalTrades}</div>
                    </div>
                  </div>
                  
                  {/* Capital Allocation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Allocated Capital</span>
                      <span>{formatCurrency(bot.allocatedCapital)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min((Math.abs(bot.totalPnL) / bot.allocatedCapital) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={bot.isActive}
                        onCheckedChange={() => toggleBot(bot.id)}
                        disabled={emergencyStop}
                      />
                      <Label className="text-xs">Active</Label>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" className="p-1 h-auto">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-1 h-auto">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-1 h-auto">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="p-1 h-auto text-red-600"
                        onClick={() => deleteBot(bot.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Recent Executions</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Bot</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Side</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Quantity</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">P&L</th>
                      <th className="text-left p-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.map((execution) => (
                      <tr key={execution.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{execution.timestamp.toLocaleTimeString()}</td>
                        <td className="p-2">
                          <Badge variant="outline" className="text-xs">{execution.botName}</Badge>
                        </td>
                        <td className="p-2 font-medium">{execution.symbol}</td>
                        <td className="p-2">
                          <Badge variant={execution.side === 'buy' ? 'default' : 'destructive'}>
                            {execution.side.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2">{execution.type}</td>
                        <td className="p-2">{execution.quantity}</td>
                        <td className="p-2">{formatCurrency(execution.price)}</td>
                        <td className="p-2">
                          <Badge 
                            variant={
                              execution.status === 'filled' ? 'default' :
                              execution.status === 'pending' ? 'secondary' :
                              execution.status === 'cancelled' ? 'outline' : 'destructive'
                            }
                          >
                            {execution.status}
                          </Badge>
                        </td>
                        <td className={cn(
                          'p-2 font-medium',
                          execution.pnl && execution.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {execution.pnl ? formatCurrency(execution.pnl) : '-'}
                        </td>
                        <td className="p-2 text-xs text-gray-600 max-w-32 truncate">
                          {execution.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          {/* Risk Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Risk Management Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <Switch 
                      checked={rule.isEnabled}
                      onCheckedChange={() => toggleRiskRule(rule.id)}
                    />
                    <div>
                      <div className="font-medium text-sm">{rule.name}</div>
                      <div className="text-xs text-gray-600">
                        {rule.type.replace('_', ' ')} • threshold: {rule.threshold} • action: {rule.action}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={rule.isEnabled ? 'default' : 'outline'}>
                      {rule.isEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="outline" size="sm" className="p-1 h-auto">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Risk Rule
              </Button>
            </CardContent>
          </Card>

          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Portfolio Risk</span>
                </div>
                <div className="text-2xl font-bold">12.5%</div>
                <div className="text-xs text-gray-600">Within acceptable range</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Risk-Adjusted Return</span>
                </div>
                <div className="text-2xl font-bold">1.85</div>
                <div className="text-xs text-gray-600">Sharpe ratio</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Max Exposure</span>
                </div>
                <div className="text-2xl font-bold">75%</div>
                <div className="text-xs text-gray-600">Of allocated capital</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bot Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Performance Comparison Chart</p>
                    <p className="text-sm">Bot performance metrics would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Execution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p>Trade Execution Timeline</p>
                    <p className="text-sm">Execution history would render here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strategy Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Strategy Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                  <div className="font-medium mb-2">Momentum Strategies</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Return:</span>
                      <span className="font-medium text-green-600">+18.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span>68.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Trade:</span>
                      <span>$125.50</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded">
                  <div className="font-medium mb-2">Mean Reversion</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Return:</span>
                      <span className="font-medium text-green-600">+12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span>72.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Trade:</span>
                      <span>$89.20</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded">
                  <div className="font-medium mb-2">Breakout Strategies</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Return:</span>
                      <span className="font-medium text-red-600">-5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span>45.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Trade:</span>
                      <span>-$25.75</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AutoTrading