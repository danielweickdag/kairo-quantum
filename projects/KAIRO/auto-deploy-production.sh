#!/bin/bash

# KAIRO Automated Production Deployment Script
# This script automates the entire production deployment process

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

echo "🚀 KAIRO Automated Production Deployment"
echo "========================================"

# Step 1: Replace placeholder values with actual production credentials
auto_configure_credentials() {
    print_status "Step 1: Configuring production credentials..."
    
    # Generate secure database password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Generate secure Redis password
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Generate secure SMTP password (placeholder - user needs to set actual)
    SMTP_PASSWORD="your-gmail-app-password-here"
    
    print_status "Updating backend/.env.production with production values..."
    
    # Create temporary file with production values
    cat > backend/.env.production.tmp << EOF
#!/bin/bash
# Production Environment Variables for Backend

# Database Configuration (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@containers-us-west-xxx.railway.app:5432/railway"

# Server Configuration
PORT=3002
NODE_ENV=production

# JWT Configuration (already configured with secure secrets)
JWT_SECRET=94cd191414432e825aed01dbe69b4da361eacc84b91a4cf7dab4a0a316cb36c229dfe427e9d93a403b073c065d41f5f8334800eeb6f2f4182e01bcd14da3ec92
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=4053868426b9fcbd3b6c9b4728ea74092e45c0b52587d1ec2cc1ed61b98fdbeff7b72a74ce6418e8cd93335512ab70b14bfc81e539a7ad72520ecd61958676fe
JWT_REFRESH_EXPIRES_IN=30d

# Redis Configuration (Railway Redis)
REDIS_URL="redis://default:${REDIS_PASSWORD}@containers-us-west-xxx.railway.app:6379"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kairoquantum.com
SMTP_PASS=${SMTP_PASSWORD}
FROM_EMAIL=noreply@kairoquantum.com

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Market Data API Configuration
MARKET_DATA_API_KEY=demo_api_key_replace_with_actual
MARKET_DATA_BASE_URL=https://www.alphavantage.co/query
FINNHUB_API_KEY=demo_finnhub_key_replace_with_actual
POLYGON_API_KEY=demo_polygon_key_replace_with_actual

# WebSocket Configuration
WS_PORT=3003

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Configuration
CORS_ORIGIN=https://www.kairoquantum.com

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/production.log

# Trading Broker APIs
# Alpaca Live Trading
ALPACA_API_KEY=demo_alpaca_key_replace_with_live
ALPACA_SECRET_KEY=demo_alpaca_secret_replace_with_live
ALPACA_BASE_URL=https://api.alpaca.markets

# Interactive Brokers
IB_HOST=127.0.0.1
IB_PORT=7497
IB_CLIENT_ID=1

# TD Ameritrade
TD_AMERITRADE_CLIENT_ID=demo_td_client_id_replace_with_actual
TD_AMERITRADE_REDIRECT_URI=https://api.kairoquantum.com/auth/td/callback

# Payment Processing
STRIPE_SECRET_KEY=sk_live_replace_with_actual_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_replace_with_actual_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_replace_with_actual_webhook_secret

# Security
ENCRYPTION_KEY=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)

# Monitoring
SENTRY_DSN=https://your-sentry-dsn-here
NEW_RELIC_LICENSE_KEY=your-new-relic-key-here

# External APIs
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Webhooks
WEBHOOK_SECRET=$(openssl rand -hex 32)

# Feature Flags
ENABLE_LIVE_TRADING=true
ENABLE_PAPER_TRADING=true
ENABLE_NOTIFICATIONS=true
ENABLE_ANALYTICS=true
EOF

    # Replace the original file
    mv backend/.env.production.tmp backend/.env.production
    
    print_success "Production credentials configured with secure values"
    print_warning "IMPORTANT: You still need to replace demo API keys with actual ones:"
    echo "  - Alpaca API keys (for live trading)"
    echo "  - Market data API keys (Alpha Vantage, Finnhub, Polygon)"
    echo "  - Stripe payment keys"
    echo "  - Gmail SMTP password"
}

# Step 2: Deploy backend to hosting platform
auto_deploy_backend() {
    print_status "Step 2: Deploying backend to production..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    cd backend
    
    # Build the backend
    print_status "Building backend application..."
    npm install
    npx prisma generate
    npm run build
    
    # Deploy to Railway
    print_status "Deploying to Railway..."
    railway login
    railway deploy
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate deploy
    
    cd ..
    
    print_success "Backend deployed successfully"
}

# Step 3: Deploy frontend to Vercel with custom domain
auto_deploy_frontend() {
    print_status "Step 3: Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Build the frontend
    print_status "Building frontend application..."
    npm install
    npm run build
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel login
    vercel --prod
    
    print_success "Frontend deployed successfully"
    print_warning "NEXT STEP: Add custom domain in Vercel dashboard:"
    echo "  1. Go to Vercel Dashboard → Your Project → Settings → Domains"
    echo "  2. Add: www.kairoquantum.com"
    echo "  3. Follow Vercel's DNS configuration instructions"
}

# Step 4: Configure DNS automatically
auto_configure_dns() {
    print_status "Step 4: DNS Configuration Guide..."
    
    print_warning "DNS records need to be configured in your domain registrar:"
    
    echo ""
    echo "Required DNS Records for kairoquantum.com:"
    echo "==========================================="
    echo "Type    Name    Value"
    echo "A       @       [Vercel-IP-Address]"
    echo "CNAME   www     cname.vercel-dns.com"
    echo "CNAME   api     [your-railway-app].up.railway.app"
    echo ""
    
    print_status "Creating DNS configuration script..."
    
    cat > configure-dns.sh << 'EOF'
#!/bin/bash

# DNS Configuration Script for kairoquantum.com
# Run this after getting your actual deployment URLs

echo "🌐 DNS Configuration for kairoquantum.com"
echo "========================================="

echo "1. Get your Vercel deployment URL from: vercel ls"
echo "2. Get your Railway backend URL from: railway status"
echo "3. Configure these DNS records in your domain registrar:"
echo ""
echo "A       @       [Vercel-IP-Address]"
echo "CNAME   www     cname.vercel-dns.com"
echo "CNAME   api     [your-railway-app].up.railway.app"
echo ""
echo "4. Wait 24-48 hours for DNS propagation"
echo "5. Verify with: dig www.kairoquantum.com"
EOF

    chmod +x configure-dns.sh
    
    print_success "DNS configuration guide created: ./configure-dns.sh"
}

# Step 5: Set up live trading API keys
auto_setup_trading_apis() {
    print_status "Step 5: Trading API Configuration..."
    
    print_warning "Live Trading API Setup Required:"
    
    echo ""
    echo "1. ALPACA MARKETS (Live Trading)"
    echo "   - Sign up at: https://alpaca.markets"
    echo "   - Generate live API keys (not paper trading)"
    echo "   - Replace in backend/.env.production:"
    echo "     ALPACA_API_KEY=your-live-key"
    echo "     ALPACA_SECRET_KEY=your-live-secret"
    echo ""
    
    echo "2. INTERACTIVE BROKERS"
    echo "   - Download TWS (Trader Workstation)"
    echo "   - Enable API access in TWS settings"
    echo "   - Use port 7497 for live trading"
    echo ""
    
    echo "3. TD AMERITRADE"
    echo "   - Apply for API access at: https://developer.tdameritrade.com"
    echo "   - Get client ID and configure OAuth"
    echo ""
    
    echo "4. MARKET DATA APIs"
    echo "   - Alpha Vantage: https://www.alphavantage.co/support/#api-key"
    echo "   - Finnhub: https://finnhub.io/register"
    echo "   - Polygon: https://polygon.io/pricing"
    echo ""
    
    # Create API key replacement script
    cat > update-trading-apis.sh << 'EOF'
#!/bin/bash

# Trading API Key Update Script
# Run this script after obtaining your live trading API keys

echo "🔑 Updating Trading API Keys"
echo "============================"

read -p "Enter your live Alpaca API Key: " ALPACA_KEY
read -p "Enter your live Alpaca Secret Key: " ALPACA_SECRET
read -p "Enter your Alpha Vantage API Key: " ALPHA_VANTAGE_KEY
read -p "Enter your Finnhub API Key: " FINNHUB_KEY
read -p "Enter your Polygon API Key: " POLYGON_KEY
read -p "Enter your TD Ameritrade Client ID: " TD_CLIENT_ID

# Update the production environment file
sed -i "" "s/demo_alpaca_key_replace_with_live/$ALPACA_KEY/g" backend/.env.production
sed -i "" "s/demo_alpaca_secret_replace_with_live/$ALPACA_SECRET/g" backend/.env.production
sed -i "" "s/demo_api_key_replace_with_actual/$ALPHA_VANTAGE_KEY/g" backend/.env.production
sed -i "" "s/demo_finnhub_key_replace_with_actual/$FINNHUB_KEY/g" backend/.env.production
sed -i "" "s/demo_polygon_key_replace_with_actual/$POLYGON_KEY/g" backend/.env.production
sed -i "" "s/demo_td_client_id_replace_with_actual/$TD_CLIENT_ID/g" backend/.env.production

echo "✅ Trading API keys updated successfully!"
echo "🚀 Redeploy your backend to apply changes:"
echo "   cd backend && railway deploy"
EOF

    chmod +x update-trading-apis.sh
    
    print_success "Trading API setup guide created: ./update-trading-apis.sh"
}

# Main execution
main() {
    print_status "Starting automated production deployment..."
    
    # Execute all steps
    auto_configure_credentials
    auto_deploy_backend
    auto_deploy_frontend
    auto_configure_dns
    auto_setup_trading_apis
    
    print_success "🎉 Automated deployment completed!"
    
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Run ./update-trading-apis.sh to set live API keys"
    echo "2. Run ./configure-dns.sh for DNS setup instructions"
    echo "3. Configure custom domain in Vercel dashboard"
    echo "4. Test live trading functionality"
    echo "5. Monitor deployment at https://www.kairoquantum.com"
    echo ""
    
    print_warning "IMPORTANT: Replace demo API keys with actual production keys!"
}

# Run main function
main "$@"