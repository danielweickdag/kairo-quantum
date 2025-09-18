'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Server,
  Database,
  Cloud,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  Download,
  Upload,
  Copy,
  RefreshCw,
  Clock,
  Calendar,
  MapPin,
  Monitor,
  Laptop,
  Tablet,
  Wifi,
  Activity,
  Bell,
  BellOff,
  User,
  Users,
  UserCheck,
  UserX,
  Fingerprint,
  Scan,
  QrCode,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Star,
  Crown,
  Zap,
  Brain,
  Rocket,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  Plus,
  Minus,
  Edit,
  Trash2,
  ExternalLink,
  HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'password_change' | 'two_factor_enabled' | 'two_factor_disabled' | 'api_key_created' | 'api_key_deleted' | 'suspicious_activity' | 'device_added' | 'device_removed'
  description: string
  timestamp: string
  ipAddress: string
  location: string
  device: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
}

interface Device {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  os: string
  browser: string
  lastActive: string
  location: string
  ipAddress: string
  isCurrent: boolean
  isVerified: boolean
}

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed: string
  created: string
  expiresAt?: string
  isActive: boolean
  usageCount: number
}

interface ComplianceItem {
  id: string
  title: string
  description: string
  status: 'compliant' | 'partial' | 'non_compliant'
  lastUpdated: string
  documents: string[]
}

const SecurityCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)

  // Mock data - in real app, this would come from API
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      description: 'Successful login',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'success'
    },
    {
      id: '2',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2024-01-14T15:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'success'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      description: 'Multiple failed login attempts',
      timestamp: '2024-01-13T08:20:00Z',
      ipAddress: '203.0.113.1',
      location: 'Unknown',
      device: 'Unknown',
      userAgent: 'Unknown',
      status: 'warning'
    },
    {
      id: '4',
      type: 'api_key_created',
      description: 'New API key created: Trading Bot',
      timestamp: '2024-01-12T12:00:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'success'
    },
    {
      id: '5',
      type: 'two_factor_enabled',
      description: 'Two-factor authentication enabled',
      timestamp: '2024-01-10T09:15:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'success'
    }
  ])

  const [devices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      os: 'macOS 14.2',
      browser: 'Chrome 120.0',
      lastActive: '2024-01-15T10:30:00Z',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.100',
      isCurrent: true,
      isVerified: true
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      type: 'mobile',
      os: 'iOS 17.2',
      browser: 'Safari 17.0',
      lastActive: '2024-01-14T18:45:00Z',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.101',
      isCurrent: false,
      isVerified: true
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      os: 'iPadOS 17.2',
      browser: 'Safari 17.0',
      lastActive: '2024-01-12T14:20:00Z',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.102',
      isCurrent: false,
      isVerified: true
    }
  ])

  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Trading Bot',
      key: 'sk_live_51234567890abcdef',
      permissions: ['read', 'trade', 'withdraw'],
      lastUsed: '2024-01-15T09:30:00Z',
      created: '2024-01-12T12:00:00Z',
      isActive: true,
      usageCount: 1247
    },
    {
      id: '2',
      name: 'Portfolio Tracker',
      key: 'sk_live_09876543210fedcba',
      permissions: ['read'],
      lastUsed: '2024-01-14T16:45:00Z',
      created: '2024-01-08T10:30:00Z',
      isActive: true,
      usageCount: 892
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      key: 'sk_live_11223344556677889',
      permissions: ['read', 'analytics'],
      lastUsed: '2024-01-10T11:20:00Z',
      created: '2024-01-05T14:15:00Z',
      expiresAt: '2024-07-05T14:15:00Z',
      isActive: false,
      usageCount: 456
    }
  ])

  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: '1',
      title: 'GDPR Compliance',
      description: 'General Data Protection Regulation compliance for EU users',
      status: 'compliant',
      lastUpdated: '2024-01-01T00:00:00Z',
      documents: ['Privacy Policy', 'Data Processing Agreement', 'Cookie Policy']
    },
    {
      id: '2',
      title: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      status: 'compliant',
      lastUpdated: '2023-12-15T00:00:00Z',
      documents: ['SOC 2 Report', 'Security Audit', 'Penetration Test Results']
    },
    {
      id: '3',
      title: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard',
      status: 'compliant',
      lastUpdated: '2023-11-30T00:00:00Z',
      documents: ['PCI Compliance Certificate', 'Security Assessment']
    },
    {
      id: '4',
      title: 'ISO 27001',
      description: 'Information Security Management System',
      status: 'partial',
      lastUpdated: '2023-10-15T00:00:00Z',
      documents: ['ISO 27001 Certificate', 'Risk Assessment']
    },
    {
      id: '5',
      title: 'CCPA Compliance',
      description: 'California Consumer Privacy Act compliance',
      status: 'compliant',
      lastUpdated: '2024-01-01T00:00:00Z',
      documents: ['Privacy Notice', 'Data Subject Rights Policy']
    }
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="w-4 h-4" />
      case 'logout':
        return <UserX className="w-4 h-4" />
      case 'password_change':
        return <Key className="w-4 h-4" />
      case 'two_factor_enabled':
      case 'two_factor_disabled':
        return <Shield className="w-4 h-4" />
      case 'api_key_created':
      case 'api_key_deleted':
        return <Key className="w-4 h-4" />
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />
      case 'device_added':
      case 'device_removed':
        return <Monitor className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getEventColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop':
        return <Monitor className="w-5 h-5" />
      case 'mobile':
        return <Smartphone className="w-5 h-5" />
      case 'tablet':
        return <Tablet className="w-5 h-5" />
      default:
        return <Laptop className="w-5 h-5" />
    }
  }

  const getComplianceStatus = (status: string) => {
    switch (status) {
      case 'compliant':
        return {
          color: 'text-green-400',
          bg: 'bg-green-500/20 border-green-500/30',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'partial':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20 border-yellow-500/30',
          icon: <AlertTriangle className="w-4 h-4" />
        }
      case 'non_compliant':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20 border-red-500/30',
          icon: <XCircle className="w-4 h-4" />
        }
      default:
        return {
          color: 'text-gray-400',
          bg: 'bg-gray-500/20 border-gray-500/30',
          icon: <Info className="w-4 h-4" />
        }
    }
  }

  const maskApiKey = (key: string) => {
    return key.slice(0, 12) + '•'.repeat(20) + key.slice(-4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Security & Compliance
            </h1>
            <p className="text-gray-300">
              Manage your account security, privacy settings, and compliance status
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Security Report
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
          </div>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Secure
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Security Score</p>
                <p className="text-2xl font-bold text-green-400">98/100</p>
                <p className="text-gray-400 text-sm mt-2">Excellent security posture</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-blue-400" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">2FA Status</p>
                <p className="text-2xl font-bold text-white">Enabled</p>
                <p className="text-gray-400 text-sm mt-2">TOTP authenticator</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-purple-400" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {devices.length} Devices
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Trusted Devices</p>
                <p className="text-2xl font-bold text-white">{devices.filter(d => d.isVerified).length}</p>
                <p className="text-gray-400 text-sm mt-2">Verified and secure</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Compliant
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Compliance</p>
                <p className="text-2xl font-bold text-white">
                  {complianceItems.filter(c => c.status === 'compliant').length}/{complianceItems.length}
                </p>
                <p className="text-gray-400 text-sm mt-2">Standards met</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="authentication" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Key className="w-4 h-4 mr-2" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Monitor className="w-4 h-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Settings */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Two-Factor Authentication</p>
                      <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled} 
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Security alerts via email</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">SMS Notifications</p>
                      <p className="text-gray-400 text-sm">Security alerts via SMS</p>
                    </div>
                    <Switch 
                      checked={smsNotifications} 
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Security Events */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center space-x-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          event.status === 'success' && "bg-green-500/20",
                          event.status === 'warning' && "bg-yellow-500/20",
                          event.status === 'failed' && "bg-red-500/20"
                        )}>
                          <div className={getEventColor(event.status)}>
                            {getEventIcon(event.type)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">
                            {event.description}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {event.location} • {getTimeAgo(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Password Security */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Password Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Current Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">New Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Confirm New Password</label>
                    <Input 
                      type="password" 
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
              
              {/* Two-Factor Authentication */}
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Authenticator App</p>
                        <p className="text-gray-400 text-sm">TOTP via Google Authenticator</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Email Backup</p>
                        <p className="text-gray-400 text-sm">Backup codes via email</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      Setup
                    </Button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-gray-600 text-gray-300"
                      onClick={() => setShowQRCode(true)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Show QR Code
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-gray-600 text-gray-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Backup Codes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Trusted Devices</CardTitle>
                  <Button variant="outline" className="border-gray-600 text-gray-300">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-white">{device.name}</p>
                            {device.isCurrent && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                Current
                              </Badge>
                            )}
                            {device.isVerified && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {device.os} • {device.browser}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {device.location} • Last active {getTimeAgo(device.lastActive)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!device.isCurrent && (
                          <Button variant="ghost" size="sm" className="text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>API Keys</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          apiKey.isActive ? "bg-green-500/20" : "bg-gray-500/20"
                        )}>
                          <Key className={cn(
                            "w-5 h-5",
                            apiKey.isActive ? "text-green-400" : "text-gray-400"
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-white">{apiKey.name}</p>
                            <Badge className={cn(
                              apiKey.isActive 
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            )}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm font-mono">
                            {showApiKey === apiKey.id ? apiKey.key : maskApiKey(apiKey.key)}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-gray-500 text-xs">
                              Created: {formatDate(apiKey.created)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Last used: {getTimeAgo(apiKey.lastUsed)}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Usage: {apiKey.usageCount.toLocaleString()} calls
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 mt-2">
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400"
                          onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                        >
                          {showApiKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Security Activity Log</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-900/50 rounded-lg">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        event.status === 'success' && "bg-green-500/20",
                        event.status === 'warning' && "bg-yellow-500/20",
                        event.status === 'failed' && "bg-red-500/20"
                      )}>
                        <div className={getEventColor(event.status)}>
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{event.description}</p>
                          <p className="text-gray-400 text-sm">{formatDate(event.timestamp)}</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-500">IP Address</p>
                            <p className="text-gray-300">{event.ipAddress}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="text-gray-300">{event.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Device</p>
                            <p className="text-gray-300">{event.device}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <Badge className={cn(
                              "text-xs",
                              event.status === 'success' && "bg-green-500/20 text-green-400 border-green-500/30",
                              event.status === 'warning' && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                              event.status === 'failed' && "bg-red-500/20 text-red-400 border-red-500/30"
                            )}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceItems.map((item) => {
                const status = getComplianceStatus(item.status)
                return (
                  <Card key={item.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            status.bg.split(' ')[0] + '/20'
                          )}>
                            <div className={status.color}>
                              {status.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                        </div>
                        <Badge className={status.bg + ' ' + status.color}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-gray-400 text-sm">Related Documents:</p>
                        <div className="space-y-1">
                          {item.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{doc}</span>
                              <Button variant="ghost" size="sm" className="text-gray-400 h-6 px-2">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-gray-300">{formatDate(item.lastUpdated)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Setup Authenticator</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQRCode(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-black" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm mb-2">
                    Scan this QR code with your authenticator app
                  </p>
                  <p className="text-gray-400 text-xs">
                    Or enter this key manually: JBSWY3DPEHPK3PXP
                  </p>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={() => setShowQRCode(false)}
                >
                  I&apos;ve Added the Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityCompliance