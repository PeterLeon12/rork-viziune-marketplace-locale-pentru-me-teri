import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db/adapter';
import { users, otpVerifications } from '../db/schema';
import { generateToken, verifyToken } from '../utils/auth';
import { sendWhatsAppOTP } from '../services/twilio';
import { eq, and, gt } from 'drizzle-orm';

const sendOTPSchema = z.object({
  phone: z.string().min(10).max(15),
});

const verifyOTPSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  photoUrl: z.string().url().optional(),
});

export const authRouter = createTRPCRouter({
  sendOTP: publicProcedure
    .input(sendOTPSchema)
    .mutation(async ({ input }) => {
      try {
        const { phone } = input;
        
        // Generate OTP
        const otpResult = await sendWhatsAppOTP(phone);
        
        if (!otpResult.success) {
          throw new Error('Failed to send OTP');
        }

        // Store OTP in database with expiration (10 minutes)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        await db.createOTP(phone, otpResult.otp, expiresAt);

        return {
          success: true,
          message: 'OTP sent successfully',
          expiresIn: 600, // 10 minutes in seconds
        };
      } catch (error) {
        console.error('Error in sendOTP:', error);
        throw new Error('Failed to send OTP');
      }
    }),

  verifyOTP: publicProcedure
    .input(verifyOTPSchema)
    .mutation(async ({ input }) => {
      try {
        const { phone, otp } = input;
        
        // Find and verify OTP
        const otpRecord = await db.verifyOTP(phone, otp);

        if (!otpRecord) {
          throw new Error('Invalid or expired OTP');
        }

        // Check if user exists
        let user = await db.getUserByPhone(phone);

        if (!user) {
          // Create new user
          user = await db.createUser({
            phone,
            name: `User ${phone.slice(-4)}`, // Temporary name
            role: 'client',
          });
        }

        // Generate JWT token
        const token = generateToken({
          userId: user.id,
          phone: user.phone,
          role: user.role,
        });

        return {
          success: true,
          token,
          user: {
            id: user.id,
            phone: user.phone,
            name: user.name,
            role: user.role,
            photoUrl: user.photoUrl,
          },
        };
      } catch (error) {
        console.error('Error in verifyOTP:', error);
        throw new Error('OTP verification failed');
      }
    }),

  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const user = await db.getUserById(ctx.user.userId);

        if (!user) {
          throw new Error('User not found');
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl,
          createdAt: user.createdAt,
        };
      } catch (error) {
        console.error('Error in getProfile:', error);
        throw new Error('Failed to get profile');
      }
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await db.updateUser(ctx.user.userId, {
          ...input,
          updatedAt: new Date(),
        });

        if (!updatedUser) {
          throw new Error('User not found');
        }

        return {
          success: true,
          user: {
            id: updatedUser.id,
            phone: updatedUser.phone,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            photoUrl: updatedUser.photoUrl,
          },
        };
      } catch (error) {
        console.error('Error in updateProfile:', error);
        throw new Error('Failed to update profile');
      }
    }),

  logout: protectedProcedure
    .mutation(async () => {
      // In a real app, you might want to blacklist the token
      // For now, we'll just return success
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }),
});
