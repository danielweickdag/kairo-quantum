#!/bin/bash

# KAIRO Deployment Status Checker
# This script checks what has been configured for production deployment

echo "🔍 KAIRO Production Deployment Status Check"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_env_var() {
    local file=$1
    local var=$2
    local description=$3
    
    if [ -f "$file" ]; then
        if grep -q "^$var=" "$file" && ! grep -q "^$var=.*your-.*" "$file" && ! grep -q "^$var=.*username.*" "$file"; then
            echo -e "${GREEN}✅ $description${NC}"
            return 0
        else
            echo -e "${RED}❌ $description (needs configuration)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
        return 1
    fi
}

check_file_exists() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        return 0
    else
        echo -e "${RED}❌ $description${NC}"
        return 1
    fi
}

echo "\n📁 Configuration Files:"
check_file_exists ".env.production" "Frontend environment file"
check_file_exists "backend/.env.production" "Backend environment file"
check_file_exists "vercel.json" "Vercel configuration"
check_file_exists "deploy.sh" "Deployment script"

echo "\n🔐 Security Configuration:"
check_env_var "backend/.env.production" "JWT_SECRET" "JWT Secret"
check_env_var "backend/.env.production" "JWT_REFRESH_SECRET" "JWT Refresh Secret"

echo "\n🗄️ Database Configuration:"
check_env_var "backend/.env.production" "DATABASE_URL" "Production Database URL"

echo "\n📈 Trading APIs:"
check_env_var "backend/.env.production" "ALPACA_API_KEY" "Alpaca API Key"
check_env_var "backend/.env.production" "ALPACA_SECRET_KEY" "Alpaca Secret Key"
check_env_var "backend/.env.production" "IB_HOST" "Interactive Brokers Host"
check_env_var "backend/.env.production" "TD_AMERITRADE_CLIENT_ID" "TD Ameritrade Client ID"

echo "\n🔄 Redis Configuration:"
check_env_var "backend/.env.production" "REDIS_URL" "Redis Connection URL"

echo "\n📧 Email Configuration:"
check_env_var "backend/.env.production" "SMTP_USER" "SMTP User"
check_env_var "backend/.env.production" "SMTP_PASS" "SMTP Password"

echo "\n📊 Market Data APIs:"
check_env_var "backend/.env.production" "MARKET_DATA_API_KEY" "Alpha Vantage API Key"
check_env_var "backend/.env.production" "FINNHUB_API_KEY" "Finnhub API Key"
check_env_var "backend/.env.production" "POLYGON_API_KEY" "Polygon API Key"

echo "\n🚀 Deployment Tools Check:"
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${RED}❌ Vercel CLI not installed (run: npm install -g vercel)${NC}"
fi

if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
else
    echo -e "${YELLOW}⚠️ Railway CLI not installed (optional: npm install -g @railway/cli)${NC}"
fi

if command -v heroku &> /dev/null; then
    echo -e "${GREEN}✅ Heroku CLI installed${NC}"
else
    echo -e "${YELLOW}⚠️ Heroku CLI not installed (optional)${NC}"
fi

echo "\n📋 Next Steps:"
echo "1. Configure missing environment variables in backend/.env.production"
echo "2. Set up production database (Railway/Heroku/DigitalOcean)"
echo "3. Deploy backend: cd backend && railway deploy (or heroku deploy)"
echo "4. Deploy frontend: vercel --prod"
echo "5. Configure DNS records for kairoquantum.com"
echo "6. Test live trading functionality"

echo "\n📖 For detailed instructions, see:"
echo "   - PRODUCTION_SETUP_REQUIRED.md"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - DNS_SETUP_GUIDE.md"

echo "\n🎯 Goal: Get www.kairoquantum.com live with trading functionality"