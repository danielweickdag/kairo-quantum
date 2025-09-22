'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Shield, 
  Target, 
  AlertTriangle, 
  Settings, 
  BarChart3,
  DollarSign,
  Percent,
  Clock,
  Brain
} from 'lucide-react';

export interface RiskManagementConfig {
  // Basic Risk Parameters
  maxRiskPerTrade: number; // percentage
  minRiskRewardRatio: number;
  maxPositionSize: number; // percentage
  maxDailyLoss: number; // percentage
  maxDrawdown: number; // percentage
  
  // Stop Loss & Take Profit
  useTrailingStop: boolean;
  trailingStopDistance: number; // ATR multiples
  partialTakeProfits: boolean;
  fibonacciLevels: number[];
  atrMultiplier: {
    stopLoss: number;
    takeProfit: number;
  };
  
  // Auto Optimization
  autoOptimization: {
    enabled: boolean;
    targetWinRate: number;
    adaptiveRiskReward: boolean;
    marketVolatilityAdjustment: boolean;
    timeOfDayAdjustment: boolean;
  };
  
  // Dynamic Sizing
  dynamicSizing: {
    enabled: boolean;
    volatilityFactor: number;
    confidenceMultiplier: number;
    drawdownReduction: boolean;
  };
  
  // Alert Settings
  alerts: {
    drawdownWarning: boolean;
    profitTargetReached: boolean;
    riskLimitExceeded: boolean;
    lowWinRateAlert: boolean;
  };
}

interface RiskManagementInterfaceProps {
  initialConfig?: Partial<RiskManagementConfig>;
  onConfigChange?: (config: RiskManagementConfig) => void;
  currentStats?: {
    winRate: number;
    profitFactor: number;
    currentDrawdown: number;
    totalTrades: number;
    avgRiskReward: number;
  };
}

const defaultConfig: RiskManagementConfig = {
  maxRiskPerTrade: 2.0,
  minRiskRewardRatio: 2.0,
  maxPositionSize: 5.0,
  maxDailyLoss: 5.0,
  maxDrawdown: 10.0,
  useTrailingStop: true,
  trailingStopDistance: 2.0,
  partialTakeProfits: true,
  fibonacciLevels: [0.382, 0.618, 1.0, 1.618],
  atrMultiplier: {
    stopLoss: 2.0,
    takeProfit: 3.0
  },
  autoOptimization: {
    enabled: true,
    targetWinRate: 0.75,
    adaptiveRiskReward: true,
    marketVolatilityAdjustment: true,
    timeOfDayAdjustment: true
  },
  dynamicSizing: {
    enabled: true,
    volatilityFactor: 1.5,
    confidenceMultiplier: 0.5,
    drawdownReduction: true
  },
  alerts: {
    drawdownWarning: true,
    profitTargetReached: true,
    riskLimitExceeded: true,
    lowWinRateAlert: true
  }
};

export default function RiskManagementInterface({
  initialConfig,
  onConfigChange,
  currentStats
}: RiskManagementInterfaceProps) {
  const [config, setConfig] = useState<RiskManagementConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const updateConfig = (updates: Partial<RiskManagementConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateNestedConfig = (section: keyof RiskManagementConfig, updates: any) => {
    setConfig(prev => {
      const currentSection = prev[section];
      const sectionValue = typeof currentSection === 'object' && currentSection !== null ? currentSection : {};
      return {
        ...prev,
        [section]: { ...sectionValue, ...updates }
      };
    });
    setHasUnsavedChanges(true);
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
    setHasUnsavedChanges(true);
  };

  const saveConfiguration = () => {
    // Here you would typically save to backend/localStorage
    console.log('Saving risk management configuration:', config);
    setHasUnsavedChanges(false);
  };

  const getRiskLevel = () => {
    if (!currentStats) return 'unknown';
    
    const { currentDrawdown, winRate, profitFactor } = currentStats;
    
    if (currentDrawdown > config.maxDrawdown * 0.8 || winRate < 0.5 || profitFactor < 1.2) {
      return 'high';
    } else if (currentDrawdown > config.maxDrawdown * 0.5 || winRate < 0.65 || profitFactor < 1.5) {
      return 'medium';
    }
    return 'low';
  };

  const riskLevel = getRiskLevel();
  const riskColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-red-600 bg-red-50 border-red-200',
    unknown: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Risk Management
          </h1>
          <p className="text-gray-600 mt-1">
            Configure your trading risk parameters and optimization settings
          </p>
        </div>
        
        {currentStats && (
          <Card className={`${riskColors[riskLevel]} border-2`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold capitalize">{riskLevel} Risk</span>
              </div>
              <div className="text-sm mt-1">
                Drawdown: {(currentStats.currentDrawdown * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Performance Stats */}
      {currentStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {(currentStats.winRate * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Profit Factor</span>
              </div>
              <div className="text-2xl font-bold">
                {currentStats.profitFactor.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Avg R:R</span>
              </div>
              <div className="text-2xl font-bold">
                {currentStats.avgRiskReward.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium">Drawdown</span>
              </div>
              <div className="text-2xl font-bold">
                {(currentStats.currentDrawdown * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Total Trades</span>
              </div>
              <div className="text-2xl font-bold">
                {currentStats.totalTrades}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Risk</TabsTrigger>
          <TabsTrigger value="sltp">SL/TP Settings</TabsTrigger>
          <TabsTrigger value="optimization">Auto Optimization</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
        </TabsList>

        {/* Basic Risk Settings */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Position & Risk Limits
              </CardTitle>
              <CardDescription>
                Set your fundamental risk parameters for each trade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max Risk Per Trade (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[config.maxRiskPerTrade]}
                      onValueChange={([value]) => updateConfig({ maxRiskPerTrade: value })}
                      max={10}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0.5%</span>
                      <span className="font-medium">{config.maxRiskPerTrade}%</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Min Risk:Reward Ratio</Label>
                  <div className="px-3">
                    <Slider
                      value={[config.minRiskRewardRatio]}
                      onValueChange={([value]) => updateConfig({ minRiskRewardRatio: value })}
                      max={5}
                      min={1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1:1</span>
                      <span className="font-medium">1:{config.minRiskRewardRatio}</span>
                      <span>1:5</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Position Size (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[config.maxPositionSize]}
                      onValueChange={([value]) => updateConfig({ maxPositionSize: value })}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1%</span>
                      <span className="font-medium">{config.maxPositionSize}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Daily Loss (%)</Label>
                  <div className="px-3">
                    <Slider
                      value={[config.maxDailyLoss]}
                      onValueChange={([value]) => updateConfig({ maxDailyLoss: value })}
                      max={15}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1%</span>
                      <span className="font-medium">{config.maxDailyLoss}%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Max Drawdown (%)</Label>
                <div className="px-3">
                  <Slider
                    value={[config.maxDrawdown]}
                    onValueChange={([value]) => updateConfig({ maxDrawdown: value })}
                    max={25}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5%</span>
                    <span className="font-medium">{config.maxDrawdown}%</span>
                    <span>25%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Maximum portfolio drawdown before trading is paused
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SL/TP Settings */}
        <TabsContent value="sltp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Stop Loss & Take Profit Configuration
              </CardTitle>
              <CardDescription>
                Configure automatic stop loss and take profit calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Use Trailing Stop</Label>
                    <Switch
                      checked={config.useTrailingStop}
                      onCheckedChange={(checked) => updateConfig({ useTrailingStop: checked })}
                    />
                  </div>
                  
                  {config.useTrailingStop && (
                    <div className="space-y-2">
                      <Label>Trailing Stop Distance (ATR)</Label>
                      <div className="px-3">
                        <Slider
                          value={[config.trailingStopDistance]}
                          onValueChange={([value]) => updateConfig({ trailingStopDistance: value })}
                          max={5}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>0.5x</span>
                          <span className="font-medium">{config.trailingStopDistance}x ATR</span>
                          <span>5x</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label>Partial Take Profits</Label>
                    <Switch
                      checked={config.partialTakeProfits}
                      onCheckedChange={(checked) => updateConfig({ partialTakeProfits: checked })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stop Loss ATR Multiplier</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.atrMultiplier.stopLoss]}
                        onValueChange={([value]) => updateNestedConfig('atrMultiplier', { stopLoss: value })}
                        max={5}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0.5x</span>
                        <span className="font-medium">{config.atrMultiplier.stopLoss}x ATR</span>
                        <span>5x</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Take Profit ATR Multiplier</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.atrMultiplier.takeProfit]}
                        onValueChange={([value]) => updateNestedConfig('atrMultiplier', { takeProfit: value })}
                        max={8}
                        min={1}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1x</span>
                        <span className="font-medium">{config.atrMultiplier.takeProfit}x ATR</span>
                        <span>8x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {config.partialTakeProfits && (
                <div className="space-y-2">
                  <Label>Fibonacci Levels for Partial Profits</Label>
                  <div className="flex flex-wrap gap-2">
                    {config.fibonacciLevels.map((level, index) => (
                      <Badge key={index} variant="secondary">
                        {level}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Positions will be partially closed at these Fibonacci retracement levels
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto Optimization */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Automatic Optimization Settings
              </CardTitle>
              <CardDescription>
                Enable AI-powered optimization based on performance data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Auto Optimization</Label>
                  <p className="text-sm text-gray-600">Automatically adjust parameters based on performance</p>
                </div>
                <Switch
                  checked={config.autoOptimization.enabled}
                  onCheckedChange={(checked) => 
                    updateNestedConfig('autoOptimization', { enabled: checked })
                  }
                />
              </div>
              
              {config.autoOptimization.enabled && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Target Win Rate (%)</Label>
                    <div className="px-3">
                      <Slider
                        value={[config.autoOptimization.targetWinRate * 100]}
                        onValueChange={([value]) => 
                          updateNestedConfig('autoOptimization', { targetWinRate: value / 100 })
                        }
                        max={90}
                        min={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>50%</span>
                        <span className="font-medium">{(config.autoOptimization.targetWinRate * 100).toFixed(0)}%</span>
                        <span>90%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Adaptive Risk:Reward</Label>
                        <p className="text-xs text-gray-600">Adjust R:R based on win rate</p>
                      </div>
                      <Switch
                        checked={config.autoOptimization.adaptiveRiskReward}
                        onCheckedChange={(checked) => 
                          updateNestedConfig('autoOptimization', { adaptiveRiskReward: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Market Volatility Adjustment</Label>
                        <p className="text-xs text-gray-600">Adjust for market conditions</p>
                      </div>
                      <Switch
                        checked={config.autoOptimization.marketVolatilityAdjustment}
                        onCheckedChange={(checked) => 
                          updateNestedConfig('autoOptimization', { marketVolatilityAdjustment: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Time of Day Adjustment</Label>
                        <p className="text-xs text-gray-600">Reduce risk during low liquidity</p>
                      </div>
                      <Switch
                        checked={config.autoOptimization.timeOfDayAdjustment}
                        onCheckedChange={(checked) => 
                          updateNestedConfig('autoOptimization', { timeOfDayAdjustment: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Dynamic Position Sizing</Label>
                    <p className="text-sm text-gray-600">Adjust position sizes based on confidence and volatility</p>
                  </div>
                  <Switch
                    checked={config.dynamicSizing.enabled}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('dynamicSizing', { enabled: checked })
                    }
                  />
                </div>
                
                {config.dynamicSizing.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Volatility Factor</Label>
                      <div className="px-3">
                        <Slider
                          value={[config.dynamicSizing.volatilityFactor]}
                          onValueChange={([value]) => 
                            updateNestedConfig('dynamicSizing', { volatilityFactor: value })
                          }
                          max={3}
                          min={0.5}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>0.5x</span>
                          <span className="font-medium">{config.dynamicSizing.volatilityFactor}x</span>
                          <span>3x</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Confidence Multiplier</Label>
                      <div className="px-3">
                        <Slider
                          value={[config.dynamicSizing.confidenceMultiplier]}
                          onValueChange={([value]) => 
                            updateNestedConfig('dynamicSizing', { confidenceMultiplier: value })
                          }
                          max={2}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>0x</span>
                          <span className="font-medium">{config.dynamicSizing.confidenceMultiplier}x</span>
                          <span>2x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts & Notifications */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alert & Notification Settings
              </CardTitle>
              <CardDescription>
                Configure when and how you want to be notified about risk events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Drawdown Warning</Label>
                    <p className="text-xs text-gray-600">Alert when approaching max drawdown</p>
                  </div>
                  <Switch
                    checked={config.alerts.drawdownWarning}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('alerts', { drawdownWarning: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profit Target Reached</Label>
                    <p className="text-xs text-gray-600">Notify when profit targets are hit</p>
                  </div>
                  <Switch
                    checked={config.alerts.profitTargetReached}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('alerts', { profitTargetReached: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Risk Limit Exceeded</Label>
                    <p className="text-xs text-gray-600">Alert when risk limits are breached</p>
                  </div>
                  <Switch
                    checked={config.alerts.riskLimitExceeded}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('alerts', { riskLimitExceeded: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Low Win Rate Alert</Label>
                    <p className="text-xs text-gray-600">Warn when win rate drops below target</p>
                  </div>
                  <Switch
                    checked={config.alerts.lowWinRateAlert}
                    onCheckedChange={(checked) => 
                      updateNestedConfig('alerts', { lowWinRateAlert: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={resetToDefaults}>
          <Settings className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <Alert className="w-auto">
              <AlertDescription className="text-sm">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          
          <Button onClick={saveConfiguration} disabled={!hasUnsavedChanges}>
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}