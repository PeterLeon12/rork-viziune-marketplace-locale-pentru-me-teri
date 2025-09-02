import React from 'react';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  // Redirect to optimal profile immediately
  React.useEffect(() => {
    router.replace('/optimal-profile');
  }, []);

  return null; // This component will redirect immediately
}