import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '@/store/useAppStore';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';
import { Category } from '@/types';
import { trpc } from '@/lib/trpc';
import { Plus, Briefcase } from 'lucide-react-native';

export default function HomeScreen() {
  const {
    searchQuery,
    selectedCategory,
    selectedArea,
    categories,
    areas,
    setSearchQuery,
    setSelectedCategory,
    setSelectedArea,
    setCategories,
    setAreas,
    performSearch,
  } = useAppStore();

  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  // Fetch categories and areas from backend
  const { data: categoriesData = [], isLoading: categoriesLoading } = trpc.profiles.getCategories.useQuery();
  const { data: areasData = [], isLoading: areasLoading } = trpc.profiles.getAreas.useQuery();

  // Update store when data is fetched
  React.useEffect(() => {
    if (categoriesData.length > 0) {
      setCategories(categoriesData);
    }
  }, [categoriesData, setCategories]);

  React.useEffect(() => {
    if (areasData.length > 0) {
      setAreas(areasData);
    }
  }, [areasData, setAreas]);

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category.id);
  };

  const handleRegionSelect = (region: any) => {
    setSelectedRegion(region);
    setSelectedArea(region.name);
  };

  const handleSearch = () => {
    performSearch();
    router.push('/search');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Găsește meșteri de încredere în toată România
          </Text>
          <Text style={styles.subtitle}>
            Compară profiluri, citește recenzii și contactează direct
          </Text>
        </View>
      </LinearGradient>

      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionSelect={handleRegionSelect}
        regions={areas}
        onSearch={handleSearch}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/post-job')}
        >
          <Plus size={20} color="white" />
          <Text style={styles.actionButtonText}>Postează Job</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryActionButton]}
          onPress={() => router.push('/jobs')}
        >
          <Briefcase size={20} color="#3B82F6" />
          <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
            Vezi Job-uri
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorii populare</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
                selected={selectedCategory === category.id}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cum funcționează</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Caută</Text>
                <Text style={styles.stepDescription}>
                  Alege categoria și zona ta
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#10B981' }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Compară</Text>
                <Text style={styles.stepDescription}>
                  Vezi profiluri, prețuri și recenzii
                </Text>
              </View>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Contactează</Text>
                <Text style={styles.stepDescription}>
                  Sună sau scrie direct pe WhatsApp
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={styles.proButton}
            onPress={() => router.push('/pro-onboarding')}
          >
            <Text style={styles.proButtonText}>Devino meșter</Text>
            <Text style={styles.proButtonSubtext}>
              Primește clienți noi în fiecare zi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryActionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryActionButtonText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  ctaSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  proButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  proButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  proButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});