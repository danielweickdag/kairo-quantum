#!/bin/bash

# KAIRO Frontend Deployment Script for Vercel
# Automates frontend deployment with custom domain setup

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

echo "🚀 KAIRO Frontend Deployment to Vercel"
echo "====================================="

# Check if Vercel CLI is installed
check_vercel_cli() {
    print_status "Checking Vercel CLI installation..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    else
        print_success "Vercel CLI already installed"
    fi
}

# Login to Vercel
vercel_login() {
    print_status "Logging into Vercel..."
    
    if ! vercel whoami &> /dev/null; then
        print_warning "Please login to Vercel when prompted"
        vercel login
    else
        print_success "Already logged into Vercel"
    fi
}

# Update backend URL in frontend environment
update_backend_url() {
    print_status "Updating backend URL in frontend environment..."
    
    # Check if backend URL file exists
    if [ -f "BACKEND_URL.txt" ]; then
        BACKEND_URL=$(cat BACKEND_URL.txt)
        print_status "Using backend URL: $BACKEND_URL"
        
        # Update frontend .env.production with actual backend URL
        sed -i "" "s|https://api.kairoquantum.com|$BACKEND_URL|g" .env.production
        sed -i "" "s|wss://api.kairoquantum.com|${BACKEND_URL/https:/wss:}|g" .env.production
        
        print_success "Frontend environment updated with backend URL"
    else
        print_warning "Backend URL not found. Using placeholder URL."
        print_warning "You may need to update NEXT_PUBLIC_API_URL manually after backend deployment."
    fi
}

# Build the application
build_application() {
    print_status "Building frontend application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Build the application
    print_status "Building Next.js application..."
    npm run build
    
    print_success "Frontend application built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy to production
    vercel --prod --yes
    
    print_success "Frontend deployed to Vercel"
}

# Get deployment URL
get_deployment_info() {
    print_status "Getting deployment information..."
    
    # Get the deployment URL
    VERCEL_URL=$(vercel ls --scope=$(vercel whoami) | grep "$(basename $(pwd))" | head -1 | awk '{print $2}' || echo "")
    
    if [ -n "$VERCEL_URL" ]; then
        print_success "Frontend deployed at: https://$VERCEL_URL"
        echo "https://$VERCEL_URL" > FRONTEND_URL.txt
    else
        print_warning "Could not retrieve deployment URL automatically"
        print_status "You can get it later with: vercel ls"
    fi
}

# Configure custom domain
configure_custom_domain() {
    print_status "Configuring custom domain..."
    
    print_warning "Custom domain setup requires manual configuration:"
    echo ""
    echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
    echo "2. Select your project: kairo"
    echo "3. Go to Settings → Domains"
    echo "4. Add domain: www.kairoquantum.com"
    echo "5. Add domain: kairoquantum.com (redirect to www)"
    echo ""
    
    # Create domain configuration script
    cat > configure-vercel-domain.sh << 'EOF'
#!/bin/bash

# Vercel Custom Domain Configuration
echo "🌐 Configuring Custom Domain for Vercel"
echo "====================================="

echo "Manual steps required:"
echo "1. Open Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select your KAIRO project"
echo "3. Navigate to Settings → Domains"
echo "4. Add these domains:"
echo "   - www.kairoquantum.com (primary)"
echo "   - kairoquantum.com (redirect to www)"
echo ""
echo "5. Vercel will provide DNS records:"
echo "   - A record for @ pointing to Vercel IP"
echo "   - CNAME record for www pointing to cname.vercel-dns.com"
echo ""
echo "6. Add these DNS records to your domain registrar"
echo "7. Wait for DNS propagation (up to 48 hours)"
echo "8. Verify with: dig www.kairoquantum.com"
echo ""
echo "📋 DNS Records Template:"
echo "Type    Name    Value"
echo "A       @       76.76.19.61 (example Vercel IP)"
echo "CNAME   www     cname.vercel-dns.com"
EOF

    chmod +x configure-vercel-domain.sh
    print_success "Domain configuration guide created: ./configure-vercel-domain.sh"
}

# Create Vercel configuration
create_vercel_config() {
    print_status "Updating Vercel configuration..."
    
    # Update vercel.json with production settings
    cat > vercel.json << EOF
{
  "version": 2,
  "name": "kairo-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_WS_URL": "@ws-url",
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "redirects": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.kairoquantum.com/api/\$1",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
EOF

    print_success "Vercel configuration updated"
}

# Set up environment variables in Vercel
setup_vercel_environment() {
    print_status "Setting up Vercel environment variables..."
    
    # Read environment variables from .env.production
    if [ -f ".env.production" ]; then
        print_status "Uploading environment variables to Vercel..."
        
        # Upload public environment variables only
        grep '^NEXT_PUBLIC_' .env.production | while IFS='=' read -r key value; do
            if [ -n "$key" ] && [ -n "$value" ]; then
                # Remove quotes from value if present
                value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
                vercel env add "$key" production <<< "$value"
            fi
        done
        
        print_success "Environment variables uploaded to Vercel"
    else
        print_error ".env.production file not found!"
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "Starting frontend deployment process..."
    
    # Execute deployment steps
    check_vercel_cli
    vercel_login
    update_backend_url
    create_vercel_config
    build_application
    setup_vercel_environment
    deploy_to_vercel
    get_deployment_info
    configure_custom_domain
    
    print_success "🎉 Frontend deployment completed successfully!"
    
    echo ""
    echo "📋 DEPLOYMENT SUMMARY:"
    echo "======================"
    echo "✅ Vercel CLI configured"
    echo "✅ Backend URL updated"
    echo "✅ Environment variables uploaded"
    echo "✅ Application built and deployed"
    echo "✅ Domain configuration guide created"
    echo ""
    
    if [ -f "FRONTEND_URL.txt" ]; then
        FRONTEND_URL=$(cat FRONTEND_URL.txt)
        echo "🌐 Frontend URL: $FRONTEND_URL"
        echo "📱 Mobile-ready: Yes"
        echo "🔒 HTTPS: Enabled"
    fi
    
    echo ""
    print_warning "NEXT STEPS:"
    echo "1. Run ./configure-vercel-domain.sh for custom domain setup"
    echo "2. Configure DNS records with your domain registrar"
    echo "3. Test the application at your deployment URL"
    echo "4. Monitor deployment logs"
    echo ""
    
    print_status "Frontend deployment logs: vercel logs"
    print_status "Vercel dashboard: https://vercel.com/dashboard"
}

# Error handling
trap 'print_error "Frontend deployment failed! Check the error above."' ERR

# Run main function
main "$@"