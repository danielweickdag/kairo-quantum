'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Building2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Shield, 
  AlertTriangle,
  Trash2,
  Edit,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BankAccount, walletService } from '@/services/walletService'

interface BankAccountFormData {
  bankName: string
  accountType: 'checking' | 'savings' | 'business'
  accountNumber: string
  routingNumber: string
  accountHolderName: string
  country: string
  currency: string
  isPrimary: boolean
}

interface MicroDepositVerification {
  amount1: string
  amount2: string
}

const BankAccountManager: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [formData, setFormData] = useState<BankAccountFormData>({
    bankName: '',
    accountType: 'checking',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    country: 'US',
    currency: 'USD',
    isPrimary: false
  })
  const [microDeposits, setMicroDeposits] = useState<MicroDepositVerification>({
    amount1: '',
    amount2: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadBankAccounts()
  }, [])

  const loadBankAccounts = async () => {
    try {
      setIsLoading(true)
      const accounts = await walletService.getBankAccounts()
      setBankAccounts(accounts)
    } catch (error) {
      console.error('Error loading bank accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required'
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required'
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number must be at least 8 digits'
    }

    if (!formData.routingNumber.trim()) {
      newErrors.routingNumber = 'Routing number is required'
    } else if (!/^\d{9}$/.test(formData.routingNumber)) {
      newErrors.routingNumber = 'Routing number must be 9 digits'
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAccount = async () => {
    if (!validateForm()) return

    try {
      setIsAddingAccount(true)
      const newAccount = await walletService.addBankAccount(formData)
      setBankAccounts(prev => [...prev, newAccount])
      setShowAddDialog(false)
      setFormData({
        bankName: '',
        accountType: 'checking',
        accountNumber: '',
        routingNumber: '',
        accountHolderName: '',
        country: 'US',
        currency: 'USD',
        isPrimary: false
      })
      setSuccessMessage('Bank account added successfully! Verification required.')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      setErrors({ general: 'Failed to add bank account. Please try again.' })
    } finally {
      setIsAddingAccount(false)
    }
  }

  const handleVerifyAccount = async (accountId: string) => {
    if (!microDeposits.amount1 || !microDeposits.amount2) {
      setErrors({ verification: 'Please enter both micro-deposit amounts' })
      return
    }

    try {
      setIsVerifying(true)
      // In a real app, this would call the verification API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setBankAccounts(prev => 
        prev.map(account => 
          account.id === accountId 
            ? { ...account, isVerified: true, verificationStatus: 'verified' }
            : account
        )
      )
      
      setShowVerifyDialog(false)
      setMicroDeposits({ amount1: '', amount2: '' })
      setSuccessMessage('Bank account verified successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      setErrors({ verification: 'Verification failed. Please check the amounts and try again.' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSetPrimary = async (accountId: string) => {
    setBankAccounts(prev => 
      prev.map(account => ({
        ...account,
        isPrimary: account.id === accountId
      }))
    )
    setSuccessMessage('Primary account updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Are you sure you want to delete this bank account?')) {
      setBankAccounts(prev => prev.filter(account => account.id !== accountId))
      setSuccessMessage('Bank account deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const getStatusBadge = (account: BankAccount) => {
    if (account.isVerified) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )
    }
    
    if (account.verificationStatus === 'pending') {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
    
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Failed
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading bank accounts...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
          <p className="text-muted-foreground">
            Manage your linked bank accounts for deposits and withdrawals
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
              <DialogDescription>
                Add a new bank account for deposits and withdrawals. All accounts require verification.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="Chase Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    className={errors.bankName ? 'border-red-500' : ''}
                  />
                  {errors.bankName && <p className="text-sm text-red-500">{errors.bankName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={formData.accountType} 
                    onValueChange={(value: 'checking' | 'savings' | 'business') => 
                      setFormData(prev => ({ ...prev, accountType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                  className={errors.accountHolderName ? 'border-red-500' : ''}
                />
                {errors.accountHolderName && <p className="text-sm text-red-500">{errors.accountHolderName}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="123456789"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className={errors.accountNumber ? 'border-red-500' : ''}
                  />
                  {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="021000021"
                    value={formData.routingNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                    className={errors.routingNumber ? 'border-red-500' : ''}
                  />
                  {errors.routingNumber && <p className="text-sm text-red-500">{errors.routingNumber}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {errors.general && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount} disabled={isAddingAccount}>
                  {isAddingAccount && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Bank Accounts List */}
      <div className="grid gap-4">
        {bankAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bank Accounts</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add a bank account to start making deposits and withdrawals
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          bankAccounts.map((account) => (
            <Card key={account.id} className={cn(
              "transition-all duration-200 hover:shadow-md",
              account.isPrimary && "ring-2 ring-blue-500 ring-opacity-50"
            )}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{account.bankName}</h3>
                        {account.isPrimary && (
                          <Badge variant="outline" className="text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} • {account.accountNumber}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        {account.accountHolderName} • {account.currency}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(account)}
                        <span className="text-xs text-muted-foreground">
                          Added {account.addedDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!account.isVerified && account.verificationStatus === 'pending' && (
                      <Dialog open={showVerifyDialog && selectedAccount?.id === account.id} onOpenChange={setShowVerifyDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAccount(account)}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Verify Bank Account</DialogTitle>
                            <DialogDescription>
                              Enter the two micro-deposit amounts sent to your account
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                We&apos;ve sent two small deposits (less than $1.00 each) to your account. 
                                Check your bank statement and enter the exact amounts below.
                              </AlertDescription>
                            </Alert>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="amount1">First Amount ($)</Label>
                                <Input
                                  id="amount1"
                                  placeholder="0.23"
                                  value={microDeposits.amount1}
                                  onChange={(e) => setMicroDeposits(prev => ({ ...prev, amount1: e.target.value }))}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="amount2">Second Amount ($)</Label>
                                <Input
                                  id="amount2"
                                  placeholder="0.47"
                                  value={microDeposits.amount2}
                                  onChange={(e) => setMicroDeposits(prev => ({ ...prev, amount2: e.target.value }))}
                                />
                              </div>
                            </div>
                            
                            {errors.verification && (
                              <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{errors.verification}</AlertDescription>
                              </Alert>
                            )}
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => handleVerifyAccount(account.id)} 
                                disabled={isVerifying}
                              >
                                {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Verify Account
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {account.isVerified && !account.isPrimary && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetPrimary(account.id)}
                      >
                        Set Primary
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Security & Verification</h4>
              <p className="text-sm text-blue-800">
                All bank accounts require verification through micro-deposits for security. 
                Your banking information is encrypted and never stored in plain text.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BankAccountManager