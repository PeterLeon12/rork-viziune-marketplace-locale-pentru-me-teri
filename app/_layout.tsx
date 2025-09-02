import { Stack, Redirect } from 'expo-router';
import { OptimalAuthProvider, useOptimalAuth } from '../contexts/OptimalAuthContext';
import { trpc, trpcClient } from '../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function RootLayoutNav() {
  const { user, isLoading } = useOptimalAuth();

  if (isLoading) {
    return null; // Will show loading in tabs
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="messaging" />
      <Stack.Screen name="enhanced-search" />
      <Stack.Screen name="pro" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <OptimalAuthProvider>
          <RootLayoutNav />
        </OptimalAuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
