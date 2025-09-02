import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useOptimalAuth } from '../../contexts/OptimalAuthContext';
import CategoryCard from '../../components/CategoryCard';
import { router } from 'expo-router';

// Import our categories data
const categories = [
  { id: 'assembly', name: 'Assembly', description: 'Furniture and item assembly services', icon: '🔧', color: '#3B82F6', subcategories: ['Furniture', 'Electronics', 'Appliances'] },
  { id: 'mounting', name: 'Mounting', description: 'Hanging and installation services', icon: '⚡', color: '#F59E0B', subcategories: ['TV Mounting', 'Shelves', 'Pictures'] },
  { id: 'moving', name: 'Moving', description: 'Moving and transportation services', icon: '🚚', color: '#10B981', subcategories: ['Home Moving', 'Office Moving', 'Furniture Moving'] },
  { id: 'cleaning', name: 'Cleaning', description: 'Cleaning and maintenance services', icon: '✨', color: '#EC4899', subcategories: ['House Cleaning', 'Deep Cleaning', 'Post-Construction'] },
  { id: 'outdoor-help', name: 'Outdoor Help', description: 'Garden and outdoor services', icon: '🌱', color: '#059669', subcategories: ['Gardening', 'Lawn Care', 'Outdoor Maintenance'] },
  { id: 'home-repairs', name: 'Home Repairs', description: 'General home repair services', icon: '🔨', color: '#8B5CF6', subcategories: ['Plumbing', 'Electrical', 'Carpentry'] },
  { id: 'painting', name: 'Painting', description: 'Painting and wallpaper services', icon: '🎨', color: '#EF4444', subcategories: ['Interior Painting', 'Exterior Painting', 'Wallpaper'] },
  { id: 'trending', name: 'Trending', description: 'Popular and trending services', icon: '🔥', color: '#F97316', subcategories: ['Smart Home', 'Energy Efficiency', 'Modern Solutions'] },
];

export default function HomeScreen() {
  const { user } = useOptimalAuth();

  const handleCategoryPress = (category: any) => {
    router.push('/search');
  };

  if (user?.role === 'pro') {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Bun venit, {user.name}! 👋
          </Text>
          <Text className="text-gray-600 mb-6">
            Găsește oportunități noi și gestionează-ți afacerea
          </Text>
          
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              📊 Statistici Rapide
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-600">12</Text>
                <Text className="text-sm text-gray-600">Job-uri Active</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-secondary-600">8</Text>
                <Text className="text-sm text-gray-600">Clienți Noi</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">4.8</Text>
                <Text className="text-sm text-gray-600">Rating</Text>
              </View>
            </View>
          </View>

          <Text className="text-xl font-bold text-gray-900 mb-4">
            🚀 Acțiuni Rapide
          </Text>
          
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity 
              className="bg-primary-500 p-4 rounded-xl flex-1 min-w-[150px]"
              onPress={() => router.push('/jobs')}
            >
              <Text className="text-white font-semibold text-center">Vezi Job-uri</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-secondary-500 p-4 rounded-xl flex-1 min-w-[150px]"
              onPress={() => router.push('/messages')}
            >
              <Text className="text-white font-semibold text-center">Mesaje</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Client home screen
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Bun venit, {user?.name}! 👋
        </Text>
        <Text className="text-gray-600 mb-6">
          Găsește mesteri de încredere pentru orice lucrare
        </Text>

        <Text className="text-xl font-bold text-gray-900 mb-4">
          🔥 Categorii Populare
        </Text>
        
        <View className="flex-row flex-wrap gap-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={handleCategoryPress}
              showDescription={true}
            />
          ))}
        </View>

        <View className="mt-6">
          <TouchableOpacity 
            className="bg-primary-500 p-4 rounded-xl"
            onPress={() => router.push('/post-job')}
          >
            <Text className="text-white font-semibold text-center text-lg">
              📝 Postează un Job Nou
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}