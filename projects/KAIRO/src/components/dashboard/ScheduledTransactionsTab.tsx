'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, DollarSign, Plus, Settings, Trash2, Play, Pause, Edit } from 'lucide-react'
import { transactionSchedulerService, ScheduledTransaction, ScheduleConfig } from '@/services/TransactionSchedulerService'
import { bankAccountService } from '@/services/BankAccountService'

interface BankAccount {
  id: string
  bankName: string
  accountType: string
  lastFour: string
  isVerified: boolean
}

export default function ScheduledTransactionsTab() {
  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<ScheduledTransaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<ScheduleConfig>({
    type: 'deposit',
    amount: 0,
    currency: 'USD',
    bankAccountId: '',
    frequency: 'monthly',
    dayOfMonth: 1
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [transactions, accounts] = await Promise.all([
        Promise.resolve(transactionSchedulerService.getScheduledTransactions('user-123')),
        bankAccountService.getConnectedAccounts()
      ])
      setScheduledTransactions(transactions)
      setBankAccounts(accounts)
    } catch (err) {
      setError('Failed to load scheduled transactions')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = async () => {
    try {
      if (!formData.bankAccountId || formData.amount <= 0) {
        setError('Please fill in all required fields')
        return
      }

      await transactionSchedulerService.createScheduledTransaction('user-123', formData)
      await loadData()
      setIsCreateDialogOpen(false)
      resetForm()
      setError(null)
    } catch (err) {
      setError('Failed to create scheduled transaction')
      console.error('Error creating schedule:', err)
    }
  }

  const handleEditSchedule = async () => {
    try {
      if (!editingTransaction || !formData.bankAccountId || formData.amount <= 0) {
        setError('Please fill in all required fields')
        return
      }

      await transactionSchedulerService.updateScheduledTransaction(editingTransaction.id, formData)
      await loadData()
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
      resetForm()
      setError(null)
    } catch (err) {
      setError('Failed to update scheduled transaction')
      console.error('Error updating schedule:', err)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      await transactionSchedulerService.toggleScheduledTransaction(id)
      await loadData()
    } catch (err) {
      setError('Failed to toggle transaction status')
      console.error('Error toggling status:', err)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    try {
      await transactionSchedulerService.deleteScheduledTransaction(id)
      await loadData()
    } catch (err) {
      setError('Failed to delete scheduled transaction')
      console.error('Error deleting schedule:', err)
    }
  }

  const handleExecuteNow = async (id: string) => {
    try {
      const result = await transactionSchedulerService.executeScheduledTransaction(id)
      if (result.success) {
        if (result.skipped) {
          setError(`Transaction skipped: ${result.reason}`)
        } else {
          setError(null)
          await loadData()
        }
      } else {
        setError(`Execution failed: ${result.error}`)
      }
    } catch (err) {
      setError('Failed to execute transaction')
      console.error('Error executing transaction:', err)
    }
  }

  const openEditDialog = (transaction: ScheduledTransaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      bankAccountId: transaction.bankAccountId,
      frequency: transaction.frequency,
      dayOfWeek: transaction.dayOfWeek,
      dayOfMonth: transaction.dayOfMonth,
      conditions: transaction.conditions
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      type: 'deposit',
      amount: 0,
      currency: 'USD',
      bankAccountId: '',
      frequency: 'monthly',
      dayOfMonth: 1
    })
  }

  const formatNextExecution = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getFrequencyDisplay = (transaction: ScheduledTransaction) => {
    switch (transaction.frequency) {
      case 'daily':
        return 'Daily'
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return `Weekly (${days[transaction.dayOfWeek || 1]})`
      case 'monthly':
        return `Monthly (${transaction.dayOfMonth || 1}${getOrdinalSuffix(transaction.dayOfMonth || 1)})`
      case 'quarterly':
        return `Quarterly${transaction.dayOfMonth ? ` (${transaction.dayOfMonth}${getOrdinalSuffix(transaction.dayOfMonth)})` : ''}`
      default:
        return transaction.frequency
    }
  }

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  const getBankAccountDisplay = (bankAccountId: string) => {
    const account = bankAccounts.find(acc => acc.id === bankAccountId)
    return account ? `${account.bankName} ****${account.lastFour}` : 'Unknown Account'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scheduled transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scheduled Transactions</h2>
          <p className="text-gray-600">Automate your deposits and withdrawals</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Transaction</DialogTitle>
              <DialogDescription>
                Set up automatic deposits or withdrawals
              </DialogDescription>
            </DialogHeader>
            <ScheduleForm
              formData={formData}
              setFormData={setFormData}
              bankAccounts={bankAccounts}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSchedule}>
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Scheduled Transactions List */}
      <div className="grid gap-4">
        {scheduledTransactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Transactions</h3>
              <p className="text-gray-600 text-center mb-4">
                Set up automatic deposits and withdrawals to streamline your trading workflow.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          scheduledTransactions.map((transaction) => (
            <Card key={transaction.id} className={`${!transaction.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {transaction.type === 'deposit' ? 'Auto Deposit' : 'Auto Withdraw'}
                        </h3>
                        <Badge variant={transaction.isActive ? 'default' : 'secondary'}>
                          {transaction.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        ${transaction.amount.toLocaleString()} {transaction.currency} • {getFrequencyDisplay(transaction)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getBankAccountDisplay(transaction.bankAccountId)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Next: {formatNextExecution(transaction.nextExecution)}
                      </p>
                      {transaction.lastExecution && (
                        <p className="text-xs text-gray-500">
                          Last: {formatNextExecution(transaction.lastExecution)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(transaction.id)}
                        title={transaction.isActive ? 'Pause' : 'Resume'}
                      >
                        {transaction.isActive ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(transaction)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExecuteNow(transaction.id)}
                        title="Execute Now"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchedule(transaction.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Transaction</DialogTitle>
            <DialogDescription>
              Update your automatic transaction settings
            </DialogDescription>
          </DialogHeader>
          <ScheduleForm
            formData={formData}
            setFormData={setFormData}
            bankAccounts={bankAccounts}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSchedule}>
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Schedule Form Component
interface ScheduleFormProps {
  formData: ScheduleConfig
  setFormData: (data: ScheduleConfig) => void
  bankAccounts: BankAccount[]
}

function ScheduleForm({ formData, setFormData, bankAccounts }: ScheduleFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: 'deposit' | 'withdraw') => 
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdraw">Withdraw</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bankAccount">Bank Account</Label>
        <Select
          value={formData.bankAccountId}
          onValueChange={(value) => setFormData({ ...formData, bankAccountId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bank account" />
          </SelectTrigger>
          <SelectContent>
            {bankAccounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.bankName} ****{account.lastFour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          value={formData.frequency}
          onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly') => 
            setFormData({ ...formData, frequency: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.frequency === 'weekly' && (
        <div>
          <Label htmlFor="dayOfWeek">Day of Week</Label>
          <Select
            value={formData.dayOfWeek?.toString() || '1'}
            onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sunday</SelectItem>
              <SelectItem value="1">Monday</SelectItem>
              <SelectItem value="2">Tuesday</SelectItem>
              <SelectItem value="3">Wednesday</SelectItem>
              <SelectItem value="4">Thursday</SelectItem>
              <SelectItem value="5">Friday</SelectItem>
              <SelectItem value="6">Saturday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(formData.frequency === 'monthly' || formData.frequency === 'quarterly') && (
        <div>
          <Label htmlFor="dayOfMonth">Day of Month</Label>
          <Input
            id="dayOfMonth"
            type="number"
            min="1"
            max="31"
            value={formData.dayOfMonth || 1}
            onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) || 1 })}
          />
        </div>
      )}
    </div>
  )
}