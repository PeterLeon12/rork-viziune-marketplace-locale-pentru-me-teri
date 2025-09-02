import { initTRPC, TRPCError } from '@trpc/server';
import { verifyToken, JWTPayload } from '../utils/auth';

// Create context interface
export interface Context {
  user?: JWTPayload;
  req?: any;
}

// Create tRPC instance
const t = initTRPC.context<Context>().create();

// Export router, public and protected procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // Type assertion that user is defined
    },
  });
});

// Create context function
export const createContext = async (opts: { req: any }): Promise<Context> => {
  const { req } = opts;
  
  // Get authorization header
  const authHeader = req?.headers?.get?.('authorization') || req?.header?.('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { req };
  }

  try {
    // Extract token from header
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const user = verifyToken(token);
    
    return {
      user,
      req,
    };
  } catch (error) {
    // Token is invalid, but we don't throw here
    // Let protected procedures handle the authentication
    return { req };
  }
};
