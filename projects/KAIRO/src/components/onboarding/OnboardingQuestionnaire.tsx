'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
// Using available UI components instead of missing radio-group and checkbox
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Shield,
  CreditCard,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  DollarSign,
  Users,
  Brain,
  Settings,
  Zap,
  Award,
  Clock,
  AlertCircle,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'personal' | 'verification' | 'financial' | 'trading' | 'preferences';
  required: boolean;
  estimatedTime: string;
}

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  
  // Trading Experience
  tradingExperience: 'beginner' | 'intermediate' | 'advanced' | '';
  previousPlatforms: string[];
  tradingGoals: string[];
  riskTolerance: 'low' | 'medium' | 'high' | '';
  
  // Financial Information
  annualIncome: string;
  investmentAmount: string;
  fundingMethod: string;
  
  // Verification Documents
  idDocument: File | null;
  proofOfAddress: File | null;
  
  // Preferences
  preferredCreators: string[];
  notificationPreferences: string[];
  tradingHours: string;
  autoTradingEnabled: boolean;
}

interface OnboardingQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
  onComplete: (data: FormData) => void;
}

const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    tradingExperience: '',
    previousPlatforms: [],
    tradingGoals: [],
    riskTolerance: '',
    annualIncome: '',
    investmentAmount: '',
    fundingMethod: '',
    idDocument: null,
    proofOfAddress: null,
    preferredCreators: [],
    notificationPreferences: [],
    tradingHours: '',
    autoTradingEnabled: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionnaireSteps: QuestionnaireStep[] = [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Tell us about yourself to personalize your experience',
      icon: <User className="w-6 h-6" />,
      category: 'personal',
      required: true,
      estimatedTime: '3 min'
    },
    {
      id: 'trading-experience',
      title: 'Trading Background',
      description: 'Help us understand your trading experience and goals',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'trading',
      required: true,
      estimatedTime: '4 min'
    },
    {
      id: 'financial-profile',
      title: 'Financial Profile',
      description: 'Set up your investment parameters and funding',
      icon: <DollarSign className="w-6 h-6" />,
      category: 'financial',
      required: true,
      estimatedTime: '3 min'
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      description: 'Upload documents to verify your identity',
      icon: <Shield className="w-6 h-6" />,
      category: 'verification',
      required: true,
      estimatedTime: '5 min'
    },
    {
      id: 'preferences',
      title: 'Trading Preferences',
      description: 'Customize your trading experience and notifications',
      icon: <Settings className="w-6 h-6" />,
      category: 'preferences',
      required: false,
      estimatedTime: '4 min'
    }
  ];

  const tradingGoalOptions = [
    'Generate passive income',
    'Learn trading strategies',
    'Diversify portfolio',
    'Follow expert traders',
    'Build long-term wealth',
    'Test new strategies'
  ];

  const creatorOptions = [
    'Conservative traders',
    'Growth-focused traders',
    'Forex specialists',
    'Crypto experts',
    'Stock market pros',
    'Day traders'
  ];

  const notificationOptions = [
    'Trade notifications',
    'Performance updates',
    'Market alerts',
    'Creator updates',
    'Risk warnings',
    'Weekly summaries'
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const step = questionnaireSteps[stepIndex];
    const newErrors: Record<string, string> = {};

    switch (step.id) {
      case 'personal-info':
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.country) newErrors.country = 'Country is required';
        break;
      
      case 'trading-experience':
        if (!formData.tradingExperience) newErrors.tradingExperience = 'Trading experience is required';
        if (!formData.riskTolerance) newErrors.riskTolerance = 'Risk tolerance is required';
        if (formData.tradingGoals.length === 0) newErrors.tradingGoals = 'Please select at least one trading goal';
        break;
      
      case 'financial-profile':
        if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required';
        if (!formData.investmentAmount) newErrors.investmentAmount = 'Investment amount is required';
        if (!formData.fundingMethod) newErrors.fundingMethod = 'Funding method is required';
        break;
      
      case 'verification':
        if (!formData.idDocument) newErrors.idDocument = 'ID document is required';
        if (!formData.proofOfAddress) newErrors.proofOfAddress = 'Proof of address is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < questionnaireSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(formData);
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (field: 'idDocument' | 'proofOfAddress', file: File) => {
    updateFormData(field, file);
  };

  const progressPercentage = ((currentStep + 1) / questionnaireSteps.length) * 100;
  const currentStepData = questionnaireSteps[currentStep];

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'personal-info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>
          </div>
        );

      case 'trading-experience':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Trading Experience *</Label>
              <Select
                value={formData.tradingExperience}
                onValueChange={(value) => updateFormData('tradingExperience', value)}
              >
                <SelectTrigger className={errors.tradingExperience ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your trading experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to trading</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some trading experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Experienced trader</SelectItem>
                </SelectContent>
              </Select>
              {errors.tradingExperience && <p className="text-sm text-red-500">{errors.tradingExperience}</p>}
            </div>
            
            <div className="space-y-4">
              <Label>Risk Tolerance *</Label>
              <Select
                value={formData.riskTolerance}
                onValueChange={(value) => updateFormData('riskTolerance', value)}
              >
                <SelectTrigger className={errors.riskTolerance ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your risk tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Conservative approach</SelectItem>
                  <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                  <SelectItem value="high">High - Aggressive approach</SelectItem>
                </SelectContent>
              </Select>
              {errors.riskTolerance && <p className="text-sm text-red-500">{errors.riskTolerance}</p>}
            </div>
            
            <div className="space-y-4">
              <Label>Trading Goals * (Select all that apply)</Label>
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", errors.tradingGoals && "border border-red-500 rounded-lg p-4")}>
                {tradingGoalOptions.map((goal) => (
                  <Button
                    key={goal}
                    type="button"
                    variant={formData.tradingGoals.includes(goal) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => {
                      if (formData.tradingGoals.includes(goal)) {
                        updateFormData('tradingGoals', formData.tradingGoals.filter(g => g !== goal));
                      } else {
                        updateFormData('tradingGoals', [...formData.tradingGoals, goal]);
                      }
                    }}
                  >
                    <span className="text-sm">{goal}</span>
                  </Button>
                ))}
              </div>
              {errors.tradingGoals && <p className="text-sm text-red-500">{errors.tradingGoals}</p>}
            </div>
          </div>
        );

      case 'financial-profile':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income *</Label>
              <Select value={formData.annualIncome} onValueChange={(value) => updateFormData('annualIncome', value)}>
                <SelectTrigger className={errors.annualIncome ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your annual income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-25k">Under $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="over-500k">Over $500,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.annualIncome && <p className="text-sm text-red-500">{errors.annualIncome}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="investmentAmount">Initial Investment Amount *</Label>
              <Select value={formData.investmentAmount} onValueChange={(value) => updateFormData('investmentAmount', value)}>
                <SelectTrigger className={errors.investmentAmount ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your initial investment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="over-50k">Over $50,000</SelectItem>
                </SelectContent>
              </Select>
              {errors.investmentAmount && <p className="text-sm text-red-500">{errors.investmentAmount}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fundingMethod">Preferred Funding Method *</Label>
              <Select value={formData.fundingMethod} onValueChange={(value) => updateFormData('fundingMethod', value)}>
                <SelectTrigger className={errors.fundingMethod ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select funding method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
              {errors.fundingMethod && <p className="text-sm text-red-500">{errors.fundingMethod}</p>}
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Identity Document *</Label>
              <div className={cn("border-2 border-dashed rounded-lg p-6 text-center", errors.idDocument ? 'border-red-500' : 'border-gray-300')}>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload your government-issued ID</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('idDocument', file);
                  }}
                  className="hidden"
                  id="id-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('id-upload')?.click()}
                >
                  Choose File
                </Button>
                {formData.idDocument && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.idDocument.name}
                  </p>
                )}
              </div>
              {errors.idDocument && <p className="text-sm text-red-500">{errors.idDocument}</p>}
            </div>
            
            <div className="space-y-4">
              <Label>Proof of Address *</Label>
              <div className={cn("border-2 border-dashed rounded-lg p-6 text-center", errors.proofOfAddress ? 'border-red-500' : 'border-gray-300')}>
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload a utility bill or bank statement</p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('proofOfAddress', file);
                  }}
                  className="hidden"
                  id="address-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('address-upload')?.click()}
                >
                  Choose File
                </Button>
                {formData.proofOfAddress && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.proofOfAddress.name}
                  </p>
                )}
              </div>
              {errors.proofOfAddress && <p className="text-sm text-red-500">{errors.proofOfAddress}</p>}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Verification Requirements</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Documents must be clear and readable</li>
                    <li>• ID must be government-issued and valid</li>
                    <li>• Address document must be dated within 3 months</li>
                    <li>• Verification typically takes 1-2 business days</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Preferred Creator Types (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {creatorOptions.map((creator) => (
                  <Button
                    key={creator}
                    type="button"
                    variant={formData.preferredCreators.includes(creator) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => {
                      if (formData.preferredCreators.includes(creator)) {
                        updateFormData('preferredCreators', formData.preferredCreators.filter(c => c !== creator));
                      } else {
                        updateFormData('preferredCreators', [...formData.preferredCreators, creator]);
                      }
                    }}
                  >
                    <span className="text-sm">{creator}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Notification Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notificationOptions.map((notification) => (
                  <Button
                    key={notification}
                    type="button"
                    variant={formData.notificationPreferences.includes(notification) ? "default" : "outline"}
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => {
                      if (formData.notificationPreferences.includes(notification)) {
                        updateFormData('notificationPreferences', formData.notificationPreferences.filter(n => n !== notification));
                      } else {
                        updateFormData('notificationPreferences', [...formData.notificationPreferences, notification]);
                      }
                    }}
                  >
                    <span className="text-sm">{notification}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tradingHours">Preferred Trading Hours</Label>
              <Select value={formData.tradingHours} onValueChange={(value) => updateFormData('tradingHours', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred trading hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market-hours">Market Hours Only</SelectItem>
                  <SelectItem value="extended-hours">Extended Hours</SelectItem>
                  <SelectItem value="24-7">24/7 (All Markets)</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={formData.autoTradingEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => updateFormData('autoTradingEnabled', !formData.autoTradingEnabled)}
              >
                {formData.autoTradingEnabled ? '✓' : ''} Enable automatic trading (recommended)
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-600" />
            <span>Complete Your KAIRO Setup</span>
          </DialogTitle>
          <DialogDescription>
            Let&apos;s get you set up with a personalized trading experience in just a few steps.
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Step {currentStep + 1} of {questionnaireSteps.length}</span>
            <span className="text-gray-600">
              {currentStepData.estimatedTime} remaining
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {questionnaireSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                  index < currentStep ? "bg-green-500 text-white" :
                  index === currentStep ? "bg-purple-500 text-white" :
                  "bg-gray-200 text-gray-500"
                )}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={cn(
                  "text-xs text-center max-w-20",
                  index === currentStep ? "font-medium text-purple-700" : "text-gray-500"
                )}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentStepData.icon}
              <span>{currentStepData.title}</span>
              {currentStepData.required && (
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="min-w-32"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up...</span>
              </div>
            ) : currentStep === questionnaireSteps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingQuestionnaire;