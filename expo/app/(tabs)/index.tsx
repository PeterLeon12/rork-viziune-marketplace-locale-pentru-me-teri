import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { router } from 'expo-router';
import { 
  Search, 
  Plus, 
  Star, 
  MapPin, 
  TrendingUp,
  Shield,
  Briefcase,
  MessageSquare
} from 'lucide-react-native';


const { height } = Dimensions.get('window');

// Using the "keep" categories from rebuild instructions
const focusedCategories = [
  { id: 'assembly', name: 'Asamblare', icon: '🔧', color: '#3B82F6', count: 245, subcategories: ['Mobilă', 'Electrocasnice', 'Jucării', 'Altele'] },
  { id: 'mounting', name: 'Montare', icon: '📱', color: '#F59E0B', count: 189, subcategories: ['TV', 'Sisteme Audio', 'Camere Video', 'Altele'] },
  { id: 'moving', name: 'Mutare', icon: '📦', color: '#8B5CF6', count: 156, subcategories: ['Apartament', 'Casă', 'Birou', 'Altele'] },
  { id: 'cleaning', name: 'Curățenie', icon: '🧹', color: '#10B981', count: 134, subcategories: ['Generală', 'După Renovare', 'După Mutare', 'Altele'] },
  { id: 'outdoor', name: 'Ajutor Exterior', icon: '🌳', color: '#059669', count: 98, subcategories: ['Grădină', 'Teren', 'Învelitori', 'Altele'] },
  { id: 'repairs', name: 'Reparații Casă', icon: '🏠', color: '#DC2626', count: 167, subcategories: ['Electricitate', 'Instalații', 'Tâmplărie', 'Altele'] },
  { id: 'painting', name: 'Vopsire', icon: '🎨', color: '#EC4899', count: 87, subcategories: ['Interior', 'Exterior', 'Mobilă', 'Altele'] },
  { id: 'trending', name: 'Trending', icon: '🔥', color: '#F97316', count: 123, subcategories: ['Renovări', 'Smart Home', 'Eco', 'Altele'] },
];

// Mock data for featured professionals
const featuredPros = [
  {
    id: '1',
    name: 'Ion Popescu',
    profession: 'Instalator',
    rating: 4.9,
    reviews: 127,
    location: 'București',
    price: '50-80 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: true,
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    profession: 'Curățenie',
    rating: 4.8,
    reviews: 89,
    location: 'Cluj-Napoca',
    price: '30-50 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: true,
  },
  {
    id: '3',
    name: 'Alexandru Dumitrescu',
    profession: 'Constructor',
    rating: 4.7,
    reviews: 156,
    location: 'Timișoara',
    price: '80-120 RON/ora',
    avatar: 'https://via.placeholder.com/60',
    verified: false,
  },
];

export default function HomeScreen() {
  const { user } = useSimpleAuth();


  const handleCategoryPress = (category: any) => {
    router.push('/search');
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handlePostJobPress = () => {
    router.push('/post-job');
  };

  const handleProfessionalPress = (pro: any) => {
    router.push(`/pro/${pro.id}`);
  };

  const handleJobsPress = () => {
    router.push('/jobs');
  };

  const handleMessagesPress = () => {
    router.push('/messages');
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryEmoji}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} profesioniști</Text>
    </TouchableOpacity>
  );

  const renderProfessionalItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.professionalCard}
      onPress={() => handleProfessionalPress(item)}
    >
      <View style={styles.professionalHeader}>
        <Image source={{ uri: item.avatar }} style={styles.professionalAvatar} />
        <View style={styles.professionalInfo}>
          <View style={styles.professionalNameRow}>
            <Text style={styles.professionalName}>{item.name}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#10B981" />
              </View>
            )}
          </View>
          <Text style={styles.professionalProfession}>{item.profession}</Text>
          <View style={styles.professionalRating}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews} recenzii)</Text>
          </View>
        </View>
        <View style={styles.professionalPrice}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
      
      <View style={styles.professionalFooter}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contactează</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Se încarcă...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#667eea' }]}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Bine ai revenit, {user.name}! 👋
            </Text>
            <Text style={styles.welcomeSubtext}>
              Ce serviciu cauți astăzi?
            </Text>
          </View>
          
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Search size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>
            Caută servicii, profesioniști...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Role-Based Quick Actions */}
        {user.role === 'client' ? (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handlePostJobPress}>
              <View style={styles.quickActionIcon}>
                <Plus size={24} color="#667eea" />
              </View>
              <Text style={styles.quickActionText}>Postează Job</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={handleSearchPress}>
              <View style={styles.quickActionIcon}>
                <Search size={24} color="#667eea" />
              </View>
              <Text style={styles.quickActionText}>Caută Servicii</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton} onPress={handleJobsPress}>
              <View style={styles.quickActionIcon}>
                <Briefcase size={24} color="#667eea" />
              </View>
              <Text style={styles.quickActionText}>Job-uri Disponibile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton} onPress={handleMessagesPress}>
              <View style={styles.quickActionIcon}>
                <MessageSquare size={24} color="#667eea" />
              </View>
              <Text style={styles.quickActionText}>Mesaje Clienți</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorii Populare</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          
                  <FlatList
          data={focusedCategories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
        </View>

        {/* Featured Professionals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profesioniști Recomandați</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Vezi toți</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredPros}
            renderItem={renderProfessionalItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.professionalsList}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={[styles.statsCard, { backgroundColor: '#FEF3C7' }]}>
            <View style={styles.statsContent}>
              <View style={styles.statsIcon}>
                <TrendingUp size={24} color="#D97706" />
              </View>
              <View style={styles.statsText}>
                <Text style={styles.statsTitle}>Crește-ți veniturile</Text>
                <Text style={styles.statsSubtitle}>
                  {user.role === 'pro' 
                    ? 'Oferă servicii și câștigă mai mult' 
                    : 'Găsește profesioniști calificați'
                  }
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: height * 0.05,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  profileButton: {
    padding: 8,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  professionalsList: {
    paddingHorizontal: 20,
  },
  professionalCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  professionalHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  professionalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  professionalProfession: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
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
    fontSize: 12,
    color: '#6B7280',
  },
  professionalPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  professionalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsText: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});