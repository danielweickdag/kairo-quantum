import { TradingSignal } from './multiMarketTradingEngine';
import { SignalMetrics } from './signalGenerator';
import crypto from 'crypto';

export interface TradeEntry {
  id: string;
  userId: string;
  signalId: string;
  symbol: string;
  market: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  quantity: number;
  entryTime: Date;
  stopLoss?: number;
  takeProfit?: number;
  confidence: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  exitPrice?: number;
  exitTime?: Date;
  exitReason?: 'STOP_LOSS' | 'TAKE_PROFIT' | 'MANUAL' | 'TIMEOUT';
  pnl?: number;
  pnlPercentage?: number;
  fees: number;
  slippage: number;
  executionLatency: number; // milliseconds
  metadata: {
    signalMetrics: SignalMetrics;
    marketConditions: any;
    technicalIndicators: any;
    riskParameters: any;
  };
  immutableHash: string;
  blockchainTxId?: string; // For blockchain-based immutability
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeLog {
  id: string;
  tradeId: string;
  action: 'ENTRY' | 'EXIT' | 'MODIFY' | 'CANCEL';
  timestamp: Date;
  data: any;
  previousHash: string;
  currentHash: string;
  signature: string;
  blockNumber?: number;
  immutable: boolean;
}

export interface SignalSnapshot {
  signalId: string;
  timestamp: Date;
  originalSignal: TradingSignal;
  hash: string;
  locked: boolean;
  noRepaintVerified: boolean;
  modifications: {
    timestamp: Date;
    field: string;
    oldValue: any;
    newValue: any;
    reason: string;
  }[];
}

export interface ImmutableBlock {
  index: number;
  timestamp: Date;
  logs: TradeLog[];
  hash: string;
  previousHash: string;
  merkleRoot: string;
  nonce: number;
  difficulty: number;
}

export interface ExecutionMetrics {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  currentDrawdown: number;
  sharpeRatio: number;
  averageExecutionTime: number;
  averageSlippage: number;
  totalFees: number;
}

export interface RealTimeExecution {
  signalId: string;
  symbol: string;
  market: string;
  requestTime: Date;
  executionTime?: Date;
  status: 'PENDING' | 'EXECUTING' | 'FILLED' | 'PARTIAL' | 'REJECTED' | 'CANCELLED';
  requestedPrice: number;
  executedPrice?: number;
  requestedQuantity: number;
  executedQuantity?: number;
  slippage?: number;
  latency?: number;
  errorMessage?: string;
  brokerOrderId?: string;
  exchangeOrderId?: string;
}

export class TradeLoggingSystem {
  private trades: Map<string, TradeEntry> = new Map();
  private tradeLogs: Map<string, TradeLog[]> = new Map();
  private executionQueue: Map<string, RealTimeExecution> = new Map();
  private blockchainEnabled: boolean = false;
  private lastBlockHash: string = '0';
  private blockNumber: number = 0;
  private cryptoKey: string;
  // GainzAlgo V2 Immutable Features
  private signalSnapshots: Map<string, SignalSnapshot> = new Map();
  private immutableBlocks: ImmutableBlock[] = [];
  private pendingLogs: TradeLog[] = [];
  private readonly BLOCK_SIZE = 10;
  private readonly MINING_DIFFICULTY = 2;
  private isInitialized = false;

  constructor(cryptoKey?: string, enableBlockchain: boolean = false) {
    this.cryptoKey = cryptoKey || this.generateCryptoKey();
    this.blockchainEnabled = enableBlockchain;
    this.initializeGenesisBlock();
    this.initializeImmutableSystem();
  }

  /**
   * Initialize the immutable logging system
   */
  async initialize(): Promise<void> {
    console.log('GainzAlgo V2 Immutable Trade Logging System initializing...');
    
    // Verify blockchain integrity
    if (!this.verifyBlockchainIntegrity()) {
      throw new Error('Blockchain integrity verification failed');
    }
    
    this.isInitialized = true;
    console.log('Trade Logging System initialized with no-repaint verification');
  }

  /**
   * Create immutable snapshot of trading signal (prevents repainting)
   */
  async createSignalSnapshot(signal: TradingSignal): Promise<string> {
    if (!this.isInitialized) {
      console.warn('Trade Logging System not initialized, creating snapshot anyway');
    }

    const snapshot: SignalSnapshot = {
      signalId: signal.id,
      timestamp: new Date(),
      originalSignal: JSON.parse(JSON.stringify(signal)), // Deep copy
      hash: this.calculateSignalHash(signal),
      locked: true,
      noRepaintVerified: true,
      modifications: []
    };

    this.signalSnapshots.set(signal.id, snapshot);

    // Create immutable log entry
    await this.createImmutableLog({
      tradeId: signal.id,
      action: 'ENTRY',
      data: {
        type: 'SIGNAL_SNAPSHOT',
        signal: snapshot.originalSignal,
        confidence: signal.confidence,
        riskReward: signal.riskReward,
        winProbability: signal.winProbability,
        gainzAlgoFeatures: signal.gainzAlgoFeatures,
        noRepaintHash: snapshot.hash
      }
    });

    console.log(`📸 Signal snapshot created: ${signal.symbol} ${signal.signal} (ID: ${signal.id})`);
    return snapshot.hash;
  }

  /**
   * Verify signal has not been repainted
   */
  verifyNoRepaint(signalId: string): {
    isValid: boolean;
    originalHash: string;
    currentHash?: string;
    locked: boolean;
    modifications: any[];
    verificationTime: Date;
  } {
    const snapshot = this.signalSnapshots.get(signalId);
    if (!snapshot) {
      return {
        isValid: false,
        originalHash: '',
        locked: false,
        modifications: [],
        verificationTime: new Date()
      };
    }

    const currentHash = this.calculateSignalHash(snapshot.originalSignal);
    const isValid = snapshot.hash === currentHash && snapshot.locked && snapshot.noRepaintVerified;

    return {
      isValid,
      originalHash: snapshot.hash,
      currentHash,
      locked: snapshot.locked,
      modifications: snapshot.modifications,
      verificationTime: new Date()
    };
  }

  /**
   * Mark signal as confirmed (no repaint possible after this)
   */
  confirmSignalImmutable(signalId: string): boolean {
    const snapshot = this.signalSnapshots.get(signalId);
    if (!snapshot) {
      return false;
    }

    // Update gainzAlgoFeatures to mark as no-repaint confirmed
    if (snapshot.originalSignal.gainzAlgoFeatures) {
      snapshot.originalSignal.gainzAlgoFeatures.noRepaintConfirmed = true;
    }

    // Recalculate hash with confirmed status
    snapshot.hash = this.calculateSignalHash(snapshot.originalSignal);
    snapshot.noRepaintVerified = true;
    
    console.log(`✅ Signal confirmed immutable: ${signalId}`);
    return true;
  }

  /**
   * Generate a cryptographic key for signing
   */
  private generateCryptoKey(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Initialize the genesis block for the trade log chain
   */
  private initializeGenesisBlock(): void {
    this.lastBlockHash = this.calculateHash('GENESIS', new Date(), {});
    console.log('Trade logging system initialized with genesis block');
  }

  /**
   * Initialize immutable system with genesis block
   */
  private initializeImmutableSystem(): void {
    const genesisBlock: ImmutableBlock = {
      index: 0,
      timestamp: new Date(),
      logs: [],
      hash: this.calculateBlockHash(0, new Date(), [], '0'),
      previousHash: '0',
      merkleRoot: '0',
      nonce: 0,
      difficulty: this.MINING_DIFFICULTY
    };
    
    this.immutableBlocks.push(genesisBlock);
  }

  /**
   * Calculate hash for immutability
   */
  private calculateHash(action: string, timestamp: Date, data: any): string {
    const content = JSON.stringify({
      action,
      timestamp: timestamp.toISOString(),
      data,
      previousHash: this.lastBlockHash
    });
    
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Calculate signal hash for no-repaint verification
   */
  private calculateSignalHash(signal: TradingSignal): string {
    const signalData = {
      id: signal.id,
      symbol: signal.symbol,
      signal: signal.signal,
      confidence: signal.confidence,
      timestamp: signal.timestamp,
      riskReward: signal.riskReward,
      winProbability: signal.winProbability,
      gainzAlgoFeatures: signal.gainzAlgoFeatures
    };
    return crypto.createHash('sha256').update(JSON.stringify(signalData)).digest('hex');
  }

  /**
   * Calculate block hash for blockchain
   */
  private calculateBlockHash(index: number, timestamp: Date, logs: TradeLog[], previousHash: string): string {
    const blockData = {
      index,
      timestamp,
      logs: logs.map(log => ({
        id: log.id,
        tradeId: log.tradeId,
        action: log.action,
        timestamp: log.timestamp,
        dataHash: crypto.createHash('sha256').update(JSON.stringify(log.data)).digest('hex')
      })),
      previousHash
    };
    return crypto.createHash('sha256').update(JSON.stringify(blockData)).digest('hex');
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sign data with crypto key
   */
  private signData(data: string): string {
    return crypto.createHash('sha256').update(data + this.cryptoKey).digest('hex');
  }

  /**
   * Create immutable log entry
   */
  private async createImmutableLog(logData: {
    tradeId: string;
    action: 'ENTRY' | 'EXIT' | 'MODIFY' | 'CANCEL';
    data: any;
  }): Promise<void> {
    const log: TradeLog = {
      id: this.generateId(),
      tradeId: logData.tradeId,
      action: logData.action,
      timestamp: new Date(),
      data: logData.data,
      previousHash: this.lastBlockHash,
      currentHash: '',
      signature: '',
      blockNumber: this.blockNumber,
      immutable: true
    };

    // Calculate hash and signature
    log.currentHash = this.calculateHash(log.action, log.timestamp, log.data);
    log.signature = this.signData(log.currentHash);

    this.pendingLogs.push(log);

    // Mine block if we have enough logs
    if (this.pendingLogs.length >= this.BLOCK_SIZE) {
      await this.mineBlock();
    }
  }

  /**
   * Mine a new block with pending logs
   */
  private async mineBlock(): Promise<void> {
    if (this.pendingLogs.length === 0) return;

    const newBlock: ImmutableBlock = {
      index: this.immutableBlocks.length,
      timestamp: new Date(),
      logs: [...this.pendingLogs],
      hash: '',
      previousHash: this.immutableBlocks[this.immutableBlocks.length - 1]?.hash || '0',
      merkleRoot: this.calculateMerkleRoot(this.pendingLogs),
      nonce: 0,
      difficulty: this.MINING_DIFFICULTY
    };

    // Proof of work mining
    while (!this.isValidHash(newBlock.hash, this.MINING_DIFFICULTY)) {
      newBlock.nonce++;
      newBlock.hash = this.calculateBlockHash(
        newBlock.index,
        newBlock.timestamp,
        newBlock.logs,
        newBlock.previousHash + newBlock.nonce
      );
    }

    this.immutableBlocks.push(newBlock);
    this.lastBlockHash = newBlock.hash;
    this.blockNumber++;
    this.pendingLogs = [];

    console.log(`⛏️  Block mined: #${newBlock.index} with ${newBlock.logs.length} logs`);
  }

  /**
   * Calculate Merkle root for block integrity
   */
  private calculateMerkleRoot(logs: TradeLog[]): string {
    if (logs.length === 0) return '0';
    
    let hashes = logs.map(log => log.currentHash);
    
    while (hashes.length > 1) {
      const newHashes: string[] = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        newHashes.push(crypto.createHash('sha256').update(left + right).digest('hex'));
      }
      hashes = newHashes;
    }
    
    return hashes[0];
  }

  /**
   * Verify blockchain integrity
   */
  private verifyBlockchainIntegrity(): boolean {
    for (let i = 1; i < this.immutableBlocks.length; i++) {
      const currentBlock = this.immutableBlocks[i];
      const previousBlock = this.immutableBlocks[i - 1];
      
      // Verify hash chain
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Block ${i} has invalid previous hash`);
        return false;
      }
      
      // Verify block hash
      const calculatedHash = this.calculateBlockHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.logs,
        currentBlock.previousHash + currentBlock.nonce
      );
      
      if (currentBlock.hash !== calculatedHash) {
        console.error(`Block ${i} has invalid hash`);
        return false;
      }
      
      // Verify proof of work
      if (!this.isValidHash(currentBlock.hash, currentBlock.difficulty)) {
        console.error(`Block ${i} has invalid proof of work`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check if hash meets difficulty requirement
   */
  private isValidHash(hash: string, difficulty: number): boolean {
    return hash.substring(0, difficulty) === '0'.repeat(difficulty);
  }

  /**
   * Create digital signature for trade entry
   */
  private createSignature(data: any): string {
    const content = JSON.stringify(data) + this.cryptoKey;
    return this.calculateHash('SIGNATURE', new Date(), content);
  }

  /**
   * Log a new trade entry (immutable)
   */
  async logTradeEntry(
    userId: string,
    signal: TradingSignal,
    executionDetails: {
      executedPrice: number;
      executedQuantity: number;
      fees: number;
      slippage: number;
      executionLatency: number;
    },
    marketConditions: any,
    technicalIndicators: any
  ): Promise<string> {
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    const tradeEntry: TradeEntry = {
      id: tradeId,
      userId,
      signalId: signal.id,
      symbol: signal.symbol,
      market: signal.market,
      type: signal.signal as 'BUY' | 'SELL',
      entryPrice: executionDetails.executedPrice,
      quantity: executionDetails.executedQuantity,
      entryTime: timestamp,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      confidence: signal.confidence,
      status: 'OPEN',
      fees: executionDetails.fees,
      slippage: executionDetails.slippage,
      executionLatency: executionDetails.executionLatency,
      metadata: {
        signalMetrics: signal.metadata?.metrics || {},
        marketConditions,
        technicalIndicators,
        riskParameters: signal.metadata?.riskParameters || {}
      },
      immutableHash: '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Calculate immutable hash
    tradeEntry.immutableHash = this.calculateHash('TRADE_ENTRY', timestamp, tradeEntry);

    // Store trade
    this.trades.set(tradeId, tradeEntry);

    // Create immutable log entry
    await this.createTradeLog(tradeId, 'ENTRY', tradeEntry);

    // If blockchain is enabled, submit to blockchain
    if (this.blockchainEnabled) {
      tradeEntry.blockchainTxId = await this.submitToBlockchain(tradeEntry);
    }

    console.log(`Trade entry logged: ${tradeId} for ${signal.symbol}`);
    return tradeId;
  }

  /**
   * Log trade exit (immutable)
   */
  async logTradeExit(
    tradeId: string,
    exitDetails: {
      exitPrice: number;
      exitTime: Date;
      exitReason: 'STOP_LOSS' | 'TAKE_PROFIT' | 'MANUAL' | 'TIMEOUT';
      fees: number;
      slippage: number;
      executionLatency: number;
    }
  ): Promise<void> {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      throw new Error(`Trade ${tradeId} not found`);
    }

    if (trade.status !== 'OPEN') {
      throw new Error(`Trade ${tradeId} is not open`);
    }

    // Calculate P&L
    const pnl = this.calculatePnL(trade, exitDetails.exitPrice);
    const pnlPercentage = (pnl / (trade.entryPrice * trade.quantity)) * 100;

    // Update trade (create new immutable version)
    const updatedTrade: TradeEntry = {
      ...trade,
      status: 'CLOSED',
      exitPrice: exitDetails.exitPrice,
      exitTime: exitDetails.exitTime,
      exitReason: exitDetails.exitReason,
      pnl,
      pnlPercentage,
      fees: trade.fees + exitDetails.fees,
      updatedAt: new Date()
    };

    // Recalculate immutable hash
    updatedTrade.immutableHash = this.calculateHash('TRADE_EXIT', exitDetails.exitTime, updatedTrade);

    // Store updated trade
    this.trades.set(tradeId, updatedTrade);

    // Create immutable log entry
    await this.createTradeLog(tradeId, 'EXIT', {
      exitPrice: exitDetails.exitPrice,
      exitTime: exitDetails.exitTime,
      exitReason: exitDetails.exitReason,
      pnl,
      pnlPercentage
    });

    console.log(`Trade exit logged: ${tradeId} with P&L: ${pnl}`);
  }

  /**
   * Calculate P&L for a trade
   */
  private calculatePnL(trade: TradeEntry, exitPrice: number): number {
    const direction = trade.type === 'BUY' ? 1 : -1;
    return direction * (exitPrice - trade.entryPrice) * trade.quantity;
  }

  /**
   * Create immutable trade log entry
   */
  private async createTradeLog(
    tradeId: string,
    action: 'ENTRY' | 'EXIT' | 'MODIFY' | 'CANCEL',
    data: any
  ): Promise<void> {
    const timestamp = new Date();
    const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const currentHash = this.calculateHash(action, timestamp, data);
    const signature = this.createSignature({ tradeId, action, timestamp, data });

    const logEntry: TradeLog = {
      id: logId,
      tradeId,
      action,
      timestamp,
      data,
      previousHash: this.lastBlockHash,
      currentHash,
      signature,
      blockNumber: this.blockNumber++,
      immutable: true
    };

    // Store log entry
    const tradeLogs = this.tradeLogs.get(tradeId) || [];
    tradeLogs.push(logEntry);
    this.tradeLogs.set(tradeId, tradeLogs);

    // Update last block hash
    this.lastBlockHash = currentHash;

    console.log(`Immutable log created: ${logId} for trade ${tradeId}`);
  }

  /**
   * Submit trade to blockchain for ultimate immutability
   */
  private async submitToBlockchain(trade: TradeEntry): Promise<string> {
    // Simulate blockchain submission
    // In production, this would integrate with actual blockchain networks
    const txId = `blockchain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Trade submitted to blockchain: ${txId}`);
    return txId;
  }

  /**
   * Start real-time execution tracking
   */
  startExecutionTracking(
    signalId: string,
    symbol: string,
    market: string,
    requestedPrice: number,
    requestedQuantity: number
  ): string {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: RealTimeExecution = {
      signalId,
      symbol,
      market,
      requestTime: new Date(),
      status: 'PENDING',
      requestedPrice,
      requestedQuantity
    };

    this.executionQueue.set(executionId, execution);
    console.log(`Execution tracking started: ${executionId} for ${symbol}`);
    
    return executionId;
  }

  /**
   * Update execution status
   */
  updateExecutionStatus(
    executionId: string,
    status: RealTimeExecution['status'],
    details?: Partial<RealTimeExecution>
  ): void {
    const execution = this.executionQueue.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    // Update execution details
    Object.assign(execution, {
      status,
      ...details,
      executionTime: status === 'FILLED' ? new Date() : execution.executionTime
    });

    // Calculate latency if filled
    if (status === 'FILLED' && execution.executionTime) {
      execution.latency = execution.executionTime.getTime() - execution.requestTime.getTime();
    }

    // Calculate slippage if filled
    if (status === 'FILLED' && execution.executedPrice) {
      execution.slippage = Math.abs(execution.executedPrice - execution.requestedPrice) / execution.requestedPrice * 100;
    }

    console.log(`Execution ${executionId} updated to ${status}`);
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): RealTimeExecution | null {
    return this.executionQueue.get(executionId) || null;
  }

  /**
   * Get trade by ID
   */
  getTrade(tradeId: string): TradeEntry | null {
    return this.trades.get(tradeId) || null;
  }

  /**
   * Get all trades for a user
   */
  getUserTrades(userId: string, limit?: number): TradeEntry[] {
    const userTrades = Array.from(this.trades.values())
      .filter(trade => trade.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userTrades.slice(0, limit) : userTrades;
  }

  /**
   * Get trade logs for a specific trade
   */
  getTradeLogs(tradeId: string): TradeLog[] {
    return this.tradeLogs.get(tradeId) || [];
  }

  /**
   * Verify trade log integrity
   */
  verifyTradeLogIntegrity(tradeId: string): boolean {
    const logs = this.tradeLogs.get(tradeId);
    if (!logs || logs.length === 0) {
      return false;
    }

    // Verify hash chain
    for (let i = 1; i < logs.length; i++) {
      const currentLog = logs[i];
      const previousLog = logs[i - 1];
      
      if (currentLog.previousHash !== previousLog.currentHash) {
        console.error(`Hash chain broken at log ${currentLog.id}`);
        return false;
      }
    }

    // Verify signatures
    for (const log of logs) {
      const expectedSignature = this.createSignature({
        tradeId: log.tradeId,
        action: log.action,
        timestamp: log.timestamp,
        data: log.data
      });
      
      if (log.signature !== expectedSignature) {
        console.error(`Invalid signature for log ${log.id}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate execution metrics
   */
  calculateExecutionMetrics(userId: string): ExecutionMetrics {
    const userTrades = this.getUserTrades(userId);
    const closedTrades = userTrades.filter(trade => trade.status === 'CLOSED');
    const openTrades = userTrades.filter(trade => trade.status === 'OPEN');
    
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0);
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalWins = winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0));
    
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
    
    // Calculate drawdown
    const { maxDrawdown, currentDrawdown } = this.calculateDrawdown(closedTrades);
    
    // Calculate Sharpe ratio (simplified)
    const returns = closedTrades.map(trade => (trade.pnlPercentage || 0) / 100);
    const avgReturn = returns.length > 0 ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length : 0;
    const returnStdDev = this.calculateStandardDeviation(returns);
    const sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;
    
    // Calculate execution metrics
    const avgExecutionTime = userTrades.length > 0 ? 
      userTrades.reduce((sum, trade) => sum + trade.executionLatency, 0) / userTrades.length : 0;
    const avgSlippage = userTrades.length > 0 ? 
      userTrades.reduce((sum, trade) => sum + trade.slippage, 0) / userTrades.length : 0;
    const totalFees = userTrades.reduce((sum, trade) => sum + trade.fees, 0);

    return {
      totalTrades: userTrades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalPnL,
      averageWin,
      averageLoss,
      profitFactor,
      maxDrawdown,
      currentDrawdown,
      sharpeRatio,
      averageExecutionTime: avgExecutionTime,
      averageSlippage: avgSlippage,
      totalFees
    };
  }

  /**
   * Calculate drawdown
   */
  private calculateDrawdown(trades: TradeEntry[]): { maxDrawdown: number; currentDrawdown: number } {
    if (trades.length === 0) {
      return { maxDrawdown: 0, currentDrawdown: 0 };
    }

    let peak = 0;
    let maxDrawdown = 0;
    let currentBalance = 0;
    
    const sortedTrades = trades.sort((a, b) => a.exitTime!.getTime() - b.exitTime!.getTime());
    
    for (const trade of sortedTrades) {
      currentBalance += trade.pnl || 0;
      
      if (currentBalance > peak) {
        peak = currentBalance;
      }
      
      const drawdown = ((peak - currentBalance) / Math.max(peak, 1)) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    const currentDrawdown = ((peak - currentBalance) / Math.max(peak, 1)) * 100;
    
    return { maxDrawdown, currentDrawdown };
  }

  /**
   * Calculate standard deviation
   */
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(avgSquaredDiff);
  }

  /**
   * Export trade data for compliance/auditing
   */
  exportTradeData(userId: string, format: 'JSON' | 'CSV' = 'JSON'): string {
    const userTrades = this.getUserTrades(userId);
    
    if (format === 'CSV') {
      const headers = [
        'ID', 'Symbol', 'Market', 'Type', 'Entry Price', 'Quantity', 'Entry Time',
        'Exit Price', 'Exit Time', 'P&L', 'P&L %', 'Status', 'Fees', 'Slippage'
      ];
      
      const rows = userTrades.map(trade => [
        trade.id,
        trade.symbol,
        trade.market,
        trade.type,
        trade.entryPrice,
        trade.quantity,
        trade.entryTime.toISOString(),
        trade.exitPrice || '',
        trade.exitTime?.toISOString() || '',
        trade.pnl || '',
        trade.pnlPercentage || '',
        trade.status,
        trade.fees,
        trade.slippage
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(userTrades, null, 2);
  }

  /**
   * Get system statistics
   */
  getSystemStats(): {
    totalTrades: number;
    totalUsers: number;
    totalVolume: number;
    averageExecutionTime: number;
    systemUptime: number;
  } {
    const allTrades = Array.from(this.trades.values());
    const uniqueUsers = new Set(allTrades.map(trade => trade.userId));
    const totalVolume = allTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.quantity), 0);
    const avgExecutionTime = allTrades.length > 0 ? 
      allTrades.reduce((sum, trade) => sum + trade.executionLatency, 0) / allTrades.length : 0;
    
    return {
      totalTrades: allTrades.length,
      totalUsers: uniqueUsers.size,
      totalVolume,
      averageExecutionTime: avgExecutionTime,
      systemUptime: Date.now() // Simplified uptime
    };
  }

  /**
   * Clean up old execution tracking data
   */
  cleanupExecutionQueue(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = new Date();
    const cutoff = new Date(now.getTime() - maxAge);
    
    this.executionQueue.forEach((execution, id) => {
      if (execution.requestTime < cutoff) {
        this.executionQueue.delete(id);
      }
    });
    
    console.log('Execution queue cleaned up');
  }
}

export default TradeLoggingSystem;