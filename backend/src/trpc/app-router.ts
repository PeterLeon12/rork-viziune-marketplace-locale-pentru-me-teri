import { createTRPCRouter } from "./create-context";
import { authRouter } from "./auth-router";
import { profilesRouter } from "./profiles-router";
import { jobsRouter } from "./jobs-router";
import { monetizationRouter } from "./monetization-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profiles: profilesRouter,
  jobs: jobsRouter,
  monetization: monetizationRouter,
});

export type AppRouter = typeof appRouter;
