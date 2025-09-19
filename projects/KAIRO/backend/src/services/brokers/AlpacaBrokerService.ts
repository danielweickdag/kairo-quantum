import axios, { AxiosInstance } from 'axios';
import { BaseBrokerService } from './BaseBrokerService';
import {
  BrokerType,
  BrokerCredentials,
  BrokerAccount,
  BrokerPosition,
  BrokerOrder,
  BrokerTrade,
  BrokerApiResponse,
  BrokerCapabilities,
  BrokerError,
  BrokerAuthError,
  BrokerConnectionError
} from '../../types/broker';

interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  buying_power: string;
  regt_buying_power: string;
  daytrading_buying_power: string;
  cash: string;
  portfolio_value: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
  trade_suspended_by_user: boolean;
  multiplier: string;
  shorting_enabled: boolean;
  equity: string;
  last_equity: string;
  long_market_value: string;
  short_market_value: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  sma: string;
  daytrade_count: number;
}

interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  qty: string;
  avg_entry_price: string;
  side: string;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

interface AlpacaOrder {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at?: string;
  expired_at?: string;
  canceled_at?: string;
  failed_at?: string;
  replaced_at?: string;
  replaced_by?: string;
  replaces?: string;
  asset_id: string;
  symbol: string;
  asset_class: string;
  notional?: string;
  qty: string;
  filled_qty: string;
  filled_avg_price?: string;
  order_class: string;
  order_type: string;
  type: string;
  side: string;
  time_in_force: string;
  limit_price?: string;
  stop_price?: string;
  status: string;
  extended_hours: boolean;
  legs?: any[];
  trail_percent?: string;
  trail_price?: string;
  hwm?: string;
}

interface AlpacaTrade {
  id: string;
  order_id: string;
  symbol: string;
  side: string;
  qty: string;
  price: string;
  timestamp: string;
}

export class AlpacaBrokerService extends BaseBrokerService {
  private apiClient: AxiosInstance;
  private baseUrl: string;

  constructor(credentials: BrokerCredentials) {
    super(credentials, BrokerType.ALPACA);
    
    this.baseUrl = credentials.environment === 'production' 
      ? 'https://api.alpaca.markets'
      : 'https://paper-api.alpaca.markets';
    
    this.apiClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        ...this.getBaseHeaders(),
        'APCA-API-KEY-ID': credentials.apiKey,
        'APCA-API-SECRET-KEY': credentials.apiSecret
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          throw new BrokerAuthError('Invalid API credentials', BrokerType.ALPACA);
        }
        if (error.response?.status === 429) {
          throw new BrokerError('Rate limit exceeded', BrokerType.ALPACA, 'RATE_LIMIT', 429);
        }
        if (!error.response) {
          throw new BrokerConnectionError('Network error', BrokerType.ALPACA);
        }
        throw error;
      }
    );
  }

  async testConnection(): Promise<BrokerApiResponse<boolean>> {
    try {
      await this.apiClient.get('/v2/account');
      return { success: true, data: true };
    } catch (error) {
      return this.handleApiError(error, 'test connection');
    }
  }

  async getAccount(): Promise<BrokerApiResponse<BrokerAccount>> {
    try {
      const response = await this.apiClient.get<AlpacaAccount>('/v2/account');
      const alpacaAccount = response.data;

      const account: BrokerAccount = {
        id: alpacaAccount.id,
        accountNumber: alpacaAccount.account_number,
        accountType: alpacaAccount.pattern_day_trader ? 'MARGIN' : 'CASH',
        status: this.normalizeAccountStatus(alpacaAccount.status),
        buyingPower: parseFloat(alpacaAccount.buying_power),
        cashBalance: parseFloat(alpacaAccount.cash),
        portfolioValue: parseFloat(alpacaAccount.portfolio_value),
        dayTradingBuyingPower: parseFloat(alpacaAccount.daytrading_buying_power),
        maintenanceMargin: parseFloat(alpacaAccount.maintenance_margin || '0'),
        currency: alpacaAccount.currency
      };

      return { success: true, data: account };
    } catch (error) {
      return this.handleApiError(error, 'get account');
    }
  }

  async getPositions(): Promise<BrokerApiResponse<BrokerPosition[]>> {
    try {
      const response = await this.apiClient.get<AlpacaPosition[]>('/v2/positions');
      
      const positions: BrokerPosition[] = response.data.map(pos => ({
        symbol: pos.symbol,
        quantity: parseFloat(pos.qty),
        marketValue: parseFloat(pos.market_value),
        averageCost: parseFloat(pos.avg_entry_price),
        unrealizedPnL: parseFloat(pos.unrealized_pl),
        unrealizedPnLPercent: parseFloat(pos.unrealized_plpc) * 100,
        side: pos.side === 'long' ? 'LONG' : 'SHORT'
      }));

      return { success: true, data: positions };
    } catch (error) {
      return this.handleApiError(error, 'get positions');
    }
  }

  async getOrders(): Promise<BrokerApiResponse<BrokerOrder[]>> {
    try {
      const response = await this.apiClient.get<AlpacaOrder[]>('/v2/orders', {
        params: { status: 'all', limit: 100 }
      });
      
      const orders: BrokerOrder[] = response.data.map(order => ({
        id: order.id,
        symbol: order.symbol,
        side: this.normalizeSide(order.side),
        orderType: this.normalizeOrderType(order.order_type),
        quantity: parseFloat(order.qty),
        price: order.limit_price ? parseFloat(order.limit_price) : undefined,
        stopPrice: order.stop_price ? parseFloat(order.stop_price) : undefined,
        timeInForce: this.normalizeTimeInForce(order.time_in_force),
        status: this.normalizeOrderStatus(order.status) as 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED',
        filledQuantity: parseFloat(order.filled_qty),
        averageFillPrice: order.filled_avg_price ? parseFloat(order.filled_avg_price) : undefined,
        submittedAt: new Date(order.submitted_at),
        filledAt: order.filled_at ? new Date(order.filled_at) : undefined
      }));

      return { success: true, data: orders };
    } catch (error) {
      return this.handleApiError(error, 'get orders');
    }
  }

  async getTrades(startDate?: Date, endDate?: Date): Promise<BrokerApiResponse<BrokerTrade[]>> {
    try {
      const params: any = { limit: 100 };
      if (startDate) params.after = startDate.toISOString();
      if (endDate) params.until = endDate.toISOString();

      const response = await this.apiClient.get<AlpacaTrade[]>('/v2/account/activities/FILL', {
        params
      });
      
      const trades: BrokerTrade[] = response.data.map(trade => ({
        id: trade.id,
        orderId: trade.order_id,
        symbol: trade.symbol,
        side: this.normalizeSide(trade.side),
        quantity: parseFloat(trade.qty),
        price: parseFloat(trade.price),
        commission: 0, // Alpaca is commission-free
        executedAt: new Date(trade.timestamp)
      }));

      return { success: true, data: trades };
    } catch (error) {
      return this.handleApiError(error, 'get trades');
    }
  }

  async placeOrder(order: Partial<BrokerOrder>): Promise<BrokerApiResponse<BrokerOrder>> {
    try {
      const validationErrors = this.validateOrder(order);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Order validation failed: ${validationErrors.join(', ')}`
        };
      }

      const alpacaOrder = {
        symbol: order.symbol!,
        qty: order.quantity!.toString(),
        side: order.side!.toLowerCase(),
        type: order.orderType!.toLowerCase(),
        time_in_force: order.timeInForce || 'DAY',
        ...(order.price && { limit_price: order.price.toString() }),
        ...(order.stopPrice && { stop_price: order.stopPrice.toString() })
      };

      const response = await this.apiClient.post<AlpacaOrder>('/v2/orders', alpacaOrder);
      const createdOrder = response.data;

      const brokerOrder: BrokerOrder = {
        id: createdOrder.id,
        symbol: createdOrder.symbol,
        side: this.normalizeSide(createdOrder.side),
        orderType: this.normalizeOrderType(createdOrder.order_type),
        quantity: parseFloat(createdOrder.qty),
        price: createdOrder.limit_price ? parseFloat(createdOrder.limit_price) : undefined,
        stopPrice: createdOrder.stop_price ? parseFloat(createdOrder.stop_price) : undefined,
        timeInForce: this.normalizeTimeInForce(createdOrder.time_in_force),
        status: this.normalizeOrderStatus(createdOrder.status) as 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'REJECTED',
        filledQuantity: parseFloat(createdOrder.filled_qty),
        averageFillPrice: createdOrder.filled_avg_price ? parseFloat(createdOrder.filled_avg_price) : undefined,
        submittedAt: new Date(createdOrder.submitted_at),
        filledAt: createdOrder.filled_at ? new Date(createdOrder.filled_at) : undefined
      };

      return { success: true, data: brokerOrder };
    } catch (error) {
      return this.handleApiError(error, 'place order');
    }
  }

  async cancelOrder(orderId: string): Promise<BrokerApiResponse<boolean>> {
    try {
      await this.apiClient.delete(`/v2/orders/${orderId}`);
      return { success: true, data: true };
    } catch (error) {
      return this.handleApiError(error, 'cancel order');
    }
  }

  getCapabilities(): BrokerCapabilities {
    return {
      supportsStocks: true,
      supportsOptions: false, // Alpaca doesn't support options yet
      supportsCrypto: true,
      supportsForex: false,
      supportsFractionalShares: true,
      supportsMarginTrading: true,
      supportsShortSelling: true,
      supportsRealTimeData: true,
      supportsHistoricalData: true,
      supportsOrderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
      minimumOrderValue: 1,
      commissionStructure: {
        stocks: 0,
        crypto: 0
      }
    };
  }

  private normalizeAccountStatus(status: string): 'ACTIVE' | 'INACTIVE' | 'RESTRICTED' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'ACTIVE';
      case 'account_updated':
        return 'ACTIVE';
      case 'approval_pending':
      case 'submission_failed':
      case 'submitted':
        return 'INACTIVE';
      case 'inactive':
      case 'account_closed':
        return 'INACTIVE';
      default:
        return 'RESTRICTED';
    }
  }

  private normalizeTimeInForce(timeInForce: string): 'DAY' | 'GTC' | 'IOC' | 'FOK' {
    const tif = timeInForce.toLowerCase();
    switch (tif) {
      case 'day':
        return 'DAY';
      case 'gtc':
      case 'good_till_canceled':
        return 'GTC';
      case 'ioc':
      case 'immediate_or_cancel':
        return 'IOC';
      case 'fok':
      case 'fill_or_kill':
        return 'FOK';
      default:
        return 'DAY';
    }
  }
}