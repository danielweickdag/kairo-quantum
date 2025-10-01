'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  CreditCard, 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Search, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown,
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'dividend' | 'transfer'
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  amount: number
  currency: string
  description: string
  timestamp: string
  reference?: string
  fee?: number
  fromAccount?: string
  toAccount?: string
  tradePair?: string
  tradeType?: 'buy' | 'sell'
  price?: number
  quantity?: number
}

interface TransactionSummary {
  totalDeposits: number
  totalWithdrawals: number
  totalTrades: number
  totalFees: number
  netFlow: number
  tradingVolume: number
  profitLoss: number
}

export default function TransactionHistory() {
  const [activeTab, setActiveTab] = useState('all')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary>({
    totalDeposits: 45000,
    totalWithdrawals: 12000,
    totalTrades: 156,
    totalFees: 245.50,
    netFlow: 33000,
    tradingVolume: 125000,
    profitLoss: 8450.75
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(false)

  // Mock transaction data
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'deposit',
        status: 'completed',
        amount: 5000,
        currency: 'USD',
        description: 'Bank transfer deposit',
        timestamp: '2024-01-20T14:30:00Z',
        reference: 'DEP-2024-001',
        fee: 0,
        fromAccount: 'Bank ****1234'
      },
      {
        id: '2',
        type: 'trade',
        status: 'completed',
        amount: -2500,
        currency: 'USD',
        description: 'Buy BTC/USD',
        timestamp: '2024-01-20T15:45:00Z',
        reference: 'TRD-2024-001',
        fee: 12.50,
        tradePair: 'BTC/USD',
        tradeType: 'buy',
        price: 42500,
        quantity: 0.0588
      },
      {
        id: '3',
        type: 'trade',
        status: 'completed',
        amount: 2750,
        currency: 'USD',
        description: 'Sell BTC/USD',
        timestamp: '2024-01-21T10:20:00Z',
        reference: 'TRD-2024-002',
        fee: 13.75,
        tradePair: 'BTC/USD',
        tradeType: 'sell',
        price: 46800,
        quantity: 0.0588
      },
      {
        id: '4',
        type: 'withdrawal',
        status: 'pending',
        amount: -1000,
        currency: 'USD',
        description: 'Bank withdrawal',
        timestamp: '2024-01-21T16:00:00Z',
        reference: 'WTH-2024-001',
        fee: 25,
        toAccount: 'Bank ****5678'
      },
      {
        id: '5',
        type: 'fee',
        status: 'completed',
        amount: -15,
        currency: 'USD',
        description: 'Monthly platform fee',
        timestamp: '2024-01-15T00:00:00Z',
        reference: 'FEE-2024-001'
      },
      {
        id: '6',
        type: 'dividend',
        status: 'completed',
        amount: 125.50,
        currency: 'USD',
        description: 'AAPL dividend payment',
        timestamp: '2024-01-18T12:00:00Z',
        reference: 'DIV-2024-001'
      },
      {
        id: '7',
        type: 'trade',
        status: 'failed',
        amount: -1500,
        currency: 'USD',
        description: 'Buy ETH/USD (Failed)',
        timestamp: '2024-01-19T09:30:00Z',
        reference: 'TRD-2024-003',
        tradePair: 'ETH/USD',
        tradeType: 'buy'
      },
      {
        id: '8',
        type: 'transfer',
        status: 'completed',
        amount: 500,
        currency: 'USD',
        description: 'Internal transfer from savings',
        timestamp: '2024-01-17T11:15:00Z',
        reference: 'TRF-2024-001',
        fromAccount: 'Savings Account'
      }
    ]
    setTransactions(mockTransactions)
    setFilteredTransactions(mockTransactions)
  }, [])

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter
      
      // Date range filter
      const transactionDate = new Date(transaction.timestamp)
      const now = new Date()
      let matchesDate = true
      
      switch (dateRange) {
        case '7d':
          matchesDate = transactionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          matchesDate = transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          matchesDate = transactionDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case '1y':
          matchesDate = transactionDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
    
    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'amount':
          aValue = Math.abs(a.amount)
          bValue = Math.abs(b.amount)
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, statusFilter, typeFilter, dateRange, sortBy, sortOrder])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'trade': return <ArrowUpDown className="w-4 h-4 text-blue-600" />
      case 'fee': return <DollarSign className="w-4 h-4 text-orange-600" />
      case 'dividend': return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'transfer': return <RefreshCw className="w-4 h-4 text-gray-600" />
      default: return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <Clock className="w-3 h-3" />
      case 'failed': case 'cancelled': return <AlertTriangle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const exportTransactions = () => {
    // Mock export functionality
    const csvContent = filteredTransactions.map(t => 
      `${t.timestamp},${t.type},${t.status},${t.amount},${t.currency},"${t.description}",${t.reference || ''}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Statement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Flow</p>
                <p className={cn("text-2xl font-bold", summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(summary.netFlow)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trading Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.tradingVolume)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{summary.totalTrades}</p>
              </div>
              <ArrowUpDown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">P&L</p>
                <p className={cn("text-2xl font-bold", summary.profitLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(summary.profitLoss)}
                </p>
              </div>
              <PieChart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="trade">Trades</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                  <SelectItem value="dividend">Dividends</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                {filteredTransactions.length} of {transactions.length} transactions
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{transaction.description}</h4>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{formatDate(transaction.timestamp)}</span>
                        {transaction.reference && (
                          <span>Ref: {transaction.reference}</span>
                        )}
                        {transaction.tradePair && (
                          <span>{transaction.tradePair}</span>
                        )}
                        {transaction.fromAccount && (
                          <span>From: {transaction.fromAccount}</span>
                        )}
                        {transaction.toAccount && (
                          <span>To: {transaction.toAccount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-semibold",
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.fee && transaction.fee > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Fee: {formatCurrency(transaction.fee)}
                      </p>
                    )}
                    {transaction.quantity && transaction.price && (
                      <p className="text-sm text-muted-foreground">
                        {transaction.quantity} @ {formatCurrency(transaction.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  <span>Deposits</span>
                </div>
                <span className="font-semibold text-green-600">{formatCurrency(summary.totalDeposits)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                  <span>Withdrawals</span>
                </div>
                <span className="font-semibold text-red-600">-{formatCurrency(summary.totalWithdrawals)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span>Fees</span>
                </div>
                <span className="font-semibold text-orange-600">-{formatCurrency(summary.totalFees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Net Balance</span>
                <span className={cn(summary.netFlow >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(summary.netFlow)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Trades</span>
                <span className="font-semibold">{summary.totalTrades}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Trading Volume</span>
                <span className="font-semibold">{formatCurrency(summary.tradingVolume)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Realized P&L</span>
                <span className={cn(
                  "font-semibold",
                  summary.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatCurrency(summary.profitLoss)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Trade</span>
                <span className="font-semibold">
                  {formatCurrency(summary.tradingVolume / summary.totalTrades)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}