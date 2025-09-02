import { createTRPCRouter } from "@trpc/server";
import { authRouter } from "./auth-router";
import { profilesRouter } from "./profiles-router";
import { jobsRouter } from "./jobs-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profiles: profilesRouter,
  jobs: jobsRouter,
});

export type AppRouter = typeof appRouter;
