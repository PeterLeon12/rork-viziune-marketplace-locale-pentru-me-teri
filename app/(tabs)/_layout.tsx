import React from 'react';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import RoleRouter from './role-router';

export default function TabLayout() {
  const { user, isAuthenticated } = useOptimalAuth();

  // If not authenticated or no user, show role router (which will redirect to auth)
  if (!isAuthenticated || !user) {
    return <RoleRouter />;
  }

  // Role router will handle the redirection to appropriate interface
  return <RoleRouter />;
}