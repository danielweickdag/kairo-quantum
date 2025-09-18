'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target, 
  Calculator, 
  AlertTriangle,
  DollarSign,
  Percent,
  BarChart3,
  Settings
} from 'lucide-react';
import { SignalType } from '@/services/tradingService';

interface SLTPProps {
  symbol: string;
  currentPrice: number;
  signalType: SignalType;
  entryPrice?: number;
  positionSize?: number;
  accountBalance?: number;
  onSLTPChange?: (stopLoss: number, takeProfit: number) => void;
}

interface SLTPLevels {
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;
  rewardAmount: number;
  riskRewardRatio: number;
  riskPercentage: number;
  rewardPercentage: number;
}

export default function StopLossTakeProfit({
  symbol,
  currentPrice,
  signalType,
  entryPrice = currentPrice,
  positionSize = 100,
  accountBalance = 10000,
  onSLTPChange
}: SLTPProps) {
  const [customSL, setCustomSL] = useState<string>('');
  const [customTP, setCustomTP] = useState<string>('');
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // Calculate default SL/TP based on GainzAlgo strategy
  const defaultLevels = useMemo(() => {
    const strategies = {
      conservative: { slPercent: 1.5, tpPercent: 3.0 }, // 1:2 R:R
      moderate: { slPercent: 2.0, tpPercent: 4.0 }, // 1:2 R:R
      aggressive: { slPercent: 3.0, tpPercent: 4.8 } // 1:1.6 R:R
    };

    const strategy = strategies[selectedStrategy];
    const isBuy = signalType === 'BUY';
    
    const stopLoss = isBuy 
      ? entryPrice * (1 - strategy.slPercent / 100)
      : entryPrice * (1 + strategy.slPercent / 100);
    
    const takeProfit = isBuy
      ? entryPrice * (1 + strategy.tpPercent / 100)
      : entryPrice * (1 - strategy.tpPercent / 100);

    return { stopLoss, takeProfit };
  }, [entryPrice, signalType, selectedStrategy]);

  // Calculate current SL/TP levels
  const currentLevels = useMemo((): SLTPLevels => {
    const stopLoss = customSL ? parseFloat(customSL) : defaultLevels.stopLoss;
    const takeProfit = customTP ? parseFloat(customTP) : defaultLevels.takeProfit;
    
    const isBuy = signalType === 'BUY';
    const slDistance = Math.abs(entryPrice - stopLoss);
    const tpDistance = Math.abs(takeProfit - entryPrice);
    
    const riskAmount = (slDistance / entryPrice) * positionSize * entryPrice;
    const rewardAmount = (tpDistance / entryPrice) * positionSize * entryPrice;
    
    const riskRewardRatio = rewardAmount / riskAmount;
    const riskPercentageCalc = (riskAmount / accountBalance) * 100;
    const rewardPercentageCalc = (rewardAmount / accountBalance) * 100;

    return {
      stopLoss,
      takeProfit,
      riskAmount,
      rewardAmount,
      riskRewardRatio,
      riskPercentage: riskPercentageCalc,
      rewardPercentage: rewardPercentageCalc
    };
  }, [customSL, customTP, defaultLevels, entryPrice, signalType, positionSize, accountBalance]);

  // Calculate position size based on risk percentage
  const calculatePositionSize = (riskPercent: number) => {
    const riskAmount = (accountBalance * riskPercent) / 100;
    const slDistance = Math.abs(entryPrice - currentLevels.stopLoss) / entryPrice;
    return riskAmount / (slDistance * entryPrice);
  };

  // Update parent component when SL/TP changes
  useEffect(() => {
    if (onSLTPChange) {
      onSLTPChange(currentLevels.stopLoss, currentLevels.takeProfit);
    }
  }, [currentLevels.stopLoss, currentLevels.takeProfit, onSLTPChange]);

  const getPriceDistance = (price: number) => {
    const distance = ((price - currentPrice) / currentPrice) * 100;
    return distance;
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 1) return 'text-green-500';
    if (risk <= 2) return 'text-yellow-500';
    if (risk <= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRRColor = (ratio: number) => {
    if (ratio >= 2) return 'text-green-500';
    if (ratio >= 1.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main SL/TP Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Stop Loss & Take Profit
              <Badge variant="outline">{symbol}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={signalType === 'BUY' ? 'bg-green-500' : 'bg-red-500'}>
                {signalType}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div className="grid grid-cols-3 gap-2">
            {(['conservative', 'moderate', 'aggressive'] as const).map((strategy) => (
              <Button
                key={strategy}
                variant={selectedStrategy === strategy ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStrategy(strategy)}
                className="capitalize"
              >
                {strategy}
              </Button>
            ))}
          </div>

          {/* Price Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Price */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Price</div>
              <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Market</div>
            </div>

            {/* Entry Price */}
            <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div className="text-sm text-muted-foreground mb-1">Entry Price</div>
              <div className="text-2xl font-bold text-blue-600">${entryPrice.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {getPriceDistance(entryPrice) > 0 ? '+' : ''}{getPriceDistance(entryPrice).toFixed(2)}%
              </div>
            </div>

            {/* Position Size */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Position Size</div>
              <div className="text-2xl font-bold">{positionSize.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Shares/Units</div>
            </div>
          </div>

          {/* SL/TP Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stop Loss */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <Label className="font-semibold">Stop Loss</Label>
              </div>
              <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  ${currentLevels.stopLoss.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {getPriceDistance(currentLevels.stopLoss).toFixed(2)}% from current
                </div>
                <Input
                  type="number"
                  placeholder="Custom SL"
                  value={customSL}
                  onChange={(e) => setCustomSL(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Take Profit */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <Label className="font-semibold">Take Profit</Label>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  ${currentLevels.takeProfit.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {getPriceDistance(currentLevels.takeProfit).toFixed(2)}% from current
                </div>
                <Input
                  type="number"
                  placeholder="Custom TP"
                  value={customTP}
                  onChange={(e) => setCustomTP(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Risk/Reward Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Risk</span>
              </div>
              <div className="text-lg font-bold text-red-600">
                ${currentLevels.riskAmount.toFixed(0)}
              </div>
              <div className={`text-xs ${getRiskColor(currentLevels.riskPercentage)}`}>
                {currentLevels.riskPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Reward</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                ${currentLevels.rewardAmount.toFixed(0)}
              </div>
              <div className="text-xs text-green-600">
                {currentLevels.rewardPercentage.toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">R:R Ratio</span>
              </div>
              <div className={`text-lg font-bold ${getRRColor(currentLevels.riskRewardRatio)}`}>
                1:{currentLevels.riskRewardRatio.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentLevels.riskRewardRatio >= 2 ? 'Excellent' : 
                 currentLevels.riskRewardRatio >= 1.5 ? 'Good' : 'Poor'}
              </div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Percent className="h-4 w-4" />
                <span className="text-sm font-medium">Win Rate Needed</span>
              </div>
              <div className="text-lg font-bold">
                {(100 / (1 + currentLevels.riskRewardRatio)).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Break-even
              </div>
            </div>
          </div>

          {/* Risk Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Account Risk</Label>
              <span className={`text-sm font-medium ${getRiskColor(currentLevels.riskPercentage)}`}>
                {currentLevels.riskPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(currentLevels.riskPercentage * 20, 100)} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>2% (Recommended)</span>
              <span>5% (Max)</span>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Risk Percentage</Label>
                  <Input
                    type="number"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                    min="0.1"
                    max="10"
                    step="0.1"
                  />
                  <div className="text-xs text-muted-foreground">
                    Suggested position size: {calculatePositionSize(riskPercentage).toFixed(0)} units
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Account Balance</Label>
                  <Input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                    disabled
                  />
                  <div className="text-xs text-muted-foreground">
                    Current account balance
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {currentLevels.riskPercentage > 3 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                High risk warning: You&apos;re risking {currentLevels.riskPercentage.toFixed(1)}% of your account
              </span>
            </div>
          )}

          {currentLevels.riskRewardRatio < 1.5 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">
                Poor risk/reward ratio: Consider adjusting your take profit level
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}