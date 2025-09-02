import { Tabs } from 'expo-router';
import { Home, Search, Calendar, MessageCircle, User, TrendingUp, Award, Briefcase } from 'lucide-react-native';

export default function ProfessionalTabLayout() {
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
      
      {/* PROFESSIONAL-SPECIFIC TABS */}
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
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'Programul Meu',
        }}
      />
      
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portofoliu',
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
          headerTitle: 'Portofoliul Meu',
        }}
      />
      
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Statistici',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          headerTitle: 'Analiza Business',
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
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profilul Profesional',
        }}
      />
    </Tabs>
  );
}
