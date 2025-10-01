const crypto = require('crypto');

// Test webhook endpoints
const BASE_URL = 'http://localhost:3002';
const STRIPE_WEBHOOK_SECRET = 'whsec_test_secret'; // This would be your actual Stripe webhook secret

// Create a test Stripe webhook signature
function createStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');
  
  return {
    signature: `t=${timestamp},v1=${signature}`,
    timestamp,
    payloadString
  };
}

// Test Stripe webhook endpoint
async function testStripeWebhook() {
  console.log('\n🧪 Testing Stripe Webhook Endpoint...');
  
  const testPayload = {
    id: 'evt_test_webhook',
    object: 'event',
    api_version: '2020-08-27',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'in_test_invoice',
        object: 'invoice',
        amount_paid: 0,
        amount_remaining: 2000,
        attempt_count: 1,
        customer: 'cus_test_customer',
        subscription: 'sub_test_subscription',
        status: 'open'
      }
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: 'req_test_request',
      idempotency_key: null
    },
    type: 'invoice.payment_failed'
  };
  
  const { signature, payloadString } = createStripeSignature(testPayload, STRIPE_WEBHOOK_SECRET);
  
  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': signature
      },
      body: payloadString
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Stripe webhook test passed');
      console.log('📊 Response:', result);
    } else {
      console.log('❌ Stripe webhook test failed');
      console.log('📊 Response:', result);
    }
  } catch (error) {
    console.log('❌ Stripe webhook test error:', error.message);
  }
}

// Test PayPal webhook endpoint
async function testPayPalWebhook() {
  console.log('\n🧪 Testing PayPal Webhook Endpoint...');
  
  const testPayload = {
    id: 'WH-test-event-id',
    event_version: '1.0',
    create_time: new Date().toISOString(),
    resource_type: 'sale',
    event_type: 'PAYMENT.SALE.COMPLETED',
    summary: 'Payment completed for $ 10.00 USD',
    resource: {
      id: 'PAY-test-payment-id',
      state: 'completed',
      amount: {
        total: '10.00',
        currency: 'USD'
      },
      parent_payment: 'PAYID-test-parent-payment',
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString()
    }
  };
  
  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/paypal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYPAL-TRANSMISSION-ID': 'test-transmission-id',
        'PAYPAL-CERT-ID': 'test-cert-id',
        'PAYPAL-AUTH-ALGO': 'SHA256withRSA',
        'PAYPAL-TRANSMISSION-SIG': 'test-signature',
        'PAYPAL-TRANSMISSION-TIME': new Date().toISOString()
      },
      body: JSON.stringify(testPayload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ PayPal webhook test passed');
      console.log('📊 Response:', result);
    } else {
      console.log('❌ PayPal webhook test failed');
      console.log('📊 Response:', result);
    }
  } catch (error) {
    console.log('❌ PayPal webhook test error:', error.message);
  }
}

// Test automation rules endpoint
async function testAutomationRules() {
  console.log('\n🧪 Testing Automation Rules Endpoint...');
  
  const testRule = {
    eventType: 'invoice.payment_failed',
    conditions: {
      attempt_count: { $lt: 3 }
    },
    actions: [
      {
        type: 'retry_payment',
        parameters: {
          delay_hours: 24,
          max_retries: 3
        }
      },
      {
        type: 'send_notification',
        parameters: {
          email: true,
          webhook_url: 'https://example.com/webhook'
        }
      }
    ],
    isActive: true
  };
  
  try {
    // Test creating a rule
    const createResponse = await fetch(`${BASE_URL}/api/webhooks/automation-rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRule)
    });
    
    const createResult = await createResponse.json();
    
    if (createResponse.ok) {
      console.log('✅ Create automation rule test passed');
      console.log('📊 Created rule:', createResult.data);
      
      // Test getting rules
      const getResponse = await fetch(`${BASE_URL}/api/webhooks/automation-rules`);
      const getRules = await getResponse.json();
      
      if (getResponse.ok) {
        console.log('✅ Get automation rules test passed');
        console.log('📊 Rules count:', getRules.data.length);
      } else {
        console.log('❌ Get automation rules test failed');
      }
      
    } else {
      console.log('❌ Create automation rule test failed');
      console.log('📊 Response:', createResult);
    }
  } catch (error) {
    console.log('❌ Automation rules test error:', error.message);
  }
}

// Test webhook logs endpoint
async function testWebhookLogs() {
  console.log('\n🧪 Testing Webhook Logs Endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/logs?limit=10`);
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Webhook logs test passed');
      console.log('📊 Logs count:', result.data.length);
    } else {
      console.log('❌ Webhook logs test failed');
      console.log('📊 Response:', result);
    }
  } catch (error) {
    console.log('❌ Webhook logs test error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Webhook Automation Tests...');
  console.log('🔗 Testing against:', BASE_URL);
  
  await testStripeWebhook();
  await testPayPalWebhook();
  await testAutomationRules();
  await testWebhookLogs();
  
  console.log('\n✨ All tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Configure actual webhook secrets in environment variables');
  console.log('2. Set up webhook endpoints in Stripe and PayPal dashboards');
  console.log('3. Test with real webhook events from payment providers');
  console.log('4. Monitor webhook logs in the frontend dashboard');
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Backend is running');
      return true;
    }
  } catch (error) {
    console.log('❌ Backend is not running. Please start the backend server first.');
    console.log('💡 Run: cd backend && npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const backendRunning = await checkBackend();
  if (backendRunning) {
    await runTests();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testStripeWebhook,
  testPayPalWebhook,
  testAutomationRules,
  testWebhookLogs
};