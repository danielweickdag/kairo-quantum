'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  BellOff,
  Zap,
  Brain,
  Target,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Lightbulb,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  RefreshCw,
  Clock,
  DollarSign,
  Percent
} from 'lucide-react'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface AlertRule {
  id: string
  name: string
  type: 'gain' | 'loss' | 'volatility' | 'volume' | 'trend'
  threshold: number
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  isEnabled: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  conditions: {
    percentage?: number
    amount?: number
    consecutive?: number
    comparison: 'above' | 'below' | 'equals'
  }
  actions: {
    notification: boolean
    email: boolean
    sound: boolean
    popup: boolean
  }
  aiEnabled: boolean
  lastTriggered?: Date
}

interface AlertEvent {
  id: string
  ruleId: string
  ruleName: string
  type: 'gain' | 'loss' | 'volatility' | 'volume' | 'trend'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  value: number
  threshold: number
  timestamp: Date
  isRead: boolean
  aiInsight?: string
  recommendation?: string
  symbol?: string
}

interface AIInsight {
  id: string
  type: 'pattern' | 'anomaly' | 'opportunity' | 'risk'
  confidence: number
  message: string
  recommendation: string
  timestamp: Date
  relatedSymbols: string[]
  impact: 'positive' | 'negative' | 'neutral'
}

interface PortfolioMetrics {
  totalValue: number
  totalPnL: number
  totalPnLPercent: number
  dayPnL: number
  dayPnLPercent: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
}

const AIAlertIndicator: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValue: 125000,
    totalPnL: 12500,
    totalPnLPercent: 11.11,
    dayPnL: 850,
    dayPnLPercent: 0.68,
    volatility: 15.2,
    sharpeRatio: 1.85,
    maxDrawdown: -8.5,
    winRate: 68.5
  })

  useEffect(() => {
    // Initialize default alert rules
    const defaultRules: AlertRule[] = [
      {
        id: 'gain-5-percent',
        name: 'Significant Gain Alert',
        type: 'gain',
        threshold: 5,
        timeframe: '1d',
        isEnabled: true,
        priority: 'high',
        conditions: {
          percentage: 5,
          comparison: 'above'
        },
        actions: {
          notification: true,
          email: true,
          sound: true,
          popup: true
        },
        aiEnabled: true
      },
      {
        id: 'loss-3-percent',
        name: 'Loss Protection Alert',
        type: 'loss',
        threshold: -3,
        timeframe: '1d',
        isEnabled: true,
        priority: 'critical',
        conditions: {
          percentage: -3,
          comparison: 'below'
        },
        actions: {
          notification: true,
          email: true,
          sound: true,
          popup: true
        },
        aiEnabled: true
      },
      {
        id: 'volatility-high',
        name: 'High Volatility Warning',
        type: 'volatility',
        threshold: 20,
        timeframe: '1h',
        isEnabled: true,
        priority: 'medium',
        conditions: {
          percentage: 20,
          comparison: 'above'
        },
        actions: {
          notification: true,
          email: false,
          sound: false,
          popup: true
        },
        aiEnabled: true
      },
      {
        id: 'trend-reversal',
        name: 'AI Trend Reversal',
        type: 'trend',
        threshold: 0,
        timeframe: '15m',
        isEnabled: true,
        priority: 'high',
        conditions: {
          consecutive: 3,
          comparison: 'equals'
        },
        actions: {
          notification: true,
          email: true,
          sound: true,
          popup: true
        },
        aiEnabled: true
      }
    ]

    setAlertRules(defaultRules)

    // Generate mock alert events
    const mockEvents: AlertEvent[] = [
      {
        id: 'event1',
        ruleId: 'gain-5-percent',
        ruleName: 'Significant Gain Alert',
        type: 'gain',
        severity: 'high',
        message: 'Portfolio gained 6.2% in the last 24 hours',
        value: 6.2,
        threshold: 5,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        aiInsight: 'Strong bullish momentum detected across tech stocks',
        recommendation: 'Consider taking partial profits on overextended positions',
        symbol: 'Portfolio'
      },
      {
        id: 'event2',
        ruleId: 'volatility-high',
        ruleName: 'High Volatility Warning',
        type: 'volatility',
        severity: 'medium',
        message: 'BTC/USD volatility increased to 25.8%',
        value: 25.8,
        threshold: 20,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        aiInsight: 'Volatility spike coincides with major news event',
        recommendation: 'Reduce position sizes until volatility normalizes',
        symbol: 'BTC/USD'
      },
      {
        id: 'event3',
        ruleId: 'trend-reversal',
        ruleName: 'AI Trend Reversal',
        type: 'trend',
        severity: 'high',
        message: 'AI detected potential trend reversal in ETH/USD',
        value: 0,
        threshold: 0,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        aiInsight: 'Multiple technical indicators suggest bearish divergence',
        recommendation: 'Consider hedging ETH positions or reducing exposure',
        symbol: 'ETH/USD'
      }
    ]

    setAlertEvents(mockEvents)

    // Generate AI insights
    const mockInsights: AIInsight[] = [
      {
        id: 'insight1',
        type: 'opportunity',
        confidence: 85,
        message: 'AI identified oversold conditions in small-cap altcoins',
        recommendation: 'Consider allocating 5-10% to high-quality altcoins',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        relatedSymbols: ['ADA/USD', 'DOT/USD', 'LINK/USD'],
        impact: 'positive'
      },
      {
        id: 'insight2',
        type: 'risk',
        confidence: 92,
        message: 'Correlation between your holdings has increased significantly',
        recommendation: 'Diversify portfolio to reduce concentration risk',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        relatedSymbols: ['BTC/USD', 'ETH/USD'],
        impact: 'negative'
      },
      {
        id: 'insight3',
        type: 'pattern',
        confidence: 78,
        message: 'Historical pattern suggests potential breakout in next 24-48 hours',
        recommendation: 'Monitor key resistance levels for entry opportunities',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        relatedSymbols: ['BTC/USD'],
        impact: 'positive'
      }
    ]

    setAiInsights(mockInsights)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      // Simulate portfolio changes
      setPortfolioMetrics(prev => {
        const change = (Math.random() - 0.5) * 2 // -1% to +1%
        const newDayPnL = prev.dayPnL + (prev.totalValue * change / 100)
        const newDayPnLPercent = (newDayPnL / prev.totalValue) * 100
        
        // Check alert rules
        alertRules.forEach(rule => {
          if (!rule.isEnabled) return
          
          let shouldTrigger = false
          let value = 0
          
          switch (rule.type) {
            case 'gain':
              value = newDayPnLPercent
              shouldTrigger = value >= rule.threshold
              break
            case 'loss':
              value = newDayPnLPercent
              shouldTrigger = value <= rule.threshold
              break
            case 'volatility':
              value = prev.volatility + (Math.random() - 0.5) * 5
              shouldTrigger = value >= rule.threshold
              break
          }
          
          if (shouldTrigger && (!rule.lastTriggered || Date.now() - rule.lastTriggered.getTime() > 60000)) {
            const newEvent: AlertEvent = {
              id: `event-${Date.now()}`,
              ruleId: rule.id,
              ruleName: rule.name,
              type: rule.type,
              severity: rule.priority,
              message: `${rule.type === 'gain' ? 'Gain' : rule.type === 'loss' ? 'Loss' : 'Volatility'} alert: ${formatPercent(value)}`,
              value,
              threshold: rule.threshold,
              timestamp: new Date(),
              isRead: false,
              aiInsight: aiEnabled ? 'AI analysis in progress...' : undefined,
              symbol: 'Portfolio'
            }
            
            setAlertEvents(prev => [newEvent, ...prev.slice(0, 19)])
            
            // Update rule last triggered
            setAlertRules(prevRules => prevRules.map(r => 
              r.id === rule.id ? { ...r, lastTriggered: new Date() } : r
            ))
            
            // Play sound if enabled
            if (soundEnabled && rule.actions.sound) {
              // In a real app, you would play an actual sound
              console.log('🔔 Alert sound played')
            }
          }
        })
        
        return {
          ...prev,
          dayPnL: newDayPnL,
          dayPnLPercent: newDayPnLPercent,
          volatility: Math.max(5, Math.min(50, prev.volatility + (Math.random() - 0.5) * 2))
        }
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isEnabled, alertRules, soundEnabled, aiEnabled])

  const toggleRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
    ))
  }

  const markEventAsRead = (eventId: string) => {
    setAlertEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, isRead: true } : event
    ))
  }

  const clearAllEvents = () => {
    setAlertEvents([])
  }

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = severity === 'critical' ? 'text-red-600' : 
                     severity === 'high' ? 'text-orange-600' :
                     severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
    
    switch (type) {
      case 'gain': return <TrendingUp className={cn('w-4 h-4', iconClass)} />
      case 'loss': return <TrendingDown className={cn('w-4 h-4', iconClass)} />
      case 'volatility': return <Activity className={cn('w-4 h-4', iconClass)} />
      case 'trend': return <BarChart3 className={cn('w-4 h-4', iconClass)} />
      default: return <AlertTriangle className={cn('w-4 h-4', iconClass)} />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-green-600" />
      case 'risk': return <Shield className="w-4 h-4 text-red-600" />
      case 'pattern': return <Sparkles className="w-4 h-4 text-purple-600" />
      case 'anomaly': return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default: return <Brain className="w-4 h-4 text-blue-600" />
    }
  }

  const unreadCount = alertEvents.filter(event => !event.isRead).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain className="w-6 h-6 text-blue-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Alert Indicator</h2>
            <p className="text-sm text-gray-600">Intelligent gain/loss monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            <Label className="text-sm">Enabled</Label>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Sound Alerts</Label>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">AI Insights</Label>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Auto-clear Read</Label>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Total P&L</span>
            </div>
            <div className={cn('text-xl font-bold', portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </div>
            <div className="text-xs text-gray-600">
              {formatPercent(portfolioMetrics.totalPnLPercent)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Today P&L</span>
            </div>
            <div className={cn('text-xl font-bold', portfolioMetrics.dayPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(portfolioMetrics.dayPnL)}
            </div>
            <div className="text-xs text-gray-600">
              {formatPercent(portfolioMetrics.dayPnLPercent)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Volatility</span>
            </div>
            <div className="text-xl font-bold">
              {portfolioMetrics.volatility.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">24h rolling</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Win Rate</span>
            </div>
            <div className="text-xl font-bold">
              {portfolioMetrics.winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">All time</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiEnabled && aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3 p-3 border rounded">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{insight.message}</span>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.recommendation}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {insight.timestamp.toLocaleTimeString()}
                    </span>
                    <div className="flex space-x-1">
                      {insight.relatedSymbols.map((symbol) => (
                        <Badge key={symbol} variant="outline" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Alert Rules</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={rule.isEnabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
                <div>
                  <div className="font-medium text-sm">{rule.name}</div>
                  <div className="text-xs text-gray-600">
                    {rule.type} • {rule.threshold > 0 ? '+' : ''}{rule.threshold}% • {rule.timeframe}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={cn('text-xs', getSeverityColor(rule.priority))}>
                  {rule.priority}
                </Badge>
                {rule.aiEnabled && (
                  <Badge variant="outline" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Recent Alerts
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={clearAllEvents}>
                Clear All
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {alertEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No alerts yet</p>
              <p className="text-sm">Alerts will appear here when triggered</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {alertEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={cn(
                    'flex items-start space-x-3 p-3 border rounded cursor-pointer transition-colors',
                    !event.isRead && 'bg-blue-50 border-blue-200',
                    event.isRead && 'hover:bg-gray-50'
                  )}
                  onClick={() => markEventAsRead(event.id)}
                >
                  <div className="mt-0.5">
                    {getAlertIcon(event.type, event.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={cn('text-sm font-medium', !event.isRead && 'font-bold')}>
                        {event.message}
                      </span>
                      <Badge className={cn('text-xs', getSeverityColor(event.severity))}>
                        {event.severity}
                      </Badge>
                    </div>
                    
                    {event.aiInsight && (
                      <div className="bg-blue-50 p-2 rounded text-xs mb-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <Brain className="w-3 h-3 text-blue-600" />
                          <span className="font-medium text-blue-800">AI Insight:</span>
                        </div>
                        <p className="text-blue-700">{event.aiInsight}</p>
                        {event.recommendation && (
                          <p className="text-blue-600 mt-1">
                            <strong>Recommendation:</strong> {event.recommendation}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {event.timestamp.toLocaleString()}
                        </span>
                        {event.symbol && (
                          <Badge variant="outline" className="text-xs">
                            {event.symbol}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {event.value > 0 ? '+' : ''}{formatPercent(event.value)} 
                        (threshold: {event.threshold > 0 ? '+' : ''}{formatPercent(event.threshold)})
                      </div>
                    </div>
                  </div>
                  
                  {!event.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AIAlertIndicator