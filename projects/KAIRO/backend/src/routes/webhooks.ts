import express from 'express';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { io } from '../server';

const router = express.Router();

// Middleware to capture raw body for webhook signature verification
const rawBodyMiddleware = express.raw({ type: 'application/json' });

// Stripe webhook events interface
interface StripeWebhookEvent {
  id: string;
  object: 'event';
  type: string;
  data: {
    object: any;
    previous_attributes?: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string;
    idempotency_key?: string;
  };
}

// Payment automation rules interface
interface PaymentAutomationRule {
  id: string;
  eventType: string;
  conditions: Record<string, any>;
  actions: {
    type: 'retry_payment' | 'send_notification' | 'update_subscription' | 'trigger_workflow';
    parameters: Record<string, any>;
  }[];
  isActive: boolean;
}

// Mock automation rules - in production, these would be stored in database
const automationRules: PaymentAutomationRule[] = [
  {
    id: 'rule_1',
    eventType: 'invoice.payment_failed',
    conditions: { attempt_count: { $lt: 3 } },
    actions: [
      {
        type: 'retry_payment',
        parameters: { delay_hours: 24, max_retries: 3 }
      },
      {
        type: 'send_notification',
        parameters: { type: 'email', template: 'payment_failed' }
      }
    ],
    isActive: true
  },
  {
    id: 'rule_2',
    eventType: 'customer.subscription.deleted',
    conditions: {},
    actions: [
      {
        type: 'trigger_workflow',
        parameters: { workflow_id: 'subscription_cancellation_flow' }
      },
      {
        type: 'send_notification',
        parameters: { type: 'webhook', url: process.env.INTERNAL_WEBHOOK_URL }
      }
    ],
    isActive: true
  },
  {
    id: 'rule_3',
    eventType: 'invoice.payment_succeeded',
    conditions: {},
    actions: [
      {
        type: 'update_subscription',
        parameters: { status: 'active' }
      },
      {
        type: 'trigger_workflow',
        parameters: { workflow_id: 'payment_success_flow' }
      }
    ],
    isActive: true
  }
];

// Webhook event logging
interface WebhookLog {
  id: string;
  provider: 'stripe' | 'paypal';
  eventType: string;
  eventId: string;
  status: 'received' | 'processed' | 'failed';
  timestamp: Date;
  payload: any;
  error?: string;
  automationRulesTriggered: string[];
}

const webhookLogs: WebhookLog[] = [];

// Verify Stripe webhook signature
function verifyStripeSignature(payload: Buffer, signature: string, secret: string): boolean {
  try {
    const elements = signature.split(',');
    const signatureElements: Record<string, string> = {};
    
    for (const element of elements) {
      const [key, value] = element.split('=');
      signatureElements[key] = value;
    }
    
    const timestamp = signatureElements.t;
    const expectedSignature = signatureElements.v1;
    
    if (!timestamp || !expectedSignature) {
      return false;
    }
    
    // Create expected signature
    const payloadForSignature = timestamp + '.' + payload.toString();
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payloadForSignature)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  } catch (error) {
    logger.error('Error verifying Stripe signature:', error);
    return false;
  }
}

// Process automation rules for an event
async function processAutomationRules(event: StripeWebhookEvent): Promise<string[]> {
  const triggeredRules: string[] = [];
  
  for (const rule of automationRules) {
    if (!rule.isActive || rule.eventType !== event.type) {
      continue;
    }
    
    // Check if conditions are met
    const conditionsMet = checkConditions(rule.conditions, event.data.object);
    
    if (conditionsMet) {
      triggeredRules.push(rule.id);
      
      // Execute actions
      for (const action of rule.actions) {
        try {
          await executeAction(action, event);
          logger.info(`Executed action ${action.type} for rule ${rule.id}`);
        } catch (error) {
          logger.error(`Failed to execute action ${action.type} for rule ${rule.id}:`, error);
        }
      }
    }
  }
  
  return triggeredRules;
}

// Check if conditions are met
function checkConditions(conditions: Record<string, any>, eventObject: any): boolean {
  for (const [key, condition] of Object.entries(conditions)) {
    const value = getNestedValue(eventObject, key);
    
    if (typeof condition === 'object' && condition !== null) {
      // Handle operators like $lt, $gt, $eq, etc.
      for (const [operator, expectedValue] of Object.entries(condition)) {
        switch (operator) {
          case '$lt':
            if (!(value < expectedValue)) return false;
            break;
          case '$gt':
            if (!(value > expectedValue)) return false;
            break;
          case '$eq':
            if (value !== expectedValue) return false;
            break;
          case '$ne':
            if (value === expectedValue) return false;
            break;
          case '$in':
            if (!Array.isArray(expectedValue) || !expectedValue.includes(value)) return false;
            break;
          default:
            return false;
        }
      }
    } else {
      // Direct value comparison
      if (value !== condition) return false;
    }
  }
  
  return true;
}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Execute automation action
async function executeAction(action: PaymentAutomationRule['actions'][0], event: StripeWebhookEvent): Promise<void> {
  switch (action.type) {
    case 'retry_payment':
      await retryPayment(event, action.parameters);
      break;
    case 'send_notification':
      await sendNotification(event, action.parameters);
      break;
    case 'update_subscription':
      await updateSubscription(event, action.parameters);
      break;
    case 'trigger_workflow':
      await triggerWorkflow(event, action.parameters);
      break;
    default:
      logger.warn(`Unknown action type: ${action.type}`);
  }
}

// Action implementations
async function retryPayment(event: StripeWebhookEvent, parameters: Record<string, any>): Promise<void> {
  logger.info(`Scheduling payment retry for invoice ${event.data.object.id}`);
  // Implementation would integrate with Stripe API to retry payment
  // For now, just log the action
}

async function sendNotification(event: StripeWebhookEvent, parameters: Record<string, any>): Promise<void> {
  logger.info(`Sending ${parameters.type} notification for event ${event.type}`);
  
  if (parameters.type === 'webhook' && parameters.url) {
    try {
      const response = await fetch(parameters.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, timestamp: new Date().toISOString() })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook notification failed: ${response.status}`);
      }
    } catch (error) {
      logger.error('Failed to send webhook notification:', error);
    }
  }
}

async function updateSubscription(event: StripeWebhookEvent, parameters: Record<string, any>): Promise<void> {
  logger.info(`Updating subscription status to ${parameters.status}`);
  // Implementation would update subscription in database
}

async function triggerWorkflow(event: StripeWebhookEvent, parameters: Record<string, any>): Promise<void> {
  logger.info(`Triggering workflow ${parameters.workflow_id}`);
  
  // Emit workflow trigger event via WebSocket
  io.emit('workflow:trigger', {
    workflowId: parameters.workflow_id,
    trigger: 'payment_event',
    data: {
      eventType: event.type,
      eventId: event.id,
      objectId: event.data.object.id,
      timestamp: new Date(event.created * 1000).toISOString()
    }
  });
}

// POST /api/webhooks/stripe - Handle Stripe webhook events
router.post('/stripe', rawBodyMiddleware, async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      logger.error('Stripe webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    if (!signature) {
      logger.error('Missing Stripe signature header');
      return res.status(400).json({ error: 'Missing signature header' });
    }
    
    // Verify webhook signature
    const isValid = verifyStripeSignature(req.body, signature, webhookSecret);
    
    if (!isValid) {
      logger.error('Invalid Stripe webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Parse event
    const event: StripeWebhookEvent = JSON.parse(req.body.toString());
    
    logger.info(`Received Stripe webhook: ${event.type} (${event.id})`);
    
    // Process automation rules
    const triggeredRules = await processAutomationRules(event);
    
    // Log webhook event
    const webhookLog: WebhookLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'stripe',
      eventType: event.type,
      eventId: event.id,
      status: 'processed',
      timestamp: new Date(),
      payload: event,
      automationRulesTriggered: triggeredRules
    };
    
    webhookLogs.push(webhookLog);
    
    // Broadcast event to connected clients
    io.emit('payment:event', {
      type: event.type,
      id: event.id,
      timestamp: new Date(event.created * 1000).toISOString(),
      automationRulesTriggered: triggeredRules
    });
    
    res.status(200).json({ 
      received: true, 
      eventId: event.id,
      automationRulesTriggered: triggeredRules
    });
    
  } catch (error) {
    logger.error('Error processing Stripe webhook:', error);
    
    // Log failed webhook
    const webhookLog: WebhookLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'stripe',
      eventType: 'unknown',
      eventId: 'unknown',
      status: 'failed',
      timestamp: new Date(),
      payload: req.body,
      error: error instanceof Error ? error.message : 'Unknown error',
      automationRulesTriggered: []
    };
    
    webhookLogs.push(webhookLog);
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/webhooks/paypal - Handle PayPal webhook events
router.post('/paypal', express.json(), async (req: Request, res: Response) => {
  try {
    const event = req.body;
    
    logger.info(`Received PayPal webhook: ${event.event_type} (${event.id})`);
    
    // Log webhook event
    const webhookLog: WebhookLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'paypal',
      eventType: event.event_type,
      eventId: event.id,
      status: 'processed',
      timestamp: new Date(),
      payload: event,
      automationRulesTriggered: []
    };
    
    webhookLogs.push(webhookLog);
    
    // Broadcast event to connected clients
    io.emit('payment:event', {
      type: event.event_type,
      id: event.id,
      timestamp: new Date().toISOString(),
      provider: 'paypal'
    });
    
    res.status(200).json({ received: true, eventId: event.id });
    
  } catch (error) {
    logger.error('Error processing PayPal webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/webhooks/logs - Get webhook logs
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const { provider, eventType, status, limit = 50 } = req.query;
    
    let filteredLogs = webhookLogs;
    
    if (provider) {
      filteredLogs = filteredLogs.filter(log => log.provider === provider);
    }
    
    if (eventType) {
      filteredLogs = filteredLogs.filter(log => log.eventType === eventType);
    }
    
    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }
    
    // Sort by timestamp (newest first) and limit results
    const sortedLogs = filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, Number(limit));
    
    res.json({ 
      success: true, 
      data: sortedLogs,
      total: filteredLogs.length
    });
    
  } catch (error) {
    logger.error('Error fetching webhook logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/webhooks/automation-rules - Get automation rules
router.get('/automation-rules', async (req: Request, res: Response) => {
  try {
    res.json({ 
      success: true, 
      data: automationRules
    });
  } catch (error) {
    logger.error('Error fetching automation rules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/webhooks/automation-rules - Create automation rule
router.post('/automation-rules', express.json(), async (req: Request, res: Response) => {
  try {
    const { eventType, conditions, actions, isActive = true } = req.body;
    
    const newRule: PaymentAutomationRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      conditions,
      actions,
      isActive
    };
    
    automationRules.push(newRule);
    
    logger.info(`Created new automation rule: ${newRule.id}`);
    
    res.status(201).json({ 
      success: true, 
      data: newRule
    });
    
  } catch (error) {
    logger.error('Error creating automation rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/webhooks/automation-rules/:ruleId - Update automation rule
router.put('/automation-rules/:ruleId', express.json(), async (req: Request, res: Response) => {
  try {
    const { ruleId } = req.params;
    const updates = req.body;
    
    const ruleIndex = automationRules.findIndex(rule => rule.id === ruleId);
    
    if (ruleIndex === -1) {
      return res.status(404).json({ error: 'Automation rule not found' });
    }
    
    automationRules[ruleIndex] = { ...automationRules[ruleIndex], ...updates };
    
    logger.info(`Updated automation rule: ${ruleId}`);
    
    res.json({ 
      success: true, 
      data: automationRules[ruleIndex]
    });
    
  } catch (error) {
    logger.error('Error updating automation rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/webhooks/automation-rules/:ruleId - Delete automation rule
router.delete('/automation-rules/:ruleId', async (req: Request, res: Response) => {
  try {
    const { ruleId } = req.params;
    
    const ruleIndex = automationRules.findIndex(rule => rule.id === ruleId);
    
    if (ruleIndex === -1) {
      return res.status(404).json({ error: 'Automation rule not found' });
    }
    
    automationRules.splice(ruleIndex, 1);
    
    logger.info(`Deleted automation rule: ${ruleId}`);
    
    res.json({ 
      success: true, 
      message: 'Automation rule deleted'
    });
    
  } catch (error) {
    logger.error('Error deleting automation rule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;