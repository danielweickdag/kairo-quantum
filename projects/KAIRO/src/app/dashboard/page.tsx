'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkflow } from '@/contexts/WorkflowContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import TradingPanel from '@/components/dashboard/TradingPanel';
import AutomatedStrategies from '@/components/dashboard/AutomatedStrategies';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import AISignalGenerator from '@/components/dashboard/AISignalGenerator';
import StrategyTemplates from '@/components/dashboard/StrategyTemplates';
import SignalDeliverySystem from '@/components/dashboard/SignalDeliverySystem';
import BacktestingEngine from '@/components/dashboard/BacktestingEngine';
import PerformanceAnalytics from '@/components/dashboard/PerformanceAnalytics';
import BrokerAccountSelector from '@/components/BrokerAccountSelector';
import { useBrokerAccount } from '@/contexts/BrokerAccountContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bot,
  Target,
  Zap,
  BarChart3,
  Activity,
  Bell,
  Star,
  Shield,
  Brain,
  BookOpen,
  Play,
  ArrowRight,
  Settings
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const { selectedAccount, setSelectedAccount } = useBrokerAccount();
  const { 
    workflowState, 
    executeWorkflow, 
    triggerFromDashboard, 
    navigateToTrading,
    toggleWorkflow,
    createWorkflow,
    handleDeepLink 
  } = useWorkflow();
  const searchParams = useSearchParams();

  // Handle deep linking on page load
  useEffect(() => {
    if (searchParams) {
      handleDeepLink(searchParams);
    }
  }, [searchParams, handleDeepLink]);
  const [activeView, setActiveView] = useState<'overview' | 'trading' | 'automation' | 'strategies' | 'ai-signals' | 'templates' | 'signals' | 'backtesting' | 'performance-analytics'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gainzAlgoActive, setGainzAlgoActive] = useState(false);
  const [copyTradingActive, setCopyTradingActive] = useState(false);
  const [riskManagementActive, setRiskManagementActive] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('idle'); // idle, partial, active, optimized

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Workflow automation effects
  useEffect(() => {
    if (gainzAlgoActive) {
      alert('🚀 GainzAlgo V2 Pro Strategy Activated!\n\n✅ High-frequency momentum trading enabled\n✅ 78% win rate target active\n✅ 1.85x profit factor optimization\n✅ Real-time signal generation started');
    }
  }, [gainzAlgoActive]);

  useEffect(() => {
    if (copyTradingActive) {
      alert('👥 Copy Trading Enabled!\n\n✅ Following top traders\n✅ Automatic trade copying active\n✅ Portfolio synchronization started\n✅ Risk management applied to copied trades');
    }
  }, [copyTradingActive]);

  useEffect(() => {
    if (riskManagementActive) {
      alert('🛡️ Risk Management Controls Activated!\n\n✅ Automated stop-loss enabled\n✅ Position sizing optimization\n✅ Drawdown protection active\n✅ Real-time risk monitoring started');
    }
  }, [riskManagementActive]);

  // Workflow coordination - automatically update status based on active features
  useEffect(() => {
    const activeFeatures = [gainzAlgoActive, copyTradingActive, riskManagementActive].filter(Boolean).length;
    
    if (activeFeatures === 0) {
      setWorkflowStatus('idle');
    } else if (activeFeatures === 1) {
      setWorkflowStatus('partial');
    } else if (activeFeatures === 2) {
      setWorkflowStatus('active');
    } else if (activeFeatures === 3) {
      setWorkflowStatus('optimized');
      // Show comprehensive workflow activation message
      setTimeout(() => {
        alert('🎯 Complete Trading Workflow Activated!\n\n🚀 GainzAlgo V2 Pro: High-frequency momentum trading\n👥 Copy Trading: Following top performers\n🛡️ Risk Management: Advanced protection\n\n✨ All systems are now working together seamlessly!\n📈 Maximum profit potential with optimal risk control');
      }, 500);
    }
  }, [gainzAlgoActive, copyTradingActive, riskManagementActive]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.firstName}! 🚀
              </h1>
              <p className="text-blue-100">
                Your trading performance is looking strong today. Ready to make some moves?
              </p>
              {/* Broker Account Selector */}
              <div className="mt-4 max-w-md">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Active Broker Account
                </label>
                <BrokerAccountSelector
                  selectedAccount={selectedAccount}
                  onAccountSelect={setSelectedAccount}
                  placeholder="Select your trading account"
                  className="text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">78.5%</p>
                  <p className="text-sm text-blue-100">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">1.85x</p>
                  <p className="text-sm text-blue-100">Profit Factor</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">#12</p>
                  <p className="text-sm text-blue-100">Global Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Status Indicator */}
        <div className={`rounded-lg p-4 border-2 transition-all duration-300 ${
          workflowStatus === 'idle' ? 'bg-gray-50 border-gray-200' :
          workflowStatus === 'partial' ? 'bg-yellow-50 border-yellow-300' :
          workflowStatus === 'active' ? 'bg-blue-50 border-blue-300' :
          'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                workflowStatus === 'idle' ? 'bg-gray-400' :
                workflowStatus === 'partial' ? 'bg-yellow-500 animate-pulse' :
                workflowStatus === 'active' ? 'bg-blue-500 animate-pulse' :
                'bg-green-500 animate-pulse'
              }`}></div>
              <div>
                <h3 className={`font-semibold ${
                  workflowStatus === 'idle' ? 'text-gray-700' :
                  workflowStatus === 'partial' ? 'text-yellow-700' :
                  workflowStatus === 'active' ? 'text-blue-700' :
                  'text-green-700'
                }`}>
                  Trading Workflow Status: {
                    workflowStatus === 'idle' ? 'Standby' :
                    workflowStatus === 'partial' ? 'Partially Active' :
                    workflowStatus === 'active' ? 'Active' :
                    'Fully Optimized'
                  }
                </h3>
                <p className={`text-sm ${
                  workflowStatus === 'idle' ? 'text-gray-600' :
                  workflowStatus === 'partial' ? 'text-yellow-600' :
                  workflowStatus === 'active' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {
                    workflowStatus === 'idle' ? 'Enable features below to start automated trading' :
                    workflowStatus === 'partial' ? 'Some automation features are active' :
                    workflowStatus === 'active' ? 'Multiple systems working together' :
                    'All automation systems fully integrated and optimized'
                  }
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {gainzAlgoActive && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">GainzAlgo</span>}
              {copyTradingActive && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Copy Trading</span>}
              {riskManagementActive && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Risk Control</span>}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Strategies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                <p className="text-sm text-green-600 dark:text-green-400">2 profitable</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Positions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">8 in profit</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Signals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">High confidence</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Copiers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">+8 today</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Portfolio Overview</span>
            </button>
            <button
              onClick={() => setActiveView('trading')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'trading'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Target className="h-5 w-5" />
              <span>Trading Panel</span>
            </button>
            <button
              onClick={() => setActiveView('strategies')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'strategies'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Strategies</span>
            </button>
            <button
              onClick={() => setActiveView('automation')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'automation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Bot className="h-5 w-5" />
              <span>Automation Hub</span>
            </button>
            <button
              onClick={() => setActiveView('ai-signals')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeView === 'ai-signals'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Brain className="h-5 w-5" />
              <span>AI Signals</span>
            </button>
            <button
               onClick={() => setActiveView('templates')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'templates'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <BookOpen className="h-5 w-5" />
               <span>Templates</span>
             </button>
             <button
               onClick={() => setActiveView('signals')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'signals'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <Zap className="h-5 w-5" />
               <span>Signals</span>
             </button>
             <button
               onClick={() => setActiveView('backtesting')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'backtesting'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <BarChart3 className="h-5 w-5" />
               <span>Backtesting</span>
             </button>
             <button
               onClick={() => setActiveView('performance-analytics')}
               className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                 activeView === 'performance-analytics'
                   ? 'bg-blue-600 text-white shadow-sm'
                   : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <Activity className="h-5 w-5" />
               <span>Performance</span>
             </button>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'overview' && <PortfolioOverview />}
        {activeView === 'trading' && <TradingPanel />}
        {activeView === 'strategies' && <AutomatedStrategies />}
        {activeView === 'ai-signals' && <AISignalGenerator />}
         {activeView === 'templates' && <StrategyTemplates />}
         {activeView === 'signals' && <SignalDeliverySystem />}
         {activeView === 'backtesting' && <BacktestingEngine />}
         {activeView === 'performance-analytics' && <PerformanceAnalytics />}
        {activeView === 'automation' && (
          <div className="space-y-6">
            {/* Workflow Status Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Workflow Automation</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    workflowState.isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {workflowState.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {workflowState.workflows.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {workflowState.activeWorkflows.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {workflowState.recentExecutions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Recent Executions</div>
                </div>
              </div>
            </div>

            {/* Available Workflows */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Workflows</h4>
              <div className="space-y-4">
                {workflowState.workflows.map((workflow) => (
                  <div key={workflow.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          workflow.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{workflow.name}</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{workflow.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Executions: {workflow.executionCount}</span>
                        <span>Success Rate: {workflow.successRate}%</span>
                        {workflow.lastExecuted && (
                          <span>Last: {new Date(workflow.lastExecuted).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWorkflow(workflow.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          workflow.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {workflow.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => {
                          triggerFromDashboard(workflow.id, {
                            source: 'dashboard',
                            timestamp: new Date().toISOString()
                          });
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Play className="h-3 w-3" />
                        <span>Execute</span>
                      </button>
                      <button
                        onClick={() => {
                          triggerFromDashboard(workflow.id);
                          navigateToTrading(workflow.id, {
                             autoExecute: false,
                             source: 'dashboard',
                             workflowName: workflow.name,
                             timestamp: Date.now()
                           });
                        }}
                        className="px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <ArrowRight className="h-3 w-3" />
                        <span>Go to Trading</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Workflow Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Workflow Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    const stopLossWorkflow = workflowState.workflows.find(w => w.id === 'auto-stop-loss');
                    if (stopLossWorkflow) {
                      triggerFromDashboard(stopLossWorkflow.id, { action: 'quick_trigger' });
                      navigateToTrading(stopLossWorkflow.id, {
                        autoExecute: true,
                        source: 'dashboard_quick_action',
                        workflowType: 'risk_management',
                        timestamp: Date.now()
                      });
                    }
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                >
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Auto Stop Loss</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Activate & Go to Trading</div>
                </button>
                
                <button
                  onClick={() => {
                    const profitWorkflow = workflowState.workflows.find(w => w.id === 'profit-taking');
                    if (profitWorkflow) {
                      triggerFromDashboard(profitWorkflow.id, { action: 'quick_trigger' });
                      navigateToTrading(profitWorkflow.id, {
                        autoExecute: true,
                        source: 'dashboard_quick_action',
                        workflowType: 'profit_taking',
                        timestamp: Date.now()
                      });
                    }
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-center"
                >
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Profit Taking</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Activate & Go to Trading</div>
                </button>
                
                <button
                  onClick={() => {
                    // Create and trigger portfolio rebalancing workflow
                    createWorkflow({
                       name: 'Portfolio Rebalancing',
                       description: 'Automatically rebalance portfolio based on target allocations',
                       isActive: false,
                       steps: []
                     });
                    alert('🔄 Portfolio Rebalancing Workflow Created!\n\n✅ Target allocation analysis\n✅ Automatic rebalancing triggers\n✅ Risk-adjusted position sizing\n✅ Execution optimization');
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-center"
                >
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Portfolio Rebalancing</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Create & Activate</div>
                </button>
                
                <button
                  onClick={() => {
                    // Create and trigger market scanning workflow
                    createWorkflow({
                       name: 'Market Scanner',
                       description: 'Scan markets for trading opportunities based on technical indicators',
                       isActive: false,
                       steps: []
                     });
                    alert('🔍 Market Scanner Workflow Created!\n\n✅ Real-time market scanning\n✅ Technical indicator analysis\n✅ Opportunity alerts\n✅ Automated signal generation');
                  }}
                  className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-center"
                >
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900 dark:text-white">Market Scanner</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Create & Activate</div>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => window.open('/automation', '_blank')}
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-center"
                  >
                    <Settings className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Workflow Builder</div>
                    <div className="text-sm opacity-90">Create Custom Workflows</div>
                  </button>
                  
                  <button
                    onClick={() => navigateToTrading(undefined, {
                       source: 'dashboard_quick_action',
                       timestamp: Date.now()
                     })}
                    className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors text-center"
                  >
                    <ArrowRight className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Go to Trading</div>
                    <div className="text-sm opacity-90">Open Trading Dashboard</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Trigger all active workflows
                      workflowState.activeWorkflows.forEach(workflow => {
                        triggerFromDashboard(workflow.id, { action: 'bulk_trigger', source: 'dashboard' });
                      });
                      alert(`🚀 Triggered ${workflowState.activeWorkflows.length} Active Workflows!\n\nAll your active automation workflows have been executed.`);
                    }}
                    className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-colors text-center"
                  >
                    <Play className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Execute All</div>
                    <div className="text-sm opacity-90">Run Active Workflows</div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Workflow Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Workflow Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'DCA Strategy',
                          description: 'Dollar-cost averaging with automated recurring purchases',
                          isActive: false,
                          steps: []
                        });
                       alert('💰 DCA Strategy Template Applied!\n\n✅ Weekly recurring purchases\n✅ Automated dollar-cost averaging\n✅ Risk-adjusted position sizing');
                     }}>
                  <DollarSign className="h-8 w-8 text-green-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">DCA Strategy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Automated dollar-cost averaging with scheduled purchases</div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'Momentum Trading',
                          description: 'Automated momentum-based trading strategy',
                          isActive: false,
                          steps: []
                        });
                       alert('⚡ Momentum Trading Template Applied!\n\n✅ Technical indicator triggers\n✅ Momentum-based entries\n✅ Automated position management');
                     }}>
                  <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Momentum Trading</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Capture market momentum with automated entries and exits</div>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                     onClick={() => {
                       createWorkflow({
                          name: 'Risk Management Suite',
                          description: 'Comprehensive risk management and protection',
                          isActive: false,
                          steps: []
                        });
                       alert('🛡️ Risk Management Suite Applied!\n\n✅ Automated stop-losses\n✅ Position size management\n✅ Drawdown protection\n✅ Portfolio risk monitoring');
                     }}>
                  <Shield className="h-8 w-8 text-red-600 mb-3" />
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Risk Management</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Comprehensive risk controls and automated protection</div>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Recent Executions */}
            {workflowState.recentExecutions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Executions</h4>
                <div className="space-y-3">
                  {workflowState.recentExecutions.slice(0, 5).map((execution) => {
                    const workflow = workflowState.workflows.find(w => w.id === execution.workflowId);
                    return (
                      <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {workflow?.name || execution.workflowId}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(execution.startTime).toLocaleString()}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          execution.status === 'completed' ? 'bg-green-100 text-green-700' :
                          execution.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {execution.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-6 w-6" />
              <h3 className="text-lg font-semibold">GainzAlgo V2 Pro</h3>
            </div>
            <p className="text-green-100 text-sm mb-4">
              High-frequency momentum strategy with 78% win rate and 1.85x profit factor
            </p>
            <button 
              onClick={() => setGainzAlgoActive(!gainzAlgoActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                gainzAlgoActive 
                  ? 'bg-green-200 text-green-800 hover:bg-green-300' 
                  : 'bg-white text-green-600 hover:bg-gray-100'
              }`}
            >
              {gainzAlgoActive ? 'Deactivate Strategy' : 'Activate Strategy'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Copy Trading</h3>
            </div>
            <p className="text-purple-100 text-sm mb-4">
              Follow top traders and automatically copy their winning strategies
            </p>
            <button 
              onClick={() => setCopyTradingActive(!copyTradingActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                copyTradingActive 
                  ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {copyTradingActive ? 'Disable Copy Trading' : 'Enable Copy Trading'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Risk Management</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Advanced risk controls with automated stop-loss and position sizing
            </p>
            <button 
              onClick={() => setRiskManagementActive(!riskManagementActive)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                riskManagementActive 
                  ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' 
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              {riskManagementActive ? 'Risk Controls Active' : 'Enable Risk Controls'}
            </button>
          </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}