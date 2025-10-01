'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Target,
  Settings,
  Bell,
  X,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Activity,
  Zap,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import {
  useRiskManagement,
  riskManagementSystem,
  type RiskAlert,
  type RiskParameters,
  type PositionRisk,
  type AccountRisk
} from '@/services/riskManagementSystem';

interface RiskManagementDashboardProps {
  accountBalance: number;
  positions: any[];
  onParametersChange?: (params: Partial<RiskParameters>) => void;
  className?: string;
}

const RiskManagementDashboard: React.FC<RiskManagementDashboardProps> = ({
  accountBalance,
  positions = [],
  onParametersChange,
  className = ''
}) => {
  const {
    alerts,
    parameters,
    updateParameters,
    acknowledgeAlert,
    validateOrder,
    calculatePositionRisk,
    getOptimalPositionSize,
    unacknowledgedAlerts,
    clearAlerts
  } = useRiskManagement();

  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');
  const [editableParams, setEditableParams] = useState<RiskParameters>(parameters);
  const [accountRisk, setAccountRisk] = useState<AccountRisk | null>(null);
  const [positionRisks, setPositionRisks] = useState<PositionRisk[]>([]);

  // Update risk management system with current account balance
  useEffect(() => {
    riskManagementSystem.updateAccountBalance(accountBalance);
  }, [accountBalance]);

  // Calculate position risks
  useEffect(() => {
    const risks = positions.map(position => 
      calculatePositionRisk(
        position.symbol,
        position.entryPrice || position.price,
        position.size || position.quantity,
        position.stopLoss
      )
    );
    setPositionRisks(risks);

    // Calculate account risk
    const accRisk = riskManagementSystem.calculateAccountRisk(risks);
    setAccountRisk(accRisk);

    // Check risk rules
    riskManagementSystem.checkRiskRules(accRisk, risks);
  }, [positions, calculatePositionRisk]);

  const handleParameterChange = (key: keyof RiskParameters, value: number) => {
    const newParams = { ...editableParams, [key]: value };
    setEditableParams(newParams);
  };

  const saveParameters = () => {
    updateParameters(editableParams);
    onParametersChange?.(editableParams);
    setShowSettings(false);
  };

  const resetParameters = () => {
    setEditableParams(parameters);
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600';
    if (riskScore < 60) return 'text-yellow-600';
    if (riskScore < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskBadgeVariant = (type: RiskAlert['type']) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Risk Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getRiskColor(accountRisk?.riskScore || 0)}`}>
                {accountRisk?.riskScore?.toFixed(0) || '0'}/100
              </div>
              <Progress 
                value={accountRisk?.riskScore || 0} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {(accountRisk?.riskScore || 0) < 30 ? 'Low Risk' :
                 (accountRisk?.riskScore || 0) < 60 ? 'Moderate Risk' :
                 (accountRisk?.riskScore || 0) < 80 ? 'High Risk' : 'Critical Risk'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily P&L */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Daily P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${
                (accountRisk?.dailyPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(accountRisk?.dailyPnL || 0)}
              </div>
              <p className={`text-sm ${
                (accountRisk?.dailyPnLPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(accountRisk?.dailyPnLPercentage || 0)}
              </p>
              <Progress 
                value={Math.min(Math.abs(accountRisk?.dailyPnLPercentage || 0) / parameters.maxDailyLoss * 100, 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Total Risk Exposure */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              Risk Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {accountRisk?.totalRisk.toFixed(1) || '0'}%
              </div>
              <p className="text-sm text-muted-foreground">
                of account balance
              </p>
              <Progress 
                value={Math.min((accountRisk?.totalRisk || 0) / parameters.maxPositionSize * 100, 100)}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {unacknowledgedAlerts.length}
              </div>
              <p className="text-sm text-muted-foreground">
                {unacknowledgedAlerts.length === 1 ? 'alert' : 'alerts'} pending
              </p>
              {unacknowledgedAlerts.length > 0 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearAlerts}
                  className="w-full"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="positions">Position Risk</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Alerts
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={clearAlerts}>
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active risk alerts</p>
                  <p className="text-sm">Your trading is within risk parameters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.slice(0, 10).map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-4 rounded-lg border ${
                        alert.acknowledged ? 'bg-muted/50' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getRiskBadgeVariant(alert.type)}>
                              {alert.type.toUpperCase()}
                            </Badge>
                            {alert.symbol && (
                              <Badge variant="outline">{alert.symbol}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {alert.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{alert.message}</p>
                          {alert.action && (
                            <p className="text-xs text-muted-foreground">
                              Recommended action: {alert.action.replace('_', ' ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.acknowledged && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Position Risk Tab */}
        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Position Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positionRisks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>No open positions</p>
                  <p className="text-sm">Position risk will appear here when you have active trades</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positionRisks.map((risk, index) => (
                    <div key={risk.symbol} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{risk.symbol}</h4>
                          <Badge 
                            variant={risk.currentRisk > risk.maxRisk ? 'destructive' : 'outline'}
                          >
                            {risk.currentRisk.toFixed(1)}% Risk
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          R:R {risk.riskRewardRatio.toFixed(2)}:1
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Stop Loss</p>
                          <p className="font-medium">{formatCurrency(risk.stopLoss)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Take Profit</p>
                          <p className="font-medium">{formatCurrency(risk.takeProfit)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Risk</p>
                          <p className="font-medium">{risk.maxRisk}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Correlation</p>
                          <p className="font-medium">{(risk.correlationRisk * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Risk Exposure</span>
                          <span>{risk.currentRisk.toFixed(1)}% / {risk.maxRisk}%</span>
                        </div>
                        <Progress 
                          value={Math.min(risk.currentRisk / risk.maxRisk * 100, 100)}
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Risk Management Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Position Limits</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
                    <Input
                      id="maxPositionSize"
                      type="number"
                      value={editableParams.maxPositionSize}
                      onChange={(e) => handleParameterChange('maxPositionSize', parseFloat(e.target.value))}
                      min="1"
                      max="50"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxOpenPositions">Max Open Positions</Label>
                    <Input
                      id="maxOpenPositions"
                      type="number"
                      value={editableParams.maxOpenPositions}
                      onChange={(e) => handleParameterChange('maxOpenPositions', parseInt(e.target.value))}
                      min="1"
                      max="20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
                    <Input
                      id="riskPerTrade"
                      type="number"
                      value={editableParams.riskPerTrade}
                      onChange={(e) => handleParameterChange('riskPerTrade', parseFloat(e.target.value))}
                      min="0.1"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Limits</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDailyLoss">Max Daily Loss (%)</Label>
                    <Input
                      id="maxDailyLoss"
                      type="number"
                      value={editableParams.maxDailyLoss}
                      onChange={(e) => handleParameterChange('maxDailyLoss', parseFloat(e.target.value))}
                      min="1"
                      max="20"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                    <Input
                      id="maxDrawdown"
                      type="number"
                      value={editableParams.maxDrawdown}
                      onChange={(e) => handleParameterChange('maxDrawdown', parseFloat(e.target.value))}
                      min="5"
                      max="50"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stopLossPercentage">Default Stop Loss (%)</Label>
                    <Input
                      id="stopLossPercentage"
                      type="number"
                      value={editableParams.stopLossPercentage}
                      onChange={(e) => handleParameterChange('stopLossPercentage', parseFloat(e.target.value))}
                      min="0.5"
                      max="10"
                      step="0.1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="takeProfitRatio">Take Profit Ratio</Label>
                    <Input
                      id="takeProfitRatio"
                      type="number"
                      value={editableParams.takeProfitRatio}
                      onChange={(e) => handleParameterChange('takeProfitRatio', parseFloat(e.target.value))}
                      min="1"
                      max="5"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={resetParameters}>
                  Reset
                </Button>
                <Button onClick={saveParameters}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagementDashboard;