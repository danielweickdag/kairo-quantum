# Domain Setup Guide for KAIRO Trading Platform

This guide covers the complete domain setup for deploying the KAIRO trading platform to `kairoquantum.com`.

## 🌐 Domain Configuration

### Primary Domain: `kairoquantum.com`
- **Main App**: `www.kairoquantum.com`
- **API**: `api.kairoquantum.com`
- **CDN**: `cdn.kairoquantum.com` (optional)

## 📋 DNS Configuration Requirements

### A Records
```
Type: A
Name: @
Value: [Vercel IP Address]
TTL: 300

Type: A
Name: www
Value: [Vercel IP Address]
TTL: 300
```

### CNAME Records
```
Type: CNAME
Name: api
Value: [Backend Server Domain or Vercel]
TTL: 300

Type: CNAME
Name: cdn
Value: [CDN Provider Domain]
TTL: 300
```

### SSL/TLS Configuration
- Enable SSL/TLS encryption
- Use Full (strict) encryption mode
- Enable HSTS (HTTP Strict Transport Security)
- Minimum TLS version: 1.2

## 🚀 Deployment Steps

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Add custom domain
vercel domains add kairoquantum.com
vercel domains add www.kairoquantum.com
```

### 2. Environment Variables Setup

Configure these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_API_URL=https://api.kairoquantum.com
NEXT_PUBLIC_WS_URL=wss://api.kairoquantum.com
NEXT_PUBLIC_APP_URL=https://www.kairoquantum.com
```

### 3. Domain Verification

After DNS configuration:
1. Wait for DNS propagation (up to 48 hours)
2. Verify domain ownership in Vercel dashboard
3. Enable SSL certificate auto-renewal

## 🔧 Configuration Files

### Next.js Configuration (`next.config.js`)
- ✅ Image domains configured
- ✅ API rewrites set up
- ✅ Security headers added
- ✅ Redirects configured

### Vercel Configuration (`vercel.json`)
- ✅ Domain aliases configured
- ✅ Environment variables set
- ✅ Redirects and headers configured
- ✅ Function timeouts optimized

### Environment Files
- ✅ `.env.local` - Development
- ✅ `.env.production` - Production template
- ✅ `.env.example` - Example configuration

## 🔍 Testing and Verification

### Pre-deployment Checklist
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Environment variables set
- [ ] API endpoints accessible
- [ ] WebSocket connections working

### Post-deployment Testing
```bash
# Test main domain
curl -I https://www.kairoquantum.com

# Test API endpoint
curl -I https://api.kairoquantum.com/health

# Test redirects
curl -I https://kairoquantum.com
```

### Performance Testing
- Use tools like GTmetrix, PageSpeed Insights
- Test from multiple geographic locations
- Verify CDN performance (if applicable)

## 🛡️ Security Configuration

### Headers Applied
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### Additional Security Measures
- Enable DDoS protection
- Configure rate limiting
- Set up monitoring and alerts
- Regular security audits

## 📊 Monitoring and Analytics

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Analytics**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry

### Key Metrics to Monitor
- Response times
- Error rates
- Traffic patterns
- API performance
- WebSocket connection stability

## 🔄 Maintenance

### Regular Tasks
- Monitor SSL certificate expiration
- Update DNS records if needed
- Review and update security headers
- Performance optimization
- Backup configuration files

### Troubleshooting

**Common Issues:**
1. **DNS not propagating**: Wait 24-48 hours, check with DNS checker tools
2. **SSL certificate issues**: Verify domain ownership, check CAA records
3. **API not accessible**: Check CORS settings, verify backend deployment
4. **Slow loading**: Optimize images, enable compression, check CDN

## 📞 Support Contacts

- **Domain Registrar**: [Your registrar support]
- **DNS Provider**: [Your DNS provider support]
- **Hosting Platform**: Vercel Support
- **SSL Provider**: Let's Encrypt (auto-managed by Vercel)

---

**Last Updated**: $(date)
**Next Review**: $(date -d '+3 months')

> 💡 **Tip**: Keep this document updated with any configuration changes and maintain a backup of all DNS settings.