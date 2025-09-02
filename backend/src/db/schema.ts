import { pgTable, text, timestamp, integer, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  name: text('name').notNull(),
  role: text('role', { enum: ['client', 'pro', 'admin'] }).notNull().default('client'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Professional profiles table
export const proProfiles = pgTable('pro_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  company: text('company').notNull(),
  categories: text('categories').array().notNull(),
  zones: text('zones').array().notNull(),
  minPrice: integer('min_price').notNull(),
  about: text('about').notNull(),
  verified: boolean('verified').notNull().default(false),
  responseTimeAvgMins: integer('response_time_avg_mins').notNull().default(30),
  ratingAvg: integer('rating_avg').notNull().default(0),
  ratingCount: integer('rating_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  contact: jsonb('contact').notNull(), // { phone: string, whatsappLink: string }
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Services table
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priceFrom: integer('price_from').notNull(),
  unit: text('unit').notNull(),
  visible: boolean('visible').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientName: text('client_name').notNull(),
  rating: integer('rating').notNull(),
  recommend: boolean('recommend').notNull().default(true),
  comment: text('comment').notNull(),
  photos: text('photos').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  verifiedContact: boolean('verified_contact').notNull().default(false),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Areas table
export const areas = pgTable('areas', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Jobs table (posted by clients)
export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  area: text('area').notNull(),
  budget: integer('budget'), // in RON
  urgency: text('urgency', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull().default('medium'),
  status: text('status', { enum: ['open', 'in_progress', 'completed', 'cancelled'] }).notNull().default('open'),
  photos: text('photos').array(), // URLs to uploaded photos
  location: jsonb('location'), // { address: string, lat: number, lng: number }
  scheduledDate: timestamp('scheduled_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Job applications table (artisans applying to jobs)
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  artisanId: uuid('artisan_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  proposedPrice: integer('proposed_price'), // in RON
  estimatedDuration: text('estimated_duration'), // e.g., "2 hours", "1 day"
  status: text('status', { enum: ['pending', 'accepted', 'rejected'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Bookings table (confirmed appointments)
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  artisanId: uuid('artisan_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scheduledDate: timestamp('scheduled_date').notNull(),
  duration: integer('duration'), // in minutes
  price: integer('price').notNull(), // in RON
  status: text('status', { enum: ['scheduled', 'in_progress', 'completed', 'cancelled'] }).notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// OTP verification table
export const otpVerifications = pgTable('otp_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull(),
  otp: text('otp').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  proProfile: many(proProfiles),
  reviews: many(reviews),
  jobs: many(jobs),
  bookings: many(bookings),
}));

export const proProfilesRelations = relations(proProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [proProfiles.userId],
    references: [users.id],
  }),
  services: many(services),
  reviews: many(reviews),
  jobApplications: many(jobApplications),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  proProfile: one(proProfiles, {
    fields: [services.proId],
    references: [proProfiles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  proProfile: one(proProfiles, {
    fields: [reviews.proId],
    references: [proProfiles.id],
  }),
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
  }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  client: one(users, {
    fields: [jobs.clientId],
    references: [users.id],
  }),
  applications: many(jobApplications),
  bookings: many(bookings),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  artisan: one(proProfiles, {
    fields: [jobApplications.artisanId],
    references: [proProfiles.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  job: one(jobs, {
    fields: [bookings.jobId],
    references: [jobs.id],
  }),
  artisan: one(proProfiles, {
    fields: [bookings.artisanId],
    references: [proProfiles.id],
  }),
  client: one(users, {
    fields: [bookings.clientId],
    references: [users.id],
  }),
}));
