import { createTRPCRouter } from "./create-context";
import { authRouter } from "./auth-router";
import { profilesRouter } from "./profiles-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profiles: profilesRouter,
});

export type AppRouter = typeof appRouter;
