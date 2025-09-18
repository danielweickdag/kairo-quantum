import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import { WebSocketService } from './websocketService';

// Order Types
export interface Order {
  id: string;
  userId: string;
  portfolioId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  status: 'pending' | 'submitted' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
  filledQuantity: number;
  averagePrice?: number;
  createdAt: Date;
  updatedAt: Date;
  brokerOrderId?: string;
  fees?: number;
  commission?: number;
}

export interface Fill {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  fees: number;
  commission: number;
  brokerTradeId?: string;
}

export interface Position {
  userId: string;
  portfolioId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  lastUpdated: Date;
}

export interface BrokerConfig {
  name: string;
  apiKey: string;
  apiSecret: string;
  sandbox: boolean;
  baseUrl: string;
}

export interface RiskLimits {
  maxOrderValue: number;
  maxDailyLoss: number;
  maxPositionSize: number;
  allowedSymbols: string[];
  blockedSymbols: string[];
}

class OrderExecutionService extends EventEmitter {
  private orders: Map<string, Order> = new Map();
  private positions: Map<string, Position> = new Map();
  private fills: Map<string, Fill[]> = new Map();
  private brokerConfigs: Map<string, BrokerConfig> = new Map();
  private riskLimits: Map<string, RiskLimits> = new Map();
  private websocketService: WebSocketService;
  private isLiveTradingEnabled = false;
  private orderIdCounter = 1;

  constructor(websocketService: WebSocketService) {
    super();
    this.websocketService = websocketService;
    this.setupEventHandlers();
  }

  // Live Trading Control
  enableLiveTrading(): void {
    this.isLiveTradingEnabled = true;
    this.websocketService.enableLiveTrading();
    logger.info('Live trading enabled in OrderExecutionService');
    this.emit('liveTradingEnabled');
  }

  disableLiveTrading(): void {
    this.isLiveTradingEnabled = false;
    this.websocketService.disableLiveTrading();
    logger.info('Live trading disabled in OrderExecutionService');
    this.emit('liveTradingDisabled');
  }

  isLiveTradingActive(): boolean {
    return this.isLiveTradingEnabled;
  }

  // Broker Configuration
  setBrokerConfig(userId: string, config: BrokerConfig): void {
    this.brokerConfigs.set(userId, config);
    logger.info(`Broker config set for user ${userId}: ${config.name}`);
  }

  getBrokerConfig(userId: string): BrokerConfig | null {
    return this.brokerConfigs.get(userId) || null;
  }

  // Risk Management
  setRiskLimits(userId: string, limits: RiskLimits): void {
    this.riskLimits.set(userId, limits);
    logger.info(`Risk limits set for user ${userId}`);
  }

  getRiskLimits(userId: string): RiskLimits | null {
    return this.riskLimits.get(userId) || null;
  }

  // Order Management
  async submitOrder(orderRequest: Omit<Order, 'id' | 'status' | 'filledQuantity' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      // Validate live trading is enabled
      if (!this.isLiveTradingEnabled) {
        throw new Error('Live trading is not enabled');
      }

      // Generate order ID
      const orderId = `ORD_${Date.now()}_${this.orderIdCounter++}`;

      // Create order object
      const order: Order = {
        ...orderRequest,
        id: orderId,
        status: 'pending',
        filledQuantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Validate order
      await this.validateOrder(order);

      // Store order
      this.orders.set(orderId, order);

      // Submit to broker (simulated for now)
      await this.submitToBroker(order);

      // Update order status
      order.status = 'submitted';
      order.updatedAt = new Date();
      this.orders.set(orderId, order);

      // Broadcast order update
      this.websocketService.broadcastTradeExecution(order.userId, {
        type: 'order_submitted',
        order
      });

      logger.info(`Order submitted: ${orderId} for user ${order.userId}`);
      this.emit('orderSubmitted', order);

      // Simulate order execution (in real implementation, this would come from broker)
      setTimeout(() => {
        this.simulateOrderExecution(order);
      }, Math.random() * 2000 + 500); // 0.5-2.5 seconds

      return order;
    } catch (error) {
      logger.error('Error submitting order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<void> {
    try {
      const order = this.orders.get(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.userId !== userId) {
        throw new Error('Unauthorized to cancel this order');
      }

      if (order.status === 'filled' || order.status === 'cancelled') {
        throw new Error('Cannot cancel order in current status');
      }

      // Cancel with broker (simulated)
      await this.cancelWithBroker(order);

      // Update order status
      order.status = 'cancelled';
      order.updatedAt = new Date();
      this.orders.set(orderId, order);

      // Broadcast order update
      this.websocketService.broadcastTradeExecution(userId, {
        type: 'order_cancelled',
        order
      });

      logger.info(`Order cancelled: ${orderId}`);
      this.emit('orderCancelled', order);
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Get orders for user
  getUserOrders(userId: string): Order[] {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  // Get specific order
  getOrder(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  // Position Management
  getUserPositions(userId: string): Position[] {
    return Array.from(this.positions.values()).filter(pos => pos.userId === userId);
  }

  getPosition(userId: string, symbol: string): Position | null {
    const key = `${userId}:${symbol}`;
    return this.positions.get(key) || null;
  }

  // Order Validation
  private async validateOrder(order: Order): Promise<void> {
    // Check risk limits
    const riskLimits = this.getRiskLimits(order.userId);
    if (riskLimits) {
      // Check if symbol is allowed
      if (riskLimits.blockedSymbols.includes(order.symbol)) {
        throw new Error(`Symbol ${order.symbol} is blocked`);
      }

      if (riskLimits.allowedSymbols.length > 0 && !riskLimits.allowedSymbols.includes(order.symbol)) {
        throw new Error(`Symbol ${order.symbol} is not in allowed list`);
      }

      // Check order value
      const currentPrice = this.websocketService.getCurrentPrice(order.symbol)?.price || 0;
      const orderValue = order.quantity * (order.price || currentPrice);
      
      if (orderValue > riskLimits.maxOrderValue) {
        throw new Error(`Order value ${orderValue} exceeds maximum allowed ${riskLimits.maxOrderValue}`);
      }

      // Check position size
      const currentPosition = this.getPosition(order.userId, order.symbol);
      const newQuantity = order.side === 'buy' 
        ? (currentPosition?.quantity || 0) + order.quantity
        : (currentPosition?.quantity || 0) - order.quantity;
      
      if (Math.abs(newQuantity) > riskLimits.maxPositionSize) {
        throw new Error(`Position size would exceed maximum allowed ${riskLimits.maxPositionSize}`);
      }
    }

    // Validate order parameters
    if (order.quantity <= 0) {
      throw new Error('Order quantity must be positive');
    }

    if (order.type === 'limit' && !order.price) {
      throw new Error('Limit orders must have a price');
    }

    if ((order.type === 'stop' || order.type === 'stop_limit') && !order.stopPrice) {
      throw new Error('Stop orders must have a stop price');
    }
  }

  // Broker Integration (Simulated)
  private async submitToBroker(order: Order): Promise<void> {
    // In real implementation, this would integrate with actual broker APIs
    // For now, we'll simulate the submission
    
    const brokerConfig = this.getBrokerConfig(order.userId);
    if (!brokerConfig) {
      throw new Error('No broker configuration found for user');
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate broker order ID
    order.brokerOrderId = `BRK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info(`Order submitted to broker ${brokerConfig.name}: ${order.brokerOrderId}`);
  }

  private async cancelWithBroker(order: Order): Promise<void> {
    // Simulate broker cancellation
    await new Promise(resolve => setTimeout(resolve, 50));
    logger.info(`Order cancelled with broker: ${order.brokerOrderId}`);
  }

  // Order Execution Simulation
  private async simulateOrderExecution(order: Order): Promise<void> {
    try {
      const currentPrice = this.websocketService.getCurrentPrice(order.symbol)?.price;
      if (!currentPrice) {
        logger.error(`No current price available for ${order.symbol}`);
        return;
      }

      let executionPrice = currentPrice;
      
      // Determine execution price based on order type
      if (order.type === 'limit') {
        if (order.side === 'buy' && currentPrice > order.price!) {
          return; // Limit buy not triggered
        }
        if (order.side === 'sell' && currentPrice < order.price!) {
          return; // Limit sell not triggered
        }
        executionPrice = order.price!;
      }

      // Simulate partial or full fill
      const fillQuantity = Math.random() > 0.8 ? 
        Math.floor(order.quantity * (0.5 + Math.random() * 0.5)) : // Partial fill
        order.quantity; // Full fill

      // Create fill
      const fill: Fill = {
        id: `FILL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        symbol: order.symbol,
        side: order.side,
        quantity: fillQuantity,
        price: executionPrice,
        timestamp: new Date(),
        fees: fillQuantity * executionPrice * 0.001, // 0.1% fee
        commission: Math.max(1, fillQuantity * 0.01), // $0.01 per share, min $1
        brokerTradeId: `TRD_${Date.now()}`
      };

      // Store fill
      if (!this.fills.has(order.id)) {
        this.fills.set(order.id, []);
      }
      this.fills.get(order.id)!.push(fill);

      // Update order
      order.filledQuantity += fillQuantity;
      order.averagePrice = this.calculateAveragePrice(order.id);
      order.status = order.filledQuantity >= order.quantity ? 'filled' : 'partially_filled';
      order.updatedAt = new Date();
      this.orders.set(order.id, order);

      // Update position
      await this.updatePosition(order, fill);

      // Broadcast execution
      this.websocketService.broadcastTradeExecution(order.userId, {
        type: 'order_filled',
        order,
        fill
      });

      logger.info(`Order executed: ${order.id}, filled ${fillQuantity} at ${executionPrice}`);
      this.emit('orderFilled', { order, fill });

    } catch (error) {
      logger.error('Error simulating order execution:', error);
    }
  }

  // Position Updates
  private async updatePosition(order: Order, fill: Fill): Promise<void> {
    const positionKey = `${order.userId}:${order.symbol}`;
    let position = this.positions.get(positionKey);

    if (!position) {
      position = {
        userId: order.userId,
        portfolioId: order.portfolioId,
        symbol: order.symbol,
        quantity: 0,
        averagePrice: 0,
        marketValue: 0,
        unrealizedPnL: 0,
        realizedPnL: 0,
        lastUpdated: new Date()
      };
    }

    // Calculate new position
    const oldQuantity = position.quantity;
    const oldAvgPrice = position.averagePrice;
    
    if (order.side === 'buy') {
      const totalCost = (oldQuantity * oldAvgPrice) + (fill.quantity * fill.price);
      position.quantity += fill.quantity;
      position.averagePrice = position.quantity > 0 ? totalCost / position.quantity : 0;
    } else {
      // Selling - calculate realized P&L
      const realizedPnL = fill.quantity * (fill.price - oldAvgPrice);
      position.realizedPnL += realizedPnL;
      position.quantity -= fill.quantity;
      
      if (position.quantity === 0) {
        position.averagePrice = 0;
      }
    }

    // Update market value and unrealized P&L
    const currentPrice = this.websocketService.getCurrentPrice(order.symbol)?.price || fill.price;
    position.marketValue = position.quantity * currentPrice;
    position.unrealizedPnL = position.quantity * (currentPrice - position.averagePrice);
    position.lastUpdated = new Date();

    this.positions.set(positionKey, position);

    // Broadcast position update
    this.websocketService.broadcastPositionUpdate(order.userId, position);

    logger.info(`Position updated for ${order.userId}:${order.symbol}`);
    this.emit('positionUpdated', position);
  }

  // Helper Methods
  private calculateAveragePrice(orderId: string): number {
    const fills = this.fills.get(orderId) || [];
    if (fills.length === 0) return 0;

    const totalValue = fills.reduce((sum, fill) => sum + (fill.quantity * fill.price), 0);
    const totalQuantity = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    
    return totalQuantity > 0 ? totalValue / totalQuantity : 0;
  }

  // Event Handlers
  private setupEventHandlers(): void {
    this.websocketService.on('liveTradingEnabled', () => {
      logger.info('Live trading enabled via WebSocket service');
    });

    this.websocketService.on('liveTradingDisabled', () => {
      logger.info('Live trading disabled via WebSocket service');
    });
  }

  // Emergency Stop
  async emergencyStop(userId: string, reason: string): Promise<void> {
    try {
      logger.warn(`Emergency stop triggered for user ${userId}: ${reason}`);
      
      // Cancel all pending orders for user
      const userOrders = this.getUserOrders(userId).filter(order => 
        order.status === 'pending' || order.status === 'submitted' || order.status === 'partially_filled'
      );

      for (const order of userOrders) {
        try {
          await this.cancelOrder(order.id, userId);
        } catch (error) {
          logger.error(`Failed to cancel order ${order.id} during emergency stop:`, error);
        }
      }

      // Broadcast emergency stop
      this.websocketService.broadcastTradeExecution(userId, {
        type: 'emergency_stop',
        reason,
        cancelledOrders: userOrders.length
      });

      this.emit('emergencyStop', { userId, reason, cancelledOrders: userOrders.length });
      
    } catch (error) {
      logger.error('Error during emergency stop:', error);
      throw error;
    }
  }

  // Cleanup
  destroy(): void {
    this.orders.clear();
    this.positions.clear();
    this.fills.clear();
    this.brokerConfigs.clear();
    this.riskLimits.clear();
    this.removeAllListeners();
  }
}

export default OrderExecutionService;