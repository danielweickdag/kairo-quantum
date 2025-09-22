export interface RiskParameters {
  maxPositionSize: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  stopLossPercentage: number;
  takeProfitRatio: number;
  maxOpenPositions: number;
  riskPerTrade: number;
}

export interface RiskAssessment {
  canTrade: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  warnings: string[];
  recommendations: string[];
  riskScore: number;
}

export interface PositionSizeResult {
  recommendedSize: number;
  maxAllowedSize: number;
  riskAmount: number;
  reasoning: string;
}

export class RiskManager {
  private defaultRiskParams: RiskParameters;
  private isInitialized: boolean = false;

  constructor() {
    this.defaultRiskParams = {
      maxPositionSize: 10, // 10% of portfolio
      maxDailyLoss: 2, // 2% daily loss limit
      maxDrawdown: 15, // 15% maximum drawdown
      stopLossPercentage: 2, // 2% stop loss
      takeProfitRatio: 2, // 2:1 reward to risk ratio
      maxOpenPositions: 5,
      riskPerTrade: 1 // 1% risk per trade
    };
  }

  async initialize(): Promise<void> {
    // Initialize risk management system
    // Load user-specific risk parameters if needed
    this.isInitialized = true;
  }

  async evaluateSignal(signal: any): Promise<{ approved: boolean; reason?: string; adjustedSize?: number }> {
    if (!this.isInitialized) {
      return { approved: false, reason: 'Risk manager not initialized' };
    }

    // Basic signal evaluation logic
    // Check if signal meets minimum confidence threshold
    if (signal.confidence < 0.7) {
      return { approved: false, reason: 'Signal confidence too low' };
    }

    // Check risk-reward ratio
    if (signal.riskReward < 1.5) {
      return { approved: false, reason: 'Risk-reward ratio too low' };
    }

    // Check win probability
    if (signal.winProbability < 0.6) {
      return { approved: false, reason: 'Win probability too low' };
    }

    // Signal approved
    return { 
      approved: true, 
      adjustedSize: this.calculateAdjustedPositionSize(signal)
    };
  }

  private calculateAdjustedPositionSize(signal: any): number {
    // Calculate position size based on signal confidence and risk parameters
    const baseSize = this.defaultRiskParams.riskPerTrade;
    const confidenceMultiplier = signal.confidence;
    const riskRewardMultiplier = Math.min(signal.riskReward / 2, 1.5);
    
    return baseSize * confidenceMultiplier * riskRewardMultiplier;
  }

  calculatePositionSize(
    portfolioValue: number,
    entryPrice: number,
    stopLossPrice: number,
    riskPercentage?: number
  ): PositionSizeResult {
    const riskPercent = riskPercentage || this.defaultRiskParams.riskPerTrade;
    const riskAmount = portfolioValue * (riskPercent / 100);
    const priceRisk = Math.abs(entryPrice - stopLossPrice);
    
    if (priceRisk === 0) {
      return {
        recommendedSize: 0,
        maxAllowedSize: 0,
        riskAmount: 0,
        reasoning: 'Invalid stop loss price'
      };
    }

    const recommendedSize = riskAmount / priceRisk;
    const maxPositionValue = portfolioValue * (this.defaultRiskParams.maxPositionSize / 100);
    const maxAllowedSize = maxPositionValue / entryPrice;

    return {
      recommendedSize: Math.min(recommendedSize, maxAllowedSize),
      maxAllowedSize,
      riskAmount,
      reasoning: `Risk ${riskPercent}% of portfolio (${riskAmount.toFixed(2)}) with ${priceRisk.toFixed(2)} price risk`
    };
  }

  assessRisk(
    portfolioValue: number,
    dailyPnL: number,
    openPositions: number,
    currentDrawdown: number
  ): RiskAssessment {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Check daily loss
    const dailyLossPercentage = Math.abs(dailyPnL / portfolioValue) * 100;
    if (dailyLossPercentage > this.defaultRiskParams.maxDailyLoss) {
      warnings.push(`Daily loss (${dailyLossPercentage.toFixed(2)}%) exceeds limit`);
    }

    // Check drawdown
    if (currentDrawdown > this.defaultRiskParams.maxDrawdown) {
      warnings.push(`Drawdown (${currentDrawdown.toFixed(2)}%) exceeds limit`);
    }

    // Check open positions
    if (openPositions >= this.defaultRiskParams.maxOpenPositions) {
      warnings.push(`Maximum open positions (${this.defaultRiskParams.maxOpenPositions}) reached`);
    }

    // Determine risk level and score
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'LOW';
    let riskScore = 0;
    
    if (warnings.length === 0) {
      riskLevel = 'LOW';
      riskScore = 25;
      recommendations.push('Portfolio risk is within acceptable limits');
    } else if (warnings.length <= 1) {
      riskLevel = 'MEDIUM';
      riskScore = 50;
      recommendations.push('Consider reducing position sizes');
    } else if (warnings.length <= 2) {
      riskLevel = 'HIGH';
      riskScore = 75;
      recommendations.push('Reduce exposure and review risk parameters');
    } else {
      riskLevel = 'EXTREME';
      riskScore = 100;
      recommendations.push('Stop trading and reassess strategy');
    }

    const canTrade = riskLevel !== 'EXTREME' && dailyLossPercentage < this.defaultRiskParams.maxDailyLoss;

    return {
      canTrade,
      riskLevel,
      warnings,
      recommendations,
      riskScore
    };
  }

  getRiskParameters(): RiskParameters {
    return { ...this.defaultRiskParams };
  }

  updateRiskParameters(params: Partial<RiskParameters>): void {
    this.defaultRiskParams = { ...this.defaultRiskParams, ...params };
  }
}

export default RiskManager;