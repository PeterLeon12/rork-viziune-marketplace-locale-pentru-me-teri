# 🚀 Rork Marketplace - Deployment Guide

## 📋 Prerequisites

- Node.js 18+ and npm/bun
- PostgreSQL 15+
- Docker and Docker Compose (optional)
- Twilio account (for SMS/WhatsApp OTP)

## 🏗️ Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Copy the environment example and configure your variables:
```bash
cp env.example .env
```

Update `.env` with your actual values:
```env
# Database Configuration
DATABASE_URL="postgresql://rork_user:rork_password@localhost:5432/rork_marketplace"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Twilio Configuration
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Server Configuration
PORT=3000
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.com"
```

### 3. Database Setup

#### Option A: Using Docker (Recommended for development)
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for database to be ready
docker-compose logs postgres
```

#### Option B: Local PostgreSQL
```bash
# Create database and user
createdb rork_marketplace
psql -d rork_marketplace -c "CREATE USER rork_user WITH PASSWORD 'rork_password';"
psql -d rork_marketplace -c "GRANT ALL PRIVILEGES ON DATABASE rork_marketplace TO rork_user;"
```

### 4. Run Database Migrations
```bash
cd backend
npm run db:generate
npm run db:migrate
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

### 6. Start Backend Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📱 Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env` file in the root directory:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

### 3. Start Frontend
```bash
# Development
npm start

# Web version
npm run start-web
```

## 🌐 Production Deployment

### Backend Deployment (Railway/Heroku/Vercel)

1. **Railway** (Recommended)
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   Set these in your hosting platform:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `NODE_ENV=production`
   - `CORS_ORIGIN`

### Frontend Deployment

1. **Expo Application Services (EAS)**
   ```bash
   # Install EAS CLI
   npm install -g @expo/eas-cli

   # Login to Expo
   eas login

   # Configure build
   eas build:configure

   # Build for production
   eas build --platform all
   ```

2. **Web Deployment**
   ```bash
   # Build for web
   npm run start-web

   # Deploy to Vercel/Netlify
   ```

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN is properly configured
- [ ] Database connection uses SSL in production
- [ ] Rate limiting is implemented
- [ ] Input validation is enabled
- [ ] Error messages don't expose sensitive information

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /` returns status
- Database: Connection pool monitoring
- tRPC: Endpoint availability

### Logging
- Application logs
- Database query logs
- Error tracking

### Backup Strategy
- Database backups (daily)
- User data export
- Configuration backups

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify PostgreSQL is running
   - Check firewall settings

2. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check frontend URL configuration

3. **OTP Not Sending**
   - Verify Twilio credentials
   - Check phone number format
   - Review Twilio logs

4. **Build Failures**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Verify TypeScript configuration

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- Connection pooling
- Caching strategies
- CDN for static assets
- Image optimization

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Your deployment commands
```

## 📞 Support

For deployment issues:
1. Check logs in your hosting platform
2. Verify environment variables
3. Test locally first
4. Check database connectivity

---

**Happy Deploying! 🎉**
