import React from 'react';
import { Redirect } from 'expo-router';

export default function ProfileScreen() {
  // This should not be called since we're using optimal-profile directly in tabs
  return <Redirect href="/optimal-profile" />;
}