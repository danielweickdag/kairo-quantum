import { PrismaClient } from '@prisma/client';
import { EncryptionService } from './encryption';
import { BrokerServiceFactory } from './brokers/BrokerServiceFactory';
import {
  BrokerType,
  BrokerCredentials,
  BrokerConnectionConfig,
  BrokerConnectionStatus,
  BrokerAccount,
  BrokerPosition,
  BrokerOrder,
  BrokerTrade,
  BrokerApiResponse,
  BrokerError,
  BrokerAuthError
} from '../types/broker';

const prisma = new PrismaClient();

export class BrokerService {
  /**
   * Creates a new broker connection for a user
   */
  static async createBrokerConnection(
    userId: string,
    brokerType: BrokerType,
    accountName: string,
    credentials: BrokerCredentials
  ): Promise<BrokerApiResponse<BrokerConnectionConfig>> {
    try {
      // Validate broker is supported
      if (!BrokerServiceFactory.isBrokerSupported(brokerType)) {
        return {
          success: false,
          error: `Broker ${brokerType} is not yet supported`
        };
      }

      // Test connection before saving
      const brokerService = BrokerServiceFactory.createBrokerService(brokerType, credentials);
      const connectionTest = await brokerService.testConnection();
      
      if (!connectionTest.success) {
        return {
          success: false,
          error: `Failed to connect to ${brokerType}: ${connectionTest.error}`
        };
      }

      // Encrypt credentials
      const encryptedCredentials = EncryptionService.encryptCredentials(credentials);

      // Save to database
      const brokerConnection = await prisma.BrokerConnection.create({
        data: {
          userId,
          brokerType,
          accountName,
          isActive: true,
          isConnected: true,
          lastSyncAt: new Date(),
          apiKey: encryptedCredentials.apiKey,
          apiSecret: encryptedCredentials.apiSecret,
          accessToken: encryptedCredentials.accessToken,
          refreshToken: encryptedCredentials.refreshToken,
          accountId: credentials.accountId,
          environment: credentials.environment,
          metadata: {}
        }
      });

      // Sync account data
      await this.syncBrokerAccount(brokerConnection.id);

      const config: BrokerConnectionConfig = {
        id: brokerConnection.id,
        userId: brokerConnection.userId,
        brokerType: brokerConnection.brokerType as BrokerType,
        accountName: brokerConnection.accountName,
        isActive: brokerConnection.isActive,
        isConnected: brokerConnection.isConnected,
        lastSyncAt: brokerConnection.lastSyncAt,
        credentials,
        metadata: brokerConnection.metadata as Record<string, any>,
        createdAt: brokerConnection.createdAt,
        updatedAt: brokerConnection.updatedAt
      };

      return { success: true, data: config };
    } catch (error) {
      console.error('Error creating broker connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create broker connection'
      };
    }
  }

  /**
   * Gets all broker connections for a user
   */
  static async getUserBrokerConnections(userId: string): Promise<BrokerConnectionConfig[]> {
    try {
      const connections = await prisma.BrokerConnection.findMany({
        where: { userId },
        include: {
          brokerAccounts: true
        }
      });

      return connections.map(conn => {
        const decryptedCredentials = EncryptionService.decryptCredentials({
          apiKey: conn.apiKey,
          apiSecret: conn.apiSecret,
          accessToken: conn.accessToken,
          refreshToken: conn.refreshToken
        });

        return {
          id: conn.id,
          userId: conn.userId,
          brokerType: conn.brokerType as BrokerType,
          accountName: conn.accountName,
          isActive: conn.isActive,
          isConnected: conn.isConnected,
          lastSyncAt: conn.lastSyncAt,
          credentials: {
            ...decryptedCredentials,
            accountId: conn.accountId,
            environment: conn.environment as 'sandbox' | 'production'
          },
          metadata: conn.metadata as Record<string, any>,
          createdAt: conn.createdAt,
          updatedAt: conn.updatedAt
        };
      });
    } catch (error) {
      console.error('Error getting user broker connections:', error);
      return [];
    }
  }

  /**
   * Gets user's broker accounts with detailed account information
   */
  static async getUserBrokerAccountsWithDetails(userId: string): Promise<any[]> {
    try {
      const connections = await prisma.BrokerConnection.findMany({
        where: { 
          userId,
          isActive: true,
          isConnected: true
        },
        include: {
          brokerAccounts: true
        }
      });

      const accountsWithDetails = connections.map(conn => {
        return conn.brokerAccounts.map(account => ({
          id: account.id,
          connectionId: conn.id,
          brokerType: conn.brokerType,
          brokerName: this.getBrokerDisplayName(conn.brokerType as BrokerType),
          accountName: conn.accountName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          status: account.status,
          environment: conn.environment,
          buyingPower: account.buyingPower,
          cashBalance: account.cashBalance,
          portfolioValue: account.portfolioValue,
          dayTradingBuyingPower: account.dayTradingBuyingPower,
          maintenanceMargin: account.maintenanceMargin,
          currency: account.currency,
          isActive: conn.isActive,
          isConnected: conn.isConnected,
          lastSyncAt: conn.lastSyncAt,
          lastUpdated: account.lastUpdated
        }));
      }).flat();

      return accountsWithDetails;
    } catch (error) {
      console.error('Error getting user broker accounts with details:', error);
      return [];
    }
  }

  /**
   * Gets display name for broker type
   */
  private static getBrokerDisplayName(brokerType: BrokerType): string {
    const brokerNames = {
      [BrokerType.ALPACA]: 'Alpaca',
      [BrokerType.INTERACTIVE_BROKERS]: 'Interactive Brokers',
      [BrokerType.TD_AMERITRADE]: 'TD Ameritrade',
      [BrokerType.TRADIER]: 'Tradier',
      [BrokerType.ROBINHOOD]: 'Robinhood',
      [BrokerType.FIDELITY]: 'Fidelity',
      [BrokerType.SCHWAB]: 'Charles Schwab',
      [BrokerType.ETRADE]: 'E*TRADE'
    };
    return brokerNames[brokerType] || brokerType;
  }

  /**
   * Tests connection status for a broker connection
   */
  static async testBrokerConnection(connectionId: string): Promise<BrokerConnectionStatus> {
    try {
      const connection = await prisma.BrokerConnection.findUnique({
        where: { id: connectionId }
      });

      if (!connection) {
        return {
          isConnected: false,
          lastChecked: new Date(),
          error: 'Broker connection not found'
        };
      }

      const credentials = EncryptionService.decryptCredentials({
        apiKey: connection.apiKey,
        apiSecret: connection.apiSecret,
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken
      });

      const brokerService = BrokerServiceFactory.createBrokerService(
        connection.brokerType as BrokerType,
        {
          ...credentials,
          accountId: connection.accountId,
          environment: connection.environment as 'sandbox' | 'production'
        }
      );

      const status = await brokerService.getConnectionStatus();

      // Update connection status in database
      await prisma.BrokerConnection.update({
        where: { id: connectionId },
        data: {
          isConnected: status.isConnected,
          lastSyncAt: new Date()
        }
      });

      return status;
    } catch (error) {
      console.error('Error testing broker connection:', error);
      return {
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Syncs account data from broker
   */
  static async syncBrokerAccount(connectionId: string): Promise<BrokerApiResponse<BrokerAccount>> {
    try {
      const connection = await prisma.BrokerConnection.findUnique({
        where: { id: connectionId }
      });

      if (!connection) {
        return {
          success: false,
          error: 'Broker connection not found'
        };
      }

      const credentials = EncryptionService.decryptCredentials({
        apiKey: connection.apiKey,
        apiSecret: connection.apiSecret,
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken
      });

      const brokerService = BrokerServiceFactory.createBrokerService(
        connection.brokerType as BrokerType,
        {
          ...credentials,
          accountId: connection.accountId,
          environment: connection.environment as 'sandbox' | 'production'
        }
      );

      const accountResult = await brokerService.getAccount();
      
      if (!accountResult.success || !accountResult.data) {
        return accountResult;
      }

      const account = accountResult.data;

      // Upsert broker account in database
      await prisma.BrokerAccount.upsert({
        where: {
          brokerConnectionId_accountNumber: {
            brokerConnectionId: connectionId,
            accountNumber: account.accountNumber
          }
        },
        update: {
          accountType: account.accountType,
          status: account.status,
          buyingPower: account.buyingPower,
          cashBalance: account.cashBalance,
          portfolioValue: account.portfolioValue,
          dayTradingBuyingPower: account.dayTradingBuyingPower,
          maintenanceMargin: account.maintenanceMargin,
          currency: account.currency,
          lastUpdated: new Date()
        },
        create: {
          brokerConnectionId: connectionId,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          status: account.status,
          buyingPower: account.buyingPower,
          cashBalance: account.cashBalance,
          portfolioValue: account.portfolioValue,
          dayTradingBuyingPower: account.dayTradingBuyingPower,
          maintenanceMargin: account.maintenanceMargin,
          currency: account.currency
        }
      });

      return accountResult;
    } catch (error) {
      console.error('Error syncing broker account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync account'
      };
    }
  }

  /**
   * Gets positions for a broker connection
   */
  static async getBrokerPositions(connectionId: string): Promise<BrokerApiResponse<BrokerPosition[]>> {
    try {
      const connection = await prisma.BrokerConnection.findUnique({
        where: { id: connectionId }
      });

      if (!connection) {
        return {
          success: false,
          error: 'Broker connection not found'
        };
      }

      const credentials = EncryptionService.decryptCredentials({
        apiKey: connection.apiKey,
        apiSecret: connection.apiSecret,
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken
      });

      const brokerService = BrokerServiceFactory.createBrokerService(
        connection.brokerType as BrokerType,
        {
          ...credentials,
          accountId: connection.accountId,
          environment: connection.environment as 'sandbox' | 'production'
        }
      );

      return await brokerService.getPositions();
    } catch (error) {
      console.error('Error getting broker positions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get positions'
      };
    }
  }

  /**
   * Places an order through a broker connection
   */
  static async placeBrokerOrder(
    connectionId: string,
    order: Partial<BrokerOrder>
  ): Promise<BrokerApiResponse<BrokerOrder>> {
    try {
      const connection = await prisma.BrokerConnection.findUnique({
        where: { id: connectionId }
      });

      if (!connection) {
        return {
          success: false,
          error: 'Broker connection not found'
        };
      }

      const credentials = EncryptionService.decryptCredentials({
        apiKey: connection.apiKey,
        apiSecret: connection.apiSecret,
        accessToken: connection.accessToken,
        refreshToken: connection.refreshToken
      });

      const brokerService = BrokerServiceFactory.createBrokerService(
        connection.brokerType as BrokerType,
        {
          ...credentials,
          accountId: connection.accountId,
          environment: connection.environment as 'sandbox' | 'production'
        }
      );

      return await brokerService.placeOrder(order);
    } catch (error) {
      console.error('Error placing broker order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to place order'
      };
    }
  }

  /**
   * Deletes a broker connection
   */
  static async deleteBrokerConnection(connectionId: string, userId: string): Promise<BrokerApiResponse<boolean>> {
    try {
      const connection = await prisma.BrokerConnection.findFirst({
        where: {
          id: connectionId,
          userId
        }
      });

      if (!connection) {
        return {
          success: false,
          error: 'Broker connection not found'
        };
      }

      await prisma.BrokerConnection.delete({
        where: { id: connectionId }
      });

      return { success: true, data: true };
    } catch (error) {
      console.error('Error deleting broker connection:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete connection'
      };
    }
  }

  /**
   * Updates broker connection status
   */
  static async updateBrokerConnectionStatus(
    connectionId: string,
    isActive: boolean
  ): Promise<BrokerApiResponse<boolean>> {
    try {
      await prisma.BrokerConnection.update({
        where: { id: connectionId },
        data: { isActive }
      });

      return { success: true, data: true };
    } catch (error) {
      console.error('Error updating broker connection status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update connection status'
      };
    }
  }
}