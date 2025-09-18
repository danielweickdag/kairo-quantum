'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Shield, DollarSign, Activity, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useUserStats } from '@/services/userStatsService';
import type { Achievement, TradingGoal, PerformanceMetric } from '@/services/userStatsService';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

function StatCard({ title, value, change, icon, trend = 'neutral', subtitle }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
              {icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-400">{title}</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{value}</p>
              {subtitle && <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs sm:text-sm font-medium">
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  const isUnlocked = achievement.unlockedAt !== undefined;

  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 ${isUnlocked ? 'ring-2 ring-blue-500/50' : 'opacity-75'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white">{achievement.title}</h4>
              <p className="text-sm text-gray-400">{achievement.description}</p>
            </div>
          </div>
          <Badge className={`${getRarityColor(achievement.rarity)} text-white`}>
            {achievement.rarity}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {isUnlocked && (
            <p className="text-xs text-green-400 flex items-center space-x-1">
              <Award className="w-3 h-3" />
              <span>Unlocked {achievement.unlockedAt?.toLocaleDateString()}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GoalCardProps {
  goal: TradingGoal;
}

function GoalCard({ goal }: GoalCardProps) {
  const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isAchieved = goal.achieved;
  const daysLeft = goal.deadline ? Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 ${isAchieved ? 'ring-2 ring-green-500/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white">{goal.title}</h4>
            <p className="text-sm text-gray-400">{goal.description}</p>
          </div>
          {isAchieved && (
            <Badge className="bg-green-500 text-white">
              <Target className="w-3 h-3 mr-1" />
              Achieved
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">
              {goal.currentValue.toFixed(goal.unit === '$' ? 2 : 0)}{goal.unit} / {goal.targetValue.toFixed(goal.unit === '$' ? 2 : 0)}{goal.unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {daysLeft !== null && daysLeft > 0 && (
            <p className="text-xs text-gray-400 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{daysLeft} days left</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserStatsDisplay() {
  const {
    stats,
    performanceHistory,
    goals,
    achievements,
    riskMetrics,
    marketAnalysis,
    currentSession
  } = useUserStats();

  // Prepare chart data
  const equityChartData = performanceHistory.slice(-30).map(metric => ({
    date: metric.date.toLocaleDateString(),
    balance: metric.balance,
    equity: metric.equity,
    profit: metric.profit
  }));

  const drawdownChartData = performanceHistory.slice(-30).map(metric => ({
    date: metric.date.toLocaleDateString(),
    drawdown: metric.drawdown
  }));

  const marketDistributionData = marketAnalysis.map(market => ({
    name: market.symbol,
    trades: market.totalTrades,
    winRate: market.winRate
  }));

  const monthlyPerformanceData = [
    { month: 'Jan', profit: 1200, trades: 45 },
    { month: 'Feb', profit: 1800, trades: 52 },
    { month: 'Mar', profit: 2100, trades: 48 },
    { month: 'Apr', profit: 1650, trades: 41 },
    { month: 'May', profit: 2400, trades: 55 },
    { month: 'Jun', profit: 1950, trades: 47 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          change={2.3}
          trend="up"
          icon={<Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
          subtitle="Last 30 days"
        />
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          change={5.7}
          trend="up"
          icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />}
          subtitle="Total return"
        />
        <StatCard
          title="Profit Factor"
          value={stats.profitFactor.toFixed(2)}
          change={-0.8}
          trend="down"
          icon={<BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />}
          subtitle="Risk-adjusted"
        />
        <StatCard
          title="Max Drawdown"
          value={`${((stats.maxDrawdown / stats.initialBalance) * 100).toFixed(1)}%`}
          change={-1.2}
          trend="up"
          icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
          subtitle="Risk management"
        />
      </div>

      {/* Current Trading Session */}
      {currentSession && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base">Current Trading Session</span>
              </div>
              <Badge className="bg-green-500 text-white text-xs">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Session Duration</p>
                <p className="text-sm sm:text-lg font-semibold text-white">
                  {Math.floor((Date.now() - currentSession.startTime.getTime()) / 60000)} min
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Trades</p>
                <p className="text-sm sm:text-lg font-semibold text-white">{currentSession.tradesCount}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Session P&L</p>
                <p className={`text-sm sm:text-lg font-semibold ${currentSession.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${currentSession.profit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Win Rate</p>
                <p className="text-sm sm:text-lg font-semibold text-white">{currentSession.winRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Equity Curve */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-sm sm:text-base">Account Equity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={equityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  fill="url(#colorBalance)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drawdown Chart */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-sm sm:text-base">Drawdown Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={drawdownChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="drawdown" 
                  stroke="#EF4444" 
                  fill="url(#colorDrawdown)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-sm sm:text-base">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Distribution */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white text-sm sm:text-base">Trading Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={marketDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="trades"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {marketDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Trading Goals */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span>Trading Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {goals.slice(0, 3).map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {achievements.slice(0, 3).map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-white text-sm sm:text-base">Detailed Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-300 text-sm sm:text-base">Trading Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Total Trades</span>
                  <span className="text-white text-xs sm:text-sm">{stats.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Winning Trades</span>
                  <span className="text-green-400 text-xs sm:text-sm">{stats.winningTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Losing Trades</span>
                  <span className="text-red-400 text-xs sm:text-sm">{stats.losingTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Expectancy</span>
                  <span className="text-white text-xs sm:text-sm">${stats.expectancy.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-300 text-sm sm:text-base">Risk Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Sharpe Ratio</span>
                  <span className="text-white text-xs sm:text-sm">{stats.sharpeRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Calmar Ratio</span>
                  <span className="text-white text-xs sm:text-sm">{stats.calmarRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Recovery Factor</span>
                  <span className="text-white text-xs sm:text-sm">{stats.recoveryFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Volatility</span>
                  <span className="text-white text-xs sm:text-sm">{stats.volatility.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-300 text-sm sm:text-base">Profit Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Average Win</span>
                  <span className="text-green-400 text-xs sm:text-sm">${stats.averageWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Average Loss</span>
                  <span className="text-red-400 text-xs sm:text-sm">-${stats.averageLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Largest Win</span>
                  <span className="text-green-400 text-xs sm:text-sm">${stats.largestWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Largest Loss</span>
                  <span className="text-red-400 text-xs sm:text-sm">-${stats.largestLoss.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-300 text-sm sm:text-base">Consistency</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Consecutive Wins</span>
                  <span className="text-green-400 text-xs sm:text-sm">{stats.consecutiveWins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Max Consecutive Wins</span>
                  <span className="text-green-400 text-xs sm:text-sm">{stats.maxConsecutiveWins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Max Consecutive Losses</span>
                  <span className="text-red-400 text-xs sm:text-sm">{stats.maxConsecutiveLosses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Avg Trades/Day</span>
                  <span className="text-white text-xs sm:text-sm">{stats.averageTradesPerDay.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}