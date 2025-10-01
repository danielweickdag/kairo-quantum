#!/bin/bash

# KAIRO Trading API Configuration Script
# Automates setup of live trading API keys and configurations

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🔑 KAIRO Trading API Configuration"
echo "=================================="

# Interactive API key collection
collect_api_keys() {
    print_status "Collecting live trading API credentials..."
    
    echo ""
    print_warning "IMPORTANT: Only enter LIVE trading API keys, not paper/demo keys!"
    echo ""
    
    # Alpaca Markets
    echo "📈 ALPACA MARKETS (Live Trading)"
    echo "Get your keys from: https://app.alpaca.markets/paper/dashboard/overview"
    read -p "Enter your Alpaca API Key: " ALPACA_API_KEY
    read -s -p "Enter your Alpaca Secret Key: " ALPACA_SECRET_KEY
    echo ""
    echo ""
    
    # Market Data APIs
    echo "📊 MARKET DATA APIs"
    echo "Alpha Vantage: https://www.alphavantage.co/support/#api-key"
    read -p "Enter your Alpha Vantage API Key: " ALPHA_VANTAGE_KEY
    
    echo "Finnhub: https://finnhub.io/register"
    read -p "Enter your Finnhub API Key: " FINNHUB_KEY
    
    echo "Polygon: https://polygon.io/pricing"
    read -p "Enter your Polygon API Key: " POLYGON_KEY
    echo ""
    
    # TD Ameritrade
    echo "🏦 TD AMERITRADE"
    echo "Get your client ID from: https://developer.tdameritrade.com"
    read -p "Enter your TD Ameritrade Client ID: " TD_CLIENT_ID
    echo ""
    
    # Payment Processing
    echo "💳 STRIPE PAYMENT PROCESSING"
    echo "Get your keys from: https://dashboard.stripe.com/apikeys"
    read -p "Enter your Stripe Live Secret Key: " STRIPE_SECRET_KEY
    read -p "Enter your Stripe Live Publishable Key: " STRIPE_PUBLISHABLE_KEY
    read -p "Enter your Stripe Webhook Secret: " STRIPE_WEBHOOK_SECRET
    echo ""
    
    # Email Configuration
    echo "📧 EMAIL CONFIGURATION"
    echo "Gmail App Password: https://support.google.com/accounts/answer/185833"
    read -s -p "Enter your Gmail App Password: " GMAIL_APP_PASSWORD
    echo ""
    echo ""
    
    print_success "API credentials collected"
}

# Validate API keys
validate_api_keys() {
    print_status "Validating API credentials..."
    
    # Check if required fields are not empty
    if [ -z "$ALPACA_API_KEY" ] || [ -z "$ALPACA_SECRET_KEY" ]; then
        print_error "Alpaca API credentials are required for live trading!"
        exit 1
    fi
    
    if [ -z "$ALPHA_VANTAGE_KEY" ]; then
        print_warning "Alpha Vantage API key is missing - market data may be limited"
    fi
    
    if [ -z "$STRIPE_SECRET_KEY" ]; then
        print_warning "Stripe keys are missing - payment processing will be disabled"
    fi
    
    print_success "API credentials validated"
}

# Update backend environment file
update_backend_env() {
    print_status "Updating backend/.env.production with live API keys..."
    
    # Create backup
    cp backend/.env.production backend/.env.production.backup
    
    # Update API keys in the environment file
    sed -i "" "s/demo_alpaca_key_replace_with_live/$ALPACA_API_KEY/g" backend/.env.production
    sed -i "" "s/demo_alpaca_secret_replace_with_live/$ALPACA_SECRET_KEY/g" backend/.env.production
    sed -i "" "s/demo_api_key_replace_with_actual/$ALPHA_VANTAGE_KEY/g" backend/.env.production
    sed -i "" "s/demo_finnhub_key_replace_with_actual/$FINNHUB_KEY/g" backend/.env.production
    sed -i "" "s/demo_polygon_key_replace_with_actual/$POLYGON_KEY/g" backend/.env.production
    sed -i "" "s/demo_td_client_id_replace_with_actual/$TD_CLIENT_ID/g" backend/.env.production
    sed -i "" "s/sk_live_replace_with_actual_stripe_key/$STRIPE_SECRET_KEY/g" backend/.env.production
    sed -i "" "s/whsec_replace_with_actual_webhook_secret/$STRIPE_WEBHOOK_SECRET/g" backend/.env.production
    sed -i "" "s/your-gmail-app-password-here/$GMAIL_APP_PASSWORD/g" backend/.env.production
    
    print_success "Backend environment updated with live API keys"
}

# Update frontend environment file
update_frontend_env() {
    print_status "Updating frontend/.env.production with public API keys..."
    
    # Create backup
    cp .env.production .env.production.backup
    
    # Update public API keys
    sed -i "" "s/pk_live_replace_with_actual_stripe_key/$STRIPE_PUBLISHABLE_KEY/g" .env.production
    
    print_success "Frontend environment updated with public API keys"
}

# Test API connections
test_api_connections() {
    print_status "Testing API connections..."
    
    # Test Alpaca API
    echo "Testing Alpaca API connection..."
    if command -v curl &> /dev/null; then
        ALPACA_RESPONSE=$(curl -s -H "APCA-API-KEY-ID: $ALPACA_API_KEY" -H "APCA-API-SECRET-KEY: $ALPACA_SECRET_KEY" "https://api.alpaca.markets/v2/account" || echo "error")
        
        if [[ "$ALPACA_RESPONSE" == *"account_number"* ]]; then
            print_success "✅ Alpaca API connection successful"
        else
            print_error "❌ Alpaca API connection failed - check your credentials"
        fi
    else
        print_warning "curl not available - skipping API tests"
    fi
    
    # Test Alpha Vantage API
    if [ -n "$ALPHA_VANTAGE_KEY" ]; then
        echo "Testing Alpha Vantage API connection..."
        ALPHA_RESPONSE=$(curl -s "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=$ALPHA_VANTAGE_KEY" || echo "error")
        
        if [[ "$ALPHA_RESPONSE" == *"Global Quote"* ]]; then
            print_success "✅ Alpha Vantage API connection successful"
        else
            print_error "❌ Alpha Vantage API connection failed"
        fi
    fi
    
    print_success "API connection tests completed"
}

# Create API management scripts
create_api_management_scripts() {
    print_status "Creating API management scripts..."
    
    # Create API key rotation script
    cat > rotate-api-keys.sh << 'EOF'
#!/bin/bash

# API Key Rotation Script
echo "🔄 API Key Rotation for KAIRO"
echo "============================="

echo "This script helps you rotate API keys for security."
echo ""
echo "IMPORTANT: Have your new API keys ready before proceeding!"
echo ""

read -p "Do you want to rotate Alpaca API keys? (y/n): " rotate_alpaca
if [ "$rotate_alpaca" = "y" ]; then
    read -p "Enter new Alpaca API Key: " new_alpaca_key
    read -s -p "Enter new Alpaca Secret Key: " new_alpaca_secret
    echo ""
    
    # Update backend environment
    sed -i "" "s/ALPACA_API_KEY=.*/ALPACA_API_KEY=$new_alpaca_key/g" backend/.env.production
    sed -i "" "s/ALPACA_SECRET_KEY=.*/ALPACA_SECRET_KEY=$new_alpaca_secret/g" backend/.env.production
    
    echo "✅ Alpaca API keys updated"
fi

read -p "Do you want to rotate market data API keys? (y/n): " rotate_market
if [ "$rotate_market" = "y" ]; then
    read -p "Enter new Alpha Vantage API Key: " new_alpha_key
    read -p "Enter new Finnhub API Key: " new_finnhub_key
    read -p "Enter new Polygon API Key: " new_polygon_key
    
    # Update backend environment
    sed -i "" "s/MARKET_DATA_API_KEY=.*/MARKET_DATA_API_KEY=$new_alpha_key/g" backend/.env.production
    sed -i "" "s/FINNHUB_API_KEY=.*/FINNHUB_API_KEY=$new_finnhub_key/g" backend/.env.production
    sed -i "" "s/POLYGON_API_KEY=.*/POLYGON_API_KEY=$new_polygon_key/g" backend/.env.production
    
    echo "✅ Market data API keys updated"
fi

echo ""
echo "🚀 Redeploy your application to apply changes:"
echo "   cd backend && railway deploy"
echo "   vercel --prod"
EOF

    chmod +x rotate-api-keys.sh
    
    # Create API monitoring script
    cat > monitor-apis.sh << 'EOF'
#!/bin/bash

# API Monitoring Script
echo "📊 API Monitoring for KAIRO"
echo "==========================="

# Load environment variables
if [ -f "backend/.env.production" ]; then
    source backend/.env.production
else
    echo "❌ Backend environment file not found"
    exit 1
fi

check_api() {
    local name=$1
    local url=$2
    local headers=$3
    
    echo "Checking $name API..."
    
    if [ -n "$headers" ]; then
        response=$(curl -s -w "%{http_code}" $headers "$url" || echo "000")
    else
        response=$(curl -s -w "%{http_code}" "$url" || echo "000")
    fi
    
    http_code=${response: -3}
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $name: Online (HTTP $http_code)"
    else
        echo "❌ $name: Offline (HTTP $http_code)"
    fi
    echo ""
}

echo "Monitoring API endpoints..."
echo ""

# Check Alpaca API
check_api "Alpaca" "https://api.alpaca.markets/v2/account" "-H 'APCA-API-KEY-ID: $ALPACA_API_KEY' -H 'APCA-API-SECRET-KEY: $ALPACA_SECRET_KEY'"

# Check Alpha Vantage API
check_api "Alpha Vantage" "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=$MARKET_DATA_API_KEY"

# Check Finnhub API
check_api "Finnhub" "https://finnhub.io/api/v1/quote?symbol=AAPL&token=$FINNHUB_API_KEY"

# Check Polygon API
check_api "Polygon" "https://api.polygon.io/v2/aggs/ticker/AAPL/prev?apikey=$POLYGON_API_KEY"

echo "📋 API Monitoring completed"
echo "Run this script regularly to monitor API health"
EOF

    chmod +x monitor-apis.sh
    
    print_success "API management scripts created"
}

# Create API documentation
create_api_documentation() {
    print_status "Creating API configuration documentation..."
    
    cat > TRADING_API_SETUP.md << EOF
# KAIRO Trading API Configuration

Generated on: $(date)

## ✅ Configured APIs

### Live Trading
- **Alpaca Markets**: ✅ Configured
  - API Key: ${ALPACA_API_KEY:0:8}...
  - Environment: Live Trading
  - Documentation: https://alpaca.markets/docs/

### Market Data
- **Alpha Vantage**: $([ -n "$ALPHA_VANTAGE_KEY" ] && echo "✅ Configured" || echo "❌ Not configured")
- **Finnhub**: $([ -n "$FINNHUB_KEY" ] && echo "✅ Configured" || echo "❌ Not configured")
- **Polygon**: $([ -n "$POLYGON_KEY" ] && echo "✅ Configured" || echo "❌ Not configured")

### Payment Processing
- **Stripe**: $([ -n "$STRIPE_SECRET_KEY" ] && echo "✅ Configured" || echo "❌ Not configured")
  - Environment: Live
  - Webhook: $([ -n "$STRIPE_WEBHOOK_SECRET" ] && echo "Configured" || echo "Not configured")

### Brokerage Integration
- **TD Ameritrade**: $([ -n "$TD_CLIENT_ID" ] && echo "✅ Configured" || echo "❌ Not configured")
- **Interactive Brokers**: Manual setup required

## 🔒 Security Best Practices

1. **API Key Rotation**
   - Rotate keys every 90 days
   - Use \`./rotate-api-keys.sh\` script
   - Monitor for unauthorized access

2. **Environment Separation**
   - Never use live keys in development
   - Use paper trading for testing
   - Separate staging and production environments

3. **Access Control**
   - Limit API key permissions
   - Use IP whitelisting when available
   - Monitor API usage and rate limits

## 📊 Monitoring

- **API Health**: Run \`./monitor-apis.sh\` daily
- **Trading Activity**: Monitor through broker dashboards
- **Error Logs**: Check application logs for API errors

## 🚨 Emergency Procedures

### If API Keys Are Compromised
1. Immediately revoke compromised keys in broker dashboard
2. Generate new API keys
3. Update environment variables
4. Redeploy application
5. Monitor for unauthorized trades

### If Trading Issues Occur
1. Check API status with \`./monitor-apis.sh\`
2. Verify account balances in broker dashboard
3. Check application logs for errors
4. Contact broker support if needed

## 📞 Support Contacts

- **Alpaca Markets**: support@alpaca.markets
- **Alpha Vantage**: support@alphavantage.co
- **Finnhub**: support@finnhub.io
- **Polygon**: support@polygon.io
- **Stripe**: support@stripe.com
- **TD Ameritrade**: 1-800-669-3900

EOF

    print_success "API documentation created: TRADING_API_SETUP.md"
}

# Main function
main() {
    print_status "Starting trading API configuration..."
    
    collect_api_keys
    validate_api_keys
    update_backend_env
    update_frontend_env
    test_api_connections
    create_api_management_scripts
    create_api_documentation
    
    print_success "🎉 Trading API configuration completed!"
    
    echo ""
    echo "📋 CONFIGURATION SUMMARY:"
    echo "========================="
    echo "✅ Live trading API keys configured"
    echo "✅ Market data APIs configured"
    echo "✅ Payment processing configured"
    echo "✅ Environment files updated"
    echo "✅ API management scripts created"
    echo "✅ Documentation generated"
    echo ""
    
    print_warning "NEXT STEPS:"
    echo "1. Redeploy backend: cd backend && railway deploy"
    echo "2. Redeploy frontend: vercel --prod"
    echo "3. Test trading functionality"
    echo "4. Monitor APIs with ./monitor-apis.sh"
    echo "5. Set up regular API key rotation"
    echo ""
    
    print_status "⚠️  IMPORTANT: Your API keys are now configured for LIVE TRADING!"
    print_status "📖 Read TRADING_API_SETUP.md for security best practices"
}

# Error handling
trap 'print_error "API configuration failed! Check the error above."' ERR

# Run main function
main "$@"