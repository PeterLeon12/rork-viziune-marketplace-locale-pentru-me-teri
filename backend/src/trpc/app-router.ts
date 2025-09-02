import { createTRPCRouter } from './create-context';
import { authRouter } from './auth-router';
import { profilesRouter } from './profiles-router';
import { jobsRouter } from './jobs-router';
import { monetizationRouter } from './monetization-router';
import { messagingRouter } from './messaging-router';
import { notificationsRouter } from './notifications-router';
import { paymentsRouter } from './payments-router';
import { uploadRouter } from './upload-router';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profiles: profilesRouter,
  jobs: jobsRouter,
  monetization: monetizationRouter,
  messaging: messagingRouter,
  notifications: notificationsRouter,
  payments: paymentsRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
