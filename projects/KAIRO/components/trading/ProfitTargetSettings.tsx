'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Calendar, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProfitTarget {
  id: string;
  date: string;
  targetAmount: number;
  currentProfit: number;
  isActive: boolean;
  strategy?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  stopLoss?: number;
}

interface ProfitTargetSettingsProps {
  onTargetUpdate?: (target: ProfitTarget) => void;
  onTargetAchieved?: (target: ProfitTarget) => void;
}

const ProfitTargetSettings: React.FC<ProfitTargetSettingsProps> = ({
  onTargetUpdate,
  onTargetAchieved
}) => {
  const [dailyTarget, setDailyTarget] = useState<number>(1000);
  const [currentProfit, setCurrentProfit] = useState<number>(0);
  const [targets, setTargets] = useState<ProfitTarget[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoStopEnabled, setAutoStopEnabled] = useState(true);
  const [maxDailyLoss, setMaxDailyLoss] = useState<number>(500);
  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [notifications, setNotifications] = useState(true);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  // Calculate progress percentage
  const progressPercentage = Math.min((currentProfit / dailyTarget) * 100, 100);
  const lossPercentage = Math.min((Math.abs(currentLoss) / maxDailyLoss) * 100, 100);

  // Check if target is achieved
  const isTargetAchieved = currentProfit >= dailyTarget;
  const isMaxLossReached = Math.abs(currentLoss) >= maxDailyLoss;

  // Create new daily target
  const createDailyTarget = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTarget: ProfitTarget = {
      id: Date.now().toString(),
      date: today,
      targetAmount: dailyTarget,
      currentProfit: 0,
      isActive: true,
      riskLevel,
      stopLoss: maxDailyLoss
    };
    
    setTargets(prev => {
      // Deactivate previous targets
      const updated = prev.map(t => ({ ...t, isActive: false }));
      return [...updated, newTarget];
    });
    
    onTargetUpdate?.(newTarget);
  };

  // Update current profit (simulated real-time update)
  const updateProfit = (amount: number) => {
    setCurrentProfit(prev => {
      const newProfit = prev + amount;
      
      // Update active target
      setTargets(prevTargets => 
        prevTargets.map(target => 
          target.isActive 
            ? { ...target, currentProfit: newProfit }
            : target
        )
      );
      
      // Check if target achieved
      if (newProfit >= dailyTarget && !isTargetAchieved) {
        const activeTarget = targets.find(t => t.isActive);
        if (activeTarget) {
          onTargetAchieved?.(activeTarget);
        }
      }
      
      return newProfit;
    });
  };

  // Update current loss
  const updateLoss = (amount: number) => {
    setCurrentLoss(prev => prev + amount);
  };

  // Reset daily tracking
  const resetDaily = () => {
    setCurrentProfit(0);
    setCurrentLoss(0);
    createDailyTarget();
  };

  // Get status color
  const getStatusColor = () => {
    if (isMaxLossReached) return 'text-red-600';
    if (isTargetAchieved) return 'text-green-600';
    if (currentProfit > 0) return 'text-blue-600';
    return 'text-gray-600';
  };

  // Get progress bar color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-blue-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  // Initialize with today's target
  useEffect(() => {
    createDailyTarget();
  }, []);

  // Simulate real-time profit updates (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random profit/loss updates
      const change = (Math.random() - 0.5) * 20; // Random change between -10 and +10
      if (change > 0) {
        updateProfit(change);
      } else {
        updateLoss(change);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dailyTarget, targets]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Daily Profit Target
          </h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Profit Progress */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Daily Target
            </span>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ${currentProfit.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Target: ${dailyTarget.toFixed(2)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {progressPercentage.toFixed(1)}% achieved
          </div>
        </div>

        {/* Loss Tracking */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Daily Loss
            </span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600 mb-2">
            ${Math.abs(currentLoss).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Max Loss: ${maxDailyLoss.toFixed(2)}
          </div>
          
          {/* Loss Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min(lossPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {lossPercentage.toFixed(1)}% of max loss
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Status
            </span>
            {isTargetAchieved ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : isMaxLossReached ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-blue-600" />
            )}
          </div>
          <div className={`text-lg font-bold ${getStatusColor()}`}>
            {isMaxLossReached ? 'Max Loss Reached' :
             isTargetAchieved ? 'Target Achieved!' :
             currentProfit > 0 ? 'In Profit' :
             currentProfit < 0 ? 'In Loss' : 'Neutral'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Net P&L: ${(currentProfit + currentLoss).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Target Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Target Amount ($)
              </label>
              <input
                type="number"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Max Daily Loss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Daily Loss ($)
              </label>
              <input
                type="number"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>

            {/* Auto Stop */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoStop"
                checked={autoStopEnabled}
                onChange={(e) => setAutoStopEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="autoStop" className="text-sm text-gray-700 dark:text-gray-300">
                Auto-stop trading when target/loss reached
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="text-sm text-gray-700 dark:text-gray-300">
                Enable notifications
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={resetDaily}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reset Daily Target
            </button>
            <button
              onClick={() => updateProfit(100)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Simulate +$100
            </button>
            <button
              onClick={() => updateLoss(-50)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Simulate -$50
            </button>
          </div>
        </div>
      )}

      {/* Recent Targets History */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Targets
        </h3>
        <div className="space-y-3">
          {targets.slice(-5).reverse().map((target) => (
            <div key={target.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {target.date}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Target: ${target.targetAmount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  target.currentProfit >= target.targetAmount ? 'text-green-600' :
                  target.currentProfit > 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  ${target.currentProfit.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {target.isActive ? 'Active' : 'Completed'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfitTargetSettings;