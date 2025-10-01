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
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  DollarSign,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  Shield,
  TrendingDown,
  Calendar,
  CreditCard,
  Banknote
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { BankAccount, WithdrawalRequest, WalletBalance, WalletLimits, walletService } from '@/services/walletService'
import { BankAccountConnectionModal } from '@/components/modals/BankAccountConnectionModal'
import { automatedDepositWithdrawService } from '@/services/AutomatedDepositWithdrawService'

interface WithdrawalFormData {
  amount: string
  currency: string
  bankAccountId: string
  description: string
}

interface WithdrawalFee {
  amount: number
  fixed: number
  percentage: number
  total: number
  netAmount: number
}

const WithdrawalInterface: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([])
  const [walletLimits, setWalletLimits] = useState<WalletLimits | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: '',
    currency: 'USD',
    bankAccountId: '',
    description: ''
  })
  const [withdrawalFee, setWithdrawalFee] = useState<WithdrawalFee | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showBankConnectionModal, setShowBankConnectionModal] = useState(false)

  // Quick withdrawal amounts
  const quickAmounts = [100, 500, 1000, 2500, 5000]

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.amount && formData.bankAccountId) {
      calculateFees()
    } else {
      setWithdrawalFee(null)
    }
  }, [formData.amount, formData.bankAccountId])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [accounts, balances, limits] = await Promise.all([
        walletService.getBankAccounts(),
        walletService.getWalletBalances(),
        walletService.getWalletLimits()
      ])
      
      // Only show verified accounts for withdrawals
      const verifiedAccounts = accounts.filter(account => account.isVerified)
      setBankAccounts(verifiedAccounts)
      setWalletBalances(balances)
      setWalletLimits(limits)
      
      // Set default bank account (primary if available)
      const primaryAccount = verifiedAccounts.find(a => a.isPrimary) || verifiedAccounts[0]
      if (primaryAccount) {
        setFormData(prev => ({ ...prev, bankAccountId: primaryAccount.id }))
      }
    } catch (error) {
      console.error('Error loading withdrawal data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateFees = () => {
    const amount = parseFloat(formData.amount)
    const account = bankAccounts.find(a => a.id === formData.bankAccountId)
    
    if (!amount || !account) {
      setWithdrawalFee(null)
      return
    }

    // Mock fee calculation based on withdrawal method and amount
    let fixed = 0
    let percentage = 0

    // Different fees based on account type and amount
    if (account.accountType === 'business') {
      fixed = 15.00
      percentage = 0.5
    } else if (amount > 10000) {
      fixed = 25.00
      percentage = 0
    } else if (amount > 1000) {
      fixed = 5.00
      percentage = 0
    } else {
      fixed = 2.50
      percentage = 0
    }

    // International transfers have higher fees
    if (account.country !== 'US') {
      fixed += 15.00
      percentage += 1.0
    }

    const percentageFee = (amount * percentage) / 100
    const total = fixed + percentageFee
    const netAmount = amount - total

    setWithdrawalFee({
      amount,
      fixed,
      percentage,
      total,
      netAmount
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const amount = parseFloat(formData.amount)
    const balance = walletBalances.find(b => b.currency === formData.currency)
    const account = bankAccounts.find(a => a.id === formData.bankAccountId)

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (walletLimits && amount < walletLimits.minWithdrawal) {
      newErrors.amount = `Minimum withdrawal amount is ${formatCurrency(walletLimits.minWithdrawal)}`
    } else if (walletLimits && amount > walletLimits.dailyWithdrawal) {
      newErrors.amount = `Amount exceeds daily withdrawal limit of ${formatCurrency(walletLimits.dailyWithdrawal)}`
    } else if (balance && amount > balance.available) {
      newErrors.amount = `Insufficient funds. Available: ${formatCurrency(balance.available)}`
    }

    if (!formData.bankAccountId) {
      newErrors.bankAccount = 'Please select a bank account'
    } else if (account && !account.isVerified) {
      newErrors.bankAccount = 'Selected bank account is not verified'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleQuickWithdraw = async (amount: number) => {
    try {
      // Check if user has connected bank accounts
      const connectedAccounts = await automatedDepositWithdrawService.getConnectedBankAccounts()
      
      if (connectedAccounts.length === 0) {
        // No bank accounts connected, show connection modal
        setFormData(prev => ({ ...prev, amount: amount.toString() }))
        setShowBankConnectionModal(true)
      } else {
        // Bank account exists, proceed with quick withdrawal
        const result = await automatedDepositWithdrawService.handleQuickWithdraw({
          amount,
          currency: 'USD',
          bankAccountId: connectedAccounts[0].id
        })
        
        if (result.success) {
          setSuccessMessage(`Quick withdrawal of ${formatCurrency(amount)} initiated successfully!`)
        } else {
          setErrors({ general: result.error || 'Failed to process quick withdrawal' })
        }
      }
    } catch (error) {
      console.error('Quick withdrawal error:', error)
      setErrors({ general: 'Failed to process quick withdrawal. Please try again.' })
    }
  }

  const handleWithdrawal = async () => {
    if (!validateForm()) return

    try {
      setIsProcessing(true)
      const withdrawalRequest: WithdrawalRequest = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        bankAccountId: formData.bankAccountId,
        description: formData.description || `Withdrawal to ${bankAccounts.find(a => a.id === formData.bankAccountId)?.bankName}`
      }

      const transaction = await walletService.initiateWithdrawal(withdrawalRequest)
      
      setSuccessMessage(`Withdrawal of ${formatCurrency(withdrawalRequest.amount)} initiated successfully! Transaction ID: ${transaction.id}`)
      setFormData({
        amount: '',
        currency: 'USD',
        bankAccountId: bankAccounts.find(a => a.isPrimary)?.id || '',
        description: ''
      })
      setShowConfirmDialog(false)
      
      // Refresh balances
      const updatedBalances = await walletService.getWalletBalances()
      setWalletBalances(updatedBalances)
      
      setTimeout(() => setSuccessMessage(''), 10000)
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to process withdrawal' })
    } finally {
      setIsProcessing(false)
    }
  }

  const getProcessingTime = (account: BankAccount) => {
    if (account.country === 'US') {
      return account.accountType === 'business' ? '1-2 business days' : '1-3 business days'
    }
    return '3-5 business days'
  }

  const getCurrentBalance = () => {
    const balance = walletBalances.find(b => b.currency === formData.currency)
    return balance ? balance.available : 0
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading withdrawal options...
        </CardContent>
      </Card>
    )
  }

  if (bankAccounts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Verified Bank Accounts</h3>
          <p className="text-muted-foreground text-center mb-4">
            You need at least one verified bank account to make withdrawals
          </p>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Withdraw Funds</h2>
        <p className="text-muted-foreground">
          Transfer money from your trading account to your bank account
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
        {/* Main Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="w-5 h-5 mr-2 text-green-500" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {walletBalances.map((balance) => (
                  <div 
                    key={balance.currency}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-all",
                      formData.currency === balance.currency 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, currency: balance.currency }))}
                  >
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">{balance.currency}</p>
                      <p className="text-2xl font-bold">{formatCurrency(balance.available)}</p>
                      {balance.pending > 0 && (
                        <p className="text-xs text-orange-600">
                          {formatCurrency(balance.pending)} pending
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Withdraw */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                Quick Withdraw
              </CardTitle>
              <CardDescription>
                Choose from popular withdrawal amounts for faster processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickAmounts.map((amount) => (
                  <div key={amount} className="space-y-2">
                    <Button
                      variant="outline"
                      className="h-16 text-lg font-semibold w-full border-red-200 hover:border-red-300 hover:bg-red-50"
                      onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                      disabled={amount > getCurrentBalance()}
                    >
                      {formatCurrency(amount)}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleQuickWithdraw(amount)}
                      disabled={amount > getCurrentBalance()}
                    >
                      <ArrowDownLeft className="w-3 h-3 mr-1" />
                      Quick Withdraw
                    </Button>
                  </div>
                ))}
              </div>
              {getCurrentBalance() < quickAmounts[0] && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance for quick withdrawals. Minimum amount: {formatCurrency(quickAmounts[0])}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Withdrawal</CardTitle>
              <CardDescription>
                Enter the amount you want to withdraw
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
                  <p className="text-xs text-muted-foreground">
                    Available: {formatCurrency(getCurrentBalance())} {formData.currency}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {walletBalances.map((balance) => (
                        <SelectItem key={balance.currency} value={balance.currency}>
                          {balance.currency} - {formatCurrency(balance.available)} available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Profit withdrawal"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Account Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Destination Bank Account</CardTitle>
              <CardDescription>
                Choose where to send your withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                      formData.bankAccountId === account.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, bankAccountId: account.id }))}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        formData.bankAccountId === account.id ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <Building2 className="w-5 h-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{account.bankName}</h4>
                          {account.isPrimary && (
                            <Badge variant="secondary" className="text-xs">Primary</Badge>
                          )}
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} • {account.accountNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processing time: {getProcessingTime(account)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                        {formData.bankAccountId === account.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.bankAccount && (
                <p className="text-sm text-red-500 mt-2">{errors.bankAccount}</p>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal Button */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="w-full" 
                disabled={!formData.amount || !formData.bankAccountId || !!errors.amount || !!errors.bankAccount}
              >
                <ArrowDownLeft className="w-5 h-5 mr-2" />
                Review Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Withdrawal</DialogTitle>
                <DialogDescription>
                  Please review your withdrawal details before proceeding
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Withdrawals cannot be cancelled once processed. Please ensure all details are correct.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdrawal Amount:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(formData.amount || '0'))} {formData.currency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination:</span>
                    <span>{bankAccounts.find(a => a.id === formData.bankAccountId)?.bankName} {bankAccounts.find(a => a.id === formData.bankAccountId)?.accountNumber}</span>
                  </div>
                  
                  {withdrawalFee && withdrawalFee.total > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing Fee:</span>
                        <span>{formatCurrency(withdrawalFee.total)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Amount you&apos;ll receive:</span>
                        <span>{formatCurrency(withdrawalFee.netAmount)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span>{getProcessingTime(bankAccounts.find(a => a.id === formData.bankAccountId)!)}</span>
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
                  <Button onClick={handleWithdrawal} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Confirm Withdrawal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fee Calculator */}
          {withdrawalFee && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fee Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Withdrawal Amount:</span>
                  <span>{formatCurrency(withdrawalFee.amount)}</span>
                </div>
                
                {withdrawalFee.percentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee ({withdrawalFee.percentage}%):</span>
                    <span>{formatCurrency((withdrawalFee.amount * withdrawalFee.percentage) / 100)}</span>
                  </div>
                )}
                
                {withdrawalFee.fixed > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Fixed Fee:</span>
                    <span>{formatCurrency(withdrawalFee.fixed)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total Fee:</span>
                  <span className={withdrawalFee.total === 0 ? "text-green-600" : ""}>
                    {withdrawalFee.total === 0 ? "FREE" : formatCurrency(withdrawalFee.total)}
                  </span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg text-green-600">
                  <span>You&apos;ll receive:</span>
                  <span>{formatCurrency(withdrawalFee.netAmount)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Withdrawal Limits */}
          {walletLimits && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Withdrawal Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Limit:</span>
                    <span>{formatCurrency(walletLimits.dailyWithdrawal)}</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(walletLimits.dailyWithdrawal * 0.35)} used today
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Limit:</span>
                    <span>{formatCurrency(walletLimits.monthlyWithdrawal)}</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(walletLimits.monthlyWithdrawal * 0.20)} used this month
                  </p>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Minimum Withdrawal:</span>
                    <span className="font-medium">{formatCurrency(walletLimits.minWithdrawal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Times */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Domestic (US)</span>
                </div>
                <span className="text-sm font-medium">1-3 days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">International</span>
                </div>
                <span className="text-sm font-medium">3-5 days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Business Account</span>
                </div>
                <span className="text-sm font-medium">1-2 days</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Security Notice</h4>
                  <p className="text-sm text-orange-800">
                    Withdrawals are processed securely and cannot be cancelled once initiated. 
                    Ensure your bank account details are correct before confirming.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">This Month</span>
                </div>
                <span className="font-semibold">{formatCurrency(10000)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Total Withdrawn</span>
                </div>
                <span className="font-semibold">{formatCurrency(45000)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Last Withdrawal</span>
                </div>
                <span className="text-sm font-medium">3 days ago</span>
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
          // Automatically trigger withdrawal after successful bank connection
          if (formData.amount) {
            handleQuickWithdraw(parseFloat(formData.amount))
          }
        }}
        initialAmount={parseFloat(formData.amount || '0')}
        transactionType="withdraw"
      />
    </div>
  )
}

export default WithdrawalInterface