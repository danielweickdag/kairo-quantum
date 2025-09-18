'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserCheck,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Send,
  Settings,
  RefreshCw,
  Search,
  Filter,
  Mail,
  Phone,
  CreditCard,
  Building,
  Globe,
  Camera,
  Upload,
  Zap,
  Target,
  TrendingUp,
  Award,
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  Percent
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  type: 'personal_info' | 'identity_verification' | 'address_verification' | 'financial_info' | 'risk_assessment' | 'account_setup' | 'compliance_check';
  required: boolean;
  automated: boolean;
  estimatedTime: number; // in minutes
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  completionRate: number;
}

interface KYCDocument {
  id: string;
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement' | 'tax_document';
  name: string;
  status: 'pending' | 'uploaded' | 'processing' | 'verified' | 'rejected';
  uploadedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  confidence: number;
  extractedData?: {
    name?: string;
    dateOfBirth?: string;
    address?: string;
    documentNumber?: string;
    expiryDate?: string;
  };
}

interface OnboardingUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  registeredAt: string;
  lastActivity: string;
  currentStep: string;
  overallProgress: number;
  status: 'active' | 'pending_verification' | 'verified' | 'rejected' | 'suspended';
  riskLevel: 'low' | 'medium' | 'high';
  kycStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
  documents: KYCDocument[];
  steps: OnboardingStep[];
  automationEnabled: boolean;
  estimatedCompletion?: string;
}

interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  region: string;
  userType: 'individual' | 'business' | 'institutional';
  steps: string[];
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  averageCompletionTime: number; // in hours
  completionRate: number; // percentage
  enabled: boolean;
  createdAt: string;
  usageCount: number;
}

interface OnboardingMetrics {
  totalUsers: number;
  activeOnboarding: number;
  completedToday: number;
  averageCompletionTime: number;
  completionRate: number;
  automationRate: number;
  verificationSuccessRate: number;
  dropOffRate: number;
}

const mockSteps: OnboardingStep[] = [
  {
    id: '1',
    name: 'Personal Information',
    description: 'Basic personal details and contact information',
    type: 'personal_info',
    required: true,
    automated: false,
    estimatedTime: 5,
    dependencies: [],
    status: 'completed',
    completionRate: 100
  },
  {
    id: '2',
    name: 'Identity Verification',
    description: 'Upload and verify government-issued ID',
    type: 'identity_verification',
    required: true,
    automated: true,
    estimatedTime: 10,
    dependencies: ['1'],
    status: 'completed',
    completionRate: 100
  },
  {
    id: '3',
    name: 'Address Verification',
    description: 'Verify residential address with utility bill',
    type: 'address_verification',
    required: true,
    automated: true,
    estimatedTime: 8,
    dependencies: ['1'],
    status: 'in_progress',
    completionRate: 60
  },
  {
    id: '4',
    name: 'Financial Information',
    description: 'Income source and financial background',
    type: 'financial_info',
    required: true,
    automated: false,
    estimatedTime: 15,
    dependencies: ['2', '3'],
    status: 'pending',
    completionRate: 0
  },
  {
    id: '5',
    name: 'Risk Assessment',
    description: 'Investment experience and risk tolerance',
    type: 'risk_assessment',
    required: true,
    automated: true,
    estimatedTime: 12,
    dependencies: ['4'],
    status: 'pending',
    completionRate: 0
  },
  {
    id: '6',
    name: 'Account Setup',
    description: 'Trading preferences and account configuration',
    type: 'account_setup',
    required: true,
    automated: true,
    estimatedTime: 8,
    dependencies: ['5'],
    status: 'pending',
    completionRate: 0
  },
  {
    id: '7',
    name: 'Compliance Check',
    description: 'Final compliance and regulatory verification',
    type: 'compliance_check',
    required: true,
    automated: true,
    estimatedTime: 5,
    dependencies: ['6'],
    status: 'pending',
    completionRate: 0
  }
];

const mockUsers: OnboardingUser[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0123',
    country: 'United States',
    registeredAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-15T14:45:00Z',
    currentStep: '3',
    overallProgress: 45,
    status: 'pending_verification',
    riskLevel: 'low',
    kycStatus: 'in_progress',
    documents: [
      {
        id: '1',
        type: 'drivers_license',
        name: 'drivers_license_front.jpg',
        status: 'verified',
        uploadedAt: '2024-01-15T11:00:00Z',
        verifiedAt: '2024-01-15T11:15:00Z',
        confidence: 95,
        extractedData: {
          name: 'John Doe',
          dateOfBirth: '1990-05-15',
          documentNumber: 'DL123456789',
          expiryDate: '2026-05-15'
        }
      },
      {
        id: '2',
        type: 'utility_bill',
        name: 'utility_bill_jan2024.pdf',
        status: 'processing',
        uploadedAt: '2024-01-15T14:30:00Z',
        confidence: 0
      }
    ],
    steps: mockSteps,
    automationEnabled: true,
    estimatedCompletion: '2024-01-16T10:00:00Z'
  },
  {
    id: '2',
    email: 'sarah.smith@example.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    phone: '+1-555-0456',
    country: 'Canada',
    registeredAt: '2024-01-14T16:20:00Z',
    lastActivity: '2024-01-15T09:30:00Z',
    currentStep: '5',
    overallProgress: 75,
    status: 'active',
    riskLevel: 'medium',
    kycStatus: 'in_progress',
    documents: [
      {
        id: '3',
        type: 'passport',
        name: 'passport_scan.jpg',
        status: 'verified',
        uploadedAt: '2024-01-14T17:00:00Z',
        verifiedAt: '2024-01-14T17:20:00Z',
        confidence: 98,
        extractedData: {
          name: 'Sarah Smith',
          dateOfBirth: '1985-12-03',
          documentNumber: 'P123456789',
          expiryDate: '2029-12-03'
        }
      },
      {
        id: '4',
        type: 'bank_statement',
        name: 'bank_statement_dec2023.pdf',
        status: 'verified',
        uploadedAt: '2024-01-14T18:00:00Z',
        verifiedAt: '2024-01-14T18:30:00Z',
        confidence: 92
      }
    ],
    steps: mockSteps.map(step => ({ ...step, status: step.id <= '4' ? 'completed' : step.id === '5' ? 'in_progress' : 'pending' })),
    automationEnabled: true,
    estimatedCompletion: '2024-01-15T16:00:00Z'
  },
  {
    id: '3',
    email: 'mike.johnson@example.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    country: 'United Kingdom',
    registeredAt: '2024-01-15T08:15:00Z',
    lastActivity: '2024-01-15T08:45:00Z',
    currentStep: '2',
    overallProgress: 20,
    status: 'pending_verification',
    riskLevel: 'low',
    kycStatus: 'not_started',
    documents: [],
    steps: mockSteps.map(step => ({ ...step, status: step.id === '1' ? 'completed' : step.id === '2' ? 'in_progress' : 'pending' })),
    automationEnabled: false
  }
];

const mockTemplates: OnboardingTemplate[] = [
  {
    id: '1',
    name: 'Standard Individual KYC',
    description: 'Standard onboarding for individual retail traders',
    region: 'Global',
    userType: 'individual',
    steps: ['1', '2', '3', '4', '5', '6', '7'],
    automationLevel: 'semi_automated',
    averageCompletionTime: 2.5,
    completionRate: 87,
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 1250
  },
  {
    id: '2',
    name: 'EU GDPR Compliant',
    description: 'GDPR compliant onboarding for EU residents',
    region: 'European Union',
    userType: 'individual',
    steps: ['1', '2', '3', '4', '5', '6', '7'],
    automationLevel: 'fully_automated',
    averageCompletionTime: 1.8,
    completionRate: 92,
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 890
  },
  {
    id: '3',
    name: 'Business Account Setup',
    description: 'Enhanced KYC for business and corporate accounts',
    region: 'Global',
    userType: 'business',
    steps: ['1', '2', '3', '4', '5', '6', '7'],
    automationLevel: 'semi_automated',
    averageCompletionTime: 4.2,
    completionRate: 78,
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 156
  },
  {
    id: '4',
    name: 'Institutional Client',
    description: 'Comprehensive onboarding for institutional clients',
    region: 'Global',
    userType: 'institutional',
    steps: ['1', '2', '3', '4', '5', '6', '7'],
    automationLevel: 'manual',
    averageCompletionTime: 8.5,
    completionRate: 95,
    enabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    usageCount: 23
  }
];

const mockMetrics: OnboardingMetrics = {
  totalUsers: 2319,
  activeOnboarding: 156,
  completedToday: 23,
  averageCompletionTime: 2.8,
  completionRate: 84.5,
  automationRate: 76.2,
  verificationSuccessRate: 91.3,
  dropOffRate: 15.5
};

export default function UserOnboarding() {
  const [users, setUsers] = useState<OnboardingUser[]>(mockUsers);
  const [templates, setTemplates] = useState<OnboardingTemplate[]>(mockTemplates);
  const [metrics, setMetrics] = useState<OnboardingMetrics>(mockMetrics);
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [selectedUser, setSelectedUser] = useState<OnboardingUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'verified': return 'text-green-500';
      case 'in_progress': case 'processing': case 'active': return 'text-blue-500';
      case 'pending': case 'pending_verification': case 'uploaded': return 'text-yellow-500';
      case 'failed': case 'rejected': case 'suspended': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': case 'processing': case 'active': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending': case 'pending_verification': case 'uploaded': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': case 'rejected': case 'suspended': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport': case 'drivers_license': case 'national_id': return <CreditCard className="h-4 w-4" />;
      case 'utility_bill': case 'bank_statement': return <FileText className="h-4 w-4" />;
      case 'tax_document': return <Building className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const processNextStep = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const currentStepIndex = user.steps.findIndex(s => s.id === user.currentStep);
    if (currentStepIndex < user.steps.length - 1) {
      const nextStep = user.steps[currentStepIndex + 1];
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? {
              ...u,
              currentStep: nextStep.id,
              overallProgress: Math.min(100, u.overallProgress + 15),
              lastActivity: new Date().toISOString(),
              steps: u.steps.map(s => 
                s.id === nextStep.id ? { ...s, status: 'in_progress' } : s
              )
            }
          : u
      ));
    }
  };

  const approveDocument = (userId: string, documentId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? {
            ...user,
            documents: user.documents.map(doc => 
              doc.id === documentId 
                ? { ...doc, status: 'verified', verifiedAt: new Date().toISOString(), confidence: 95 }
                : doc
            ),
            lastActivity: new Date().toISOString()
          }
        : user
    ));
  };

  const rejectDocument = (userId: string, documentId: string, reason: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? {
            ...user,
            documents: user.documents.map(doc => 
              doc.id === documentId 
                ? { ...doc, status: 'rejected', rejectionReason: reason }
                : doc
            ),
            lastActivity: new Date().toISOString()
          }
        : user
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCheck className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">User Onboarding & KYC</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated user verification and compliance management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Processing</span>
            <Switch checked={autoProcessing} onCheckedChange={setAutoProcessing} />
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Active Users</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Onboarding</p>
                    <p className="text-2xl font-bold">{metrics.activeOnboarding}</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
                    <p className="text-2xl font-bold">{metrics.completedToday}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold">{metrics.completionRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion Time</p>
                    <p className="text-2xl font-bold">{metrics.averageCompletionTime}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Automation Rate</p>
                    <p className="text-2xl font-bold">{metrics.automationRate}%</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification Success</p>
                    <p className="text-2xl font-bold">{metrics.verificationSuccessRate}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drop-off Rate</p>
                    <p className="text-2xl font-bold text-red-500">{metrics.dropOffRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Onboarding Activity</CardTitle>
              <CardDescription>Latest user registrations and verification updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(user.status)}
                      <div>
                        <h3 className="font-bold">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getRiskLevelColor(user.riskLevel)}>
                          {user.riskLevel.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {user.overallProgress}% complete
                        </p>
                      </div>
                      <Progress value={user.overallProgress} className="w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map(user => (
              <Card key={user.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedUser(user)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{user.firstName} {user.lastName}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskLevelColor(user.riskLevel)}>
                        {user.riskLevel.toUpperCase()}
                      </Badge>
                      {getStatusIcon(user.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Progress</Label>
                      <div className="flex items-center space-x-2">
                        <Progress value={user.overallProgress} className="flex-1" />
                        <span className="text-sm font-medium">{user.overallProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <Label>KYC Status</Label>
                      <p className="font-medium capitalize">{user.kycStatus.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label>Current Step</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.steps.find(s => s.id === user.currentStep)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <Label>Documents</Label>
                      <p className="font-medium">{user.documents.length} uploaded</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); processNextStep(user.id); }} className="flex-1">
                      <Zap className="h-4 w-4 mr-1" />
                      Process Next
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{template.userType.toUpperCase()}</Badge>
                      <Switch checked={template.enabled} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Region</Label>
                      <p className="font-medium">{template.region}</p>
                    </div>
                    <div>
                      <Label>Automation</Label>
                      <p className="font-medium capitalize">{template.automationLevel.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label>Avg. Time</Label>
                      <p className="font-medium">{template.averageCompletionTime}h</p>
                    </div>
                    <div>
                      <Label>Success Rate</Label>
                      <p className="font-bold text-green-500">{template.completionRate}%</p>
                    </div>
                    <div>
                      <Label>Usage Count</Label>
                      <p className="font-bold text-lg">{template.usageCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Steps</Label>
                      <p className="font-medium">{template.steps.length} steps</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Funnel</CardTitle>
                <CardDescription>User progression through onboarding steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.status === 'completed' ? 'bg-green-500 text-white' :
                          step.status === 'in_progress' ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{step.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ~{step.estimatedTime} min
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{step.completionRate}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.automated ? 'Auto' : 'Manual'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key onboarding performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Completion Rate</span>
                      <span className="text-sm font-bold">{metrics.completionRate}%</span>
                    </div>
                    <Progress value={metrics.completionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Automation Rate</span>
                      <span className="text-sm font-bold">{metrics.automationRate}%</span>
                    </div>
                    <Progress value={metrics.automationRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Verification Success</span>
                      <span className="text-sm font-bold">{metrics.verificationSuccessRate}%</span>
                    </div>
                    <Progress value={metrics.verificationSuccessRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Drop-off Rate</span>
                      <span className="text-sm font-bold text-red-500">{metrics.dropOffRate}%</span>
                    </div>
                    <Progress value={metrics.dropOffRate} className="h-2 bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedUser.firstName} {selectedUser.lastName}</CardTitle>
                  <CardDescription>{selectedUser.email}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedUser.status)}
                    <span className="font-medium capitalize">{selectedUser.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label>Risk Level</Label>
                  <Badge className={getRiskLevelColor(selectedUser.riskLevel)}>
                    {selectedUser.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label>Progress</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedUser.overallProgress} className="flex-1" />
                    <span className="text-sm font-medium">{selectedUser.overallProgress}%</span>
                  </div>
                </div>
                <div>
                  <Label>KYC Status</Label>
                  <p className="font-medium capitalize">{selectedUser.kycStatus.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Steps Progress */}
              <div>
                <h3 className="text-lg font-bold mb-4">Onboarding Steps</h3>
                <div className="space-y-3">
                  {selectedUser.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          step.status === 'completed' ? 'bg-green-500 text-white' :
                          step.status === 'in_progress' ? 'bg-blue-500 text-white' :
                          step.status === 'failed' ? 'bg-red-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{step.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(step.status)}>
                            {step.status.toUpperCase()}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            ~{step.estimatedTime} min
                          </p>
                        </div>
                        {step.status === 'pending' && (
                          <Button size="sm" onClick={() => processNextStep(selectedUser.id)}>
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-bold mb-4">KYC Documents</h3>
                <div className="space-y-3">
                  {selectedUser.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {doc.type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.toUpperCase()}
                          </Badge>
                          {doc.confidence > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {doc.confidence}% confidence
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {doc.status === 'processing' && (
                            <>
                              <Button size="sm" onClick={() => approveDocument(selectedUser.id, doc.id)}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => rejectDocument(selectedUser.id, doc.id, 'Quality issues')}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}