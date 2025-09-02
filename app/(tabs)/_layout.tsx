import { Tabs } from 'expo-router';
import { useOptimalAuth } from '../../contexts/OptimalAuthContext';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react-native';
import Loading from '../../components/Loading';

export default function TabLayout() {
  const { user, isLoading } = useOptimalAuth();

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          headerTitle: 'Conversații',
        }}
      />
    </Tabs>
  );
}