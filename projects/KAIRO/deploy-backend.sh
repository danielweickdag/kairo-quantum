#!/bin/bash

# KAIRO Backend Deployment Script for Railway
# Automates backend deployment with proper environment setup

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

echo "🚀 KAIRO Backend Deployment to Railway"
echo "====================================="

# Check if Railway CLI is installed
check_railway_cli() {
    print_status "Checking Railway CLI installation..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
        print_success "Railway CLI installed"
    else
        print_success "Railway CLI already installed"
    fi
}

# Login to Railway
railway_login() {
    print_status "Logging into Railway..."
    
    if ! railway whoami &> /dev/null; then
        print_warning "Please login to Railway when prompted"
        railway login
    else
        print_success "Already logged into Railway"
    fi
}

# Initialize Railway project
init_railway_project() {
    print_status "Initializing Railway project..."
    
    cd backend
    
    # Check if already linked to a Railway project
    if [ ! -f ".railway/project.json" ]; then
        print_status "Creating new Railway project..."
        railway init kairo-backend
    else
        print_success "Railway project already initialized"
    fi
}

# Set up environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Read environment variables from .env.production
    if [ -f ".env.production" ]; then
        print_status "Uploading environment variables to Railway..."
        
        # Upload environment variables (excluding comments and empty lines)
        grep -v '^#' .env.production | grep -v '^$' | while IFS='=' read -r key value; do
            if [ -n "$key" ] && [ -n "$value" ]; then
                # Remove quotes from value if present
                value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
                railway variables set "$key=$value"
            fi
        done
        
        print_success "Environment variables uploaded"
    else
        print_error ".env.production file not found!"
        exit 1
    fi
}

# Build the application
build_application() {
    print_status "Building backend application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Build the application
    print_status "Building application..."
    npm run build
    
    print_success "Application built successfully"
}

# Deploy to Railway
deploy_to_railway() {
    print_status "Deploying to Railway..."
    
    # Deploy the application
    railway deploy
    
    print_success "Backend deployed to Railway"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Run migrations on Railway
    railway run npx prisma migrate deploy
    
    print_success "Database migrations completed"
}

# Get deployment URL
get_deployment_info() {
    print_status "Getting deployment information..."
    
    # Get the deployment URL
    RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null || echo "")
    
    if [ -n "$RAILWAY_URL" ] && [ "$RAILWAY_URL" != "null" ]; then
        print_success "Backend deployed at: $RAILWAY_URL"
        echo "$RAILWAY_URL" > ../BACKEND_URL.txt
    else
        print_warning "Could not retrieve deployment URL automatically"
        print_status "You can get it later with: railway status"
    fi
}

# Create Railway configuration file
create_railway_config() {
    print_status "Creating Railway configuration..."
    
    cat > railway.json << EOF
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

    print_success "Railway configuration created"
}

# Update package.json for production
update_package_json() {
    print_status "Updating package.json for production..."
    
    # Ensure start script exists
    if ! grep -q '"start"' package.json; then
        # Add start script if it doesn't exist
        npm pkg set scripts.start="node dist/index.js"
        print_success "Added start script to package.json"
    fi
    
    # Ensure build script exists
    if ! grep -q '"build"' package.json; then
        # Add build script if it doesn't exist
        npm pkg set scripts.build="tsc"
        print_success "Added build script to package.json"
    fi
}

# Main deployment function
main() {
    print_status "Starting backend deployment process..."
    
    # Execute deployment steps
    check_railway_cli
    railway_login
    init_railway_project
    update_package_json
    create_railway_config
    build_application
    setup_environment
    deploy_to_railway
    run_migrations
    get_deployment_info
    
    cd ..
    
    print_success "🎉 Backend deployment completed successfully!"
    
    echo ""
    echo "📋 DEPLOYMENT SUMMARY:"
    echo "======================"
    echo "✅ Railway CLI configured"
    echo "✅ Project initialized"
    echo "✅ Environment variables uploaded"
    echo "✅ Application built and deployed"
    echo "✅ Database migrations executed"
    echo ""
    
    if [ -f "BACKEND_URL.txt" ]; then
        BACKEND_URL=$(cat BACKEND_URL.txt)
        echo "🌐 Backend URL: $BACKEND_URL"
        echo "📝 API Endpoint: $BACKEND_URL/api"
        echo "🔍 Health Check: $BACKEND_URL/health"
    fi
    
    echo ""
    print_warning "NEXT STEPS:"
    echo "1. Update frontend .env.production with actual backend URL"
    echo "2. Test API endpoints"
    echo "3. Deploy frontend with updated backend URL"
    echo "4. Configure custom domain DNS"
    echo ""
    
    print_status "Backend deployment logs: railway logs"
    print_status "Backend status: railway status"
}

# Error handling
trap 'print_error "Deployment failed! Check the error above."' ERR

# Run main function
main "$@"