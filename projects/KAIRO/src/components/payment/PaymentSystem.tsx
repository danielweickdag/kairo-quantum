'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Receipt,
  Shield,
  Lock,
  Unlock,
  Star,
  Crown,
  Gift,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Info,
  HelpCircle,
  Mail,
  Phone,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  Database,
  Server,
  Cloud,
  CloudOff,
  FileText,
  File,
  Folder,
  FolderOpen,
  Archive,
  Bookmark,
  BookmarkPlus,
  Tag,
  Tags,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Bell,
  BellOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'crypto' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  nickname?: string
  bankName?: string
  accountType?: string
  cryptoAddress?: string
  cryptoType?: string
  email?: string
}

interface Subscription {
  id: string
  planId: string
  planName: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  amount: number
  currency: string
  interval: 'month' | 'year'
  trialEnd?: string
  nextBillingDate: string
  paymentMethodId: string
  features: string[]
  usage: {
    trades: { used: number; limit: number }
    copyTraders: { used: number; limit: number }
    alerts: { used: number; limit: number }
    apiCalls: { used: number; limit: number }
  }
}

interface Transaction {
  id: string
  type: 'payment' | 'refund' | 'chargeback' | 'adjustment'
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled'
  description: string
  date: string
  paymentMethodId: string
  invoiceId?: string
  receiptUrl?: string
  failureReason?: string
}

interface Invoice {
  id: string
  number: string
  status: 'paid' | 'open' | 'void' | 'uncollectible'
  amount: number
  currency: string
  dueDate: string
  paidDate?: string
  description: string
  downloadUrl: string
  items: {
    description: string
    amount: number
    quantity: number
  }[]
}

const PaymentSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Mock data - in real app, this would come from API
  const [subscription] = useState<Subscription>({
    id: 'sub_1234567890',
    planId: 'pro_monthly',
    planName: 'Pro Monthly',
    status: 'active',
    currentPeriodStart: '2024-01-01T00:00:00Z',
    currentPeriodEnd: '2024-02-01T00:00:00Z',
    cancelAtPeriodEnd: false,
    amount: 999,
    currency: 'USD',
    interval: 'month',
    nextBillingDate: '2024-02-01T00:00:00Z',
    paymentMethodId: 'pm_1234567890',
    features: [
      'Unlimited trades',
      'Copy up to 10 traders',
      'Advanced analytics',
      'Priority support',
      'API access'
    ],
    usage: {
      trades: { used: 1247, limit: -1 },
      copyTraders: { used: 3, limit: 10 },
      alerts: { used: 45, limit: 100 },
      apiCalls: { used: 8934, limit: 50000 }
    }
  })

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1234567890',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      nickname: 'Primary Card'
    },
    {
      id: 'pm_0987654321',
      type: 'bank',
      last4: '6789',
      bankName: 'Chase Bank',
      accountType: 'checking',
      isDefault: false,
      nickname: 'Business Account'
    },
    {
      id: 'pm_1122334455',
      type: 'crypto',
      cryptoAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      cryptoType: 'BTC',
      isDefault: false,
      nickname: 'Bitcoin Wallet'
    }
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn_001',
      type: 'payment',
      amount: 999,
      currency: 'USD',
      status: 'succeeded',
      description: 'Pro Monthly Subscription',
      date: '2024-01-01T00:00:00Z',
      paymentMethodId: 'pm_1234567890',
      invoiceId: 'inv_001',
      receiptUrl: 'https://example.com/receipt/001'
    },
    {
      id: 'txn_002',
      type: 'payment',
      amount: 999,
      currency: 'USD',
      status: 'succeeded',
      description: 'Pro Monthly Subscription',
      date: '2023-12-01T00:00:00Z',
      paymentMethodId: 'pm_1234567890',
      invoiceId: 'inv_002',
      receiptUrl: 'https://example.com/receipt/002'
    },
    {
      id: 'txn_003',
      type: 'payment',
      amount: 999,
      currency: 'USD',
      status: 'failed',
      description: 'Pro Monthly Subscription',
      date: '2023-11-01T00:00:00Z',
      paymentMethodId: 'pm_0987654321',
      failureReason: 'Insufficient funds'
    }
  ])

  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      status: 'paid',
      amount: 999,
      currency: 'USD',
      dueDate: '2024-01-01T00:00:00Z',
      paidDate: '2024-01-01T00:00:00Z',
      description: 'Pro Monthly Subscription - January 2024',
      downloadUrl: 'https://example.com/invoice/001.pdf',
      items: [
        {
          description: 'Pro Monthly Plan',
          amount: 999,
          quantity: 1
        }
      ]
    },
    {
      id: 'inv_002',
      number: 'INV-2023-012',
      status: 'paid',
      amount: 999,
      currency: 'USD',
      dueDate: '2023-12-01T00:00:00Z',
      paidDate: '2023-12-01T00:00:00Z',
      description: 'Pro Monthly Subscription - December 2023',
      downloadUrl: 'https://example.com/invoice/002.pdf',
      items: [
        {
          description: 'Pro Monthly Plan',
          amount: 999,
          quantity: 1
        }
      ]
    }
  ])

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 0,
      interval: 'month' as const,
      features: [
        '7-day free trial',
        'Up to 10 trades',
        'Copy 1 trader',
        'Basic analytics',
        'Email support'
      ],
      popular: false,
      current: false
    },
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      price: 999,
      interval: 'month' as const,
      features: [
        'Unlimited trades',
        'Copy up to 10 traders',
        'Advanced analytics',
        'Priority support',
        'API access'
      ],
      popular: true,
      current: true
    },
    {
      id: 'pro_annual',
      name: 'Pro Annual',
      price: 8999,
      interval: 'year' as const,
      features: [
        'Everything in Pro Monthly',
        '2 months free',
        'Premium indicators',
        'White-label options',
        'Dedicated support'
      ],
      popular: false,
      current: false
    }
  ]

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: amount % 100 === 0 ? 0 : 2
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />
      case 'bank':
        return <Database className="w-5 h-5" />
      case 'crypto':
        return <Zap className="w-5 h-5" />
      case 'paypal':
        return <Globe className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'succeeded':
      case 'paid':
        return 'text-green-400'
      case 'pending':
      case 'trialing':
        return 'text-yellow-400'
      case 'failed':
      case 'cancelled':
      case 'past_due':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case 'active':
      case 'succeeded':
      case 'paid':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case 'pending':
      case 'trialing':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'failed':
      case 'cancelled':
      case 'past_due':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const PaymentMethodCard: React.FC<{ method: PaymentMethod }> = ({ method }) => (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              {getPaymentMethodIcon(method.type)}
            </div>
            <div>
              <p className="font-semibold text-white">
                {method.nickname || `${method.type.charAt(0).toUpperCase() + method.type.slice(1)}`}
              </p>
              <p className="text-gray-400 text-sm">
                {method.type === 'card' && `•••• •••• •••• ${method.last4}`}
                {method.type === 'bank' && `${method.bankName} ••••${method.last4}`}
                {method.type === 'crypto' && `${method.cryptoType} ${method.cryptoAddress?.slice(0, 8)}...`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {method.isDefault && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Default
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {method.type === 'card' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Expires</span>
            <span className="text-white">
              {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Billing & Payments
            </h1>
            <p className="text-gray-300">
              Manage your subscription, payment methods, and billing history
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={() => setShowAddPaymentMethod(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={() => setShowUpgradeModal(true)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Current Subscription Overview */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {subscription.planName}
                    </h3>
                    <p className="text-gray-400">
                      {formatCurrency(subscription.amount)} per {subscription.interval}
                    </p>
                  </div>
                  <div className={getStatusBadge(subscription.status)}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Period</p>
                    <p className="text-white font-semibold">
                      {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Next Billing</p>
                    <p className="text-white font-semibold">
                      {formatDate(subscription.nextBillingDate)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Usage This Period</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Copy Traders</span>
                      <span className="text-white">
                        {subscription.usage.copyTraders.used} / {subscription.usage.copyTraders.limit === -1 ? '∞' : subscription.usage.copyTraders.limit}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(subscription.usage.copyTraders.used, subscription.usage.copyTraders.limit)} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">AI Alerts</span>
                      <span className="text-white">
                        {subscription.usage.alerts.used} / {subscription.usage.alerts.limit}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(subscription.usage.alerts.used, subscription.usage.alerts.limit)} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API Calls</span>
                      <span className="text-white">
                        {subscription.usage.apiCalls.used.toLocaleString()} / {subscription.usage.apiCalls.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(subscription.usage.apiCalls.used, subscription.usage.apiCalls.limit)} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Secure Billing</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Your payment information is encrypted and secure. We use industry-standard security measures.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Gift className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Referral Bonus</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    Refer friends and get 1 month free for each successful referral.
                  </p>
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-400">
                    Get Referral Link
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Receipt className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Billing Summary */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Billing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Plan</span>
                    <span className="text-white font-semibold">{subscription.planName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Monthly Cost</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(subscription.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Next Billing</span>
                    <span className="text-white font-semibold">
                      {formatDate(subscription.nextBillingDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status</span>
                    <div className={getStatusBadge(subscription.status)}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            transaction.status === 'succeeded' ? "bg-green-500/20" : "bg-red-500/20"
                          )}>
                            {transaction.status === 'succeeded' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-semibold text-sm",
                            transaction.status === 'succeeded' ? "text-green-400" : "text-red-400"
                          )}>
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className={cn("text-xs", getStatusColor(transaction.status))}>
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {paymentMethods.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
              
              {/* Add New Payment Method Card */}
              <Card className="bg-gray-800/50 border-gray-700 border-dashed backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Add Payment Method</p>
                    <p className="text-gray-400 text-sm">Add a new card, bank account, or crypto wallet</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => setShowAddPaymentMethod(true)}
                  >
                    Add Method
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          transaction.status === 'succeeded' ? "bg-green-500/20" : "bg-red-500/20"
                        )}>
                          {transaction.status === 'succeeded' ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} • {formatDate(transaction.date)}
                          </p>
                          {transaction.failureReason && (
                            <p className="text-red-400 text-xs mt-1">
                              {transaction.failureReason}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold",
                          transaction.status === 'succeeded' ? "text-green-400" : "text-red-400"
                        )}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <div className={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {transaction.receiptUrl && (
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Invoices</CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{invoice.number}</p>
                          <p className="text-gray-400 text-sm">{invoice.description}</p>
                          <p className="text-gray-500 text-xs">
                            Due: {formatDate(invoice.dueDate)}
                            {invoice.paidDate && ` • Paid: ${formatDate(invoice.paidDate)}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <div className={getStatusBadge(invoice.status)}>
                          {invoice.status}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400"
                        onClick={() => window.open(invoice.downloadUrl, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Payment Method Modal */}
        {showAddPaymentMethod && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Payment Method</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddPaymentMethod(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col border-gray-600">
                    <CreditCard className="w-6 h-6 mb-2" />
                    <span>Credit Card</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-gray-600">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Bank Account</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-gray-600">
                    <Zap className="w-6 h-6 mb-2" />
                    <span>Crypto</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col border-gray-600">
                    <Globe className="w-6 h-6 mb-2" />
                    <span>PayPal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upgrade Plan Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Choose Your Plan</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUpgradeModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={cn(
                        "bg-gray-900/50 border-gray-700 relative",
                        plan.popular && "border-purple-500 bg-purple-500/10",
                        plan.current && "border-green-500 bg-green-500/10"
                      )}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-purple-500 text-white">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      {plan.current && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-500 text-white">
                            Current Plan
                          </Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="mb-4">
                            <span className="text-3xl font-bold text-white">
                              {formatCurrency(plan.price)}
                            </span>
                            <span className="text-gray-400">/{plan.interval}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={cn(
                            "w-full",
                            plan.current 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          )}
                          disabled={plan.current}
                        >
                          {plan.current ? 'Current Plan' : 'Choose Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSystem