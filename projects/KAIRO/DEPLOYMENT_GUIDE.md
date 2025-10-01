# KAIRO Trading Platform - Production Deployment Guide

This guide will walk you through deploying the KAIRO trading platform to production at `www.kairoquantum.com`.

## Prerequisites

- Domain: `kairoquantum.com` (with DNS access)
- Vercel account (for frontend hosting)
- Railway/Heroku/DigitalOcean account (for backend hosting)
- PostgreSQL database (production)
- Redis instance (for caching)
- SSL certificate provider

## 🚀 Quick Deployment

Run the automated deployment script:

```bash
./deploy.sh
```

## 📋 Manual Deployment Steps

### 1. Domain Configuration

#### DNS Settings
Configure your DNS records for `kairoquantum.com`:

```
# Main domain
A     @           [Your-Server-IP]
A     www         [Your-Server-IP]

# API subdomain
A     api         [Your-Backend-Server-IP]
CNAME api         your-backend-host.com

# WebSocket subdomain (if separate)
A     ws          [Your-WebSocket-Server-IP]
```

#### Vercel Domain Setup
1. Go to Vercel Dashboard → Domains
2. Add `www.kairoquantum.com`
3. Follow Vercel's DNS configuration instructions

### 2. Environment Variables Setup

#### Frontend Environment Variables
Update `.env.production`:

```bash
# Copy and configure production environment
cp .env.example .env.production

# Edit with production values
NEXT_PUBLIC_API_URL=https://api.kairoquantum.com
NEXT_PUBLIC_WS_URL=wss://api.kairoquantum.com
NEXT_PUBLIC_APP_URL=https://www.kairoquantum.com
```

#### Backend Environment Variables
Update `backend/.env.production`:

```bash
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/kairo_production"

# JWT Secrets (generate secure keys)
JWT_SECRET="your-super-secure-jwt-secret-minimum-32-characters"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-minimum-32-characters"

# Trading APIs
ALPACA_API_KEY="your-live-alpaca-api-key"
ALPACA_SECRET_KEY="your-live-alpaca-secret-key"
ALPACA_BASE_URL="https://api.alpaca.markets"  # Live trading URL

# Payment Processing
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

### 3. Database Setup

#### Production Database
1. **Create PostgreSQL Database**
   - Use managed service (AWS RDS, DigitalOcean, Railway)
   - Or set up your own PostgreSQL server

2. **Run Migrations**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

3. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

### 4. Frontend Deployment (Vercel)

#### Option A: Automatic Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### Vercel Configuration
Update `vercel.json`:

```json
{
  "version": 2,
  "alias": ["www.kairoquantum.com", "kairoquantum.com"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.kairoquantum.com",
    "NEXT_PUBLIC_WS_URL": "wss://api.kairoquantum.com"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.kairoquantum.com",
      "NEXT_PUBLIC_WS_URL": "wss://api.kairoquantum.com"
    }
  }
}
```

### 5. Backend Deployment

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd backend
railway login
railway deploy
```

#### Option B: Heroku
```bash
# Install Heroku CLI
# Create app
heroku create kairo-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL="your-database-url"

# Deploy
git subtree push --prefix=backend heroku main
```

#### Option C: DigitalOcean App Platform
1. Create new app in DigitalOcean
2. Connect GitHub repository
3. Configure build settings:
   - Source Directory: `/backend`
   - Build Command: `npm run build`
   - Run Command: `npm start`

### 6. SSL Certificate Setup

#### Automatic (Recommended)
- Vercel provides automatic SSL for frontend
- Most hosting providers offer automatic SSL

#### Manual Setup
```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d kairoquantum.com -d www.kairoquantum.com -d api.kairoquantum.com
```

### 7. Trading API Configuration

#### Live Trading Setup
1. **Alpaca Markets**
   - Switch from paper trading to live account
   - Update API keys in environment variables
   - Set `ALPACA_BASE_URL=https://api.alpaca.markets`

2. **Interactive Brokers**
   - Configure TWS/Gateway for live trading
   - Update connection settings

3. **TD Ameritrade**
   - Apply for live trading API access
   - Update OAuth redirect URLs

### 8. Payment Processing Setup

#### Stripe Configuration
1. Switch to live mode in Stripe dashboard
2. Update webhook endpoints:
   - `https://api.kairoquantum.com/webhooks/stripe`
3. Configure live API keys

#### PayPal Configuration
1. Switch to live environment
2. Update webhook URLs
3. Configure live credentials

### 9. Monitoring & Logging

#### Error Tracking
```bash
# Sentry setup
SENTRY_DSN="https://your-sentry-dsn"
```

#### Performance Monitoring
```bash
# New Relic setup
NEW_RELIC_LICENSE_KEY="your-license-key"
```

#### Log Management
- Configure log aggregation (LogDNA, Papertrail)
- Set up alerts for critical errors

### 10. Security Configuration

#### Environment Security
- Use secure, randomly generated secrets
- Enable HTTPS everywhere
- Configure CORS properly
- Set up rate limiting

#### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups
- Access restrictions

## 🧪 Testing Production Deployment

### Pre-Launch Checklist

- [ ] Frontend loads at `https://www.kairoquantum.com`
- [ ] API responds at `https://api.kairoquantum.com`
- [ ] WebSocket connections work
- [ ] User authentication functions
- [ ] Trading features work with live APIs
- [ ] Payment processing works
- [ ] Email notifications send
- [ ] Database migrations applied
- [ ] SSL certificates valid
- [ ] All environment variables set

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery quick --count 100 --num 10 https://www.kairoquantum.com
```

### Security Testing
- Run security scans
- Test authentication flows
- Verify API rate limiting
- Check for exposed secrets

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check TypeScript errors

2. **Database Connection Issues**
   - Verify connection string format
   - Check firewall settings
   - Ensure SSL configuration

3. **API Connection Issues**
   - Verify CORS settings
   - Check environment variable URLs
   - Test API endpoints directly

4. **Trading API Issues**
   - Verify live API credentials
   - Check API rate limits
   - Ensure proper permissions

### Rollback Plan

1. **Frontend Rollback**
   ```bash
   vercel rollback
   ```

2. **Backend Rollback**
   - Deploy previous version
   - Restore database backup if needed

3. **Database Rollback**
   ```bash
   npx prisma migrate reset
   # Restore from backup
   ```

## 📞 Support

For deployment issues:
1. Check logs in hosting platform dashboards
2. Review error tracking (Sentry)
3. Monitor performance metrics
4. Contact hosting provider support if needed

## 🎉 Go Live!

Once all tests pass and everything is configured:

1. **Announce Launch**
   - Update status page
   - Notify users
   - Monitor closely

2. **Monitor Systems**
   - Watch error rates
   - Monitor performance
   - Check trading functionality

3. **Scale as Needed**
   - Monitor resource usage
   - Scale servers if needed
   - Optimize performance

---

**🚀 Your KAIRO trading platform is now live at https://www.kairoquantum.com!**