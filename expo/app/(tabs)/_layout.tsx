import { Tabs } from 'expo-router';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { 
  Home, 
  Search, 
  Plus, 
  MessageSquare, 
  User,
  Briefcase,
  Calendar
} from 'lucide-react-native';

export default function TabLayout() {
  const { user, isLoading } = useSimpleAuth();

  console.log('📱 TabLayout - User state:', { user: !!user, userId: user?.id, userRole: user?.role, isLoading });

  // Wait for authentication to initialize before making any decisions
  if (isLoading) {
    console.log('⏳ TabLayout: Still loading, showing loading screen...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, color: '#6B7280', textAlign: 'center' }}>
          Se încarcă aplicația...
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
          Vă rugăm să așteptați
        </Text>
      </View>
    );
  }

  // Only redirect after loading is complete and we're sure there's no user
  useEffect(() => {
    if (!isLoading && !user) {
      console.log('❌ TabLayout: No user after loading, redirecting to login...');
      // Use setTimeout to ensure navigation happens after render cycle
      setTimeout(() => {
        router.replace('/login');
      }, 100);
      return;
    }
  }, [user, isLoading]);

  if (!user) {
    console.log('❌ TabLayout: No user, showing fallback');
    // Return a fallback UI instead of null to prevent white screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Text style={{ fontSize: 18, color: '#6B7280', textAlign: 'center' }}>
          Se încarcă aplicația...
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
          Vă rugăm să așteptați
        </Text>
      </View>
    );
  }

  console.log('✅ TabLayout: User authenticated, rendering tabs');

  // Professional tabs
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
            tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Cererile Mele',
        }}
      />
      
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Mesaje',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          headerTitle: 'Conversații',
        }}
      />
    </Tabs>
  );
}