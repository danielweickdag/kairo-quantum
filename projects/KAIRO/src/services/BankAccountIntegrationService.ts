import { logger } from '../lib/logger';

export interface BankAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit';
  accountSubtype: string;
  mask: string;
  isActive: boolean;
  isVerified: boolean;
  balance?: {
    available: number;
    current: number;
    limit?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaidLinkResult {
  publicToken: string;
  metadata: {
    institution: {
      name: string;
      institution_id: string;
    };
    accounts: Array<{
      id: string;
      name: string;
      type: string;
      subtype: string;
      mask: string;
    }>;
  };
}

export interface TransactionRequest {
  accountId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description?: string;
  scheduledDate?: Date;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
}

export interface TransactionResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  fee?: number;
  estimatedCompletionDate?: Date;
  errorMessage?: string;
}

class BankAccountIntegrationService {
  private plaidClientId: string;
  private plaidSecret: string;
  private plaidEnvironment: 'sandbox' | 'development' | 'production';
  private baseUrl: string;

  constructor() {
    this.plaidClientId = process.env.NEXT_PUBLIC_PLAID_CLIENT_ID || '';
    this.plaidSecret = process.env.PLAID_SECRET || '';
    this.plaidEnvironment = (process.env.PLAID_ENV as any) || 'sandbox';
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
  }

  /**
   * Initialize Plaid Link for bank account connection
   */
  async initializePlaidLink(): Promise<{ linkToken: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/plaid/create-link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          userId: this.getCurrentUserId(),
          clientName: 'KAIRO Trading Platform'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Plaid link token');
      }

      const data = await response.json();
      return { linkToken: data.link_token };
    } catch (error) {
      logger.error('Error initializing Plaid Link:', error);
      throw new Error('Failed to initialize bank account connection');
    }
  }

  /**
   * Exchange public token for access token and save bank account
   */
  async connectBankAccount(publicToken: string, metadata: PlaidLinkResult['metadata']): Promise<BankAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/plaid/exchange-public-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          publicToken,
          metadata,
          userId: this.getCurrentUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect bank account');
      }

      const data = await response.json();
      return data.accounts;
    } catch (error) {
      logger.error('Error connecting bank account:', error);
      throw new Error('Failed to connect bank account');
    }
  }

  /**
   * Get all connected bank accounts for the user
   */
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/bank-accounts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bank accounts');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error fetching bank accounts:', error);
      return [];
    }
  }

  /**
   * Get account balance for a specific bank account
   */
  async getAccountBalance(accountId: string): Promise<BankAccount['balance']> {
    try {
      const response = await fetch(`${this.baseUrl}/api/bank-accounts/${accountId}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account balance');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error fetching account balance:', error);
      return undefined;
    }
  }

  /**
   * Initiate a deposit from bank account to trading account
   */
  async initiateDeposit(request: TransactionRequest): Promise<TransactionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...request,
          userId: this.getCurrentUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate deposit');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error initiating deposit:', error);
      throw new Error('Failed to initiate deposit');
    }
  }

  /**
   * Initiate a withdrawal from trading account to bank account
   */
  async initiateWithdrawal(request: TransactionRequest): Promise<TransactionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions/withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...request,
          userId: this.getCurrentUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate withdrawal');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error initiating withdrawal:', error);
      throw new Error('Failed to initiate withdrawal');
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(limit: number = 50): Promise<TransactionResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/transactions?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error fetching transaction history:', error);
      return [];
    }
  }

  /**
   * Remove a connected bank account
   */
  async removeBankAccount(accountId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/bank-accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('Error removing bank account:', error);
      return false;
    }
  }

  /**
   * Verify bank account using micro-deposits
   */
  async verifyBankAccount(accountId: string, amounts: number[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/bank-accounts/${accountId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ amounts })
      });

      return response.ok;
    } catch (error) {
      logger.error('Error verifying bank account:', error);
      return false;
    }
  }

  /**
   * Get current user's authentication token
   */
  private getAuthToken(): string {
    // This would typically come from your auth context or local storage
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string {
    // This would typically come from your auth context
    return localStorage.getItem('userId') || '';
  }
}

export const bankAccountIntegrationService = new BankAccountIntegrationService();
export default BankAccountIntegrationService;