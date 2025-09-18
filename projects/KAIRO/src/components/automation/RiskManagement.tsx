'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Activity,
  Settings,
  Zap,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  Percent,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  Minus
} from 'lucide-react';

interface RiskRule {
  id: string;
  name: string;
  type: 'stop_loss' | 'take_profit' | 'max_drawdown' | 'position_size' | 'correlation';
  enabled: boolean;
  threshold: number;
  action: 'close_position' | 'reduce_position' | 'pause_trading' | 'alert_only';
  priority: 'low' | 'medium' | 'high' | 'critical';
  triggeredCount: number;
  lastTriggered?: string;
}

interface RiskAlert {
  id: string;
  type: 'warning' | 'danger' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  ruleId?: string;
  traderId?: string;
  symbol?: string;
}

interface PositionRisk {
  id: string;
  symbol: string;
  traderId: string;
  traderName: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  riskScore: number;
  stopLoss?: number;
  takeProfit?: number;
  maxDrawdown: number;
  exposure: number;
}

interface RiskMetrics {
  totalExposure: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  var95: number; // Value at Risk 95%
  correlationRisk: number;
  leverageRatio: number;
  riskScore: number;
}

const mockRiskRules: RiskRule[] = [
  {
    id: '1',
    name: 'Global Stop Loss',
    type: 'stop_loss',
    enabled: true,
    threshold: -5.0,
    action: 'close_position',
    priority: 'critical',
    triggeredCount: 3,
    lastTriggered: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    name: 'Take Profit Target',
    type: 'take_profit',
    enabled: true,
    threshold: 15.0,
    action: 'close_position',
    priority: 'medium',
    triggeredCount: 8,
    lastTriggered: '2024-01-15T08:45:00Z'
  },
  {
    id: '3',
    name: 'Maximum Drawdown',
    type: 'max_drawdown',
    enabled: true,
    threshold: -10.0,
    action: 'pause_trading',
    priority: 'high',
    triggeredCount: 1,
    lastTriggered: '2024-01-14T16:20:00Z'
  },
  {
    id: '4',
    name: 'Position Size Limit',
    type: 'position_size',
    enabled: true,
    threshold: 25.0,
    action: 'reduce_position',
    priority: 'medium',
    triggeredCount: 5,
    lastTriggered: '2024-01-15T07:15:00Z'
  },
  {
    id: '5',
    name: 'Correlation Risk',
    type: 'correlation',
    enabled: false,
    threshold: 0.8,
    action: 'alert_only',
    priority: 'low',
    triggeredCount: 0
  }
];

const mockRiskAlerts: RiskAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Stop Loss Triggered',
    message: 'BTCUSDT position closed due to -5.2% loss',
    timestamp: '2024-01-15T10:30:00Z',
    resolved: false,
    ruleId: '1',
    traderId: '1',
    symbol: 'BTCUSDT'
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Correlation Detected',
    message: 'ETH and BTC positions showing 0.85 correlation',
    timestamp: '2024-01-15T10:15:00Z',
    resolved: false,
    ruleId: '5'
  },
  {
    id: '3',
    type: 'danger',
    title: 'Position Size Exceeded',
    message: 'ADAUSDT position reduced from 30% to 25% of portfolio',
    timestamp: '2024-01-15T09:45:00Z',
    resolved: true,
    ruleId: '4',
    traderId: '2',
    symbol: 'ADAUSDT'
  }
];

const mockPositions: PositionRisk[] = [
  {
    id: '1',
    symbol: 'BTCUSDT',
    traderId: '1',
    traderName: 'CryptoKing_Pro',
    side: 'long',
    size: 0.5,
    entryPrice: 43250,
    currentPrice: 42890,
    pnl: -180,
    pnlPercent: -0.83,
    riskScore: 6.5,
    stopLoss: 41087.5,
    takeProfit: 49737.5,
    maxDrawdown: -2.1,
    exposure: 21445
  },
  {
    id: '2',
    symbol: 'ETHUSDT',
    traderId: '2',
    traderName: 'SafeTrader_AI',
    side: 'long',
    size: 8.0,
    entryPrice: 2580,
    currentPrice: 2645,
    pnl: 520,
    pnlPercent: 2.52,
    riskScore: 4.2,
    stopLoss: 2451,
    takeProfit: 2967,
    maxDrawdown: -1.8,
    exposure: 21160
  },
  {
    id: '3',
    symbol: 'ADAUSDT',
    traderId: '3',
    traderName: 'MomentumMaster',
    side: 'short',
    size: 15000,
    entryPrice: 0.48,
    currentPrice: 0.465,
    pnl: 225,
    pnlPercent: 3.13,
    riskScore: 7.8,
    stopLoss: 0.504,
    maxDrawdown: -0.5,
    exposure: 6975
  },
  {
    id: '4',
    symbol: 'SOLUSDT',
    traderId: '4',
    traderName: 'DiversifyBot',
    side: 'long',
    size: 50,
    entryPrice: 98.45,
    currentPrice: 102.30,
    pnl: 192.5,
    pnlPercent: 3.91,
    riskScore: 5.1,
    stopLoss: 93.53,
    takeProfit: 113.22,
    maxDrawdown: -1.2,
    exposure: 5115
  }
];

const mockRiskMetrics: RiskMetrics = {
  totalExposure: 54695,
  maxDrawdown: -8.7,
  sharpeRatio: 1.85,
  volatility: 24.3,
  var95: -2847.5,
  correlationRisk: 0.65,
  leverageRatio: 2.1,
  riskScore: 6.2
};

export default function RiskManagement() {
  const [riskRules, setRiskRules] = useState<RiskRule[]>(mockRiskRules);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockRiskAlerts);
  const [positions, setPositions] = useState<PositionRisk[]>(mockPositions);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(mockRiskMetrics);
  const [autoRiskManagement, setAutoRiskManagement] = useState(true);
  const [emergencyStop, setEmergencyStop] = useState(false);

  const toggleRiskRule = (ruleId: string) => {
    setRiskRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const resolveAlert = (alertId: string) => {
    setRiskAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 3) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    if (score <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'danger': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const unresolvedAlerts = riskAlerts.filter(alert => !alert.resolved);
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.type === 'critical');
  const activeRules = riskRules.filter(rule => rule.enabled);
  const highRiskPositions = positions.filter(pos => pos.riskScore > 7);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold">Risk Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated stop-loss and risk monitoring system</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Risk Management</span>
            <Switch checked={autoRiskManagement} onCheckedChange={setAutoRiskManagement} />
          </div>
          <Button 
            variant={emergencyStop ? "destructive" : "outline"}
            onClick={() => setEmergencyStop(!emergencyStop)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {emergencyStop ? 'Emergency Stop Active' : 'Emergency Stop'}
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Risk Rules</TabsTrigger>
          <TabsTrigger value="positions">Position Risk</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Risk Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Score</p>
                    <p className={`text-2xl font-bold ${getRiskScoreColor(riskMetrics.riskScore)}`}>
                      {riskMetrics.riskScore.toFixed(1)}/10
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exposure</p>
                    <p className="text-2xl font-bold">${riskMetrics.totalExposure.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Max Drawdown</p>
                    <p className="text-2xl font-bold text-red-500">{riskMetrics.maxDrawdown}%</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VaR (95%)</p>
                    <p className="text-2xl font-bold text-orange-500">${Math.abs(riskMetrics.var95).toLocaleString()}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management Status</CardTitle>
                <CardDescription>Current system settings and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto Risk Management</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${autoRiskManagement ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">{autoRiskManagement ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Stop</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${emergencyStop ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="font-medium">{emergencyStop ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Rules</span>
                  <span className="font-bold text-blue-500">{activeRules.length}/{riskRules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Critical Alerts</span>
                  <span className={`font-bold ${criticalAlerts.length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {criticalAlerts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High Risk Positions</span>
                  <span className={`font-bold ${highRiskPositions.length > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                    {highRiskPositions.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Events</CardTitle>
                <CardDescription>Latest risk management actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unresolvedAlerts.slice(0, 4).map(alert => (
                    <div key={alert.id} className={`p-3 border rounded ${getAlertTypeColor(alert.type)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                        </div>
                        <Badge className={alert.type === 'critical' ? 'text-red-500' : 
                                        alert.type === 'danger' ? 'text-orange-500' : 'text-yellow-500'}>
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Risk Metrics</CardTitle>
              <CardDescription>Comprehensive risk analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sharpe Ratio</span>
                    <span className="font-bold">{riskMetrics.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volatility</span>
                    <span className="font-bold">{riskMetrics.volatility}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leverage Ratio</span>
                    <span className="font-bold">{riskMetrics.leverageRatio}x</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Correlation Risk</span>
                    <span className={`font-bold ${riskMetrics.correlationRisk > 0.7 ? 'text-red-500' : 'text-green-500'}`}>
                      {riskMetrics.correlationRisk.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Portfolio Beta</span>
                    <span className="font-bold">1.23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Information Ratio</span>
                    <span className="font-bold">0.87</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Calmar Ratio</span>
                    <span className="font-bold">2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sortino Ratio</span>
                    <span className="font-bold">2.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treynor Ratio</span>
                    <span className="font-bold">0.15</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riskRules.map(rule => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority.toUpperCase()}
                      </Badge>
                      <Switch 
                        checked={rule.enabled} 
                        onCheckedChange={() => toggleRiskRule(rule.id)}
                      />
                    </div>
                  </div>
                  <CardDescription>
                    {rule.type.replace('_', ' ').toUpperCase()} • {rule.action.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Threshold</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          value={rule.threshold} 
                          className="w-20" 
                          step="0.1"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {rule.type.includes('percent') || rule.type.includes('loss') || rule.type.includes('profit') || rule.type.includes('drawdown') ? '%' : 
                           rule.type === 'correlation' ? '' : '$'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Triggered</Label>
                      <p className="font-bold text-lg">{rule.triggeredCount} times</p>
                    </div>
                  </div>
                  {rule.lastTriggered && (
                    <div>
                      <Label>Last Triggered</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(rule.lastTriggered).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Position Risk Analysis</CardTitle>
              <CardDescription>Real-time risk assessment for all positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map(position => (
                  <div key={position.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-bold text-lg">{position.symbol}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{position.traderName}</p>
                        </div>
                        <Badge className={position.side === 'long' ? 'text-green-500' : 'text-red-500'}>
                          {position.side.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Risk Score</p>
                        <p className={`text-xl font-bold ${getRiskScoreColor(position.riskScore)}`}>
                          {position.riskScore.toFixed(1)}/10
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                        <p className="font-bold">{position.size.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Entry Price</p>
                        <p className="font-bold">${position.entryPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                        <p className="font-bold">${position.currentPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Exposure</p>
                        <p className="font-bold">${position.exposure.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">P&L</p>
                        <p className={`font-bold ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">P&L %</p>
                        <p className={`font-bold ${position.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</p>
                        <p className="font-bold text-red-500">{position.maxDrawdown}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Stop Loss</p>
                        <p className="font-bold">
                          {position.stopLoss ? `$${position.stopLoss.toFixed(2)}` : 'Not Set'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Adjust Limits
                      </Button>
                      <Button size="sm" variant="outline">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        Reduce Position
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Close Position
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
              <CardDescription>All risk management alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${getAlertTypeColor(alert.type)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {alert.type === 'critical' ? <AlertTriangle className="h-5 w-5 text-red-500" /> :
                         alert.type === 'danger' ? <AlertTriangle className="h-5 w-5 text-orange-500" /> :
                         <Bell className="h-5 w-5 text-yellow-500" />}
                        <div>
                          <h3 className="font-bold">{alert.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                            {alert.symbol && ` • ${alert.symbol}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={alert.type === 'critical' ? 'text-red-500' : 
                                        alert.type === 'danger' ? 'text-orange-500' : 'text-yellow-500'}>
                          {alert.type}
                        </Badge>
                        {!alert.resolved && (
                          <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {alert.resolved && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
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
  );
}