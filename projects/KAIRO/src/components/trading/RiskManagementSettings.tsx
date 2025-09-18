'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Settings, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Calculator,
  Save,
  RotateCcw,
  Info,
  Target,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RiskSettings {
  maxRiskPerTrade: number; // Percentage of account
  maxDailyRisk: number; // Percentage of account
  maxDrawdown: number; // Percentage of account
  stopLossType: 'percentage' | 'atr' | 'fixed';
  stopLossValue: number;
  takeProfitRatio: number; // Risk:Reward ratio
  maxPositions: number;
  enableTrailingStop: boolean;
  trailingStopDistance: number;
  enableBreakeven: boolean;
  breakevenTrigger: number;
  riskRewardMinimum: number;
  accountBalance: number;
  emergencyStop: boolean;
  emergencyStopLoss: number;
}

interface RiskMetrics {
  currentRisk: number;
  dailyRisk: number;
  weeklyRisk: number;
  monthlyRisk: number;
  maxDrawdownReached: number;
  activePositions: number;
  availableRisk: number;
}

export default function RiskManagementSettings() {
  const [settings, setSettings] = useState<RiskSettings>({
    maxRiskPerTrade: 2.0,
    maxDailyRisk: 6.0,
    maxDrawdown: 10.0,
    stopLossType: 'percentage',
    stopLossValue: 2.0,
    takeProfitRatio: 2.0,
    maxPositions: 5,
    enableTrailingStop: false,
    trailingStopDistance: 1.0,
    enableBreakeven: true,
    breakevenTrigger: 1.0,
    riskRewardMinimum: 1.5,
    accountBalance: 10000,
    emergencyStop: true,
    emergencyStopLoss: 5.0
  });

  const [metrics, setMetrics] = useState<RiskMetrics>({
    currentRisk: 4.2,
    dailyRisk: 4.2,
    weeklyRisk: 8.5,
    monthlyRisk: 12.3,
    maxDrawdownReached: 3.2,
    activePositions: 3,
    availableRisk: 1.8
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [settings]);

  const handleSettingChange = (key: keyof RiskSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Simulate saving to backend
    toast.success('Risk management settings saved successfully!');
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = () => {
    setSettings({
      maxRiskPerTrade: 2.0,
      maxDailyRisk: 6.0,
      maxDrawdown: 10.0,
      stopLossType: 'percentage',
      stopLossValue: 2.0,
      takeProfitRatio: 2.0,
      maxPositions: 5,
      enableTrailingStop: false,
      trailingStopDistance: 1.0,
      enableBreakeven: true,
      breakevenTrigger: 1.0,
      riskRewardMinimum: 1.5,
      accountBalance: 10000,
      emergencyStop: true,
      emergencyStopLoss: 5.0
    });
    toast('Settings reset to defaults', { icon: 'ℹ️' });
  };

  const getRiskColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 80) return 'text-red-500';
    if (percentage >= 60) return 'text-orange-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskLevel = (percentage: number) => {
    if (percentage >= 80) return 'High Risk';
    if (percentage >= 60) return 'Medium Risk';
    if (percentage >= 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  const calculatePositionSize = (riskAmount: number) => {
    const riskPerShare = (settings.stopLossValue / 100) * 100; // Assuming $100 stock price
    return riskAmount / riskPerShare;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Management Settings
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-500 border-orange-500">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={saveSettings}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Current Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current Risk Exposure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Daily Risk</div>
              <div className={`text-2xl font-bold ${getRiskColor(metrics.dailyRisk, settings.maxDailyRisk)}`}>
                {metrics.dailyRisk.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                of {settings.maxDailyRisk}% max
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Drawdown</div>
              <div className={`text-2xl font-bold ${getRiskColor(metrics.maxDrawdownReached, settings.maxDrawdown)}`}>
                {metrics.maxDrawdownReached.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                of {settings.maxDrawdown}% max
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Positions</div>
              <div className={`text-2xl font-bold ${getRiskColor(metrics.activePositions, settings.maxPositions)}`}>
                {metrics.activePositions}
              </div>
              <div className="text-xs text-muted-foreground">
                of {settings.maxPositions} max
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Available Risk</div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.availableRisk.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Remaining today
              </div>
            </div>
          </div>

          {/* Risk Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Daily Risk Usage</Label>
                <span className={`text-sm font-medium ${getRiskColor(metrics.dailyRisk, settings.maxDailyRisk)}`}>
                  {((metrics.dailyRisk / settings.maxDailyRisk) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(metrics.dailyRisk / settings.maxDailyRisk) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm">Drawdown Level</Label>
                <span className={`text-sm font-medium ${getRiskColor(metrics.maxDrawdownReached, settings.maxDrawdown)}`}>
                  {((metrics.maxDrawdownReached / settings.maxDrawdown) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(metrics.maxDrawdownReached / settings.maxDrawdown) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Risk Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Risk Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Max Risk Per Trade (%)
              </Label>
              <Input
                type="number"
                value={settings.maxRiskPerTrade}
                onChange={(e) => handleSettingChange('maxRiskPerTrade', parseFloat(e.target.value) || 0)}
                min="0.1"
                max="10"
                step="0.1"
              />
              <div className="text-xs text-muted-foreground">
                Recommended: 1-2% for conservative, 2-3% for aggressive
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Max Daily Risk (%)
              </Label>
              <Input
                type="number"
                value={settings.maxDailyRisk}
                onChange={(e) => handleSettingChange('maxDailyRisk', parseFloat(e.target.value) || 0)}
                min="1"
                max="20"
                step="0.5"
              />
              <div className="text-xs text-muted-foreground">
                Total risk exposure allowed per day
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Max Drawdown (%)
              </Label>
              <Input
                type="number"
                value={settings.maxDrawdown}
                onChange={(e) => handleSettingChange('maxDrawdown', parseFloat(e.target.value) || 0)}
                min="5"
                max="30"
                step="1"
              />
              <div className="text-xs text-muted-foreground">
                Maximum account drawdown before emergency stop
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Risk:Reward Minimum
              </Label>
              <Input
                type="number"
                value={settings.riskRewardMinimum}
                onChange={(e) => handleSettingChange('riskRewardMinimum', parseFloat(e.target.value) || 0)}
                min="1"
                max="5"
                step="0.1"
              />
              <div className="text-xs text-muted-foreground">
                Minimum R:R ratio to accept trades
              </div>
            </div>
          </div>

          {/* Stop Loss Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Stop Loss Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stop Loss Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={settings.stopLossType}
                  onChange={(e) => handleSettingChange('stopLossType', e.target.value as 'percentage' | 'atr' | 'fixed')}
                >
                  <option value="percentage">Percentage</option>
                  <option value="atr">ATR Based</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>
                  {settings.stopLossType === 'percentage' ? 'Percentage (%)' :
                   settings.stopLossType === 'atr' ? 'ATR Multiplier' : 'Fixed Amount ($)'}
                </Label>
                <Input
                  type="number"
                  value={settings.stopLossValue}
                  onChange={(e) => handleSettingChange('stopLossValue', parseFloat(e.target.value) || 0)}
                  min="0.1"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label>Take Profit Ratio</Label>
                <Input
                  type="number"
                  value={settings.takeProfitRatio}
                  onChange={(e) => handleSettingChange('takeProfitRatio', parseFloat(e.target.value) || 0)}
                  min="1"
                  max="5"
                  step="0.1"
                />
                <div className="text-xs text-muted-foreground">
                  1:{settings.takeProfitRatio} Risk:Reward
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Advanced Settings
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </CardTitle>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Trailing Stop</Label>
                  <Switch
                    checked={settings.enableTrailingStop}
                    onCheckedChange={(checked) => handleSettingChange('enableTrailingStop', checked)}
                  />
                </div>
                {settings.enableTrailingStop && (
                  <div className="space-y-2">
                    <Label>Trailing Distance (%)</Label>
                    <Input
                      type="number"
                      value={settings.trailingStopDistance}
                      onChange={(e) => handleSettingChange('trailingStopDistance', parseFloat(e.target.value) || 0)}
                      min="0.1"
                      max="5"
                      step="0.1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Breakeven</Label>
                  <Switch
                    checked={settings.enableBreakeven}
                    onCheckedChange={(checked) => handleSettingChange('enableBreakeven', checked)}
                  />
                </div>
                {settings.enableBreakeven && (
                  <div className="space-y-2">
                    <Label>Breakeven Trigger (%)</Label>
                    <Input
                      type="number"
                      value={settings.breakevenTrigger}
                      onChange={(e) => handleSettingChange('breakevenTrigger', parseFloat(e.target.value) || 0)}
                      min="0.5"
                      max="3"
                      step="0.1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Max Concurrent Positions</Label>
                <Input
                  type="number"
                  value={settings.maxPositions}
                  onChange={(e) => handleSettingChange('maxPositions', parseInt(e.target.value) || 0)}
                  min="1"
                  max="20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Emergency Stop</Label>
                  <Switch
                    checked={settings.emergencyStop}
                    onCheckedChange={(checked) => handleSettingChange('emergencyStop', checked)}
                  />
                </div>
                {settings.emergencyStop && (
                  <div className="space-y-2">
                    <Label>Emergency Stop Loss (%)</Label>
                    <Input
                      type="number"
                      value={settings.emergencyStopLoss}
                      onChange={(e) => handleSettingChange('emergencyStopLoss', parseFloat(e.target.value) || 0)}
                      min="3"
                      max="15"
                      step="0.5"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Risk Warnings */}
      {(settings.maxRiskPerTrade > 3 || settings.maxDailyRisk > 10 || settings.maxDrawdown > 15) && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800 dark:text-orange-200">Risk Warning</span>
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              {settings.maxRiskPerTrade > 3 && (
                <p>• High risk per trade ({settings.maxRiskPerTrade}%) may lead to significant losses</p>
              )}
              {settings.maxDailyRisk > 10 && (
                <p>• High daily risk ({settings.maxDailyRisk}%) increases account volatility</p>
              )}
              {settings.maxDrawdown > 15 && (
                <p>• High drawdown limit ({settings.maxDrawdown}%) may result in substantial account depletion</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Position Size Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Position Size Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Risk Amount</div>
              <div className="text-xl font-bold text-red-600">
                ${((settings.accountBalance * settings.maxRiskPerTrade) / 100).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Per trade
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Position Size</div>
              <div className="text-xl font-bold">
                {calculatePositionSize((settings.accountBalance * settings.maxRiskPerTrade) / 100).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Shares (est.)
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Daily Limit</div>
              <div className="text-xl font-bold text-orange-600">
                ${((settings.accountBalance * settings.maxDailyRisk) / 100).toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Maximum daily risk
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}