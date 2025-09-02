import React from 'react';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { Redirect } from 'expo-router';
import Loading from '@/components/Loading';

export default function TabLayout() {
  const { user, isAuthenticated, isLoading } = useOptimalAuth();

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/optimal-profile" />;
  }

  // Redirect based on user role
  if (user.role === 'pro') {
    return <Redirect href="/(tabs)/professional" />;
  }

  // Default to client interface
  return <Redirect href="/(tabs)/client" />;
}