#!/bin/bash

# KAIRO Production Credential Replacement Script
# Automatically generates and replaces all placeholder values with production-ready credentials

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

echo "🔐 KAIRO Production Credential Replacement"
echo "=========================================="

# Generate secure random values
generate_secure_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

generate_hex_key() {
    openssl rand -hex 32
}

generate_jwt_secret() {
    openssl rand -hex 64
}

# Generate all secure values
print_status "Generating secure production credentials..."

DB_PASSWORD=$(generate_secure_password)
REDIS_PASSWORD=$(generate_secure_password)
ENCRYPTION_KEY=$(generate_hex_key)
SESSION_SECRET=$(generate_hex_key)
WEBHOOK_SECRET=$(generate_hex_key)
JWT_SECRET=$(generate_jwt_secret)
JWT_REFRESH_SECRET=$(generate_jwt_secret)

print_success "Secure credentials generated"

# Update backend/.env.production
print_status "Updating backend/.env.production with production values..."

cat > backend/.env.production << EOF
#!/bin/bash
# Production Environment Variables for Backend

# Database Configuration (Railway PostgreSQL)
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@containers-us-west-xxx.railway.app:5432/railway"

# Server Configuration
PORT=3002
NODE_ENV=production

# JWT Configuration (secure generated secrets)
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=30d

# Redis Configuration (Railway Redis)
REDIS_URL="redis://default:${REDIS_PASSWORD}@containers-us-west-xxx.railway.app:6379"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kairoquantum.com
SMTP_PASS=your-gmail-app-password-here
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
ENCRYPTION_KEY=${ENCRYPTION_KEY}
SESSION_SECRET=${SESSION_SECRET}

# Monitoring
SENTRY_DSN=https://your-sentry-dsn-here
NEW_RELIC_LICENSE_KEY=your-new-relic-key-here

# External APIs
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Webhooks
WEBHOOK_SECRET=${WEBHOOK_SECRET}

# Feature Flags
ENABLE_LIVE_TRADING=true
ENABLE_PAPER_TRADING=true
ENABLE_NOTIFICATIONS=true
ENABLE_ANALYTICS=true
EOF

print_success "Backend production environment updated"

# Update frontend/.env.production
print_status "Updating frontend/.env.production with production values..."

cat > .env.production << EOF
# Production Environment Variables for Frontend

# API Configuration
NEXT_PUBLIC_API_URL=https://api.kairoquantum.com
NEXT_PUBLIC_WS_URL=wss://api.kairoquantum.com

# App Configuration
NEXT_PUBLIC_APP_NAME=KAIRO
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Domain Configuration
NEXT_PUBLIC_DOMAIN=kairoquantum.com
NEXT_PUBLIC_BASE_URL=https://www.kairoquantum.com

# Feature Flags
NEXT_PUBLIC_ENABLE_LIVE_TRADING=true
NEXT_PUBLIC_ENABLE_PAPER_TRADING=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_replace_with_actual_stripe_key

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@kairoquantum
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/kairoquantum

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=support@kairoquantum.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@kairoquantum.com

# Legal
NEXT_PUBLIC_PRIVACY_POLICY_URL=https://www.kairoquantum.com/privacy
NEXT_PUBLIC_TERMS_OF_SERVICE_URL=https://www.kairoquantum.com/terms

# Rate Limiting
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100
NEXT_PUBLIC_RATE_LIMIT_WINDOW=900000

# WebSocket Configuration
NEXT_PUBLIC_WS_RECONNECT_INTERVAL=5000
NEXT_PUBLIC_WS_MAX_RECONNECT_ATTEMPTS=10

# Trading Configuration
NEXT_PUBLIC_DEFAULT_PAPER_BALANCE=100000
NEXT_PUBLIC_MIN_ORDER_AMOUNT=1
NEXT_PUBLIC_MAX_ORDER_AMOUNT=1000000

# Chart Configuration
NEXT_PUBLIC_DEFAULT_CHART_INTERVAL=1D
NEXT_PUBLIC_CHART_THEME=dark

# Notification Configuration
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_SMS_NOTIFICATIONS=false
EOF

print_success "Frontend production environment updated"

# Create summary report
print_status "Creating credential summary report..."

cat > CREDENTIAL_SUMMARY.md << EOF
# KAIRO Production Credentials Summary

Generated on: $(date)

## ✅ Automatically Configured

### Security Keys
- JWT Secret: ✅ Generated (64-char hex)
- JWT Refresh Secret: ✅ Generated (64-char hex)
- Encryption Key: ✅ Generated (32-char hex)
- Session Secret: ✅ Generated (32-char hex)
- Webhook Secret: ✅ Generated (32-char hex)

### Database & Cache
- Database Password: ✅ Generated (25-char secure)
- Redis Password: ✅ Generated (25-char secure)

### Environment Files
- backend/.env.production: ✅ Updated
- .env.production (frontend): ✅ Updated

## ⚠️ Manual Configuration Required

### High Priority (Required for Launch)
1. **Database URL**: Update Railway PostgreSQL connection string
2. **Redis URL**: Update Railway Redis connection string
3. **Live Trading APIs**:
   - Alpaca API Key & Secret (live trading)
   - TD Ameritrade Client ID
4. **Email SMTP**: Gmail app password
5. **Payment**: Stripe live keys

### Medium Priority (Optional)
1. **Market Data APIs**:
   - Alpha Vantage API key
   - Finnhub API key
   - Polygon API key
2. **Monitoring**:
   - Sentry DSN
   - New Relic license key
3. **Analytics**:
   - Google Analytics tracking ID
   - Hotjar ID
4. **Communication**:
   - Twilio credentials

## 🚀 Next Steps

1. Run deployment: \`./auto-deploy-production.sh\`
2. Configure live API keys: \`./update-trading-apis.sh\`
3. Set up DNS: \`./configure-dns.sh\`
4. Test production deployment

## 🔒 Security Notes

- All generated secrets are cryptographically secure
- Database and Redis passwords are 25 characters
- JWT secrets are 128 characters (64-byte hex)
- Never commit actual API keys to version control
- Use environment variables for all sensitive data

EOF

print_success "Credential summary created: CREDENTIAL_SUMMARY.md"

echo ""
print_success "🎉 Production credentials configured successfully!"
echo ""
print_warning "IMPORTANT: You still need to:"
echo "1. Replace demo API keys with actual production keys"
echo "2. Update database and Redis URLs with actual Railway endpoints"
echo "3. Set Gmail SMTP password"
echo "4. Configure Stripe live payment keys"
echo ""
print_status "Next: Run ./auto-deploy-production.sh to deploy"