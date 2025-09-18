'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  Square,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  Users,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface RiskLimits {
  maxDailyLoss: number;
  maxPositionSize: number;
  maxPortfolioRisk: number;
  maxDailyTrades: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxLeverage: number;
  allowedSymbols: string[];
  tradingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface RiskMetrics {
  portfolioValue: number;
  dailyPnL: number;
  dailyTradeCount: number;
  currentRisk: number;
  maxRiskReached: boolean;
  riskUtilization: number;
}

interface TradingStatus {
  liveTradingEnabled: boolean;
  emergencyStop: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  connected: boolean;
  lastUpdate: string;
}

const LiveTradingControls: React.FC = () => {
  // State
  const [tradingStatus, setTradingStatus] = useState<TradingStatus>({
    liveTradingEnabled: false,
    emergencyStop: false,
    riskLevel: 'low',
    connected: false,
    lastUpdate: new Date().toISOString()
  });
  
  const [riskLimits, setRiskLimits] = useState<RiskLimits>({
    maxDailyLoss: 1000,
    maxPositionSize: 10000,
    maxPortfolioRisk: 0.02,
    maxDailyTrades: 50,
    stopLossPercentage: 0.05,
    takeProfitPercentage: 0.10,
    maxLeverage: 1.0,
    allowedSymbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'],
    tradingHours: {
      start: '09:30',
      end: '16:00',
      timezone: 'America/New_York'
    }
  });
  
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    portfolioValue: 125750.50,
    dailyPnL: 1250.75,
    dailyTradeCount: 12,
    currentRisk: 0.015,
    maxRiskReached: false,
    riskUtilization: 0.24
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('status');
  const [pendingChanges, setPendingChanges] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - 0.5) * 50,
        currentRisk: Math.max(0, prev.currentRisk + (Math.random() - 0.5) * 0.002),
        riskUtilization: Math.min(1, Math.max(0, prev.riskUtilization + (Math.random() - 0.5) * 0.05))
      }));
      
      setTradingStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
        connected: true
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleLiveTrading = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTradingStatus(prev => ({
        ...prev,
        liveTradingEnabled: !prev.liveTradingEnabled,
        emergencyStop: false
      }));
    } catch (error) {
      logger.error('Failed to toggle live trading', error, 'LiveTradingControls');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEmergencyStop = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTradingStatus(prev => ({
        ...prev,
        liveTradingEnabled: false,
        emergencyStop: true,
        riskLevel: 'critical'
      }));
    } catch (error) {
      logger.error('Failed to execute emergency stop', error, 'LiveTradingControls');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRemoveEmergencyStop = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTradingStatus(prev => ({
        ...prev,
        emergencyStop: false,
        riskLevel: 'low'
      }));
    } catch (error) {
      logger.error('Failed to remove emergency stop', error, 'LiveTradingControls');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateRiskLimits = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPendingChanges(false);
      // In real implementation, make API call to update risk limits
    } catch (error) {
      logger.error('Failed to update risk limits', error, 'LiveTradingControls');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRiskLimitChange = useCallback((field: keyof RiskLimits, value: any) => {
    setRiskLimits(prev => ({ ...prev, [field]: value }));
    setPendingChanges(true);
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              tradingStatus.connected ? "bg-green-500 animate-pulse" : "bg-red-500"
            )} />
            <span className="text-sm font-medium">
              {tradingStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <Badge variant={tradingStatus.liveTradingEnabled ? 'default' : 'secondary'}>
            {tradingStatus.liveTradingEnabled ? 'Live Trading ON' : 'Live Trading OFF'}
          </Badge>
          
          <Badge variant={getRiskLevelBadgeVariant(tradingStatus.riskLevel)}>
            Risk: {tradingStatus.riskLevel.toUpperCase()}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground">
          Last update: {new Date(tradingStatus.lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Emergency Alert */}
      {tradingStatus.emergencyStop && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Emergency stop is active. All trading has been halted. Click &quot;Remove Emergency Stop&quot; to resume trading.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Trading Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleToggleLiveTrading}
              disabled={isLoading || tradingStatus.emergencyStop}
              className={cn(
                "w-full",
                tradingStatus.liveTradingEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              )}
            >
              {isLoading ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : tradingStatus.liveTradingEnabled ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {tradingStatus.liveTradingEnabled ? 'Stop Trading' : 'Start Trading'}
            </Button>
            
            <Button
              onClick={tradingStatus.emergencyStop ? handleRemoveEmergencyStop : handleEmergencyStop}
              disabled={isLoading}
              variant={tradingStatus.emergencyStop ? "default" : "destructive"}
              className="w-full"
            >
              {isLoading ? (
                <Activity className="h-4 w-4 mr-2 animate-spin" />
              ) : tradingStatus.emergencyStop ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              {tradingStatus.emergencyStop ? 'Remove Emergency Stop' : 'Emergency Stop'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Risk Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Utilization</span>
                <span className={getRiskLevelColor(tradingStatus.riskLevel)}>
                  {formatPercent(riskMetrics.riskUtilization)}
                </span>
              </div>
              <Progress 
                value={riskMetrics.riskUtilization * 100} 
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Daily Trades</span>
                <div className="font-medium">{riskMetrics.dailyTradeCount}/{riskLimits.maxDailyTrades}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Portfolio Risk</span>
                <div className="font-medium">{formatPercent(riskMetrics.currentRisk)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Daily P&L
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={cn(
              "text-2xl font-bold",
              riskMetrics.dailyPnL >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(riskMetrics.dailyPnL)}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Loss Limit</span>
                <span>{formatCurrency(riskLimits.maxDailyLoss)}</span>
              </div>
              <Progress 
                value={Math.min(100, (Math.abs(riskMetrics.dailyPnL) / riskLimits.maxDailyLoss) * 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Controls */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Portfolio Value</Label>
                    <div className="text-lg font-semibold">{formatCurrency(riskMetrics.portfolioValue)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Daily P&L</Label>
                    <div className={cn(
                      "text-lg font-semibold",
                      riskMetrics.dailyPnL >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(riskMetrics.dailyPnL)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Daily Trades</Label>
                    <div className="text-lg font-semibold">{riskMetrics.dailyTradeCount}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Current Risk</Label>
                    <div className="text-lg font-semibold">{formatPercent(riskMetrics.currentRisk)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Market Hours</span>
                    <span className="text-sm font-medium">
                      {riskLimits.tradingHours.start} - {riskLimits.tradingHours.end}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Timezone</span>
                    <span className="text-sm font-medium">{riskLimits.tradingHours.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Time</span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleTimeString('en-US', {
                        timeZone: riskLimits.tradingHours.timezone,
                        hour12: false
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Badge variant="default" className="w-full justify-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Market Open
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Risk Limits Configuration</CardTitle>
              {pendingChanges && (
                <Button onClick={handleUpdateRiskLimits} disabled={isLoading} size="sm">
                  {isLoading ? <Activity className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxDailyLoss">Max Daily Loss ($)</Label>
                    <Input
                      id="maxDailyLoss"
                      type="number"
                      value={riskLimits.maxDailyLoss}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('maxDailyLoss', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPositionSize">Max Position Size ($)</Label>
                    <Input
                      id="maxPositionSize"
                      type="number"
                      value={riskLimits.maxPositionSize}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('maxPositionSize', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPortfolioRisk">Max Portfolio Risk (%)</Label>
                    <Input
                      id="maxPortfolioRisk"
                      type="number"
                      step="0.01"
                      value={riskLimits.maxPortfolioRisk * 100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('maxPortfolioRisk', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDailyTrades">Max Daily Trades</Label>
                    <Input
                      id="maxDailyTrades"
                      type="number"
                      value={riskLimits.maxDailyTrades}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('maxDailyTrades', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stopLossPercentage">Stop Loss (%)</Label>
                    <Input
                      id="stopLossPercentage"
                      type="number"
                      step="0.01"
                      value={riskLimits.stopLossPercentage * 100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('stopLossPercentage', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="takeProfitPercentage">Take Profit (%)</Label>
                    <Input
                      id="takeProfitPercentage"
                      type="number"
                      step="0.01"
                      value={riskLimits.takeProfitPercentage * 100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('takeProfitPercentage', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLeverage">Max Leverage</Label>
                    <Input
                      id="maxLeverage"
                      type="number"
                      step="0.1"
                      value={riskLimits.maxLeverage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('maxLeverage', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Trading Hours</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Start (HH:MM)"
                        value={riskLimits.tradingHours.start}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('tradingHours', {
                          ...riskLimits.tradingHours,
                          start: e.target.value
                        })}
                      />
                      <Input
                        placeholder="End (HH:MM)"
                        value={riskLimits.tradingHours.end}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRiskLimitChange('tradingHours', {
                          ...riskLimits.tradingHours,
                          end: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Risk Management</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust position sizes based on risk limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Stop on Loss Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically trigger emergency stop when daily loss limit is reached
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Risk Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Monitor risk levels in real-time and send alerts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trading Hours Enforcement</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent trading outside of configured hours
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <Label>Allowed Symbols</Label>
                  <div className="flex flex-wrap gap-2">
                    {riskLimits.allowedSymbols.map((symbol) => (
                      <Badge key={symbol} variant="secondary">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only these symbols are allowed for live trading
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveTradingControls;