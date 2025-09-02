import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Plus, 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Home,
  Wrench,
  PaintBucket,
  Hammer
} from 'lucide-react-native';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { router } from 'expo-router';
import CategoryCard from '@/components/CategoryCard';

export default function ClientHomeScreen() {
  const { user } = useOptimalAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(tabs)/client/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/(tabs)/client/search');
    }
  };

  const quickActions = [
    {
      title: 'Postează un Job',
      subtitle: 'Descrie ce ai nevoie',
      icon: Plus,
      color: '#3B82F6',
      action: () => router.push('/(tabs)/client/post-job'),
    },
    {
      title: 'Caută Mesteri',
      subtitle: 'Găsește profesioniști',
      icon: Search,
      color: '#10B981',
      action: () => router.push('/(tabs)/client/search'),
    },
    {
      title: 'Job-urile Mele',
      subtitle: 'Vezi statusul',
      icon: TrendingUp,
      color: '#F59E0B',
      action: () => router.push('/(tabs)/client/my-jobs'),
    },
  ];

  const popularCategories = [
    { id: '1', name: 'Instalații', icon: 'wrench', color: '#3B82F6', jobs: 45 },
    { id: '2', name: 'Electric', icon: 'zap', color: '#F59E0B', jobs: 32 },
    { id: '3', name: 'Zugraveli', icon: 'paintbrush', color: '#8B5CF6', jobs: 28 },
    { id: '4', name: 'Dulgherie', icon: 'hammer', color: '#F97316', jobs: 21 },
    { id: '5', name: 'Curățenie', icon: 'sparkles', color: '#EC4899', jobs: 18 },
    { id: '6', name: 'Grădinărit', icon: 'leaf', color: '#10B981', jobs: 15 },
  ];

  const nearbyProfessionals = [
    { id: '1', name: 'Ion Popescu', category: 'Instalații', rating: 4.8, reviews: 124, distance: '2.1 km' },
    { id: '2', name: 'Maria Ionescu', category: 'Curățenie', rating: 4.9, reviews: 89, distance: '1.5 km' },
    { id: '3', name: 'Alexandru Radu', category: 'Electric', rating: 4.7, reviews: 156, distance: '3.2 km' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Bună ziua, {user?.name}!</Text>
            <Text style={styles.headerSubtitle}>
              Ce servicii cauți astăzi?
            </Text>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Caută electrician, instalator, zugravi..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acțiuni Rapide</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <LinearGradient 
                  colors={[action.color, action.color + '20']}
                  style={styles.quickActionGradient}
                >
                  <action.icon size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.quickActionText}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
                <ArrowRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorii Populare</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/client/search')}>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            style={styles.categoriesContainer}
            showsHorizontalScrollIndicator={false}
          >
            {popularCategories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/(tabs)/client/search?category=${category.id}`)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Text style={styles.categoryIconText}>🔧</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryJobs}>{category.jobs} mesteri</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nearby Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mesteri din Zona Ta</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/client/search')}>
              <Text style={styles.seeAllText}>Vezi toți</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.professionalsContainer}>
            {nearbyProfessionals.map((pro) => (
              <TouchableOpacity key={pro.id} style={styles.professionalCard}>
                <View style={styles.professionalAvatar}>
                  <Text style={styles.professionalAvatarText}>
                    {pro.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.professionalInfo}>
                  <Text style={styles.professionalName}>{pro.name}</Text>
                  <Text style={styles.professionalCategory}>{pro.category}</Text>
                  <View style={styles.professionalStats}>
                    <View style={styles.professionalRating}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.ratingText}>{pro.rating}</Text>
                      <Text style={styles.reviewsText}>({pro.reviews})</Text>
                    </View>
                    <View style={styles.professionalDistance}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.distanceText}>{pro.distance}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips for Clients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cum Funcționează</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>1</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Descrie Nevoia</Text>
                <Text style={styles.tipDescription}>
                  Spune-ne ce servicii ai nevoie și unde
                </Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>2</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Primești Oferte</Text>
                <Text style={styles.tipDescription}>
                  Mesteri verificați îți trimit oferte
                </Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>3</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Alegi și Plătești</Text>
                <Text style={styles.tipDescription}>
                  Selectezi oferta și plătești securizat
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: -20,
  },
  headerContent: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  quickActions: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesContainer: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryJobs: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  professionalsContainer: {
    gap: 12,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  professionalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  professionalAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  professionalCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  professionalStats: {
    flexDirection: 'row',
    gap: 16,
  },
  professionalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  professionalDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsContainer: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
