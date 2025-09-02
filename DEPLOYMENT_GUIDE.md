# 🚀 Rork Marketplace - Production Deployment Guide

## 📋 Prerequisites

- [Railway](https://railway.app) account (for backend)
- [EAS](https://expo.dev) account (for mobile app)
- [Vercel](https://vercel.com) account (for web app)
- [Twilio](https://twilio.com) account (for SMS/WhatsApp)

## 🎯 Deployment Options

### Option 1: Full Production (Recommended)
- **Backend**: Railway + PostgreSQL
- **Mobile**: EAS Build + App Store/Play Store
- **Web**: Vercel

### Option 2: Quick Demo
- **Backend**: Railway (mock database)
- **Mobile**: Expo Go (development)
- **Web**: Vercel

## 🔧 Backend Deployment (Railway)

### Step 1: Prepare Backend
```bash
cd backend
npm run build
```

### Step 2: Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway deploy
```

### Step 3: Set Environment Variables
In Railway dashboard, add these variables:

```env
# Database (use Railway PostgreSQL addon)
DATABASE_URL=postgresql://...

# JWT Secret (generate secure random string)
JWT_SECRET=your-super-secret-jwt-key

# CORS (your frontend domain)
CORS_ORIGIN=https://your-domain.com

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Production settings
NODE_ENV=production
USE_MOCK_DB=false
```

### Step 4: Add PostgreSQL Database
1. In Railway dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Copy the connection string to `DATABASE_URL`

## 📱 Mobile App Deployment (EAS Build)

### Step 1: Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Step 2: Configure EAS
```bash
eas login
eas build:configure
```

### Step 3: Update API URL
Update `EXPO_PUBLIC_RORK_API_BASE_URL` in `.env`:
```env
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-railway-backend.railway.app
```

### Step 4: Build for Production
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### Step 5: Submit to App Stores
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## 🌐 Web App Deployment (Vercel)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Configure Environment
```bash
vercel env add EXPO_PUBLIC_RORK_API_BASE_URL
# Enter: https://your-railway-backend.railway.app
```

### Step 3: Deploy
```bash
vercel --prod
```

## 🔄 Automated Deployment

### Using the Deploy Script
```bash
./deploy.sh
```

This script will:
1. Build the backend
2. Deploy to Railway
3. Provide instructions for frontend deployment

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-railway-backend.railway.app/
```

### API Endpoints Test
```bash
# Categories
curl https://your-railway-backend.railway.app/trpc/profiles.getCategories

# Search
curl "https://your-railway-backend.railway.app/trpc/profiles.searchProfiles?input=%7B%7D"
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Set up proper CORS origins
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure database backups
- [ ] Set up monitoring (Railway Pro)

## 📊 Monitoring & Analytics

### Railway
- Built-in metrics and logs
- Uptime monitoring
- Performance insights

### EAS
- Build analytics
- Crash reporting
- Performance monitoring

### Vercel
- Web analytics
- Performance insights
- Error tracking

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check environment variables
   - Verify database connection
   - Check Railway logs

2. **Frontend can't connect**
   - Verify API URL
   - Check CORS settings
   - Test backend endpoints

3. **Build failures**
   - Check dependencies
   - Verify configuration files
   - Review build logs

### Support
- Railway: [docs.railway.app](https://docs.railway.app)
- EAS: [docs.expo.dev](https://docs.expo.dev)
- Vercel: [vercel.com/docs](https://vercel.com/docs)

## 🎉 Post-Deployment

1. **Test all features**
2. **Set up monitoring**
3. **Configure backups**
4. **Update documentation**
5. **Share with team**

---

**Your Rork Marketplace is now live! 🚀**
