'use client';

import { useState } from 'react';
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  FileText,
  Video,
  Users,
  Zap,
  Shield,
  CreditCard,
  TrendingUp,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful?: number;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  articles: number;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I get started with KAIRO?',
    answer: 'Getting started with KAIRO is easy! First, create your account and complete the verification process. Then, connect your preferred broker, set up your trading preferences, and start exploring our AI-powered trading tools. We recommend starting with our demo mode to familiarize yourself with the platform.',
    category: 'getting-started',
    helpful: 45
  },
  {
    id: '2',
    question: 'Which brokers are supported?',
    answer: 'KAIRO supports major brokers including Interactive Brokers, TD Ameritrade, E*TRADE, Charles Schwab, Fidelity, and many others. You can view the complete list of supported brokers in your account settings under the "Brokers" section.',
    category: 'brokers',
    helpful: 38
  },
  {
    id: '3',
    question: 'Is my data and money safe?',
    answer: 'Yes, security is our top priority. We use bank-level encryption, never store your broker passwords, and are SOC 2 Type II certified. Your funds remain with your broker at all times - we only facilitate trading through secure API connections.',
    category: 'security',
    helpful: 52
  },
  {
    id: '4',
    question: 'How does the AI trading work?',
    answer: 'Our AI analyzes market data, news sentiment, technical indicators, and your risk preferences to generate trading signals. You maintain full control - the AI provides recommendations, but you decide whether to execute trades. You can also set up automated trading with customizable risk parameters.',
    category: 'trading',
    helpful: 41
  },
  {
    id: '5',
    question: 'What are the pricing plans?',
    answer: 'We offer three plans: Starter ($29/month) for basic features, Professional ($79/month) for advanced AI tools, and Enterprise ($199/month) for institutional features. All plans include a 14-day free trial with no credit card required.',
    category: 'billing',
    helpful: 33
  },
  {
    id: '6',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won\'t be charged for the next cycle.',
    category: 'billing',
    helpful: 29
  },
  {
    id: '7',
    question: 'How do I set up automated trading?',
    answer: 'Navigate to the Automation section in your dashboard, create a new strategy, set your risk parameters and trading rules, then activate the automation. Start with small position sizes and monitor performance closely.',
    category: 'automation',
    helpful: 36
  },
  {
    id: '8',
    question: 'What markets can I trade?',
    answer: 'KAIRO supports stocks, ETFs, options, forex, and cryptocurrencies across major global exchanges including NYSE, NASDAQ, LSE, TSE, and more. Market availability depends on your connected broker.',
    category: 'trading',
    helpful: 31
  }
];

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using KAIRO',
    icon: Play,
    articles: 12
  },
  {
    id: 'trading',
    title: 'Trading & AI',
    description: 'Understanding AI-powered trading features',
    icon: TrendingUp,
    articles: 18
  },
  {
    id: 'brokers',
    title: 'Broker Integration',
    description: 'Connecting and managing broker accounts',
    icon: Users,
    articles: 8
  },
  {
    id: 'automation',
    title: 'Automation',
    description: 'Setting up automated trading strategies',
    icon: Zap,
    articles: 15
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Account security and data protection',
    icon: Shield,
    articles: 6
  },
  {
    id: 'billing',
    title: 'Billing & Plans',
    description: 'Subscription management and pricing',
    icon: CreditCard,
    articles: 9
  },
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Managing your profile and preferences',
    icon: Settings,
    articles: 11
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: HelpCircle,
    articles: 14
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'up' | 'down' | null>>({});

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVote = (faqId: string, vote: 'up' | 'down') => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: prev[faqId] === vote ? null : vote
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Help Center</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Find answers to your questions and get the most out of KAIRO
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles, FAQs, and guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-4">Live Chat</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get instant help from our support team
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-4">Email Support</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Send us a detailed message about your issue
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Send Email
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-4">Video Tutorials</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Watch step-by-step guides and tutorials
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Watch Videos
            </button>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border transition-all text-left hover:shadow-md ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className={`h-5 w-5 mr-2 ${
                      selectedCategory === category.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <h3 className="font-medium text-gray-900 dark:text-white">{category.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">{category.articles} articles</span>
                </button>
              );
            })}
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              ← Show all categories
            </button>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-500">Was this helpful?</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVote(faq.id, 'up')}
                            className={`p-1 rounded transition-colors ${
                              helpfulVotes[faq.id] === 'up'
                                ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
                                : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleVote(faq.id, 'down')}
                            className={`p-1 rounded transition-colors ${
                              helpfulVotes[faq.id] === 'down'
                                ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20'
                                : 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {faq.helpful} people found this helpful
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or browse our categories above.
              </p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-4">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available 24/7 for immediate assistance</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Average response: 2 minutes</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-4">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">support@kairo.ai</p>
                <p className="text-sm text-green-600 dark:text-green-400">Response within 4 hours</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-4">
                <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Phone Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">+1 (555) 123-KAIRO</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Enterprise Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need dedicated support for your organization? Contact our enterprise team.
                </p>
              </div>
              <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}