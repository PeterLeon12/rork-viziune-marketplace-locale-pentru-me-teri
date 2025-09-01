import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../backend/src/trpc/app-router';

export const trpc = createTRPCReact<AppRouter>();

// For development, connect to local backend
// For production, this should point to your deployed backend URL
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      // Add authentication headers if needed
      headers: () => {
        // For React Native, we'll use AsyncStorage instead of localStorage
        // For now, we'll return empty headers
        return {};
      },
    }),
  ],
});