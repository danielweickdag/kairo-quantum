'use client'

interface BalanceData {
  totalBalance: number
  availableBalance: number
  investedAmount: number
  pendingDeposits: number
  pendingWithdrawals: number
  lastUpdated: Date
}

interface BalanceUpdateListener {
  (balance: BalanceData): void
}

class BalanceTrackingService {
  private balance: BalanceData = {
    totalBalance: 125000,
    availableBalance: 45000,
    investedAmount: 80000,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    lastUpdated: new Date()
  }

  private listeners: Set<BalanceUpdateListener> = new Set()
  private updateInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start real-time updates
    this.startRealTimeUpdates()
  }

  /**
   * Subscribe to balance updates
   */
  subscribe(listener: BalanceUpdateListener): () => void {
    this.listeners.add(listener)
    
    // Immediately send current balance
    listener(this.balance)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Get current balance
   */
  getCurrentBalance(): BalanceData {
    return { ...this.balance }
  }

  /**
   * Update balance after deposit
   */
  async processDeposit(amount: number): Promise<void> {
    // Add to pending deposits first
    this.balance.pendingDeposits += amount
    this.notifyListeners()

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Move from pending to available balance
    this.balance.pendingDeposits -= amount
    this.balance.availableBalance += amount
    this.balance.totalBalance += amount
    this.balance.lastUpdated = new Date()
    
    this.notifyListeners()
  }

  /**
   * Update balance after withdrawal
   */
  async processWithdrawal(amount: number): Promise<void> {
    // Check if sufficient funds
    if (this.balance.availableBalance < amount) {
      throw new Error('Insufficient funds for withdrawal')
    }

    // Add to pending withdrawals
    this.balance.pendingWithdrawals += amount
    this.balance.availableBalance -= amount
    this.notifyListeners()

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Complete withdrawal
    this.balance.pendingWithdrawals -= amount
    this.balance.totalBalance -= amount
    this.balance.lastUpdated = new Date()
    
    this.notifyListeners()
  }

  /**
   * Update invested amount
   */
  updateInvestedAmount(amount: number): void {
    const difference = amount - this.balance.investedAmount
    
    // Adjust available balance
    this.balance.availableBalance -= difference
    this.balance.investedAmount = amount
    this.balance.lastUpdated = new Date()
    
    this.notifyListeners()
  }

  /**
   * Add profit from trading
   */
  addTradingProfit(profit: number): void {
    this.balance.availableBalance += profit
    this.balance.totalBalance += profit
    this.balance.lastUpdated = new Date()
    
    this.notifyListeners()
  }

  /**
   * Start real-time balance updates (simulate market changes)
   */
  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      // Simulate small market fluctuations in invested amount
      const fluctuation = (Math.random() - 0.5) * 100 // ±$50
      const newInvestedValue = Math.max(0, this.balance.investedAmount + fluctuation)
      const difference = newInvestedValue - this.balance.investedAmount
      
      this.balance.investedAmount = newInvestedValue
      this.balance.totalBalance += difference
      this.balance.lastUpdated = new Date()
      
      this.notifyListeners()
    }, 5000) // Update every 5 seconds
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  /**
   * Notify all listeners of balance changes
   */
  private notifyListeners(): void {
    const balanceCopy = { ...this.balance }
    this.listeners.forEach(listener => {
      try {
        listener(balanceCopy)
      } catch (error) {
        console.error('Error in balance listener:', error)
      }
    })
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Get balance summary for display
   */
  getBalanceSummary(): {
    total: string
    available: string
    invested: string
    pending: string
  } {
    return {
      total: this.formatCurrency(this.balance.totalBalance),
      available: this.formatCurrency(this.balance.availableBalance),
      invested: this.formatCurrency(this.balance.investedAmount),
      pending: this.formatCurrency(this.balance.pendingDeposits + this.balance.pendingWithdrawals)
    }
  }
}

// Create singleton instance
const balanceTrackingService = new BalanceTrackingService()

export default balanceTrackingService
export type { BalanceData, BalanceUpdateListener }