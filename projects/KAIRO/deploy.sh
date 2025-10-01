#!/bin/bash

# KAIRO Trading Platform Deployment Script
# This script helps deploy the application to production

set -e  # Exit on any error

echo "🚀 Starting KAIRO Trading Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend application..."
    
    # Install dependencies
    npm install
    
    # Run type checking
    npm run type-check
    
    # Build the application
    npm run build
    
    print_success "Frontend build completed"
}

# Build backend
build_backend() {
    print_status "Building backend application..."
    
    cd backend
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Build TypeScript
    npm run build
    
    cd ..
    
    print_success "Backend build completed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    if [ -f "jest.config.js" ]; then
        npm test -- --passWithNoTests
    fi
    
    # Backend tests
    cd backend
    if [ -f "jest.config.js" ]; then
        npm test -- --passWithNoTests
    fi
    cd ..
    
    print_success "All tests passed"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy frontend
    vercel --prod --confirm
    
    print_success "Frontend deployed to Vercel"
}

# Deploy backend (example for various platforms)
deploy_backend() {
    print_status "Backend deployment options:"
    echo "1. Deploy to Railway"
    echo "2. Deploy to Heroku"
    echo "3. Deploy to DigitalOcean"
    echo "4. Deploy to AWS"
    echo "5. Skip backend deployment"
    
    read -p "Choose deployment option (1-5): " choice
    
    case $choice in
        1)
            deploy_to_railway
            ;;
        2)
            deploy_to_heroku
            ;;
        3)
            print_status "Please follow DigitalOcean deployment guide"
            ;;
        4)
            print_status "Please follow AWS deployment guide"
            ;;
        5)
            print_warning "Skipping backend deployment"
            ;;
        *)
            print_error "Invalid option"
            exit 1
            ;;
    esac
}

# Deploy to Railway
deploy_to_railway() {
    print_status "Deploying backend to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Please install it first:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
    
    cd backend
    railway login
    railway deploy
    cd ..
    
    print_success "Backend deployed to Railway"
}

# Deploy to Heroku
deploy_to_heroku() {
    print_status "Deploying backend to Heroku..."
    
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI not found. Please install it first"
        exit 1
    fi
    
    cd backend
    
    # Create Heroku app if it doesn't exist
    if ! heroku apps:info kairo-api &> /dev/null; then
        heroku create kairo-api
    fi
    
    # Set environment variables
    heroku config:set NODE_ENV=production
    
    # Deploy
    git subtree push --prefix=backend heroku main
    
    cd ..
    
    print_success "Backend deployed to Heroku"
}

# Setup database
setup_database() {
    print_status "Setting up production database..."
    
    cd backend
    
    # Run migrations
    npx prisma migrate deploy
    
    # Seed database if needed
    read -p "Do you want to seed the database? (y/n): " seed_choice
    if [ "$seed_choice" = "y" ]; then
        npm run seed
    fi
    
    cd ..
    
    print_success "Database setup completed"
}

# Main deployment function
main() {
    print_status "KAIRO Trading Platform Deployment"
    print_status "==================================="
    
    # Check dependencies
    check_dependencies
    
    # Build applications
    build_frontend
    build_backend
    
    # Run tests
    run_tests
    
    # Deploy frontend
    deploy_to_vercel
    
    # Deploy backend
    deploy_backend
    
    # Setup database
    setup_database
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Frontend: https://www.kairoquantum.com"
    print_status "Backend API: https://api.kairoquantum.com"
    
    print_warning "Don't forget to:"
    echo "1. Configure your domain DNS settings"
    echo "2. Set up SSL certificates"
    echo "3. Configure environment variables"
    echo "4. Set up monitoring and logging"
    echo "5. Test all functionality in production"
}

# Run main function
main "$@"