# SSL Certificate Setup Guide for KAIRO Trading Platform

This guide covers SSL certificate configuration for `www.kairoquantum.com` to ensure secure HTTPS connections.

## 🔒 SSL Certificate Overview

SSL certificates are essential for:
- Encrypting data transmission
- Building user trust
- SEO benefits
- Compliance requirements
- Payment processing security

## 🚀 Automatic SSL (Recommended)

### Vercel SSL (Frontend)

Vercel provides automatic SSL certificates for all domains:

1. **Add Domain to Vercel**
   ```bash
   # Using Vercel CLI
   vercel domains add kairoquantum.com
   vercel domains add www.kairoquantum.com
   ```

2. **Verify Domain Ownership**
   - Vercel will provide DNS records to add
   - Add TXT record to your DNS:
   ```
   TXT  @  "vercel-verification=your-verification-code"
   ```

3. **Automatic Certificate Provisioning**
   - Vercel automatically provisions Let's Encrypt certificates
   - Certificates auto-renew every 90 days
   - No manual intervention required

### Railway SSL (Backend)

Railway provides automatic SSL for custom domains:

1. **Add Custom Domain**
   ```bash
   railway domain add api.kairoquantum.com
   ```

2. **Configure DNS**
   ```
   CNAME  api  your-app.railway.app
   ```

3. **SSL Auto-Provisioning**
   - Railway automatically provisions SSL certificates
   - Certificates managed and renewed automatically

### Heroku SSL (Backend Alternative)

1. **Enable Automated Certificate Management**
   ```bash
   heroku certs:auto:enable --app your-app-name
   ```

2. **Add Custom Domain**
   ```bash
   heroku domains:add api.kairoquantum.com --app your-app-name
   ```

3. **Configure DNS**
   ```
   CNAME  api  your-app-name.herokuapp.com
   ```

## 🔧 Manual SSL Configuration

### Let's Encrypt (Free)

#### Using Certbot

1. **Install Certbot**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   
   # macOS
   brew install certbot
   
   # CentOS/RHEL
   sudo yum install certbot python3-certbot-nginx
   ```

2. **Generate Certificate**
   ```bash
   # For Nginx
   sudo certbot --nginx -d kairoquantum.com -d www.kairoquantum.com -d api.kairoquantum.com
   
   # For Apache
   sudo certbot --apache -d kairoquantum.com -d www.kairoquantum.com -d api.kairoquantum.com
   
   # Standalone (if no web server)
   sudo certbot certonly --standalone -d kairoquantum.com -d www.kairoquantum.com -d api.kairoquantum.com
   ```

3. **Auto-Renewal Setup**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run
   
   # Add to crontab for auto-renewal
   echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
   ```

#### Manual Certificate Generation

1. **Generate Private Key**
   ```bash
   openssl genrsa -out kairoquantum.com.key 2048
   ```

2. **Create Certificate Signing Request (CSR)**
   ```bash
   openssl req -new -key kairoquantum.com.key -out kairoquantum.com.csr
   ```

3. **Submit CSR to Let's Encrypt**
   ```bash
   certbot certonly --manual --preferred-challenges dns -d kairoquantum.com -d www.kairoquantum.com
   ```

### Commercial SSL Certificates

#### Popular SSL Providers
- **DigiCert** - Premium certificates with warranty
- **Comodo/Sectigo** - Affordable options
- **GlobalSign** - Enterprise solutions
- **GeoTrust** - Budget-friendly
- **Thawte** - Trusted brand

#### Purchase and Installation

1. **Generate CSR**
   ```bash
   openssl req -new -newkey rsa:2048 -nodes -keyout kairoquantum.com.key -out kairoquantum.com.csr
   ```

2. **Submit CSR to Provider**
   - Purchase certificate from provider
   - Submit CSR during purchase process
   - Complete domain validation

3. **Download Certificate Files**
   - Primary certificate: `kairoquantum.com.crt`
   - Intermediate certificate: `intermediate.crt`
   - Root certificate: `root.crt`

4. **Create Certificate Bundle**
   ```bash
   cat kairoquantum.com.crt intermediate.crt root.crt > kairoquantum.com.bundle.crt
   ```

## 🌐 Cloudflare SSL

### Cloudflare Universal SSL

1. **Add Domain to Cloudflare**
   - Sign up for Cloudflare account
   - Add `kairoquantum.com` domain
   - Update nameservers to Cloudflare

2. **SSL Configuration**
   ```
   SSL/TLS → Overview → Full (strict)
   ```

3. **Edge Certificates**
   - Universal SSL automatically enabled
   - Covers `kairoquantum.com` and `*.kairoquantum.com`
   - Auto-renewal handled by Cloudflare

### Cloudflare Origin Certificates

1. **Generate Origin Certificate**
   - Go to SSL/TLS → Origin Server
   - Create Certificate
   - Download certificate and private key

2. **Install on Origin Server**
   ```bash
   # Save certificate files
   /etc/ssl/certs/cloudflare-origin.pem
   /etc/ssl/private/cloudflare-origin.key
   ```

## 🔧 Web Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name kairoquantum.com www.kairoquantum.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kairoquantum.com www.kairoquantum.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/kairoquantum.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kairoquantum.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Your application configuration
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API Server
server {
    listen 443 ssl http2;
    server_name api.kairoquantum.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/kairoquantum.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kairoquantum.com/privkey.pem;
    
    # Same SSL settings as above
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName kairoquantum.com
    ServerAlias www.kairoquantum.com
    Redirect permanent / https://www.kairoquantum.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName kairoquantum.com
    ServerAlias www.kairoquantum.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/kairoquantum.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/kairoquantum.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/kairoquantum.com/chain.pem
    
    # SSL Security
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off
    
    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    
    # Proxy to application
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    ProxyPreserveHost On
</VirtualHost>
```

## ✅ SSL Verification

### Online SSL Checkers

1. **SSL Labs Test**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter: `kairoquantum.com`
   - Aim for A+ rating

2. **Other SSL Checkers**
   - https://www.sslshopper.com/ssl-checker.html
   - https://www.digicert.com/help/
   - https://www.geocerts.com/ssl-checker

### Command Line Verification

```bash
# Check certificate details
openssl s_client -connect kairoquantum.com:443 -servername kairoquantum.com

# Check certificate expiration
echo | openssl s_client -servername kairoquantum.com -connect kairoquantum.com:443 2>/dev/null | openssl x509 -noout -dates

# Test HTTPS connection
curl -I https://www.kairoquantum.com

# Check certificate chain
openssl s_client -connect kairoquantum.com:443 -showcerts
```

### Browser Testing

1. **Visit Your Site**
   - Go to `https://www.kairoquantum.com`
   - Look for green padlock icon
   - Click padlock to view certificate details

2. **Test All Subdomains**
   - `https://kairoquantum.com`
   - `https://www.kairoquantum.com`
   - `https://api.kairoquantum.com`

3. **Check for Mixed Content**
   - Open browser developer tools
   - Look for mixed content warnings
   - Ensure all resources load over HTTPS

## 🚨 Troubleshooting

### Common SSL Issues

1. **Certificate Not Trusted**
   - Verify certificate chain is complete
   - Check intermediate certificates
   - Ensure root certificate is included

2. **Mixed Content Warnings**
   - Update all HTTP resources to HTTPS
   - Check images, scripts, stylesheets
   - Update API calls to use HTTPS

3. **Certificate Mismatch**
   - Verify certificate covers all domains
   - Check Subject Alternative Names (SAN)
   - Ensure www and non-www variants included

4. **Certificate Expired**
   - Check certificate expiration date
   - Renew certificate if needed
   - Verify auto-renewal is working

### Debug Commands

```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Verify certificate chain
openssl verify -CAfile ca-bundle.crt certificate.crt

# Test SSL configuration
nmap --script ssl-enum-ciphers -p 443 kairoquantum.com

# Check for SSL vulnerabilities
testssl.sh kairoquantum.com
```

## 🔄 Certificate Renewal

### Automatic Renewal (Let's Encrypt)

```bash
# Test renewal process
sudo certbot renew --dry-run

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Check renewal status
sudo certbot certificates
```

### Manual Renewal

```bash
# Renew specific certificate
sudo certbot renew --cert-name kairoquantum.com

# Force renewal
sudo certbot renew --force-renewal

# Reload web server after renewal
sudo systemctl reload nginx
```

## 📊 Monitoring

### Certificate Monitoring

1. **Set Up Alerts**
   - Monitor certificate expiration
   - Alert 30 days before expiry
   - Monitor SSL configuration changes

2. **Monitoring Tools**
   - SSL Certificate Monitor
   - Pingdom SSL monitoring
   - UptimeRobot SSL checks
   - Custom scripts with cron

### Example Monitoring Script

```bash
#!/bin/bash
# ssl-monitor.sh

DOMAIN="kairoquantum.com"
ALERT_DAYS=30
EMAIL="admin@kairoquantum.com"

# Get certificate expiration date
EXP_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)

# Convert to epoch time
EXP_EPOCH=$(date -d "$EXP_DATE" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_LEFT=$(( (EXP_EPOCH - CURRENT_EPOCH) / 86400 ))

# Send alert if certificate expires soon
if [ $DAYS_LEFT -lt $ALERT_DAYS ]; then
    echo "SSL certificate for $DOMAIN expires in $DAYS_LEFT days" | mail -s "SSL Certificate Alert" $EMAIL
fi
```

---

**🔒 Your KAIRO trading platform will be secured with HTTPS once SSL certificates are properly configured!**