import { Tabs } from 'expo-router';
import { Home, Search, Plus, MessageCircle, User, Briefcase } from 'lucide-react-native';

export default function ClientTabLayout() {
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
      
      {/* CLIENT-SPECIFIC TABS */}
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
        name="my-jobs"
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
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profilul Meu',
        }}
      />
    </Tabs>
  );
}
