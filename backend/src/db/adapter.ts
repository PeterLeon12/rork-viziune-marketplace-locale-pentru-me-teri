// Database adapter that can work with both PostgreSQL and mock data
import { mockDbOperations, initializeMockDb } from './mock-db';

// Check if we have a real database connection
const hasRealDb = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://');

let realDb: any = null;

// Try to import real database if available
if (hasRealDb) {
  try {
    const { db } = require('./index');
    realDb = db;
    console.log('✅ Using PostgreSQL database');
  } catch (error) {
    console.log('⚠️  PostgreSQL not available, using mock database');
    initializeMockDb();
  }
} else {
  console.log('📝 Using mock database for development');
  initializeMockDb();
}

// Database operations interface
export const db = {
  // Users
  createUser: async (user: any) => {
    if (realDb) {
      // Real database implementation
      const { users } = require('./schema');
      const result = await realDb.insert(users).values(user).returning();
      return result[0];
    } else {
      // Mock database implementation
      return mockDbOperations.createUser(user);
    }
  },

  getUserByPhone: async (phone: string) => {
    if (realDb) {
      const { users } = require('./schema');
      const { eq } = require('drizzle-orm');
      const result = await realDb.select().from(users).where(eq(users.phone, phone)).limit(1);
      return result[0] || null;
    } else {
      return mockDbOperations.getUserByPhone(phone);
    }
  },

  getUserById: async (id: string) => {
    if (realDb) {
      const { users } = require('./schema');
      const { eq } = require('drizzle-orm');
      const result = await realDb.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || null;
    } else {
      return mockDbOperations.getUserById(id);
    }
  },

  updateUser: async (id: string, updates: any) => {
    if (realDb) {
      const { users } = require('./schema');
      const { eq } = require('drizzle-orm');
      const result = await realDb.update(users).set(updates).where(eq(users.id, id)).returning();
      return result[0] || null;
    } else {
      return mockDbOperations.updateUser(id, updates);
    }
  },

  // OTP Verifications
  createOTP: async (phone: string, otp: string, expiresAt: Date) => {
    if (realDb) {
      const { otpVerifications } = require('./schema');
      const result = await realDb.insert(otpVerifications).values({
        phone,
        otp,
        expiresAt,
        verified: false,
      }).returning();
      return result[0];
    } else {
      return mockDbOperations.createOTP(phone, otp, expiresAt);
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    if (realDb) {
      const { otpVerifications } = require('./schema');
      const { eq, and, gt } = require('drizzle-orm');
      const result = await realDb
        .select()
        .from(otpVerifications)
        .where(
          and(
            eq(otpVerifications.phone, phone),
            eq(otpVerifications.otp, otp),
            gt(otpVerifications.expiresAt, new Date()),
            eq(otpVerifications.verified, false)
          )
        )
        .limit(1);
      
      if (result.length > 0) {
        await realDb
          .update(otpVerifications)
          .set({ verified: true })
          .where(eq(otpVerifications.id, result[0].id));
        return result[0];
      }
      return null;
    } else {
      return mockDbOperations.verifyOTP(phone, otp);
    }
  },

  // Profiles
  getProfiles: async (filters: any = {}) => {
    if (realDb) {
      // Real database implementation would go here
      // For now, return mock data
      return mockDbOperations.getProfiles(filters);
    } else {
      return mockDbOperations.getProfiles(filters);
    }
  },

  getProfileById: async (id: string) => {
    if (realDb) {
      // Real database implementation would go here
      return mockDbOperations.getProfileById(id);
    } else {
      return mockDbOperations.getProfileById(id);
    }
  },

  createProfile: async (profile: any) => {
    if (realDb) {
      // Real database implementation would go here
      return mockDbOperations.createProfile(profile);
    } else {
      return mockDbOperations.createProfile(profile);
    }
  },

  updateProfile: async (id: string, updates: any) => {
    if (realDb) {
      // Real database implementation would go here
      return mockDbOperations.updateProfile(id, updates);
    } else {
      return mockDbOperations.updateProfile(id, updates);
    }
  },

  // Services
  getServicesByProId: async (proId: string) => {
    if (realDb) {
      return mockDbOperations.getServicesByProId(proId);
    } else {
      return mockDbOperations.getServicesByProId(proId);
    }
  },

  // Reviews
  getReviewsByProId: async (proId: string) => {
    if (realDb) {
      return mockDbOperations.getReviewsByProId(proId);
    } else {
      return mockDbOperations.getReviewsByProId(proId);
    }
  },

  // Categories and Areas
  getCategories: async () => {
    if (realDb) {
      return mockDbOperations.getCategories();
    } else {
      return mockDbOperations.getCategories();
    }
  },

  getAreas: async () => {
    if (realDb) {
      return mockDbOperations.getAreas();
    } else {
      return mockDbOperations.getAreas();
    }
  },
};
