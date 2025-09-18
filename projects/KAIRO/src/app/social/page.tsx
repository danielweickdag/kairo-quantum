'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  UserPlus,
  UserCheck,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Award,
  Crown,
  Building,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Eye,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Verified
} from 'lucide-react';

interface SocialUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio: string;
  location?: string;
  website?: string;
  verified: boolean;
  type: 'hedge_fund' | 'manager' | 'celebrity' | 'friend' | 'trader';
  followers: number;
  following: number;
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  riskScore: number;
  joinDate: string;
  isFollowing: boolean;
  isFollowingYou: boolean;
  badges: string[];
  recentPosts: number;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userVerified: boolean;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  type: 'text' | 'trade' | 'analysis' | 'news';
  tradeData?: {
    symbol: string;
    action: 'buy' | 'sell';
    quantity: number;
    price: number;
    profit?: number;
    profitPercent?: number;
  };
}

export default function SocialPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'following' | 'followers'>('feed');
  const [filterType, setFilterType] = useState<'all' | 'hedge_fund' | 'manager' | 'celebrity' | 'friend'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock social users data
  const [socialUsers, setSocialUsers] = useState<SocialUser[]>([
    {
      id: '1',
      name: 'Berkshire Hathaway',
      username: '@berkshire',
      bio: 'Value investing since 1965. Led by Warren Buffett and Charlie Munger.',
      location: 'Omaha, Nebraska',
      website: 'berkshirehathaway.com',
      verified: true,
      type: 'hedge_fund',
      followers: 2500000,
      following: 50,
      totalReturn: 2800000,
      totalReturnPercent: 22.5,
      winRate: 89,
      riskScore: 3,
      joinDate: '2020-01-15',
      isFollowing: true,
      isFollowingYou: false,
      badges: ['Legend', 'Value Investor', 'Long Term'],
      recentPosts: 12
    },
    {
      id: '2',
      name: 'Cathie Wood',
      username: '@cathiewood',
      bio: 'CEO & CIO of ARK Invest. Focused on disruptive innovation.',
      location: 'New York, NY',
      website: 'ark-invest.com',
      verified: true,
      type: 'manager',
      followers: 1800000,
      following: 200,
      totalReturn: 450000,
      totalReturnPercent: 35.2,
      winRate: 72,
      riskScore: 7,
      joinDate: '2020-03-20',
      isFollowing: false,
      isFollowingYou: false,
      badges: ['Innovation', 'Growth', 'Tech Focus'],
      recentPosts: 45
    },
    {
      id: '3',
      name: 'Elon Musk',
      username: '@elonmusk',
      bio: 'CEO of Tesla & SpaceX. Building the future.',
      location: 'Austin, Texas',
      website: 'tesla.com',
      verified: true,
      type: 'celebrity',
      followers: 150000000,
      following: 120,
      totalReturn: 0,
      totalReturnPercent: 0,
      winRate: 0,
      riskScore: 0,
      joinDate: '2019-05-10',
      isFollowing: true,
      isFollowingYou: false,
      badges: ['Visionary', 'Tech CEO', 'Innovator'],
      recentPosts: 234
    },
    {
      id: '4',
      name: 'Sarah Chen',
      username: '@sarahtrader',
      bio: 'Tech-focused growth investor. AI & renewable energy specialist.',
      location: 'San Francisco, CA',
      verified: false,
      type: 'friend',
      followers: 12500,
      following: 850,
      totalReturn: 45000,
      totalReturnPercent: 28.5,
      winRate: 78,
      riskScore: 6,
      joinDate: '2021-08-15',
      isFollowing: true,
      isFollowingYou: true,
      badges: ['Tech Expert', 'Growth'],
      recentPosts: 89
    }
  ]);

  // Mock posts data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Berkshire Hathaway',
      userVerified: true,
      content: 'Our investment philosophy remains unchanged: buy wonderful businesses at fair prices and hold them for the long term. The market may fluctuate, but great companies compound wealth over time.',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 15420,
      comments: 892,
      shares: 2341,
      isLiked: false,
      type: 'text'
    },
    {
      id: '2',
      userId: '4',
      userName: 'Sarah Chen',
      userVerified: false,
      content: 'Just executed a strategic position in renewable energy. The fundamentals are strong and the growth trajectory looks promising.',
      timestamp: '2024-03-15T09:15:00Z',
      likes: 234,
      comments: 45,
      shares: 67,
      isLiked: true,
      type: 'trade',
      tradeData: {
        symbol: 'ENPH',
        action: 'buy',
        quantity: 500,
        price: 145.30,
        profit: 2150,
        profitPercent: 2.95
      }
    },
    {
      id: '3',
      userId: '3',
      userName: 'Elon Musk',
      userVerified: true,
      content: 'Tesla\'s Q1 delivery numbers exceeded expectations. Sustainable transport is accelerating faster than most predicted. The future is electric! ⚡',
      timestamp: '2024-03-15T08:45:00Z',
      likes: 89234,
      comments: 12456,
      shares: 23891,
      isLiked: true,
      type: 'news'
    },
    {
      id: '4',
      userId: '2',
      userName: 'Cathie Wood',
      userVerified: true,
      content: 'AI is transforming every industry. Companies that embrace this disruption early will be the winners of tomorrow. Our research shows we\'re still in the early innings.',
      timestamp: '2024-03-15T07:20:00Z',
      likes: 5678,
      comments: 789,
      shares: 1234,
      isLiked: false,
      type: 'analysis'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFollow = (userId: string) => {
    setSocialUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !user.isFollowing,
            followers: user.isFollowing ? user.followers - 1 : user.followers + 1
          }
        : user
    ));
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const filteredUsers = socialUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    return user.type === filterType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hedge_fund': return Building;
      case 'manager': return BarChart3;
      case 'celebrity': return Crown;
      case 'friend': return Users;
      default: return Users;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hedge_fund': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
      case 'manager': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'celebrity': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'friend': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Social Trading
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with traders, follow market leaders, and share insights
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'feed', label: 'Feed', icon: Users },
            { id: 'discover', label: 'Discover', icon: Search },
            { id: 'following', label: 'Following', icon: UserCheck },
            { id: 'followers', label: 'Followers', icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {post.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{post.userName}</h3>
                          {post.userVerified && (
                            <Verified className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTimeAgo(post.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-900 dark:text-white mb-3">{post.content}</p>
                    
                    {/* Trade Data */}
                    {post.type === 'trade' && post.tradeData && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              post.tradeData.action === 'buy' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                            }`}>
                              {post.tradeData.action === 'buy' ? 
                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                              }
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {post.tradeData.action.toUpperCase()} {post.tradeData.symbol}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {post.tradeData.quantity} shares @ ${post.tradeData.price}
                              </p>
                            </div>
                          </div>
                          {post.tradeData.profit && (
                            <div className="text-right">
                              <p className={`font-semibold ${
                                post.tradeData.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {post.tradeData.profit >= 0 ? '+' : ''}${post.tradeData.profit.toLocaleString()}
                              </p>
                              <p className={`text-sm ${
                                post.tradeData.profitPercent && post.tradeData.profitPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {post.tradeData.profitPercent && post.tradeData.profitPercent >= 0 ? '+' : ''}{post.tradeData.profitPercent}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{formatNumber(post.likes)}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{formatNumber(post.comments)}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">{formatNumber(post.shares)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search traders, hedge funds, celebrities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="hedge_fund">Hedge Funds</option>
                  <option value="manager">Managers</option>
                  <option value="celebrity">Celebrities</option>
                  <option value="friend">Friends</option>
                </select>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((socialUser) => {
                const TypeIcon = getTypeIcon(socialUser.type);
                return (
                  <div key={socialUser.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {socialUser.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{socialUser.name}</h3>
                            {socialUser.verified && (
                              <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{socialUser.username}</p>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(socialUser.type)}`}>
                        <TypeIcon className="h-3 w-3" />
                        <span>{socialUser.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {socialUser.bio}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(socialUser.followers)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatNumber(socialUser.following)}</p>
                      </div>
                      {socialUser.type !== 'celebrity' && socialUser.totalReturnPercent > 0 && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Return</p>
                            <p className={`font-semibold ${
                              socialUser.totalReturnPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {socialUser.totalReturnPercent >= 0 ? '+' : ''}{socialUser.totalReturnPercent}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{socialUser.winRate}%</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {socialUser.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Location and Website */}
                    <div className="space-y-2 mb-4">
                      {socialUser.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          <span>{socialUser.location}</span>
                        </div>
                      )}
                      {socialUser.website && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <LinkIcon className="h-3 w-3" />
                          <span>{socialUser.website}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(socialUser.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      onClick={() => handleFollow(socialUser.id)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        socialUser.isFollowing
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {socialUser.isFollowing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <UserCheck className="h-4 w-4" />
                          <span>Following</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <UserPlus className="h-4 w-4" />
                          <span>Follow</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div>
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                People You Follow
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage the traders and influencers you&apos;re following.
              </p>
            </div>
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div>
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Your Followers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See who&apos;s following your trading journey.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}