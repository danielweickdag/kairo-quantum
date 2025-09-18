'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Send,
  Search,
  Filter,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Paperclip,
  Image,
  FileText,
  Users,
  MessageCircle,
  Bell,
  Settings,
  Plus,
  Phone,
  Video,
  Smile,
  AtSign,
  Hash,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  isRead: boolean
  attachments?: Attachment[]
  type: 'text' | 'trade_signal' | 'market_alert' | 'system'
  tradeData?: TradeSignal
}

interface Conversation {
  id: string
  participants: Participant[]
  lastMessage: Message
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  isPinned: boolean
  isArchived: boolean
}

interface Participant {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  role?: 'admin' | 'moderator' | 'member'
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'file' | 'chart'
  url: string
  size: number
}

interface TradeSignal {
  symbol: string
  action: 'buy' | 'sell'
  price: number
  stopLoss?: number
  takeProfit?: number
  confidence: number
  timeframe: string
}

const TraderInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Generate mock data
    const generateMockData = () => {
      const mockParticipants: Participant[] = [
        { id: '1', name: 'Alex Chen', avatar: '👨‍💼', status: 'online', role: 'admin' },
        { id: '2', name: 'Sarah Johnson', avatar: '👩‍💼', status: 'online' },
        { id: '3', name: 'Mike Rodriguez', avatar: '👨‍💻', status: 'away' },
        { id: '4', name: 'Emma Wilson', avatar: '👩‍💻', status: 'offline' },
        { id: '5', name: 'Trading Signals', avatar: '📈', status: 'online', role: 'moderator' },
        { id: '6', name: 'Market Alerts', avatar: '🚨', status: 'online', role: 'moderator' }
      ]

      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          participants: [mockParticipants[0]],
          lastMessage: {
            id: 'msg1',
            senderId: '1',
            senderName: 'Alex Chen',
            senderAvatar: '👨‍💼',
            content: 'Hey, did you see the BTC breakout? Looking bullish!',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            isRead: false,
            type: 'text'
          },
          unreadCount: 2,
          isGroup: false,
          isPinned: true,
          isArchived: false
        },
        {
          id: 'conv2',
          participants: [mockParticipants[4]],
          lastMessage: {
            id: 'msg2',
            senderId: '5',
            senderName: 'Trading Signals',
            senderAvatar: '📈',
            content: 'BUY Signal: ETH/USD at $2,450',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            isRead: false,
            type: 'trade_signal',
            tradeData: {
              symbol: 'ETH/USD',
              action: 'buy',
              price: 2450,
              stopLoss: 2400,
              takeProfit: 2550,
              confidence: 85,
              timeframe: '4h'
            }
          },
          unreadCount: 1,
          isGroup: false,
          isPinned: false,
          isArchived: false
        },
        {
          id: 'conv3',
          participants: mockParticipants.slice(0, 4),
          lastMessage: {
            id: 'msg3',
            senderId: '2',
            senderName: 'Sarah Johnson',
            senderAvatar: '👩‍💼',
            content: 'Great analysis on the market trends today!',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: true,
            type: 'text'
          },
          unreadCount: 0,
          isGroup: true,
          groupName: 'Crypto Traders',
          groupAvatar: '💰',
          isPinned: false,
          isArchived: false
        },
        {
          id: 'conv4',
          participants: [mockParticipants[5]],
          lastMessage: {
            id: 'msg4',
            senderId: '6',
            senderName: 'Market Alerts',
            senderAvatar: '🚨',
            content: 'High volatility detected in BTC/USD',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            isRead: true,
            type: 'market_alert'
          },
          unreadCount: 0,
          isGroup: false,
          isPinned: false,
          isArchived: false
        }
      ]

      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: '1',
          senderName: 'Alex Chen',
          senderAvatar: '👨‍💼',
          content: 'Hey, did you see the BTC breakout? Looking bullish!',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false,
          type: 'text'
        },
        {
          id: 'msg2',
          senderId: 'me',
          senderName: 'You',
          senderAvatar: '👤',
          content: 'Yes! I\'ve been watching it. The volume is impressive too.',
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isRead: true,
          type: 'text'
        },
        {
          id: 'msg3',
          senderId: '1',
          senderName: 'Alex Chen',
          senderAvatar: '👨‍💼',
          content: 'Exactly! I think we might see $50k soon. What\'s your target?',
          timestamp: new Date(Date.now() - 1 * 60 * 1000),
          isRead: false,
          type: 'text'
        }
      ]

      setConversations(mockConversations)
      setMessages(mockMessages)
      setSelectedConversation('conv1')
    }

    generateMockData()
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '👤',
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: message }
        : conv
    ))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
  }

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ))
  }

  const archiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isArchived: true }
        : conv
    ))
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const filteredConversations = conversations.filter(conv => {
    if (conv.isArchived) return false
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      return conv.participants.some(p => p.name.toLowerCase().includes(searchLower)) ||
             conv.groupName?.toLowerCase().includes(searchLower) ||
             conv.lastMessage.content.toLowerCase().includes(searchLower)
    }
    if (showOnlineOnly) {
      return conv.participants.some(p => p.status === 'online')
    }
    return true
  })

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const renderTradeSignal = (tradeData: TradeSignal) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-800">Trade Signal</span>
        </div>
        <Badge variant={tradeData.action === 'buy' ? 'default' : 'destructive'}>
          {tradeData.action.toUpperCase()}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-gray-600">Symbol:</span> {tradeData.symbol}</div>
        <div><span className="text-gray-600">Price:</span> ${tradeData.price}</div>
        <div><span className="text-gray-600">Stop Loss:</span> ${tradeData.stopLoss}</div>
        <div><span className="text-gray-600">Take Profit:</span> ${tradeData.takeProfit}</div>
        <div><span className="text-gray-600">Confidence:</span> {tradeData.confidence}%</div>
        <div><span className="text-gray-600">Timeframe:</span> {tradeData.timeframe}</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Trader Inbox</h2>
          <Badge variant="outline">{conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)} unread</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={showOnlineOnly} onCheckedChange={setShowOnlineOnly} />
                <Label className="text-xs">Online only</Label>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50 border-b",
                      selectedConversation === conversation.id && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => {
                      setSelectedConversation(conversation.id)
                      markAsRead(conversation.id)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                          {conversation.isGroup ? conversation.groupAvatar : conversation.participants[0]?.avatar}
                        </div>
                        {!conversation.isGroup && conversation.participants[0]?.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm truncate">
                              {conversation.isGroup ? conversation.groupName : conversation.participants[0]?.name}
                            </span>
                            {conversation.isPinned && <Star className="w-3 h-3 text-yellow-500" />}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs px-1 py-0 min-w-[16px] h-4">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.lastMessage.type === 'trade_signal' && '📈 '}
                            {conversation.lastMessage.type === 'market_alert' && '🚨 '}
                            {conversation.lastMessage.content}
                          </p>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConv ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                        {selectedConv.isGroup ? selectedConv.groupAvatar : selectedConv.participants[0]?.avatar}
                      </div>
                      {!selectedConv.isGroup && selectedConv.participants[0]?.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {selectedConv.isGroup ? selectedConv.groupName : selectedConv.participants[0]?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedConv.isGroup 
                          ? `${selectedConv.participants.length} members`
                          : selectedConv.participants[0]?.status
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => togglePin(selectedConv.id)}>
                      <Star className={cn('w-4 h-4', selectedConv.isPinned && 'text-yellow-500')} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.senderId === 'me' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "max-w-[70%] space-y-1",
                      message.senderId === 'me' ? 'items-end' : 'items-start'
                    )}>
                      {message.senderId !== 'me' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{message.senderAvatar}</span>
                          <span className="text-xs font-medium">{message.senderName}</span>
                        </div>
                      )}
                      
                      <div className={cn(
                        "rounded-lg px-3 py-2",
                        message.senderId === 'me' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      )}>
                        <p className="text-sm">{message.content}</p>
                        {message.tradeData && renderTradeSignal(message.tradeData)}
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-1 text-xs text-gray-500",
                        message.senderId === 'me' ? 'justify-end' : 'justify-start'
                      )}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === 'me' && (
                          <CheckCircle2 className={cn(
                            'w-3 h-3',
                            message.isRead ? 'text-blue-500' : 'text-gray-400'
                          )} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs">Someone is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleFileUpload}>
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Image className="w-4 h-4" alt="Upload image" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <AtSign className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={(e) => console.log('Files selected:', e.target.files)}
              />
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default TraderInbox