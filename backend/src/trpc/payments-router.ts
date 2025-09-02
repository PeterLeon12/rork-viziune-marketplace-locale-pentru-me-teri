import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db';
import { users, bookings, jobs } from '../db/schema';
import { eq } from 'drizzle-orm';

// Mock Stripe integration - replace with real Stripe SDK
const mockStripe = {
  createPaymentIntent: async (amount: number, currency: string) => ({
    id: `pi_${Math.random().toString(36).substr(2, 9)}`,
    client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency,
    status: 'requires_payment_method',
  }),
  
  createCustomer: async (email: string, name: string) => ({
    id: `cus_${Math.random().toString(36).substr(2, 9)}`,
    email,
    name,
  }),
  
  createSubscription: async (customerId: string, priceId: string) => ({
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    customer: customerId,
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  }),
};

export const paymentsRouter = createTRPCRouter({
  // Create payment intent for job payment
  createJobPaymentIntent: protectedProcedure
    .input(z.object({
      jobId: z.string(),
      amount: z.number(), // in cents
      currency: z.string().default('ron'),
      customerEmail: z.string(),
      customerName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Create or get customer
        const customer = await mockStripe.createCustomer(
          input.customerEmail,
          input.customerName
        );

        // Create payment intent
        const paymentIntent = await mockStripe.createPaymentIntent(
          input.amount,
          input.currency
        );

        return {
          clientSecret: paymentIntent.client_secret,
          customerId: customer.id,
          paymentIntentId: paymentIntent.id,
        };
      } catch (error) {
        throw new Error('Failed to create payment intent');
      }
    }),

  // Confirm job payment
  confirmJobPayment: protectedProcedure
    .input(z.object({
      paymentIntentId: z.string(),
      jobId: z.string(),
      proId: z.string(),
      amount: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        // In real implementation, verify payment with Stripe webhook
        // For now, we'll simulate successful payment
        
        // Create booking
        const [newBooking] = await db
          .insert(bookings)
          .values({
            jobId: input.jobId,
            proId: input.proId,
            clientId: 'temp-client-id', // Get from context in real implementation
            scheduledDate: new Date(),
            status: 'confirmed',
            totalPrice: input.amount,
            notes: 'Payment confirmed',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        // Update job status
        await db
          .update(jobs)
          .set({ 
            status: 'in_progress',
            updatedAt: new Date(),
          })
          .where(eq(jobs.id, input.jobId));

        return {
          success: true,
          booking: newBooking,
          message: 'Payment confirmed and booking created',
        };
      } catch (error) {
        throw new Error('Failed to confirm payment');
      }
    }),

  // Create subscription payment
  createSubscriptionPayment: protectedProcedure
    .input(z.object({
      userId: z.string(),
      planId: z.string(),
      priceId: z.string(),
      customerEmail: z.string(),
      customerName: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Create or get customer
        const customer = await mockStripe.createCustomer(
          input.customerEmail,
          input.customerName
        );

        // Create subscription
        const subscription = await mockStripe.createSubscription(
          customer.id,
          input.priceId
        );

        // Update user role based on plan
        const planRoleMap: Record<string, 'client' | 'pro' | 'admin'> = {
          'basic': 'pro',
          'premium': 'pro',
          'enterprise': 'pro',
        };

        const newRole = planRoleMap[input.planId] || 'client';
        
        await db
          .update(users)
          .set({ 
            role: newRole,
            updatedAt: new Date(),
          })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          subscriptionId: subscription.id,
          customerId: customer.id,
          message: 'Subscription created successfully',
        };
      } catch (error) {
        throw new Error('Failed to create subscription');
      }
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      try {
        // Get user's bookings (payments)
        const userBookings = await db
          .select()
          .from(bookings)
          .where(eq(bookings.clientId, input.userId))
          .limit(input.limit)
          .offset(input.offset);

        return userBookings.map(booking => ({
          id: booking.id,
          type: 'job_payment',
          amount: booking.totalPrice,
          status: booking.status,
          date: booking.createdAt,
          description: `Payment for job ${booking.jobId}`,
        }));
      } catch (error) {
        throw new Error('Failed to fetch payment history');
      }
    }),

  // Process refund
  processRefund: protectedProcedure
    .input(z.object({
      paymentIntentId: z.string(),
      amount: z.number().optional(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // In real implementation, process refund through Stripe
        // For now, simulate successful refund
        
        return {
          success: true,
          refundId: `re_${Math.random().toString(36).substr(2, 9)}`,
          amount: input.amount || 0,
          status: 'succeeded',
          message: 'Refund processed successfully',
        };
      } catch (error) {
        throw new Error('Failed to process refund');
      }
    }),
});
