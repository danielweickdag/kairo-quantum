'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  Zap, 
  Brain,
  Activity,
  BarChart3,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface TradingStrategy {
  id: string
  name: string
  description: string
  type: 'scalping' | 'swing' | 'momentum' | 'arbitrage' | 'grid' | 'dca'
  status: 'active' | 'paused' | 'stopped'
  profitLoss: number
  winRate: number
  totalTrades: number
  riskLevel: 'low' | 'medium' | 'high'
  allocation: number
  createdAt: string
  lastActive: string
}

interface AutomationSettings {
  maxDailyLoss: number
  maxPositionSize: number
  stopLossPercentage: number
  takeProfitPercentage: number
  enableEmergencyStop: boolean
  enableNewsFilter: boolean
  tradingHours: {
    start: string
    end: string
    timezone: string
  }
  allowedPairs: string[]
  riskManagement: {
    maxDrawdown: number
    positionSizing: 'fixed' | 'percentage' | 'kelly'
    correlationLimit: number
  }
}

interface PerformanceMetrics {
  totalProfit: number
  totalLoss: number
  winRate: number
  sharpeRatio: number
  maxDrawdown: number
  averageReturn: number
  totalTrades: number
  profitFactor: number
}

export default function AutomatedTradingConfig() {
  const [activeTab, setActiveTab] = useState('strategies')
  const [strategies, setStrategies] = useState<TradingStrategy[]>([])
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>({
    maxDailyLoss: 1000,
    maxPositionSize: 5000,
    stopLossPercentage: 2,
    takeProfitPercentage: 4,
    enableEmergencyStop: true,
    enableNewsFilter: true,
    tradingHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'UTC'
    },
    allowedPairs: ['BTC/USD', 'ETH/USD', 'ADA/USD'],
    riskManagement: {
      maxDrawdown: 10,
      positionSizing: 'percentage',
      correlationLimit: 0.7
    }
  })
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalProfit: 12450.75,
    totalLoss: -3200.25,
    winRate: 68.5,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
    averageReturn: 2.3,
    totalTrades: 247,
    profitFactor: 3.89
  })
  const [isCreatingStrategy, setIsCreatingStrategy] = useState(false)
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: '',
    type: 'momentum' as const,
    allocation: 1000,
    riskLevel: 'medium' as const
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Mock data for strategies
  useEffect(() => {
    setStrategies([
      {
        id: '1',
        name: 'Momentum Scalper',
        description: 'High-frequency momentum-based scalping strategy',
        type: 'scalping',
        status: 'active',
        profitLoss: 2450.75,
        winRate: 72.3,
        totalTrades: 89,
        riskLevel: 'high',
        allocation: 5000,
        createdAt: '2024-01-15',
        lastActive: '2 minutes ago'
      },
      {
        id: '2',
        name: 'Swing Trader Pro',
        description: 'Medium-term swing trading with technical analysis',
        type: 'swing',
        status: 'active',
        profitLoss: 1850.25,
        winRate: 65.8,
        totalTrades: 34,
        riskLevel: 'medium',
        allocation: 3000,
        createdAt: '2024-01-10',
        lastActive: '15 minutes ago'
      },
      {
        id: '3',
        name: 'Grid Bot Alpha',
        description: 'Automated grid trading for sideways markets',
        type: 'grid',
        status: 'paused',
        profitLoss: -320.50,
        winRate: 58.2,
        totalTrades: 156,
        riskLevel: 'low',
        allocation: 2000,
        createdAt: '2024-01-05',
        lastActive: '2 hours ago'
      }
    ])
  }, [])

  const handleCreateStrategy = async () => {
    if (!newStrategy.name || !newStrategy.description) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const strategy: TradingStrategy = {
      id: Date.now().toString(),
      ...newStrategy,
      status: 'stopped',
      profitLoss: 0,
      winRate: 0,
      totalTrades: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Never'
    }
    
    setStrategies(prev => [...prev, strategy])
    setNewStrategy({
      name: '',
      description: '',
      type: 'momentum',
      allocation: 1000,
      riskLevel: 'medium'
    })
    setIsCreatingStrategy(false)
    setIsLoading(false)
  }

  const toggleStrategyStatus = (id: string) => {
    setStrategies(prev => prev.map(strategy => {
      if (strategy.id === id) {
        const newStatus = strategy.status === 'active' ? 'paused' : 'active'
        return { ...strategy, status: newStatus, lastActive: newStatus === 'active' ? 'Just now' : strategy.lastActive }
      }
      return strategy
    }))
  }

  const deleteStrategy = (id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Trading</h2>
          <p className="text-muted-foreground">Configure and manage your trading strategies</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isCreatingStrategy} onOpenChange={setIsCreatingStrategy}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Strategy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Trading Strategy</DialogTitle>
                <DialogDescription>
                  Set up a new automated trading strategy
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="strategy-name">Strategy Name</Label>
                  <Input
                    id="strategy-name"
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter strategy name"
                  />
                </div>
                <div>
                  <Label htmlFor="strategy-description">Description</Label>
                  <Input
                    id="strategy-description"
                    value={newStrategy.description}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your strategy"
                  />
                </div>
                <div>
                  <Label htmlFor="strategy-type">Strategy Type</Label>
                  <Select value={newStrategy.type} onValueChange={(value: any) => setNewStrategy(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scalping">Scalping</SelectItem>
                      <SelectItem value="swing">Swing Trading</SelectItem>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                      <SelectItem value="grid">Grid Trading</SelectItem>
                      <SelectItem value="dca">DCA (Dollar Cost Average)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="strategy-allocation">Initial Allocation ($)</Label>
                  <Input
                    id="strategy-allocation"
                    type="number"
                    value={newStrategy.allocation}
                    onChange={(e) => setNewStrategy(prev => ({ ...prev, allocation: Number(e.target.value) }))}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="strategy-risk">Risk Level</Label>
                  <Select value={newStrategy.riskLevel} onValueChange={(value: any) => setNewStrategy(prev => ({ ...prev, riskLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreatingStrategy(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateStrategy} disabled={isLoading}>
                    {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                    Create Strategy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={cn("text-2xl font-bold", performanceMetrics.totalProfit > 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(performanceMetrics.totalProfit - Math.abs(performanceMetrics.totalLoss))}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.winRate}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{performanceMetrics.totalTrades}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <p className="text-2xl font-bold">{performanceMetrics.sharpeRatio}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategies">Active Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Strategies</CardTitle>
              <CardDescription>
                Manage your automated trading strategies and monitor their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-3 h-3 rounded-full", getStatusColor(strategy.status))} />
                        <div>
                          <h4 className="font-semibold">{strategy.name}</h4>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                          {strategy.riskLevel} risk
                        </Badge>
                        <Badge variant="outline">
                          {strategy.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">P&L</p>
                        <p className={cn("font-semibold", strategy.profitLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(strategy.profitLoss)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="font-semibold">{strategy.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Trades</p>
                        <p className="font-semibold">{strategy.totalTrades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allocation</p>
                        <p className="font-semibold">{formatCurrency(strategy.allocation)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Active</p>
                        <p className="font-semibold text-sm">{strategy.lastActive}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={strategy.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => toggleStrategyStatus(strategy.id)}
                        >
                          {strategy.status === 'active' ? (
                            <><Pause className="w-4 h-4 mr-1" /> Pause</>
                          ) : (
                            <><Play className="w-4 h-4 mr-1" /> Start</>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4 mr-1" />
                          Clone
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteStrategy(strategy.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Profit:</span>
                  <span className="text-green-600 font-semibold">{formatCurrency(performanceMetrics.totalProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Loss:</span>
                  <span className="text-red-600 font-semibold">{formatCurrency(performanceMetrics.totalLoss)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Factor:</span>
                  <span className="font-semibold">{performanceMetrics.profitFactor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Drawdown:</span>
                  <span className="text-red-600 font-semibold">{performanceMetrics.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Return:</span>
                  <span className="text-green-600 font-semibold">{performanceMetrics.averageReturn}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Win Rate</span>
                    <span>{performanceMetrics.winRate}%</span>
                  </div>
                  <Progress value={performanceMetrics.winRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Sharpe Ratio</span>
                    <span>{performanceMetrics.sharpeRatio}</span>
                  </div>
                  <Progress value={(performanceMetrics.sharpeRatio / 3) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Risk Score</span>
                    <span>Medium</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management Settings</CardTitle>
              <CardDescription>
                Configure global risk parameters for all trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="max-daily-loss">Max Daily Loss ($)</Label>
                    <Input
                      id="max-daily-loss"
                      type="number"
                      value={automationSettings.maxDailyLoss}
                      onChange={(e) => setAutomationSettings(prev => ({ ...prev, maxDailyLoss: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-position-size">Max Position Size ($)</Label>
                    <Input
                      id="max-position-size"
                      type="number"
                      value={automationSettings.maxPositionSize}
                      onChange={(e) => setAutomationSettings(prev => ({ ...prev, maxPositionSize: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stop-loss">Default Stop Loss (%)</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      step="0.1"
                      value={automationSettings.stopLossPercentage}
                      onChange={(e) => setAutomationSettings(prev => ({ ...prev, stopLossPercentage: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="take-profit">Default Take Profit (%)</Label>
                    <Input
                      id="take-profit"
                      type="number"
                      step="0.1"
                      value={automationSettings.takeProfitPercentage}
                      onChange={(e) => setAutomationSettings(prev => ({ ...prev, takeProfitPercentage: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emergency-stop">Emergency Stop</Label>
                    <Switch
                      id="emergency-stop"
                      checked={automationSettings.enableEmergencyStop}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, enableEmergencyStop: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="news-filter">News Event Filter</Label>
                    <Switch
                      id="news-filter"
                      checked={automationSettings.enableNewsFilter}
                      onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, enableNewsFilter: checked }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-drawdown">Max Drawdown (%)</Label>
                    <Input
                      id="max-drawdown"
                      type="number"
                      step="0.1"
                      value={automationSettings.riskManagement.maxDrawdown}
                      onChange={(e) => setAutomationSettings(prev => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement,
                          maxDrawdown: Number(e.target.value)
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-sizing">Position Sizing Method</Label>
                    <Select 
                      value={automationSettings.riskManagement.positionSizing} 
                      onValueChange={(value: any) => setAutomationSettings(prev => ({
                        ...prev,
                        riskManagement: {
                          ...prev.riskManagement,
                          positionSizing: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage of Portfolio</SelectItem>
                        <SelectItem value="kelly">Kelly Criterion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-3">Trading Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={automationSettings.tradingHours.start}
                      onChange={(e) => setAutomationSettings(prev => ({
                        ...prev,
                        tradingHours: {
                          ...prev.tradingHours,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={automationSettings.tradingHours.end}
                      onChange={(e) => setAutomationSettings(prev => ({
                        ...prev,
                        tradingHours: {
                          ...prev.tradingHours,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={automationSettings.tradingHours.timezone}
                      onValueChange={(value) => setAutomationSettings(prev => ({
                        ...prev,
                        tradingHours: {
                          ...prev.tradingHours,
                          timezone: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Alerts */}
      {automationSettings.enableEmergencyStop && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Emergency stop is enabled. All trading will halt if daily loss exceeds {formatCurrency(automationSettings.maxDailyLoss)}.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}