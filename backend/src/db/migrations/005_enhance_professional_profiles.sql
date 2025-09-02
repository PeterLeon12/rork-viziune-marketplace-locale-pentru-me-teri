-- Migration: Enhance professional profiles with advanced features
-- Date: 2024-01-15

-- Add new columns to pro_profiles table for enhanced features
ALTER TABLE pro_profiles 
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_schedule JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS price_range_max INTEGER,
ADD COLUMN IF NOT EXISTS business_license TEXT,
ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS background_checked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{ro}',
ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 10, -- in km
ADD COLUMN IF NOT EXISTS emergency_available BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS weekend_available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": {"start": "10:00", "end": "16:00"}, "sunday": {"closed": true}}'::jsonb,
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tools_equipment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS warranty_provided BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS travel_cost_per_km DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS minimum_job_value INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS response_time_actual_mins INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS total_jobs_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS repeat_customer_rate DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS location_coordinates POINT,
ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills_verified JSONB DEFAULT '{}'::jsonb;

-- Create professional skills table
CREATE TABLE IF NOT EXISTS professional_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT, -- 'certificate', 'portfolio', 'client_review', 'test'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create professional availability table
CREATE TABLE IF NOT EXISTS professional_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  booked BOOLEAN DEFAULT FALSE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create professional portfolio table
CREATE TABLE IF NOT EXISTS professional_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  project_date DATE,
  client_testimonial TEXT,
  project_value INTEGER,
  duration_days INTEGER,
  category_id TEXT REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create service packages table for tiered pricing
CREATE TABLE IF NOT EXISTS service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL, -- 'basic', 'standard', 'premium'
  package_description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration_hours INTEGER,
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create professional certifications table
CREATE TABLE IF NOT EXISTS professional_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_pro_profiles_experience ON pro_profiles(experience_years);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_price_range ON pro_profiles(min_price, price_range_max);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_location ON pro_profiles USING GIST(location_coordinates);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_completion_rate ON pro_profiles(completion_rate);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_total_jobs ON pro_profiles(total_jobs_completed);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_emergency ON pro_profiles(emergency_available);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_weekend ON pro_profiles(weekend_available);
CREATE INDEX IF NOT EXISTS idx_pro_profiles_service_radius ON pro_profiles(service_radius);

CREATE INDEX IF NOT EXISTS idx_professional_skills_pro_id ON professional_skills(pro_id);
CREATE INDEX IF NOT EXISTS idx_professional_skills_skill_name ON professional_skills(skill_name);
CREATE INDEX IF NOT EXISTS idx_professional_skills_level ON professional_skills(skill_level);
CREATE INDEX IF NOT EXISTS idx_professional_skills_verified ON professional_skills(verified);

CREATE INDEX IF NOT EXISTS idx_professional_availability_pro_id ON professional_availability(pro_id);
CREATE INDEX IF NOT EXISTS idx_professional_availability_date ON professional_availability(date);
CREATE INDEX IF NOT EXISTS idx_professional_availability_available ON professional_availability(available);

CREATE INDEX IF NOT EXISTS idx_professional_portfolio_pro_id ON professional_portfolio(pro_id);
CREATE INDEX IF NOT EXISTS idx_professional_portfolio_category ON professional_portfolio(category_id);
CREATE INDEX IF NOT EXISTS idx_professional_portfolio_visible ON professional_portfolio(visible);

CREATE INDEX IF NOT EXISTS idx_service_packages_pro_id ON service_packages(pro_id);
CREATE INDEX IF NOT EXISTS idx_service_packages_active ON service_packages(active);
CREATE INDEX IF NOT EXISTS idx_service_packages_popular ON service_packages(popular);

CREATE INDEX IF NOT EXISTS idx_professional_certifications_pro_id ON professional_certifications(pro_id);
CREATE INDEX IF NOT EXISTS idx_professional_certifications_verified ON professional_certifications(verified);
