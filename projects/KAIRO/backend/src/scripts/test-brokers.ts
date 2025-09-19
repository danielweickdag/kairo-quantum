#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import { BrokerServiceFactory } from '../services/brokers/BrokerServiceFactory';
import { BrokerService } from '../services/BrokerService';
import { getBrokerMonitoringService } from '../services/BrokerMonitoringService';
import { BrokerType, BrokerCredentials } from '../types/broker';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Test credentials for sandbox environments
const TEST_CREDENTIALS: Record<BrokerType, BrokerCredentials> = {
  [BrokerType.ALPACA]: {
    apiKey: process.env.ALPACA_TEST_API_KEY || 'test-key',
    apiSecret: process.env.ALPACA_TEST_API_SECRET || 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.INTERACTIVE_BROKERS]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.TD_AMERITRADE]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.TRADIER]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.ROBINHOOD]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.FIDELITY]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.SCHWAB]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  },
  [BrokerType.ETRADE]: {
    apiKey: 'test-key',
    apiSecret: 'test-secret',
    environment: 'sandbox'
  }
};

interface TestResult {
  broker: BrokerType;
  supported: boolean;
  connectionTest?: {
    success: boolean;
    error?: string;
    responseTime?: number;
  };
  capabilities?: any;
  error?: string;
}

class BrokerTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting broker integration tests...\n');

    // Test 1: Check supported brokers
    await this.testSupportedBrokers();

    // Test 2: Test broker service creation
    await this.testBrokerServiceCreation();

    // Test 3: Test connection capabilities
    await this.testConnectionCapabilities();

    // Test 4: Test monitoring service
    await this.testMonitoringService();

    // Test 5: Test database operations
    await this.testDatabaseOperations();

    // Print summary
    this.printSummary();
  }

  private async testSupportedBrokers(): Promise<void> {
    console.log('📋 Testing supported brokers...');
    
    const supportedBrokers = BrokerServiceFactory.getSupportedBrokers();
    console.log(`   Supported brokers: ${supportedBrokers.join(', ')}`);
    
    for (const broker of Object.values(BrokerType)) {
      const isSupported = BrokerServiceFactory.isBrokerSupported(broker);
      this.results.push({
        broker,
        supported: isSupported
      });
      
      console.log(`   ${broker}: ${isSupported ? '✅ Supported' : '❌ Not supported'}`);
    }
    
    console.log('');
  }

  private async testBrokerServiceCreation(): Promise<void> {
    console.log('🏗️  Testing broker service creation...');
    
    for (const result of this.results) {
      if (!result.supported) continue;
      
      try {
        const credentials = TEST_CREDENTIALS[result.broker];
        const service = BrokerServiceFactory.createBrokerService(result.broker, credentials);
        
        // Test connection
        const startTime = Date.now();
        const connectionResult = await service.testConnection();
        const responseTime = Date.now() - startTime;
        
        result.connectionTest = {
          success: connectionResult.success,
          error: connectionResult.error,
          responseTime
        };
        
        console.log(`   ${result.broker}: ${connectionResult.success ? '✅' : '❌'} Connection test (${responseTime}ms)`);
        if (!connectionResult.success && connectionResult.error) {
          console.log(`      Error: ${connectionResult.error}`);
        }
        
      } catch (error) {
        result.error = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ${result.broker}: ❌ Service creation failed - ${result.error}`);
      }
    }
    
    console.log('');
  }

  private async testConnectionCapabilities(): Promise<void> {
    console.log('⚙️  Testing broker capabilities...');
    
    for (const result of this.results) {
      if (!result.supported || !result.connectionTest?.success) continue;
      
      try {
        const credentials = TEST_CREDENTIALS[result.broker];
        const service = BrokerServiceFactory.createBrokerService(result.broker, credentials);
        
        const capabilities = await service.getCapabilities();
        result.capabilities = capabilities;
        
        console.log(`   ${result.broker}: ✅ Capabilities retrieved`);
        console.log(`      Stocks: ${capabilities.supportsStocks ? '✅' : '❌'}`);
        console.log(`      Options: ${capabilities.supportsOptions ? '✅' : '❌'}`);
        console.log(`      Crypto: ${capabilities.supportsCrypto ? '✅' : '❌'}`);
        console.log(`      Real-time data: ${capabilities.supportsRealTimeData ? '✅' : '❌'}`);
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ${result.broker}: ❌ Capabilities test failed - ${errorMsg}`);
      }
    }
    
    console.log('');
  }

  private async testMonitoringService(): Promise<void> {
    console.log('📡 Testing monitoring service...');
    
    try {
      const monitoringService = getBrokerMonitoringService(prisma);
      
      // Test getting stats
      const stats = monitoringService.getMonitoringStats();
      console.log(`   ✅ Monitoring stats: ${stats.totalConnections} connections`);
      
      // Test getting connections health
      const health = monitoringService.getConnectionsHealth();
      console.log(`   ✅ Health status for ${health.length} connections`);
      
      console.log('   ✅ Monitoring service operational');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`   ❌ Monitoring service test failed - ${errorMsg}`);
    }
    
    console.log('');
  }

  private async testDatabaseOperations(): Promise<void> {
    console.log('🗄️  Testing database operations...');
    
    try {
      // Test getting broker connections (should be empty for test)
      const connections = await prisma.brokerConnection.findMany({
        take: 5
      });
      console.log(`   ✅ Database query successful - found ${connections.length} connections`);
      
      // Test getting supported broker types from enum
      const brokerTypes = Object.values(BrokerType);
      console.log(`   ✅ Broker types enum: ${brokerTypes.length} types`);
      
      console.log('   ✅ Database operations working');
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.log(`   ❌ Database operations test failed - ${errorMsg}`);
    }
    
    console.log('');
  }

  private printSummary(): void {
    console.log('📊 Test Summary');
    console.log('================');
    
    const supportedCount = this.results.filter(r => r.supported).length;
    const workingConnections = this.results.filter(r => r.connectionTest?.success).length;
    const totalBrokers = this.results.length;
    
    console.log(`Total brokers: ${totalBrokers}`);
    console.log(`Supported: ${supportedCount}/${totalBrokers}`);
    console.log(`Working connections: ${workingConnections}/${supportedCount}`);
    
    console.log('\n📋 Detailed Results:');
    for (const result of this.results) {
      const status = result.supported 
        ? (result.connectionTest?.success ? '✅ Working' : '⚠️  Supported but connection failed')
        : '❌ Not supported';
      
      console.log(`   ${result.broker}: ${status}`);
      
      if (result.connectionTest && !result.connectionTest.success && result.connectionTest.error) {
        console.log(`      Error: ${result.connectionTest.error}`);
      }
      
      if (result.error) {
        console.log(`      Service Error: ${result.error}`);
      }
    }
    
    console.log('\n🎯 Recommendations:');
    
    const unsupportedBrokers = this.results.filter(r => !r.supported);
    if (unsupportedBrokers.length > 0) {
      console.log(`   • Implement support for: ${unsupportedBrokers.map(r => r.broker).join(', ')}`);
    }
    
    const failedConnections = this.results.filter(r => r.supported && !r.connectionTest?.success);
    if (failedConnections.length > 0) {
      console.log(`   • Fix connection issues for: ${failedConnections.map(r => r.broker).join(', ')}`);
      console.log(`   • Verify API credentials and endpoints`);
    }
    
    if (workingConnections === supportedCount && supportedCount > 0) {
      console.log('   🎉 All supported brokers are working correctly!');
    }
    
    console.log('');
  }
}

// Main execution
async function main() {
  try {
    const tester = new BrokerTester();
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { BrokerTester };