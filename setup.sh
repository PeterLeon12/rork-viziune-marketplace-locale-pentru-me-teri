#!/bin/bash

echo "🚀 Setting up Rork Marketplace Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to set up PostgreSQL manually."
    echo "   Please follow the manual setup instructions in DEPLOYMENT.md"
else
    echo "🐳 Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Check if database is ready
    if docker-compose exec postgres pg_isready -U rork_user -d rork_marketplace; then
        echo "✅ Database is ready!"
    else
        echo "❌ Database is not ready. Please check Docker logs."
        exit 1
    fi
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual configuration values!"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - Twilio credentials (optional for development)"
else
    echo "✅ .env file already exists"
fi

# Generate database migrations
echo "🗄️  Generating database migrations..."
npm run db:generate

# Run migrations
echo "🔄 Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Backend setup completed!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: npm start"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
