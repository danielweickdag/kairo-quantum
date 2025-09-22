import { EventEmitter } from 'events';
import { TradingSignal, TradeResult, MarketData } from './types';
import { PortfolioTracker } from './portfolioTracker';
import { AdvancedAlertSystem } from './advancedAlertSystem';

export interface TraderProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: Date;
  verified: boolean;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  badges: string[];
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
  preferences: {
    publicProfile: boolean;
    shareSignals: boolean;
    allowCopying: boolean;
    sharePerformance: boolean;
    receiveMessages: boolean;
  };
  subscription: {
    plan: 'FREE' | 'BASIC' | 'PRO' | 'PREMIUM';
    expiresAt?: Date;
    features: string[];
  };
}

export interface TraderStats {
  traderId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
  sortinoRatio: number;
  avgTradeReturn: number;
  avgHoldingTime: number;
  profitFactor: number;
  riskScore: number;
  consistency: number;
  volatility: number;
  followers: number;
  copiers: number;
  signalsShared: number;
  signalsAccuracy: number;
  lastActive: Date;
  performanceHistory: {
    date: Date;
    return: number;
    drawdown: number;
    trades: number;
  }[];
  monthlyReturns: {
    month: string;
    return: number;
    trades: number;
  }[];
}

export interface SharedSignal {
  id: string;
  traderId: string;
  originalSignal: TradingSignal;
  shareTimestamp: Date;
  description?: string;
  tags: string[];
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PREMIUM' | 'PRIVATE';
  price?: number; // For paid signals
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  views: number;
  performance: {
    executed: number;
    profitable: number;
    avgReturn: number;
    maxReturn: number;
    minReturn: number;
  };
  metadata: {
    confidence: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    timeframe: string;
    expectedDuration: number;
    stopLoss?: number;
    takeProfit?: number;
  };
}

export interface CopyTradingConfig {
  id: string;
  followerId: string;
  traderId: string;
  enabled: boolean;
  copyMode: 'SIGNALS_ONLY' | 'AUTO_COPY' | 'PROPORTIONAL' | 'FIXED_AMOUNT';
  allocation: {
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'RISK_BASED';
    value: number;
    maxRiskPerTrade: number;
    maxDailyRisk: number;
  };
  filters: {
    minConfidence: number;
    maxRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    symbols: string[];
    markets: string[];
    excludeSymbols: string[];
    timeframes: string[];
  };
  riskManagement: {
    stopLoss: boolean;
    takeProfit: boolean;
    trailingStop: boolean;
    maxSlippage: number;
    maxLatency: number;
  };
  schedule: {
    enabled: boolean;
    timezone: string;
    tradingHours: {
      start: string;
      end: string;
      days: number[];
    }[];
  };
  notifications: {
    onCopy: boolean;
    onProfit: boolean;
    onLoss: boolean;
    onError: boolean;
  };
  createdAt: Date;
  lastModified: Date;
}

export interface CopyTradeExecution {
  id: string;
  copyConfigId: string;
  originalSignal: TradingSignal;
  copiedSignal: TradingSignal;
  followerId: string;
  traderId: string;
  executionTime: Date;
  latency: number;
  slippage: number;
  amount: number;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
  result?: TradeResult;
  fees: {
    platform: number;
    trader: number;
    exchange: number;
  };
  error?: string;
}

export interface SocialFeed {
  id: string;
  type: 'SIGNAL' | 'TRADE' | 'PERFORMANCE' | 'ANNOUNCEMENT' | 'DISCUSSION';
  authorId: string;
  content: {
    text?: string;
    signal?: SharedSignal;
    trade?: TradeResult;
    performance?: {
      period: string;
      return: number;
      trades: number;
    };
    media?: {
      type: 'IMAGE' | 'VIDEO' | 'CHART';
      url: string;
      caption?: string;
    }[];
  };
  timestamp: Date;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PREMIUM';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  tags: string[];
  mentions: string[];
}

export interface SocialComment {
  id: string;
  feedId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: SocialComment[];
  edited: boolean;
  editedAt?: Date;
}

export interface TraderRanking {
  rank: number;
  traderId: string;
  score: number;
  category: 'OVERALL' | 'RETURNS' | 'CONSISTENCY' | 'RISK_ADJUSTED' | 'SIGNALS';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ALL_TIME';
  change: number; // Change in rank
  metrics: {
    return: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    followers: number;
  };
}

export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  type: 'PUBLIC' | 'PRIVATE' | 'PREMIUM';
  category: 'GENERAL' | 'CRYPTO' | 'FOREX' | 'STOCKS' | 'COMMODITIES' | 'STRATEGY';
  creatorId: string;
  moderators: string[];
  members: {
    userId: string;
    role: 'MEMBER' | 'MODERATOR' | 'ADMIN';
    joinedAt: Date;
  }[];
  rules: string[];
  tags: string[];
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalPosts: number;
    totalSignals: number;
  };
  createdAt: Date;
  lastActivity: Date;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'FOLLOW' | 'COPY' | 'LIKE' | 'COMMENT' | 'MENTION' | 'SIGNAL' | 'TRADE' | 'ACHIEVEMENT';
  title: string;
  message: string;
  data: any;
  read: boolean;
  timestamp: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  traderId: string;
  trader: TraderProfile;
  stats: TraderStats;
  score: number;
  change: number;
  badge?: string;
}

export interface SocialAnalytics {
  userId: string;
  period: { start: Date; end: Date };
  metrics: {
    profileViews: number;
    signalViews: number;
    signalLikes: number;
    signalShares: number;
    newFollowers: number;
    newCopiers: number;
    totalEngagement: number;
    reachGrowth: number;
    conversionRate: number;
  };
  topSignals: {
    signalId: string;
    views: number;
    engagement: number;
    performance: number;
  }[];
  audienceInsights: {
    demographics: {
      countries: { [country: string]: number };
      experience: { [level: string]: number };
      interests: { [interest: string]: number };
    };
    behavior: {
      activeHours: number[];
      activeDays: number[];
      avgSessionTime: number;
    };
  };
}

export class SocialTradingPlatform extends EventEmitter {
  private traders: Map<string, TraderProfile> = new Map();
  private traderStats: Map<string, TraderStats> = new Map();
  private sharedSignals: Map<string, SharedSignal> = new Map();
  private copyConfigs: Map<string, CopyTradingConfig> = new Map();
  private copyExecutions: Map<string, CopyTradeExecution> = new Map();
  private socialFeed: Map<string, SocialFeed> = new Map();
  private comments: Map<string, SocialComment[]> = new Map();
  private groups: Map<string, SocialGroup> = new Map();
  private notifications: Map<string, SocialNotification[]> = new Map();
  private followers: Map<string, Set<string>> = new Map(); // traderId -> follower IDs
  private following: Map<string, Set<string>> = new Map(); // userId -> following IDs
  
  private portfolioTracker: PortfolioTracker;
  private alertSystem: AdvancedAlertSystem;
  
  private isRunning: boolean = false;
  private feedUpdateInterval: NodeJS.Timeout | null = null;
  private rankingUpdateInterval: NodeJS.Timeout | null = null;
  private analyticsInterval: NodeJS.Timeout | null = null;
  
  constructor(
    portfolioTracker: PortfolioTracker,
    alertSystem: AdvancedAlertSystem
  ) {
    super();
    
    this.portfolioTracker = portfolioTracker;
    this.alertSystem = alertSystem;
    
    console.log('Social Trading Platform initialized');
  }

  /**
   * Start the social trading platform
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Social Trading Platform already running');
      return;
    }
    
    this.isRunning = true;
    console.log('🌐 Starting Social Trading Platform...');
    
    // Initialize demo data
    await this.initializeDemoData();
    
    // Start background processes
    this.startFeedUpdates();
    this.startRankingUpdates();
    this.startAnalyticsUpdates();
    
    console.log('✅ Social Trading Platform started');
    this.emit('platformStarted', { timestamp: new Date() });
  }

  /**
   * Stop the social trading platform
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    
    if (this.feedUpdateInterval) {
      clearInterval(this.feedUpdateInterval);
      this.feedUpdateInterval = null;
    }
    
    if (this.rankingUpdateInterval) {
      clearInterval(this.rankingUpdateInterval);
      this.rankingUpdateInterval = null;
    }
    
    if (this.analyticsInterval) {
      clearInterval(this.analyticsInterval);
      this.analyticsInterval = null;
    }
    
    console.log('⏹️ Social Trading Platform stopped');
    this.emit('platformStopped', { timestamp: new Date() });
  }

  /**
   * Initialize demo data
   */
  private async initializeDemoData(): Promise<void> {
    console.log('Initializing demo social trading data...');
    
    // Create demo traders
    const demoTraders = [
      {
        id: 'trader_1',
        username: 'cryptoking',
        displayName: 'Crypto King',
        bio: 'Professional crypto trader with 5+ years experience',
        tier: 'GOLD' as const,
        verified: true
      },
      {
        id: 'trader_2',
        username: 'forexmaster',
        displayName: 'Forex Master',
        bio: 'Forex specialist focusing on major pairs',
        tier: 'SILVER' as const,
        verified: true
      },
      {
        id: 'trader_3',
        username: 'stockpro',
        displayName: 'Stock Pro',
        bio: 'Long-term stock investor and swing trader',
        tier: 'PLATINUM' as const,
        verified: false
      }
    ];
    
    for (const traderData of demoTraders) {
      const trader: TraderProfile = {
        ...traderData,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${traderData.username}`,
        location: 'Global',
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        badges: ['Early Adopter', 'Consistent Performer'],
        socialLinks: {
          twitter: `@${traderData.username}`,
          telegram: `@${traderData.username}`
        },
        preferences: {
          publicProfile: true,
          shareSignals: true,
          allowCopying: true,
          sharePerformance: true,
          receiveMessages: true
        },
        subscription: {
          plan: 'PRO',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          features: ['Advanced Analytics', 'Signal Sharing', 'Copy Trading']
        }
      };
      
      this.traders.set(trader.id, trader);
      
      // Create demo stats
      const stats: TraderStats = {
        traderId: trader.id,
        totalTrades: Math.floor(Math.random() * 500) + 100,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0.55 + Math.random() * 0.3,
        totalReturn: (Math.random() - 0.2) * 100,
        annualizedReturn: (Math.random() - 0.1) * 50,
        maxDrawdown: Math.random() * 25,
        sharpeRatio: Math.random() * 2 + 0.5,
        calmarRatio: Math.random() * 1.5 + 0.5,
        sortinoRatio: Math.random() * 2 + 1,
        avgTradeReturn: (Math.random() - 0.4) * 5,
        avgHoldingTime: Math.random() * 48 + 2,
        profitFactor: Math.random() * 2 + 1,
        riskScore: Math.random() * 10 + 1,
        consistency: Math.random() * 100,
        volatility: Math.random() * 30 + 10,
        followers: Math.floor(Math.random() * 1000) + 50,
        copiers: Math.floor(Math.random() * 200) + 10,
        signalsShared: Math.floor(Math.random() * 200) + 20,
        signalsAccuracy: 0.6 + Math.random() * 0.3,
        lastActive: new Date(),
        performanceHistory: [],
        monthlyReturns: []
      };
      
      stats.winningTrades = Math.floor(stats.totalTrades * stats.winRate);
      stats.losingTrades = stats.totalTrades - stats.winningTrades;
      
      this.traderStats.set(trader.id, stats);
      
      // Initialize followers
      this.followers.set(trader.id, new Set());
      this.following.set(trader.id, new Set());
    }
    
    // Create demo signals
    await this.createDemoSignals();
    
    // Create demo groups
    await this.createDemoGroups();
    
    console.log('Demo data initialized');
  }

  /**
   * Create demo signals
   */
  private async createDemoSignals(): Promise<void> {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'];
    const traderIds = Array.from(this.traders.keys());
    
    for (let i = 0; i < 20; i++) {
      const traderId = traderIds[Math.floor(Math.random() * traderIds.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      const originalSignal: TradingSignal = {
        id: `signal_${Date.now()}_${i}`,
        symbol,
        market: 'CRYPTO',
        timeframe: '1h',
        signal: Math.random() > 0.5 ? 'BUY' : 'SELL',
        confidence: Math.random() * 0.4 + 0.6,
        entryPrice: 50000 + (Math.random() - 0.5) * 10000,
        stopLoss: 48000,
        takeProfit: 55000,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        indicators: {
          rsi: Math.random() * 100,
          macd: {
            macd: (Math.random() - 0.5) * 2,
            signal: (Math.random() - 0.5) * 1.5,
            histogram: (Math.random() - 0.5) * 0.5
          },
          bollinger: {
            upper: 52000,
            middle: 50000,
            lower: 48000
          },
          ema: {
            ema20: 50500,
            ema50: 50200,
            ema200: 49800
          }
        },
        riskReward: 2.5,
        winProbability: Math.random() * 0.3 + 0.6,
        gainzAlgoFeatures: {
          winRateScore: Math.random() * 0.25 + 0.75,
          profitFactor: Math.random() * 0.8 + 1.6,
          drawdownRisk: Math.random() * 0.05,
          signalStrength: ['WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'][Math.floor(Math.random() * 4)] as 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG',
          marketCondition: ['TRENDING', 'RANGING', 'VOLATILE', 'STABLE'][Math.floor(Math.random() * 4)] as 'TRENDING' | 'RANGING' | 'VOLATILE' | 'STABLE',
          riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as 'LOW' | 'MEDIUM' | 'HIGH',
          expectedDuration: Math.random() * 240 + 60,
          patternDetected: 'BULLISH_BREAKOUT',
          noRepaintConfirmed: true
        }
      };
      
      const sharedSignal: SharedSignal = {
        id: `shared_${originalSignal.id}`,
        traderId,
        originalSignal,
        shareTimestamp: originalSignal.timestamp,
        description: `${originalSignal.signal} signal for ${symbol} based on technical analysis`,
        tags: ['crypto', 'technical-analysis', symbol.toLowerCase()],
        visibility: Math.random() > 0.3 ? 'PUBLIC' : (Math.random() > 0.5 ? 'FOLLOWERS' : 'PREMIUM'),
        likes: Math.floor(Math.random() * 50),
        dislikes: Math.floor(Math.random() * 5),
        comments: Math.floor(Math.random() * 20),
        shares: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 200) + 50,
        performance: {
          executed: Math.floor(Math.random() * 30) + 5,
          profitable: 0,
          avgReturn: (Math.random() - 0.4) * 10,
          maxReturn: Math.random() * 20,
          minReturn: -Math.random() * 15
        },
        metadata: {
          confidence: originalSignal.confidence,
          riskLevel: originalSignal.confidence > 0.8 ? 'LOW' : originalSignal.confidence > 0.6 ? 'MEDIUM' : 'HIGH',
          timeframe: '1h',
          expectedDuration: Math.random() * 24 + 1,
          stopLoss: originalSignal.signal === 'BUY' ? 0.95 : 1.05,
          takeProfit: originalSignal.signal === 'BUY' ? 1.1 : 0.9
        }
      };
      
      sharedSignal.performance.profitable = Math.floor(sharedSignal.performance.executed * (0.5 + Math.random() * 0.3));
      
      this.sharedSignals.set(sharedSignal.id, sharedSignal);
    }
  }

  /**
   * Create demo groups
   */
  private async createDemoGroups(): Promise<void> {
    const demoGroups = [
      {
        name: 'Crypto Traders United',
        description: 'Community for cryptocurrency traders to share insights and strategies',
        category: 'CRYPTO' as const,
        type: 'PUBLIC' as const
      },
      {
        name: 'Forex Professionals',
        description: 'Exclusive group for professional forex traders',
        category: 'FOREX' as const,
        type: 'PRIVATE' as const
      },
      {
        name: 'Technical Analysis Masters',
        description: 'Advanced technical analysis discussions and education',
        category: 'STRATEGY' as const,
        type: 'PREMIUM' as const
      }
    ];
    
    const traderIds = Array.from(this.traders.keys());
    
    for (let i = 0; i < demoGroups.length; i++) {
      const groupData = demoGroups[i];
      const creatorId = traderIds[i % traderIds.length];
      
      const group: SocialGroup = {
        id: `group_${Date.now()}_${i}`,
        ...groupData,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${groupData.name}`,
        creatorId,
        moderators: [creatorId],
        members: traderIds.slice(0, Math.floor(Math.random() * traderIds.length) + 1).map(userId => ({
          userId,
          role: userId === creatorId ? 'ADMIN' as const : 'MEMBER' as const,
          joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })),
        rules: [
          'Be respectful to all members',
          'No spam or promotional content',
          'Share quality trading insights',
          'Follow community guidelines'
        ],
        tags: [groupData.category.toLowerCase(), 'trading', 'community'],
        stats: {
          totalMembers: 0,
          activeMembers: 0,
          totalPosts: Math.floor(Math.random() * 100) + 20,
          totalSignals: Math.floor(Math.random() * 50) + 10
        },
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastActivity: new Date()
      };
      
      group.stats.totalMembers = group.members.length;
      group.stats.activeMembers = Math.floor(group.members.length * (0.3 + Math.random() * 0.4));
      
      this.groups.set(group.id, group);
    }
  }

  /**
   * Start feed updates
   */
  private startFeedUpdates(): void {
    this.feedUpdateInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      this.updateSocialFeed();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Start ranking updates
   */
  private startRankingUpdates(): void {
    this.rankingUpdateInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      this.updateRankings();
    }, 300000); // Update every 5 minutes
  }

  /**
   * Start analytics updates
   */
  private startAnalyticsUpdates(): void {
    this.analyticsInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      this.updateAnalytics();
    }, 3600000); // Update every hour
  }

  /**
   * Update social feed
   */
  private updateSocialFeed(): void {
    // Generate random feed updates
    const traderIds = Array.from(this.traders.keys());
    const feedTypes: SocialFeed['type'][] = ['SIGNAL', 'TRADE', 'PERFORMANCE', 'ANNOUNCEMENT'];
    
    if (Math.random() > 0.7) { // 30% chance of new feed item
      const authorId = traderIds[Math.floor(Math.random() * traderIds.length)];
      const type = feedTypes[Math.floor(Math.random() * feedTypes.length)];
      
      const feedItem: SocialFeed = {
        id: `feed_${Date.now()}`,
        type,
        authorId,
        content: this.generateFeedContent(type, authorId),
        timestamp: new Date(),
        visibility: 'PUBLIC',
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        tags: [],
        mentions: []
      };
      
      this.socialFeed.set(feedItem.id, feedItem);
      this.emit('feedUpdated', { feedItem });
    }
  }

  /**
   * Generate feed content
   */
  private generateFeedContent(type: SocialFeed['type'], authorId: string): SocialFeed['content'] {
    switch (type) {
      case 'SIGNAL':
        const signals = Array.from(this.sharedSignals.values()).filter(s => s.traderId === authorId);
        const signal = signals[Math.floor(Math.random() * signals.length)];
        return {
          text: `New trading signal shared!`,
          signal
        };
      
      case 'PERFORMANCE':
        return {
          text: `Monthly performance update`,
          performance: {
            period: 'This Month',
            return: (Math.random() - 0.3) * 20,
            trades: Math.floor(Math.random() * 50) + 10
          }
        };
      
      case 'ANNOUNCEMENT':
        const announcements = [
          'Just reached 1000 followers! Thank you all for the support! 🚀',
          'New trading strategy showing promising results in backtesting',
          'Market analysis: Expecting volatility in the coming week',
          'Updated my risk management approach for better consistency'
        ];
        return {
          text: announcements[Math.floor(Math.random() * announcements.length)]
        };
      
      default:
        return {
          text: 'General trading update'
        };
    }
  }

  /**
   * Update rankings
   */
  private updateRankings(): void {
    console.log('Updating trader rankings...');
    
    const rankings = this.calculateRankings('OVERALL', 'MONTHLY');
    this.emit('rankingsUpdated', { rankings, timestamp: new Date() });
  }

  /**
   * Update analytics
   */
  private updateAnalytics(): void {
    console.log('Updating social analytics...');
    
    for (const traderId of Array.from(this.traders.keys())) {
      const analytics = this.calculateAnalytics(traderId);
      this.emit('analyticsUpdated', { traderId, analytics });
    }
  }

  // Public API Methods

  /**
   * Create trader profile
   */
  async createTraderProfile(profileData: Partial<TraderProfile>): Promise<TraderProfile> {
    const profile: TraderProfile = {
      id: profileData.id || `trader_${Date.now()}`,
      username: profileData.username!,
      displayName: profileData.displayName || profileData.username!,
      avatar: profileData.avatar,
      bio: profileData.bio,
      location: profileData.location,
      joinDate: new Date(),
      verified: false,
      tier: 'BRONZE',
      badges: [],
      socialLinks: profileData.socialLinks || {},
      preferences: {
        publicProfile: true,
        shareSignals: true,
        allowCopying: true,
        sharePerformance: true,
        receiveMessages: true,
        ...profileData.preferences
      },
      subscription: {
        plan: 'FREE',
        features: ['Basic Features'],
        ...profileData.subscription
      }
    };
    
    this.traders.set(profile.id, profile);
    this.followers.set(profile.id, new Set());
    this.following.set(profile.id, new Set());
    
    // Initialize stats
    const stats: TraderStats = {
      traderId: profile.id,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalReturn: 0,
      annualizedReturn: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      calmarRatio: 0,
      sortinoRatio: 0,
      avgTradeReturn: 0,
      avgHoldingTime: 0,
      profitFactor: 0,
      riskScore: 5,
      consistency: 0,
      volatility: 0,
      followers: 0,
      copiers: 0,
      signalsShared: 0,
      signalsAccuracy: 0,
      lastActive: new Date(),
      performanceHistory: [],
      monthlyReturns: []
    };
    
    this.traderStats.set(profile.id, stats);
    
    console.log(`Created trader profile: ${profile.username} (${profile.id})`);
    this.emit('traderCreated', { trader: profile });
    
    return profile;
  }

  /**
   * Share trading signal
   */
  async shareSignal(traderId: string, signal: TradingSignal, shareData: Partial<SharedSignal>): Promise<SharedSignal> {
    const trader = this.traders.get(traderId);
    if (!trader) {
      throw new Error(`Trader ${traderId} not found`);
    }
    
    if (!trader.preferences.shareSignals) {
      throw new Error('Trader has disabled signal sharing');
    }
    
    const sharedSignal: SharedSignal = {
      id: `shared_${signal.id}`,
      traderId,
      originalSignal: signal,
      shareTimestamp: new Date(),
      description: shareData.description || `${signal.signal} signal for ${signal.symbol}`,
      tags: shareData.tags || [signal.market.toLowerCase(), signal.symbol.toLowerCase()],
      visibility: shareData.visibility || 'PUBLIC',
      price: shareData.price,
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      performance: {
        executed: 0,
        profitable: 0,
        avgReturn: 0,
        maxReturn: 0,
        minReturn: 0
      },
      metadata: {
        confidence: signal.confidence,
        riskLevel: signal.confidence > 0.8 ? 'LOW' : signal.confidence > 0.6 ? 'MEDIUM' : 'HIGH',
        timeframe: shareData.metadata?.timeframe || '1h',
        expectedDuration: shareData.metadata?.expectedDuration || 24,
        stopLoss: shareData.metadata?.stopLoss,
        takeProfit: shareData.metadata?.takeProfit
      }
    };
    
    this.sharedSignals.set(sharedSignal.id, sharedSignal);
    
    // Update trader stats
    const stats = this.traderStats.get(traderId);
    if (stats) {
      stats.signalsShared++;
      stats.lastActive = new Date();
    }
    
    // Create feed item
    const feedItem: SocialFeed = {
      id: `feed_${Date.now()}`,
      type: 'SIGNAL',
      authorId: traderId,
      content: {
        text: sharedSignal.description,
        signal: sharedSignal
      },
      timestamp: new Date(),
      visibility: sharedSignal.visibility === 'PRIVATE' ? 'FOLLOWERS' : sharedSignal.visibility,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      tags: sharedSignal.tags,
      mentions: []
    };
    
    this.socialFeed.set(feedItem.id, feedItem);
    
    console.log(`Signal shared by ${trader.username}: ${signal.symbol} ${signal.signal}`);
    this.emit('signalShared', { sharedSignal, feedItem });
    
    // Notify followers
    await this.notifyFollowers(traderId, {
      type: 'SIGNAL',
      title: 'New Signal',
      message: `${trader.displayName} shared a new ${signal.signal} signal for ${signal.symbol}`,
      data: { signalId: sharedSignal.id }
    });
    
    return sharedSignal;
  }

  /**
   * Create copy trading configuration
   */
  async createCopyConfig(followerId: string, traderId: string, config: Partial<CopyTradingConfig>): Promise<CopyTradingConfig> {
    const follower = this.traders.get(followerId);
    const trader = this.traders.get(traderId);
    
    if (!follower || !trader) {
      throw new Error('Follower or trader not found');
    }
    
    if (!trader.preferences.allowCopying) {
      throw new Error('Trader has disabled copy trading');
    }
    
    const copyConfig: CopyTradingConfig = {
      id: `copy_${Date.now()}`,
      followerId,
      traderId,
      enabled: config.enabled !== false,
      copyMode: config.copyMode || 'SIGNALS_ONLY',
      allocation: {
        type: 'PERCENTAGE',
        value: 10,
        maxRiskPerTrade: 2,
        maxDailyRisk: 5,
        ...config.allocation
      },
      filters: {
        minConfidence: 0.6,
        maxRiskLevel: 'MEDIUM',
        symbols: [],
        markets: [],
        excludeSymbols: [],
        timeframes: [],
        ...config.filters
      },
      riskManagement: {
        stopLoss: true,
        takeProfit: true,
        trailingStop: false,
        maxSlippage: 0.1,
        maxLatency: 5000,
        ...config.riskManagement
      },
      schedule: {
        enabled: false,
        timezone: 'UTC',
        tradingHours: [],
        ...config.schedule
      },
      notifications: {
        onCopy: true,
        onProfit: true,
        onLoss: true,
        onError: true,
        ...config.notifications
      },
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    this.copyConfigs.set(copyConfig.id, copyConfig);
    
    // Update stats
    const traderStats = this.traderStats.get(traderId);
    if (traderStats) {
      traderStats.copiers++;
    }
    
    console.log(`Copy config created: ${follower.username} -> ${trader.username}`);
    this.emit('copyConfigCreated', { copyConfig });
    
    // Notify trader
    await this.sendNotification(traderId, {
      type: 'COPY',
      title: 'New Copier',
      message: `${follower.displayName} started copying your trades`,
      data: { copyConfigId: copyConfig.id }
    });
    
    return copyConfig;
  }

  /**
   * Execute copy trade based on original signal
   */
  async executeCopyTrade(originalSignal: TradingSignal, traderId: string): Promise<CopyTradeExecution[]> {
    const executions: CopyTradeExecution[] = [];
    
    // Find all active copy configs for this trader
    const activeCopyConfigs = Array.from(this.copyConfigs.values())
      .filter(config => 
        config.traderId === traderId && 
        config.enabled &&
        this.shouldExecuteCopy(config, originalSignal)
      );
    
    for (const config of activeCopyConfigs) {
      try {
        const execution = await this.createCopyExecution(config, originalSignal);
        executions.push(execution);
        
        // Emit event for real-time updates
        this.emit('copyTradeExecuted', { execution, originalSignal });
        
        // Send notification to follower
        await this.sendNotification(config.followerId, {
          type: 'TRADE',
          title: 'Trade Copied',
          message: `Copied ${originalSignal.symbol} ${originalSignal.signal} signal from ${this.traders.get(traderId)?.displayName}`,
          data: { executionId: execution.id, signalId: originalSignal.id }
        });
        
      } catch (error) {
        console.error(`Failed to execute copy trade for config ${config.id}:`, error);
        
        // Create failed execution record
        const failedExecution: CopyTradeExecution = {
          id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          copyConfigId: config.id,
          originalSignal,
          copiedSignal: originalSignal,
          followerId: config.followerId,
          traderId,
          executionTime: new Date(),
          latency: 0,
          slippage: 0,
          amount: 0,
          status: 'FAILED',
          fees: { platform: 0, trader: 0, exchange: 0 },
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        
        this.copyExecutions.set(failedExecution.id, failedExecution);
        executions.push(failedExecution);
        
        // Notify about failure
        await this.sendNotification(config.followerId, {
          type: 'TRADE',
          title: 'Copy Trade Failed',
          message: `Failed to copy ${originalSignal.symbol} signal: ${failedExecution.error}`,
          data: { executionId: failedExecution.id, error: failedExecution.error }
        });
      }
    }
    
    return executions;
  }

  /**
   * Check if copy trade should be executed based on filters
   */
  private shouldExecuteCopy(config: CopyTradingConfig, signal: TradingSignal): boolean {
    const { filters, schedule } = config;
    
    // Check confidence threshold
    if (signal.confidence < filters.minConfidence) {
      return false;
    }
    
    // Check risk level
    const riskLevels = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
    const signalRisk = this.calculateSignalRiskLevel(signal);
    if (riskLevels[signalRisk] > riskLevels[filters.maxRiskLevel]) {
      return false;
    }
    
    // Check symbol filters
    if (filters.symbols.length > 0 && !filters.symbols.includes(signal.symbol)) {
      return false;
    }
    
    if (filters.excludeSymbols.includes(signal.symbol)) {
      return false;
    }
    
    // Check market filters
    if (filters.markets.length > 0) {
      const signalMarket = this.getSignalMarket(signal.symbol);
      if (!filters.markets.includes(signalMarket)) {
        return false;
      }
    }
    
    // Check timeframe filters
    if (filters.timeframes.length > 0 && !filters.timeframes.includes(signal.timeframe)) {
      return false;
    }
    
    // Check schedule
    if (schedule.enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay();
      
      const isInTradingHours = schedule.tradingHours.some(hours => {
        const startHour = parseInt(hours.start.split(':')[0]);
        const endHour = parseInt(hours.end.split(':')[0]);
        return hours.days.includes(currentDay) && 
               currentHour >= startHour && 
               currentHour <= endHour;
      });
      
      if (!isInTradingHours) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Create copy execution
   */
  private async createCopyExecution(config: CopyTradingConfig, originalSignal: TradingSignal): Promise<CopyTradeExecution> {
    const startTime = Date.now();
    
    // Calculate copy amount based on allocation settings
    const copyAmount = this.calculateCopyAmount(config, originalSignal);
    
    // Create copied signal with adjusted parameters
    const copiedSignal: TradingSignal = {
      ...originalSignal,
      id: `copy_${originalSignal.id}_${config.followerId}`,
      // Note: quantity will be calculated based on allocation and entry price
      timestamp: new Date()
    };
    
    // Apply risk management adjustments
    if (config.riskManagement.stopLoss && originalSignal.stopLoss) {
      copiedSignal.stopLoss = originalSignal.stopLoss;
    }
    
    if (config.riskManagement.takeProfit && originalSignal.takeProfit) {
      copiedSignal.takeProfit = originalSignal.takeProfit;
    }
    
    // Simulate execution (in real implementation, this would call trading API)
    const executionLatency = Date.now() - startTime;
    const slippage = Math.random() * 0.05; // Random slippage up to 0.05%
    
    const execution: CopyTradeExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      copyConfigId: config.id,
      originalSignal,
      copiedSignal,
      followerId: config.followerId,
      traderId: config.traderId,
      executionTime: new Date(),
      latency: executionLatency,
      slippage,
      amount: copyAmount,
      status: 'EXECUTED',
      fees: {
        platform: copyAmount * 0.001, // 0.1% platform fee
        trader: copyAmount * 0.0005,  // 0.05% trader fee
        exchange: copyAmount * 0.0005 // 0.05% exchange fee
      }
    };
    
    this.copyExecutions.set(execution.id, execution);
    
    // Update copy config stats
    const followerStats = this.traderStats.get(config.followerId);
    if (followerStats) {
      followerStats.totalTrades++;
    }
    
    return execution;
  }

  /**
   * Calculate copy amount based on allocation settings
   */
  private calculateCopyAmount(config: CopyTradingConfig, signal: TradingSignal): number {
    const { allocation } = config;
    
    switch (allocation.type) {
      case 'PERCENTAGE':
        // Percentage of follower's portfolio
        const portfolioValue = this.getFollowerPortfolioValue(config.followerId);
        return (portfolioValue * allocation.value) / 100;
        
      case 'FIXED_AMOUNT':
        return allocation.value;
        
      case 'RISK_BASED':
        // Calculate based on risk per trade
        const accountBalance = this.getFollowerPortfolioValue(config.followerId);
        const riskAmount = (accountBalance * allocation.maxRiskPerTrade) / 100;
        
        if (signal.stopLoss && signal.entryPrice) {
          const stopDistance = Math.abs(signal.entryPrice - signal.stopLoss) / signal.entryPrice;
          return riskAmount / stopDistance;
        }
        
        return riskAmount;
        
      default:
        return allocation.value;
    }
  }

  /**
   * Get follower's portfolio value (mock implementation)
   */
  private getFollowerPortfolioValue(followerId: string): number {
    // In real implementation, this would fetch from portfolio service
    return 10000; // Mock $10,000 portfolio
  }

  /**
   * Calculate signal risk level
   */
  private calculateSignalRiskLevel(signal: TradingSignal): 'LOW' | 'MEDIUM' | 'HIGH' {
    // Simple risk calculation based on confidence and volatility
    if (signal.confidence >= 0.8) return 'LOW';
    if (signal.confidence >= 0.6) return 'MEDIUM';
    return 'HIGH';
  }

  /**
   * Get market from symbol
   */
  private getSignalMarket(symbol: string): string {
    if (symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('ETH')) {
      return 'CRYPTO';
    }
    if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) {
      return 'FOREX';
    }
    return 'STOCKS';
  }

  /**
   * Follow trader
   */
  async followTrader(followerId: string, traderId: string): Promise<boolean> {
    if (followerId === traderId) {
      throw new Error('Cannot follow yourself');
    }
    
    const follower = this.traders.get(followerId);
    const trader = this.traders.get(traderId);
    
    if (!follower || !trader) {
      throw new Error('Follower or trader not found');
    }
    
    const followers = this.followers.get(traderId) || new Set();
    const following = this.following.get(followerId) || new Set();
    
    if (followers.has(followerId)) {
      return false; // Already following
    }
    
    followers.add(followerId);
    following.add(traderId);
    
    this.followers.set(traderId, followers);
    this.following.set(followerId, following);
    
    // Update stats
    const traderStats = this.traderStats.get(traderId);
    if (traderStats) {
      traderStats.followers++;
    }
    
    console.log(`${follower.username} followed ${trader.username}`);
    this.emit('traderFollowed', { followerId, traderId });
    
    // Notify trader
    await this.sendNotification(traderId, {
      type: 'FOLLOW',
      title: 'New Follower',
      message: `${follower.displayName} started following you`,
      data: { followerId }
    });
    
    return true;
  }

  /**
   * Unfollow trader
   */
  async unfollowTrader(followerId: string, traderId: string): Promise<boolean> {
    const followers = this.followers.get(traderId);
    const following = this.following.get(followerId);
    
    if (!followers || !following || !followers.has(followerId)) {
      return false; // Not following
    }
    
    followers.delete(followerId);
    following.delete(traderId);
    
    // Update stats
    const traderStats = this.traderStats.get(traderId);
    if (traderStats) {
      traderStats.followers = Math.max(0, traderStats.followers - 1);
    }
    
    console.log(`${followerId} unfollowed ${traderId}`);
    this.emit('traderUnfollowed', { followerId, traderId });
    
    return true;
  }

  /**
   * Like signal
   */
  async likeSignal(userId: string, signalId: string): Promise<boolean> {
    const signal = this.sharedSignals.get(signalId);
    if (!signal) {
      throw new Error('Signal not found');
    }
    
    signal.likes++;
    
    // Update feed engagement if exists
    for (const [feedId, feedItem] of Array.from(this.socialFeed.entries())) {
      if (feedItem.content.signal?.id === signalId) {
        feedItem.engagement.likes++;
        break;
      }
    }
    
    this.emit('signalLiked', { userId, signalId, likes: signal.likes });
    
    // Notify signal author
    await this.sendNotification(signal.traderId, {
      type: 'LIKE',
      title: 'Signal Liked',
      message: `Someone liked your ${signal.originalSignal.symbol} signal`,
      data: { signalId, userId }
    });
    
    return true;
  }

  /**
   * Add comment to signal
   */
  async addComment(userId: string, signalId: string, content: string): Promise<SocialComment> {
    const signal = this.sharedSignals.get(signalId);
    if (!signal) {
      throw new Error('Signal not found');
    }
    
    const comment: SocialComment = {
      id: `comment_${Date.now()}`,
      feedId: signalId,
      authorId: userId,
      content,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      edited: false
    };
    
    const comments = this.comments.get(signalId) || [];
    comments.push(comment);
    this.comments.set(signalId, comments);
    
    signal.comments++;
    
    this.emit('commentAdded', { comment, signalId });
    
    // Notify signal author
    if (userId !== signal.traderId) {
      await this.sendNotification(signal.traderId, {
        type: 'COMMENT',
        title: 'New Comment',
        message: `Someone commented on your ${signal.originalSignal.symbol} signal`,
        data: { signalId, commentId: comment.id }
      });
    }
    
    return comment;
  }

  /**
   * Get trader rankings
   */
  calculateRankings(category: TraderRanking['category'], period: TraderRanking['period']): TraderRanking[] {
    const rankings: TraderRanking[] = [];
    
    for (const [traderId, stats] of Array.from(this.traderStats.entries())) {
      const trader = this.traders.get(traderId);
      if (!trader) continue;
      
      let score = 0;
      
      switch (category) {
        case 'OVERALL':
          score = (stats.sharpeRatio * 0.3) + (stats.winRate * 0.2) + 
                 (Math.max(0, stats.totalReturn) * 0.2) + (stats.consistency * 0.15) + 
                 (Math.max(0, 100 - stats.maxDrawdown) * 0.15);
          break;
        case 'RETURNS':
          score = stats.totalReturn;
          break;
        case 'CONSISTENCY':
          score = stats.consistency;
          break;
        case 'RISK_ADJUSTED':
          score = stats.sharpeRatio;
          break;
        case 'SIGNALS':
          score = stats.signalsAccuracy * stats.signalsShared;
          break;
      }
      
      rankings.push({
        rank: 0, // Will be set after sorting
        traderId,
        score,
        category,
        period,
        change: Math.floor(Math.random() * 10) - 5, // Mock change
        metrics: {
          return: stats.totalReturn,
          winRate: stats.winRate,
          sharpeRatio: stats.sharpeRatio,
          maxDrawdown: stats.maxDrawdown,
          followers: stats.followers
        }
      });
    }
    
    // Sort by score and assign ranks
    rankings.sort((a, b) => b.score - a.score);
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });
    
    return rankings;
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(category: TraderRanking['category'] = 'OVERALL', period: TraderRanking['period'] = 'MONTHLY', limit: number = 50): LeaderboardEntry[] {
    const rankings = this.calculateRankings(category, period);
    
    return rankings.slice(0, limit).map(ranking => {
      const trader = this.traders.get(ranking.traderId)!;
      const stats = this.traderStats.get(ranking.traderId)!;
      
      return {
        rank: ranking.rank,
        traderId: ranking.traderId,
        trader,
        stats,
        score: ranking.score,
        change: ranking.change,
        badge: ranking.rank <= 3 ? ['🥇', '🥈', '🥉'][ranking.rank - 1] : undefined
      };
    });
  }

  /**
   * Calculate social analytics
   */
  calculateAnalytics(userId: string): SocialAnalytics {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    
    const userSignals = Array.from(this.sharedSignals.values())
      .filter(s => s.traderId === userId && s.shareTimestamp >= startDate);
    
    const analytics: SocialAnalytics = {
      userId,
      period: { start: startDate, end: endDate },
      metrics: {
        profileViews: Math.floor(Math.random() * 1000) + 100,
        signalViews: userSignals.reduce((sum, s) => sum + s.views, 0),
        signalLikes: userSignals.reduce((sum, s) => sum + s.likes, 0),
        signalShares: userSignals.reduce((sum, s) => sum + s.shares, 0),
        newFollowers: Math.floor(Math.random() * 50) + 5,
        newCopiers: Math.floor(Math.random() * 20) + 2,
        totalEngagement: 0,
        reachGrowth: (Math.random() - 0.3) * 50,
        conversionRate: Math.random() * 10 + 2
      },
      topSignals: userSignals
        .sort((a, b) => (b.views + b.likes + b.shares) - (a.views + a.likes + a.shares))
        .slice(0, 5)
        .map(s => ({
          signalId: s.id,
          views: s.views,
          engagement: s.likes + s.comments + s.shares,
          performance: s.performance.avgReturn
        })),
      audienceInsights: {
        demographics: {
          countries: {
            'United States': 35,
            'United Kingdom': 20,
            'Germany': 15,
            'Canada': 12,
            'Australia': 8,
            'Others': 10
          },
          experience: {
            'Beginner': 25,
            'Intermediate': 45,
            'Advanced': 25,
            'Professional': 5
          },
          interests: {
            'Cryptocurrency': 60,
            'Forex': 25,
            'Stocks': 35,
            'Commodities': 15,
            'Options': 20
          }
        },
        behavior: {
          activeHours: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 100)),
          activeDays: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
          avgSessionTime: Math.random() * 30 + 10
        }
      }
    };
    
    analytics.metrics.totalEngagement = analytics.metrics.signalLikes + 
      analytics.metrics.signalShares + analytics.metrics.signalViews;
    
    return analytics;
  }

  /**
   * Send notification to user
   */
  private async sendNotification(userId: string, notificationData: Partial<SocialNotification>): Promise<void> {
    const notification: SocialNotification = {
      id: `notif_${Date.now()}`,
      userId,
      type: notificationData.type!,
      title: notificationData.title!,
      message: notificationData.message!,
      data: notificationData.data || {},
      read: false,
      timestamp: new Date(),
      expiresAt: notificationData.expiresAt,
      actionUrl: notificationData.actionUrl
    };
    
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift(notification); // Add to beginning
    
    // Keep only last 100 notifications
    if (userNotifications.length > 100) {
      userNotifications.splice(100);
    }
    
    this.notifications.set(userId, userNotifications);
    
    this.emit('notificationSent', { notification });
    
    // Send via alert system if available
    if (this.alertSystem) {
      this.alertSystem.emit('alertTriggered', {
        alert: {
          id: notification.id,
          type: 'INFO',
          title: notification.title,
          message: notification.message,
          timestamp: notification.timestamp,
          channels: ['push'],
          priority: 'MEDIUM',
          ruleId: 'social_notification',
          ruleName: 'Social Trading Notification',
          data: notification.data,
          status: 'PENDING',
          deliveryStatus: {}
        }
      });
    }
  }

  /**
   * Notify followers
   */
  private async notifyFollowers(traderId: string, notificationData: Partial<SocialNotification>): Promise<void> {
    const followers = this.followers.get(traderId);
    if (!followers) return;
    
    const promises = Array.from(followers).map(followerId => 
      this.sendNotification(followerId, notificationData)
    );
    
    await Promise.all(promises);
  }

  // Getter methods

  /**
   * Get trader profile
   */
  getTraderProfile(traderId: string): TraderProfile | undefined {
    return this.traders.get(traderId);
  }

  /**
   * Get trader stats
   */
  getTraderStats(traderId: string): TraderStats | undefined {
    return this.traderStats.get(traderId);
  }

  /**
   * Get shared signals
   */
  getSharedSignals(filters?: {
    traderId?: string;
    visibility?: SharedSignal['visibility'];
    tags?: string[];
    limit?: number;
  }): SharedSignal[] {
    let signals = Array.from(this.sharedSignals.values());
    
    if (filters?.traderId) {
      signals = signals.filter(s => s.traderId === filters.traderId);
    }
    
    if (filters?.visibility) {
      signals = signals.filter(s => s.visibility === filters.visibility);
    }
    
    if (filters?.tags) {
      signals = signals.filter(s => 
        filters.tags!.some(tag => s.tags.includes(tag))
      );
    }
    
    // Sort by share timestamp (newest first)
    signals.sort((a, b) => b.shareTimestamp.getTime() - a.shareTimestamp.getTime());
    
    if (filters?.limit) {
      signals = signals.slice(0, filters.limit);
    }
    
    return signals;
  }

  /**
   * Get social feed
   */
  getSocialFeed(userId?: string, limit: number = 50): SocialFeed[] {
    let feed = Array.from(this.socialFeed.values());
    
    // Filter by visibility and following
    if (userId) {
      const following = this.following.get(userId) || new Set();
      feed = feed.filter(item => 
          item.visibility === 'PUBLIC' || 
          item.authorId === userId ||
          (item.visibility === 'FOLLOWERS' && following.has(item.authorId))
      );
    } else {
      feed = feed.filter(item => item.visibility === 'PUBLIC');
    }
    
    // Sort by timestamp (newest first)
    feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return feed.slice(0, limit);
  }

  /**
   * Get copy configurations
   */
  getCopyConfigs(userId: string): CopyTradingConfig[] {
    return Array.from(this.copyConfigs.values())
      .filter(config => config.followerId === userId || config.traderId === userId);
  }

  /**
   * Get copy trade executions
   */
  getCopyExecutions(filters?: {
    followerId?: string;
    traderId?: string;
    status?: CopyTradeExecution['status'];
    limit?: number;
  }): CopyTradeExecution[] {
    let executions = Array.from(this.copyExecutions.values());
    
    if (filters?.followerId) {
      executions = executions.filter(exec => exec.followerId === filters.followerId);
    }
    
    if (filters?.traderId) {
      executions = executions.filter(exec => exec.traderId === filters.traderId);
    }
    
    if (filters?.status) {
      executions = executions.filter(exec => exec.status === filters.status);
    }
    
    // Sort by execution time (newest first)
    executions.sort((a, b) => b.executionTime.getTime() - a.executionTime.getTime());
    
    if (filters?.limit) {
      executions = executions.slice(0, filters.limit);
    }
    
    return executions;
  }

  /**
   * Update copy trade execution result
   */
  async updateCopyExecutionResult(executionId: string, result: TradeResult): Promise<void> {
    const execution = this.copyExecutions.get(executionId);
    if (!execution) {
      throw new Error('Copy execution not found');
    }
    
    execution.result = result;
    execution.status = result.status === 'CLOSED' ? 'EXECUTED' : 'FAILED';
    
    // Update trader stats
    const followerStats = this.traderStats.get(execution.followerId);
    if (followerStats && result.status === 'CLOSED') {
      if (result.pnl && result.pnl > 0) {
        followerStats.winningTrades++;
      } else if (result.pnl && result.pnl < 0) {
        followerStats.losingTrades++;
      }
      
      followerStats.winRate = (followerStats.winningTrades / followerStats.totalTrades) * 100;
      
      if (result.pnl) {
        followerStats.totalReturn += result.pnl;
      }
    }
    
    // Send notification about trade result
    if (result.pnl) {
      const isProfit = result.pnl > 0;
      await this.sendNotification(execution.followerId, {
        type: 'TRADE',
        title: isProfit ? 'Copy Trade Profit' : 'Copy Trade Loss',
        message: `Your copy of ${execution.originalSignal.symbol} ${isProfit ? 'gained' : 'lost'} $${Math.abs(result.pnl).toFixed(2)}`,
        data: { executionId, pnl: result.pnl }
      });
    }
    
    this.emit('copyExecutionUpdated', { execution, result });
  }

  /**
   * Get notifications for user
   */
  getNotifications(userId: string, unreadOnly: boolean = false): SocialNotification[] {
    const notifications = this.notifications.get(userId) || [];
    
    if (unreadOnly) {
      return notifications.filter(n => !n.read);
    }
    
    return notifications;
  }

  /**
   * Get groups
   */
  getGroups(filters?: {
    type?: SocialGroup['type'];
    category?: SocialGroup['category'];
    userId?: string;
  }): SocialGroup[] {
    let groups = Array.from(this.groups.values());
    
    if (filters?.type) {
      groups = groups.filter(g => g.type === filters.type);
    }
    
    if (filters?.category) {
      groups = groups.filter(g => g.category === filters.category);
    }
    
    if (filters?.userId) {
      groups = groups.filter(g => 
        g.members.some(m => m.userId === filters.userId)
      );
    }
    
    return groups;
  }

  /**
   * Get platform status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      totalTraders: this.traders.size,
      totalSignals: this.sharedSignals.size,
      totalCopyConfigs: this.copyConfigs.size,
      totalGroups: this.groups.size,
      activeFeedItems: this.socialFeed.size,
      lastUpdate: new Date()
    };
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.stop();
    
    this.traders.clear();
    this.traderStats.clear();
    this.sharedSignals.clear();
    this.copyConfigs.clear();
    this.copyExecutions.clear();
    this.socialFeed.clear();
    this.comments.clear();
    this.groups.clear();
    this.notifications.clear();
    this.followers.clear();
    this.following.clear();
    
    this.removeAllListeners();
    console.log('Social Trading Platform destroyed');
  }
}