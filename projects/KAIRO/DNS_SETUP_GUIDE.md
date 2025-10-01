# DNS Configuration Guide for kairoquantum.com

This guide provides step-by-step instructions for configuring DNS settings to point your domain to the KAIRO trading platform.

## 🌐 DNS Records Overview

You'll need to configure the following DNS records for your domain `kairoquantum.com`:

### Required DNS Records

| Type  | Name | Value | Purpose |
|-------|------|-------|----------|
| A     | @    | Vercel IP | Root domain (kairoquantum.com) |
| CNAME | www  | cname.vercel-dns.com | www subdomain |
| CNAME | api  | your-backend-host.com | API subdomain |
| TXT   | @    | Verification records | Domain verification |

## 📋 Step-by-Step Configuration

### Step 1: Access Your Domain Registrar

Log into your domain registrar's control panel where you purchased `kairoquantum.com`:
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Route 53 (AWS)

### Step 2: Frontend DNS (Vercel)

#### Option A: Using Vercel DNS (Recommended)

1. **Add Domain to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to your project
   - Go to Settings → Domains
   - Add `kairoquantum.com` and `www.kairoquantum.com`

2. **Configure Nameservers**
   Vercel will provide nameservers like:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
   
   Update your domain's nameservers to these values.

#### Option B: Using Custom DNS

1. **Get Vercel IP Address**
   ```bash
   dig cname.vercel-dns.com
   ```

2. **Add DNS Records**
   ```
   # Root domain
   A     @     76.76.19.61  # Vercel IP (example)
   
   # WWW subdomain
   CNAME www   cname.vercel-dns.com
   
   # Alternative: Point www to root
   CNAME www   kairoquantum.com
   ```

### Step 3: Backend API DNS

#### For Railway Deployment
```
CNAME api   your-app-name.railway.app
```

#### For Heroku Deployment
```
CNAME api   your-app-name.herokuapp.com
```

#### For DigitalOcean App Platform
```
CNAME api   your-app-name.ondigitalocean.app
```

#### For Custom Server
```
A     api   YOUR_SERVER_IP_ADDRESS
```

### Step 4: Additional Subdomains (Optional)

```
# WebSocket (if separate from API)
CNAME ws    your-websocket-host.com

# Admin panel (if separate)
CNAME admin your-admin-host.com

# Status page
CNAME status your-status-page.com

# Documentation
CNAME docs  your-docs-host.com
```

## 🔧 Platform-Specific Instructions

### Cloudflare

1. **Login to Cloudflare Dashboard**
2. **Select your domain**
3. **Go to DNS tab**
4. **Add records:**
   ```
   Type: A
   Name: @
   IPv4: [Vercel IP]
   Proxy: Orange cloud (Proxied)
   
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy: Orange cloud (Proxied)
   
   Type: CNAME
   Name: api
   Target: your-backend-host.com
   Proxy: Orange cloud (Proxied)
   ```

### GoDaddy

1. **Login to GoDaddy**
2. **Go to My Products → DNS**
3. **Add records:**
   ```
   Type: A
   Host: @
   Points to: [Vercel IP]
   TTL: 1 Hour
   
   Type: CNAME
   Host: www
   Points to: cname.vercel-dns.com
   TTL: 1 Hour
   
   Type: CNAME
   Host: api
   Points to: your-backend-host.com
   TTL: 1 Hour
   ```

### Namecheap

1. **Login to Namecheap**
2. **Go to Domain List → Manage**
3. **Advanced DNS tab**
4. **Add records:**
   ```
   Type: A Record
   Host: @
   Value: [Vercel IP]
   TTL: Automatic
   
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   
   Type: CNAME Record
   Host: api
   Value: your-backend-host.com
   TTL: Automatic
   ```

### AWS Route 53

1. **Create Hosted Zone**
   ```bash
   aws route53 create-hosted-zone --name kairoquantum.com --caller-reference $(date +%s)
   ```

2. **Add Records**
   ```json
   {
     "Changes": [
       {
         "Action": "CREATE",
         "ResourceRecordSet": {
           "Name": "kairoquantum.com",
           "Type": "A",
           "TTL": 300,
           "ResourceRecords": [{"Value": "VERCEL_IP"}]
         }
       },
       {
         "Action": "CREATE",
         "ResourceRecordSet": {
           "Name": "www.kairoquantum.com",
           "Type": "CNAME",
           "TTL": 300,
           "ResourceRecords": [{"Value": "cname.vercel-dns.com"}]
         }
       }
     ]
   }
   ```

## ✅ Verification

### Check DNS Propagation

1. **Online Tools**
   - [DNS Checker](https://dnschecker.org/)
   - [What's My DNS](https://www.whatsmydns.net/)
   - [DNS Propagation Checker](https://www.dnsmap.io/)

2. **Command Line**
   ```bash
   # Check A record
   dig kairoquantum.com
   
   # Check CNAME record
   dig www.kairoquantum.com
   
   # Check API subdomain
   dig api.kairoquantum.com
   
   # Check from specific DNS server
   dig @8.8.8.8 kairoquantum.com
   ```

3. **Test in Browser**
   - Visit `http://kairoquantum.com` (should redirect to HTTPS)
   - Visit `https://www.kairoquantum.com`
   - Test API: `https://api.kairoquantum.com/health`

### Expected Results

```bash
# Successful DNS resolution
$ dig kairoquantum.com
;; ANSWER SECTION:
kairoquantum.com.    300    IN    A    76.76.19.61

$ dig www.kairoquantum.com
;; ANSWER SECTION:
www.kairoquantum.com. 300 IN CNAME cname.vercel-dns.com.
cname.vercel-dns.com. 300 IN A    76.76.19.61
```

## 🕐 Propagation Timeline

- **Immediate**: Changes visible from authoritative nameservers
- **15-30 minutes**: Most DNS resolvers updated
- **2-4 hours**: Global propagation mostly complete
- **24-48 hours**: Full global propagation guaranteed

## 🚨 Troubleshooting

### Common Issues

1. **DNS Not Propagating**
   - Wait 24-48 hours for full propagation
   - Clear local DNS cache: `sudo dscacheutil -flushcache`
   - Try different DNS servers (8.8.8.8, 1.1.1.1)

2. **SSL Certificate Issues**
   - Ensure DNS is pointing correctly
   - Wait for automatic SSL provisioning
   - Check certificate status in hosting platform

3. **Subdomain Not Working**
   - Verify CNAME record syntax
   - Check target host is accessible
   - Ensure no conflicting A records

### Debug Commands

```bash
# Trace DNS resolution
nslookup kairoquantum.com

# Check DNS from multiple locations
dig +trace kairoquantum.com

# Test HTTP response
curl -I https://www.kairoquantum.com

# Check SSL certificate
openssl s_client -connect kairoquantum.com:443 -servername kairoquantum.com
```

## 📞 Support

If you encounter issues:

1. **Domain Registrar Support**
   - Contact your registrar's technical support
   - Provide DNS record details

2. **Hosting Platform Support**
   - Vercel: [Support](https://vercel.com/support)
   - Railway: [Help Center](https://help.railway.app/)
   - Heroku: [Support](https://help.heroku.com/)

3. **DNS Tools**
   - Use online DNS checkers
   - Monitor propagation status
   - Verify record syntax

---

**✅ Once DNS is configured correctly, your domain will point to the KAIRO trading platform!**