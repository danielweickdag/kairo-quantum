import { PrismaClient } from '@prisma/client';
import { BrokerServiceFactory } from './brokers/BrokerServiceFactory';
import { BrokerConnectionStatus, BrokerError } from '../types/broker';
import { logger } from '../utils/logger';

interface MonitoringConfig {
  checkInterval: number; // in milliseconds
  retryAttempts: number;
  retryDelay: number; // in milliseconds
  timeoutDuration: number; // in milliseconds
}

interface ConnectionHealth {
  connectionId: string;
  isHealthy: boolean;
  lastChecked: Date;
  consecutiveFailures: number;
  lastError?: string;
  responseTime?: number;
}

export class BrokerMonitoringService {
  private prisma: PrismaClient;
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private connectionHealth: Map<string, ConnectionHealth> = new Map();
  private config: MonitoringConfig;

  constructor(
    prisma: PrismaClient,
    config: MonitoringConfig = {
      checkInterval: 60000, // 1 minute
      retryAttempts: 3,
      retryDelay: 5000, // 5 seconds
      timeoutDuration: 30000 // 30 seconds
    }
  ) {
    this.prisma = prisma;
    this.config = config;
  }

  /**
   * Start monitoring all active broker connections
   */
  async startMonitoring(): Promise<void> {
    try {
      const connections = await this.prisma.brokerConnection.findMany({
          where: { isActive: true }
        });

      logger.info(`Starting monitoring for ${connections.length} active broker connections`);

      for (const connection of connections) {
        this.startConnectionMonitoring(connection.id);
      }
    } catch (error) {
      logger.error('Error starting broker monitoring:', error);
      throw error;
    }
  }

  /**
   * Stop monitoring all connections
   */
  stopMonitoring(): void {
    logger.info('Stopping all broker connection monitoring');
    
    for (const [connectionId, interval] of this.monitoringIntervals) {
      clearInterval(interval);
      this.monitoringIntervals.delete(connectionId);
    }
    
    this.connectionHealth.clear();
  }

  /**
   * Start monitoring a specific connection
   */
  startConnectionMonitoring(connectionId: string): void {
    // Stop existing monitoring if any
    this.stopConnectionMonitoring(connectionId);

    // Initialize health status
    this.connectionHealth.set(connectionId, {
      connectionId,
      isHealthy: true,
      lastChecked: new Date(),
      consecutiveFailures: 0
    });

    // Start periodic health checks
    const interval = setInterval(async () => {
      await this.checkConnectionHealth(connectionId);
    }, this.config.checkInterval);

    this.monitoringIntervals.set(connectionId, interval);
    logger.info(`Started monitoring for connection ${connectionId}`);
  }

  /**
   * Stop monitoring a specific connection
   */
  stopConnectionMonitoring(connectionId: string): void {
    const interval = this.monitoringIntervals.get(connectionId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(connectionId);
      this.connectionHealth.delete(connectionId);
      logger.info(`Stopped monitoring for connection ${connectionId}`);
    }
  }

  /**
   * Check the health of a specific connection
   */
  async checkConnectionHealth(connectionId: string): Promise<ConnectionHealth> {
    const startTime = Date.now();
    let health = this.connectionHealth.get(connectionId);
    
    if (!health) {
      health = {
        connectionId,
        isHealthy: true,
        lastChecked: new Date(),
        consecutiveFailures: 0
      };
      this.connectionHealth.set(connectionId, health);
    }

    try {
      const connection = await this.prisma.brokerConnection.findUnique({
          where: { id: connectionId }
        });

      if (!connection) {
        throw new Error('Connection not found');
      }

      if (!connection.isActive) {
        // Stop monitoring inactive connections
        this.stopConnectionMonitoring(connectionId);
        return health;
      }

      // Construct credentials from database fields
      const credentials = {
        apiKey: connection.apiKey,
        apiSecret: connection.apiSecret,
        accessToken: connection.accessToken || undefined,
        refreshToken: connection.refreshToken || undefined,
        accountId: connection.accountId || undefined,
        environment: connection.environment as 'sandbox' | 'production'
      };

      // Test the connection with timeout
      const brokerService = BrokerServiceFactory.createBrokerService(
        connection.brokerType as any,
        credentials
      );

      const testResult = await Promise.race([
        brokerService.testConnection(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Connection test timeout')), this.config.timeoutDuration)
        )
      ]);

      const responseTime = Date.now() - startTime;

      if (testResult.success) {
        // Connection is healthy
        health.isHealthy = true;
        health.consecutiveFailures = 0;
        health.lastError = undefined;
        health.responseTime = responseTime;

        // Update database if status changed
        if (!connection.isConnected) {
          await this.updateConnectionStatus(connectionId, true);
        }

        logger.debug(`Connection ${connectionId} health check passed (${responseTime}ms)`);
      } else {
        throw new Error(testResult.error || 'Connection test failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      health.isHealthy = false;
      health.consecutiveFailures += 1;
      health.lastError = errorMessage;
      health.responseTime = Date.now() - startTime;

      logger.warn(`Connection ${connectionId} health check failed (attempt ${health.consecutiveFailures}): ${errorMessage}`);

      // Update database status if this is the first failure
      if (health.consecutiveFailures === 1) {
        await this.updateConnectionStatus(connectionId, false, errorMessage);
      }

      // Handle persistent failures
      if (health.consecutiveFailures >= this.config.retryAttempts) {
        await this.handlePersistentFailure(connectionId, errorMessage);
      }
    } finally {
      health.lastChecked = new Date();
      this.connectionHealth.set(connectionId, health);
    }

    return health;
  }

  /**
   * Update connection status in database
   */
  private async updateConnectionStatus(
    connectionId: string, 
    isConnected: boolean, 
    errorMessage?: string
  ): Promise<void> {
    try {
      await this.prisma.brokerConnection.update({
        where: { id: connectionId },
        data: {
          isConnected,
          lastSyncAt: new Date()
        }
      });

      logger.info(`Updated connection ${connectionId} status: ${isConnected ? 'connected' : 'disconnected'}`);
    } catch (error) {
      logger.error(`Error updating connection status for ${connectionId}:`, error);
    }
  }

  /**
   * Handle persistent connection failures
   */
  private async handlePersistentFailure(connectionId: string, errorMessage: string): Promise<void> {
    try {
      logger.error(`Connection ${connectionId} has persistent failures, deactivating`);

      // Deactivate the connection
      await this.prisma.brokerConnection.update({
          where: { id: connectionId },
          data: {
            isActive: false
          }
        });

      // Stop monitoring this connection
      this.stopConnectionMonitoring(connectionId);

      // TODO: Send notification to user about connection failure
      await this.notifyConnectionFailure(connectionId, errorMessage);
    } catch (error) {
      logger.error(`Error handling persistent failure for ${connectionId}:`, error);
    }
  }

  /**
   * Notify user about connection failure
   */
  private async notifyConnectionFailure(connectionId: string, errorMessage: string): Promise<void> {
    try {
      const connection = await this.prisma.brokerConnection.findUnique({
          where: { id: connectionId },
          include: { user: true }
        });

      if (!connection) return;

      // Create notification record
      await this.prisma.notification.create({
        data: {
          userId: connection.userId,
          type: 'SYSTEM_NOTIFICATION',
          title: 'Broker Connection Failed',
          message: `Your ${connection.brokerType} connection has been deactivated due to persistent connection failures: ${errorMessage}`,
          isRead: false
        }
      });

      logger.info(`Created notification for user ${connection.userId} about connection failure`);
    } catch (error) {
      logger.error(`Error creating notification for connection failure:`, error);
    }
  }

  /**
   * Get health status for all monitored connections
   */
  getConnectionsHealth(): ConnectionHealth[] {
    return Array.from(this.connectionHealth.values());
  }

  /**
   * Get health status for a specific connection
   */
  getConnectionHealth(connectionId: string): ConnectionHealth | undefined {
    return this.connectionHealth.get(connectionId);
  }

  /**
   * Force a health check for a specific connection
   */
  async forceHealthCheck(connectionId: string): Promise<ConnectionHealth> {
    return await this.checkConnectionHealth(connectionId);
  }

  /**
   * Get monitoring statistics
   */
  getMonitoringStats(): {
    totalConnections: number;
    healthyConnections: number;
    unhealthyConnections: number;
    averageResponseTime: number;
  } {
    const connections = this.getConnectionsHealth();
    const healthyConnections = connections.filter(c => c.isHealthy);
    const unhealthyConnections = connections.filter(c => !c.isHealthy);
    
    const responseTimes = connections
      .filter(c => c.responseTime !== undefined)
      .map(c => c.responseTime!);
    
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    return {
      totalConnections: connections.length,
      healthyConnections: healthyConnections.length,
      unhealthyConnections: unhealthyConnections.length,
      averageResponseTime: Math.round(averageResponseTime)
    };
  }

  /**
   * Update monitoring configuration
   */
  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Updated monitoring configuration:', this.config);
  }

  /**
   * Restart monitoring with new configuration
   */
  async restartMonitoring(newConfig?: Partial<MonitoringConfig>): Promise<void> {
    if (newConfig) {
      this.updateConfig(newConfig);
    }
    
    this.stopMonitoring();
    await this.startMonitoring();
  }
}

// Singleton instance for global use
let monitoringServiceInstance: BrokerMonitoringService | null = null;

export function getBrokerMonitoringService(prisma?: PrismaClient): BrokerMonitoringService {
  if (!monitoringServiceInstance && prisma) {
    monitoringServiceInstance = new BrokerMonitoringService(prisma);
  }
  
  if (!monitoringServiceInstance) {
    throw new Error('BrokerMonitoringService not initialized. Call with PrismaClient first.');
  }
  
  return monitoringServiceInstance;
}