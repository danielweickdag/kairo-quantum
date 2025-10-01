'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  DollarSign,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import automatedWorkflowService, { WorkflowConfig, WorkflowStatus, Transaction } from '@/services/AutomatedWorkflowService';

interface WorkflowManagerProps {
  className?: string;
}

export default function WorkflowManager({ className = '' }: WorkflowManagerProps) {
  const [config, setConfig] = useState<WorkflowConfig>(automatedWorkflowService.getConfig());
  const [status, setStatus] = useState<WorkflowStatus>(automatedWorkflowService.getStatus());
  const [transactions, setTransactions] = useState<Transaction[]>(automatedWorkflowService.getTransactions());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Update state every 5 seconds
    const interval = setInterval(() => {
      setStatus(automatedWorkflowService.getStatus());
      setTransactions(automatedWorkflowService.getTransactions());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartStop = () => {
    if (status.isRunning) {
      automatedWorkflowService.stopWorkflow();
    } else {
      automatedWorkflowService.startWorkflow();
    }
    setStatus(automatedWorkflowService.getStatus());
  };

  const handleConfigUpdate = (newConfig: Partial<WorkflowConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    automatedWorkflowService.updateConfig(newConfig);
    setStatus(automatedWorkflowService.getStatus());
  };

  const getStatusIcon = (transactionStatus: string) => {
    switch (transactionStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'invest':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Automated Workflow
          </h2>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            status.isRunning 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {status.isRunning ? 'Running' : 'Stopped'}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleStartStop}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              status.isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {status.isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownLeft className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Deposited</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${status.totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invested</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${status.totalInvested.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Withdrawn</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${status.totalWithdrawn.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Balance</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${status.currentBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Workflow Settings</h3>
          
          {/* Auto Deposit Settings */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Deposit</label>
              <input
                type="checkbox"
                checked={config.autoDeposit.enabled}
                onChange={(e) => handleConfigUpdate({
                  autoDeposit: { ...config.autoDeposit, enabled: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            {config.autoDeposit.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={config.autoDeposit.amount}
                  onChange={(e) => handleConfigUpdate({
                    autoDeposit: { ...config.autoDeposit, amount: Number(e.target.value) }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <select
                  value={config.autoDeposit.frequency}
                  onChange={(e) => handleConfigUpdate({
                    autoDeposit: { ...config.autoDeposit, frequency: e.target.value as any }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          {/* Auto Invest Settings */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Invest</label>
              <input
                type="checkbox"
                checked={config.autoInvest.enabled}
                onChange={(e) => handleConfigUpdate({
                  autoInvest: { ...config.autoInvest, enabled: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            {config.autoInvest.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={config.autoInvest.strategy}
                  onChange={(e) => handleConfigUpdate({
                    autoInvest: { ...config.autoInvest, strategy: e.target.value as any }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
                <input
                  type="number"
                  placeholder="Min Balance"
                  value={config.autoInvest.minBalance}
                  onChange={(e) => handleConfigUpdate({
                    autoInvest: { ...config.autoInvest, minBalance: Number(e.target.value) }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>

          {/* Auto Withdraw Settings */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Withdraw</label>
              <input
                type="checkbox"
                checked={config.autoWithdraw.enabled}
                onChange={(e) => handleConfigUpdate({
                  autoWithdraw: { ...config.autoWithdraw, enabled: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            {config.autoWithdraw.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Profit Threshold"
                  value={config.autoWithdraw.profitThreshold}
                  onChange={(e) => handleConfigUpdate({
                    autoWithdraw: { ...config.autoWithdraw, profitThreshold: Number(e.target.value) }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Withdraw %"
                  value={config.autoWithdraw.withdrawPercentage}
                  onChange={(e) => handleConfigUpdate({
                    autoWithdraw: { ...config.autoWithdraw, withdrawPercentage: Number(e.target.value) }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No transactions yet. Start the workflow to begin automated trading.
            </p>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${transaction.amount.toFixed(2)}
                  </span>
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Next Execution */}
      {status.isRunning && status.nextExecution && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Next execution: {new Date(status.nextExecution).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}