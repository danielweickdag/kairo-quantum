# KAIRO Production Setup - Required Actions

## 🚨 Critical: What Hasn't Been Transferred to Production

Your deployment infrastructure is ready, but these **actual production values** need to be configured:

## ✅ Completed
- [x] JWT secrets generated and configured
- [x] Deployment scripts created
- [x] Environment file templates ready
- [x] Documentation guides created

## 🔴 Required Actions (High Priority)

### 1. Database Configuration
**File:** `backend/.env.production`
**Current:** `DATABASE_URL="postgresql://username:password@your-production-db-host:5432/kairo_production?schema=public"`
**Action Required:**
```bash
# Replace with actual production database URL
# Example for Railway:
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"

# Example for Heroku:
DATABASE_URL="postgres://user:pass@hostname:5432/dbname"

# Example for DigitalOcean:
DATABASE_URL="postgresql://doadmin:password@db-postgresql-nyc1-xxxxx.ondigitalocean.com:25060/defaultdb?sslmode=require"
```

### 2. Trading API Keys (CRITICAL for Live Trading)
**File:** `backend/.env.production`
**Action Required:**
```bash
# Alpaca Live Trading (replace paper trading keys)
ALPACA_API_KEY="your-live-alpaca-api-key"
ALPACA_SECRET_KEY="your-live-alpaca-secret-key"
ALPACA_BASE_URL="https://api.alpaca.markets"  # Live URL

# Interactive Brokers
IB_HOST="127.0.0.1"
IB_PORT=7497  # Live trading port (7496 for paper)
IB_CLIENT_ID=1

# TD Ameritrade
TD_AMERITRADE_CLIENT_ID="your-td-client-id"
TD_AMERITRADE_REDIRECT_URI="https://api.kairoquantum.com/auth/td/callback"
```

### 3. Redis Configuration
**File:** `backend/.env.production`
**Current:** `REDIS_URL=redis://your-redis-host:6379`
**Action Required:**
```bash
# Railway Redis
REDIS_URL="redis://default:password@containers-us-west-xxx.railway.app:6379"

# Heroku Redis
REDIS_URL="redis://h:password@hostname:port"

# DigitalOcean Redis
REDIS_URL="rediss://default:password@db-redis-nyc1-xxxxx.ondigitalocean.com:25061"
```

### 4. Backend Deployment
**Action Required:** Choose and deploy to one platform:

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway deploy

# Get your backend URL (e.g., https://backend-production-xxxx.up.railway.app)
```

#### Option B: Heroku
```bash
# Install Heroku CLI
# Create app
heroku create kairo-api

# Deploy
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a kairo-api
git push heroku main
```

### 5. Frontend Deployment
**Action Required:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel login
vercel --prod

# Add custom domain in Vercel dashboard:
# 1. Go to Vercel Dashboard
# 2. Select your project
# 3. Go to Settings > Domains
# 4. Add: www.kairoquantum.com
```

### 6. DNS Configuration
**Action Required:** Add these DNS records to your domain:
```
# A Records (replace with actual IPs)
A     @           [Vercel-IP-Address]
A     www         [Vercel-IP-Address]

# CNAME Records
CNAME api         [your-backend-host].railway.app
CNAME www         cname.vercel-dns.com
```

## 🟡 Medium Priority

### 7. Email Configuration
**File:** `backend/.env.production`
**Action Required:**
```bash
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kairoquantum.com
SMTP_PASS="your-gmail-app-password"  # Generate in Gmail settings
FROM_EMAIL=noreply@kairoquantum.com
```

### 8. Market Data APIs
**File:** `backend/.env.production`
**Action Required:**
```bash
# Alpha Vantage (free tier available)
MARKET_DATA_API_KEY="your-alpha-vantage-key"

# Finnhub (free tier available)
FINNHUB_API_KEY="your-finnhub-key"

# Polygon.io (paid service)
POLYGON_API_KEY="your-polygon-key"
```

## 🚀 Quick Start Commands

### 1. Update Backend Environment
```bash
# Edit the production environment file
nano backend/.env.production

# Add your actual database URL, API keys, etc.
```

### 2. Deploy Backend
```bash
# Using Railway (recommended)
cd backend
npm install -g @railway/cli
railway login
railway deploy
```

### 3. Deploy Frontend
```bash
# Using Vercel
npm install -g vercel
vercel login
vercel --prod
```

### 4. Run Database Migrations
```bash
# After backend is deployed
cd backend
npx prisma migrate deploy
```

## 🔍 How to Get Required Values

### Database URL
1. **Railway:** Create PostgreSQL service → Copy connection string
2. **Heroku:** Add Heroku Postgres addon → Copy DATABASE_URL
3. **DigitalOcean:** Create Managed Database → Copy connection string

### Trading API Keys
1. **Alpaca:** Sign up at alpaca.markets → Generate live API keys
2. **Interactive Brokers:** Download TWS → Enable API → Get connection details
3. **TD Ameritrade:** Apply for API access → Get client ID

### Redis URL
1. **Railway:** Add Redis service → Copy connection string
2. **Heroku:** Add Heroku Redis addon → Copy REDIS_URL
3. **DigitalOcean:** Create Redis cluster → Copy connection string

## ⚠️ Security Notes

- Never commit actual API keys to git
- Use environment variables for all secrets
- Enable 2FA on all trading accounts
- Use strong, unique passwords
- Regularly rotate API keys

## 📞 Next Steps

1. **Immediate:** Configure database and deploy backend
2. **Critical:** Set up live trading API keys
3. **Important:** Configure DNS and deploy frontend
4. **Optional:** Set up monitoring and alerts

---

**🎯 Goal:** Get www.kairoquantum.com live with actual trading functionality

**📋 Status:** Infrastructure ready, production values needed

**⏱️ Estimated Time:** 2-4 hours for full deployment