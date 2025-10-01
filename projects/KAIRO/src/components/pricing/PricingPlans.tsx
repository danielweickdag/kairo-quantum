'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  Check,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  Brain,
  Bell,
  Lock,
  Smartphone,
  Globe,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Activity,
  Eye,
  MessageSquare,
  Settings,
  Download,
  Headphones,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  ChevronRight,
  BookOpen,
  UserCheck,
  CreditCard,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePricingWorkflow, type PricingRecommendation } from '@/services/pricingWorkflowService'
import { useOnboardingWorkflow, type OnboardingStep } from '@/services/onboardingWorkflowService'
import OnboardingQuestionnaire from '@/components/onboarding/OnboardingQuestionnaire'
import { alertService } from '@/services/alertService'

interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    annual: number
  }
  originalPrice?: {
    monthly: number
    annual: number
  }
  features: string[]
  highlighted?: boolean
  popular?: boolean
  trialDays?: number
  buttonText: string
  buttonVariant: 'default' | 'outline' | 'secondary'
  icon: React.ReactNode
  color: string
  benefits: {
    title: string
    description: string
    icon: React.ReactNode
  }[]
}

const PricingPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const { recommendations, metrics } = usePricingWorkflow()
  const [dismissedRecommendations, setDismissedRecommendations] = useState<string[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { steps: onboardingSteps, progress: onboardingProgress, completeStep } = useOnboardingWorkflow(selectedPlan || undefined)
  
  const handleOnboardingComplete = (formData: any) => {
    console.log('Onboarding completed with data:', formData)
    // Here you would typically save the data to your backend
    // and redirect the user to their dashboard
    setShowOnboarding(false)
    // You could also trigger a success notification here
  }

  const pricingTiers: PricingTier[] = [
    {
      id: 'free-trial',
      name: 'Free Trial',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      features: [
        'Basic Copy Trading',
        'Up to 3 Creators',
        'Basic Analytics',
        'Email Support',
        'Mobile App Access'
      ],
      trialDays: 14,
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline',
      icon: <Star className="w-6 h-6" />,
      color: 'blue',
      benefits: [
        {
          title: 'Risk-Free Start',
          description: 'Try all features without commitment',
          icon: <Shield className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'pro-monthly',
      name: 'Pro',
      description: 'Most popular for active traders',
      price: { monthly: 49, annual: 490 },
      originalPrice: { monthly: 59, annual: 590 },
      features: [
        'Unlimited Copy Trading',
        'Follow 50+ Creators',
        'Advanced Analytics',
        'Priority Support',
        'API Access',
        'Custom Strategies',
        'Risk Management Tools'
      ],
      highlighted: false,
      popular: true,
      buttonText: 'Get Pro',
      buttonVariant: 'default',
      icon: <Crown className="w-6 h-6" />,
      color: 'purple',
      benefits: [
        {
          title: 'Advanced Trading',
          description: 'Professional-grade tools and analytics',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'pro-annual',
      name: 'Pro Annual',
      description: 'Best value for committed traders',
      price: { monthly: 49, annual: 490 },
      originalPrice: { monthly: 59, annual: 590 },
      features: [
        'Unlimited Copy Trading',
        'Follow 50+ Creators',
        'Advanced Analytics',
        'Priority Support',
        'API Access',
        'Custom Strategies',
        'Risk Management Tools',
        '25% Annual Savings'
      ],
      highlighted: true,
      buttonText: 'Get Pro Annual',
      buttonVariant: 'default',
      icon: <Crown className="w-6 h-6" />,
      color: 'purple',
      benefits: [
        {
          title: 'Maximum Savings',
          description: 'Best value with annual commitment',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For institutions and large teams',
      price: { monthly: 199, annual: 1990 },
      originalPrice: { monthly: 249, annual: 2490 },
      features: [
        'Everything in Pro',
        'White-label Solution',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Advanced Security',
        'Team Management',
        'Custom Reporting'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'secondary',
      icon: <Award className="w-6 h-6" />,
      color: 'orange',
      benefits: [
        {
          title: 'Enterprise Scale',
          description: 'Built for large organizations',
          icon: <Users className="w-5 h-5" />
        }
      ]
    }
  ]

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId)
    setShowOnboarding(true)
    console.log('Selected plan:', planId)
    
    // Automatically enable alerts for users who select a plan
    try {
      await alertService.enableAlerts();
      console.log('Alerts automatically enabled for plan selection:', planId);
    } catch (error) {
      console.warn('Failed to auto-enable alerts for plan selection:', error);
    }
    
    // In a real app, this would redirect to payment processing
    // For demo purposes, we'll show the onboarding workflow
  }

  const getDisplayPrice = (tier: PricingTier) => {
    const price = isAnnual ? tier.price.annual : tier.price.monthly
    const period = isAnnual ? '/year' : '/month'
    
    if (tier.id === 'free-trial') {
      return { price: 'Free', period: '14 days' }
    }
    
    return {
      price: `$${price}`,
      period
    }
  }

  const getSavings = (tier: PricingTier) => {
    if (tier.originalPrice && isAnnual) {
      const savings = tier.originalPrice.annual - tier.price.annual
      return `Save $${savings.toFixed(2)}`
    }
    return null
  }

  const getAnnualSavingsPercentage = (tier: PricingTier) => {
    if (tier.originalPrice && isAnnual) {
      const monthlyTotal = tier.originalPrice.monthly * 12
      const annualPrice = tier.price.annual
      const savingsPercentage = ((monthlyTotal - annualPrice) / monthlyTotal) * 100
      return Math.round(savingsPercentage)
    }
    return 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getRealTimeSavings = () => {
    if (!isAnnual) return 0
    return pricingTiers.reduce((total, tier) => {
      if (tier.originalPrice) {
        const monthlyTotal = tier.originalPrice.monthly * 12
        const savings = monthlyTotal - tier.price.annual
        return total + savings
      }
      return total
    }, 0)
  }

  const dismissRecommendation = (planId: string) => {
    setDismissedRecommendations(prev => [...prev, planId])
  }

  const getRecommendationIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'medium': return <Lightbulb className="w-5 h-5 text-yellow-500" />
      default: return <CheckCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const activeRecommendations = recommendations.filter(
    rec => !dismissedRecommendations.includes(rec.planId)
  )

  const togglePlanComparison = (planId: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      } else if (prev.length < 3) {
        return [...prev, planId]
      }
      return prev
    })
  }

  const getFeatureTooltip = (feature: string) => {
    const tooltips: Record<string, string> = {
      'Copy Trading': 'Automatically replicate trades from successful traders in real-time',
      'Advanced Analytics': 'Comprehensive performance metrics, risk analysis, and portfolio insights',
      'Priority Support': '24/7 dedicated support with faster response times',
      'Custom Strategies': 'Create and backtest your own trading algorithms',
      'API Access': 'Full REST and WebSocket API access for custom integrations',
      'White-label Solution': 'Fully customizable platform with your branding',
      'Dedicated Account Manager': 'Personal relationship manager for enterprise clients',
      'Custom Integrations': 'Tailored integrations with your existing systems'
    }
    return tooltips[feature] || 'Learn more about this feature'
  }

  const clearComparison = () => {
    setSelectedPlans([])
    setComparisonMode(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 10,000+ traders worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight px-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trading Plan
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Unlock the power of copy trading with our flexible pricing plans designed for every trader.
            <span className="block mt-2 text-base sm:text-lg text-gray-500">
              Start your journey to financial freedom today.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              14-day free trial
            </div>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>

      {/* Enhanced Toggle */}
      <div className="flex justify-center mb-12 lg:mb-16 px-4">
        <div className="flex items-center space-x-3 lg:space-x-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-2 lg:p-3 shadow-lg border border-gray-200 w-full max-w-md">
          <Label htmlFor="billing-toggle" className={cn(
            "px-3 lg:px-6 py-2 lg:py-3 rounded-xl transition-all duration-500 cursor-pointer font-semibold text-base lg:text-lg flex-1 text-center",
            "hover:scale-105 transform",
            !isAnnual && "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white",
            isAnnual && "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          )}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600 scale-110 lg:scale-125 flex-shrink-0"
          />
          <div className="flex-1">
            <Label htmlFor="billing-toggle" className={cn(
              "px-3 lg:px-6 py-2 lg:py-3 rounded-xl transition-all duration-500 cursor-pointer flex flex-col items-center font-semibold text-base lg:text-lg w-full",
              "hover:scale-105 transform",
              isAnnual && "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white",
              !isAnnual && "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            )}>
              <span>Annual</span>
              <Badge className="mt-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs lg:text-sm font-bold animate-bounce px-2 lg:px-3 py-1 shadow-md">
                Save 20%
              </Badge>
            </Label>
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Savings Calculator */}
      {isAnnual && getRealTimeSavings() > 0 && (
        <div className="mb-8 lg:mb-12 px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-0 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-green-400/10 to-teal-400/10"></div>
            <CardContent className="p-6 lg:p-8 text-center relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 lg:mb-6">
                <div className="p-2 lg:p-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg mb-3 sm:mb-0">
                  <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-800 sm:ml-4 text-center sm:text-left">Annual Savings Calculator</h3>
              </div>
              <div className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3 lg:mb-4">
                {formatPrice(getRealTimeSavings())}
              </div>
              <p className="text-gray-700 text-base lg:text-lg font-medium mb-4 lg:mb-6 px-2">
                Total savings when choosing annual billing across all plans
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-sm">
                <div className="flex items-center bg-white/60 px-3 lg:px-4 py-2 rounded-full shadow-md justify-center">
                  <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Smart Investment</span>
                </div>
                <div className="flex items-center bg-white/60 px-3 lg:px-4 py-2 rounded-full shadow-md justify-center">
                  <Shield className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-emerald-600" />
                  <span className="font-semibold text-gray-700">Price Lock Guarantee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Workflow Recommendations */}
      {activeRecommendations.length > 0 && (
        <div className="mb-8 lg:mb-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-3 lg:mb-4">
                <div className="p-2 lg:p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg mb-3 sm:mb-0">
                  <Brain className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent sm:ml-4 text-center sm:text-left">
                  Smart Recommendations
                </h3>
              </div>
              <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                AI-powered suggestions based on your trading activity and goals
              </p>
            </div>
            <div className="grid gap-4 lg:gap-6">
              {activeRecommendations.slice(0, 2).map((rec, index) => (
                <Card key={`${rec.planId}-${index}`} className={cn(
                  "border-0 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden",
                  rec.urgency === 'high' && "bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 shadow-red-100",
                  rec.urgency === 'medium' && "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 shadow-yellow-100",
                  rec.urgency === 'low' && "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-blue-100"
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{
                    background: rec.urgency === 'high' ? 'linear-gradient(135deg, #ef4444, #f97316)' :
                               rec.urgency === 'medium' ? 'linear-gradient(135deg, #eab308, #f59e0b)' :
                               'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  }}></div>
                  <CardContent className="p-6 lg:p-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                      <div className="flex items-start space-x-3 lg:space-x-4 flex-1">
                        <div className="p-2 lg:p-3 rounded-full bg-white shadow-lg">
                          {getRecommendationIcon(rec.urgency)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                            Recommended: {rec.planId === 'pro-annual' ? 'Pro Annual' : 'Pro Monthly'}
                          </h4>
                          <p className="text-sm lg:text-base text-gray-600 mb-3 leading-relaxed">{rec.reason}</p>
                          {rec.savings > 0 && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-3 px-3 py-1 text-sm font-bold shadow-md">
                              💰 Save ${rec.savings} annually
                            </Badge>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {rec.benefits.slice(0, 3).map((benefit, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs lg:text-sm bg-white/80 border-gray-300 hover:bg-white transition-colors">
                                ✨ {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-2 font-semibold"
                          onClick={() => handlePlanSelect(rec.planId)}
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Upgrade Now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissRecommendation(rec.planId)}
                          className="hover:bg-white/60 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Usage Metrics Display */}
      <div className="mb-8 lg:mb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-0 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-cyan-400/5"></div>
            <CardContent className="p-6 lg:p-8 relative z-10">
              <h3 className="text-xl lg:text-2xl font-black text-center mb-6 lg:mb-8 flex flex-col sm:flex-row items-center justify-center text-gray-800">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-2 sm:mb-0 sm:mr-3">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                Your Trading Activity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center bg-white/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">{metrics.copyTradesCount}</div>
                  <div className="text-sm font-semibold text-gray-700">Copy Trades</div>
                </div>
                <div className="text-center bg-white/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{metrics.creatorsFollowed}</div>
                  <div className="text-sm font-semibold text-gray-700">Creators Followed</div>
                </div>
                <div className="text-center bg-white/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">${metrics.portfolioValue.toLocaleString()}</div>
                  <div className="text-sm font-semibold text-gray-700">Portfolio Value</div>
                </div>
                <div className="text-center bg-white/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">{metrics.performanceScore.toFixed(0)}%</div>
                  <div className="text-sm font-semibold text-gray-700">Performance Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Plan Comparison Toggle */}
      <div className="flex justify-center mb-8">
        <Button
          variant={comparisonMode ? "default" : "outline"}
          onClick={() => setComparisonMode(!comparisonMode)}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>{comparisonMode ? 'Exit Comparison' : 'Compare Plans'}</span>
          {selectedPlans.length > 0 && (
            <Badge className="ml-2 bg-blue-100 text-blue-800">
              {selectedPlans.length}
            </Badge>
          )}
        </Button>
        {selectedPlans.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearComparison}
            className="ml-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Comparison Table */}
      {comparisonMode && selectedPlans.length > 0 && (
        <div className="mb-8">
          <Card className="max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Plan Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Features</th>
                      {selectedPlans.map(planId => {
                        const plan = pricingTiers.find(t => t.id === planId)
                        return (
                          <th key={planId} className="text-center p-4">
                            <div className="flex flex-col items-center">
                              <div className="text-lg font-bold">{plan?.name}</div>
                              <div className="text-sm text-gray-600">
                                {formatPrice(isAnnual ? plan?.price.annual || 0 : plan?.price.monthly || 0)}
                                <span className="text-xs">/{isAnnual ? 'year' : 'month'}</span>
                              </div>
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(
                      selectedPlans.flatMap(planId => 
                        pricingTiers.find(t => t.id === planId)?.features || []
                      )
                    )).map(feature => (
                      <tr key={feature} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">
                          <div 
                            className="flex items-center cursor-help"
                            onMouseEnter={() => setShowTooltip(feature)}
                            onMouseLeave={() => setShowTooltip(null)}
                          >
                            {feature}
                            <div className="ml-2 relative">
                              <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs">?</div>
                              {showTooltip === feature && (
                                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-black text-white text-xs rounded shadow-lg z-10">
                                  {getFeatureTooltip(feature)}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        {selectedPlans.map(planId => {
                          const plan = pricingTiers.find(t => t.id === planId)
                          const hasFeature = plan?.features.includes(feature)
                          return (
                            <td key={`${planId}-${feature}`} className="p-4 text-center">
                              {hasFeature ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mb-12 lg:mb-20 relative px-4">
        {pricingTiers.map((tier) => {
          const displayPrice = getDisplayPrice(tier)
          const savings = getSavings(tier)
          const isSelected = selectedPlan === tier.id
          const isHovered = hoveredPlan === tier.id
          const isInComparison = selectedPlans.includes(tier.id)

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative transition-all duration-500 cursor-pointer group overflow-hidden",
                "bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl",
                "hover:-translate-y-4 hover:scale-[1.02] transform-gpu",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                tier.highlighted && "ring-2 ring-purple-400 ring-offset-4 shadow-purple-200/50",
                tier.popular && "ring-2 ring-blue-400 ring-offset-4 shadow-blue-200/50",
                isSelected && "ring-2 ring-emerald-400 ring-offset-2 shadow-emerald-200/50",
                isInComparison && "ring-2 ring-orange-400 ring-offset-2 shadow-orange-200/50"
              )}
              onMouseEnter={() => setHoveredPlan(tier.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold animate-pulse">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {tier.highlighted && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-semibold animate-bounce">
                    <Crown className="w-3 h-3 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6 pt-8 relative z-10">
                <div className="flex justify-center mb-6">
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-500 shadow-lg",
                    "group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6",
                    tier.color === 'blue' && "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600",
                    tier.color === 'purple' && "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600",
                    tier.color === 'orange' && "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600"
                  )}>
                    {tier.icon}
                  </div>
                </div>
                <CardTitle className="text-4xl font-black mb-4 text-gray-900 drop-shadow-sm">{tier.name}</CardTitle>
                <p className="text-gray-700 text-lg leading-relaxed px-2 font-medium">{tier.description}</p>
              </CardHeader>

              <CardContent className="text-center px-8 pb-8 relative z-10">
                <div className="mb-8">
                  <div className="flex items-baseline justify-center mb-4">
                    <span className={cn(
                      "text-6xl font-black transition-all duration-500 relative",
                      "group-hover:scale-105 drop-shadow-sm",
                      tier.id === 'free-trial' && "text-blue-700",
                      tier.id === 'pro-monthly' && "text-purple-700",
                      tier.id === 'pro-annual' && "text-purple-700",
                      tier.id === 'enterprise' && "text-orange-700"
                    )}>
                      {displayPrice.price}
                      {tier.originalPrice && isAnnual && (
                        <div className="absolute -top-8 -right-4">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold animate-pulse shadow-lg">
                            -{getAnnualSavingsPercentage(tier)}% OFF
                          </Badge>
                        </div>
                      )}
                    </span>
                    <div className="text-gray-600 ml-3 text-2xl font-bold flex flex-col items-start">
                      <span>{displayPrice.period}</span>
                      {tier.originalPrice && isAnnual && (
                        <div className="mt-1 text-base text-gray-500 line-through font-medium">
                          ${(tier.originalPrice.monthly * 12).toFixed(2)}/year
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {savings && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold animate-pulse shadow-lg px-4 py-2">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {savings}
                    </Badge>
                  )}
                  
                  {tier.trialDays && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 px-4 py-2 font-semibold">
                        <Clock className="w-4 h-4 mr-1" />
                        {tier.trialDays} days free
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-5 mb-10">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-lg group/feature">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-4 mt-1">
                        <Check className="w-4 h-4 text-white font-bold" />
                      </div>
                      <span className="text-gray-800 leading-relaxed font-medium group-hover/feature:text-gray-900 transition-colors duration-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button
                    className={cn(
                      "w-full py-5 text-xl font-bold transition-all duration-500 relative overflow-hidden",
                      "hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02]",
                      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                      tier.buttonVariant === 'default' && "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg",
                      tier.buttonVariant === 'outline' && "border-2 border-gray-400 hover:border-purple-500 hover:bg-purple-50 text-gray-800 hover:text-purple-700 font-bold",
                      tier.highlighted && "ring-2 ring-purple-300 ring-offset-2 shadow-purple-200/50"
                    )}
                    variant={tier.buttonVariant}
                    onClick={() => {
                      setSelectedPlan(tier.id)
                      setShowOnboarding(true)
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {tier.buttonText}
                      <ArrowRight className={cn(
                        "w-5 h-5 ml-2 transition-transform duration-300",
                        "group-hover:translate-x-1"
                      )} />
                    </span>
                  </Button>
                  
                  {comparisonMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePlanComparison(tier.id)}
                      className={cn(
                        "w-full",
                        isInComparison && "bg-green-50 border-green-500 text-green-700"
                      )}
                    >
                      {isInComparison ? 'Remove from Comparison' : 'Add to Comparison'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
       })}
       </div>

       {/* Onboarding Questionnaire Modal */}
        <OnboardingQuestionnaire
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          selectedPlan={selectedPlan || undefined}
          onComplete={handleOnboardingComplete}
        />
       </div>
     </div>
   )
 }

 export default PricingPlans