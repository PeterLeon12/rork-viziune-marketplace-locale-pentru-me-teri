import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';

export const monetizationRouter = createTRPCRouter({
  // Get subscription plans
  getSubscriptionPlans: publicProcedure
    .query(async () => {
      return [
        {
          id: 'free',
          name: 'Gratuit',
          price: 0,
          currency: 'RON',
          features: [
            'Profil de bază',
            '3 job-uri pe lună',
            'Contact direct cu clienții',
            'Suport prin email'
          ],
          limitations: [
            'Fără verificare prioritară',
            'Fără statistici avansate',
            'Fără promovare'
          ]
        },
        {
          id: 'basic',
          name: 'Basic',
          price: 29.99,
          currency: 'RON',
          period: 'month',
          features: [
            'Toate funcționalitățile gratuite',
            '10 job-uri pe lună',
            'Verificare prioritară',
            'Statistici de bază',
            'Suport prin telefon'
          ],
          commission: '5% din fiecare job'
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 79.99,
          currency: 'RON',
          period: 'month',
          features: [
            'Toate funcționalitățile Basic',
            'Job-uri nelimitate',
            'Promovare prioritară',
            'Statistici avansate',
            'Suport dedicat',
            'API acces'
          ],
          commission: '3% din fiecare job'
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 199.99,
          currency: 'RON',
          period: 'month',
          features: [
            'Toate funcționalitățile Premium',
            'Echipă de până la 10 persoane',
            'Dashboard personalizat',
            'Integrare cu sisteme externe',
            'Manager de cont dedicat',
            'Formare personalizată'
          ],
          commission: '2% din fiecare job'
        }
      ];
    }),

  // Subscribe to a plan
  subscribeToPlan: protectedProcedure
    .input(z.object({
      planId: z.enum(['basic', 'premium', 'enterprise']),
      paymentMethod: z.string(),
      autoRenew: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Here you would integrate with a payment processor like Stripe
        // For now, we'll simulate a successful subscription
        
        const subscription = {
          userId: ctx.user.userId,
          plan: input.planId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          autoRenew: input.autoRenew,
          status: 'active',
        };

        return {
          success: true,
          subscription,
          message: `Te-ai abonat cu succes la planul ${input.planId}!`
        };
      } catch (error) {
        console.error('Error in subscribeToPlan:', error);
        throw new Error('Failed to subscribe to plan');
      }
    }),

  // Get commission history
  getCommissionHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Mock commission data for now
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

  // Request payout
  requestPayout: protectedProcedure
    .input(z.object({
      amount: z.number().min(50), // Minimum 50 RON payout
      bankAccount: z.string(),
      accountHolder: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Here you would integrate with a banking API or payment processor
        // For now, we'll simulate a payout request
        
        const payout = {
          userId: ctx.user.userId,
          amount: input.amount,
          bankAccount: input.bankAccount,
          accountHolder: input.accountHolder,
          status: 'pending',
          requestedAt: new Date(),
        };

        return {
          success: true,
          payout,
          message: 'Cererea de plată a fost trimisă. Vei primi banii în 2-3 zile lucrătoare.',
        };
      } catch (error) {
        console.error('Error in requestPayout:', error);
        throw new Error('Failed to request payout');
      }
    }),

  // Get revenue analytics
  getRevenueAnalytics: protectedProcedure
    .input(z.object({
      period: z.enum(['week', 'month', 'year']).default('month'),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Mock revenue data
        const mockRevenue = {
          totalRevenue: 12500,
          subscriptionRevenue: 3200,
          commissionRevenue: 9300,
          period: input.period,
          breakdown: [
            { month: 'Ianuarie', revenue: 4200, jobs: 15 },
            { month: 'Februarie', revenue: 3800, jobs: 12 },
            { month: 'Martie', revenue: 4500, jobs: 18 },
          ]
        };

        return mockRevenue;
      } catch (error) {
        console.error('Error in getRevenueAnalytics:', error);
        throw new Error('Failed to get revenue analytics');
      }
    }),
});
