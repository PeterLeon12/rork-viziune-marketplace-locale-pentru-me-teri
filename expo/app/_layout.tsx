import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SimpleAuthProvider, useSimpleAuth } from '../contexts/SimpleAuthContext';
import { StatusBar } from 'expo-status-bar';

// App Navigator component that handles authentication routing
function AppNavigator() {
  const { user, isLoading } = useSimpleAuth();

  console.log('🔍 AppNavigator - Auth State:', { user: !!user, isLoading, userId: user?.id, userRole: user?.role });

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('⏳ Showing loading screen...');
    return (
      <Stack>
        <Stack.Screen 
          name="loading" 
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  // If user is not authenticated, show authentication screens
  if (!user) {
    console.log('🔐 No user found, showing login screen...');
    return (
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="register" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="enhanced-pro-onboarding" 
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  // If user is authenticated, show main app
  console.log('✅ User authenticated, showing main app...');
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="enhanced-search" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="messaging" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="subscription" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="pro/[id]" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="+not-found" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="_sitemap" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

// Root layout component
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SimpleAuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SimpleAuthProvider>
    </SafeAreaProvider>
  );
}
