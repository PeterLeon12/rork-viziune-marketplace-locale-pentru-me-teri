import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db/adapter';
import { proProfiles, services, reviews, categories, areas } from '../db/schema';
import { eq, inArray, gte, lte, desc, asc, and, or, like } from 'drizzle-orm';
import { 
  focusedCategories, 
  getPopularCategories, 
  getAllCategories, 
  searchCategories 
} from '../db/comprehensive-categories';

const searchProfilesSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  area: z.string().optional(),
  minRating: z.number().min(1).max(5).optional(),
  verified: z.boolean().optional(),
  availableNow: z.boolean().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['recommended', 'rating', 'price', 'responseTime']).optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

const createProfileSchema = z.object({
  displayName: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  categories: z.array(z.string()),
  zones: z.array(z.string()),
  minPrice: z.number().min(0),
  about: z.string().min(10).max(1000),
  contact: z.object({
    phone: z.string(),
    whatsappLink: z.string().url(),
  }),
  photoUrl: z.string().url().optional(),
});

const updateProfileSchema = createProfileSchema.partial();

export const profilesRouter = createTRPCRouter({
  searchProfiles: publicProcedure
    .input(searchProfilesSchema)
    .query(async ({ input }) => {
      try {
        const {
          query,
          category,
          area,
          minRating,
          verified,
          availableNow,
          maxPrice,
          sortBy = 'recommended',
          limit = 20,
          offset = 0,
        } = input;

        let whereConditions = [];

        // Filter by category
        if (category) {
          whereConditions.push(eq(proProfiles.categories, [category]));
        }

        // Filter by area
        if (area) {
          whereConditions.push(eq(proProfiles.zones, [area]));
        }

        // Filter by minimum rating
        if (minRating) {
          whereConditions.push(gte(proProfiles.ratingAvg, minRating));
        }

        // Filter by verification status
        if (verified !== undefined) {
          whereConditions.push(eq(proProfiles.verified, verified));
        }

        // Filter by availability
        if (availableNow !== undefined) {
          whereConditions.push(eq(proProfiles.isActive, availableNow));
        }

        // Filter by maximum price
        if (maxPrice) {
          whereConditions.push(lte(proProfiles.minPrice, maxPrice));
        }

        // Filter by search query
        if (query) {
          whereConditions.push(
            or(
              like(proProfiles.displayName, `%${query}%`),
              like(proProfiles.company, `%${query}%`),
              like(proProfiles.about, `%${query}%`)
            )
          );
        }

        // Build where clause
        const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        // Get profiles with filters and sorting
        const profiles = await db.getProfiles({
          ...input,
          sortBy,
        });

        return {
          profiles,
          pagination: {
            total: profiles.length,
            limit,
            offset,
            hasMore: false, // Simplified for mock data
          },
        };
      } catch (error) {
        console.error('Error in searchProfiles:', error);
        throw new Error('Failed to search profiles');
      }
    }),

  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const profile = await db.getProfileById(input.id);

        if (!profile) {
          throw new Error('Profile not found');
        }

        // Get services for this profile
        const profileServices = await db.getServicesByProId(input.id);

        // Get reviews for this profile
        const profileReviews = await db.getReviewsByProId(input.id);

        return {
          profile,
          services: profileServices,
          reviews: profileReviews,
        };
      } catch (error) {
        console.error('Error in getProfileById:', error);
        throw new Error('Failed to get profile');
      }
    }),

  createProfile: protectedProcedure
    .input(createProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Create new profile
        const newProfile = await db.createProfile({
          userId: ctx.user.userId,
          ...input,
        });

        // Update user role to 'pro'
        await db.updateUser(ctx.user.userId, { role: 'pro' });

        return {
          success: true,
          profile: newProfile,
        };
      } catch (error) {
        console.error('Error in createProfile:', error);
        throw new Error('Failed to create profile');
      }
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Update profile
        const updatedProfile = await db.updateProfile(ctx.user.userId, {
          ...input,
          updatedAt: new Date(),
        });

        if (!updatedProfile) {
          throw new Error('Profile not found');
        }

        return {
          success: true,
          profile: updatedProfile,
        };
      } catch (error) {
        console.error('Error in updateProfile:', error);
        throw new Error('Failed to update profile');
      }
    }),

  getCategories: publicProcedure
    .query(async () => {
      try {
        // Return focused categories instead of database categories
        return focusedCategories;
      } catch (error) {
        console.error('Error in getCategories:', error);
        throw new Error('Failed to get categories');
      }
    }),

  getPopularCategories: publicProcedure
    .query(async () => {
      try {
        return getPopularCategories();
      } catch (error) {
        console.error('Error in getPopularCategories:', error);
        throw new Error('Failed to get popular categories');
      }
    }),

  getAllCategories: publicProcedure
    .query(async () => {
      try {
        return getAllCategories();
      } catch (error) {
        console.error('Error in getAllCategories:', error);
        throw new Error('Failed to get all categories');
      }
    }),

  searchCategories: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return searchCategories(input.query);
      } catch (error) {
        console.error('Error in searchCategories:', error);
        throw new Error('Failed to search categories');
      }
    }),

  getAreas: publicProcedure
    .query(async () => {
      try {
        return await db.getAreas();
      } catch (error) {
        console.error('Error in getAreas:', error);
        throw new Error('Failed to get areas');
      }
    }),

  // Monetization: Get commission history
  getCommissionHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Get user's completed jobs and calculate commissions
        // For now, return mock data until we implement the database method
        const mockCommissions = [
          {
            jobId: '1',
            jobTitle: 'Reparație ușă garaj',
            amount: 350,
            commission: 17.5, // 5% commission
            status: 'pending' as const,
            completedDate: new Date('2024-01-15'),
          },
          {
            jobId: '2',
            jobTitle: 'Instalare sistem încălzire',
            amount: 6500,
            commission: 325, // 5% commission
            status: 'paid' as const,
            completedDate: new Date('2024-01-10'),
          }
        ];
        
        return {
          commissions: mockCommissions.slice(input.offset, input.offset + input.limit),
          total: mockCommissions.length,
          totalEarnings: mockCommissions.reduce((sum: number, c: any) => sum + c.commission, 0),
        };
      } catch (error) {
        console.error('Error in getCommissionHistory:', error);
        throw new Error('Failed to get commission history');
      }
    }),
});
