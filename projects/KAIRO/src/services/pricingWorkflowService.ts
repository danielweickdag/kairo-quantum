'use client'

import { useState, useEffect } from 'react'

interface UsageMetrics {
  copyTradesCount: number
  creatorsFollowed: number
  portfolioValue: number
  monthlyVolume: number
  riskScore: number
  performanceScore: number
}

interface WorkflowTrigger {
  id: string
  name: string
  condition: (metrics: UsageMetrics) => boolean
  action: 'suggest_upgrade' | 'auto_upgrade' | 'send_notification'
  targetPlan: string
  message: string
  priority: 'low' | 'medium' | 'high'
}

interface PricingRecommendation {
  planId: string
  reason: string
  savings: number
  benefits: string[]
  urgency: 'low' | 'medium' | 'high'
  autoUpgrade?: boolean
}

class PricingWorkflowService {
  private triggers: WorkflowTrigger[] = [
    {
      id: 'high-volume-trader',
      name: 'High Volume Trader Detection',
      condition: (metrics) => metrics.monthlyVolume > 50000 && metrics.copyTradesCount > 20,
      action: 'suggest_upgrade',
      targetPlan: 'pro-annual',
      message: 'Your trading volume qualifies you for our Pro Annual plan with 25% savings!',
      priority: 'high'
    },
    {
      id: 'multiple-creators',
      name: 'Multiple Creators Follower',
      condition: (metrics) => metrics.creatorsFollowed >= 3,
      action: 'suggest_upgrade',
      targetPlan: 'pro-monthly',
      message: 'Unlock unlimited creator following with our Pro plan!',
      priority: 'medium'
    },
    {
      id: 'high-performer',
      name: 'High Performance User',
      condition: (metrics) => metrics.performanceScore > 85 && metrics.portfolioValue > 10000,
      action: 'suggest_upgrade',
      targetPlan: 'pro-annual',
      message: 'Your excellent performance deserves our premium features and savings!',
      priority: 'high'
    },
    {
      id: 'risk-management-needed',
      name: 'Risk Management Alert',
      condition: (metrics) => metrics.riskScore > 70,
      action: 'suggest_upgrade',
      targetPlan: 'pro-monthly',
      message: 'Advanced risk management tools can help optimize your portfolio safety.',
      priority: 'medium'
    },
    {
      id: 'trial-ending',
      name: 'Trial Ending Soon',
      condition: (metrics) => metrics.copyTradesCount > 0, // Active user
      action: 'send_notification',
      targetPlan: 'pro-monthly',
      message: 'Your free trial is ending soon. Continue your trading journey with Pro!',
      priority: 'high'
    }
  ]

  private userMetrics: UsageMetrics = {
    copyTradesCount: 0,
    creatorsFollowed: 0,
    portfolioValue: 0,
    monthlyVolume: 0,
    riskScore: 0,
    performanceScore: 0
  }

  // Simulate real-time metrics updates
  updateMetrics(newMetrics: Partial<UsageMetrics>) {
    this.userMetrics = { ...this.userMetrics, ...newMetrics }
    this.evaluateWorkflows()
  }

  // Evaluate all workflow triggers
  private evaluateWorkflows(): PricingRecommendation[] {
    const recommendations: PricingRecommendation[] = []

    this.triggers.forEach(trigger => {
      if (trigger.condition(this.userMetrics)) {
        const recommendation = this.createRecommendation(trigger)
        if (recommendation) {
          recommendations.push(recommendation)
        }
      }
    })

    return recommendations.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    })
  }

  private createRecommendation(trigger: WorkflowTrigger): PricingRecommendation | null {
    const planBenefits = {
      'pro-monthly': [
        'Unlimited creator following',
        'AI-powered market analysis',
        'Advanced risk management',
        'Real-time notifications'
      ],
      'pro-annual': [
        'All Pro features',
        '25% annual savings',
        'Exclusive creator access',
        'Dedicated account manager'
      ]
    }

    const planSavings = {
      'pro-monthly': 0,
      'pro-annual': 29.89
    }

    return {
      planId: trigger.targetPlan,
      reason: trigger.message,
      savings: planSavings[trigger.targetPlan as keyof typeof planSavings] || 0,
      benefits: planBenefits[trigger.targetPlan as keyof typeof planBenefits] || [],
      urgency: trigger.priority,
      autoUpgrade: trigger.action === 'auto_upgrade'
    }
  }

  // Get current recommendations
  getRecommendations(): PricingRecommendation[] {
    return this.evaluateWorkflows()
  }

  // Simulate user behavior for demo
  simulateUserActivity() {
    // Simulate increasing usage over time
    setInterval(() => {
      this.updateMetrics({
        copyTradesCount: this.userMetrics.copyTradesCount + Math.floor(Math.random() * 3),
        creatorsFollowed: Math.min(this.userMetrics.creatorsFollowed + (Math.random() > 0.8 ? 1 : 0), 5),
        portfolioValue: this.userMetrics.portfolioValue + Math.random() * 1000,
        monthlyVolume: this.userMetrics.monthlyVolume + Math.random() * 5000,
        riskScore: Math.max(0, Math.min(100, this.userMetrics.riskScore + (Math.random() - 0.5) * 10)),
        performanceScore: Math.max(0, Math.min(100, this.userMetrics.performanceScore + (Math.random() - 0.3) * 5))
      })
    }, 5000) // Update every 5 seconds for demo
  }

  // Get current user metrics
  getMetrics(): UsageMetrics {
    return { ...this.userMetrics }
  }

  // Initialize with sample data
  initializeSampleData() {
    this.updateMetrics({
      copyTradesCount: 5,
      creatorsFollowed: 2,
      portfolioValue: 8500,
      monthlyVolume: 25000,
      riskScore: 45,
      performanceScore: 78
    })
  }
}

export const pricingWorkflowService = new PricingWorkflowService()
export type { UsageMetrics, PricingRecommendation, WorkflowTrigger }

// React hook for using the pricing workflow service
export function usePricingWorkflow() {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([])
  const [metrics, setMetrics] = useState<UsageMetrics>(pricingWorkflowService.getMetrics())

  useEffect(() => {
    // Initialize sample data
    pricingWorkflowService.initializeSampleData()
    
    // Start simulation for demo
    pricingWorkflowService.simulateUserActivity()

    // Update recommendations periodically
    const interval = setInterval(() => {
      setRecommendations(pricingWorkflowService.getRecommendations())
      setMetrics(pricingWorkflowService.getMetrics())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return {
    recommendations,
    metrics,
    updateMetrics: (newMetrics: Partial<UsageMetrics>) => {
      pricingWorkflowService.updateMetrics(newMetrics)
      setRecommendations(pricingWorkflowService.getRecommendations())
      setMetrics(pricingWorkflowService.getMetrics())
    }
  }
}