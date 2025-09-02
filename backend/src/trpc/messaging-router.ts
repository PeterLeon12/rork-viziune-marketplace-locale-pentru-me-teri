import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from './create-context';
import { db } from '../db';
import { messages, conversations } from '../db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export const messagingRouter = createTRPCRouter({
  // Get all conversations for a user
  getConversations: protectedProcedure
    .input(z.object({
      userId: z.string(),
      userRole: z.enum(['client', 'pro', 'admin']),
    }))
    .query(async ({ input }) => {
      try {
        const userConversations = await db
          .select()
          .from(conversations)
          .where(
            input.userRole === 'client' 
              ? eq(conversations.clientId, input.userId)
              : eq(conversations.proId, input.userId)
          )
          .orderBy(desc(conversations.updatedAt));

        return userConversations;
      } catch (error) {
        throw new Error('Failed to fetch conversations');
      }
    }),

  // Get messages for a specific conversation
  getMessages: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    }))
    .query(async ({ input }) => {
      try {
        const conversationMessages = await db
          .select()
          .from(messages)
          .where(eq(messages.conversationId, input.conversationId))
          .orderBy(asc(messages.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return conversationMessages;
      } catch (error) {
        throw new Error('Failed to fetch messages');
      }
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      senderId: z.string(),
      content: z.string(),
      messageType: z.enum(['text', 'image', 'file']).default('text'),
      attachmentUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [newMessage] = await db
          .insert(messages)
          .values({
            conversationId: input.conversationId,
            senderId: input.senderId,
            content: input.content,
            messageType: input.messageType,
            attachmentUrl: input.attachmentUrl,
            createdAt: new Date(),
          })
          .returning();

        // Update conversation last message and timestamp
        await db
          .update(conversations)
          .set({
            lastMessage: input.content,
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(conversations.id, input.conversationId));

        return newMessage;
      } catch (error) {
        throw new Error('Failed to send message');
      }
    }),

  // Create or get existing conversation
  getOrCreateConversation: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      proId: z.string(),
      jobId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if conversation already exists
        const existingConversation = await db
          .select()
          .from(conversations)
          .where(
            and(
              eq(conversations.clientId, input.clientId),
              eq(conversations.proId, input.proId),
              eq(conversations.jobId, input.jobId)
            )
          )
          .limit(1);

        if (existingConversation.length > 0) {
          return existingConversation[0];
        }

        // Create new conversation
        const [newConversation] = await db
          .insert(conversations)
          .values({
            clientId: input.clientId,
            proId: input.proId,
            jobId: input.jobId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        return newConversation;
      } catch (error) {
        throw new Error('Failed to create conversation');
      }
    }),

  // Mark messages as read
  markAsRead: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db
          .update(messages)
          .set({ readAt: new Date() })
          .where(
            and(
              eq(messages.conversationId, input.conversationId),
              eq(messages.senderId, input.userId)
            )
          );

        return { success: true };
      } catch (error) {
        throw new Error('Failed to mark messages as read');
      }
    }),
});
