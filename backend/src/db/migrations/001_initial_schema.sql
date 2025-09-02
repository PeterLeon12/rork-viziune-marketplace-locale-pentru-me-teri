-- Initial Database Schema
-- This creates the basic tables for the Meșterul marketplace

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'pro', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Professional profiles table
CREATE TABLE IF NOT EXISTS pro_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  company TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  zones TEXT[] NOT NULL,
  min_price INTEGER NOT NULL,
  about TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  response_time_avg_mins INTEGER DEFAULT 30,
  rating_avg INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  contact JSONB NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_from INTEGER NOT NULL,
  unit TEXT NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  recommend BOOLEAN DEFAULT TRUE,
  comment TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  verified_contact BOOLEAN DEFAULT FALSE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Areas table  
CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OTP verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  budget INTEGER NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  price INTEGER NOT NULL,
  estimated_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  service_title TEXT NOT NULL,
  service_description TEXT NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_user_id ON pro_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_verified ON pro_profiles(verified);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_is_active ON pro_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_services_pro_id ON services(pro_id);
CREATE INDEX IF NOT EXISTS idx_reviews_pro_id ON reviews(pro_id);
CREATE INDEX IF NOT EXISTS idx_reviews_client_id ON reviews(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_pro_id ON job_applications(pro_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pro_id ON bookings(pro_id);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone ON otp_verifications(phone);
