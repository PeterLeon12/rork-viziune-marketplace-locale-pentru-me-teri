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
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  price: integer('price').notNull(),
  message: text('message').notNull(),
  estimatedTime: text('estimated_time').notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'rejected', 'completed'] }).notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scheduledDate: timestamp('scheduled_date').notNull(),
  status: text('status', { enum: ['confirmed', 'in_progress', 'completed', 'cancelled'] }).notNull().default('confirmed'),
  totalPrice: integer('total_price').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// OTP verifications table
export const otpVerifications = pgTable('otp_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull(),
  otp: text('otp').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Conversations table for messaging
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  lastMessage: text('last_message'),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Messages table for individual messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  messageType: text('message_type', { enum: ['text', 'image', 'file'] }).notNull().default('text'),
  attachmentUrl: text('attachment_url'),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Notifications table for push notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  type: text('type', { enum: ['job_update', 'message', 'application', 'booking', 'payment'] }).notNull(),
  data: jsonb('data'), // Additional data for the notification
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Enhanced Professional Profile Tables

// Professional skills table
export const professionalSkills = pgTable('professional_skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  skillName: text('skill_name').notNull(),
  skillLevel: text('skill_level', { enum: ['beginner', 'intermediate', 'advanced', 'expert'] }).notNull(),
  yearsExperience: integer('years_experience').default(0),
  verified: boolean('verified').default(false),
  verificationMethod: text('verification_method'), // 'certificate', 'portfolio', 'client_review', 'test'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Professional availability table
export const professionalAvailability = pgTable('professional_availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  timeSlot: text('time_slot').notNull(),
  available: boolean('available').default(true),
  booked: boolean('booked').default(false),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Professional portfolio table
export const professionalPortfolio = pgTable('professional_portfolio', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  images: text('images').array().default([]),
  projectDate: timestamp('project_date'),
  clientTestimonial: text('client_testimonial'),
  projectValue: integer('project_value'),
  durationDays: integer('duration_days'),
  categoryId: text('category_id').references(() => categories.id),
  tags: text('tags').array().default([]),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Service packages table for tiered pricing
export const servicePackages = pgTable('service_packages', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }),
  packageName: text('package_name').notNull(), // 'basic', 'standard', 'premium'
  packageDescription: text('package_description').notNull(),
  price: integer('price').notNull(),
  durationHours: integer('duration_hours'),
  includes: text('includes').array().default([]),
  excludes: text('excludes').array().default([]),
  popular: boolean('popular').default(false),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Professional certifications table
export const professionalCertifications = pgTable('professional_certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id').notNull().references(() => proProfiles.id, { onDelete: 'cascade' }),
  certificationName: text('certification_name').notNull(),
  issuingOrganization: text('issuing_organization').notNull(),
  issueDate: timestamp('issue_date'),
  expiryDate: timestamp('expiry_date'),
  certificateUrl: text('certificate_url'),
  verified: boolean('verified').default(false),
  verificationDate: timestamp('verification_date'),
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
    fields: [jobApplications.proId],
    references: [proProfiles.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  job: one(jobs, {
    fields: [bookings.jobId],
    references: [jobs.id],
  }),
  artisan: one(proProfiles, {
    fields: [bookings.proId],
    references: [proProfiles.id],
  }),
  client: one(users, {
    fields: [bookings.clientId],
    references: [users.id],
  }),
}));
