'use client';

import OptionsTrading from '../../../../components/trading/OptionsTrading';
import AppLayout from '@/components/layouts/AppLayout';
import { Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OptionsTradingPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/trading"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Trading</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Options Trading
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>Greeks & Strategies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OptionsTrading />
      </div>
      </div>
    </AppLayout>
  );
}