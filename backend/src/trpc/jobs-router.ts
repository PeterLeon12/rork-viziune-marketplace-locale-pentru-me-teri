import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db';
import { jobs, jobApplications, bookings, users, proProfiles } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export const jobsRouter = createTRPCRouter({
  // Get all open jobs (for artisans to browse)
  getOpenJobs: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      area: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const { category, area, limit, offset } = input;
      
      let conditions = [eq(jobs.status, 'open')];
      
      if (category) {
        conditions.push(eq(jobs.category, category));
      }
      if (area) {
        conditions.push(eq(jobs.area, area));
      }

      const results = await db
        .select({
          id: jobs.id,
          title: jobs.title,
          description: jobs.description,
          category: jobs.category,
          area: jobs.area,
          budget: jobs.budget,
          urgency: jobs.urgency,
          photos: jobs.photos,
          location: jobs.location,
          scheduledDate: jobs.scheduledDate,
          createdAt: jobs.createdAt,
          client: {
            id: users.id,
            name: users.name,
            phone: users.phone,
          },
        })
        .from(jobs)
        .innerJoin(users, eq(jobs.clientId, users.id))
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt))
        .limit(limit)
        .offset(offset);

      const results = await query;
      
      return {
        jobs: results,
        pagination: {
          total: results.length,
          limit,
          offset,
          hasMore: results.length === limit,
        },
      };
    }),

  // Create a new job (for clients)
  createJob: protectedProcedure
    .input(z.object({
      title: z.string().min(5).max(100),
      description: z.string().min(10).max(1000),
      category: z.string(),
      area: z.string(),
      budget: z.number().min(0).optional(),
      urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      photos: z.array(z.string().url()).optional(),
      location: z.object({
        address: z.string(),
        lat: z.number(),
        lng: z.number(),
      }).optional(),
      scheduledDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'client') {
        throw new Error('Only clients can create jobs');
      }

      const newJob = await db.insert(jobs).values({
        clientId: ctx.user.userId,
        ...input,
      }).returning();

      return newJob[0];
    }),

  // Apply to a job (for artisans)
  applyToJob: protectedProcedure
    .input(z.object({
      jobId: z.string(),
      message: z.string().min(10).max(500),
      proposedPrice: z.number().min(0).optional(),
      estimatedDuration: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'pro') {
        throw new Error('Only artisans can apply to jobs');
      }

      // Get the artisan's profile
      const artisanProfile = await db
        .select()
        .from(proProfiles)
        .where(eq(proProfiles.userId, ctx.user.userId))
        .limit(1);

      if (!artisanProfile.length) {
        throw new Error('Artisan profile not found');
      }

      // Check if already applied
      const existingApplication = await db
        .select()
        .from(jobApplications)
        .where(
          and(
            eq(jobApplications.jobId, input.jobId),
            eq(jobApplications.artisanId, artisanProfile[0].id)
          )
        )
        .limit(1);

      if (existingApplication.length > 0) {
        throw new Error('Already applied to this job');
      }

      const newApplication = await db.insert(jobApplications).values({
        jobId: input.jobId,
        artisanId: artisanProfile[0].id,
        message: input.message,
        proposedPrice: input.proposedPrice,
        estimatedDuration: input.estimatedDuration,
      }).returning();

      return newApplication[0];
    }),

  // Get job applications for a specific job (for clients)
  getJobApplications: protectedProcedure
    .input(z.object({
      jobId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const applications = await db
        .select({
          id: jobApplications.id,
          message: jobApplications.message,
          proposedPrice: jobApplications.proposedPrice,
          estimatedDuration: jobApplications.estimatedDuration,
          status: jobApplications.status,
          createdAt: jobApplications.createdAt,
          artisan: {
            id: proProfiles.id,
            displayName: proProfiles.displayName,
            company: proProfiles.company,
            ratingAvg: proProfiles.ratingAvg,
            ratingCount: proProfiles.ratingCount,
            verified: proProfiles.verified,
            photoUrl: proProfiles.photoUrl,
          },
        })
        .from(jobApplications)
        .innerJoin(proProfiles, eq(jobApplications.artisanId, proProfiles.id))
        .where(eq(jobApplications.jobId, input.jobId))
        .orderBy(desc(jobApplications.createdAt));

      return applications;
    }),

  // Accept a job application (for clients)
  acceptApplication: protectedProcedure
    .input(z.object({
      applicationId: z.string(),
      scheduledDate: z.date(),
      duration: z.number().min(30).max(480), // 30 minutes to 8 hours
      price: z.number().min(0),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the application with job details
      const application = await db
        .select({
          id: jobApplications.id,
          jobId: jobApplications.jobId,
          artisanId: jobApplications.artisanId,
          job: {
            clientId: jobs.clientId,
            title: jobs.title,
          },
        })
        .from(jobApplications)
        .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .where(eq(jobApplications.id, input.applicationId))
        .limit(1);

      if (!application.length) {
        throw new Error('Application not found');
      }

      if (application[0].job.clientId !== ctx.user?.userId) {
        throw new Error('Not authorized to accept this application');
      }

      // Create booking
      const newBooking = await db.insert(bookings).values({
        jobId: application[0].jobId,
        artisanId: application[0].artisanId,
        clientId: ctx.user.userId,
        scheduledDate: input.scheduledDate,
        duration: input.duration,
        price: input.price,
        notes: input.notes,
      }).returning();

      // Update application status
      await db
        .update(jobApplications)
        .set({ status: 'accepted' })
        .where(eq(jobApplications.id, input.applicationId));

      // Update job status
      await db
        .update(jobs)
        .set({ status: 'in_progress' })
        .where(eq(jobs.id, application[0].jobId));

      return newBooking[0];
    }),

  // Get user's jobs (for clients)
  getMyJobs: protectedProcedure
    .input(z.object({
      status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'client') {
        throw new Error('Only clients can view their jobs');
      }

      let conditions = [eq(jobs.clientId, ctx.user.userId)];
      
      if (input.status) {
        conditions.push(eq(jobs.status, input.status));
      }

      const results = await db
        .select()
        .from(jobs)
        .where(and(...conditions))
        .orderBy(desc(jobs.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // Get artisan's applications (for artisans)
  getMyApplications: protectedProcedure
    .input(z.object({
      status: z.enum(['pending', 'accepted', 'rejected']).optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'pro') {
        throw new Error('Only artisans can view their applications');
      }

      // Get artisan profile
      const artisanProfile = await db
        .select()
        .from(proProfiles)
        .where(eq(proProfiles.userId, ctx.user.userId))
        .limit(1);

      if (!artisanProfile.length) {
        throw new Error('Artisan profile not found');
      }

      let conditions = [eq(jobApplications.artisanId, artisanProfile[0].id)];
      
      if (input.status) {
        conditions.push(eq(jobApplications.status, input.status));
      }

      const results = await db
        .select({
          id: jobApplications.id,
          message: jobApplications.message,
          proposedPrice: jobApplications.proposedPrice,
          estimatedDuration: jobApplications.estimatedDuration,
          status: jobApplications.status,
          createdAt: jobApplications.createdAt,
          job: {
            id: jobs.id,
            title: jobs.title,
            description: jobs.description,
            category: jobs.category,
            area: jobs.area,
            budget: jobs.budget,
            urgency: jobs.urgency,
            status: jobs.status,
            photos: jobs.photos,
            location: jobs.location,
            scheduledDate: jobs.scheduledDate,
            createdAt: jobs.createdAt,
          },
        })
        .from(jobApplications)
        .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
        .where(and(...conditions))
        .orderBy(desc(jobApplications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),
});
