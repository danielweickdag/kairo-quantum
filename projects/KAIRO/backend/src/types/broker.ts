export interface BrokerCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken?: string;
  refreshToken?: string;
  accountId?: string;
  environment: 'sandbox' | 'production';
}

export interface BrokerConnectionConfig {
  id: string;
  userId: string;
  brokerType: BrokerType;
  accountName: string;
  isActive: boolean;
  isConnected: boolean;
  lastSyncAt?: Date;
  credentials: BrokerCredentials;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum BrokerType {
  ALPACA = 'alpaca',
  INTERACTIVE_BROKERS = 'interactive_brokers',
  TD_AMERITRADE = 'td_ameritrade',
  TRADIER = 'tradier',
  ROBINHOOD = 'robinhood',
  FIDELITY = 'fidelity',
  SCHWAB = 'schwab',
  ETRADE = 'etrade'
}

export interface BrokerAccount {
  id: string;
  accountNumber: string;
  accountType: 'CASH' | 'MARGIN' | 'IRA' | 'ROTH_IRA';
  status: 'ACTIVE' | 'INACTIVE' | 'RESTRICTED';
  buyingPower: number;
  cashBalance: number;
  portfolioValue: number;
  dayTradingBuyingPower?: number;
  maintenanceMargin?: number;
  currency: string;
}

export interface BrokerPosition {
  symbol: string;
  quantity: number;
  marketValue: number;
  averageCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  side: 'LONG' | 'SHORT';
}

export interface BrokerOrder {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'DAY' | 'GTC' | 'IOC' | 'FOK';
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED';
  filledQuantity: number;
  averageFillPrice?: number;
  submittedAt: Date;
  filledAt?: Date;
}

export interface BrokerTrade {
  id: string;
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  commission: number;
  executedAt: Date;
}

export interface BrokerConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
  accountInfo?: BrokerAccount;
}

export interface BrokerApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface BrokerAuthConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
  authUrl?: string;
  tokenUrl?: string;
}

export interface BrokerCapabilities {
  supportsStocks: boolean;
  supportsOptions: boolean;
  supportsCrypto: boolean;
  supportsForex: boolean;
  supportsFractionalShares: boolean;
  supportsMarginTrading: boolean;
  supportsShortSelling: boolean;
  supportsRealTimeData: boolean;
  supportsHistoricalData: boolean;
  supportsOrderTypes: string[];
  minimumOrderValue?: number;
  maxOrderValue?: number;
  commissionStructure: {
    stocks?: number;
    options?: number;
    crypto?: number;
    forex?: number;
  };
}

export interface BrokerIntegration {
  type: BrokerType;
  name: string;
  description: string;
  logoUrl: string;
  isEnabled: boolean;
  capabilities: BrokerCapabilities;
  authConfig: BrokerAuthConfig;
  apiBaseUrl: string;
  documentationUrl: string;
  supportedRegions: string[];
}

// Error types for broker operations
export class BrokerError extends Error {
  constructor(
    message: string,
    public brokerType: BrokerType,
    public errorCode?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'BrokerError';
  }
}

export class BrokerAuthError extends BrokerError {
  constructor(message: string, brokerType: BrokerType) {
    super(message, brokerType, 'AUTH_ERROR', 401);
    this.name = 'BrokerAuthError';
  }
}

export class BrokerConnectionError extends BrokerError {
  constructor(message: string, brokerType: BrokerType) {
    super(message, brokerType, 'CONNECTION_ERROR', 503);
    this.name = 'BrokerConnectionError';
  }
}

export class BrokerRateLimitError extends BrokerError {
  constructor(message: string, brokerType: BrokerType) {
    super(message, brokerType, 'RATE_LIMIT_ERROR', 429);
    this.name = 'BrokerRateLimitError';
  }
}