'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Building,
  DollarSign,
  Calendar,
  Shield,
  Unlink
} from 'lucide-react'
import { bankAccountService, BankAccountInfo } from '@/services/BankAccountService'
import BankAccountConnectionModal from '@/components/modals/BankAccountConnectionModal'

export default function BankAccountManagement() {
  const [bankAccounts, setBankAccounts] = useState<BankAccountInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [disconnectingAccount, setDisconnectingAccount] = useState<string | null>(null)
  const [showBalances, setShowBalances] = useState(false)
  const [refreshingAccount, setRefreshingAccount] = useState<string | null>(null)

  useEffect(() => {
    loadBankAccounts()
  }, [])

  const loadBankAccounts = async () => {
    try {
      setLoading(true)
      const accounts = await bankAccountService.getConnectedAccounts()
      setBankAccounts(accounts)
      setError(null)
    } catch (err) {
      setError('Failed to load bank accounts')
      console.error('Error loading bank accounts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      setDisconnectingAccount(accountId)
      const success = await bankAccountService.disconnectAccount(accountId)
      
      if (success) {
        await loadBankAccounts()
        setError(null)
      } else {
        setError('Failed to disconnect bank account')
      }
    } catch (err) {
      setError('Error disconnecting bank account')
      console.error('Error disconnecting account:', err)
    } finally {
      setDisconnectingAccount(null)
    }
  }

  const handleRefreshBalance = async (accountId: string) => {
    try {
      setRefreshingAccount(accountId)
      const newBalance = await bankAccountService.refreshAccountBalance(accountId)
      
      if (newBalance !== null) {
        // Update the account balance in the local state
        setBankAccounts(prev => 
          prev.map(account => 
            account.id === accountId 
              ? { ...account, balance: newBalance }
              : account
          )
        )
        setError(null)
      } else {
        setError('Failed to refresh account balance')
      }
    } catch (err) {
      setError('Error refreshing account balance')
      console.error('Error refreshing balance:', err)
    } finally {
      setRefreshingAccount(null)
    }
  }

  const handleConnectionSuccess = () => {
    setShowConnectionModal(false)
    loadBankAccounts()
  }

  const formatBalance = (balance: number | undefined, currency: string = 'USD') => {
    if (balance === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(balance)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  const getAccountIcon = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'checking':
      case 'savings':
        return <Building className="w-5 h-5" />
      case 'credit':
        return <CreditCard className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const getStatusBadge = (account: BankAccountInfo) => {
    if (account.isVerified) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bank accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Account Management</h2>
          <p className="text-gray-600">Manage your connected bank accounts for deposits and withdrawals</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center"
          >
            {showBalances ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Balances
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Balances
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowConnectionModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Bank Account
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Bank Accounts List */}
      <div className="grid gap-4">
        {bankAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Connected</h3>
              <p className="text-gray-600 text-center mb-4">
                Connect your bank account to enable automated deposits and withdrawals.
              </p>
              <Button
                onClick={() => setShowConnectionModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          bankAccounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      {getAccountIcon(account.accountType)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {account.bankName}
                        </h3>
                        {getStatusBadge(account)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {bankAccountService.getAccountTypeDisplay(account.accountType)} • ****{account.lastFour}
                      </p>
                      {account.connectedAt && (
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Connected {formatDate(account.connectedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Balance Display */}
                    {showBalances && account.balance !== undefined && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Available Balance</p>
                        <p className="font-semibold text-gray-900">
                          {formatBalance(account.balance, account.currency)}
                        </p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefreshBalance(account.id)}
                        disabled={refreshingAccount === account.id}
                        title="Refresh Balance"
                      >
                        <RefreshCw className={`w-4 h-4 ${refreshingAccount === account.id ? 'animate-spin' : ''}`} />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            title="Disconnect Account"
                          >
                            <Unlink className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Disconnect Bank Account</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to disconnect {account.bankName} ****{account.lastFour}? 
                              This will stop all automated transactions for this account.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDisconnectAccount(account.id)}
                              disabled={disconnectingAccount === account.id}
                            >
                              {disconnectingAccount === account.id ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                              )}
                              Disconnect
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                {/* Account Features */}
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Bank-level security</span>
                    </div>
                    {bankAccountService.supportsDeposits(account) && (
                      <Badge variant="outline" className="text-xs">
                        Deposits
                      </Badge>
                    )}
                    {bankAccountService.supportsWithdrawals(account) && (
                      <Badge variant="outline" className="text-xs">
                        Withdrawals
                      </Badge>
                    )}
                  </div>
                  
                  {!account.isVerified && (
                    <Button variant="link" size="sm" className="text-blue-600">
                      Complete Verification
                    </Button>
                  )}
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
              <h4 className="font-medium text-blue-900 mb-1">Security & Privacy</h4>
              <p className="text-sm text-blue-800">
                Your bank account information is encrypted and securely stored. We use bank-level security 
                protocols and never store your login credentials. You can disconnect any account at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Connection Modal */}
      <BankAccountConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onSuccess={handleConnectionSuccess}
        actionType="deposit"
      />
    </div>
  )
}