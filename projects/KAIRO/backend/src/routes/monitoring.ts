import express from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { getBrokerMonitoringService } from '../services/BrokerMonitoringService';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Get monitoring status for all user's broker connections
 */
router.get('/status', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const monitoringService = getBrokerMonitoringService(prisma);
    const connectionsHealth = monitoringService.getConnectionsHealth();
    
    // Filter to only user's connections
    const userConnections = await prisma.brokerConnection.findMany({
      where: { userId: req.user.id },
      select: { id: true }
    });
    
    const userConnectionIds = new Set(userConnections.map(c => c.id));
    const userConnectionsHealth = connectionsHealth.filter(h => 
      userConnectionIds.has(h.connectionId)
    );
    
    res.json({
      success: true,
      data: {
        connections: userConnectionsHealth,
        stats: {
          total: userConnectionsHealth.length,
          healthy: userConnectionsHealth.filter(c => c.isHealthy).length,
          unhealthy: userConnectionsHealth.filter(c => !c.isHealthy).length
        }
      }
    });
  } catch (error) {
    logger.error('Error getting monitoring status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get monitoring status'
    });
  }
});

/**
 * Get monitoring status for a specific connection
 */
router.get('/status/:connectionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify user owns this connection
    const connection = await prisma.brokerConnection.findFirst({
      where: {
        id: connectionId,
        userId: req.user.id
      }
    });
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    const monitoringService = getBrokerMonitoringService(prisma);
    const health = monitoringService.getConnectionHealth(connectionId);
    
    if (!health) {
      return res.status(404).json({
        success: false,
        error: 'Connection not being monitored'
      });
    }
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Error getting connection monitoring status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get connection monitoring status'
    });
  }
});

/**
 * Force a health check for a specific connection
 */
router.post('/check/:connectionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify user owns this connection
    const connection = await prisma.brokerConnection.findFirst({
      where: {
        id: connectionId,
        userId: req.user.id
      }
    });
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    const monitoringService = getBrokerMonitoringService(prisma);
    const health = await monitoringService.forceHealthCheck(connectionId);
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Error forcing health check:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform health check'
    });
  }
});

/**
 * Start monitoring for a specific connection
 */
router.post('/start/:connectionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify user owns this connection
    const connection = await prisma.brokerConnection.findFirst({
      where: {
        id: connectionId,
        userId: req.user.id,
        isActive: true
      }
    });
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Active connection not found'
      });
    }
    
    const monitoringService = getBrokerMonitoringService(prisma);
    monitoringService.startConnectionMonitoring(connectionId);
    
    res.json({
      success: true,
      message: 'Monitoring started for connection'
    });
  } catch (error) {
    logger.error('Error starting monitoring:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start monitoring'
    });
  }
});

/**
 * Stop monitoring for a specific connection
 */
router.post('/stop/:connectionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { connectionId } = req.params;
    
    // Verify user owns this connection
    const connection = await prisma.brokerConnection.findFirst({
      where: {
        id: connectionId,
        userId: req.user.id
      }
    });
    
    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found'
      });
    }
    
    const monitoringService = getBrokerMonitoringService(prisma);
    monitoringService.stopConnectionMonitoring(connectionId);
    
    res.json({
      success: true,
      message: 'Monitoring stopped for connection'
    });
  } catch (error) {
    logger.error('Error stopping monitoring:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop monitoring'
    });
  }
});

/**
 * Get overall monitoring statistics
 */
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const monitoringService = getBrokerMonitoringService(prisma);
    const stats = monitoringService.getMonitoringStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting monitoring stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get monitoring statistics'
    });
  }
});

export default router;