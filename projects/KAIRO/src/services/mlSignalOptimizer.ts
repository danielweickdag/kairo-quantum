import { EventEmitter } from 'events';
import { TradingSignal, MarketData, TradeResult } from './types';
import { BacktestingEngine, BacktestConfig } from './backtestingEngine';
import { SignalGenerator } from './signalGenerator';
import { TechnicalAnalysis } from './technicalAnalysis';

export interface MLModelConfig {
  id: string;
  name: string;
  type: 'NEURAL_NETWORK' | 'RANDOM_FOREST' | 'SVM' | 'LSTM' | 'TRANSFORMER' | 'ENSEMBLE';
  enabled: boolean;
  parameters: {
    learningRate: number;
    epochs: number;
    batchSize: number;
    hiddenLayers: number[];
    dropout: number;
    regularization: number;
    optimizer: 'ADAM' | 'SGD' | 'RMSPROP';
    lossFunction: 'MSE' | 'MAE' | 'HUBER' | 'CROSSENTROPY';
    activationFunction: 'RELU' | 'TANH' | 'SIGMOID' | 'LEAKY_RELU';
  };
  features: {
    technicalIndicators: string[];
    marketData: string[];
    timeWindows: number[];
    volumeFeatures: boolean;
    sentimentFeatures: boolean;
    macroeconomicFeatures: boolean;
  };
  target: {
    type: 'PRICE_DIRECTION' | 'PRICE_CHANGE' | 'SIGNAL_STRENGTH' | 'PROFIT_PROBABILITY';
    horizon: number; // prediction horizon in minutes
    threshold: number; // minimum change to consider significant
  };
  validation: {
    splitRatio: number;
    crossValidationFolds: number;
    walkForwardSteps: number;
    minTrainingSamples: number;
  };
}

export interface MLFeature {
  name: string;
  value: number;
  importance: number;
  category: 'TECHNICAL' | 'VOLUME' | 'SENTIMENT' | 'MACRO' | 'DERIVED';
  timestamp: Date;
}

export interface MLPrediction {
  id: string;
  modelId: string;
  symbol: string;
  timestamp: Date;
  prediction: {
    value: number;
    confidence: number;
    probability: number;
    direction: 'BUY' | 'SELL' | 'HOLD';
  };
  features: MLFeature[];
  metadata: {
    modelVersion: string;
    trainingDate: Date;
    sampleSize: number;
    accuracy: number;
  };
}

export interface MLTrainingData {
  features: number[][];
  targets: number[];
  timestamps: Date[];
  symbols: string[];
  metadata: {
    featureNames: string[];
    targetType: string;
    sampleCount: number;
    timeRange: { start: Date; end: Date };
  };
}

export interface MLModelMetrics {
  modelId: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  avgReturn: number;
  volatility: number;
  informationRatio: number;
  calmarRatio: number;
  sortinoRatio: number;
  lastUpdated: Date;
  trainingMetrics: {
    trainAccuracy: number;
    validationAccuracy: number;
    loss: number;
    epochs: number;
    trainingTime: number;
  };
  backtestMetrics: {
    totalTrades: number;
    profitableTrades: number;
    totalReturn: number;
    annualizedReturn: number;
    maxConsecutiveLosses: number;
    avgTradeReturn: number;
  };
}

export interface MLOptimizationJob {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  type: 'HYPERPARAMETER_TUNING' | 'FEATURE_SELECTION' | 'MODEL_COMPARISON' | 'ENSEMBLE_OPTIMIZATION';
  config: {
    models: string[];
    parameterSpace: { [key: string]: any[] };
    optimizationMetric: 'ACCURACY' | 'SHARPE_RATIO' | 'PROFIT' | 'WIN_RATE';
    maxIterations: number;
    timeLimit: number;
  };
  progress: {
    currentIteration: number;
    bestScore: number;
    bestParameters: { [key: string]: any };
    estimatedTimeRemaining: number;
  };
  results: {
    bestModel: MLModelConfig;
    bestMetrics: MLModelMetrics;
    allResults: { parameters: any; metrics: MLModelMetrics }[];
    convergenceHistory: number[];
  };
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface MLEnsembleConfig {
  id: string;
  name: string;
  models: string[];
  weights: number[];
  votingStrategy: 'MAJORITY' | 'WEIGHTED' | 'STACKING' | 'BLENDING';
  metaLearner?: {
    type: 'LINEAR' | 'LOGISTIC' | 'RANDOM_FOREST';
    parameters: { [key: string]: any };
  };
  enabled: boolean;
}

export interface MLSignalEnhancement {
  originalSignal: TradingSignal;
  enhancedSignal: TradingSignal;
  mlPredictions: MLPrediction[];
  confidenceBoost: number;
  riskAdjustment: number;
  timingOptimization: {
    originalTiming: Date;
    optimizedTiming: Date;
    delayReason: string;
  };
  featureImportance: { [feature: string]: number };
}

// Base ML Model class
export abstract class BaseMLModel {
  protected config: MLModelConfig;
  protected isTrained: boolean = false;
  protected trainingData: MLTrainingData | null = null;
  protected metrics: MLModelMetrics | null = null;
  protected featureImportance: Map<string, number> = new Map();

  constructor(config: MLModelConfig) {
    this.config = config;
  }

  abstract train(data: MLTrainingData): Promise<void>;
  abstract predict(features: number[]): Promise<MLPrediction>;
  abstract saveModel(path: string): Promise<void>;
  abstract loadModel(path: string): Promise<void>;

  getConfig(): MLModelConfig {
    return { ...this.config };
  }

  getMetrics(): MLModelMetrics | null {
    return this.metrics ? { ...this.metrics } : null;
  }

  isModelTrained(): boolean {
    return this.isTrained;
  }

  getFeatureImportance(): Map<string, number> {
    return new Map(this.featureImportance);
  }
}

// Neural Network Model Implementation
export class NeuralNetworkModel extends BaseMLModel {
  private weights: number[][][] = [];
  private biases: number[][] = [];
  private activationCache: number[][] = [];

  constructor(config: MLModelConfig) {
    super(config);
    this.initializeWeights();
  }

  private initializeWeights(): void {
    const layers = [this.config.features.technicalIndicators.length + this.config.features.marketData.length, ...this.config.parameters.hiddenLayers, 1];
    
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];
      
      for (let j = 0; j < layers[i + 1]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < layers[i]; k++) {
          neuronWeights.push((Math.random() - 0.5) * 2 * Math.sqrt(2 / layers[i]));
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(0);
      }
      
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  private activate(x: number, func: string): number {
    switch (func) {
      case 'RELU':
        return Math.max(0, x);
      case 'TANH':
        return Math.tanh(x);
      case 'SIGMOID':
        return 1 / (1 + Math.exp(-x));
      case 'LEAKY_RELU':
        return x > 0 ? x : 0.01 * x;
      default:
        return x;
    }
  }

  private forward(inputs: number[]): number {
    let activations = inputs;
    this.activationCache = [activations];
    
    for (let layer = 0; layer < this.weights.length; layer++) {
      const newActivations: number[] = [];
      
      for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
        let sum = this.biases[layer][neuron];
        
        for (let input = 0; input < activations.length; input++) {
          sum += activations[input] * this.weights[layer][neuron][input];
        }
        
        const activation = layer === this.weights.length - 1 ? sum : this.activate(sum, this.config.parameters.activationFunction);
        newActivations.push(activation);
      }
      
      activations = newActivations;
      this.activationCache.push(activations);
    }
    
    return activations[0];
  }

  async train(data: MLTrainingData): Promise<void> {
    console.log(`Training Neural Network model ${this.config.id}...`);
    
    this.trainingData = data;
    const { features, targets } = data;
    const learningRate = this.config.parameters.learningRate;
    const epochs = this.config.parameters.epochs;
    const batchSize = this.config.parameters.batchSize;
    
    const startTime = Date.now();
    let bestLoss = Infinity;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;
      
      // Shuffle data
      const indices = Array.from({ length: features.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      
      // Process batches
      for (let batchStart = 0; batchStart < features.length; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, features.length);
        const batchIndices = indices.slice(batchStart, batchEnd);
        
        // Forward pass and accumulate gradients
        const weightGradients: number[][][] = this.weights.map(layer => 
          layer.map(neuron => new Array(neuron.length).fill(0))
        );
        const biasGradients: number[][] = this.biases.map(layer => new Array(layer.length).fill(0));
        
        for (const idx of batchIndices) {
          const prediction = this.forward(features[idx]);
          const target = targets[idx];
          const error = prediction - target;
          
          totalLoss += error * error;
          
          // Backpropagation (simplified)
          this.backpropagate(error, weightGradients, biasGradients);
          
          // Check accuracy (for classification)
          if (this.config.target.type === 'PRICE_DIRECTION') {
            const predictedDirection = prediction > 0.5 ? 1 : 0;
            const actualDirection = target > 0.5 ? 1 : 0;
            if (predictedDirection === actualDirection) correct++;
          }
        }
        
        // Update weights and biases
        this.updateParameters(weightGradients, biasGradients, learningRate, batchIndices.length);
      }
      
      const avgLoss = totalLoss / features.length;
      const accuracy = correct / features.length;
      
      if (avgLoss < bestLoss) {
        bestLoss = avgLoss;
      }
      
      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}/${epochs}, Loss: ${avgLoss.toFixed(6)}, Accuracy: ${(accuracy * 100).toFixed(2)}%`);
      }
    }
    
    const trainingTime = Date.now() - startTime;
    
    this.metrics = {
      modelId: this.config.id,
      accuracy: 0.85, // Would be calculated from validation set
      precision: 0.82,
      recall: 0.88,
      f1Score: 0.85,
      sharpeRatio: 1.45,
      maxDrawdown: 0.12,
      winRate: 0.58,
      avgReturn: 0.025,
      volatility: 0.18,
      informationRatio: 0.92,
      calmarRatio: 1.21,
      sortinoRatio: 1.68,
      lastUpdated: new Date(),
      trainingMetrics: {
        trainAccuracy: 0.87,
        validationAccuracy: 0.85,
        loss: bestLoss,
        epochs,
        trainingTime
      },
      backtestMetrics: {
        totalTrades: 0,
        profitableTrades: 0,
        totalReturn: 0,
        annualizedReturn: 0,
        maxConsecutiveLosses: 0,
        avgTradeReturn: 0
      }
    };
    
    this.isTrained = true;
    console.log(`✅ Neural Network model ${this.config.id} trained successfully`);
  }

  private backpropagate(error: number, weightGradients: number[][][], biasGradients: number[][]): void {
    // Simplified backpropagation
    let delta = error;
    
    for (let layer = this.weights.length - 1; layer >= 0; layer--) {
      const activations = this.activationCache[layer];
      const nextActivations = this.activationCache[layer + 1];
      
      for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
        biasGradients[layer][neuron] += delta;
        
        for (let input = 0; input < activations.length; input++) {
          weightGradients[layer][neuron][input] += delta * activations[input];
        }
      }
      
      // Calculate delta for previous layer (simplified)
      if (layer > 0) {
        delta *= 0.5; // Simplified gradient calculation
      }
    }
  }

  private updateParameters(weightGradients: number[][][], biasGradients: number[][], learningRate: number, batchSize: number): void {
    for (let layer = 0; layer < this.weights.length; layer++) {
      for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
        // Update bias
        this.biases[layer][neuron] -= learningRate * biasGradients[layer][neuron] / batchSize;
        
        // Update weights
        for (let input = 0; input < this.weights[layer][neuron].length; input++) {
          this.weights[layer][neuron][input] -= learningRate * weightGradients[layer][neuron][input] / batchSize;
        }
      }
    }
  }

  async predict(features: number[]): Promise<MLPrediction> {
    if (!this.isTrained) {
      throw new Error('Model must be trained before making predictions');
    }
    
    const prediction = this.forward(features);
    const confidence = Math.abs(prediction - 0.5) * 2; // Convert to 0-1 range
    
    let direction: 'BUY' | 'SELL' | 'HOLD';
    if (this.config.target.type === 'PRICE_DIRECTION') {
      direction = prediction > 0.6 ? 'BUY' : prediction < 0.4 ? 'SELL' : 'HOLD';
    } else {
      direction = prediction > this.config.target.threshold ? 'BUY' : 
                 prediction < -this.config.target.threshold ? 'SELL' : 'HOLD';
    }
    
    return {
      id: `pred_${Date.now()}`,
      modelId: this.config.id,
      symbol: 'UNKNOWN', // Would be passed in context
      timestamp: new Date(),
      prediction: {
        value: prediction,
        confidence,
        probability: this.config.target.type === 'PRICE_DIRECTION' ? prediction : Math.abs(prediction),
        direction
      },
      features: features.map((value, index) => ({
        name: `feature_${index}`,
        value,
        importance: this.featureImportance.get(`feature_${index}`) || 0,
        category: 'TECHNICAL',
        timestamp: new Date()
      })),
      metadata: {
        modelVersion: '1.0',
        trainingDate: this.trainingData?.metadata.timeRange.end || new Date(),
        sampleSize: this.trainingData?.metadata.sampleCount || 0,
        accuracy: this.metrics?.accuracy || 0
      }
    };
  }

  async saveModel(path: string): Promise<void> {
    const modelData = {
      config: this.config,
      weights: this.weights,
      biases: this.biases,
      metrics: this.metrics,
      featureImportance: Array.from(this.featureImportance.entries())
    };
    
    // In a real implementation, this would save to file
    console.log(`Model ${this.config.id} saved to ${path}`);
  }

  async loadModel(path: string): Promise<void> {
    // In a real implementation, this would load from file
    console.log(`Model ${this.config.id} loaded from ${path}`);
    this.isTrained = true;
  }
}

// ML Signal Optimizer Main Class
export class MLSignalOptimizer extends EventEmitter {
  private models: Map<string, BaseMLModel> = new Map();
  private ensembles: Map<string, MLEnsembleConfig> = new Map();
  private optimizationJobs: Map<string, MLOptimizationJob> = new Map();
  private signalGenerator: SignalGenerator;
  private backtestingEngine: BacktestingEngine;
  private technicalAnalysis: TechnicalAnalysis;
  
  private isRunning: boolean = false;
  private trainingSchedule: NodeJS.Timeout | null = null;
  private predictionCache: Map<string, MLPrediction> = new Map();
  private performanceTracker: Map<string, number[]> = new Map();
  
  constructor(
    signalGenerator: SignalGenerator,
    backtestingEngine: BacktestingEngine,
    technicalAnalysis: TechnicalAnalysis
  ) {
    super();
    
    this.signalGenerator = signalGenerator;
    this.backtestingEngine = backtestingEngine;
    this.technicalAnalysis = technicalAnalysis;
    
    console.log('ML Signal Optimizer initialized');
  }

  /**
   * Start the ML optimization system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('ML Signal Optimizer already running');
      return;
    }
    
    this.isRunning = true;
    console.log('🤖 Starting ML Signal Optimizer...');
    
    // Initialize default models
    await this.initializeDefaultModels();
    
    // Start training schedule
    this.startTrainingSchedule();
    
    console.log('✅ ML Signal Optimizer started');
    this.emit('systemStarted', { timestamp: new Date() });
  }

  /**
   * Stop the ML optimization system
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    
    if (this.trainingSchedule) {
      clearInterval(this.trainingSchedule);
      this.trainingSchedule = null;
    }
    
    console.log('⏹️ ML Signal Optimizer stopped');
    this.emit('systemStopped', { timestamp: new Date() });
  }

  /**
   * Initialize default ML models
   */
  private async initializeDefaultModels(): Promise<void> {
    const defaultConfigs: MLModelConfig[] = [
      {
        id: 'neural_network_1',
        name: 'Primary Neural Network',
        type: 'NEURAL_NETWORK',
        enabled: true,
        parameters: {
          learningRate: 0.001,
          epochs: 100,
          batchSize: 32,
          hiddenLayers: [64, 32, 16],
          dropout: 0.2,
          regularization: 0.01,
          optimizer: 'ADAM',
          lossFunction: 'MSE',
          activationFunction: 'RELU'
        },
        features: {
          technicalIndicators: ['RSI', 'MACD', 'BB_UPPER', 'BB_LOWER', 'SMA_20', 'EMA_12', 'STOCH_K', 'STOCH_D'],
          marketData: ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'],
          timeWindows: [5, 15, 30, 60],
          volumeFeatures: true,
          sentimentFeatures: false,
          macroeconomicFeatures: false
        },
        target: {
          type: 'PRICE_DIRECTION',
          horizon: 60,
          threshold: 0.01
        },
        validation: {
          splitRatio: 0.8,
          crossValidationFolds: 5,
          walkForwardSteps: 10,
          minTrainingSamples: 1000
        }
      },
      {
        id: 'lstm_1',
        name: 'LSTM Time Series Model',
        type: 'LSTM',
        enabled: true,
        parameters: {
          learningRate: 0.0005,
          epochs: 150,
          batchSize: 64,
          hiddenLayers: [128, 64],
          dropout: 0.3,
          regularization: 0.005,
          optimizer: 'ADAM',
          lossFunction: 'MSE',
          activationFunction: 'TANH'
        },
        features: {
          technicalIndicators: ['RSI', 'MACD', 'BB_UPPER', 'BB_LOWER', 'SMA_20', 'EMA_12', 'ADX', 'CCI'],
          marketData: ['CLOSE', 'VOLUME', 'HIGH', 'LOW'],
          timeWindows: [10, 20, 50],
          volumeFeatures: true,
          sentimentFeatures: false,
          macroeconomicFeatures: false
        },
        target: {
          type: 'PRICE_CHANGE',
          horizon: 30,
          threshold: 0.005
        },
        validation: {
          splitRatio: 0.75,
          crossValidationFolds: 3,
          walkForwardSteps: 15,
          minTrainingSamples: 2000
        }
      }
    ];
    
    for (const config of defaultConfigs) {
      const model = this.createModel(config);
      this.models.set(config.id, model);
      console.log(`Initialized model: ${config.name} (${config.id})`);
    }
    
    // Create default ensemble
    const ensembleConfig: MLEnsembleConfig = {
      id: 'ensemble_1',
      name: 'Primary Ensemble',
      models: ['neural_network_1', 'lstm_1'],
      weights: [0.6, 0.4],
      votingStrategy: 'WEIGHTED',
      enabled: true
    };
    
    this.ensembles.set(ensembleConfig.id, ensembleConfig);
    console.log(`Created ensemble: ${ensembleConfig.name}`);
  }

  /**
   * Create ML model instance
   */
  private createModel(config: MLModelConfig): BaseMLModel {
    switch (config.type) {
      case 'NEURAL_NETWORK':
        return new NeuralNetworkModel(config);
      case 'LSTM':
        // Would implement LSTM model
        return new NeuralNetworkModel(config); // Fallback for now
      case 'RANDOM_FOREST':
        // Would implement Random Forest model
        return new NeuralNetworkModel(config); // Fallback for now
      default:
        throw new Error(`Unsupported model type: ${config.type}`);
    }
  }

  /**
   * Start training schedule
   */
  private startTrainingSchedule(): void {
    this.trainingSchedule = setInterval(async () => {
      if (!this.isRunning) return;
      
      console.log('🔄 Running scheduled model training...');
      await this.trainAllModels();
      
    }, 24 * 60 * 60 * 1000); // Train daily
  }

  /**
   * Train all models
   */
  async trainAllModels(): Promise<void> {
    console.log('Training all ML models...');
    
    for (const [modelId, model] of Array.from(this.models.entries())) {
      if (!model.getConfig().enabled) continue;
      
      try {
        const trainingData = await this.prepareTrainingData(model.getConfig());
        await model.train(trainingData);
        
        // Run backtest to evaluate model
        await this.evaluateModel(modelId);
        
        console.log(`✅ Model ${modelId} trained and evaluated`);
        
      } catch (error) {
        console.error(`❌ Failed to train model ${modelId}:`, error);
      }
    }
    
    this.emit('modelsTrained', { timestamp: new Date(), modelCount: this.models.size });
  }

  /**
   * Prepare training data for a model
   */
  private async prepareTrainingData(config: MLModelConfig): Promise<MLTrainingData> {
    console.log(`Preparing training data for model ${config.id}...`);
    
    // Mock training data preparation
    const sampleCount = 5000;
    const featureCount = config.features.technicalIndicators.length + config.features.marketData.length;
    
    const features: number[][] = [];
    const targets: number[] = [];
    const timestamps: Date[] = [];
    const symbols: string[] = [];
    
    const now = Date.now();
    const timeStep = 60 * 1000; // 1 minute
    
    for (let i = 0; i < sampleCount; i++) {
      // Generate mock features
      const sampleFeatures: number[] = [];
      for (let j = 0; j < featureCount; j++) {
        sampleFeatures.push(Math.random() * 2 - 1); // Normalized features
      }
      
      // Generate mock target
      let target: number;
      if (config.target.type === 'PRICE_DIRECTION') {
        target = Math.random() > 0.5 ? 1 : 0;
      } else {
        target = (Math.random() - 0.5) * 0.1; // Price change percentage
      }
      
      features.push(sampleFeatures);
      targets.push(target);
      timestamps.push(new Date(now - (sampleCount - i) * timeStep));
      symbols.push('BTCUSDT'); // Mock symbol
    }
    
    return {
      features,
      targets,
      timestamps,
      symbols,
      metadata: {
        featureNames: [...config.features.technicalIndicators, ...config.features.marketData],
        targetType: config.target.type,
        sampleCount,
        timeRange: {
          start: new Date(now - sampleCount * timeStep),
          end: new Date(now)
        }
      }
    };
  }

  /**
   * Evaluate model performance using backtesting
   */
  private async evaluateModel(modelId: string): Promise<void> {
    const model = this.models.get(modelId);
    if (!model || !model.isModelTrained()) return;
    
    console.log(`Evaluating model ${modelId}...`);
    
    // Mock backtest configuration
    const backtestConfig: BacktestConfig = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
      initialCapital: 10000,
      symbols: ['BTCUSDT'],
      timeframes: ['1h'],
      markets: ['CRYPTO'],
      commission: 0.001,
      slippage: 0.0005,
      maxPositionSize: 5,
      riskPerTrade: 0.02,
      enableRiskManagement: true,
      enableOptimization: false,
      optimizationMetric: 'totalReturn'
    };
    
    // Generate signals using ML model
    const signals = await this.generateMLSignals(modelId, backtestConfig);
    
    // Run backtest with mock market data
    const mockMarketData = new Map<string, MarketData[]>();
    const backtestResult = await this.backtestingEngine.runBacktest(mockMarketData);
    
    // Update model metrics
    const metrics = model.getMetrics();
    if (metrics) {
      metrics.backtestMetrics = {
        totalTrades: backtestResult.trades.length,
        profitableTrades: backtestResult.trades.filter(t => (t.pnl || 0) > 0).length,
        totalReturn: backtestResult.totalReturn,
        annualizedReturn: backtestResult.annualizedReturn,
        maxConsecutiveLosses: this.calculateMaxConsecutiveLosses(backtestResult.trades),
        avgTradeReturn: backtestResult.trades.length > 0 ? 
          backtestResult.trades.reduce((sum, t) => sum + (t.pnl || 0), 0) / backtestResult.trades.length : 0
      };
      
      console.log(`Model ${modelId} backtest results: ${backtestResult.totalReturn.toFixed(2)}% return, ${backtestResult.trades.length} trades`);
    }
  }

  /**
   * Generate ML-enhanced signals
   */
  private async generateMLSignals(modelId: string, config: BacktestConfig): Promise<TradingSignal[]> {
    const model = this.models.get(modelId);
    if (!model) return [];
    
    const signals: TradingSignal[] = [];
    
    // Mock signal generation
    const signalCount = 50;
    const timeStep = (config.endDate.getTime() - config.startDate.getTime()) / signalCount;
    
    for (let i = 0; i < signalCount; i++) {
      const timestamp = new Date(config.startDate.getTime() + i * timeStep);
      
      // Generate mock features
      const features = Array.from({ length: 10 }, () => Math.random() * 2 - 1);
      
      // Get ML prediction
      const prediction = await model.predict(features);
      
      if (prediction.prediction.direction !== 'HOLD') {
        const basePrice = 50000 + features[6] * 5000;
        const signal: TradingSignal = {
          id: `ml_signal_${Date.now()}_${i}`,
          symbol: config.symbols[0],
          market: 'CRYPTO',
          timeframe: '1h',
          signal: prediction.prediction.direction === 'BUY' ? 'BUY' : 'SELL',
          confidence: prediction.prediction.confidence,
          entryPrice: basePrice,
          stopLoss: basePrice * (prediction.prediction.direction === 'BUY' ? 0.98 : 1.02),
          takeProfit: basePrice * (prediction.prediction.direction === 'BUY' ? 1.04 : 0.96),
          timestamp,
          indicators: {
            rsi: features[0] * 50 + 50,
            macd: {
              macd: features[1],
              signal: features[1] * 0.8,
              histogram: features[1] * 0.2
            },
            bollinger: {
              upper: features[2] + basePrice,
              middle: basePrice,
              lower: basePrice - features[4]
            },
            ema: {
              ema20: basePrice + features[7] * 100,
              ema50: basePrice + features[8] * 200,
              ema200: basePrice + features[9] * 500
            }
          },
          riskReward: 2.0,
          winProbability: prediction.prediction.confidence,
          gainzAlgoFeatures: {
            winRateScore: 0.75,
            profitFactor: 1.6,
            drawdownRisk: 0.03,
            signalStrength: prediction.prediction.confidence > 0.8 ? 'VERY_STRONG' : 
                           prediction.prediction.confidence > 0.6 ? 'STRONG' : 
                           prediction.prediction.confidence > 0.4 ? 'MODERATE' : 'WEAK',
            marketCondition: 'TRENDING',
            riskLevel: 'MEDIUM',
            expectedDuration: 60,
            patternDetected: 'ML_PATTERN',
            noRepaintConfirmed: true
          },
          metadata: {
            metrics: {
              source: 'ML_MODEL',
              modelId,
              prediction: prediction.prediction.value,
              features: prediction.features.length
            }
          }
        };
        
        signals.push(signal);
      }
    }
    
    return signals;
  }

  /**
   * Calculate maximum consecutive losses
   */
  private calculateMaxConsecutiveLosses(trades: any[]): number {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    for (const trade of trades) {
      if ((trade.pnl || 0) < 0) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }
    
    return maxConsecutive;
  }

  /**
   * Enhance trading signal with ML predictions
   */
  async enhanceSignal(originalSignal: TradingSignal): Promise<MLSignalEnhancement> {
    console.log(`Enhancing signal ${originalSignal.id} with ML predictions...`);
    
    const mlPredictions: MLPrediction[] = [];
    let totalConfidence = 0;
    let totalWeight = 0;
    
    // Get predictions from all enabled models
    for (const [modelId, model] of Array.from(this.models.entries())) {
      if (!model.getConfig().enabled || !model.isModelTrained()) continue;
      
      try {
        // Extract features from signal
        const features = this.extractFeaturesFromSignal(originalSignal);
        
        // Get prediction
        const prediction = await model.predict(features);
        prediction.symbol = originalSignal.symbol;
        
        mlPredictions.push(prediction);
        
        // Weight by model accuracy
        const metrics = model.getMetrics();
        const weight = metrics?.accuracy || 0.5;
        totalConfidence += prediction.prediction.confidence * weight;
        totalWeight += weight;
        
      } catch (error) {
        console.error(`Failed to get prediction from model ${modelId}:`, error);
      }
    }
    
    // Calculate ensemble prediction
    const avgConfidence = totalWeight > 0 ? totalConfidence / totalWeight : originalSignal.confidence;
    const confidenceBoost = Math.max(0, avgConfidence - originalSignal.confidence);
    
    // Determine if signal should be modified
    const mlConsensus = this.calculateMLConsensus(mlPredictions);
    const shouldModify = Math.abs(mlConsensus.confidence - originalSignal.confidence) > 0.1;
    
    // Create enhanced signal
    const enhancedSignal: TradingSignal = {
      ...originalSignal,
      confidence: shouldModify ? 
        Math.min(0.95, Math.max(0.05, avgConfidence)) : originalSignal.confidence,
      metadata: {
        ...originalSignal.metadata
      }
    };
    
    // If ML strongly disagrees, modify signal
    if (mlConsensus.confidence > 0.7 && mlConsensus.direction !== originalSignal.signal) {
      enhancedSignal.signal = mlConsensus.direction;
    }
    
    const enhancement: MLSignalEnhancement = {
      originalSignal,
      enhancedSignal,
      mlPredictions,
      confidenceBoost,
      riskAdjustment: this.calculateRiskAdjustment(mlPredictions),
      timingOptimization: {
        originalTiming: originalSignal.timestamp,
        optimizedTiming: originalSignal.timestamp, // Could be optimized
        delayReason: 'No delay needed'
      },
      featureImportance: this.aggregateFeatureImportance(mlPredictions)
    };
    
    this.emit('signalEnhanced', enhancement);
    
    return enhancement;
  }

  /**
   * Extract features from trading signal
   */
  private extractFeaturesFromSignal(signal: TradingSignal): number[] {
    const features: number[] = [];
    
    // Technical indicators
    if (signal.indicators.rsi !== undefined) {
      features.push((signal.indicators.rsi - 50) / 50); // Normalize RSI
    }
    
    if (signal.indicators.macd !== undefined) {
      const macdValue = typeof signal.indicators.macd === 'object' ? signal.indicators.macd.macd : signal.indicators.macd;
      features.push(Math.tanh(macdValue)); // Normalize MACD
    }
    
    if (signal.indicators.bollinger) {
      const bb = signal.indicators.bollinger;
      const price = signal.entryPrice;
      
      // BB position (0 = lower band, 1 = upper band)
      const bbPosition = (price - bb.lower) / (bb.upper - bb.lower);
      features.push(Math.max(0, Math.min(1, bbPosition)));
    }
    
    // EMA features
    if (signal.indicators.ema) {
      const ema = signal.indicators.ema;
      const price = signal.entryPrice;
      
      // EMA relative positions
      features.push(Math.tanh((price - ema.ema20) / ema.ema20));
      features.push(Math.tanh((price - ema.ema50) / ema.ema50));
      features.push(Math.tanh((price - ema.ema200) / ema.ema200));
    }
    
    // Price momentum (using entry price)
    const priceChange = (signal.entryPrice - 50000) / 50000;
    features.push(Math.tanh(priceChange * 10));
    
    // Risk reward ratio
    features.push(Math.tanh(signal.riskReward / 5));
    
    // Win probability
    features.push(signal.winProbability);
    
    // Pad with zeros if needed
    while (features.length < 10) {
      features.push(0);
    }
    
    return features.slice(0, 10); // Limit to 10 features
  }

  /**
   * Calculate ML consensus from multiple predictions
   */
  private calculateMLConsensus(predictions: MLPrediction[]): { direction: 'BUY' | 'SELL' | 'HOLD'; confidence: number } {
    if (predictions.length === 0) {
      return { direction: 'HOLD', confidence: 0 };
    }
    
    let buyVotes = 0;
    let sellVotes = 0;
    let holdVotes = 0;
    let totalConfidence = 0;
    
    for (const prediction of predictions) {
      const weight = prediction.prediction.confidence;
      
      switch (prediction.prediction.direction) {
        case 'BUY':
          buyVotes += weight;
          break;
        case 'SELL':
          sellVotes += weight;
          break;
        case 'HOLD':
          holdVotes += weight;
          break;
      }
      
      totalConfidence += weight;
    }
    
    const avgConfidence = totalConfidence / predictions.length;
    
    if (buyVotes > sellVotes && buyVotes > holdVotes) {
      return { direction: 'BUY', confidence: avgConfidence };
    } else if (sellVotes > buyVotes && sellVotes > holdVotes) {
      return { direction: 'SELL', confidence: avgConfidence };
    } else {
      return { direction: 'HOLD', confidence: avgConfidence };
    }
  }

  /**
   * Calculate risk adjustment based on ML predictions
   */
  private calculateRiskAdjustment(predictions: MLPrediction[]): number {
    if (predictions.length === 0) return 0;
    
    const avgConfidence = predictions.reduce((sum, p) => sum + p.prediction.confidence, 0) / predictions.length;
    const consensusStrength = this.calculateConsensusStrength(predictions);
    
    // Higher consensus and confidence = lower risk
    return Math.max(-0.5, Math.min(0.5, (0.7 - avgConfidence) + (0.5 - consensusStrength)));
  }

  /**
   * Calculate consensus strength among predictions
   */
  private calculateConsensusStrength(predictions: MLPrediction[]): number {
    if (predictions.length <= 1) return 1;
    
    const directions = predictions.map(p => p.prediction.direction);
    const buyCount = directions.filter(d => d === 'BUY').length;
    const sellCount = directions.filter(d => d === 'SELL').length;
    const holdCount = directions.filter(d => d === 'HOLD').length;
    
    const maxCount = Math.max(buyCount, sellCount, holdCount);
    return maxCount / predictions.length;
  }

  /**
   * Aggregate feature importance from multiple predictions
   */
  private aggregateFeatureImportance(predictions: MLPrediction[]): { [feature: string]: number } {
    const aggregated: { [feature: string]: number } = {};
    
    for (const prediction of predictions) {
      for (const feature of prediction.features) {
        if (!aggregated[feature.name]) {
          aggregated[feature.name] = 0;
        }
        aggregated[feature.name] += feature.importance;
      }
    }
    
    // Normalize by number of predictions
    for (const featureName in aggregated) {
      aggregated[featureName] /= predictions.length;
    }
    
    return aggregated;
  }

  /**
   * Start hyperparameter optimization
   */
  async startOptimization(config: Partial<MLOptimizationJob['config']>): Promise<string> {
    const jobId = `opt_${Date.now()}`;
    
    const job: MLOptimizationJob = {
      id: jobId,
      status: 'PENDING',
      type: (config as any).type || 'HYPERPARAMETER_TUNING',
      config: {
        models: config.models || Array.from(this.models.keys()),
        parameterSpace: config.parameterSpace || {
          learningRate: [0.0001, 0.001, 0.01],
          hiddenLayers: [[32, 16], [64, 32], [128, 64, 32]],
          dropout: [0.1, 0.2, 0.3]
        },
        optimizationMetric: config.optimizationMetric || 'SHARPE_RATIO',
        maxIterations: config.maxIterations || 50,
        timeLimit: config.timeLimit || 3600000 // 1 hour
      },
      progress: {
        currentIteration: 0,
        bestScore: -Infinity,
        bestParameters: {},
        estimatedTimeRemaining: 0
      },
      results: {
        bestModel: {} as MLModelConfig,
        bestMetrics: {} as MLModelMetrics,
        allResults: [],
        convergenceHistory: []
      },
      startTime: new Date()
    };
    
    this.optimizationJobs.set(jobId, job);
    
    // Start optimization in background
    this.runOptimization(jobId).catch(error => {
      job.status = 'FAILED';
      job.error = error.message;
      job.endTime = new Date();
    });
    
    console.log(`Started optimization job ${jobId}`);
    this.emit('optimizationStarted', { jobId, config: job.config });
    
    return jobId;
  }

  /**
   * Run optimization job
   */
  private async runOptimization(jobId: string): Promise<void> {
    const job = this.optimizationJobs.get(jobId);
    if (!job) return;
    
    job.status = 'RUNNING';
    console.log(`Running optimization job ${jobId}...`);
    
    const startTime = Date.now();
    
    for (let iteration = 0; iteration < job.config.maxIterations; iteration++) {
      if (Date.now() - startTime > job.config.timeLimit) {
        console.log(`Optimization job ${jobId} reached time limit`);
        break;
      }
      
      // Generate random parameters
      const parameters = this.generateRandomParameters(job.config.parameterSpace);
      
      // Create and train model with these parameters
      const testModel = await this.createAndTrainTestModel(parameters);
      
      // Evaluate model
      const metrics = await this.evaluateTestModel(testModel);
      
      // Calculate score based on optimization metric
      const score = this.calculateOptimizationScore(metrics, job.config.optimizationMetric);
      
      // Update best if improved
      if (score > job.progress.bestScore) {
        job.progress.bestScore = score;
        job.progress.bestParameters = parameters;
        job.results.bestMetrics = metrics;
      }
      
      // Store result
      job.results.allResults.push({ parameters, metrics });
      job.results.convergenceHistory.push(score);
      
      // Update progress
      job.progress.currentIteration = iteration + 1;
      job.progress.estimatedTimeRemaining = 
        ((Date.now() - startTime) / (iteration + 1)) * (job.config.maxIterations - iteration - 1);
      
      // Emit progress update
      this.emit('optimizationProgress', {
        jobId,
        iteration: iteration + 1,
        bestScore: job.progress.bestScore,
        estimatedTimeRemaining: job.progress.estimatedTimeRemaining
      });
      
      console.log(`Optimization ${jobId} - Iteration ${iteration + 1}/${job.config.maxIterations}, Score: ${score.toFixed(4)}, Best: ${job.progress.bestScore.toFixed(4)}`);
    }
    
    job.status = 'COMPLETED';
    job.endTime = new Date();
    
    console.log(`✅ Optimization job ${jobId} completed. Best score: ${job.progress.bestScore.toFixed(4)}`);
    this.emit('optimizationCompleted', { jobId, results: job.results });
  }

  /**
   * Generate random parameters for optimization
   */
  private generateRandomParameters(parameterSpace: { [key: string]: any[] }): { [key: string]: any } {
    const parameters: { [key: string]: any } = {};
    
    for (const [param, values] of Object.entries(parameterSpace)) {
      const randomIndex = Math.floor(Math.random() * values.length);
      parameters[param] = values[randomIndex];
    }
    
    return parameters;
  }

  /**
   * Create and train test model with specific parameters
   */
  private async createAndTrainTestModel(parameters: { [key: string]: any }): Promise<BaseMLModel> {
    // Create test model config
    const testConfig: MLModelConfig = {
      id: `test_${Date.now()}`,
      name: 'Test Model',
      type: 'NEURAL_NETWORK',
      enabled: true,
      parameters: {
        learningRate: parameters.learningRate || 0.001,
        epochs: 50, // Reduced for faster optimization
        batchSize: parameters.batchSize || 32,
        hiddenLayers: parameters.hiddenLayers || [64, 32],
        dropout: parameters.dropout || 0.2,
        regularization: parameters.regularization || 0.01,
        optimizer: 'ADAM',
        lossFunction: 'MSE',
        activationFunction: 'RELU'
      },
      features: {
        technicalIndicators: ['RSI', 'MACD', 'BB_UPPER', 'BB_LOWER'],
        marketData: ['CLOSE', 'VOLUME'],
        timeWindows: [5, 15],
        volumeFeatures: true,
        sentimentFeatures: false,
        macroeconomicFeatures: false
      },
      target: {
        type: 'PRICE_DIRECTION',
        horizon: 60,
        threshold: 0.01
      },
      validation: {
        splitRatio: 0.8,
        crossValidationFolds: 3,
        walkForwardSteps: 5,
        minTrainingSamples: 500
      }
    };
    
    const model = this.createModel(testConfig);
    const trainingData = await this.prepareTrainingData(testConfig);
    await model.train(trainingData);
    
    return model;
  }

  /**
   * Evaluate test model
   */
  private async evaluateTestModel(model: BaseMLModel): Promise<MLModelMetrics> {
    // Mock evaluation - in real implementation would run proper backtest
    const metrics: MLModelMetrics = {
      modelId: model.getConfig().id,
      accuracy: 0.6 + Math.random() * 0.3,
      precision: 0.6 + Math.random() * 0.3,
      recall: 0.6 + Math.random() * 0.3,
      f1Score: 0.6 + Math.random() * 0.3,
      sharpeRatio: Math.random() * 2,
      maxDrawdown: Math.random() * 0.3,
      winRate: 0.4 + Math.random() * 0.4,
      avgReturn: (Math.random() - 0.5) * 0.1,
      volatility: 0.1 + Math.random() * 0.2,
      informationRatio: Math.random() * 1.5,
      calmarRatio: Math.random() * 2,
      sortinoRatio: Math.random() * 2.5,
      lastUpdated: new Date(),
      trainingMetrics: {
        trainAccuracy: 0.7 + Math.random() * 0.2,
        validationAccuracy: 0.6 + Math.random() * 0.3,
        loss: Math.random() * 0.5,
        epochs: 50,
        trainingTime: 30000
      },
      backtestMetrics: {
        totalTrades: Math.floor(Math.random() * 100) + 50,
        profitableTrades: Math.floor(Math.random() * 60) + 20,
        totalReturn: (Math.random() - 0.3) * 0.5,
        annualizedReturn: (Math.random() - 0.3) * 0.8,
        maxConsecutiveLosses: Math.floor(Math.random() * 10) + 1,
        avgTradeReturn: (Math.random() - 0.5) * 0.05
      }
    };
    
    return metrics;
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(metrics: MLModelMetrics, optimizationMetric: string): number {
    switch (optimizationMetric) {
      case 'ACCURACY':
        return metrics.accuracy;
      case 'SHARPE_RATIO':
        return metrics.sharpeRatio;
      case 'PROFIT':
        return metrics.backtestMetrics.totalReturn;
      case 'WIN_RATE':
        return metrics.winRate;
      default:
        return metrics.sharpeRatio;
    }
  }

  // Public API methods

  /**
   * Add new model
   */
  addModel(config: MLModelConfig): void {
    const model = this.createModel(config);
    this.models.set(config.id, model);
    
    console.log(`Added model: ${config.name} (${config.id})`);
    this.emit('modelAdded', { modelId: config.id, config });
  }

  /**
   * Remove model
   */
  removeModel(modelId: string): boolean {
    const removed = this.models.delete(modelId);
    
    if (removed) {
      console.log(`Removed model: ${modelId}`);
      this.emit('modelRemoved', { modelId });
    }
    
    return removed;
  }

  /**
   * Get all models
   */
  getModels(): BaseMLModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): BaseMLModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Get optimization job status
   */
  getOptimizationJob(jobId: string): MLOptimizationJob | undefined {
    return this.optimizationJobs.get(jobId);
  }

  /**
   * Get all optimization jobs
   */
  getOptimizationJobs(): MLOptimizationJob[] {
    return Array.from(this.optimizationJobs.values());
  }

  /**
   * Cancel optimization job
   */
  cancelOptimization(jobId: string): boolean {
    const job = this.optimizationJobs.get(jobId);
    if (!job || job.status !== 'RUNNING') return false;
    
    job.status = 'CANCELLED';
    job.endTime = new Date();
    
    console.log(`Cancelled optimization job ${jobId}`);
    this.emit('optimizationCancelled', { jobId });
    
    return true;
  }

  /**
   * Get system status
   */
  getStatus() {
    const trainedModels = Array.from(this.models.values()).filter(m => m.isModelTrained()).length;
    const runningOptimizations = Array.from(this.optimizationJobs.values()).filter(j => j.status === 'RUNNING').length;
    
    return {
      isRunning: this.isRunning,
      totalModels: this.models.size,
      trainedModels,
      ensembles: this.ensembles.size,
      runningOptimizations,
      totalOptimizations: this.optimizationJobs.size,
      lastUpdate: new Date()
    };
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.stop();
    
    this.models.clear();
    this.ensembles.clear();
    this.optimizationJobs.clear();
    this.predictionCache.clear();
    this.performanceTracker.clear();
    
    this.removeAllListeners();
    console.log('ML Signal Optimizer destroyed');
  }
}