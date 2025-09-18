'use client';

import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Crown,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Lock,
  Unlock,
  Gift,
  Bell,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  Info,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    copyTrades: number;
    aiAnalysis: number;
    portfolios: number;
    alerts: number;
    apiCalls: number;
  };
  popular?: boolean;
  current?: boolean;
}

interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  usage: {
    copyTrades: number;
    aiAnalysis: number;
    portfolios: number;
    alerts: number;
    apiCalls: number;
  };
}

interface FeatureAccess {
  canAccessFeature: (feature: string) => boolean;
  getRemainingUsage: (feature: string) => number;
  getUsagePercentage: (feature: string) => number;
  isLimitReached: (feature: string) => boolean;
}

const SubscriptionManager: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription>({
    planId: 'free',
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-02-01',
    cancelAtPeriodEnd: false,
    usage: {
      copyTrades: 2,
      aiAnalysis: 8,
      portfolios: 1,
      alerts: 5,
      apiCalls: 450
    }
  });

  const [availablePlans] = useState<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Free Trial',
      price: 0,
      billingPeriod: 'monthly',
      features: [
        'Basic copy trading (3 traders)',
        'Limited AI analysis (10/month)',
        '1 portfolio',
        'Basic alerts (5/month)',
        'Community support'
      ],
      limits: {
        copyTrades: 3,
        aiAnalysis: 10,
        portfolios: 1,
        alerts: 5,
        apiCalls: 500
      }
    },
    {
      id: 'pro-monthly',
      name: 'Pro Trader',
      price: 49,
      billingPeriod: 'monthly',
      features: [
        'Advanced copy trading (25 traders)',
        'Unlimited AI analysis',
        '5 portfolios',
        'Advanced alerts (100/month)',
        'Priority support',
        'Risk management tools',
        'Performance analytics'
      ],
      limits: {
        copyTrades: 25,
        aiAnalysis: -1, // unlimited
        portfolios: 5,
        alerts: 100,
        apiCalls: 10000
      },
      popular: true
    },
    {
      id: 'pro-yearly',
      name: 'Pro Trader Annual',
      price: 490,
      billingPeriod: 'yearly',
      features: [
        'Everything in Pro Trader',
        '2 months free',
        'Advanced copy trading (50 traders)',
        'Unlimited AI analysis',
        '10 portfolios',
        'Unlimited alerts',
        'White-label solutions',
        'API access',
        'Dedicated account manager'
      ],
      limits: {
        copyTrades: 50,
        aiAnalysis: -1,
        portfolios: 10,
        alerts: -1,
        apiCalls: 50000
      }
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const currentPlan = availablePlans.find(plan => plan.id === currentSubscription.planId);

  const getFeatureAccess = (): FeatureAccess => {
    const plan = currentPlan;
    if (!plan) {
      return {
        canAccessFeature: () => false,
        getRemainingUsage: () => 0,
        getUsagePercentage: () => 100,
        isLimitReached: () => true
      };
    }

    return {
      canAccessFeature: (feature: string) => {
        const featureMap: { [key: string]: keyof typeof plan.limits } = {
          'copy-trading': 'copyTrades',
          'ai-analysis': 'aiAnalysis',
          'portfolios': 'portfolios',
          'alerts': 'alerts',
          'api-calls': 'apiCalls'
        };
        const limitKey = featureMap[feature];
        if (!limitKey) return false;
        
        const limit = plan.limits[limitKey];
        const usage = currentSubscription.usage[limitKey];
        
        return limit === -1 || usage < limit;
      },
      getRemainingUsage: (feature: string) => {
        const featureMap: { [key: string]: keyof typeof plan.limits } = {
          'copy-trading': 'copyTrades',
          'ai-analysis': 'aiAnalysis',
          'portfolios': 'portfolios',
          'alerts': 'alerts',
          'api-calls': 'apiCalls'
        };
        const limitKey = featureMap[feature];
        if (!limitKey) return 0;
        
        const limit = plan.limits[limitKey];
        const usage = currentSubscription.usage[limitKey];
        
        return limit === -1 ? Infinity : Math.max(0, limit - usage);
      },
      getUsagePercentage: (feature: string) => {
        const featureMap: { [key: string]: keyof typeof plan.limits } = {
          'copy-trading': 'copyTrades',
          'ai-analysis': 'aiAnalysis',
          'portfolios': 'portfolios',
          'alerts': 'alerts',
          'api-calls': 'apiCalls'
        };
        const limitKey = featureMap[feature];
        if (!limitKey) return 100;
        
        const limit = plan.limits[limitKey];
        const usage = currentSubscription.usage[limitKey];
        
        return limit === -1 ? 0 : Math.min(100, (usage / limit) * 100);
      },
      isLimitReached: (feature: string) => {
        const featureMap: { [key: string]: keyof typeof plan.limits } = {
          'copy-trading': 'copyTrades',
          'ai-analysis': 'aiAnalysis',
          'portfolios': 'portfolios',
          'alerts': 'alerts',
          'api-calls': 'apiCalls'
        };
        const limitKey = featureMap[feature];
        if (!limitKey) return true;
        
        const limit = plan.limits[limitKey];
        const usage = currentSubscription.usage[limitKey];
        
        return limit !== -1 && usage >= limit;
      }
    };
  };

  const featureAccess = getFeatureAccess();

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentSubscription(prev => ({
        ...prev,
        planId,
        status: 'active',
        currentPeriodStart: new Date().toISOString().split('T')[0],
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      setSelectedPlan('');
    } catch (error) {
      logger.error('Subscription upgrade failed', error, 'SubscriptionManager');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCurrentSubscription(prev => ({
        ...prev,
        cancelAtPeriodEnd: true
      }));
      setShowCancelDialog(false);
    } catch (error) {
      logger.error('Subscription cancellation failed', error, 'SubscriptionManager');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-blue-500';
      case 'cancelled': return 'bg-orange-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Current Subscription
            </CardTitle>
            <Badge className={cn('text-white', getStatusColor(currentSubscription.status))}>
              {currentSubscription.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="font-semibold">{currentPlan?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Billing</p>
              <p className="font-semibold">{formatDate(currentSubscription.currentPeriodEnd)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-semibold">
                ${currentPlan?.price || 0}/{currentPlan?.billingPeriod === 'yearly' ? 'year' : 'month'}
              </p>
            </div>
          </div>
          
          {currentSubscription.cancelAtPeriodEnd && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be cancelled at the end of the current billing period.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'copy-trading', label: 'Copy Trades', icon: Users, current: currentSubscription.usage.copyTrades, limit: currentPlan?.limits.copyTrades || 0 },
              { key: 'ai-analysis', label: 'AI Analysis', icon: Zap, current: currentSubscription.usage.aiAnalysis, limit: currentPlan?.limits.aiAnalysis || 0 },
              { key: 'portfolios', label: 'Portfolios', icon: Target, current: currentSubscription.usage.portfolios, limit: currentPlan?.limits.portfolios || 0 },
              { key: 'alerts', label: 'Alerts', icon: Bell, current: currentSubscription.usage.alerts, limit: currentPlan?.limits.alerts || 0 },
              { key: 'api-calls', label: 'API Calls', icon: Activity, current: currentSubscription.usage.apiCalls, limit: currentPlan?.limits.apiCalls || 0 }
            ].map(({ key, label, icon: Icon, current, limit }) => {
              const percentage = featureAccess.getUsagePercentage(key);
              const isLimited = limit !== -1;
              const isNearLimit = percentage > 80;
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {current}{isLimited ? `/${limit}` : ''}
                    </span>
                  </div>
                  {isLimited && (
                    <Progress 
                      value={percentage} 
                      className={cn(
                        "h-2",
                        isNearLimit && "[&>div]:bg-orange-500",
                        percentage >= 100 && "[&>div]:bg-red-500"
                      )}
                    />
                  )}
                  {!isLimited && (
                    <Badge variant="outline" className="text-xs">
                      Unlimited
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => {
              const isCurrent = plan.id === currentSubscription.planId;
              const isSelected = plan.id === selectedPlan;
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative border rounded-lg p-6 cursor-pointer transition-all",
                    isCurrent && "border-blue-500 bg-blue-50",
                    isSelected && "border-green-500 bg-green-50",
                    plan.popular && "border-yellow-500"
                  )}
                  onClick={() => !isCurrent && setSelectedPlan(isSelected ? '' : plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-sm text-gray-600">/{plan.billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {isCurrent ? (
                      <Badge className="w-full bg-blue-500">
                        Current Plan
                      </Badge>
                    ) : (
                      <Button
                        className="w-full"
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            handleUpgrade(plan.id);
                          } else {
                            setSelectedPlan(plan.id);
                          }
                        }}
                        disabled={isUpgrading}
                      >
                        {isUpgrading && isSelected ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {isSelected ? 'Confirm Upgrade' : 'Select Plan'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Actions */}
      {currentSubscription.planId !== 'free' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Subscription Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Update Payment Method
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => setShowCancelDialog(true)}
                disabled={currentSubscription.cancelAtPeriodEnd}
              >
                <XCircle className="h-4 w-4" />
                {currentSubscription.cancelAtPeriodEnd ? 'Cancellation Pending' : 'Cancel Subscription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Cancel Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Are you sure you want to cancel your subscription? You&apos;ll lose access to premium features at the end of your current billing period.</p>
              <div className="flex gap-4">
                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                  className="flex-1"
                >
                  Yes, Cancel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1"
                >
                  Keep Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
export type { FeatureAccess, SubscriptionPlan, UserSubscription };