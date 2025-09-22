'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, BarChart3, Zap, Award } from 'lucide-react';
import { logger } from '@/lib/logger';
import { tradingService, PerformanceMetrics, MarketType, Trade } from '@/services/tradingService';
import { toast } from 'react-hot-toast';

interface WinRateTrackerProps {
  marketType?: MarketType;
  timeRange?: string;
}

export default function WinRateTracker({ marketType, timeRange = '30d' }: WinRateTrackerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      const data = await tradingService.getPerformanceMetrics(marketType, timeRange);
      setMetrics(data);
    } catch (error) {
      logger.error('Failed to fetch performance metrics', error, 'WinRateTracker');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [marketType, timeRange, fetchMetrics]);

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 75) return 'text-green-500';
    if (winRate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getWinRateBadgeVariant = (winRate: number) => {
    if (winRate >= 75) return 'default';
    if (winRate >= 60) return 'secondary';
    return 'destructive';
  };

  const getProfitFactorColor = (profitFactor: number) => {
    if (profitFactor >= 1.6) return 'text-green-500';
    if (profitFactor >= 1.2) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Win Rate Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Win Rate Algorithm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Win Rate Card */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            GainzAlgo Win Rate Tracker
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            disabled={refreshing}
            className="h-8"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            {refreshing ? 'Updating...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Win Rate Display */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-4xl font-bold ${getWinRateColor(metrics.winRate)}`}>
                {metrics.winRate.toFixed(1)}%
              </span>
              <Badge variant={getWinRateBadgeVariant(metrics.winRate)} className="text-sm">
                {metrics.winRate >= 75 ? (
                  <><Award className="h-3 w-3 mr-1" />Target Achieved</>
                ) : (
                  <><Zap className="h-3 w-3 mr-1" />Improving</>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Current Win Rate (Target: 75%+)
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Target</span>
              <span>{Math.min(100, (metrics.winRate / 75) * 100).toFixed(0)}%</span>
            </div>
            <Progress 
              value={Math.min(100, (metrics.winRate / 75) * 100)} 
              className="h-2"
            />
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <p className="text-2xl font-semibold text-green-500">
                {metrics.winningTrades}
              </p>
              <p className="text-xs text-muted-foreground">Winning Trades</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-semibold text-red-500">
                {metrics.losingTrades}
              </p>
              <p className="text-xs text-muted-foreground">Losing Trades</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-semibold">
                {metrics.totalTrades}
              </p>
              <p className="text-xs text-muted-foreground">Total Trades</p>
            </div>
            <div className="text-center space-y-1">
              <p className={`text-2xl font-semibold ${getProfitFactorColor(metrics.profitFactor)}`}>
                {metrics.profitFactor.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Profit Factor</p>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Avg Win</span>
              </div>
              <span className="text-sm font-semibold text-green-500">
                ${metrics.averageWin.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Avg Loss</span>
              </div>
              <span className="text-sm font-semibold text-red-500">
                ${Math.abs(metrics.averageLoss).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">R:R Ratio</span>
              </div>
              <span className="text-sm font-semibold text-blue-500">
                1:{metrics.riskRewardRatio.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Algorithm Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium">GainzAlgo V2 Active</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.winRate >= 75 ? 'Exceeding target performance' : 'Optimizing for 75%+ win rate'}
                </p>
              </div>
            </div>
            <Badge variant={metrics.winRate >= 75 ? 'default' : 'secondary'}>
              {metrics.winRate >= 75 ? 'Elite Performance' : 'Improving'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}