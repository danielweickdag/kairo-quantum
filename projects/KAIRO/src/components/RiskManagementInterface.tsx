import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  Settings, 
  Target, 
  DollarSign,
  Percent,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export interface RiskParameters {
  // Position Sizing
  maxPositionSize: number; // % of portfolio
  defaultPositionSize: number; // % of portfolio
  maxDailyRisk: number; // % of portfolio per day
  maxWeeklyRisk: number; // % of portfolio per week
  maxMonthlyRisk: number; // % of portfolio per month
  
  // Stop Loss & Take Profit
  defaultStopLoss: number; // % from entry
  defaultTakeProfit: number; // % from entry
  maxStopLoss: number; // % maximum allowed
  minRiskReward: number; // minimum R:R ratio
  useTrailingStop: boolean;
  trailingStopDistance: number; // % or ATR multiplier
  
  // Drawdown Controls
  maxDrawdown: number; // % maximum portfolio drawdown
  dailyLossLimit: number; // % daily loss limit
  consecutiveLossLimit: number; // number of consecutive losses
  pauseTradingOnLimit: boolean;
  
  // Market Conditions
  allowTradingInVolatility: boolean;
  maxVolatilityThreshold: number; // % volatility threshold
  minLiquidityRequirement: number; // minimum volume requirement
  avoidNewsEvents: boolean;
  
  // Time-based Rules
  tradingHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  avoidWeekends: boolean;
  avoidHolidays: boolean;
  
  // Correlation & Diversification
  maxCorrelatedPositions: number;
  maxSectorExposure: number; // % per sector
  maxSingleAssetExposure: number; // % per asset
  
  // Signal Filtering
  minSignalConfidence: number; // % minimum confidence
  maxSignalsPerDay: number;
  cooldownPeriod: number; // minutes between signals for same asset
  
  // Emergency Controls
  emergencyStopEnabled: boolean;
  emergencyStopTrigger: number; // % portfolio loss
  autoRecoveryEnabled: boolean;
  recoveryThreshold: number; // % recovery before resuming
}

export interface RiskMetrics {
  currentDrawdown: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  openPositions: number;
  totalExposure: number;
  riskUtilization: number;
  consecutiveLosses: number;
  lastTradeTime: Date;
  violatedRules: string[];
  riskScore: number; // 1-100
}

export interface RiskAlert {
  id: string;
  type: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  action?: string;
}

interface RiskManagementInterfaceProps {
  userId: string;
  onParametersChange: (parameters: RiskParameters) => void;
  currentMetrics: RiskMetrics;
  alerts: RiskAlert[];
  isTrading: boolean;
  onToggleTrading: (enabled: boolean) => void;
}

const defaultRiskParameters: RiskParameters = {
  maxPositionSize: 5,
  defaultPositionSize: 2,
  maxDailyRisk: 3,
  maxWeeklyRisk: 10,
  maxMonthlyRisk: 20,
  defaultStopLoss: 2,
  defaultTakeProfit: 4,
  maxStopLoss: 5,
  minRiskReward: 1.5,
  useTrailingStop: true,
  trailingStopDistance: 1.5,
  maxDrawdown: 15,
  dailyLossLimit: 5,
  consecutiveLossLimit: 3,
  pauseTradingOnLimit: true,
  allowTradingInVolatility: true,
  maxVolatilityThreshold: 25,
  minLiquidityRequirement: 100000,
  avoidNewsEvents: true,
  tradingHours: {
    enabled: true,
    start: '09:30',
    end: '16:00',
    timezone: 'America/New_York'
  },
  avoidWeekends: true,
  avoidHolidays: true,
  maxCorrelatedPositions: 3,
  maxSectorExposure: 20,
  maxSingleAssetExposure: 10,
  minSignalConfidence: 75,
  maxSignalsPerDay: 10,
  cooldownPeriod: 30,
  emergencyStopEnabled: true,
  emergencyStopTrigger: 10,
  autoRecoveryEnabled: false,
  recoveryThreshold: 5
};

export const RiskManagementInterface: React.FC<RiskManagementInterfaceProps> = ({
  userId,
  onParametersChange,
  currentMetrics,
  alerts,
  isTrading,
  onToggleTrading
}) => {
  const [parameters, setParameters] = useState<RiskParameters>(defaultRiskParameters);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [presetMode, setPresetMode] = useState<'conservative' | 'moderate' | 'aggressive' | 'custom'>('moderate');

  // Load saved parameters on mount
  useEffect(() => {
    const savedParams = localStorage.getItem(`riskParams_${userId}`);
    if (savedParams) {
      try {
        const parsed = JSON.parse(savedParams);
        setParameters(parsed);
        onParametersChange(parsed);
      } catch (error) {
        console.error('Error loading saved risk parameters:', error);
      }
    }
  }, [userId, onParametersChange]);

  // Update parameters and mark as changed
  const updateParameter = <K extends keyof RiskParameters>(
    key: K,
    value: RiskParameters[K]
  ) => {
    const newParams = { ...parameters, [key]: value };
    setParameters(newParams);
    setHasUnsavedChanges(true);
    setPresetMode('custom');
  };

  // Save parameters
  const saveParameters = () => {
    localStorage.setItem(`riskParams_${userId}`, JSON.stringify(parameters));
    onParametersChange(parameters);
    setHasUnsavedChanges(false);
  };

  // Load preset configurations
  const loadPreset = (preset: 'conservative' | 'moderate' | 'aggressive') => {
    let presetParams: RiskParameters;
    
    switch (preset) {
      case 'conservative':
        presetParams = {
          ...defaultRiskParameters,
          maxPositionSize: 2,
          defaultPositionSize: 1,
          maxDailyRisk: 1,
          maxWeeklyRisk: 5,
          maxMonthlyRisk: 10,
          defaultStopLoss: 1,
          defaultTakeProfit: 3,
          maxStopLoss: 2,
          minRiskReward: 2,
          maxDrawdown: 8,
          dailyLossLimit: 2,
          consecutiveLossLimit: 2,
          minSignalConfidence: 85,
          maxSignalsPerDay: 5
        };
        break;
      case 'aggressive':
        presetParams = {
          ...defaultRiskParameters,
          maxPositionSize: 10,
          defaultPositionSize: 5,
          maxDailyRisk: 8,
          maxWeeklyRisk: 20,
          maxMonthlyRisk: 40,
          defaultStopLoss: 3,
          defaultTakeProfit: 6,
          maxStopLoss: 8,
          minRiskReward: 1.2,
          maxDrawdown: 25,
          dailyLossLimit: 10,
          consecutiveLossLimit: 5,
          minSignalConfidence: 65,
          maxSignalsPerDay: 20
        };
        break;
      default: // moderate
        presetParams = defaultRiskParameters;
    }
    
    setParameters(presetParams);
    setPresetMode(preset);
    setHasUnsavedChanges(true);
  };

  // Calculate risk score color
  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
            <p className="text-gray-600">Configure and monitor your trading risk parameters</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Trading Status Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="trading-toggle">Trading</Label>
            <Switch
              id="trading-toggle"
              checked={isTrading}
              onCheckedChange={onToggleTrading}
            />
            <Badge variant={isTrading ? 'default' : 'secondary'}>
              {isTrading ? 'Active' : 'Paused'}
            </Badge>
          </div>
          
          {/* Save Button */}
          <Button 
            onClick={saveParameters}
            disabled={!hasUnsavedChanges}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${
              alert.type === 'CRITICAL' ? 'border-red-500 bg-red-50' :
              alert.type === 'WARNING' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <AlertDescription className="flex-1">
                  {alert.message}
                </AlertDescription>
                <span className="text-xs text-gray-500">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="position">Position Sizing</TabsTrigger>
          <TabsTrigger value="stops">Stops & Targets</TabsTrigger>
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`text-2xl font-bold ${getRiskScoreColor(currentMetrics.riskScore)}`}>
                    {currentMetrics.riskScore}
                  </div>
                  <div className="flex-1">
                    <Progress value={currentMetrics.riskScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Drawdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-2xl font-bold text-red-600">
                    {currentMetrics.currentDrawdown.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Max: {parameters.maxDrawdown}%
                </div>
              </CardContent>
            </Card>

            {/* Daily P&L */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {currentMetrics.dailyPnL >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-2xl font-bold ${
                    currentMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentMetrics.dailyPnL >= 0 ? '+' : ''}{currentMetrics.dailyPnL.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Limit: -{parameters.dailyLossLimit}%
                </div>
              </CardContent>
            </Card>

            {/* Risk Utilization */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">
                    {currentMetrics.riskUtilization.toFixed(1)}%
                  </span>
                </div>
                <Progress value={currentMetrics.riskUtilization} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Preset Configurations */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant={presetMode === 'conservative' ? 'default' : 'outline'}
                  onClick={() => loadPreset('conservative')}
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <div className="font-semibold">Conservative</div>
                  <div className="text-xs text-left opacity-70">
                    Low risk, high confidence signals only
                  </div>
                </Button>
                
                <Button
                  variant={presetMode === 'moderate' ? 'default' : 'outline'}
                  onClick={() => loadPreset('moderate')}
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <div className="font-semibold">Moderate</div>
                  <div className="text-xs text-left opacity-70">
                    Balanced risk-reward approach
                  </div>
                </Button>
                
                <Button
                  variant={presetMode === 'aggressive' ? 'default' : 'outline'}
                  onClick={() => loadPreset('aggressive')}
                  className="h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <div className="font-semibold">Aggressive</div>
                  <div className="text-xs text-left opacity-70">
                    Higher risk for potential higher returns
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Position Sizing Tab */}
        <TabsContent value="position" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Position Size Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Maximum Position Size (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxPositionSize]}
                      onValueChange={([value]) => updateParameter('maxPositionSize', value)}
                      max={20}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxPositionSize}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Default Position Size (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.defaultPositionSize]}
                      onValueChange={([value]) => updateParameter('defaultPositionSize', value)}
                      max={parameters.maxPositionSize}
                      min={0.5}
                      step={0.25}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.defaultPositionSize}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Maximum Daily Risk (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxDailyRisk]}
                      onValueChange={([value]) => updateParameter('maxDailyRisk', value)}
                      max={15}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxDailyRisk}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Maximum Weekly Risk (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxWeeklyRisk]}
                      onValueChange={([value]) => updateParameter('maxWeeklyRisk', value)}
                      max={30}
                      min={5}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxWeeklyRisk}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Maximum Monthly Risk (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxMonthlyRisk]}
                      onValueChange={([value]) => updateParameter('maxMonthlyRisk', value)}
                      max={50}
                      min={10}
                      step={2}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxMonthlyRisk}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stops & Targets Tab */}
        <TabsContent value="stops" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stop Loss Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Stop Loss (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.defaultStopLoss]}
                      onValueChange={([value]) => updateParameter('defaultStopLoss', value)}
                      max={10}
                      min={0.5}
                      step={0.25}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.defaultStopLoss}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Maximum Stop Loss (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxStopLoss]}
                      onValueChange={([value]) => updateParameter('maxStopLoss', value)}
                      max={15}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxStopLoss}%</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.useTrailingStop}
                    onCheckedChange={(checked) => updateParameter('useTrailingStop', checked)}
                  />
                  <Label>Use Trailing Stop</Label>
                </div>
                
                {parameters.useTrailingStop && (
                  <div>
                    <Label>Trailing Stop Distance (%)</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Slider
                        value={[parameters.trailingStopDistance]}
                        onValueChange={([value]) => updateParameter('trailingStopDistance', value)}
                        max={5}
                        min={0.5}
                        step={0.25}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{parameters.trailingStopDistance}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Take Profit Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Take Profit (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.defaultTakeProfit]}
                      onValueChange={([value]) => updateParameter('defaultTakeProfit', value)}
                      max={20}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.defaultTakeProfit}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Minimum Risk:Reward Ratio</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.minRiskReward]}
                      onValueChange={([value]) => updateParameter('minRiskReward', value)}
                      max={5}
                      min={1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.minRiskReward}:1</span>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Current R:R Ratio</div>
                  <div className="text-lg font-bold text-blue-900">
                    {(parameters.defaultTakeProfit / parameters.defaultStopLoss).toFixed(2)}:1
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Limits Tab */}
        <TabsContent value="limits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Drawdown Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Maximum Drawdown (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxDrawdown]}
                      onValueChange={([value]) => updateParameter('maxDrawdown', value)}
                      max={30}
                      min={5}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxDrawdown}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Daily Loss Limit (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.dailyLossLimit]}
                      onValueChange={([value]) => updateParameter('dailyLossLimit', value)}
                      max={15}
                      min={1}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.dailyLossLimit}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Consecutive Loss Limit</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.consecutiveLossLimit]}
                      onValueChange={([value]) => updateParameter('consecutiveLossLimit', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.consecutiveLossLimit}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.pauseTradingOnLimit}
                    onCheckedChange={(checked) => updateParameter('pauseTradingOnLimit', checked)}
                  />
                  <Label>Pause Trading on Limit Breach</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signal Filtering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Minimum Signal Confidence (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.minSignalConfidence]}
                      onValueChange={([value]) => updateParameter('minSignalConfidence', value)}
                      max={95}
                      min={50}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.minSignalConfidence}%</span>
                  </div>
                </div>
                
                <div>
                  <Label>Maximum Signals Per Day</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.maxSignalsPerDay]}
                      onValueChange={([value]) => updateParameter('maxSignalsPerDay', value)}
                      max={50}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.maxSignalsPerDay}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Cooldown Period (minutes)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Slider
                      value={[parameters.cooldownPeriod]}
                      onValueChange={([value]) => updateParameter('cooldownPeriod', value)}
                      max={120}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm font-medium">{parameters.cooldownPeriod}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.emergencyStopEnabled}
                    onCheckedChange={(checked) => updateParameter('emergencyStopEnabled', checked)}
                  />
                  <Label>Enable Emergency Stop</Label>
                </div>
                
                {parameters.emergencyStopEnabled && (
                  <div>
                    <Label>Emergency Stop Trigger (%)</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Slider
                        value={[parameters.emergencyStopTrigger]}
                        onValueChange={([value]) => updateParameter('emergencyStopTrigger', value)}
                        max={20}
                        min={5}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{parameters.emergencyStopTrigger}%</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.autoRecoveryEnabled}
                    onCheckedChange={(checked) => updateParameter('autoRecoveryEnabled', checked)}
                  />
                  <Label>Auto Recovery</Label>
                </div>
                
                {parameters.autoRecoveryEnabled && (
                  <div>
                    <Label>Recovery Threshold (%)</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Slider
                        value={[parameters.recoveryThreshold]}
                        onValueChange={([value]) => updateParameter('recoveryThreshold', value)}
                        max={15}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">{parameters.recoveryThreshold}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.tradingHours.enabled}
                    onCheckedChange={(checked) => 
                      updateParameter('tradingHours', { ...parameters.tradingHours, enabled: checked })
                    }
                  />
                  <Label>Restrict Trading Hours</Label>
                </div>
                
                {parameters.tradingHours.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={parameters.tradingHours.start}
                          onChange={(e) => 
                            updateParameter('tradingHours', { 
                              ...parameters.tradingHours, 
                              start: e.target.value 
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={parameters.tradingHours.end}
                          onChange={(e) => 
                            updateParameter('tradingHours', { 
                              ...parameters.tradingHours, 
                              end: e.target.value 
                            })
                          }
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Timezone</Label>
                      <Select
                        value={parameters.tradingHours.timezone}
                        onValueChange={(value) => 
                          updateParameter('tradingHours', { 
                            ...parameters.tradingHours, 
                            timezone: value 
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London Time</SelectItem>
                          <SelectItem value="Europe/Frankfurt">Frankfurt Time</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.avoidWeekends}
                    onCheckedChange={(checked) => updateParameter('avoidWeekends', checked)}
                  />
                  <Label>Avoid Weekends</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={parameters.avoidHolidays}
                    onCheckedChange={(checked) => updateParameter('avoidHolidays', checked)}
                  />
                  <Label>Avoid Holidays</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            You have unsaved changes. Click &quot;Save Settings&quot; to apply your risk management configuration.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RiskManagementInterface;