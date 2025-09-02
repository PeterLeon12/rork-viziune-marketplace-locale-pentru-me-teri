#!/bin/bash

echo "🚀 Starting Rork Marketplace Deployment..."

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

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI is not installed. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    print_warning "Please log in to Railway first:"
    echo "railway login"
    exit 1
fi

print_status "Building backend..."
cd backend
npm run build

if [ $? -ne 0 ]; then
    print_error "Backend build failed!"
    exit 1
fi

print_success "Backend built successfully!"

print_status "Deploying to Railway..."
railway deploy

if [ $? -ne 0 ]; then
    print_error "Railway deployment failed!"
    exit 1
fi

print_success "Backend deployed to Railway!"

# Get the deployed URL
BACKEND_URL=$(railway domain)
print_success "Backend URL: $BACKEND_URL"

print_status "Setting up environment variables..."
echo "Please set these environment variables in Railway dashboard:"
echo "1. DATABASE_URL (use Railway PostgreSQL addon)"
echo "2. JWT_SECRET (generate a secure random string)"
echo "3. CORS_ORIGIN (your frontend domain)"
echo "4. TWILIO_* (if using SMS/WhatsApp)"

print_status "Frontend deployment..."
cd ..
echo "For frontend deployment:"
echo "1. Update EXPO_PUBLIC_RORK_API_BASE_URL to: $BACKEND_URL"
echo "2. Run: npx eas build --platform all"
echo "3. Or deploy to Vercel: vercel --prod"

print_success "Deployment setup complete!"
print_warning "Don't forget to:"
echo "- Set up PostgreSQL database in Railway"
echo "- Configure environment variables"
echo "- Update frontend API URL"
echo "- Test the deployed backend"
