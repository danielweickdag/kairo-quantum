'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import {
  User,
  Wallet,
  CreditCard,
  Building,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Download,
  Upload,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Settings,
  Edit,
  Save,
  X,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Bell,
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  Zap,
  Target,
  BarChart3,
  Activity,
  History,
  Filter,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Info,
  HelpCircle
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useBalance } from '@/hooks/useBalance'

interface BankAccount {
  id: string
  bankName: string
  accountType: 'checking' | 'savings'
  accountNumber: string
  routingNumber: string
  isVerified: boolean
  isPrimary: boolean
  addedDate: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'crypto' | 'paypal'
  name: string
  last4: string
  expiryDate?: string
  isDefault: boolean
  isVerified: boolean
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  timestamp: string
  paymentMethod?: string
  bankAccount?: string
  fee?: number
}

interface WalletBalance {
  currency: string
  available: number
  pending: number
  total: number
}

interface KYCData {
  status: 'not_started' | 'pending' | 'approved' | 'rejected'
  level: 1 | 2 | 3
  documents: {
    id: string
    type: 'passport' | 'drivers_license' | 'utility_bill' | 'bank_statement'
    status: 'pending' | 'approved' | 'rejected'
    uploadedDate: string
  }[]
  limits: {
    dailyDeposit: number
    monthlyDeposit: number
    dailyWithdrawal: number
    monthlyWithdrawal: number
  }
}

interface AutomationSettings {
  autoRebalancing: boolean
  autoTrading: boolean
  stopLoss: boolean
  takeProfit: boolean
  riskManagement: boolean
  smartAlerts: boolean
  copyTrading: boolean
  portfolioOptimization: boolean
}

const FinancialUserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallet')
  const [balanceVisible, setBalanceVisible] = useState(true)
  const { balance, formattedBalance, isLoading: balanceLoading } = useBalance()
  const [isLoading, setIsLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [selectedBankAccount, setSelectedBankAccount] = useState('')
  const [showAddBankForm, setShowAddBankForm] = useState(false)
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [kycModalOpen, setKycModalOpen] = useState(false)

  // Mock data - in real app, this would come from API
  const [walletBalances] = useState<WalletBalance[]>([
    { currency: 'USD', available: 25847.32, pending: 1200.00, total: 27047.32 },
    { currency: 'BTC', available: 0.5847, pending: 0.0123, total: 0.5970 },
    { currency: 'ETH', available: 12.847, pending: 0.234, total: 13.081 }
  ])

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountType: 'checking',
      accountNumber: '****1234',
      routingNumber: '021000021',
      isVerified: true,
      isPrimary: true,
      addedDate: '2024-01-10'
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountType: 'savings',
      accountNumber: '****5678',
      routingNumber: '026009593',
      isVerified: false,
      isPrimary: false,
      addedDate: '2024-01-12'
    }
  ])

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ****1234',
      last4: '1234',
      expiryDate: '12/26',
      isDefault: true,
      isVerified: true
    },
    {
      id: '2',
      type: 'bank',
      name: 'Chase Checking',
      last4: '1234',
      isDefault: false,
      isVerified: true
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal Account',
      last4: '',
      isDefault: false,
      isVerified: true
    }
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 5000.00,
      currency: 'USD',
      status: 'completed',
      description: 'Bank transfer deposit',
      timestamp: '2024-01-15T10:30:00Z',
      bankAccount: 'Chase Bank ****1234'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 2500.00,
      currency: 'USD',
      status: 'pending',
      description: 'Withdrawal to bank account',
      timestamp: '2024-01-14T16:45:00Z',
      bankAccount: 'Chase Bank ****1234',
      fee: 25.00
    },
    {
      id: '3',
      type: 'trade',
      amount: 1247.50,
      currency: 'USD',
      status: 'completed',
      description: 'BTC/USD trade profit',
      timestamp: '2024-01-14T14:20:00Z'
    }
  ])

  const [kycData] = useState<KYCData>({
    status: 'approved',
    level: 2,
    documents: [
      {
        id: '1',
        type: 'drivers_license',
        status: 'approved',
        uploadedDate: '2024-01-05'
      },
      {
        id: '2',
        type: 'utility_bill',
        status: 'approved',
        uploadedDate: '2024-01-05'
      }
    ],
    limits: {
      dailyDeposit: 50000,
      monthlyDeposit: 500000,
      dailyWithdrawal: 25000,
      monthlyWithdrawal: 250000
    }
  })

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>({
    autoRebalancing: true,
    autoTrading: false,
    stopLoss: true,
    takeProfit: true,
    riskManagement: true,
    smartAlerts: true,
    copyTrading: false,
    portfolioOptimization: true
  })

  const handleDeposit = async () => {
    if (!depositAmount || !selectedPaymentMethod) return
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setDepositAmount('')
      alert(`Deposit of $${depositAmount} initiated successfully!`)
    }, 2000)
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedBankAccount) return
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setWithdrawAmount('')
      alert(`Withdrawal of $${withdrawAmount} initiated successfully!`)
    }, 2000)
  }

  const toggleAutomationSetting = (setting: keyof AutomationSettings) => {
    setAutomationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
      case 'rejected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Financial Profile</h1>
            <p className="text-gray-300">Manage your wallet, payments, and trading automation</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              KYC Level {kycData.level} Verified
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="banks">Banks</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Real-time USD Wallet */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">USD Wallet</span>
                    <div className="flex items-center space-x-2">
                      {balanceLoading && <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBalanceVisible(!balanceVisible)}
                      >
                        {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Available Balance</p>
                      <p className="text-2xl font-bold">
                        {balanceVisible ? formattedBalance.available : '••••••'}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Invested:</span>
                      <span>{balanceVisible ? formattedBalance.invested : '••••'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-400">Total:</span>
                      <span>{balanceVisible ? formattedBalance.total : '••••••'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Mock crypto wallets */}
              {walletBalances.filter(b => b.currency !== 'USD').map((balance) => (
                <Card key={balance.currency} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{balance.currency} Wallet</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBalanceVisible(!balanceVisible)}
                      >
                        {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Available Balance</p>
                        <p className="text-2xl font-bold">
                          {balanceVisible ? formatCurrency(balance.available) : '••••••'}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pending:</span>
                        <span>{balanceVisible ? formatCurrency(balance.pending) : '••••'}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-400">Total:</span>
                        <span>{balanceVisible ? formatCurrency(balance.total) : '••••••'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2" onClick={() => setActiveTab('deposit')}>
                    <Plus className="w-6 h-6" />
                    <span>Deposit</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" onClick={() => setActiveTab('withdraw')}>
                    <Minus className="w-6 h-6" />
                    <span>Withdraw</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" onClick={() => setActiveTab('banks')}>
                    <Building className="w-6 h-6" />
                    <span>Manage Banks</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" onClick={() => setActiveTab('automation')}>
                    <Zap className="w-6 h-6" />
                    <span>Automation</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Deposit Funds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-amount">Amount (USD)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <select
                      id="payment-method"
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name} {method.isDefault && '(Default)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Deposits typically take 1-3 business days to process. Instant deposits available for verified cards.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleDeposit} 
                    disabled={!depositAmount || !selectedPaymentMethod || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Processing...' : 'Deposit Funds'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Deposit Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Limit:</span>
                      <span>{formatCurrency(kycData.limits.dailyDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Limit:</span>
                      <span>{formatCurrency(kycData.limits.monthlyDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used Today:</span>
                      <span>{formatCurrency(5000)}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => setKycModalOpen(true)}>
                    <Shield className="w-4 h-4 mr-2" />
                    Increase Limits
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Withdraw Funds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bank-account">Bank Account</Label>
                    <select
                      id="bank-account"
                      value={selectedBankAccount}
                      onChange={(e) => setSelectedBankAccount(e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">Select bank account</option>
                      {bankAccounts.filter(bank => bank.isVerified).map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bankName} {bank.accountNumber} {bank.isPrimary && '(Primary)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Withdrawals take 1-5 business days. A fee of $25 applies to withdrawals under $1,000.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleWithdraw} 
                    disabled={!withdrawAmount || !selectedBankAccount || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Processing...' : 'Withdraw Funds'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Withdrawal Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Limit:</span>
                      <span>{formatCurrency(kycData.limits.dailyWithdrawal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Limit:</span>
                      <span>{formatCurrency(kycData.limits.monthlyWithdrawal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used Today:</span>
                      <span>{formatCurrency(2500)}</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Increase Limits
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Banks Tab */}
          <TabsContent value="banks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Bank Accounts</h2>
              <Button onClick={() => setShowAddBankForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bankAccounts.map((bank) => (
                <Card key={bank.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        {bank.bankName}
                      </div>
                      <div className="flex items-center space-x-2">
                        {bank.isPrimary && (
                          <Badge variant="default">Primary</Badge>
                        )}
                        {bank.isVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account:</span>
                        <span>{bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="capitalize">{bank.accountType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Added:</span>
                        <span>{new Date(bank.addedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!bank.isPrimary && (
                        <Button variant="outline" size="sm" className="flex-1">
                          Set Primary
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Trading Automation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(automationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {getAutomationDescription(key)}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={() => toggleAutomationSetting(key as keyof AutomationSettings)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Transaction History
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-medium",
                          transaction.type === 'deposit' || transaction.type === 'trade' && transaction.amount > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        )}>
                          {transaction.type === 'deposit' || (transaction.type === 'trade' && transaction.amount > 0) ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <p className={cn("text-sm", getStatusColor(transaction.status))}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getAutomationDescription(key: string): string {
  const descriptions: Record<string, string> = {
    autoRebalancing: 'Automatically rebalance your portfolio based on target allocations',
    autoTrading: 'Enable automated trading based on your strategies',
    stopLoss: 'Automatically sell positions when they reach stop loss levels',
    takeProfit: 'Automatically sell positions when they reach profit targets',
    riskManagement: 'Enable advanced risk management features',
    smartAlerts: 'Receive intelligent alerts about market opportunities',
    copyTrading: 'Automatically copy trades from selected traders',
    portfolioOptimization: 'Optimize portfolio allocation using AI'
  }
  return descriptions[key] || 'Toggle this automation feature'
}

export default FinancialUserProfile