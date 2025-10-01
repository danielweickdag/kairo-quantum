'use client'

import automatedDepositWithdrawService from './AutomatedDepositWithdrawService'
import balanceTrackingService from './BalanceTrackingService'

export interface ScheduledTransaction {
  id: string
  userId: string
  type: 'deposit' | 'withdraw'
  amount: number
  currency: string
  bankAccountId: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  dayOfWeek?: number // 0-6 for weekly
  dayOfMonth?: number // 1-31 for monthly
  isActive: boolean
  nextExecution: Date
  lastExecution?: Date
  createdAt: Date
  conditions?: {
    minBalance?: number
    maxBalance?: number
    profitThreshold?: number
  }
}

export interface ScheduleConfig {
  type: 'deposit' | 'withdraw'
  amount: number
  currency: string
  bankAccountId: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  dayOfWeek?: number
  dayOfMonth?: number
  conditions?: {
    minBalance?: number
    maxBalance?: number
    profitThreshold?: number
  }
}

export interface ExecutionResult {
  success: boolean
  transactionId?: string
  error?: string
  skipped?: boolean
  reason?: string
}

class TransactionSchedulerService {
  private scheduledTransactions: Map<string, ScheduledTransaction> = new Map()
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  constructor() {
    this.loadScheduledTransactions()
    this.startScheduler()
  }

  /**
   * Create a new scheduled transaction
   */
  async createScheduledTransaction(
    userId: string,
    config: ScheduleConfig
  ): Promise<ScheduledTransaction> {
    const id = this.generateId()
    const nextExecution = this.calculateNextExecution(config.frequency, config.dayOfWeek, config.dayOfMonth)

    const scheduledTransaction: ScheduledTransaction = {
      id,
      userId,
      type: config.type,
      amount: config.amount,
      currency: config.currency,
      bankAccountId: config.bankAccountId,
      frequency: config.frequency,
      dayOfWeek: config.dayOfWeek,
      dayOfMonth: config.dayOfMonth,
      isActive: true,
      nextExecution,
      createdAt: new Date(),
      conditions: config.conditions
    }

    this.scheduledTransactions.set(id, scheduledTransaction)
    await this.saveScheduledTransactions()

    return scheduledTransaction
  }

  /**
   * Get all scheduled transactions for a user
   */
  getScheduledTransactions(userId: string): ScheduledTransaction[] {
    return Array.from(this.scheduledTransactions.values())
      .filter(transaction => transaction.userId === userId)
  }

  /**
   * Update a scheduled transaction
   */
  async updateScheduledTransaction(
    id: string,
    updates: Partial<ScheduleConfig>
  ): Promise<ScheduledTransaction | null> {
    const transaction = this.scheduledTransactions.get(id)
    if (!transaction) return null

    const updatedTransaction = {
      ...transaction,
      ...updates,
      nextExecution: updates.frequency || updates.dayOfWeek || updates.dayOfMonth
        ? this.calculateNextExecution(
            updates.frequency || transaction.frequency,
            updates.dayOfWeek ?? transaction.dayOfWeek,
            updates.dayOfMonth ?? transaction.dayOfMonth
          )
        : transaction.nextExecution
    }

    this.scheduledTransactions.set(id, updatedTransaction)
    await this.saveScheduledTransactions()

    return updatedTransaction
  }

  /**
   * Delete a scheduled transaction
   */
  async deleteScheduledTransaction(id: string): Promise<boolean> {
    const deleted = this.scheduledTransactions.delete(id)
    if (deleted) {
      await this.saveScheduledTransactions()
    }
    return deleted
  }

  /**
   * Toggle active status of a scheduled transaction
   */
  async toggleScheduledTransaction(id: string): Promise<ScheduledTransaction | null> {
    const transaction = this.scheduledTransactions.get(id)
    if (!transaction) return null

    transaction.isActive = !transaction.isActive
    this.scheduledTransactions.set(id, transaction)
    await this.saveScheduledTransactions()

    return transaction
  }

  /**
   * Execute a specific scheduled transaction manually
   */
  async executeScheduledTransaction(id: string): Promise<ExecutionResult> {
    const transaction = this.scheduledTransactions.get(id)
    if (!transaction) {
      return { success: false, error: 'Transaction not found' }
    }

    return await this.executeTransaction(transaction)
  }

  /**
   * Start the scheduler
   */
  startScheduler(): void {
    if (this.isRunning) return

    this.isRunning = true
    // Check every minute for due transactions
    this.intervalId = setInterval(() => {
      this.checkAndExecuteDueTransactions()
    }, 60000)

    console.log('Transaction scheduler started')
  }

  /**
   * Stop the scheduler
   */
  stopScheduler(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('Transaction scheduler stopped')
  }

  /**
   * Check for due transactions and execute them
   */
  private async checkAndExecuteDueTransactions(): Promise<void> {
    const now = new Date()
    const dueTransactions = Array.from(this.scheduledTransactions.values())
      .filter(transaction => 
        transaction.isActive && 
        transaction.nextExecution <= now
      )

    for (const transaction of dueTransactions) {
      try {
        const result = await this.executeTransaction(transaction)
        
        // Update transaction regardless of success/failure
        transaction.lastExecution = now
        transaction.nextExecution = this.calculateNextExecution(
          transaction.frequency,
          transaction.dayOfWeek,
          transaction.dayOfMonth
        )
        
        this.scheduledTransactions.set(transaction.id, transaction)
        
        console.log(`Scheduled transaction ${transaction.id} executed:`, result)
      } catch (error) {
        console.error(`Error executing scheduled transaction ${transaction.id}:`, error)
      }
    }

    if (dueTransactions.length > 0) {
      await this.saveScheduledTransactions()
    }
  }

  /**
   * Execute a single transaction
   */
  private async executeTransaction(transaction: ScheduledTransaction): Promise<ExecutionResult> {
    try {
      // Check conditions before executing
      const conditionCheck = await this.checkConditions(transaction)
      if (!conditionCheck.canExecute) {
        return {
          success: true,
          skipped: true,
          reason: conditionCheck.reason
        }
      }

      // Execute the transaction
      if (transaction.type === 'deposit') {
        const result = await automatedDepositWithdrawService.handleQuickDeposit({
          type: 'deposit',
          amount: transaction.amount,
          bankAccountId: transaction.bankAccountId
        })
        
        return {
          success: result.status === 'completed' || result.status === 'processing',
          transactionId: result.id,
          error: result.status === 'failed' ? result.message : undefined
        }
      } else {
        const result = await automatedDepositWithdrawService.handleQuickWithdraw({
          type: 'withdrawal',
          amount: transaction.amount,
          bankAccountId: transaction.bankAccountId
        })
        
        return {
          success: result.status === 'completed' || result.status === 'processing',
          transactionId: result.id,
          error: result.status === 'failed' ? result.message : undefined
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Check if transaction conditions are met
   */
  private async checkConditions(transaction: ScheduledTransaction): Promise<{
    canExecute: boolean
    reason?: string
  }> {
    if (!transaction.conditions) {
      return { canExecute: true }
    }

    try {
      const balance = await balanceTrackingService.getCurrentBalance()
      const { conditions } = transaction

      // Check minimum balance condition
      if (conditions.minBalance && balance.availableBalance < conditions.minBalance) {
        return {
          canExecute: false,
          reason: `Balance ${balance.availableBalance} below minimum ${conditions.minBalance}`
        }
      }

      // Check maximum balance condition (for deposits)
      if (conditions.maxBalance && balance.availableBalance > conditions.maxBalance) {
        return {
          canExecute: false,
          reason: `Balance ${balance.availableBalance} above maximum ${conditions.maxBalance}`
        }
      }

      // Check profit threshold condition
      if (conditions.profitThreshold) {
        const profit = balance.totalBalance - balance.investedAmount
        if (profit < conditions.profitThreshold) {
          return {
            canExecute: false,
            reason: `Profit ${profit} below threshold ${conditions.profitThreshold}`
          }
        }
      }

      return { canExecute: true }
    } catch (error) {
      return {
        canExecute: false,
        reason: 'Error checking conditions'
      }
    }
  }

  /**
   * Calculate next execution time based on frequency
   */
  private calculateNextExecution(
    frequency: string,
    dayOfWeek?: number,
    dayOfMonth?: number
  ): Date {
    const now = new Date()
    const next = new Date(now)

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1)
        break

      case 'weekly':
        const targetDay = dayOfWeek ?? 1 // Default to Monday
        const daysUntilTarget = (targetDay - next.getDay() + 7) % 7
        next.setDate(next.getDate() + (daysUntilTarget || 7))
        break

      case 'monthly':
        const targetDate = dayOfMonth ?? 1 // Default to 1st of month
        next.setMonth(next.getMonth() + 1)
        next.setDate(Math.min(targetDate, this.getDaysInMonth(next.getFullYear(), next.getMonth())))
        break

      case 'quarterly':
        next.setMonth(next.getMonth() + 3)
        if (dayOfMonth) {
          next.setDate(Math.min(dayOfMonth, this.getDaysInMonth(next.getFullYear(), next.getMonth())))
        }
        break

      default:
        next.setDate(next.getDate() + 1)
    }

    // Set to 9 AM for execution
    next.setHours(9, 0, 0, 0)
    
    return next
  }

  /**
   * Get number of days in a month
   */
  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Load scheduled transactions from storage
   */
  private async loadScheduledTransactions(): Promise<void> {
    try {
      const stored = localStorage.getItem('scheduledTransactions')
      if (stored) {
        const transactions = JSON.parse(stored) as ScheduledTransaction[]
        transactions.forEach(transaction => {
          // Convert date strings back to Date objects
          transaction.nextExecution = new Date(transaction.nextExecution)
          transaction.createdAt = new Date(transaction.createdAt)
          if (transaction.lastExecution) {
            transaction.lastExecution = new Date(transaction.lastExecution)
          }
          this.scheduledTransactions.set(transaction.id, transaction)
        })
      }
    } catch (error) {
      console.error('Error loading scheduled transactions:', error)
    }
  }

  /**
   * Save scheduled transactions to storage
   */
  private async saveScheduledTransactions(): Promise<void> {
    try {
      const transactions = Array.from(this.scheduledTransactions.values())
      localStorage.setItem('scheduledTransactions', JSON.stringify(transactions))
    } catch (error) {
      console.error('Error saving scheduled transactions:', error)
    }
  }
}

// Export singleton instance
export const transactionSchedulerService = new TransactionSchedulerService()
export default transactionSchedulerService