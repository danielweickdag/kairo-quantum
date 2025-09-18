'use client';

import { useState } from 'react';
import PineScriptEditor from '../../../../components/trading/PineScriptEditor';
import { Code, Save, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function PineEditorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleSave = async (script: string) => {
    setIsSaving(true);
    try {
      // Here you would save the script to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Pine Script saved successfully!');
    } catch (error) {
      toast.error('Failed to save Pine Script');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async (script: string) => {
    setIsRunning(true);
    try {
      // Here you would execute the script
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate execution
      toast.success('Pine Script executed successfully!');
    } catch (error) {
      toast.error('Failed to execute Pine Script');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <Code className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pine Script Editor
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isSaving && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Saving...</span>
                  </div>
                )}
                {isRunning && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span>Running...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <PineScriptEditor
            onSave={handleSave}
            onRun={handleRun}
          />
        </div>
      </div>
    </div>
  );
}