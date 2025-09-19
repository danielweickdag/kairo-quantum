'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  DollarSign,
  Repeat,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Send,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Zap,
  Target,
  Award,
  Star,
  Building,
  Globe,
  Mail,
  Phone,
  FileText,
  BarChart3,
  PieChart,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  CreditCard as CardIcon,
  Banknote,
  Coins
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'crypto' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
  addedAt: string;
  lastUsed?: string;
  failureCount: number;
  country: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planType: 'basic' | 'premium' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'failed' | 'trial';
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentMethodId: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  failedPayments: number;
  totalPaid: number;
  discountCode?: string;
  discountAmount?: number;
}

interface Transaction {
  id: string;
  userId: string;
  subscriptionId?: string;
  type: 'subscription' | 'one_time' | 'refund' | 'chargeback' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  description: string;
  paymentMethodId: string;
  processedAt: string;
  failureReason?: string;
  refundAmount?: number;
  fees: number;
  netAmount: number;
  gatewayTransactionId: string;
  riskScore: number;
  fraudCheck: 'passed' | 'failed' | 'pending' | 'manual_review';
}

interface PaymentGateway {
  id: string;
  name: string;
  provider: 'stripe' | 'paypal' | 'square' | 'adyen' | 'braintree';
  isActive: boolean;
  supportedMethods: string[];
  supportedCurrencies: string[];
  processingFee: number;
  successRate: number;
  averageProcessingTime: number; // in seconds
  monthlyVolume: number;
  configuration: {
    apiKey?: string;
    webhookUrl?: string;
    testMode: boolean;
  };
}

interface PaymentMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  successRate: number;
  failedPayments: number;
  refundRate: number;
  activeSubscriptions: number;
  trialConversions: number;
  paymentVolume: number;
  processingFees: number;
  netRevenue: number;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: 'retry_failed_payments' | 'dunning_management' | 'fraud_detection' | 'subscription_lifecycle' | 'revenue_optimization';
  isActive: boolean;
  conditions: {
    trigger: string;
    criteria: any;
  };
  actions: {
    type: string;
    parameters: any;
  }[];
  executionCount: number;
  successRate: number;
  lastExecuted?: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    provider: 'Visa',
    last4: '4242',
    expiryDate: '12/26',
    isDefault: true,
    isActive: true,
    addedAt: '2024-01-10T10:00:00Z',
    lastUsed: '2024-01-15T08:30:00Z',
    failureCount: 0,
    country: 'US'
  },
  {
    id: '2',
    type: 'bank_transfer',
    provider: 'ACH',
    isDefault: false,
    isActive: true,
    addedAt: '2024-01-05T14:20:00Z',
    lastUsed: '2024-01-12T16:45:00Z',
    failureCount: 1,
    country: 'US'
  },
  {
    id: '3',
    type: 'crypto',
    provider: 'Bitcoin',
    isDefault: false,
    isActive: true,
    addedAt: '2024-01-08T09:15:00Z',
    failureCount: 0,
    country: 'Global'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: 'user_1',
    planId: 'premium_monthly',
    planName: 'Premium Plan',
    planType: 'premium',
    status: 'active',
    amount: 29.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-01-01T00:00:00Z',
    nextBillingDate: '2024-02-01T00:00:00Z',
    autoRenew: true,
    paymentMethodId: '1',
    failedPayments: 0,
    totalPaid: 89.97,
    discountCode: 'WELCOME20',
    discountAmount: 6.00
  },
  {
    id: '2',
    userId: 'user_2',
    planId: 'professional_yearly',
    planName: 'Professional Plan',
    planType: 'professional',
    status: 'active',
    amount: 299.99,
    currency: 'USD',
    billingCycle: 'yearly',
    startDate: '2023-12-15T00:00:00Z',
    endDate: '2024-12-15T00:00:00Z',
    nextBillingDate: '2024-12-15T00:00:00Z',
    autoRenew: true,
    paymentMethodId: '2',
    failedPayments: 0,
    totalPaid: 299.99
  },
  {
    id: '3',
    userId: 'user_3',
    planId: 'basic_monthly',
    planName: 'Basic Plan',
    planType: 'basic',
    status: 'failed',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2025-01-10T00:00:00Z',
    nextBillingDate: '2024-02-10T00:00:00Z',
    autoRenew: true,
    paymentMethodId: '1',
    failedPayments: 2,
    totalPaid: 9.99
  },
  {
    id: '4',
    userId: 'user_4',
    planId: 'premium_monthly',
    planName: 'Premium Plan',
    planType: 'premium',
    status: 'trial',
    amount: 29.99,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: '2024-01-12T00:00:00Z',
    endDate: '2025-01-12T00:00:00Z',
    nextBillingDate: '2024-01-26T00:00:00Z',
    autoRenew: true,
    paymentMethodId: '1',
    trialEndsAt: '2024-01-26T00:00:00Z',
    failedPayments: 0,
    totalPaid: 0
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user_1',
    subscriptionId: '1',
    type: 'subscription',
    status: 'completed',
    amount: 29.99,
    currency: 'USD',
    description: 'Premium Plan - Monthly',
    paymentMethodId: '1',
    processedAt: '2024-01-15T08:30:00Z',
    fees: 1.17,
    netAmount: 28.82,
    gatewayTransactionId: 'txn_1234567890',
    riskScore: 15,
    fraudCheck: 'passed'
  },
  {
    id: '2',
    userId: 'user_2',
    subscriptionId: '2',
    type: 'subscription',
    status: 'completed',
    amount: 299.99,
    currency: 'USD',
    description: 'Professional Plan - Yearly',
    paymentMethodId: '2',
    processedAt: '2023-12-15T10:00:00Z',
    fees: 8.70,
    netAmount: 291.29,
    gatewayTransactionId: 'txn_0987654321',
    riskScore: 8,
    fraudCheck: 'passed'
  },
  {
    id: '3',
    userId: 'user_3',
    subscriptionId: '3',
    type: 'subscription',
    status: 'failed',
    amount: 9.99,
    currency: 'USD',
    description: 'Basic Plan - Monthly',
    paymentMethodId: '1',
    processedAt: '2024-01-14T12:00:00Z',
    failureReason: 'Insufficient funds',
    fees: 0,
    netAmount: 0,
    gatewayTransactionId: 'txn_failed_123',
    riskScore: 25,
    fraudCheck: 'passed'
  },
  {
    id: '4',
    userId: 'user_1',
    type: 'refund',
    status: 'completed',
    amount: -15.00,
    currency: 'USD',
    description: 'Partial refund - Premium Plan',
    paymentMethodId: '1',
    processedAt: '2024-01-13T14:30:00Z',
    refundAmount: 15.00,
    fees: -0.44,
    netAmount: -14.56,
    gatewayTransactionId: 'refund_567890',
    riskScore: 0,
    fraudCheck: 'passed'
  }
];

const mockGateways: PaymentGateway[] = [
  {
    id: '1',
    name: 'Stripe',
    provider: 'stripe',
    isActive: true,
    supportedMethods: ['credit_card', 'debit_card', 'bank_transfer', 'apple_pay', 'google_pay'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    processingFee: 2.9,
    successRate: 97.8,
    averageProcessingTime: 3.2,
    monthlyVolume: 125750.00,
    configuration: {
      testMode: false,
      webhookUrl: 'https://api.kairo.com/webhooks/stripe'
    }
  },
  {
    id: '2',
    name: 'PayPal',
    provider: 'paypal',
    isActive: true,
    supportedMethods: ['paypal', 'credit_card', 'debit_card'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    processingFee: 3.5,
    successRate: 95.2,
    averageProcessingTime: 5.8,
    monthlyVolume: 45200.00,
    configuration: {
      testMode: false,
      webhookUrl: 'https://api.kairo.com/webhooks/paypal'
    }
  },
  {
    id: '3',
    name: 'Crypto Gateway',
    provider: 'adyen',
    isActive: true,
    supportedMethods: ['crypto'],
    supportedCurrencies: ['BTC', 'ETH', 'USDC'],
    processingFee: 1.5,
    successRate: 99.1,
    averageProcessingTime: 15.0,
    monthlyVolume: 28900.00,
    configuration: {
      testMode: false
    }
  }
];

const mockAutomationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Smart Payment Retry',
    description: 'Automatically retry failed payments with optimized timing',
    type: 'retry_failed_payments',
    isActive: true,
    conditions: {
      trigger: 'payment_failed',
      criteria: { failureReason: ['insufficient_funds', 'card_declined'] }
    },
    actions: [
      { type: 'wait', parameters: { duration: '24h' } },
      { type: 'retry_payment', parameters: { maxAttempts: 3 } },
      { type: 'send_notification', parameters: { template: 'payment_retry' } }
    ],
    executionCount: 156,
    successRate: 68.5,
    lastExecuted: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Dunning Management',
    description: 'Automated email sequence for failed payments',
    type: 'dunning_management',
    isActive: true,
    conditions: {
      trigger: 'payment_failed',
      criteria: { failedAttempts: { gte: 2 } }
    },
    actions: [
      { type: 'send_email', parameters: { template: 'payment_failed_urgent' } },
      { type: 'pause_subscription', parameters: { gracePeriod: '7d' } },
      { type: 'notify_support', parameters: { priority: 'high' } }
    ],
    executionCount: 89,
    successRate: 45.2,
    lastExecuted: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    name: 'Fraud Detection',
    description: 'Real-time fraud detection and prevention',
    type: 'fraud_detection',
    isActive: true,
    conditions: {
      trigger: 'payment_attempt',
      criteria: { riskScore: { gte: 70 } }
    },
    actions: [
      { type: 'block_payment', parameters: {} },
      { type: 'manual_review', parameters: { priority: 'urgent' } },
      { type: 'notify_security', parameters: {} }
    ],
    executionCount: 23,
    successRate: 95.7,
    lastExecuted: '2024-01-15T16:45:00Z'
  },
  {
    id: '4',
    name: 'Trial Conversion',
    description: 'Optimize trial to paid conversion',
    type: 'subscription_lifecycle',
    isActive: true,
    conditions: {
      trigger: 'trial_ending',
      criteria: { daysRemaining: { lte: 3 } }
    },
    actions: [
      { type: 'send_email', parameters: { template: 'trial_ending' } },
      { type: 'offer_discount', parameters: { percentage: 20, duration: '3d' } },
      { type: 'schedule_call', parameters: { team: 'sales' } }
    ],
    executionCount: 67,
    successRate: 72.1,
    lastExecuted: '2024-01-15T09:15:00Z'
  }
];

const mockMetrics: PaymentMetrics = {
  totalRevenue: 1247850.00,
  monthlyRecurringRevenue: 89750.00,
  averageRevenuePerUser: 127.50,
  churnRate: 5.2,
  successRate: 96.8,
  failedPayments: 23,
  refundRate: 2.1,
  activeSubscriptions: 704,
  trialConversions: 156,
  paymentVolume: 199850.00,
  processingFees: 5796.00,
  netRevenue: 1242054.00
};

export default function PaymentProcessing() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [metrics, setMetrics] = useState<PaymentMetrics>(mockMetrics);
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'active': case 'passed': return 'text-green-500';
      case 'pending': case 'processing': case 'trial': return 'text-yellow-500';
      case 'failed': case 'cancelled': case 'expired': case 'refunded': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': case 'active': case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': case 'processing': case 'trial': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': case 'cancelled': case 'expired': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card': case 'debit_card': return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer': return <Building className="h-4 w-4" />;
      case 'crypto': return <Coins className="h-4 w-4" />;
      case 'paypal': return <Wallet className="h-4 w-4" />;
      default: return <CardIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    try {
      if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0';
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (error) {
      console.warn('Error formatting currency:', error);
      return '$0';
    }
  };

  const retryPayment = async (subscriptionId: string) => {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;

    // Simulate payment retry
    setSubscriptions(prev => prev.map(s => 
      s.id === subscriptionId 
        ? { ...s, status: 'active', failedPayments: 0 }
        : s
    ));

    // Add successful transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: subscription.userId,
      subscriptionId: subscription.id,
      type: 'subscription',
      status: 'completed',
      amount: subscription.amount,
      currency: subscription.currency,
      description: `${subscription.planName} - Retry Payment`,
      paymentMethodId: subscription.paymentMethodId,
      processedAt: new Date().toISOString(),
      fees: subscription.amount * 0.029,
      netAmount: subscription.amount * 0.971,
      gatewayTransactionId: `retry_${Date.now()}`,
      riskScore: 12,
      fraudCheck: 'passed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.gatewayTransactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-8 w-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold">Payment Processing</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated payment and subscription management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Processing</span>
            <Switch checked={autoProcessing} onCheckedChange={setAutoProcessing} />
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Payments
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="gateways">Gateways</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Recurring Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyRecurringRevenue)}</p>
                  </div>
                  <Repeat className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Revenue Per User</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.averageRevenuePerUser)}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-2xl font-bold text-green-500">{metrics.successRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Subscriptions</p>
                    <p className="text-2xl font-bold">{metrics.activeSubscriptions.toLocaleString()}</p>
                  </div>
                  <Activity className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</p>
                    <p className="text-2xl font-bold text-red-500">{metrics.churnRate}%</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Payments</p>
                    <p className="text-2xl font-bold text-yellow-500">{metrics.failedPayments}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing Fees</p>
                    <p className="text-2xl font-bold">{formatCurrency(metrics.processingFees)}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gateway Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Performance</CardTitle>
              <CardDescription>Real-time performance metrics for payment processors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gateways.map(gateway => (
                  <div key={gateway.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        gateway.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h3 className="font-bold">{gateway.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {gateway.supportedMethods.length} methods • {gateway.supportedCurrencies.length} currencies
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                        <p className="font-bold text-green-500">{gateway.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing Fee</p>
                        <p className="font-bold">{gateway.processingFee}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
                        <p className="font-bold">{gateway.averageProcessingTime}s</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Volume</p>
                        <p className="font-bold">{formatCurrency(gateway.monthlyVolume)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Subscriptions List */}
          <div className="space-y-4">
            {filteredSubscriptions.map(subscription => (
              <Card key={subscription.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(subscription.status)}
                      <div>
                        <h3 className="font-bold text-lg">{subscription.planName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          User: {subscription.userId} • {subscription.billingCycle.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <Badge className={getPlanColor(subscription.planType)}>
                          {subscription.planType.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatCurrency(subscription.amount, subscription.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Billing</p>
                        <p className="font-bold">
                          {new Date(subscription.nextBillingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</p>
                        <p className="font-bold text-green-500">
                          {formatCurrency(subscription.totalPaid, subscription.currency)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {subscription.status === 'failed' && (
                          <Button size="sm" onClick={() => retryPayment(subscription.id)}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {subscription.failedPayments > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">
                          {subscription.failedPayments} failed payment{subscription.failedPayments > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {subscription.discountCode && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-700">
                          Discount: {subscription.discountCode}
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          -{formatCurrency(subscription.discountAmount || 0, subscription.currency)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Payment transaction history and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <h3 className="font-bold">{transaction.description}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.gatewayTransactionId} • {new Date(transaction.processedAt).toLocaleString()}
                        </p>
                        {transaction.failureReason && (
                          <p className="text-sm text-red-500">Reason: {transaction.failureReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Risk: {transaction.riskScore}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Net: {formatCurrency(transaction.netAmount, transaction.currency)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateways" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gateways.map(gateway => (
              <Card key={gateway.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{gateway.name}</CardTitle>
                      <CardDescription>Provider: {gateway.provider.toUpperCase()}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        gateway.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <Switch checked={gateway.isActive} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Success Rate</Label>
                      <p className="font-bold text-green-500">{gateway.successRate}%</p>
                    </div>
                    <div>
                      <Label>Processing Fee</Label>
                      <p className="font-bold">{gateway.processingFee}%</p>
                    </div>
                    <div>
                      <Label>Avg. Processing Time</Label>
                      <p className="font-bold">{gateway.averageProcessingTime}s</p>
                    </div>
                    <div>
                      <Label>Monthly Volume</Label>
                      <p className="font-bold">{formatCurrency(gateway.monthlyVolume)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Supported Methods</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gateway.supportedMethods.map(method => (
                        <Badge key={method} variant="outline">
                          {method.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Supported Currencies</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gateway.supportedCurrencies.map(currency => (
                        <Badge key={currency} variant="outline">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {automationRules.map(rule => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{rule.type.replace('_', ' ').toUpperCase()}</Badge>
                      <Switch 
                        checked={rule.isActive} 
                        onCheckedChange={() => toggleAutomationRule(rule.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Executions</Label>
                      <p className="font-bold text-lg">{rule.executionCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Success Rate</Label>
                      <p className="font-bold text-green-500">{rule.successRate}%</p>
                    </div>
                  </div>
                  
                  {rule.lastExecuted && (
                    <div>
                      <Label>Last Executed</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(rule.lastExecuted).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label>Actions</Label>
                    <div className="space-y-2 mt-2">
                      {rule.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Zap className="h-3 w-3 text-blue-500" />
                          <span className="text-sm">{action.type.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}