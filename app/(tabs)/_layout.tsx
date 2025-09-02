import React from 'react';
import { Tabs } from 'expo-router';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { Redirect } from 'expo-router';
import { Home, Search, Plus, MessageCircle, User, Briefcase, Calendar, TrendingUp, Award } from 'lucide-react-native';
import Loading from '@/components/Loading';

export default function TabLayout() {
  const { user, isAuthenticated, isLoading } = useOptimalAuth();

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/optimal-profile" />;
  }

  // Show different tabs based on user role
  if (user.role === 'pro') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#F59E0B',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: '600',
            color: '#1F2937',
          },
        }}>
        
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerTitle: 'Dashboard Profesional',
          }}
        />
        
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Oportunități',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
            headerTitle: 'Job-uri Disponibile',
          }}
        />
        
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Mesaje',
            tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
            headerTitle: 'Clienți',
          }}
        />
        
        <Tabs.Screen
          name="optimal-profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            headerTitle: 'Profilul Profesional',
          }}
        />

        {/* Hide other screens from professional tabs */}
        <Tabs.Screen name="enhanced-profile" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="post-job" options={{ href: null }} />
      </Tabs>
    );
  }

  // Client tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#1F2937',
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acasă',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Găsește Profesioniști',
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Caută',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: 'Caută Mesteri',
        }}
      />
      
      <Tabs.Screen
        name="post-job"
        options={{
          title: 'Postează Job',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
          headerTitle: 'Postează o Cerere',
        }}
      />
      
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Job-urile Mele',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          headerTitle: 'Cererile Mele',
        }}
      />
      
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mesaje',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          headerTitle: 'Conversații',
        }}
      />
      
      <Tabs.Screen
        name="optimal-profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profilul Meu',
        }}
      />

      {/* Hide other screens from client tabs */}
      <Tabs.Screen name="enhanced-profile" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}