'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Select component not available - using basic select
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Target,
  Activity,
  Users,
  Mail,
  Settings,
  RefreshCw,
  Eye,
  Share,
  Filter,
  PieChart,
  LineChart,
  BarChart,
  Table,
  FileBarChart,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'risk' | 'trading' | 'portfolio' | 'compliance' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'on_demand';
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  enabled: boolean;
  lastGenerated?: string;
  nextScheduled?: string;
  recipients: string[];
  sections: string[];
  filters: {
    dateRange?: string;
    traders?: string[];
    symbols?: string[];
    minAmount?: number;
  };
  generatedCount: number;
}

interface AnalyticsMetric {
  id: string;
  name: string;
  category: 'performance' | 'risk' | 'trading' | 'portfolio';
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  unit: 'currency' | 'percentage' | 'count' | 'ratio';
  description: string;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  type: string;
  format: string;
  generatedAt: string;
  status: 'generating' | 'completed' | 'failed' | 'sent';
  fileSize?: string;
  downloadUrl?: string;
  recipients: string[];
  error?: string;
}

interface ScheduledReport {
  id: string;
  templateId: string;
  templateName: string;
  frequency: string;
  nextRun: string;
  lastRun?: string;
  enabled: boolean;
  recipients: string[];
  runCount: number;
}

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Daily Performance Summary',
    description: 'Comprehensive daily trading performance report',
    type: 'performance',
    frequency: 'daily',
    format: 'pdf',
    enabled: true,
    lastGenerated: '2024-01-15T08:00:00Z',
    nextScheduled: '2024-01-16T08:00:00Z',
    recipients: ['trader@example.com', 'manager@example.com'],
    sections: ['portfolio_overview', 'trade_summary', 'pnl_analysis', 'risk_metrics'],
    filters: { dateRange: '1d' },
    generatedCount: 45
  },
  {
    id: '2',
    name: 'Weekly Risk Assessment',
    description: 'Weekly risk analysis and compliance report',
    type: 'risk',
    frequency: 'weekly',
    format: 'excel',
    enabled: true,
    lastGenerated: '2024-01-14T18:00:00Z',
    nextScheduled: '2024-01-21T18:00:00Z',
    recipients: ['risk@example.com'],
    sections: ['risk_overview', 'var_analysis', 'stress_testing', 'compliance_check'],
    filters: { dateRange: '7d' },
    generatedCount: 12
  },
  {
    id: '3',
    name: 'Monthly Portfolio Report',
    description: 'Detailed monthly portfolio performance and allocation',
    type: 'portfolio',
    frequency: 'monthly',
    format: 'pdf',
    enabled: true,
    lastGenerated: '2024-01-01T09:00:00Z',
    nextScheduled: '2024-02-01T09:00:00Z',
    recipients: ['investor@example.com', 'advisor@example.com'],
    sections: ['portfolio_summary', 'allocation_analysis', 'performance_attribution', 'benchmark_comparison'],
    filters: { dateRange: '30d' },
    generatedCount: 3
  },
  {
    id: '4',
    name: 'Copy Trading Analytics',
    description: 'Analysis of copy trading performance by trader',
    type: 'trading',
    frequency: 'weekly',
    format: 'html',
    enabled: false,
    lastGenerated: '2024-01-07T12:00:00Z',
    recipients: ['analytics@example.com'],
    sections: ['trader_rankings', 'copy_performance', 'follower_analysis'],
    filters: { dateRange: '7d' },
    generatedCount: 8
  },
  {
    id: '5',
    name: 'Compliance Report',
    description: 'Regulatory compliance and audit trail',
    type: 'compliance',
    frequency: 'monthly',
    format: 'excel',
    enabled: true,
    lastGenerated: '2024-01-01T10:00:00Z',
    nextScheduled: '2024-02-01T10:00:00Z',
    recipients: ['compliance@example.com', 'legal@example.com'],
    sections: ['trade_audit', 'kyc_status', 'risk_violations', 'regulatory_metrics'],
    filters: { dateRange: '30d' },
    generatedCount: 3
  }
];

const mockMetrics: AnalyticsMetric[] = [
  {
    id: '1',
    name: 'Total Portfolio Value',
    category: 'portfolio',
    value: 125750,
    previousValue: 118900,
    change: 6850,
    changePercent: 5.76,
    trend: 'up',
    unit: 'currency',
    description: 'Total value of all positions and cash'
  },
  {
    id: '2',
    name: 'Daily Return',
    category: 'performance',
    value: 2.34,
    previousValue: -0.87,
    change: 3.21,
    changePercent: 368.97,
    trend: 'up',
    unit: 'percentage',
    description: 'Daily portfolio return percentage'
  },
  {
    id: '3',
    name: 'Sharpe Ratio',
    category: 'risk',
    value: 1.85,
    previousValue: 1.72,
    change: 0.13,
    changePercent: 7.56,
    trend: 'up',
    unit: 'ratio',
    description: 'Risk-adjusted return measure'
  },
  {
    id: '4',
    name: 'Active Trades',
    category: 'trading',
    value: 23,
    previousValue: 19,
    change: 4,
    changePercent: 21.05,
    trend: 'up',
    unit: 'count',
    description: 'Number of currently active positions'
  },
  {
    id: '5',
    name: 'Win Rate',
    category: 'performance',
    value: 68.5,
    previousValue: 71.2,
    change: -2.7,
    changePercent: -3.79,
    trend: 'down',
    unit: 'percentage',
    description: 'Percentage of profitable trades'
  },
  {
    id: '6',
    name: 'Max Drawdown',
    category: 'risk',
    value: -8.7,
    previousValue: -6.4,
    change: -2.3,
    changePercent: 35.94,
    trend: 'down',
    unit: 'percentage',
    description: 'Maximum peak-to-trough decline'
  },
  {
    id: '7',
    name: 'Average Trade Size',
    category: 'trading',
    value: 2450,
    previousValue: 2180,
    change: 270,
    changePercent: 12.39,
    trend: 'up',
    unit: 'currency',
    description: 'Average size of executed trades'
  },
  {
    id: '8',
    name: 'Portfolio Beta',
    category: 'risk',
    value: 1.23,
    previousValue: 1.18,
    change: 0.05,
    changePercent: 4.24,
    trend: 'up',
    unit: 'ratio',
    description: 'Portfolio sensitivity to market movements'
  }
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Daily Performance Summary',
    type: 'performance',
    format: 'pdf',
    generatedAt: '2024-01-15T08:00:00Z',
    status: 'completed',
    fileSize: '2.4 MB',
    downloadUrl: '/reports/daily-performance-2024-01-15.pdf',
    recipients: ['trader@example.com', 'manager@example.com']
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Weekly Risk Assessment',
    type: 'risk',
    format: 'excel',
    generatedAt: '2024-01-14T18:00:00Z',
    status: 'sent',
    fileSize: '1.8 MB',
    downloadUrl: '/reports/weekly-risk-2024-01-14.xlsx',
    recipients: ['risk@example.com']
  },
  {
    id: '3',
    templateId: '1',
    templateName: 'Daily Performance Summary',
    type: 'performance',
    format: 'pdf',
    generatedAt: '2024-01-14T08:00:00Z',
    status: 'completed',
    fileSize: '2.2 MB',
    downloadUrl: '/reports/daily-performance-2024-01-14.pdf',
    recipients: ['trader@example.com', 'manager@example.com']
  },
  {
    id: '4',
    templateId: '3',
    templateName: 'Monthly Portfolio Report',
    type: 'portfolio',
    format: 'pdf',
    generatedAt: '2024-01-13T10:30:00Z',
    status: 'generating',
    recipients: ['investor@example.com', 'advisor@example.com']
  },
  {
    id: '5',
    templateId: '4',
    templateName: 'Copy Trading Analytics',
    type: 'trading',
    format: 'html',
    generatedAt: '2024-01-12T15:45:00Z',
    status: 'failed',
    error: 'Data source unavailable',
    recipients: ['analytics@example.com']
  }
];

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Daily Performance Summary',
    frequency: 'daily',
    nextRun: '2024-01-16T08:00:00Z',
    lastRun: '2024-01-15T08:00:00Z',
    enabled: true,
    recipients: ['trader@example.com', 'manager@example.com'],
    runCount: 45
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Weekly Risk Assessment',
    frequency: 'weekly',
    nextRun: '2024-01-21T18:00:00Z',
    lastRun: '2024-01-14T18:00:00Z',
    enabled: true,
    recipients: ['risk@example.com'],
    runCount: 12
  },
  {
    id: '3',
    templateId: '3',
    templateName: 'Monthly Portfolio Report',
    frequency: 'monthly',
    nextRun: '2024-02-01T09:00:00Z',
    lastRun: '2024-01-01T09:00:00Z',
    enabled: true,
    recipients: ['investor@example.com', 'advisor@example.com'],
    runCount: 3
  }
];

export default function ReportingAnalytics() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>(mockMetrics);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(mockGeneratedReports);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [autoReporting, setAutoReporting] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, enabled: !template.enabled } : template
    ));
  };

  const generateReport = async (templateId: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        templateId: template.id,
        templateName: template.name,
        type: template.type,
        format: template.format,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        fileSize: '2.1 MB',
        downloadUrl: `/reports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${template.format}`,
        recipients: template.recipients
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, generatedCount: t.generatedCount + 1, lastGenerated: new Date().toISOString() } : t
      ));
    }
    
    setIsGenerating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'sent': return 'text-blue-500';
      case 'generating': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
      case 'generating': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    switch (unit) {
      case 'currency': return `$${value.toLocaleString()}`;
      case 'percentage': return `${value.toFixed(2)}%`;
      case 'count': return value.toString();
      case 'ratio': return value.toFixed(2);
      default: return value.toString();
    }
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  const enabledTemplates = templates.filter(t => t.enabled).length;
  const recentReports = generatedReports.filter(r => 
    new Date(r.generatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const failedReports = generatedReports.filter(r => r.status === 'failed').length;
  const nextScheduled = scheduledReports
    .filter(s => s.enabled)
    .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold">Reporting & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Automated report generation and performance analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Auto Reporting</span>
            <Switch checked={autoReporting} onCheckedChange={setAutoReporting} />
          </div>
          <Button disabled={isGenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate All
          </Button>
        </div>
      </div>

      <Tabs value="analytics" onValueChange={() => {}} className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Templates</p>
                    <p className="text-2xl font-bold">{enabledTemplates}/{templates.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reports This Week</p>
                    <p className="text-2xl font-bold">{recentReports}</p>
                  </div>
                  <FileBarChart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Reports</p>
                    <p className="text-2xl font-bold text-red-500">{failedReports}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Scheduled</p>
                    <p className="text-sm font-bold">
                      {nextScheduled ? new Date(nextScheduled.nextRun).toLocaleDateString() : 'None'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Category:</span>
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="risk">Risk</option>
              <option value="trading">Trading</option>
              <option value="portfolio">Portfolio</option>
            </select>
          </div>

          {/* Analytics Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMetrics.map(metric => (
              <Card key={metric.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{metric.category}</Badge>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{metric.name}</h3>
                  <p className="text-2xl font-bold mb-2">{formatValue(metric.value, metric.unit)}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`font-medium ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{formatValue(metric.change, metric.unit)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ({metric.changePercent >= 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {metric.description}
                  </p>
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
                      <Badge variant="outline">{template.type.toUpperCase()}</Badge>
                      <Switch 
                        checked={template.enabled} 
                        onCheckedChange={() => toggleTemplate(template.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frequency</Label>
                      <p className="font-medium">{template.frequency.toUpperCase()}</p>
                    </div>
                    <div>
                      <Label>Format</Label>
                      <p className="font-medium">{template.format.toUpperCase()}</p>
                    </div>
                    <div>
                      <Label>Generated</Label>
                      <p className="font-bold text-lg">{template.generatedCount} times</p>
                    </div>
                    <div>
                      <Label>Recipients</Label>
                      <p className="font-medium">{template.recipients.length} users</p>
                    </div>
                  </div>
                  
                  {template.lastGenerated && (
                    <div>
                      <Label>Last Generated</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(template.lastGenerated).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  {template.nextScheduled && (
                    <div>
                      <Label>Next Scheduled</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(template.nextScheduled).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => generateReport(template.id)}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Recently generated reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(report.status)}
                      <div>
                        <h3 className="font-bold">{report.templateName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {report.format.toUpperCase()} • {new Date(report.generatedAt).toLocaleString()}
                        </p>
                        {report.error && (
                          <p className="text-sm text-red-500">Error: {report.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.toUpperCase()}
                        </Badge>
                        {report.fileSize && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {report.fileSize}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {report.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map(schedule => (
                  <div key={schedule.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{schedule.templateName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.frequency.toUpperCase()} • {schedule.recipients.length} recipients
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                          {schedule.enabled ? 'ACTIVE' : 'DISABLED'}
                        </Badge>
                        <Switch checked={schedule.enabled} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Next Run</Label>
                        <p className="font-medium">
                          {new Date(schedule.nextRun).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label>Last Run</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.lastRun ? new Date(schedule.lastRun).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      <div>
                        <Label>Run Count</Label>
                        <p className="font-bold text-lg">{schedule.runCount}</p>
                      </div>
                      <div>
                        <Label>Recipients</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.recipients.join(', ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Run Now
                      </Button>
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