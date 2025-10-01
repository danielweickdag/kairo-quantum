#!/bin/bash

# KAIRO Automated DNS Configuration Script
# Provides comprehensive DNS setup for kairoquantum.com

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

echo "🌐 KAIRO Automated DNS Configuration"
echo "==================================="

# Get deployment URLs
get_deployment_urls() {
    print_status "Retrieving deployment URLs..."
    
    # Get backend URL
    if [ -f "BACKEND_URL.txt" ]; then
        BACKEND_URL=$(cat BACKEND_URL.txt)
        BACKEND_DOMAIN=$(echo "$BACKEND_URL" | sed 's|https://||' | sed 's|http://||')
        print_success "Backend URL: $BACKEND_URL"
    else
        print_warning "Backend URL not found. Using placeholder."
        BACKEND_DOMAIN="your-railway-app.up.railway.app"
    fi
    
    # Get frontend URL
    if [ -f "FRONTEND_URL.txt" ]; then
        FRONTEND_URL=$(cat FRONTEND_URL.txt)
        print_success "Frontend URL: $FRONTEND_URL"
    else
        print_warning "Frontend URL not found. Using Vercel default."
    fi
}

# Generate DNS records
generate_dns_records() {
    print_status "Generating DNS records for kairoquantum.com..."
    
    cat > DNS_RECORDS.txt << EOF
# DNS Records for kairoquantum.com
# Generated on: $(date)

# ============================================
# REQUIRED DNS RECORDS
# ============================================

# Main website (Vercel)
Type: A
Name: @
Value: 76.76.19.61
TTL: 300

# WWW subdomain (Vercel)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300

# API subdomain (Railway Backend)
Type: CNAME
Name: api
Value: $BACKEND_DOMAIN
TTL: 300

# ============================================
# OPTIONAL DNS RECORDS
# ============================================

# Email (if using custom email)
Type: MX
Name: @
Value: 10 mail.kairoquantum.com
TTL: 3600

# Email subdomain
Type: A
Name: mail
Value: [Your-Email-Server-IP]
TTL: 3600

# SPF Record (Email security)
Type: TXT
Name: @
Value: "v=spf1 include:_spf.google.com ~all"
TTL: 3600

# DKIM Record (Email security)
Type: TXT
Name: google._domainkey
Value: [Your-DKIM-Key]
TTL: 3600

# DMARC Record (Email security)
Type: TXT
Name: _dmarc
Value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@kairoquantum.com"
TTL: 3600

# ============================================
# VERIFICATION RECORDS
# ============================================

# Google Search Console
Type: TXT
Name: @
Value: "google-site-verification=[Your-Verification-Code]"
TTL: 300

# Vercel Domain Verification
Type: TXT
Name: @
Value: "vercel-domain-verification=[Your-Vercel-Code]"
TTL: 300

EOF

    print_success "DNS records generated: DNS_RECORDS.txt"
}

# Create registrar-specific guides
create_registrar_guides() {
    print_status "Creating registrar-specific configuration guides..."
    
    # Cloudflare guide
    cat > DNS_CLOUDFLARE.md << EOF
# Cloudflare DNS Configuration for kairoquantum.com

## Step 1: Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Select your domain: kairoquantum.com
3. Go to DNS → Records

## Step 2: Add DNS Records

### Required Records
\`\`\`
Type    Name    Content                     Proxy Status
A       @       76.76.19.61                 Proxied (Orange)
CNAME   www     cname.vercel-dns.com        Proxied (Orange)
CNAME   api     $BACKEND_DOMAIN             DNS Only (Gray)
\`\`\`

### SSL/TLS Settings
1. Go to SSL/TLS → Overview
2. Set encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

### Page Rules (Optional)
1. Go to Rules → Page Rules
2. Add rule: kairoquantum.com/*
3. Setting: Forwarding URL (301 redirect)
4. Destination: https://www.kairoquantum.com/\$1

## Step 3: Verify Configuration
- Wait 5-10 minutes for changes
- Test: https://www.kairoquantum.com
- Test API: https://api.kairoquantum.com/health
EOF

    # GoDaddy guide
    cat > DNS_GODADDY.md << EOF
# GoDaddy DNS Configuration for kairoquantum.com

## Step 1: Login to GoDaddy
1. Go to https://dcc.godaddy.com
2. Find your domain: kairoquantum.com
3. Click "DNS" or "Manage DNS"

## Step 2: Add DNS Records

### Delete Existing Records
- Delete any existing A records for @ and www
- Keep MX records if using GoDaddy email

### Add New Records
\`\`\`
Type    Name    Value                       TTL
A       @       76.76.19.61                 600
CNAME   www     cname.vercel-dns.com        600
CNAME   api     $BACKEND_DOMAIN             600
\`\`\`

## Step 3: Verify Configuration
- Wait 30-60 minutes for propagation
- Test: https://www.kairoquantum.com
- Test API: https://api.kairoquantum.com/health
EOF

    # Namecheap guide
    cat > DNS_NAMECHEAP.md << EOF
# Namecheap DNS Configuration for kairoquantum.com

## Step 1: Login to Namecheap
1. Go to https://ap.www.namecheap.com
2. Go to Domain List
3. Click "Manage" next to kairoquantum.com
4. Go to "Advanced DNS" tab

## Step 2: Add DNS Records

### Delete Existing Records
- Delete parking page A records
- Keep any existing MX records

### Add New Records
\`\`\`
Type            Host    Value                       TTL
A Record        @       76.76.19.61                 Automatic
CNAME Record    www     cname.vercel-dns.com        Automatic
CNAME Record    api     $BACKEND_DOMAIN             Automatic
\`\`\`

## Step 3: Verify Configuration
- Wait 30 minutes for propagation
- Test: https://www.kairoquantum.com
- Test API: https://api.kairoquantum.com/health
EOF

    print_success "Registrar-specific guides created"
}

# Create DNS verification script
create_verification_script() {
    print_status "Creating DNS verification script..."
    
    cat > verify-dns.sh << 'EOF'
#!/bin/bash

# DNS Verification Script for kairoquantum.com

echo "🔍 DNS Verification for kairoquantum.com"
echo "======================================="

check_dns_record() {
    local domain=$1
    local record_type=$2
    local expected=$3
    
    echo "Checking $record_type record for $domain..."
    
    if command -v dig &> /dev/null; then
        result=$(dig +short $record_type $domain)
        if [ -n "$result" ]; then
            echo "✅ $domain ($record_type): $result"
            if [ -n "$expected" ] && [[ "$result" == *"$expected"* ]]; then
                echo "   ✅ Matches expected value"
            elif [ -n "$expected" ]; then
                echo "   ⚠️  Expected: $expected"
            fi
        else
            echo "❌ $domain ($record_type): No record found"
        fi
    else
        echo "⚠️  dig command not available. Install with: brew install bind"
    fi
    echo ""
}

echo "Verifying DNS records..."
echo ""

# Check main domain
check_dns_record "kairoquantum.com" "A" "76.76.19.61"
check_dns_record "www.kairoquantum.com" "CNAME" "cname.vercel-dns.com"
check_dns_record "api.kairoquantum.com" "CNAME"

# Check if domains are reachable
echo "Testing HTTP connectivity..."
echo ""

test_url() {
    local url=$1
    local name=$2
    
    echo "Testing $name: $url"
    
    if command -v curl &> /dev/null; then
        if curl -s --head --max-time 10 "$url" | head -n 1 | grep -q "200\|301\|302"; then
            echo "✅ $name is reachable"
        else
            echo "❌ $name is not reachable"
        fi
    else
        echo "⚠️  curl command not available"
    fi
    echo ""
}

test_url "https://www.kairoquantum.com" "Frontend"
test_url "https://api.kairoquantum.com/health" "Backend API"

echo "📋 DNS Propagation Status:"
echo "- DNS changes can take 24-48 hours to fully propagate"
echo "- Use online tools to check propagation: https://dnschecker.org"
echo "- If issues persist, contact your domain registrar"
EOF

    chmod +x verify-dns.sh
    print_success "DNS verification script created: ./verify-dns.sh"
}

# Create DNS monitoring script
create_monitoring_script() {
    print_status "Creating DNS monitoring script..."
    
    cat > monitor-dns.sh << 'EOF'
#!/bin/bash

# DNS Monitoring Script for kairoquantum.com
# Continuously monitors DNS resolution and website availability

echo "📡 DNS Monitoring for kairoquantum.com"
echo "===================================="

monitor_loop() {
    while true; do
        clear
        echo "📡 DNS Monitoring - $(date)"
        echo "===================================="
        echo ""
        
        # Check DNS resolution
        echo "🔍 DNS Resolution:"
        dig +short A kairoquantum.com | head -1 | xargs -I {} echo "   kairoquantum.com → {}"
        dig +short CNAME www.kairoquantum.com | head -1 | xargs -I {} echo "   www.kairoquantum.com → {}"
        dig +short CNAME api.kairoquantum.com | head -1 | xargs -I {} echo "   api.kairoquantum.com → {}"
        echo ""
        
        # Check HTTP status
        echo "🌐 HTTP Status:"
        
        # Frontend check
        if curl -s --head --max-time 5 "https://www.kairoquantum.com" | head -n 1 | grep -q "200\|301\|302"; then
            echo "   ✅ Frontend: Online"
        else
            echo "   ❌ Frontend: Offline"
        fi
        
        # Backend check
        if curl -s --head --max-time 5 "https://api.kairoquantum.com/health" | head -n 1 | grep -q "200"; then
            echo "   ✅ Backend API: Online"
        else
            echo "   ❌ Backend API: Offline"
        fi
        
        echo ""
        echo "Press Ctrl+C to stop monitoring"
        echo "Next check in 30 seconds..."
        
        sleep 30
    done
}

monitor_loop
EOF

    chmod +x monitor-dns.sh
    print_success "DNS monitoring script created: ./monitor-dns.sh"
}

# Main function
main() {
    print_status "Starting DNS configuration process..."
    
    get_deployment_urls
    generate_dns_records
    create_registrar_guides
    create_verification_script
    create_monitoring_script
    
    print_success "🎉 DNS configuration completed!"
    
    echo ""
    echo "📋 DNS CONFIGURATION SUMMARY:"
    echo "============================="
    echo "✅ DNS records generated: DNS_RECORDS.txt"
    echo "✅ Cloudflare guide: DNS_CLOUDFLARE.md"
    echo "✅ GoDaddy guide: DNS_GODADDY.md"
    echo "✅ Namecheap guide: DNS_NAMECHEAP.md"
    echo "✅ Verification script: ./verify-dns.sh"
    echo "✅ Monitoring script: ./monitor-dns.sh"
    echo ""
    
    print_warning "NEXT STEPS:"
    echo "1. Choose your registrar guide (Cloudflare/GoDaddy/Namecheap)"
    echo "2. Configure DNS records in your registrar"
    echo "3. Wait 30-60 minutes for propagation"
    echo "4. Run ./verify-dns.sh to check configuration"
    echo "5. Use ./monitor-dns.sh for continuous monitoring"
    echo ""
    
    print_status "DNS propagation typically takes 30 minutes to 48 hours"
    print_status "Use https://dnschecker.org to check global propagation"
}

# Run main function
main "$@"