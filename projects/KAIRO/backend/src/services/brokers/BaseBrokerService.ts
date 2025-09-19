import { 
  BrokerType, 
  BrokerCredentials, 
  BrokerAccount, 
  BrokerPosition, 
  BrokerOrder, 
  BrokerTrade, 
  BrokerConnectionStatus,
  BrokerApiResponse,
  BrokerCapabilities
} from '../../types/broker';

export abstract class BaseBrokerService {
  protected credentials: BrokerCredentials;
  protected brokerType: BrokerType;

  constructor(credentials: BrokerCredentials, brokerType: BrokerType) {
    this.credentials = credentials;
    this.brokerType = brokerType;
  }

  // Abstract methods that each broker must implement
  abstract testConnection(): Promise<BrokerApiResponse<boolean>>;
  abstract getAccount(): Promise<BrokerApiResponse<BrokerAccount>>;
  abstract getPositions(): Promise<BrokerApiResponse<BrokerPosition[]>>;
  abstract getOrders(): Promise<BrokerApiResponse<BrokerOrder[]>>;
  abstract getTrades(startDate?: Date, endDate?: Date): Promise<BrokerApiResponse<BrokerTrade[]>>;
  abstract placeOrder(order: Partial<BrokerOrder>): Promise<BrokerApiResponse<BrokerOrder>>;
  abstract cancelOrder(orderId: string): Promise<BrokerApiResponse<boolean>>;
  abstract getCapabilities(): BrokerCapabilities;

  // Common utility methods
  protected handleApiError(error: any, operation: string): BrokerApiResponse {
    console.error(`${this.brokerType} API Error in ${operation}:`, error);
    
    return {
      success: false,
      error: error.message || `Failed to ${operation}`,
      statusCode: error.status || error.statusCode || 500
    };
  }

  protected validateCredentials(): boolean {
    return !!(this.credentials.apiKey && this.credentials.apiSecret);
  }

  protected getBaseHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'KAIRO-Trading-Platform/1.0'
    };
  }

  // Common method to check connection status
  async getConnectionStatus(): Promise<BrokerConnectionStatus> {
    try {
      const testResult = await this.testConnection();
      const accountResult = testResult.success ? await this.getAccount() : null;
      
      return {
        isConnected: testResult.success,
        lastChecked: new Date(),
        error: testResult.error,
        accountInfo: accountResult?.data
      };
    } catch (error) {
      return {
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper method to format currency values
  protected formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Helper method to calculate percentage change
  protected calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Helper method to validate order parameters
  protected validateOrder(order: Partial<BrokerOrder>): string[] {
    const errors: string[] = [];
    
    if (!order.symbol) errors.push('Symbol is required');
    if (!order.side) errors.push('Side (BUY/SELL) is required');
    if (!order.quantity || order.quantity <= 0) errors.push('Quantity must be greater than 0');
    if (order.orderType === 'LIMIT' && (!order.price || order.price <= 0)) {
      errors.push('Price is required for limit orders');
    }
    if (order.orderType === 'STOP' && (!order.stopPrice || order.stopPrice <= 0)) {
      errors.push('Stop price is required for stop orders');
    }
    
    return errors;
  }

  // Helper method to normalize symbol format
  protected normalizeSymbol(symbol: string): string {
    return symbol.toUpperCase().trim();
  }

  // Helper method to convert broker-specific order status to our standard format
  protected normalizeOrderStatus(brokerStatus: string): string {
    const statusMap: Record<string, string> = {
      'new': 'NEW',
      'pending': 'NEW',
      'open': 'NEW',
      'partially_filled': 'PARTIALLY_FILLED',
      'partial': 'PARTIALLY_FILLED',
      'filled': 'FILLED',
      'executed': 'FILLED',
      'cancelled': 'CANCELED',
      'canceled': 'CANCELED',
      'rejected': 'REJECTED',
      'expired': 'CANCELED'
    };
    
    return statusMap[brokerStatus.toLowerCase()] || brokerStatus.toUpperCase();
  }

  // Helper method to convert broker-specific side to our standard format
  protected normalizeSide(brokerSide: string): 'BUY' | 'SELL' {
    const side = brokerSide.toLowerCase();
    if (side.includes('buy') || side === 'long') return 'BUY';
    if (side.includes('sell') || side === 'short') return 'SELL';
    return brokerSide.toUpperCase() as 'BUY' | 'SELL';
  }

  // Helper method to convert broker-specific order type to our standard format
  protected normalizeOrderType(brokerOrderType: string): 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' {
    const orderType = brokerOrderType.toLowerCase().replace(/[_-]/g, '');
    
    if (orderType.includes('market')) return 'MARKET';
    if (orderType.includes('limit') && orderType.includes('stop')) return 'STOP_LIMIT';
    if (orderType.includes('stop')) return 'STOP';
    if (orderType.includes('limit')) return 'LIMIT';
    
    return brokerOrderType.toUpperCase() as 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  }

  // Helper method to add retry logic for API calls
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}