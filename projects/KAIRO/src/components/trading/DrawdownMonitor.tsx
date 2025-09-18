'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  RefreshCw,
  Settings,
  Bell,
  BellOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import toast from 'react-hot-toast';

interface DrawdownData {
  date: string;
  equity: number;
  peak: number;
  drawdown: number;
  drawdownPercent: number;
}

interface DrawdownMetrics {
  currentDrawdown: number;
  currentDrawdownPercent: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  maxDrawdownDate: string;
  drawdownDuration: number; // days
  recoveryTime: number; // days
  averageDrawdown: number;
  drawdownFrequency: number;
  timeUnderwater: number; // percentage of time in drawdown
  calmarRatio: number;
  sterlingRatio: number;
  ulcerIndex: number;
}

interface DrawdownAlert {
  id: string;
  type: 'warning' | 'critical' | 'recovery';
  message: string;
  timestamp: string;
  drawdownLevel: number;
}

export default function DrawdownMonitor() {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('3M');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [warningThreshold, setWarningThreshold] = useState(3); // 3% warning
  const [criticalThreshold, setCriticalThreshold] = useState(5); // 5% critical
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<DrawdownAlert[]>([]);

  // Mock equity curve data - in real app, this would come from API
  const mockEquityData = useMemo(() => {
    const data: DrawdownData[] = [];
    let equity = 100000; // Starting equity
    let peak = equity;
    const days = 180; // 6 months of data
    
    for (let i = 0; i < days; i++) {
      // Simulate daily returns with occasional drawdowns
      const dailyReturn = (Math.random() - 0.45) * 0.02; // Slightly positive bias
      equity *= (1 + dailyReturn);
      
      // Update peak
      if (equity > peak) {
        peak = equity;
      }
      
      const drawdown = peak - equity;
      const drawdownPercent = (drawdown / peak) * 100;
      
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        equity,
        peak,
        drawdown,
        drawdownPercent
      });
    }
    
    return data;
  }, []);

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    if (timeframe === 'ALL') return mockEquityData;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeframe) {
      case '1D':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case '1W':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return mockEquityData.filter(d => new Date(d.date) >= cutoffDate);
  }, [mockEquityData, timeframe]);

  // Calculate drawdown metrics
  const metrics = useMemo((): DrawdownMetrics => {
    const data = filteredData;
    if (data.length === 0) {
      return {
        currentDrawdown: 0,
        currentDrawdownPercent: 0,
        maxDrawdown: 0,
        maxDrawdownPercent: 0,
        maxDrawdownDate: '',
        drawdownDuration: 0,
        recoveryTime: 0,
        averageDrawdown: 0,
        drawdownFrequency: 0,
        timeUnderwater: 0,
        calmarRatio: 0,
        sterlingRatio: 0,
        ulcerIndex: 0
      };
    }
    
    const currentData = data[data.length - 1];
    const maxDrawdownData = data.reduce((max, current) => 
      current.drawdownPercent > max.drawdownPercent ? current : max
    );
    
    // Calculate drawdown periods
    const drawdownPeriods: { start: number; end: number; maxDD: number }[] = [];
    let inDrawdown = false;
    let drawdownStart = 0;
    let maxDDInPeriod = 0;
    
    data.forEach((point, index) => {
      if (point.drawdownPercent > 0 && !inDrawdown) {
        inDrawdown = true;
        drawdownStart = index;
        maxDDInPeriod = point.drawdownPercent;
      } else if (point.drawdownPercent > 0 && inDrawdown) {
        maxDDInPeriod = Math.max(maxDDInPeriod, point.drawdownPercent);
      } else if (point.drawdownPercent === 0 && inDrawdown) {
        inDrawdown = false;
        drawdownPeriods.push({
          start: drawdownStart,
          end: index - 1,
          maxDD: maxDDInPeriod
        });
      }
    });
    
    // If still in drawdown at the end
    if (inDrawdown) {
      drawdownPeriods.push({
        start: drawdownStart,
        end: data.length - 1,
        maxDD: maxDDInPeriod
      });
    }
    
    const averageDrawdown = drawdownPeriods.length > 0 ? 
      drawdownPeriods.reduce((sum, period) => sum + period.maxDD, 0) / drawdownPeriods.length : 0;
    
    const drawdownDays = drawdownPeriods.reduce((sum, period) => sum + (period.end - period.start + 1), 0);
    const timeUnderwater = (drawdownDays / data.length) * 100;
    
    // Calculate current drawdown duration
    let currentDrawdownDuration = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].drawdownPercent > 0) {
        currentDrawdownDuration++;
      } else {
        break;
      }
    }
    
    // Calculate recovery time (average time to recover from drawdowns)
    const recoveryTimes = drawdownPeriods
      .filter(period => period.end < data.length - 1)
      .map(period => {
        const recoveryStart = period.end + 1;
        const peakAtStart = data[period.start].peak;
        for (let i = recoveryStart; i < data.length; i++) {
          if (data[i].equity >= peakAtStart) {
            return i - recoveryStart;
          }
        }
        return data.length - recoveryStart; // Still recovering
      });
    
    const averageRecoveryTime = recoveryTimes.length > 0 ? 
      recoveryTimes.reduce((sum, time) => sum + time, 0) / recoveryTimes.length : 0;
    
    // Calculate Ulcer Index
    const ulcerIndex = Math.sqrt(
      data.reduce((sum, point) => sum + Math.pow(point.drawdownPercent, 2), 0) / data.length
    );
    
    // Mock ratios (in real app, these would be calculated with actual returns)
    const annualReturn = 15; // 15% annual return
    const calmarRatio = maxDrawdownData.drawdownPercent > 0 ? annualReturn / maxDrawdownData.drawdownPercent : 0;
    const sterlingRatio = averageDrawdown > 0 ? annualReturn / averageDrawdown : 0;
    
    return {
      currentDrawdown: currentData.drawdown,
      currentDrawdownPercent: currentData.drawdownPercent,
      maxDrawdown: maxDrawdownData.drawdown,
      maxDrawdownPercent: maxDrawdownData.drawdownPercent,
      maxDrawdownDate: maxDrawdownData.date,
      drawdownDuration: currentDrawdownDuration,
      recoveryTime: averageRecoveryTime,
      averageDrawdown,
      drawdownFrequency: (drawdownPeriods.length / (data.length / 30)) * 30, // per month
      timeUnderwater,
      calmarRatio,
      sterlingRatio,
      ulcerIndex
    };
  }, [filteredData]);

  // Generate alerts based on drawdown levels
  useEffect(() => {
    if (!alertsEnabled) return;
    
    const currentDD = metrics.currentDrawdownPercent;
    const newAlerts: DrawdownAlert[] = [];
    
    if (currentDD >= criticalThreshold) {
      newAlerts.push({
        id: `critical_${Date.now()}`,
        type: 'critical',
        message: `CRITICAL: Drawdown reached ${currentDD.toFixed(2)}% (Target: <${criticalThreshold}%)`,
        timestamp: new Date().toISOString(),
        drawdownLevel: currentDD
      });
      toast.error(`Critical drawdown alert: ${currentDD.toFixed(2)}%`);
    } else if (currentDD >= warningThreshold) {
      newAlerts.push({
        id: `warning_${Date.now()}`,
        type: 'warning',
        message: `WARNING: Drawdown at ${currentDD.toFixed(2)}% (Target: <${criticalThreshold}%)`,
        timestamp: new Date().toISOString(),
        drawdownLevel: currentDD
      });
      toast(`Drawdown warning: ${currentDD.toFixed(2)}%`, { icon: '⚠️' });
    } else if (currentDD < 1 && alerts.length > 0 && alerts[alerts.length - 1].type !== 'recovery') {
      newAlerts.push({
        id: `recovery_${Date.now()}`,
        type: 'recovery',
        message: `RECOVERY: Drawdown reduced to ${currentDD.toFixed(2)}%`,
        timestamp: new Date().toISOString(),
        drawdownLevel: currentDD
      });
      toast.success(`Drawdown recovery: ${currentDD.toFixed(2)}%`);
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev.slice(-9), ...newAlerts]); // Keep last 10 alerts
    }
  }, [metrics.currentDrawdownPercent, alertsEnabled, warningThreshold, criticalThreshold]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getDrawdownColor = (dd: number) => {
    if (dd >= criticalThreshold) return 'text-red-600';
    if (dd >= warningThreshold) return 'text-yellow-600';
    if (dd > 1) return 'text-orange-500';
    return 'text-green-600';
  };

  const getDrawdownStatus = (dd: number) => {
    if (dd >= criticalThreshold) return { text: 'Critical', icon: XCircle, color: 'bg-red-500' };
    if (dd >= warningThreshold) return { text: 'Warning', icon: AlertTriangle, color: 'bg-yellow-500' };
    if (dd > 1) return { text: 'Moderate', icon: Activity, color: 'bg-orange-500' };
    return { text: 'Safe', icon: CheckCircle, color: 'bg-green-500' };
  };

  const status = getDrawdownStatus(metrics.currentDrawdownPercent);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Drawdown Monitor
            <Badge className={getDrawdownColor(metrics.currentDrawdownPercent)}>
              {metrics.currentDrawdownPercent.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className={getDrawdownColor(metrics.currentDrawdownPercent)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.text}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlertsEnabled(!alertsEnabled)}
            >
              {alertsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              {alertsEnabled ? 'Alerts On' : 'Alerts Off'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Timeframe Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Timeframe:</span>
            <div className="flex gap-1">
              {(['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={getDrawdownColor(metrics.currentDrawdownPercent)}>
                  {metrics.currentDrawdownPercent.toFixed(2)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Current Drawdown</div>
              <Progress 
                value={Math.min((metrics.currentDrawdownPercent / criticalThreshold) * 100, 100)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Target: &lt;{criticalThreshold}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2 text-red-600">
                {metrics.maxDrawdownPercent.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground mb-2">Max Drawdown</div>
              <div className="text-xs text-muted-foreground">
                {new Date(metrics.maxDrawdownDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {metrics.drawdownDuration}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Days in Drawdown</div>
              <div className="text-xs text-muted-foreground">
                Avg Recovery: {metrics.recoveryTime.toFixed(0)} days
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {metrics.timeUnderwater.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground mb-2">Time Underwater</div>
              <div className="text-xs text-muted-foreground">
                {metrics.drawdownFrequency.toFixed(1)} DD/month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drawdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Equity Curve & Drawdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="equity" orientation="left" />
                <YAxis yAxisId="drawdown" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'equity' ? `$${value.toFixed(0)}` : `${value.toFixed(2)}%`,
                    name === 'equity' ? 'Equity' : 'Drawdown %'
                  ]}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  yAxisId="equity"
                  type="monotone"
                  dataKey="equity"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Area
                  yAxisId="drawdown"
                  type="monotone"
                  dataKey="drawdownPercent"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Equity Curve</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Drawdown %</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Risk-Adjusted Returns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Calmar Ratio</span>
              <span className="font-semibold">{metrics.calmarRatio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sterling Ratio</span>
              <span className="font-semibold">{metrics.sterlingRatio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ulcer Index</span>
              <span className="font-semibold">{metrics.ulcerIndex.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Drawdown Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Drawdown</span>
              <span className="font-semibold">{metrics.averageDrawdown.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Max Drawdown</span>
              <span className="font-semibold text-red-600">{metrics.maxDrawdownPercent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Drawdown Frequency</span>
              <span className="font-semibold">{metrics.drawdownFrequency.toFixed(1)}/month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Warning Threshold</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWarningThreshold(Math.max(1, warningThreshold - 0.5))}
                >
                  -
                </Button>
                <span className="font-semibold w-12 text-center">{warningThreshold}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWarningThreshold(Math.min(10, warningThreshold + 0.5))}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Critical Threshold</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCriticalThreshold(Math.max(2, criticalThreshold - 0.5))}
                >
                  -
                </Button>
                <span className="font-semibold w-12 text-center">{criticalThreshold}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCriticalThreshold(Math.min(15, criticalThreshold + 0.5))}
                >
                  +
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(-5).reverse().map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}
                    >
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GainzAlgo Target */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            GainzAlgo Drawdown Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Maximum Drawdown Target</span>
              {metrics.maxDrawdownPercent <= 5 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold mb-1">
              <span className={metrics.maxDrawdownPercent <= 5 ? 'text-green-500' : 'text-red-500'}>
                {metrics.maxDrawdownPercent.toFixed(2)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">/ 5.00%</span>
            </div>
            <Progress value={Math.min((metrics.maxDrawdownPercent / 5) * 100, 100)} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              GainzAlgo targets maximum drawdown below 5% to preserve capital and maintain consistent performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}