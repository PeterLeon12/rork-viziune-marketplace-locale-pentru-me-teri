import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db';
import { notifications } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export const notificationsRouter = createTRPCRouter({
  // Get user notifications
  getUserNotifications: protectedProcedure
    .input(z.object({
      userId: z.string(),
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      try {
        const userNotifications = await db
          .select()
          .from(notifications)
          .where(eq(notifications.userId, input.userId))
          .orderBy(desc(notifications.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return userNotifications;
      } catch (error) {
        throw new Error('Failed to fetch notifications');
      }
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({
      notificationId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db
          .update(notifications)
          .set({ read: true })
          .where(
            and(
              eq(notifications.id, input.notificationId),
              eq(notifications.userId, input.userId)
            )
          );

        return { success: true };
      } catch (error) {
        throw new Error('Failed to mark notification as read');
      }
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db
          .update(notifications)
          .set({ read: true })
          .where(eq(notifications.userId, input.userId));

        return { success: true };
      } catch (error) {
        throw new Error('Failed to mark all notifications as read');
      }
    }),

  // Create notification (internal use)
  createNotification: protectedProcedure
    .input(z.object({
      userId: z.string(),
      title: z.string(),
      body: z.string(),
      type: z.enum(['job_update', 'message', 'application', 'booking', 'payment']),
      data: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [newNotification] = await db
          .insert(notifications)
          .values({
            userId: input.userId,
            title: input.title,
            body: input.body,
            type: input.type,
            data: input.data,
            createdAt: new Date(),
          })
          .returning();

        // TODO: Send push notification to user's device
        // This would integrate with Expo Push Notifications or Firebase Cloud Messaging

        return newNotification;
      } catch (error) {
        throw new Error('Failed to create notification');
      }
    }),

  // Get unread notification count
  getUnreadCount: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const result = await db
          .select({ count: notifications.id })
          .from(notifications)
          .where(
            and(
              eq(notifications.userId, input.userId),
              eq(notifications.read, false)
            )
          );

        return { count: result.length };
      } catch (error) {
        throw new Error('Failed to get unread count');
      }
    }),
});
