'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
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
  Headphones
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [isAnnual, setIsAnnual] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const pricingTiers: PricingTier[] = [
    {
      id: 'free-trial',
      name: 'Free Trial',
      description: 'Perfect for getting started with copy trading',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        '7-day free trial',
        'Copy up to 3 creators',
        'Basic market insights',
        'Standard execution speed',
        'Community access',
        'Mobile app access',
        'Email support',
        'Basic portfolio analytics'
      ],
      trialDays: 7,
      buttonText: 'Start Free Trial',
      buttonVariant: 'outline',
      icon: <Users className="w-6 h-6" />,
      color: 'border-blue-200 bg-blue-50',
      benefits: [
        {
          title: 'Risk-Free Start',
          description: 'Try copy trading with no commitment',
          icon: <Shield className="w-5 h-5 text-blue-600" />
        },
        {
          title: 'Learn the Basics',
          description: 'Understand copy trading fundamentals',
          icon: <Brain className="w-5 h-5 text-blue-600" />
        }
      ]
    },
    {
      id: 'pro-monthly',
      name: 'Pro Trader',
      description: 'Advanced features for serious copy traders',
      price: {
        monthly: 9.99,
        annual: 9.99
      },
      features: [
        'Copy unlimited creators',
        'AI-powered market analysis',
        'Real-time notifications',
        'Advanced portfolio analytics',
        'Risk management tools',
        'Priority customer support',
        'Custom trading strategies',
        'Performance tracking',
        'Mobile & desktop apps',
        'Advanced charting tools',
        'Market insights dashboard',
        'Copy trade automation'
      ],
      popular: true,
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'border-purple-200 bg-purple-50',
      benefits: [
        {
          title: 'Unlimited Copy Trading',
          description: 'Follow and copy unlimited successful traders',
          icon: <Crown className="w-5 h-5 text-purple-600" />
        },
        {
          title: 'AI-Powered Insights',
          description: 'Get intelligent market analysis and recommendations',
          icon: <Brain className="w-5 h-5 text-purple-600" />
        },
        {
          title: 'Priority Support',
          description: '24/7 priority customer support',
          icon: <Headphones className="w-5 h-5 text-purple-600" />
        }
      ]
    },
    {
      id: 'pro-annual',
      name: 'Pro Annual',
      description: 'Best value with 25% savings on annual billing',
      price: {
        monthly: 7.49,
        annual: 89.99
      },
      originalPrice: {
        monthly: 9.99,
        annual: 119.88
      },
      features: [
        'Everything in Pro Monthly',
        'Save 25% with annual billing',
        'Exclusive creator access',
        'Early access to new features',
        'Quarterly strategy reviews',
        'Advanced AI predictions',
        'Custom API access',
        'White-glove onboarding',
        'Dedicated account manager',
        'Tax optimization reports',
        'Institutional-grade execution',
        'VIP community access'
      ],
      highlighted: true,
      buttonText: 'Choose Annual',
      buttonVariant: 'default',
      icon: <Award className="w-6 h-6" />,
      color: 'border-green-200 bg-green-50',
      benefits: [
        {
          title: 'Maximum Savings',
          description: 'Save $29.89 per year with annual billing',
          icon: <DollarSign className="w-5 h-5 text-green-600" />
        },
        {
          title: 'Exclusive Access',
          description: 'Get access to top-performing creators first',
          icon: <Sparkles className="w-5 h-5 text-green-600" />
        },
        {
          title: 'Dedicated Support',
          description: 'Personal account manager and priority assistance',
          icon: <Users className="w-5 h-5 text-green-600" />
        }
      ]
    }
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    // In a real app, this would redirect to payment processing
    console.log(`Selected plan: ${planId}`)
  }

  const getDisplayPrice = (tier: PricingTier) => {
    if (tier.id === 'free-trial') {
      return { price: 'Free', period: '7 days' }
    }
    
    if (tier.id === 'pro-annual') {
      return isAnnual 
        ? { price: `$${tier.price.annual}`, period: 'per year' }
        : { price: `$${tier.price.monthly}`, period: 'per month' }
    }
    
    return { price: `$${tier.price.monthly}`, period: 'per month' }
  }

  const getSavings = (tier: PricingTier) => {
    if (tier.originalPrice && isAnnual) {
      const savings = tier.originalPrice.annual - tier.price.annual
      return `Save $${savings.toFixed(2)}`
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join over 1 million Americans who&apos;ve discovered the power of copy trading. 
          Start with a free trial and upgrade when you&apos;re ready.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Label className={cn('text-sm font-medium', !isAnnual && 'text-purple-600')}>Monthly</Label>
          <Switch 
            checked={isAnnual} 
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-purple-600"
          />
          <Label className={cn('text-sm font-medium', isAnnual && 'text-purple-600')}>Annual</Label>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save 25%
          </Badge>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingTiers.map((tier) => {
          const displayPrice = getDisplayPrice(tier)
          const savings = getSavings(tier)
          
          return (
            <Card 
              key={tier.id} 
              className={cn(
                'relative transition-all duration-300 hover:shadow-xl cursor-pointer',
                tier.color,
                tier.highlighted && 'ring-2 ring-purple-500 scale-105',
                selectedPlan === tier.id && 'ring-2 ring-blue-500'
              )}
              onClick={() => handlePlanSelect(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600 text-white px-4 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className={cn(
                    'p-3 rounded-full',
                    tier.id === 'free-trial' && 'bg-blue-100',
                    tier.id === 'pro-monthly' && 'bg-purple-100',
                    tier.id === 'pro-annual' && 'bg-green-100'
                  )}>
                    {tier.icon}
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{displayPrice.price}</span>
                    <span className="text-gray-500 ml-2">{displayPrice.period}</span>
                  </div>
                  
                  {tier.originalPrice && isAnnual && (
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-gray-400 line-through text-sm mr-2">
                        ${tier.originalPrice.annual}
                      </span>
                      {savings && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {savings}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {tier.trialDays && (
                    <p className="text-sm text-blue-600 mt-2 font-medium">
                      {tier.trialDays}-day free trial included
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm text-gray-800 mb-3">Key Benefits:</h4>
                  {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      {benefit.icon}
                      <div>
                        <p className="font-medium text-sm text-gray-800">{benefit.title}</p>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={cn(
                    'w-full mt-6 transition-all duration-300',
                    tier.buttonVariant === 'default' && 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
                    selectedPlan === tier.id && 'ring-2 ring-offset-2 ring-blue-500'
                  )}
                  variant={tier.buttonVariant}
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlanSelect(tier.id)
                  }}
                >
                  {tier.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Trusted by Over 1 Million Users</h3>
          <p className="text-gray-600">Join the largest copy trading community in America</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold mb-2">SEC Regulated</h4>
            <p className="text-sm text-gray-600">FINRA member, just like Fidelity or Schwab</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">SIPC Insured</h4>
            <p className="text-sm text-gray-600">Up to $500,000 protection on your accounts</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">200+ Creators</h4>
            <p className="text-sm text-gray-600">Diverse investment strategies to choose from</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold mb-2">Proven Results</h4>
            <p className="text-sm text-gray-600">Real performance data, not simulations</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is copy trading?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Copy trading lets you automatically mirror the actions of successful investors in real-time. 
                When you copy a portfolio, your investments stay aligned with their strategy automatically.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do we differ from other apps?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Unlike traditional investing apps, KAIRO centers around copy-trading with a true peer-to-peer ecosystem, 
                transparent pricing, and performance figures based on actual returns—not simulations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is KAIRO regulated and insured?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes, KAIRO is SEC-registered and FINRA member. Accounts are SIPC insured up to $500,000, 
                protecting your cash and securities in the event of firm failure.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Absolutely! You can cancel your subscription at any time. Your access will continue until 
                the end of your current billing period, and you won&apos;t be charged again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PricingPlans