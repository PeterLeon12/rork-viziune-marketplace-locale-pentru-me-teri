import { Tabs } from 'expo-router';
import { Home, Search, MessageCircle, User, Briefcase, Plus } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: '#1f2937',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acasă',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Meșterul - Marketplace de Servicii',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Caută',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: 'Găsește Profesioniști',
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: 'Postează',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
          headerTitle: 'Postează un Job',
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Job-uri',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          headerTitle: 'Job-urile Mele',
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
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profilul Meu',
        }}
      />
      <Tabs.Screen
        name="enhanced-profile"
        options={{
          href: null, // Hide from tab bar
          title: 'Profil Enhanced',
          headerTitle: 'Profilul Meu',
        }}
      />
      <Tabs.Screen
        name="optimal-profile"
        options={{
          href: null, // Hide from tab bar
          title: 'Profil Optimal',
          headerTitle: 'Profilul Meu',
        }}
      />
    </Tabs>
  );
}