import { formatCurrency } from '@/lib/utils'

export interface WalletBalance {
  currency: string
  available: number
  pending: number
  total: number
  lastUpdated: Date
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'transfer' | 'dividend' | 'interest'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing'
  description: string
  timestamp: Date
  paymentMethod?: string
  bankAccount?: string
  fee?: number
  reference?: string
  metadata?: Record<string, any>
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'crypto' | 'paypal' | 'wire' | 'ach'
  name: string
  last4: string
  expiryDate?: string
  isDefault: boolean
  isVerified: boolean
  provider: string
  limits: {
    daily: number
    monthly: number
    perTransaction: number
  }
}

export interface BankAccount {
  id: string
  bankName: string
  accountType: 'checking' | 'savings' | 'business'
  accountNumber: string
  routingNumber: string
  accountHolderName: string
  isVerified: boolean
  isPrimary: boolean
  addedDate: Date
  verificationStatus: 'pending' | 'verified' | 'failed'
  country: string
  currency: string
}

export interface DepositRequest {
  amount: number
  currency: string
  paymentMethodId: string
  description?: string
}

export interface WithdrawalRequest {
  amount: number
  currency: string
  bankAccountId: string
  description?: string
}

export interface WalletLimits {
  dailyDeposit: number
  monthlyDeposit: number
  dailyWithdrawal: number
  monthlyWithdrawal: number
  maxBalance: number
  minWithdrawal: number
}

export interface WalletStats {
  totalDeposited: number
  totalWithdrawn: number
  totalTradingVolume: number
  totalFees: number
  profitLoss: number
  monthlyStats: {
    deposits: number
    withdrawals: number
    trades: number
    fees: number
  }
}

class WalletService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
  private userId: string | null = null

  constructor(userId?: string) {
    this.userId = userId || null
  }

  // Wallet Balance Management
  async getWalletBalances(): Promise<WalletBalance[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/balances`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balances')
      }
      
      const data = await response.json()
      return data.balances.map((balance: any) => ({
        ...balance,
        lastUpdated: new Date(balance.lastUpdated)
      }))
    } catch (error) {
      console.error('Error fetching wallet balances:', error)
      // Return mock data for development
      return this.getMockBalances()
    }
  }

  async getWalletBalance(currency: string): Promise<WalletBalance | null> {
    const balances = await this.getWalletBalances()
    return balances.find(b => b.currency === currency) || null
  }

  async refreshWalletBalances(): Promise<WalletBalance[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/balances/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to refresh wallet balances')
      }
      
      const data = await response.json()
      return data.balances
    } catch (error) {
      console.error('Error refreshing wallet balances:', error)
      return this.getMockBalances()
    }
  }

  // Deposit Operations
  async initiateDeposit(request: DepositRequest): Promise<Transaction> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to initiate deposit')
      }
      
      const data = await response.json()
      return {
        ...data.transaction,
        timestamp: new Date(data.transaction.timestamp)
      }
    } catch (error) {
      console.error('Error initiating deposit:', error)
      throw error
    }
  }

  async getDepositMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/deposit-methods`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch deposit methods')
      }
      
      const data = await response.json()
      return data.methods
    } catch (error) {
      console.error('Error fetching deposit methods:', error)
      return this.getMockPaymentMethods()
    }
  }

  // Withdrawal Operations
  async initiateWithdrawal(request: WithdrawalRequest): Promise<Transaction> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/withdrawal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to initiate withdrawal')
      }
      
      const data = await response.json()
      return {
        ...data.transaction,
        timestamp: new Date(data.transaction.timestamp)
      }
    } catch (error) {
      console.error('Error initiating withdrawal:', error)
      throw error
    }
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/bank-accounts`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts')
      }
      
      const data = await response.json()
      return data.accounts.map((account: any) => ({
        ...account,
        addedDate: new Date(account.addedDate)
      }))
    } catch (error) {
      console.error('Error fetching bank accounts:', error)
      return this.getMockBankAccounts()
    }
  }

  async addBankAccount(bankData: Omit<BankAccount, 'id' | 'addedDate' | 'isVerified' | 'verificationStatus'>): Promise<BankAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/bank-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add bank account')
      }
      
      const data = await response.json()
      return {
        ...data.account,
        addedDate: new Date(data.account.addedDate)
      }
    } catch (error) {
      console.error('Error adding bank account:', error)
      throw error
    }
  }

  // Transaction History
  async getTransactionHistory(limit = 50, offset = 0, type?: string): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(type && { type })
      })
      
      const response = await fetch(`${this.baseUrl}/api/wallet/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history')
      }
      
      const data = await response.json()
      return data.transactions.map((tx: any) => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      }))
    } catch (error) {
      console.error('Error fetching transaction history:', error)
      return this.getMockTransactions()
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction')
      }
      
      const data = await response.json()
      return {
        ...data.transaction,
        timestamp: new Date(data.transaction.timestamp)
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
  }

  // Wallet Limits and Stats
  async getWalletLimits(): Promise<WalletLimits> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/limits`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet limits')
      }
      
      const data = await response.json()
      return data.limits
    } catch (error) {
      console.error('Error fetching wallet limits:', error)
      return this.getMockLimits()
    }
  }

  async getWalletStats(): Promise<WalletStats> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet stats')
      }
      
      const data = await response.json()
      return data.stats
    } catch (error) {
      console.error('Error fetching wallet stats:', error)
      return this.getMockStats()
    }
  }

  // Utility Methods
  private getAuthToken(): string {
    // In a real app, this would get the token from localStorage, cookies, or context
    return localStorage.getItem('authToken') || 'mock-token'
  }

  formatBalance(balance: WalletBalance): string {
    return `${formatCurrency(balance.available)} ${balance.currency}`
  }

  calculateTotalPortfolioValue(balances: WalletBalance[]): number {
    // In a real app, this would convert all currencies to a base currency
    const usdBalance = balances.find(b => b.currency === 'USD')
    return usdBalance ? usdBalance.total : 0
  }

  // Mock Data Methods (for development)
  private getMockBalances(): WalletBalance[] {
    return [
      {
        currency: 'USD',
        available: 25847.32,
        pending: 1200.00,
        total: 27047.32,
        lastUpdated: new Date()
      },
      {
        currency: 'BTC',
        available: 0.5847,
        pending: 0.0123,
        total: 0.5970,
        lastUpdated: new Date()
      },
      {
        currency: 'ETH',
        available: 12.847,
        pending: 0.234,
        total: 13.081,
        lastUpdated: new Date()
      }
    ]
  }

  private getMockPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: '1',
        type: 'card',
        name: 'Visa ****1234',
        last4: '1234',
        expiryDate: '12/26',
        isDefault: true,
        isVerified: true,
        provider: 'Stripe',
        limits: {
          daily: 10000,
          monthly: 50000,
          perTransaction: 5000
        }
      },
      {
        id: '2',
        type: 'bank',
        name: 'Chase Checking',
        last4: '1234',
        isDefault: false,
        isVerified: true,
        provider: 'Plaid',
        limits: {
          daily: 25000,
          monthly: 100000,
          perTransaction: 10000
        }
      }
    ]
  }

  private getMockBankAccounts(): BankAccount[] {
    return [
      {
        id: '1',
        bankName: 'Chase Bank',
        accountType: 'checking',
        accountNumber: '****1234',
        routingNumber: '021000021',
        accountHolderName: 'John Doe',
        isVerified: true,
        isPrimary: true,
        addedDate: new Date('2024-01-10'),
        verificationStatus: 'verified',
        country: 'US',
        currency: 'USD'
      },
      {
        id: '2',
        bankName: 'Bank of America',
        accountType: 'savings',
        accountNumber: '****5678',
        routingNumber: '026009593',
        accountHolderName: 'John Doe',
        isVerified: false,
        isPrimary: false,
        addedDate: new Date('2024-01-12'),
        verificationStatus: 'pending',
        country: 'US',
        currency: 'USD'
      }
    ]
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: '1',
        type: 'deposit',
        amount: 5000.00,
        currency: 'USD',
        status: 'completed',
        description: 'Bank transfer deposit',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        bankAccount: 'Chase Bank ****1234'
      },
      {
        id: '2',
        type: 'withdrawal',
        amount: 2500.00,
        currency: 'USD',
        status: 'pending',
        description: 'Withdrawal to bank account',
        timestamp: new Date('2024-01-14T16:45:00Z'),
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
        timestamp: new Date('2024-01-14T14:20:00Z')
      }
    ]
  }

  private getMockLimits(): WalletLimits {
    return {
      dailyDeposit: 50000,
      monthlyDeposit: 500000,
      dailyWithdrawal: 25000,
      monthlyWithdrawal: 250000,
      maxBalance: 1000000,
      minWithdrawal: 100
    }
  }

  private getMockStats(): WalletStats {
    return {
      totalDeposited: 125000,
      totalWithdrawn: 45000,
      totalTradingVolume: 250000,
      totalFees: 1250,
      profitLoss: 15000,
      monthlyStats: {
        deposits: 25000,
        withdrawals: 10000,
        trades: 50000,
        fees: 250
      }
    }
  }
}

export default WalletService
export const walletService = new WalletService()