'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Activity,
  Shield,
  Bell,
  FileText,
  Users,
  CreditCard,
  Database,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Cpu,
  Server,
  Wifi,
  WifiOff,
  Power,
  PowerOff,
  BarChart3,
  PieChart,
  LineChart,
  Monitor,
  Eye,
  Download,
  Upload,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Globe,
  Lock,
  Unlock,
  Star,
  Award,
  Gauge,
  Timer,
  Workflow
} from 'lucide-react';

interface AutomationModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  isEnabled: boolean;
  uptime: number;
  lastActivity: string;
  performance: {
    successRate: number;
    executionsToday: number;
    averageResponseTime: number;
    errorCount: number;
  };
  metrics: {
    totalExecutions: number;
    totalSavings: number;
    efficiency: number;
  };
  dependencies: string[];
  version: string;
  nextUpdate?: string;
}

interface SystemMetrics {
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  successRate: number;
  costSavings: number;
  timesSaved: number;
  errorRate: number;
  systemLoad: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
}

interface AutomationEvent {
  id: string;
  moduleId: string;
  moduleName: string;
  type: 'execution' | 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface AutomationSchedule {
  id: string;
  name: string;
  moduleId: string;
  moduleName: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  isActive: boolean;
  executionCount: number;
  averageDuration: number;
}

const mockModules: AutomationModule[] = [
  {
    id: 'trading-bot',
    name: 'AI Trading Bot',
    description: 'Automated trading with AI-powered decision making',
    icon: <Bot className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 99.8,
    lastActivity: '2024-01-15T16:45:00Z',
    performance: {
      successRate: 94.2,
      executionsToday: 1247,
      averageResponseTime: 0.8,
      errorCount: 3
    },
    metrics: {
      totalExecutions: 45678,
      totalSavings: 125000,
      efficiency: 96.5
    },
    dependencies: ['data-pipeline', 'risk-management'],
    version: '2.1.4'
  },
  {
    id: 'data-pipeline',
    name: 'Real-time Data Pipeline',
    description: 'Market data feeds and price updates',
    icon: <Database className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 99.9,
    lastActivity: '2024-01-15T16:46:00Z',
    performance: {
      successRate: 99.1,
      executionsToday: 8640,
      averageResponseTime: 0.2,
      errorCount: 1
    },
    metrics: {
      totalExecutions: 2456789,
      totalSavings: 85000,
      efficiency: 99.2
    },
    dependencies: [],
    version: '1.8.2'
  },
  {
    id: 'copy-trading',
    name: 'Auto Copy Trading',
    description: 'Automated copy trading execution and portfolio rebalancing',
    icon: <Activity className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 98.7,
    lastActivity: '2024-01-15T16:44:00Z',
    performance: {
      successRate: 91.8,
      executionsToday: 567,
      averageResponseTime: 1.2,
      errorCount: 8
    },
    metrics: {
      totalExecutions: 23456,
      totalSavings: 95000,
      efficiency: 93.4
    },
    dependencies: ['trading-bot', 'risk-management'],
    version: '1.5.7'
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    description: 'Automated risk monitoring and stop-loss management',
    icon: <Shield className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 99.5,
    lastActivity: '2024-01-15T16:45:30Z',
    performance: {
      successRate: 97.3,
      executionsToday: 2341,
      averageResponseTime: 0.5,
      errorCount: 2
    },
    metrics: {
      totalExecutions: 156789,
      totalSavings: 450000,
      efficiency: 98.1
    },
    dependencies: ['data-pipeline'],
    version: '2.0.1'
  },
  {
    id: 'notifications',
    name: 'Notification System',
    description: 'Automated alerts and notifications',
    icon: <Bell className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 99.2,
    lastActivity: '2024-01-15T16:43:00Z',
    performance: {
      successRate: 98.9,
      executionsToday: 4567,
      averageResponseTime: 0.3,
      errorCount: 5
    },
    metrics: {
      totalExecutions: 789123,
      totalSavings: 25000,
      efficiency: 97.8
    },
    dependencies: [],
    version: '1.3.9'
  },
  {
    id: 'reporting',
    name: 'Analytics & Reporting',
    description: 'Automated report generation and analytics',
    icon: <FileText className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 98.9,
    lastActivity: '2024-01-15T16:40:00Z',
    performance: {
      successRate: 96.7,
      executionsToday: 234,
      averageResponseTime: 2.1,
      errorCount: 1
    },
    metrics: {
      totalExecutions: 12345,
      totalSavings: 75000,
      efficiency: 95.2
    },
    dependencies: ['data-pipeline'],
    version: '1.7.3'
  },
  {
    id: 'user-onboarding',
    name: 'User Onboarding',
    description: 'Automated KYC verification and user workflows',
    icon: <Users className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 97.8,
    lastActivity: '2024-01-15T16:35:00Z',
    performance: {
      successRate: 89.4,
      executionsToday: 89,
      averageResponseTime: 5.2,
      errorCount: 4
    },
    metrics: {
      totalExecutions: 5678,
      totalSavings: 35000,
      efficiency: 91.7
    },
    dependencies: [],
    version: '1.2.1'
  },
  {
    id: 'payment-processing',
    name: 'Payment Processing',
    description: 'Automated payment and subscription management',
    icon: <CreditCard className="h-6 w-6" />,
    status: 'active',
    isEnabled: true,
    uptime: 99.6,
    lastActivity: '2024-01-15T16:46:30Z',
    performance: {
      successRate: 96.8,
      executionsToday: 1456,
      averageResponseTime: 1.8,
      errorCount: 7
    },
    metrics: {
      totalExecutions: 67890,
      totalSavings: 180000,
      efficiency: 97.5
    },
    dependencies: ['notifications'],
    version: '2.3.1'
  }
];

const mockSystemMetrics: SystemMetrics = {
  totalAutomations: 8,
  activeAutomations: 8,
  totalExecutions: 3567890,
  successRate: 95.8,
  costSavings: 1070000,
  timesSaved: 8760, // hours
  errorRate: 0.8,
  systemLoad: 67,
  memoryUsage: 72,
  cpuUsage: 45,
  networkLatency: 12
};

const mockEvents: AutomationEvent[] = [
  {
    id: '1',
    moduleId: 'trading-bot',
    moduleName: 'AI Trading Bot',
    type: 'success',
    message: 'Successfully executed 50 trades with 94% success rate',
    timestamp: '2024-01-15T16:45:00Z',
    severity: 'low',
    resolved: true
  },
  {
    id: '2',
    moduleId: 'risk-management',
    moduleName: 'Risk Management',
    type: 'warning',
    message: 'High volatility detected in EURUSD pair',
    timestamp: '2024-01-15T16:42:00Z',
    severity: 'medium',
    resolved: false
  },
  {
    id: '3',
    moduleId: 'payment-processing',
    moduleName: 'Payment Processing',
    type: 'error',
    message: 'Failed payment retry for subscription ID: sub_12345',
    timestamp: '2024-01-15T16:38:00Z',
    severity: 'high',
    resolved: false
  },
  {
    id: '4',
    moduleId: 'data-pipeline',
    moduleName: 'Real-time Data Pipeline',
    type: 'info',
    message: 'Successfully processed 10M data points in the last hour',
    timestamp: '2024-01-15T16:35:00Z',
    severity: 'low',
    resolved: true
  },
  {
    id: '5',
    moduleId: 'notifications',
    moduleName: 'Notification System',
    type: 'success',
    message: 'Sent 1,247 notifications with 99.8% delivery rate',
    timestamp: '2024-01-15T16:30:00Z',
    severity: 'low',
    resolved: true
  }
];

const mockSchedules: AutomationSchedule[] = [
  {
    id: '1',
    name: 'Daily Portfolio Rebalance',
    moduleId: 'copy-trading',
    moduleName: 'Auto Copy Trading',
    schedule: '0 0 * * *',
    nextRun: '2024-01-16T00:00:00Z',
    lastRun: '2024-01-15T00:00:00Z',
    isActive: true,
    executionCount: 365,
    averageDuration: 45.2
  },
  {
    id: '2',
    name: 'Weekly Risk Assessment',
    moduleId: 'risk-management',
    moduleName: 'Risk Management',
    schedule: '0 0 * * 0',
    nextRun: '2024-01-21T00:00:00Z',
    lastRun: '2024-01-14T00:00:00Z',
    isActive: true,
    executionCount: 52,
    averageDuration: 120.5
  },
  {
    id: '3',
    name: 'Monthly Analytics Report',
    moduleId: 'reporting',
    moduleName: 'Analytics & Reporting',
    schedule: '0 0 1 * *',
    nextRun: '2024-02-01T00:00:00Z',
    lastRun: '2024-01-01T00:00:00Z',
    isActive: true,
    executionCount: 12,
    averageDuration: 300.8
  },
  {
    id: '4',
    name: 'Payment Retry Process',
    moduleId: 'payment-processing',
    moduleName: 'Payment Processing',
    schedule: '0 */6 * * *',
    nextRun: '2024-01-15T18:00:00Z',
    lastRun: '2024-01-15T12:00:00Z',
    isActive: true,
    executionCount: 1460,
    averageDuration: 15.3
  }
];

export default function AutomationDashboard() {
  const [modules, setModules] = useState<AutomationModule[]>(mockModules);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(mockSystemMetrics);
  const [events, setEvents] = useState<AutomationEvent[]>(mockEvents);
  const [schedules, setSchedules] = useState<AutomationSchedule[]>(mockSchedules);
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'error': return 'text-red-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <PowerOff className="h-4 w-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { 
            ...module, 
            isEnabled: !module.isEnabled,
            status: !module.isEnabled ? 'active' : 'inactive'
          }
        : module
    ));
  };

  const toggleMasterSwitch = () => {
    setMasterSwitch(!masterSwitch);
    setModules(prev => prev.map(module => ({
      ...module,
      isEnabled: !masterSwitch,
      status: !masterSwitch ? 'active' : 'inactive'
    })));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Workflow className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Automation Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Central control panel for all automated systems</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Master Control</span>
            <Switch checked={masterSwitch} onCheckedChange={toggleMasterSwitch} />
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </div>

      <Tabs value="overview" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Automations</p>
                    <p className="text-2xl font-bold">{systemMetrics.totalAutomations}</p>
                  </div>
                  <Workflow className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-green-500">
                    {systemMetrics.activeAutomations} active
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Executions</p>
                    <p className="text-2xl font-bold">{formatNumber(systemMetrics.totalExecutions)}</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-green-500">
                    {systemMetrics.successRate}% success rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost Savings</p>
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(systemMetrics.costSavings)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatNumber(systemMetrics.timesSaved)} hours saved
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                    <p className="text-2xl font-bold text-green-500">Excellent</p>
                  </div>
                  <Gauge className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-2">
                  <p className="text-sm text-red-500">
                    {systemMetrics.errorRate}% error rate
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Load</span>
                    <span>{systemMetrics.systemLoad}%</span>
                  </div>
                  <Progress value={systemMetrics.systemLoad} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network Latency</span>
                    <span>{systemMetrics.networkLatency}ms</span>
                  </div>
                  <Progress value={(systemMetrics.networkLatency / 100) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Status Overview</CardTitle>
                <CardDescription>Current status of all automation modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {modules.slice(0, 8).map(module => (
                    <div key={module.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {module.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{module.name}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(module.status)}
                          <span className={`text-xs ${getStatusColor(module.status)}`}>
                            {module.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest automation events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type).replace('text-', 'bg-')}`} />
                      <div>
                        <p className="font-medium">{event.message}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.moduleName} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      {!event.resolved && (
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModules.map(module => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {module.icon}
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(module.status)}
                      <Switch 
                        checked={module.isEnabled} 
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                      <p className="text-lg font-bold text-green-500">{module.performance.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                      <p className="text-lg font-bold">{module.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Executions Today</p>
                      <p className="text-lg font-bold">{formatNumber(module.performance.executionsToday)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
                      <p className="text-lg font-bold">{module.performance.averageResponseTime}s</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Savings</p>
                      <p className="text-lg font-bold text-green-500">{formatCurrency(module.metrics.totalSavings)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency</p>
                      <p className="text-lg font-bold">{module.metrics.efficiency}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Version {module.version}</p>
                      <p className="text-xs text-gray-500">
                        Last activity: {new Date(module.lastActivity).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Real-time Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Health</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Modules</span>
                    <span className="font-bold">{systemMetrics.activeAutomations}/{systemMetrics.totalAutomations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-bold text-green-500">{systemMetrics.errorRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network Status</span>
                    <Wifi className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Load</span>
                      <span>{systemMetrics.systemLoad}%</span>
                    </div>
                    <Progress value={systemMetrics.systemLoad} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Modules
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    <Monitor className="h-4 w-4 mr-2" />
                    View Dashboards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Schedules</CardTitle>
              <CardDescription>Scheduled automation tasks and their execution times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        schedule.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h3 className="font-bold">{schedule.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.moduleName} • {schedule.schedule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Run</p>
                        <p className="font-bold">
                          {new Date(schedule.nextRun).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Executions</p>
                        <p className="font-bold">{formatNumber(schedule.executionCount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
                        <p className="font-bold">{schedule.averageDuration}s</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Real-time events, alerts, and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type).replace('text-', 'bg-')}`} />
                      <div>
                        <h3 className="font-bold">{event.message}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.moduleName} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <div className="flex space-x-2">
                        {!event.resolved && (
                          <Button size="sm">
                            Resolve
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}