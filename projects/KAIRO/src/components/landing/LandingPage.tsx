'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Shield,
  Users,
  Brain,
  Zap,
  Globe,
  Award,
  BarChart3,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Eye,
  Lock,
  Smartphone,
  Activity,
  DollarSign,
  Clock,
  Crown,
  Rocket,
  LineChart,
  PieChart,
  TrendingDown,
  Bell,
  Settings,
  Download,
  MousePointer,
  Layers,
  Cpu,
  Database,
  Network,
  Wifi
} from 'lucide-react'
import { cn } from '@/lib/utils'
import InteractiveDemo from './InteractiveDemo'

interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

interface StatCard {
  value: string
  label: string
  icon: React.ReactNode
  color: string
}

interface TestimonialCard {
  name: string
  role: string
  content: string
  avatar: string
  rating: number
  profit: string
}

const LandingPage: React.FC = () => {
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    trades: 0,
    profit: 0,
    success: 0
  })

  const handleStartFreeTrial = () => {
    router.push('/register')
  }

  const handleWatchDemo = () => {
    setShowDemoModal(true)
  }

  const handleViewPricing = () => {
    router.push('/pricing')
  }

  const features: FeatureCard[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze market patterns and provide intelligent trading insights in real-time.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Risk Management",
      description: "Comprehensive portfolio VaR calculation, correlation monitoring, volatility tracking, and advanced risk metrics to protect your investments.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Copy Trading Network",
      description: "Follow and copy successful traders automatically. Mirror their strategies and benefit from their expertise.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Portfolio Analytics",
      description: "Deep portfolio insights with Sharpe ratio analysis, drawdown monitoring, and performance attribution across all asset classes.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Execution",
      description: "Execute trades in milliseconds with our high-frequency trading infrastructure and real-time market data.",
      gradient: "from-yellow-500 to-orange-500"
    },

    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive portfolio analytics, risk management tools, and performance tracking with detailed insights.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Markets",
      description: "Access to global markets including stocks, crypto, forex, and commodities from a single platform.",
      gradient: "from-teal-500 to-blue-500"
    }
  ]

  const stats: StatCard[] = [
    {
      value: "1M+",
      label: "Active Users",
      icon: <Users className="w-6 h-6" />,
      color: "text-blue-400"
    },
    {
      value: "$2.5B+",
      label: "Assets Under Management",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-green-400"
    },
    {
      value: "200+",
      label: "Expert Traders",
      icon: <Award className="w-6 h-6" />,
      color: "text-purple-400"
    },
    {
      value: "99.9%",
      label: "Uptime",
      icon: <Activity className="w-6 h-6" />,
      color: "text-orange-400"
    }
  ]

  const testimonials: TestimonialCard[] = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      content: "KAIRO&apos;s AI insights have transformed my trading strategy. I&apos;ve seen a 45% improvement in my portfolio performance since joining.",
      avatar: "SC",
      rating: 5,
      profit: "+$125,000"
    },
    {
      name: "Marcus Rodriguez",
      role: "Day Trader",
      content: "The copy trading feature is incredible. I can follow top performers and learn from their strategies while making profits.",
      avatar: "MR",
      rating: 5,
      profit: "+$89,500"
    },
    {
      name: "Emily Watson",
      role: "Investment Advisor",
      content: "The security and regulation give me confidence. KAIRO feels like the future of trading platforms.",
      avatar: "EW",
      rating: 5,
      profit: "+$203,750"
    }
  ]

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = Math.floor(start + (end - start) * progress)
        callback(current)
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    animateValue(0, 1000000, 2000, (value) => setAnimatedStats(prev => ({ ...prev, users: value })))
    animateValue(0, 2500000000, 2500, (value) => setAnimatedStats(prev => ({ ...prev, trades: value })))
    animateValue(0, 200, 1500, (value) => setAnimatedStats(prev => ({ ...prev, profit: value })))
    animateValue(0, 99.9, 2000, (value) => setAnimatedStats(prev => ({ ...prev, success: value })))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Trading Platform
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Trade Smarter with
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block mt-2">
              Artificial Intelligence
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join over 1 million traders using KAIRO&apos;s advanced AI algorithms and comprehensive risk management system to maximize profits, 
            minimize risks, and automate their trading strategies with real-time portfolio analytics and VaR monitoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={handleStartFreeTrial}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-4 h-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleWatchDemo}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 h-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">1M+ active traders</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-400 text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                Modern Traders
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of trading with our comprehensive suite of AI-powered tools, advanced risk management, and real-time portfolio analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Successful Traders
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our community of traders has to say about their experience with KAIRO.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`bg-gray-800/50 border-gray-700 backdrop-blur-sm transition-all duration-500 ${
                index === currentTestimonial ? 'ring-2 ring-purple-500 bg-gray-800/70' : ''
              }`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {testimonial.profit}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-12">
              <Crown className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-center">
                Ready to Start Your
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                  Trading Journey?
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-center">
                Join over 1 million traders who&apos;ve discovered the power of AI-driven trading. 
                Start your free trial today and experience the future of investing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleStartFreeTrial}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-4 h-auto"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleViewPricing}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 h-auto"
                >
                  View Pricing
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white">KAIRO Trading Platform Demo</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDemoModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                <InteractiveDemo />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">AI Analysis</h4>
                  <p className="text-gray-300">Watch how our AI analyzes market trends in real-time</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">Smart Trading</h4>
                  <p className="text-gray-300">See automated trading strategies in action</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">Portfolio Growth</h4>
                  <p className="text-gray-300">Track performance and profit optimization</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleStartFreeTrial}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage