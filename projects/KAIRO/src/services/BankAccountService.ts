'use client'

import { bankAccountIntegrationService, BankAccount } from './BankAccountIntegrationService'

export interface BankAccountInfo {
  id: string
  bankName: string
  accountType: 'checking' | 'savings' | 'credit'
  lastFour: string
  isVerified: boolean
  isActive: boolean
  balance?: number
  currency: string
  connectedAt?: Date
}

class BankAccountService {
  /**
   * Get all connected bank accounts for the current user
   */
  async getConnectedAccounts(): Promise<BankAccountInfo[]> {
    try {
      const accounts = await bankAccountIntegrationService.getBankAccounts()
      
      return accounts.map(account => ({
        id: account.id,
        bankName: account.accountName || 'Unknown Bank',
        accountType: account.accountType as 'checking' | 'savings' | 'credit',
        lastFour: account.accountName?.slice(-4) || '****',
        isVerified: account.isVerified,
        isActive: account.isActive,
        balance: account.balance?.available || 0,
        currency: 'USD',
        connectedAt: account.createdAt
      }))
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
      return []
    }
  }

  /**
   * Get a specific bank account by ID
   */
  async getBankAccount(accountId: string): Promise<BankAccountInfo | null> {
    try {
      const accounts = await this.getConnectedAccounts()
      return accounts.find(account => account.id === accountId) || null
    } catch (error) {
      console.error('Error fetching bank account:', error)
      return null
    }
  }

  /**
   * Check if user has any verified bank accounts
   */
  async hasVerifiedAccounts(): Promise<boolean> {
    try {
      const accounts = await this.getConnectedAccounts()
      return accounts.some(account => account.isVerified)
    } catch (error) {
      console.error('Error checking verified accounts:', error)
      return false
    }
  }

  /**
   * Get the primary (first verified) bank account
   */
  async getPrimaryAccount(): Promise<BankAccountInfo | null> {
    try {
      const accounts = await this.getConnectedAccounts()
      return accounts.find(account => account.isVerified) || accounts[0] || null
    } catch (error) {
      console.error('Error fetching primary account:', error)
      return null
    }
  }

  /**
   * Disconnect a bank account
   */
  async disconnectAccount(accountId: string): Promise<boolean> {
    try {
      return await bankAccountIntegrationService.connectBankAccount({ accountId, disconnect: true })
    } catch (error) {
      console.error('Error disconnecting account:', error)
      return false
    }
  }

  /**
   * Refresh account balance
   */
  async refreshAccountBalance(accountId: string): Promise<number | null> {
    try {
      const result = await bankAccountIntegrationService.getAccountBalance(accountId)
      return result?.available || null
    } catch (error) {
      console.error('Error refreshing account balance:', error)
      return null
    }
  }

  /**
   * Verify a bank account
   */
  async verifyAccount(accountId: string, verificationData: any): Promise<boolean> {
    try {
      return await bankAccountIntegrationService.verifyBankAccount(accountId, verificationData)
    } catch (error) {
      console.error('Error verifying account:', error)
      return false
    }
  }

  /**
   * Get account transaction history
   */
  async getAccountTransactions(accountId: string, limit: number = 50): Promise<any[]> {
    try {
      return await bankAccountIntegrationService.getTransactionHistory(accountId)
    } catch (error) {
      console.error('Error fetching account transactions:', error)
      return []
    }
  }

  /**
   * Format account display name
   */
  formatAccountDisplay(account: BankAccountInfo): string {
    return `${account.bankName} ****${account.lastFour}`
  }

  /**
   * Get account type display name
   */
  getAccountTypeDisplay(accountType: string): string {
    const typeMap: Record<string, string> = {
      'checking': 'Checking',
      'savings': 'Savings',
      'credit': 'Credit Card',
      'investment': 'Investment',
      'business': 'Business',
      'other': 'Other'
    }
    return typeMap[accountType.toLowerCase()] || accountType
  }

  /**
   * Check if account supports deposits
   */
  supportsDeposits(account: BankAccountInfo): boolean {
    return ['checking', 'savings', 'business'].includes(account.accountType.toLowerCase())
  }

  /**
   * Check if account supports withdrawals
   */
  supportsWithdrawals(account: BankAccountInfo): boolean {
    return ['checking', 'savings', 'business'].includes(account.accountType.toLowerCase())
  }

  /**
   * Get available balance for withdrawals
   */
  getAvailableBalance(account: BankAccountInfo): number {
    // For checking/savings, return full balance
    // For credit cards, return available credit
    if (account.accountType.toLowerCase() === 'credit') {
      // This would need to be implemented based on credit limit
      return 0
    }
    return account.balance || 0
  }
}

// Export singleton instance
export const bankAccountService = new BankAccountService()
export default bankAccountService