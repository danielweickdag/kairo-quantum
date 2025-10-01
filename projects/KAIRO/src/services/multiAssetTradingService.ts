export type AssetType = 'stock' | 'crypto' | 'forex' | 'futures' | 'options' | 'etf' | 'bond';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing-stop' | 'oco' | 'bracket';
export type OrderSide = 'buy' | 'sell';
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok' | 'gtd';
export type OptionType = 'call' | 'put';
export type FuturesType = 'commodity' | 'financial' | 'currency' | 'index';

export interface AssetConfig {
  type: AssetType;
  symbol: string;
  exchange: string;
  tickSize: number;
  minQuantity: number;
  maxQuantity: number;
  tradingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  marginRequirement?: number;
  contractSize?: number; // For futures/options
  expirationDate?: string; // For options/futures
  strikePrice?: number; // For options
  optionType?: OptionType; // For options
  futuresType?: FuturesType; // For futures
  underlyingAsset?: string; // For derivatives
}

export interface TradingOrder {
  id: string;
  symbol: string;
  assetType: AssetType;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  limitPrice?: number;
  trailingAmount?: number;
  timeInForce: TimeInForce;
  goodTillDate?: string;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  parentOrderId?: string; // For bracket orders
  status: 'pending' | 'filled' | 'partial' | 'cancelled' | 'rejected';
  timestamp: string;
  fillPrice?: number;
  fillQuantity?: number;
  commission?: number;
  metadata?: Record<string, any>;
}

export interface MarketData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface Position {
  symbol: string;
  assetType: AssetType;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  dayPnL: number;
  totalReturn: number;
  totalReturnPercent: number;
  costBasis: number;
  lastUpdate: string;
}

export interface TradingAccount {
  accountId: string;
  accountType: 'cash' | 'margin' | 'ira' | 'roth_ira';
  totalValue: number;
  cashBalance: number;
  buyingPower: number;
  dayTradingBuyingPower: number;
  maintenanceMargin: number;
  dayTradeCount: number;
  positions: Position[];
  orders: TradingOrder[];
}

class MultiAssetTradingService {
  private assetConfigs: Map<string, AssetConfig> = new Map();
  private marketDataCache: Map<string, MarketData> = new Map();
  private tradingAccounts: Map<string, TradingAccount> = new Map();
  private orderBook: Map<string, TradingOrder> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeAssetConfigs();
    this.startMarketDataFeed();
  }

  private initializeAssetConfigs() {
    // Stock configurations
    const stockConfig: AssetConfig = {
      type: 'stock',
      symbol: 'AAPL',
      exchange: 'NASDAQ',
      tickSize: 0.01,
      minQuantity: 1,
      maxQuantity: 1000000,
      tradingHours: {
        start: '09:30',
        end: '16:00',
        timezone: 'EST'
      }
    };

    // Crypto configurations
    const cryptoConfig: AssetConfig = {
      type: 'crypto',
      symbol: 'BTC-USD',
      exchange: 'COINBASE',
      tickSize: 0.01,
      minQuantity: 0.001,
      maxQuantity: 1000,
      tradingHours: {
        start: '00:00',
        end: '23:59',
        timezone: 'UTC'
      }
    };

    // Forex configurations
    const forexConfig: AssetConfig = {
      type: 'forex',
      symbol: 'EUR/USD',
      exchange: 'FOREX',
      tickSize: 0.00001,
      minQuantity: 1000,
      maxQuantity: 10000000,
      tradingHours: {
        start: '17:00',
        end: '17:00',
        timezone: 'EST'
      },
      marginRequirement: 0.02
    };

    // Futures configurations
    const futuresConfig: AssetConfig = {
      type: 'futures',
      symbol: 'ES',
      exchange: 'CME',
      tickSize: 0.25,
      minQuantity: 1,
      maxQuantity: 1000,
      tradingHours: {
        start: '18:00',
        end: '17:00',
        timezone: 'EST'
      },
      contractSize: 50,
      futuresType: 'index',
      expirationDate: '2024-03-15',
      marginRequirement: 0.05
    };

    // Options configurations
    const optionsConfig: AssetConfig = {
      type: 'options',
      symbol: 'AAPL240315C00150000',
      exchange: 'CBOE',
      tickSize: 0.01,
      minQuantity: 1,
      maxQuantity: 10000,
      tradingHours: {
        start: '09:30',
        end: '16:00',
        timezone: 'EST'
      },
      contractSize: 100,
      strikePrice: 150,
      optionType: 'call',
      expirationDate: '2024-03-15',
      underlyingAsset: 'AAPL'
    };

    this.assetConfigs.set('AAPL', stockConfig);
    this.assetConfigs.set('BTC-USD', cryptoConfig);
    this.assetConfigs.set('EUR/USD', forexConfig);
    this.assetConfigs.set('ES', futuresConfig);
    this.assetConfigs.set('AAPL240315C00150000', optionsConfig);
  }

  private startMarketDataFeed() {
    // Simulate real-time market data updates
    setInterval(() => {
      this.updateMarketData();
    }, 1000);
  }

  private updateMarketData() {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD', 'EUR/USD', 'ES'];
    
    symbols.forEach(symbol => {
      const currentData = this.marketDataCache.get(symbol);
      const basePrice = currentData?.price || this.getBasePrice(symbol);
      const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
      const newPrice = Math.max(0.01, basePrice + change);
      
      const marketData: MarketData = {
        symbol,
        price: newPrice,
        bid: newPrice - 0.01,
        ask: newPrice + 0.01,
        volume: Math.floor(Math.random() * 1000000),
        change: newPrice - (currentData?.price || basePrice),
        changePercent: ((newPrice - (currentData?.price || basePrice)) / basePrice) * 100,
        high: Math.max(newPrice, currentData?.high || newPrice),
        low: Math.min(newPrice, currentData?.low || newPrice),
        open: currentData?.open || newPrice,
        previousClose: currentData?.price || basePrice,
        timestamp: new Date().toISOString()
      };
      
      this.marketDataCache.set(symbol, marketData);
      this.emit('marketData', { symbol, data: marketData });
    });
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'AAPL': 150.25,
      'TSLA': 242.15,
      'NVDA': 435.60,
      'BTC-USD': 43250.00,
      'ETH-USD': 2650.00,
      'EUR/USD': 1.0875,
      'ES': 4750.25
    };
    return basePrices[symbol] || 100;
  }

  // Public API Methods
  public getAssetConfig(symbol: string): AssetConfig | undefined {
    return this.assetConfigs.get(symbol);
  }

  public getMarketData(symbol: string): MarketData | undefined {
    return this.marketDataCache.get(symbol);
  }

  public getAllMarketData(): MarketData[] {
    return Array.from(this.marketDataCache.values());
  }

  public async placeOrder(order: Omit<TradingOrder, 'id' | 'status' | 'timestamp'>): Promise<TradingOrder> {
    const orderId = this.generateOrderId();
    const timestamp = new Date().toISOString();
    
    const fullOrder: TradingOrder = {
      ...order,
      id: orderId,
      status: 'pending',
      timestamp
    };

    // Validate order
    const validation = this.validateOrder(fullOrder);
    if (!validation.isValid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    // Add to order book
    this.orderBook.set(orderId, fullOrder);
    
    // Simulate order processing
    setTimeout(() => {
      this.processOrder(orderId);
    }, Math.random() * 2000 + 500); // Random delay between 0.5-2.5 seconds

    this.emit('orderPlaced', fullOrder);
    return fullOrder;
  }

  public async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orderBook.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'filled') {
      throw new Error('Cannot cancel filled order');
    }

    order.status = 'cancelled';
    this.emit('orderCancelled', order);
    return true;
  }

  public getOrder(orderId: string): TradingOrder | undefined {
    return this.orderBook.get(orderId);
  }

  public getOrders(accountId?: string): TradingOrder[] {
    const orders = Array.from(this.orderBook.values());
    return accountId ? orders.filter(order => order.metadata?.accountId === accountId) : orders;
  }

  public getPositions(accountId: string): Position[] {
    const account = this.tradingAccounts.get(accountId);
    return account?.positions || [];
  }

  public getTradingAccount(accountId: string): TradingAccount | undefined {
    return this.tradingAccounts.get(accountId);
  }

  private validateOrder(order: TradingOrder): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = this.assetConfigs.get(order.symbol);
    
    if (!config) {
      errors.push(`Asset configuration not found for ${order.symbol}`);
      return { isValid: false, errors };
    }

    // Validate quantity
    if (order.quantity < config.minQuantity) {
      errors.push(`Quantity ${order.quantity} is below minimum ${config.minQuantity}`);
    }
    if (order.quantity > config.maxQuantity) {
      errors.push(`Quantity ${order.quantity} exceeds maximum ${config.maxQuantity}`);
    }

    // Validate price precision
    if (order.price && order.price % config.tickSize !== 0) {
      errors.push(`Price must be in increments of ${config.tickSize}`);
    }

    // Validate trading hours
    const now = new Date();
    const isMarketOpen = this.isMarketOpen(config, now);
    if (!isMarketOpen && order.type === 'market') {
      errors.push('Market orders can only be placed during trading hours');
    }

    return { isValid: errors.length === 0, errors };
  }

  private isMarketOpen(config: AssetConfig, date: Date): boolean {
    // Simplified market hours check
    if (config.type === 'crypto') return true; // Crypto markets are always open
    
    const hour = date.getHours();
    const startHour = parseInt(config.tradingHours.start.split(':')[0]);
    const endHour = parseInt(config.tradingHours.end.split(':')[0]);
    
    return hour >= startHour && hour < endHour;
  }

  private processOrder(orderId: string): void {
    const order = this.orderBook.get(orderId);
    if (!order || order.status !== 'pending') return;

    const marketData = this.marketDataCache.get(order.symbol);
    if (!marketData) {
      order.status = 'rejected';
      this.emit('orderRejected', order);
      return;
    }

    // Simulate order execution
    const executionPrice = this.calculateExecutionPrice(order, marketData);
    if (executionPrice) {
      order.status = 'filled';
      order.fillPrice = executionPrice;
      order.fillQuantity = order.quantity;
      order.commission = this.calculateCommission(order);
      
      this.updatePosition(order);
      this.emit('orderFilled', order);
    } else {
      // Order remains pending (e.g., limit order not triggered)
    }
  }

  private calculateExecutionPrice(order: TradingOrder, marketData: MarketData): number | null {
    switch (order.type) {
      case 'market':
        return order.side === 'buy' ? marketData.ask : marketData.bid;
      
      case 'limit':
        if (!order.price) return null;
        if (order.side === 'buy' && marketData.ask <= order.price) {
          return Math.min(order.price, marketData.ask);
        }
        if (order.side === 'sell' && marketData.bid >= order.price) {
          return Math.max(order.price, marketData.bid);
        }
        return null;
      
      case 'stop':
        if (!order.stopPrice) return null;
        if (order.side === 'buy' && marketData.price >= order.stopPrice) {
          return marketData.ask;
        }
        if (order.side === 'sell' && marketData.price <= order.stopPrice) {
          return marketData.bid;
        }
        return null;
      
      default:
        return null;
    }
  }

  private calculateCommission(order: TradingOrder): number {
    const config = this.assetConfigs.get(order.symbol);
    if (!config) return 0;

    switch (config.type) {
      case 'stock':
        return Math.max(0.65, order.quantity * 0.005); // $0.65 minimum or $0.005 per share
      case 'crypto':
        return (order.fillPrice || 0) * order.quantity * 0.001; // 0.1% fee
      case 'forex':
        return (order.fillPrice || 0) * order.quantity * 0.00002; // 2 pips spread
      case 'futures':
        return 2.50; // Flat fee per contract
      case 'options':
        return order.quantity * 0.65; // $0.65 per contract
      default:
        return 1.00;
    }
  }

  private updatePosition(order: TradingOrder): void {
    // Position management logic would go here
    // This is a simplified version
    const accountId = order.metadata?.accountId || 'default';
    let account = this.tradingAccounts.get(accountId);
    
    if (!account) {
      account = this.createDefaultAccount(accountId);
      this.tradingAccounts.set(accountId, account);
    }

    // Update position logic here...
  }

  private createDefaultAccount(accountId: string): TradingAccount {
    return {
      accountId,
      accountType: 'margin',
      totalValue: 100000,
      cashBalance: 50000,
      buyingPower: 100000,
      dayTradingBuyingPower: 200000,
      maintenanceMargin: 0,
      dayTradeCount: 0,
      positions: [],
      orders: []
    };
  }

  private generateOrderId(): string {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Asset-specific methods
  public getOptionsChain(underlyingSymbol: string, expirationDate?: string): AssetConfig[] {
    // Return options chain for the underlying asset
    return Array.from(this.assetConfigs.values())
      .filter(config => 
        config.type === 'options' && 
        config.underlyingAsset === underlyingSymbol &&
        (!expirationDate || config.expirationDate === expirationDate)
      );
  }

  public getFuturesContracts(futuresType?: FuturesType): AssetConfig[] {
    return Array.from(this.assetConfigs.values())
      .filter(config => 
        config.type === 'futures' &&
        (!futuresType || config.futuresType === futuresType)
      );
  }

  public getCryptoPairs(): AssetConfig[] {
    return Array.from(this.assetConfigs.values())
      .filter(config => config.type === 'crypto');
  }

  public getForexPairs(): AssetConfig[] {
    return Array.from(this.assetConfigs.values())
      .filter(config => config.type === 'forex');
  }
}

export default MultiAssetTradingService;
export { MultiAssetTradingService };