'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import InteractiveDemo from '@/components/landing/InteractiveDemo'

export default function DemoPage() {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleGetStarted = () => {
    router.push('/register')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToHome}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-xl font-bold">KAIRO</span>
              </div>
            </div>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            KAIRO Trading Platform Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of AI-driven trading with our interactive demo. 
            See how KAIRO analyzes markets, executes trades, and grows your portfolio.
          </p>
        </div>

        {/* Demo Container */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-8">
          <div className="aspect-video">
            <InteractiveDemo />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">AI Analysis</h3>
            <p className="text-gray-300">
              Watch how our AI analyzes market trends, identifies patterns, and makes intelligent trading decisions in real-time.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Smart Trading</h3>
            <p className="text-gray-300">
              See automated trading strategies in action with risk management, position sizing, and profit optimization.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">Portfolio Growth</h3>
            <p className="text-gray-300">
              Track performance metrics, profit optimization, and portfolio diversification strategies.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of traders who are already using KAIRO to optimize their trading strategies and maximize their profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleBackToHome}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}