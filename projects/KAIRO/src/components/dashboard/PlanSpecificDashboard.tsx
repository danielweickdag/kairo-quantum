'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Crown,
  Star,
  Zap,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Lock,
  Unlock,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  Eye,
  Copy,
  Share2,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Brain,
  Rocket,
  Globe,
  Award,
  Clock,
  Percent,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeatureAccess, UserSubscription } from '../subscription/SubscriptionManager';

interface DashboardProps {
  userSubscription: UserSubscription;
  featureAccess: FeatureAccess;
}

interface DashboardWidget {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  requiredPlan?: string;
  feature?: string;
  priority: number;
}

interface TradingMetric {
  label: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

const PlanSpecificDashboard: React.FC<DashboardProps> = ({ userSubscription, featureAccess }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Mock trading data
  const [tradingMetrics] = useState<TradingMetric[]>([
    {
      label: 'Portfolio Value',
      value: '$24,567.89',
      change: 12.5,
      changeType: 'positive',
      icon: DollarSign
    },
    {
      label: 'Total Return',
      value: '+$3,245.67',
      change: 15.2,
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      label: 'Active Trades',
      value: '12',
      change: 2,
      changeType: 'positive',
      icon: Activity
    },
    {
      label: 'Win Rate',
      value: '78.5%',
      change: -2.1,
      changeType: 'negative',
      icon: Target
    }
  ]);

  const [copyTradingData] = useState({
    followedTraders: [
      { name: 'Alex Chen', return: '+24.5%', followers: 1250, risk: 'Medium' },
      { name: 'Sarah Johnson', return: '+18.7%', followers: 890, risk: 'Low' },
      { name: 'Mike Rodriguez', return: '+31.2%', followers: 2100, risk: 'High' }
    ],
    availableSlots: featureAccess.getRemainingUsage('copy-trading')
  });

  const [aiInsights] = useState([
    {
      type: 'opportunity',
      title: 'AAPL Bullish Signal Detected',
      description: 'Technical indicators suggest a potential 8-12% upside in the next 2 weeks.',
      confidence: 85,
      timeframe: '2h ago'
    },
    {
      type: 'warning',
      title: 'Market Volatility Alert',
      description: 'Increased volatility expected due to upcoming Fed announcement.',
      confidence: 92,
      timeframe: '4h ago'
    },
    {
      type: 'recommendation',
      title: 'Portfolio Rebalancing Suggested',
      description: 'Consider reducing tech exposure and increasing defensive positions.',
      confidence: 78,
      timeframe: '6h ago'
    }
  ]);

  const getCurrentPlanName = () => {
    switch (userSubscription.planId) {
      case 'free': return 'Free Trial';
      case 'pro-monthly': return 'Pro Trader';
      case 'pro-yearly': return 'Pro Trader Annual';
      default: return 'Unknown Plan';
    }
  };

  const getUpgradePrompts = () => {
    const prompts = [];
    
    if (userSubscription.planId === 'free') {
      if (featureAccess.getUsagePercentage('copy-trading') > 80) {
        prompts.push({
          title: 'Copy Trading Limit Reached',
          description: 'Upgrade to Pro to follow up to 25 traders and unlock advanced features.',
          action: 'Upgrade to Pro',
          feature: 'copy-trading'
        });
      }
      
      if (featureAccess.getUsagePercentage('ai-analysis') > 80) {
        prompts.push({
          title: 'AI Analysis Limit Almost Reached',
          description: 'Get unlimited AI-powered market analysis with Pro plan.',
          action: 'Upgrade Now',
          feature: 'ai-analysis'
        });
      }
    }
    
    return prompts;
  };

  const upgradePrompts = getUpgradePrompts();

  const getWidgets = (): DashboardWidget[] => {
    const baseWidgets: DashboardWidget[] = [
      {
        id: 'portfolio-overview',
        title: 'Portfolio Overview',
        icon: PieChart,
        priority: 1,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {tradingMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">{metric.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{metric.value}</span>
                      <span className={cn(
                        "text-sm flex items-center gap-1",
                        metric.changeType === 'positive' && "text-green-600",
                        metric.changeType === 'negative' && "text-red-600",
                        metric.changeType === 'neutral' && "text-gray-600"
                      )}>
                        {metric.changeType === 'positive' ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : metric.changeType === 'negative' ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : null}
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      },
      {
        id: 'copy-trading',
        title: 'Copy Trading',
        icon: Users,
        priority: 2,
        feature: 'copy-trading',
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Following {copyTradingData.followedTraders.length} traders
              </span>
              <Badge variant="outline">
                {copyTradingData.availableSlots === Infinity ? 'Unlimited' : `${copyTradingData.availableSlots} slots left`}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {copyTradingData.followedTraders.slice(0, 3).map((trader, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{trader.name}</p>
                    <p className="text-xs text-gray-600">{trader.followers} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{trader.return}</p>
                    <p className="text-xs text-gray-600">{trader.risk} Risk</p>
                  </div>
                </div>
              ))}
            </div>
            
            {featureAccess.canAccessFeature('copy-trading') ? (
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Follow New Trader
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="w-full" disabled>
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to Follow More
              </Button>
            )}
          </div>
        )
      },
      {
        id: 'ai-insights',
        title: 'AI Market Insights',
        icon: Brain,
        priority: 3,
        feature: 'ai-analysis',
        content: (
          <div className="space-y-3">
            {featureAccess.canAccessFeature('ai-analysis') ? (
              aiInsights.slice(0, 2).map((insight, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        insight.type === 'opportunity' && "border-green-500 text-green-700",
                        insight.type === 'warning' && "border-orange-500 text-orange-700",
                        insight.type === 'recommendation' && "border-blue-500 text-blue-700"
                      )}
                    >
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  <p className="text-xs text-gray-500">{insight.timeframe}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Upgrade to access AI insights</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>
                {featureAccess.getRemainingUsage('ai-analysis') === Infinity 
                  ? 'Unlimited' 
                  : `${featureAccess.getRemainingUsage('ai-analysis')} analyses left`
                }
              </span>
              <Button size="sm" variant="ghost" className="h-6 px-2">
                View All
              </Button>
            </div>
          </div>
        )
      }
    ];

    // Add premium widgets for paid plans
    if (userSubscription.planId !== 'free') {
      baseWidgets.push({
        id: 'advanced-analytics',
        title: 'Advanced Analytics',
        icon: BarChart3,
        priority: 4,
        requiredPlan: 'pro',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">85.2%</p>
                <p className="text-xs text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">2.4x</p>
                <p className="text-xs text-gray-600">Risk/Reward</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sharpe Ratio</span>
                <span className="font-medium">1.85</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Max Drawdown</span>
                <span className="font-medium text-red-600">-8.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Volatility</span>
                <span className="font-medium">12.3%</span>
              </div>
            </div>
          </div>
        )
      });
    }

    return baseWidgets.sort((a, b) => a.priority - b.priority);
  };

  const widgets = getWidgets();

  return (
    <div className="space-y-6">
      {/* Plan Status Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-yellow-500" />
              <div>
                <h2 className="text-xl font-bold">{getCurrentPlanName()}</h2>
                <p className="text-sm text-gray-600">
                  {userSubscription.status === 'trial' ? 'Trial expires' : 'Next billing'}: {' '}
                  {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {userSubscription.planId === 'free' && (
              <Button className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompts */}
      {upgradePrompts.length > 0 && (
        <div className="space-y-3">
          {upgradePrompts.map((prompt, index) => (
            <Alert key={index} className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-orange-800">{prompt.title}</p>
                  <p className="text-sm text-orange-700">{prompt.description}</p>
                </div>
                <Button size="sm" className="ml-4">
                  {prompt.action}
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Usage Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Plan Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'copy-trading', label: 'Copy Trades', current: userSubscription.usage.copyTrades },
              { key: 'ai-analysis', label: 'AI Analysis', current: userSubscription.usage.aiAnalysis },
              { key: 'portfolios', label: 'Portfolios', current: userSubscription.usage.portfolios }
            ].map(({ key, label, current }) => {
              const percentage = featureAccess.getUsagePercentage(key);
              const remaining = featureAccess.getRemainingUsage(key);
              const isUnlimited = remaining === Infinity;
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-gray-600">
                      {isUnlimited ? 'Unlimited' : `${current}/${current + remaining}`}
                    </span>
                  </div>
                  {!isUnlimited && (
                    <Progress 
                      value={percentage} 
                      className={cn(
                        "h-2",
                        percentage > 80 && "[&>div]:bg-orange-500",
                        percentage >= 100 && "[&>div]:bg-red-500"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          const hasAccess = !widget.feature || featureAccess.canAccessFeature(widget.feature);
          
          return (
            <Card key={widget.id} className={cn(!hasAccess && "opacity-60")}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" />
                  {widget.title}
                  {!hasAccess && <Lock className="h-3 w-3 text-gray-400" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasAccess ? (
                  widget.content
                ) : (
                  <div className="text-center py-4">
                    <Lock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Upgrade to access this feature
                    </p>
                    <Button size="sm" variant="outline">
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Users className="h-5 w-5" />
              <span className="text-sm">Find Traders</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Brain className="h-5 w-5" />
              <span className="text-sm">AI Analysis</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">View Reports</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Settings className="h-5 w-5" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanSpecificDashboard;