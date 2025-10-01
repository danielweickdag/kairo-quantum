'use client'

import { useState, useEffect } from 'react'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  estimatedTime: string
  category: 'setup' | 'verification' | 'trading' | 'learning'
}

export interface OnboardingProgress {
  currentStep: number
  totalSteps: number
  completedSteps: number
  progressPercentage: number
  estimatedTimeRemaining: string
}

export interface UserOnboardingData {
  planId: string
  email: string
  firstName: string
  lastName: string
  tradingExperience: 'beginner' | 'intermediate' | 'advanced'
  riskTolerance: 'low' | 'medium' | 'high'
  investmentGoals: string[]
  preferredCreators: string[]
}

class OnboardingWorkflowService {
  private static instance: OnboardingWorkflowService
  private onboardingSteps: OnboardingStep[] = []
  private userProgress: OnboardingProgress = {
    currentStep: 0,
    totalSteps: 0,
    completedSteps: 0,
    progressPercentage: 0,
    estimatedTimeRemaining: '0 min'
  }

  static getInstance(): OnboardingWorkflowService {
    if (!OnboardingWorkflowService.instance) {
      OnboardingWorkflowService.instance = new OnboardingWorkflowService()
    }
    return OnboardingWorkflowService.instance
  }

  initializeOnboarding(planId: string): OnboardingStep[] {
    this.onboardingSteps = this.generateStepsForPlan(planId)
    this.updateProgress()
    return this.onboardingSteps
  }

  private generateStepsForPlan(planId: string): OnboardingStep[] {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to KAIRO',
        description: 'Get familiar with the platform and your dashboard',
        completed: false,
        required: true,
        estimatedTime: '2 min',
        category: 'setup'
      },
      {
        id: 'profile-setup',
        title: 'Complete Your Profile',
        description: 'Add your trading experience and investment preferences',
        completed: false,
        required: true,
        estimatedTime: '3 min',
        category: 'setup'
      },
      {
        id: 'identity-verification',
        title: 'Verify Your Identity',
        description: 'Upload required documents for account verification',
        completed: false,
        required: true,
        estimatedTime: '5 min',
        category: 'verification'
      },
      {
        id: 'fund-account',
        title: 'Fund Your Account',
        description: 'Add funds to start copy trading',
        completed: false,
        required: true,
        estimatedTime: '3 min',
        category: 'setup'
      },
      {
        id: 'explore-creators',
        title: 'Discover Top Creators',
        description: 'Browse and learn about successful traders',
        completed: false,
        required: false,
        estimatedTime: '10 min',
        category: 'learning'
      },
      {
        id: 'first-copy-trade',
        title: 'Make Your First Copy Trade',
        description: 'Follow a creator and start copying their trades',
        completed: false,
        required: false,
        estimatedTime: '5 min',
        category: 'trading'
      }
    ]

    // Add alert setup step for all paid plans
    if (planId !== 'free-trial') {
      baseSteps.splice(4, 0, {
        id: 'setup-alerts',
        title: 'Configure Smart Alerts',
        description: 'Set up personalized trading alerts and notifications',
        completed: false,
        required: false,
        estimatedTime: '4 min',
        category: 'setup'
      })
    }

    // Add plan-specific steps
    if (planId === 'pro-monthly' || planId === 'pro-annual') {
      baseSteps.push(
        {
          id: 'advanced-analytics',
          title: 'Explore Advanced Analytics',
          description: 'Learn about risk management and performance tracking',
          completed: false,
          required: false,
          estimatedTime: '8 min',
          category: 'learning'
        },
        {
          id: 'custom-strategies',
          title: 'Set Up Custom Strategies',
          description: 'Create personalized trading rules and filters',
          completed: false,
          required: false,
          estimatedTime: '12 min',
          category: 'trading'
        }
      )
    }

    if (planId === 'enterprise') {
      baseSteps.push(
        {
          id: 'team-setup',
          title: 'Configure Team Access',
          description: 'Set up team members and permissions',
          completed: false,
          required: true,
          estimatedTime: '15 min',
          category: 'setup'
        },
        {
          id: 'api-integration',
          title: 'API Integration Setup',
          description: 'Configure custom integrations and API access',
          completed: false,
          required: false,
          estimatedTime: '20 min',
          category: 'setup'
        }
      )
    }

    return baseSteps
  }

  completeStep(stepId: string): void {
    const step = this.onboardingSteps.find(s => s.id === stepId)
    if (step) {
      step.completed = true
      this.updateProgress()
      this.triggerNextStepRecommendation()
    }
  }

  skipStep(stepId: string): void {
    const step = this.onboardingSteps.find(s => s.id === stepId)
    if (step && !step.required) {
      step.completed = true
      this.updateProgress()
    }
  }

  private updateProgress(): void {
    const completedSteps = this.onboardingSteps.filter(s => s.completed).length
    const totalSteps = this.onboardingSteps.length
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    
    const remainingSteps = this.onboardingSteps.filter(s => !s.completed)
    const estimatedMinutes = remainingSteps.reduce((total, step) => {
      const minutes = parseInt(step.estimatedTime.split(' ')[0])
      return total + minutes
    }, 0)
    
    this.userProgress = {
      currentStep: completedSteps,
      totalSteps,
      completedSteps,
      progressPercentage,
      estimatedTimeRemaining: `${estimatedMinutes} min`
    }
  }

  private triggerNextStepRecommendation(): void {
    const nextStep = this.onboardingSteps.find(s => !s.completed)
    if (nextStep) {
      // In a real app, this would trigger notifications or UI updates
      console.log(`Next recommended step: ${nextStep.title}`)
    }
  }

  getProgress(): OnboardingProgress {
    return this.userProgress
  }

  getSteps(): OnboardingStep[] {
    return this.onboardingSteps
  }

  getNextStep(): OnboardingStep | null {
    return this.onboardingSteps.find(s => !s.completed) || null
  }

  getStepsByCategory(category: OnboardingStep['category']): OnboardingStep[] {
    return this.onboardingSteps.filter(s => s.category === category)
  }

  isOnboardingComplete(): boolean {
    const requiredSteps = this.onboardingSteps.filter(s => s.required)
    return requiredSteps.every(s => s.completed)
  }

  generatePersonalizedRecommendations(userData: Partial<UserOnboardingData>): string[] {
    const recommendations: string[] = []

    if (userData.tradingExperience === 'beginner') {
      recommendations.push(
        'Start with conservative creators with consistent returns',
        'Begin with small amounts to learn the platform',
        'Complete the trading education modules'
      )
    }

    if (userData.riskTolerance === 'low') {
      recommendations.push(
        'Focus on creators with low volatility strategies',
        'Set up stop-loss limits for risk management'
      )
    }

    if (userData.investmentGoals?.includes('retirement')) {
      recommendations.push(
        'Consider long-term growth creators',
        'Set up automatic monthly investments'
      )
    }

    return recommendations
  }
}

export const useOnboardingWorkflow = (planId?: string) => {
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    totalSteps: 0,
    completedSteps: 0,
    progressPercentage: 0,
    estimatedTimeRemaining: '0 min'
  })
  const [isLoading, setIsLoading] = useState(true)

  const service = OnboardingWorkflowService.getInstance()

  useEffect(() => {
    if (planId) {
      const initialSteps = service.initializeOnboarding(planId)
      setSteps(initialSteps)
      setProgress(service.getProgress())
      setIsLoading(false)
    }
  }, [planId])

  const completeStep = (stepId: string) => {
    service.completeStep(stepId)
    setSteps([...service.getSteps()])
    setProgress(service.getProgress())
  }

  const skipStep = (stepId: string) => {
    service.skipStep(stepId)
    setSteps([...service.getSteps()])
    setProgress(service.getProgress())
  }

  const getNextStep = () => {
    return service.getNextStep()
  }

  const getStepsByCategory = (category: OnboardingStep['category']) => {
    return service.getStepsByCategory(category)
  }

  const isComplete = () => {
    return service.isOnboardingComplete()
  }

  const generateRecommendations = (userData: Partial<UserOnboardingData>) => {
    return service.generatePersonalizedRecommendations(userData)
  }

  return {
    steps,
    progress,
    isLoading,
    completeStep,
    skipStep,
    getNextStep,
    getStepsByCategory,
    isComplete,
    generateRecommendations
  }
}

export default OnboardingWorkflowService