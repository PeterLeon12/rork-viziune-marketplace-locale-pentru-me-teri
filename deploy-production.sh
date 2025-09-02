#!/bin/bash

echo "🚀 Starting Full Production Deployment for Rork Marketplace"
echo "=========================================================="

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
    print_error "Railway CLI is not installed. Installing now..."
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    print_warning "Please log in to Railway first:"
    echo "1. Run: railway login"
    echo "2. Follow the browser authentication"
    echo "3. Then run this script again"
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

# Get the Railway URL
RAILWAY_URL=$(railway domain)
print_status "Backend URL: https://$RAILWAY_URL"

print_status "Setting up environment variables in Railway..."
echo "Please set these environment variables in your Railway dashboard:"
echo ""
echo "DATABASE_URL=postgresql://user:password@host:port/database"
echo "JWT_SECRET=rork-marketplace-super-secret-jwt-key-2024-production"
echo "CORS_ORIGIN=https://your-app.vercel.app,exp://your-expo-url"
echo "NODE_ENV=production"
echo "USE_MOCK_DB=false"
echo ""
echo "Optional (for real OTP):"
echo "TWILIO_ACCOUNT_SID=your-twilio-account-sid"
echo "TWILIO_AUTH_TOKEN=your-twilio-auth-token"
echo "TWILIO_PHONE_NUMBER=+1234567890"

print_status "Adding PostgreSQL database..."
echo "1. Go to your Railway project dashboard"
echo "2. Click 'New' → 'Database' → 'PostgreSQL'"
echo "3. Copy the connection string to DATABASE_URL"

print_status "Running database migrations..."
echo "After setting DATABASE_URL, run:"
echo "railway run npm run db:migrate"
echo "railway run npm run db:seed"

print_status "Frontend deployment instructions:"
echo "1. Update EXPO_PUBLIC_RORK_API_BASE_URL in .env:"
echo "   EXPO_PUBLIC_RORK_API_BASE_URL=https://$RAILWAY_URL"
echo ""
echo "2. Deploy frontend:"
echo "   npx expo build --platform all"

print_success "Production deployment setup complete!"
print_status "Next steps:"
echo "1. Set environment variables in Railway"
echo "2. Add PostgreSQL database"
echo "3. Run database migrations"
echo "4. Update frontend API URL"
echo "5. Deploy frontend"

echo ""
print_success "🎉 Your Rork Marketplace is ready for production!"
