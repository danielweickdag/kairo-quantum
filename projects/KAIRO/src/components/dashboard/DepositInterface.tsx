'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  Bitcoin, 
  DollarSign,
  ArrowUpRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  Shield,
  Zap,
  TrendingUp,
  Plus
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { PaymentMethod, DepositRequest, WalletLimits, walletService } from '@/services/walletService'
import { BankAccountConnectionModal } from '@/components/modals/BankAccountConnectionModal'
import { automatedDepositWithdrawService } from '@/services/AutomatedDepositWithdrawService'

interface DepositFormData {
  amount: string
  currency: string
  paymentMethodId: string
  description: string
}

interface DepositFee {
  amount: number
  percentage: number
  fixed: number
  total: number
}

const DepositInterface: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [walletLimits, setWalletLimits] = useState<WalletLimits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('quick')
  const [formData, setFormData] = useState<DepositFormData>({
    amount: '',
    currency: 'USD',
    paymentMethodId: '',
    description: ''
  })
  const [depositFee, setDepositFee] = useState<DepositFee | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showBankConnectionModal, setShowBankConnectionModal] = useState(false)

  // Quick deposit amounts
  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000]

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.amount && formData.paymentMethodId) {
      calculateFees()
    } else {
      setDepositFee(null)
    }
  }, [formData.amount, formData.paymentMethodId])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [methods, limits] = await Promise.all([
        walletService.getDepositMethods(),
        walletService.getWalletLimits()
      ])
      setPaymentMethods(methods)
      setWalletLimits(limits)
      
      // Set default payment method
      const defaultMethod = methods.find(m => m.isDefault) || methods[0]
      if (defaultMethod) {
        setFormData(prev => ({ ...prev, paymentMethodId: defaultMethod.id }))
      }
    } catch (error) {
      console.error('Error loading deposit data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateFees = () => {
    const amount = parseFloat(formData.amount)
    const method = paymentMethods.find(m => m.id === formData.paymentMethodId)
    
    if (!amount || !method) {
      setDepositFee(null)
      return
    }

    // Mock fee calculation based on payment method
    let percentage = 0
    let fixed = 0

    switch (method.type) {
      case 'card':
        percentage = 2.9
        fixed = 0.30
        break
      case 'bank':
        percentage = 0
        fixed = amount > 1000 ? 0 : 1.50
        break
      case 'crypto':
        percentage = 1.5
        fixed = 0
        break
      case 'paypal':
        percentage = 3.4
        fixed = 0.30
        break
      case 'wire':
        percentage = 0
        fixed = 25.00
        break
      default:
        percentage = 1.0
        fixed = 1.00
    }

    const percentageFee = (amount * percentage) / 100
    const total = percentageFee + fixed

    setDepositFee({
      amount,
      percentage,
      fixed,
      total
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const amount = parseFloat(formData.amount)
    const method = paymentMethods.find(m => m.id === formData.paymentMethodId)

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (method && amount > method.limits.perTransaction) {
      newErrors.amount = `Amount exceeds transaction limit of ${formatCurrency(method.limits.perTransaction)}`
    } else if (walletLimits && amount > walletLimits.dailyDeposit) {
      newErrors.amount = `Amount exceeds daily deposit limit of ${formatCurrency(walletLimits.dailyDeposit)}`
    }

    if (!formData.paymentMethodId) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }))
    setActiveTab('quick')
  }

  const handleQuickDeposit = async (amount: number) => {
    try {
      // Check if user has connected bank accounts
      const connectedAccounts = await automatedDepositWithdrawService.getConnectedBankAccounts()
      
      if (connectedAccounts.length === 0) {
        // No bank accounts connected, show connection modal
        setFormData(prev => ({ ...prev, amount: amount.toString() }))
        setShowBankConnectionModal(true)
      } else {
        // Bank account exists, proceed with quick deposit
        const result = await automatedDepositWithdrawService.handleQuickDeposit({
          amount,
          currency: 'USD',
          bankAccountId: connectedAccounts[0].id
        })
        
        if (result.success) {
          setSuccessMessage(`Quick deposit of ${formatCurrency(amount)} initiated successfully!`)
        } else {
          setErrors({ general: result.error || 'Failed to process quick deposit' })
        }
      }
    } catch (error) {
      console.error('Quick deposit error:', error)
      setErrors({ general: 'Failed to process quick deposit. Please try again.' })
    }
  }

  const handleDeposit = async () => {
    if (!validateForm()) return

    try {
      setIsProcessing(true)
      const depositRequest: DepositRequest = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        paymentMethodId: formData.paymentMethodId,
        description: formData.description || `Deposit via ${paymentMethods.find(m => m.id === formData.paymentMethodId)?.name}`
      }

      const transaction = await walletService.initiateDeposit(depositRequest)
      
      setSuccessMessage(`Deposit of ${formatCurrency(depositRequest.amount)} initiated successfully! Transaction ID: ${transaction.id}`)
      setFormData({
        amount: '',
        currency: 'USD',
        paymentMethodId: paymentMethods.find(m => m.isDefault)?.id || '',
        description: ''
      })
      setShowConfirmDialog(false)
      setTimeout(() => setSuccessMessage(''), 10000)
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to process deposit' })
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />
      case 'bank': return <Building2 className="w-5 h-5" />
      case 'crypto': return <Bitcoin className="w-5 h-5" />
      case 'paypal': return <Smartphone className="w-5 h-5" />
      case 'wire': return <Building2 className="w-5 h-5" />
      default: return <DollarSign className="w-5 h-5" />
    }
  }

  const getProcessingTime = (type: string) => {
    switch (type) {
      case 'card': return 'Instant'
      case 'bank': return '1-3 business days'
      case 'crypto': return '10-30 minutes'
      case 'paypal': return 'Instant'
      case 'wire': return '1-2 business days'
      default: return '1-3 business days'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading deposit options...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deposit Funds</h2>
        <p className="text-muted-foreground">
          Add money to your trading account using various payment methods
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Deposit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Deposit</TabsTrigger>
              <TabsTrigger value="custom">Custom Amount</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Quick Deposit
                  </CardTitle>
                  <CardDescription>
                    Choose from popular deposit amounts for faster funding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quickAmounts.map((amount) => (
                      <div key={amount} className="space-y-2">
                        <Button
                          variant={formData.amount === amount.toString() ? "default" : "outline"}
                          className="h-16 text-lg font-semibold w-full"
                          onClick={() => handleQuickAmount(amount)}
                        >
                          {formatCurrency(amount)}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleQuickDeposit(amount)}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Quick Deposit
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Amount</CardTitle>
                  <CardDescription>
                    Enter any amount within your deposit limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                          className={cn("pl-10", errors.amount && "border-red-500")}
                        />
                      </div>
                      {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Trading account funding"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Choose how you&apos;d like to fund your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                      formData.paymentMethodId === method.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethodId: method.id }))}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        formData.paymentMethodId === method.id ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{method.name}</h4>
                          {method.isDefault && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          {!method.isVerified && (
                            <Badge variant="destructive" className="text-xs">Unverified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getProcessingTime(method.type)} • Limit: {formatCurrency(method.limits.perTransaction)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                        {formData.paymentMethodId === method.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.paymentMethod && (
                <p className="text-sm text-red-500 mt-2">{errors.paymentMethod}</p>
              )}
            </CardContent>
          </Card>

          {/* Deposit Button */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="w-full" 
                disabled={!formData.amount || !formData.paymentMethodId || !!errors.amount}
              >
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Review Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deposit</DialogTitle>
                <DialogDescription>
                  Please review your deposit details before proceeding
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(formData.amount || '0'))} {formData.currency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>{paymentMethods.find(m => m.id === formData.paymentMethodId)?.name}</span>
                  </div>
                  
                  {depositFee && depositFee.total > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span>{formatCurrency(depositFee.total)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total to be charged:</span>
                        <span>{formatCurrency(parseFloat(formData.amount || '0') + depositFee.total)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span>{getProcessingTime(paymentMethods.find(m => m.id === formData.paymentMethodId)?.type || '')}</span>
                  </div>
                </div>
                
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeposit} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Confirm Deposit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fee Calculator */}
          {depositFee && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fee Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Deposit Amount:</span>
                  <span>{formatCurrency(depositFee.amount)}</span>
                </div>
                
                {depositFee.percentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee ({depositFee.percentage}%):</span>
                    <span>{formatCurrency((depositFee.amount * depositFee.percentage) / 100)}</span>
                  </div>
                )}
                
                {depositFee.fixed > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Fixed Fee:</span>
                    <span>{formatCurrency(depositFee.fixed)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total Fee:</span>
                  <span className={depositFee.total === 0 ? "text-green-600" : ""}>
                    {depositFee.total === 0 ? "FREE" : formatCurrency(depositFee.total)}
                  </span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>You&apos;ll receive:</span>
                  <span>{formatCurrency(depositFee.amount)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deposit Limits */}
          {walletLimits && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deposit Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Limit:</span>
                    <span>{formatCurrency(walletLimits.dailyDeposit)}</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(walletLimits.dailyDeposit * 0.25)} used today
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Limit:</span>
                    <span>{formatCurrency(walletLimits.monthlyDeposit)}</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(walletLimits.monthlyDeposit * 0.15)} used this month
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Secure Deposits</h4>
                  <p className="text-sm text-blue-800">
                    All deposits are processed through encrypted, PCI-compliant payment processors. 
                    Your financial information is never stored on our servers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">This Month</span>
                </div>
                <span className="font-semibold">{formatCurrency(25000)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Total Deposited</span>
                </div>
                <span className="font-semibold">{formatCurrency(125000)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">Avg. Processing</span>
                </div>
                <span className="font-semibold">2.3 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Bank Account Connection Modal */}
      <BankAccountConnectionModal
        isOpen={showBankConnectionModal}
        onClose={() => setShowBankConnectionModal(false)}
        onSuccess={(bankAccount) => {
          setShowBankConnectionModal(false)
          // Automatically trigger deposit after successful bank connection
          if (formData.amount) {
            handleQuickDeposit(parseFloat(formData.amount))
          }
        }}
        initialAmount={parseFloat(formData.amount || '0')}
        transactionType="deposit"
      />
    </div>
  )
}

export default DepositInterface