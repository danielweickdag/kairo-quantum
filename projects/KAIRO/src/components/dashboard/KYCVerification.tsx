'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Camera, 
  FileText, 
  User, 
  CreditCard, 
  Building, 
  Globe, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Eye, 
  EyeOff, 
  Download, 
  RefreshCw, 
  Info, 
  Star, 
  Award, 
  Lock, 
  Unlock, 
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface KYCDocument {
  id: string
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement'
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
  fileName?: string
  uploadedAt?: string
  verifiedAt?: string
  rejectionReason?: string
  expiryDate?: string
}

interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  phoneNumber: string
  email: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  occupation: string
  sourceOfFunds: string
  expectedTradingVolume: string
}

interface KYCStatus {
  level: 'unverified' | 'basic' | 'intermediate' | 'advanced'
  overallStatus: 'pending' | 'in_review' | 'verified' | 'rejected'
  completionPercentage: number
  withdrawalLimit: number
  depositLimit: number
  tradingLimit: number
  features: string[]
}

export default function KYCVerification() {
  const [activeTab, setActiveTab] = useState('overview')
  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    level: 'basic',
    overallStatus: 'in_review',
    completionPercentage: 65,
    withdrawalLimit: 10000,
    depositLimit: 50000,
    tradingLimit: 100000,
    features: ['Basic Trading', 'Crypto Deposits', 'Limited Withdrawals']
  })
  const [documents, setDocuments] = useState<KYCDocument[]>([
    {
      id: '1',
      type: 'passport',
      status: 'verified',
      fileName: 'passport_scan.pdf',
      uploadedAt: '2024-01-15T10:30:00Z',
      verifiedAt: '2024-01-16T14:20:00Z',
      expiryDate: '2030-05-15'
    },
    {
      id: '2',
      type: 'utility_bill',
      status: 'uploaded',
      fileName: 'utility_bill_jan2024.pdf',
      uploadedAt: '2024-01-18T09:15:00Z'
    },
    {
      id: '3',
      type: 'bank_statement',
      status: 'pending',
    }
  ])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    nationality: 'United States',
    phoneNumber: '+1-555-0123',
    email: 'john.doe@example.com',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States'
    },
    occupation: 'Software Engineer',
    sourceOfFunds: 'Employment Income',
    expectedTradingVolume: '$10,000 - $50,000'
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)
  const [showPersonalForm, setShowPersonalForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'uploaded': case 'in_review': return 'text-yellow-600 bg-yellow-50'
      case 'pending': return 'text-gray-600 bg-gray-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'uploaded': case 'in_review': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'pending': return <Upload className="w-4 h-4 text-gray-600" />
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Upload className="w-4 h-4 text-gray-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'unverified': return 'text-gray-600 bg-gray-50'
      case 'basic': return 'text-blue-600 bg-blue-50'
      case 'intermediate': return 'text-purple-600 bg-purple-50'
      case 'advanced': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const handleFileUpload = async (docType: string, file: File) => {
    setIsUploading(true)
    setUploadingDocType(docType)
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setDocuments(prev => prev.map(doc => 
      doc.type === docType 
        ? { 
            ...doc, 
            status: 'uploaded', 
            fileName: file.name, 
            uploadedAt: new Date().toISOString() 
          }
        : doc
    ))
    
    setIsUploading(false)
    setUploadingDocType(null)
  }

  const handleDocumentUpload = (docType: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileUpload(docType, file)
      }
    }
    input.click()
  }

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'passport': return 'Passport'
      case 'drivers_license': return 'Driver\'s License'
      case 'national_id': return 'National ID'
      case 'utility_bill': return 'Utility Bill'
      case 'bank_statement': return 'Bank Statement'
      default: return 'Document'
    }
  }

  const getDocumentDescription = (type: string) => {
    switch (type) {
      case 'passport': return 'Government-issued passport (photo page)'
      case 'drivers_license': return 'Valid driver\'s license (front and back)'
      case 'national_id': return 'National identity card'
      case 'utility_bill': return 'Recent utility bill (within 3 months)'
      case 'bank_statement': return 'Bank statement (within 3 months)'
      default: return 'Required document'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">KYC Verification</h2>
          <p className="text-muted-foreground">Complete your identity verification to unlock all features</p>
        </div>
        <Badge className={cn("px-3 py-1", getLevelColor(kycStatus.level))}>
          <Shield className="w-4 h-4 mr-1" />
          {kycStatus.level.charAt(0).toUpperCase() + kycStatus.level.slice(1)} Level
        </Badge>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getStatusIcon(kycStatus.overallStatus)}
            <span>Verification Status</span>
          </CardTitle>
          <CardDescription>
            Your current verification level and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Completion Progress</span>
                <span className="text-sm text-muted-foreground">{kycStatus.completionPercentage}%</span>
              </div>
              <Progress value={kycStatus.completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Daily Withdrawal Limit</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(kycStatus.withdrawalLimit)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Daily Deposit Limit</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(kycStatus.depositLimit)}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Trading Limit</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(kycStatus.tradingLimit)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Available Features:</p>
              <div className="flex flex-wrap gap-2">
                {kycStatus.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Levels</CardTitle>
                <CardDescription>
                  Unlock higher limits by completing verification steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className={cn("p-3 rounded-lg border", kycStatus.level === 'basic' ? 'border-blue-200 bg-blue-50' : 'border-gray-200')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-2 rounded-full", kycStatus.level === 'basic' ? 'bg-blue-600' : 'bg-gray-400')} />
                        <span className="font-medium">Basic Level</span>
                      </div>
                      {kycStatus.level === 'basic' && <Badge variant="outline">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Email verification + Basic info</p>
                    <p className="text-sm font-medium">Limits: {formatCurrency(10000)} withdrawal, {formatCurrency(50000)} deposit</p>
                  </div>
                  
                  <div className={cn("p-3 rounded-lg border", kycStatus.level === 'intermediate' ? 'border-purple-200 bg-purple-50' : 'border-gray-200')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-2 rounded-full", kycStatus.level === 'intermediate' ? 'bg-purple-600' : 'bg-gray-400')} />
                        <span className="font-medium">Intermediate Level</span>
                      </div>
                      <Button size="sm" variant="outline">Upgrade</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">ID verification + Address proof</p>
                    <p className="text-sm font-medium">Limits: {formatCurrency(50000)} withdrawal, {formatCurrency(200000)} deposit</p>
                  </div>
                  
                  <div className={cn("p-3 rounded-lg border", kycStatus.level === 'advanced' ? 'border-green-200 bg-green-50' : 'border-gray-200')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-2 rounded-full", kycStatus.level === 'advanced' ? 'bg-green-600' : 'bg-gray-400')} />
                        <span className="font-medium">Advanced Level</span>
                      </div>
                      <Button size="sm" variant="outline">Upgrade</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Enhanced verification + Source of funds</p>
                    <p className="text-sm font-medium">Limits: Unlimited</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  Complete these steps to increase your verification level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Identity Document</p>
                      <p className="text-sm text-muted-foreground">Under review</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Address Verification</p>
                      <p className="text-sm text-muted-foreground">Upload required</p>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab('documents')}>Upload</Button>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Financial Information</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab('personal')}>Complete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload clear, high-quality images or PDFs of your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h4 className="font-medium">{getDocumentTitle(doc.type)}</h4>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {getDocumentDescription(doc.type)}
                    </p>
                    
                    {doc.fileName && (
                      <div className="mb-3">
                        <p className="text-sm font-medium">Uploaded: {doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.uploadedAt && new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    {doc.status === 'rejected' && doc.rejectionReason && (
                      <Alert className="mb-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Rejected: {doc.rejectionReason}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={doc.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => handleDocumentUpload(doc.type)}
                        disabled={isUploading && uploadingDocType === doc.type}
                      >
                        {isUploading && uploadingDocType === doc.type ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-1" />
                        )}
                        {doc.status === 'pending' ? 'Upload' : 'Replace'}
                      </Button>
                      
                      {doc.fileName && (
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document Requirements:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Documents must be in color and clearly readable</li>
                    <li>• File formats: PDF, JPG, PNG (max 10MB)</li>
                    <li>• All four corners of the document must be visible</li>
                    <li>• Documents must be valid and not expired</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Provide accurate personal and financial information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select value={personalInfo.nationality} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, nationality: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={personalInfo.phoneNumber}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Address Information</h4>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={personalInfo.address.street}
                      onChange={(e) => setPersonalInfo(prev => ({
                        ...prev,
                        address: { ...prev.address, street: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={personalInfo.address.city}
                        onChange={(e) => setPersonalInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, city: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={personalInfo.address.state}
                        onChange={(e) => setPersonalInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={personalInfo.address.postalCode}
                        onChange={(e) => setPersonalInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, postalCode: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={personalInfo.address.country} 
                        onValueChange={(value) => setPersonalInfo(prev => ({
                          ...prev,
                          address: { ...prev.address, country: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold pt-4">Financial Information</h4>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={personalInfo.occupation}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                    <Select value={personalInfo.sourceOfFunds} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, sourceOfFunds: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employment Income">Employment Income</SelectItem>
                        <SelectItem value="Business Income">Business Income</SelectItem>
                        <SelectItem value="Investment Returns">Investment Returns</SelectItem>
                        <SelectItem value="Inheritance">Inheritance</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expectedTradingVolume">Expected Trading Volume</Label>
                    <Select value={personalInfo.expectedTradingVolume} onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, expectedTradingVolume: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$1,000 - $10,000">$1,000 - $10,000</SelectItem>
                        <SelectItem value="$10,000 - $50,000">$10,000 - $50,000</SelectItem>
                        <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                        <SelectItem value="$100,000 - $500,000">$100,000 - $500,000</SelectItem>
                        <SelectItem value="$500,000+">$500,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}