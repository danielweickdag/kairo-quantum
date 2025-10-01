'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkflow } from '@/contexts/WorkflowContext';
import AppLayout from '@/components/layouts/AppLayout';
import TradingDropdown, { MainNavigationDropdown, UserAccountDropdown } from '@/components/ui/TradingDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Settings,
  Camera,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Activity,
  TrendingUp,
  Users,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Wallet,
  Building2,
  ArrowUpDown,
  History,
  DollarSign,
  Eye,
  EyeOff,
  Clock,
  PieChart,
  BarChart3,
  Bot,
  Target,
  Zap,
  Globe,
  BarChart,
  LineChart,
  Briefcase,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RefreshCw,
  Filter,
  Search,
  Download,
  Share
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn, formatCurrency } from '@/lib/utils';

// Import all the financial components
import FinancialUserProfile from '@/components/dashboard/FinancialUserProfile';
import BankAccountManager from '@/components/dashboard/BankAccountManager';
import DepositInterface from '@/components/dashboard/DepositInterface';
import WithdrawalInterface from '@/components/dashboard/WithdrawalInterface';
import AutomatedTradingConfig from '@/components/dashboard/AutomatedTradingConfig';
import KYCVerification from '@/components/dashboard/KYCVerification';
import TransactionHistory from '@/components/dashboard/TransactionHistory';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  accountType: 'INDIVIDUAL' | 'HEDGE_FUND' | 'CELEBRITY' | 'INFLUENCER';
  isVerified: boolean;
  isPublic: boolean;
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  totalBalance: number;
  availableBalance: number;
  createdAt: string;
  _count: {
    followers: number;
    following: number;
    portfolios: number;
  };
}

interface UserStats {
  totalBalance: number;
  availableBalance: number;
  investedAmount: number;
  totalGains: number;
  totalDeposits: number;
  totalWithdrawals: number;
  activeStrategies: number;
  monthlyReturn: number;
}

interface AccountStatus {
  isVerified: boolean;
  kycLevel: 'none' | 'basic' | 'intermediate' | 'advanced';
  tradingEnabled: boolean;
  withdrawalEnabled: boolean;
  depositEnabled: boolean;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const { workflowState, executeWorkflow } = useWorkflow();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [activeWorkflows, setActiveWorkflows] = useState(3);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    phone: '',
    location: '',
    isPublic: true,
    riskTolerance: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  });
  const [userStats] = useState<UserStats>({
    totalBalance: 47850.75,
    availableBalance: 12450.25,
    investedAmount: 35400.50,
    totalGains: 8450.75,
    totalDeposits: 45000,
    totalWithdrawals: 5600,
    activeStrategies: 3,
    monthlyReturn: 12.5
  });
  const [accountStatus] = useState<AccountStatus>({
    isVerified: true,
    kycLevel: 'intermediate',
    tradingEnabled: true,
    withdrawalEnabled: true,
    depositEnabled: true
  });

  // Trading dropdown sections
  const quickTradingSections = [
    {
      title: "Quick Trade",
      items: [
        {
          id: 'buy-btc',
          label: 'Buy BTC',
          icon: <DollarSign className="h-4 w-4 text-green-500" />,
          description: '$67,234.50 (+2.34%)',
          onClick: () => router.push('/trading?action=buy&symbol=BTCUSDT')
        },
        {
          id: 'sell-eth',
          label: 'Sell ETH',
          icon: <DollarSign className="h-4 w-4 text-red-500" />,
          description: '$3,456.78 (+1.87%)',
          onClick: () => router.push('/trading?action=sell&symbol=ETHUSDT')
        },
        {
          id: 'market-overview',
          label: 'Market Overview',
          icon: <BarChart className="h-4 w-4" />,
          description: 'View all markets',
          href: '/trading'
        }
      ]
    },
    {
      title: "Portfolio Actions",
      items: [
        {
          id: 'portfolio',
          label: 'View Portfolio',
          icon: <Briefcase className="h-4 w-4" />,
          description: 'Manage your holdings',
          href: '/portfolio'
        },
        {
          id: 'analytics',
          label: 'Performance Analytics',
          icon: <LineChart className="h-4 w-4" />,
          description: 'Track your performance',
          onClick: () => setActiveTab('analytics')
        }
      ]
    }
  ];

  const automationSections = [
    {
      title: "Workflow Management",
      items: [
        {
          id: 'create-workflow',
          label: 'Create New Workflow',
          icon: <Bot className="h-4 w-4" />,
          description: 'Build automated strategies',
          href: '/automation/builder'
        },
        {
          id: 'manage-workflows',
          label: 'Manage Workflows',
          icon: <Settings className="h-4 w-4" />,
          description: `${activeWorkflows} active workflows`,
          onClick: () => setActiveTab('automation')
        }
      ]
    },
    {
      title: "Quick Actions",
      items: [
        {
          id: 'start-workflow',
          label: workflowStatus === 'running' ? 'Pause All' : 'Start All',
          icon: workflowStatus === 'running' ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />,
          onClick: () => {
            const newStatus = workflowStatus === 'running' ? 'paused' : 'running';
            setWorkflowStatus(newStatus);
            toast.success(`Workflows ${newStatus === 'running' ? 'started' : 'paused'}`);
          }
        },
        {
          id: 'stop-all',
          label: 'Stop All Workflows',
          icon: <StopCircle className="h-4 w-4 text-red-500" />,
          onClick: () => {
            setWorkflowStatus('idle');
            toast.success('All workflows stopped');
          }
        }
      ]
    }
  ];

  const toolsSections = [
    {
      title: "Analysis Tools",
      items: [
        {
          id: 'market-scanner',
          label: 'Market Scanner',
          icon: <Search className="h-4 w-4" />,
          description: 'Find opportunities',
          href: '/tools/scanner'
        },
        {
          id: 'screener',
          label: 'Stock Screener',
          icon: <Filter className="h-4 w-4" />,
          description: 'Filter by criteria',
          href: '/tools/screener'
        }
      ]
    },
    {
      items: [
        {
          id: 'export-data',
          label: 'Export Portfolio',
          icon: <Download className="h-4 w-4" />,
          onClick: () => toast.success('Exporting portfolio data...')
        },
        {
          id: 'share-performance',
          label: 'Share Performance',
          icon: <Share className="h-4 w-4" />,
          onClick: () => toast.success('Performance report shared!')
        }
      ]
    }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use the user data from context
      if (user) {
        const mockProfile: UserProfile = {
          id: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          email: user.email,
          phone: '',
          bio: user.bio || '',
          location: '',
          avatar: user.avatar,
          accountType: user.accountType || 'INDIVIDUAL',
          isVerified: user.isVerified || false,
          isPublic: user.isPublic || true,
          riskTolerance: 'MEDIUM',
          totalBalance: userStats.totalBalance,
          availableBalance: userStats.availableBalance,
          createdAt: user.createdAt || new Date().toISOString(),
          _count: {
            followers: 0,
            following: 0,
            portfolios: 0
          }
        };
        setProfile(mockProfile);
        setFormData({
          firstName: mockProfile.firstName,
          lastName: mockProfile.lastName,
          username: mockProfile.username,
          bio: mockProfile.bio || '',
          phone: mockProfile.phone || '',
          location: mockProfile.location || '',
          isPublic: mockProfile.isPublic,
          riskTolerance: mockProfile.riskTolerance
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real app, this would be an API call
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        isPublic: profile.isPublic,
        riskTolerance: profile.riskTolerance
      });
    }
    setIsEditing(false);
  };

  const getKYCLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-blue-600 bg-blue-50';
      case 'basic': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getKYCLevelText = (level: string) => {
    switch (level) {
      case 'advanced': return 'Advanced Verified';
      case 'intermediate': return 'Intermediate Verified';
      case 'basic': return 'Basic Verified';
      default: return 'Not Verified';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account, finances, and trading preferences</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getKYCLevelColor(accountStatus.kycLevel)}>
              <Shield className="w-3 h-3 mr-1" />
              {getKYCLevelText(accountStatus.kycLevel)}
            </Badge>
            {accountStatus.isVerified && (
              <Badge className="text-green-600 bg-green-50">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <div className="flex items-center space-x-2">
                    <p className={cn("text-2xl font-bold", !balanceVisible && "blur-sm")}>
                      {formatCurrency(userStats.totalBalance)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBalanceVisible(!balanceVisible)}
                    >
                      {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Wallet className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gains</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    userStats.totalGains >= 0 ? 'text-green-600' : 'text-red-600',
                    !balanceVisible && "blur-sm"
                  )}>
                    {userStats.totalGains >= 0 ? '+' : ''}{formatCurrency(userStats.totalGains)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Strategies</p>
                  <p className="text-2xl font-bold">{userStats.activeStrategies}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Return</p>
                  <p className="text-2xl font-bold text-green-600">+{userStats.monthlyReturn}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Automation</p>
                  <p className="text-2xl font-bold">{activeWorkflows}</p>
                  <p className={`text-sm ${
                    workflowStatus === 'running' ? 'text-green-600' : 
                    workflowStatus === 'paused' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {workflowStatus === 'running' ? 'Active' : 
                     workflowStatus === 'paused' ? 'Paused' : 'Idle'}
                  </p>
                </div>
                <Bot className={`w-8 h-8 ${
                  workflowStatus === 'running' ? 'text-green-500' : 
                  workflowStatus === 'paused' ? 'text-yellow-500' : 'text-gray-500'
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Status Alerts */}
        {!accountStatus.isVerified && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your account is not fully verified. Complete KYC verification to unlock all features.
            </AlertDescription>
          </Alert>
        )}
        
        {accountStatus.kycLevel === 'basic' && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Upgrade to Intermediate verification to increase your withdrawal limits and access advanced trading features.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="banking" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Banking</span>
              </TabsTrigger>
              <TabsTrigger value="trading" className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4" />
                <span>Trading</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>Automation</span>
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>KYC</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Your financial overview at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className={cn("font-semibold", !balanceVisible && "blur-sm")}>
                      {formatCurrency(userStats.availableBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Invested Amount</span>
                    <span className={cn("font-semibold", !balanceVisible && "blur-sm")}>
                      {formatCurrency(userStats.investedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Deposits</span>
                    <span className={cn("font-semibold text-green-600", !balanceVisible && "blur-sm")}>
                      {formatCurrency(userStats.totalDeposits)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Withdrawals</span>
                    <span className={cn("font-semibold text-red-600", !balanceVisible && "blur-sm")}>
                      {formatCurrency(userStats.totalWithdrawals)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('wallet')}
                    disabled={!accountStatus.depositEnabled}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Deposit Funds
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('wallet')}
                    disabled={!accountStatus.withdrawalEnabled}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Withdraw Funds
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('trading')}
                    disabled={!accountStatus.tradingEnabled}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Configure Trading
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('verification')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest transactions and activities</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('history')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Deposit via Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">+$5,000</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowUpDown className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Automated Trade Executed</p>
                        <p className="text-sm text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <span className="font-semibold text-blue-600">BTC/USD</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Strategy Performance Update</p>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepositInterface />
              <WithdrawalInterface />
            </div>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking">
            <BankAccountManager />
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading">
            <AutomatedTradingConfig />
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>Workflow Automation</span>
                </CardTitle>
                <CardDescription>
                  Manage your automated trading workflows and strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workflow Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Workflows</p>
                          <p className="text-2xl font-bold">{activeWorkflows}</p>
                        </div>
                        <PlayCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className={`text-lg font-semibold ${
                            workflowStatus === 'running' ? 'text-green-600' : 
                            workflowStatus === 'paused' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {workflowStatus === 'running' ? 'Running' : 
                             workflowStatus === 'paused' ? 'Paused' : 'Idle'}
                          </p>
                        </div>
                        <div className={`h-3 w-3 rounded-full ${
                          workflowStatus === 'running' ? 'bg-green-500' : 
                          workflowStatus === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Profit</p>
                          <p className="text-2xl font-bold text-green-600">+$2,847</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => {
                      const newStatus = workflowStatus === 'running' ? 'paused' : 'running';
                      setWorkflowStatus(newStatus);
                      toast.success(`Workflows ${newStatus === 'running' ? 'started' : 'paused'}`);
                    }}
                    className={workflowStatus === 'running' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {workflowStatus === 'running' ? (
                      <><PauseCircle className="h-4 w-4 mr-2" />Pause All</>
                    ) : (
                      <><PlayCircle className="h-4 w-4 mr-2" />Start All</>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setWorkflowStatus('idle');
                      toast.success('All workflows stopped');
                    }}
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/automation/builder')}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>

                {/* Active Workflows List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Workflows</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((workflow) => (
                      <Card key={workflow}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`h-3 w-3 rounded-full ${
                                workflowStatus === 'running' ? 'bg-green-500' : 
                                workflowStatus === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`} />
                              <div>
                                <p className="font-medium">BTC Scalping Strategy #{workflow}</p>
                                <p className="text-sm text-muted-foreground">
                                  Last executed: 2 minutes ago • Profit: +$127.50
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <BarChart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Verification Tab */}
          <TabsContent value="verification">
            <KYCVerification />
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <FinancialUserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}