import React from 'react';
import { View, Text } from 'react-native';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { Redirect } from 'expo-router';
import Loading from '@/components/Loading';

/**
 * Smart Role-Based Router
 * Automatically redirects users to the appropriate interface based on their role
 */
export default function RoleRouter() {
  const { user, isAuthenticated, isLoading } = useOptimalAuth();

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/optimal-profile" />;
  }

  // Redirect based on user role
  if (user?.role === 'pro') {
    return <Redirect href="/(tabs)/professional" />;
  } else {
    return <Redirect href="/(tabs)/client" />;
  }
}
