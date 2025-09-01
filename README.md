# 🏠 Rork Marketplace - Local Tradespeople Finder

A modern marketplace app for finding reliable tradespeople (meșteri) in Cluj-Napoca, Romania. Built with React Native, Expo, and a robust backend.

## ✨ Features

- **🔍 Smart Search**: Find tradespeople by category, area, rating, and availability
- **📱 Modern UI**: Beautiful, intuitive interface built with React Native
- **🔐 Secure Authentication**: Phone-based OTP verification via WhatsApp
- **⭐ Rating System**: Real reviews and ratings from verified customers
- **📍 Local Focus**: Tailored specifically for Cluj-Napoca market
- **💼 Professional Profiles**: Detailed profiles with services and contact information

## 🏗️ Architecture

- **Frontend**: React Native with Expo Router
- **Backend**: Hono.js with tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with phone OTP verification
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (optional, for database)
- PostgreSQL 15+ (if not using Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd rork-viziune-marketplace-locale-pentru-me-teri
```

### 2. Automated Setup (Recommended)
```bash
./setup.sh
```

### 3. Manual Setup
```bash
# Start database
docker-compose up -d postgres

# Setup backend
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev

# Setup frontend (in another terminal)
npm install
npm start
```

## 📱 App Structure

```
app/
├── (tabs)/           # Main tab navigation
│   ├── index.tsx     # Home screen
│   ├── search.tsx    # Search functionality
│   ├── messages.tsx  # Messaging (coming soon)
│   └── profile.tsx   # User profile & auth
├── pro/              # Professional onboarding
└── pro-onboarding.tsx

backend/
├── src/
│   ├── db/          # Database schema & connection
│   ├── trpc/        # tRPC API routers
│   ├── services/    # External services (Twilio)
│   └── utils/       # Authentication utilities
└── drizzle/         # Database migrations
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run db:studio    # Open database studio
npm run db:generate  # Generate new migrations
npm run db:migrate   # Run migrations
```

### Frontend Development
```bash
npm start           # Start Expo development server
npm run start-web   # Start web version
npm run lint        # Run linting
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy Options
- **Backend**: Railway, Heroku, or Vercel
- **Frontend**: EAS Build for mobile, Vercel for web
- **Database**: Supabase, Railway, or managed PostgreSQL

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET="your-secret-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Frontend (.env)
```env
EXPO_PUBLIC_BACKEND_URL="http://localhost:3000"
```

## 📊 Database Schema

- **Users**: Authentication and profile information
- **ProProfiles**: Professional service provider profiles
- **Services**: Individual services offered by professionals
- **Reviews**: Customer reviews and ratings
- **Categories**: Service categories (plumbing, electrical, etc.)
- **Areas**: Geographic coverage areas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [deployment guide](./DEPLOYMENT.md)
- Review the troubleshooting section
- Open an issue on GitHub

---

**Built with ❤️ for the Cluj-Napoca community**
