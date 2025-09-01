import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { mockProfiles, categories, areas, sortOptions } from '@/constants/data';
import { ProProfile } from '@/types';
import ProCard from '@/components/ProCard';
import FilterBar from '@/components/FilterBar';
import Loading from '@/components/Loading';
import { ChevronDown } from 'lucide-react-native';

export default function SearchScreen() {
  const {
    searchQuery,
    selectedCategory,
    selectedArea,
    filters,
    sortBy,
    setSortBy,
  } = useAppStore();

  const [showSortModal, setShowSortModal] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);

  const filteredProfiles = useMemo(() => {
    let results = mockProfiles.filter((profile) => {
      // Category filter
      if (selectedCategory && !profile.categories.includes(selectedCategory)) {
        return false;
      }

      // Area filter
      if (selectedArea) {
        const area = areas.find(a => a.name === selectedArea);
        if (area && !profile.zones.includes(area.id)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          profile.displayName.toLowerCase().includes(query) ||
          profile.about.toLowerCase().includes(query) ||
          profile.company.toLowerCase().includes(query)
        );
      }

      // Other filters
      if (filters.minRating && profile.ratingAvg < filters.minRating) {
        return false;
      }

      if (filters.verified && !profile.verified) {
        return false;
      }

      if (filters.maxPrice && profile.minPrice > filters.maxPrice) {
        return false;
      }

      return true;
    });

    // Sort results
    switch (sortBy) {
      case 'rating':
        return results.sort((a, b) => b.ratingAvg - a.ratingAvg);
      case 'price':
        return results.sort((a, b) => a.minPrice - b.minPrice);
      case 'responseTime':
        return results.sort((a, b) => a.responseTimeAvgMins - b.responseTimeAvgMins);
      case 'recommended':
      default:
        // Composite score: 40% rating + 20% response time + 15% review count + 25% verified
        return results.sort((a, b) => {
          const scoreA = (a.ratingAvg * 0.4) + 
                        ((60 - Math.min(a.responseTimeAvgMins, 60)) / 60 * 0.2) +
                        (Math.min(a.ratingCount, 100) / 100 * 0.15) +
                        (a.verified ? 0.25 : 0);
          const scoreB = (b.ratingAvg * 0.4) + 
                        ((60 - Math.min(b.responseTimeAvgMins, 60)) / 60 * 0.2) +
                        (Math.min(b.ratingCount, 100) / 100 * 0.15) +
                        (b.verified ? 0.25 : 0);
          return scoreB - scoreA;
        });
    }
  }, [searchQuery, selectedCategory, selectedArea, filters, sortBy]);

  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.name 
    : null;

  const currentSortOption = sortOptions.find(option => option.key === sortBy);

  const handleProPress = (profile: ProProfile) => {
    router.push(`/pro/${profile.id}`);
  };

  if (isLoading) {
    return <Loading message="Căutăm meșterii..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Rezultate căutare',
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />
      
      <FilterBar 
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={() => {}}
        onSortChange={setSortBy}
        onFilterPress={() => {}}
      />
      
      <View style={styles.header}>
        <Text style={styles.resultsCount}>
          {filteredProfiles.length} meșteri găsiți
          {selectedCategoryName && ` pentru ${selectedCategoryName}`}
          {selectedArea && ` în ${selectedArea}`}
        </Text>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>
            {currentSortOption?.label || 'Sortează'}
          </Text>
          <ChevronDown size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nu am găsit meșteri</Text>
            <Text style={styles.emptyMessage}>
              Încearcă să modifici filtrele sau să cauți în altă zonă.
            </Text>
          </View>
        ) : (
          <View style={styles.profilesList}>
            {filteredProfiles.map((profile) => (
              <ProCard
                key={profile.id}
                profile={profile}
                onPress={handleProPress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sort Modal - Simple implementation */}
      {showSortModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowSortModal(false)}
          />
          <View style={styles.sortModal}>
            <Text style={styles.modalTitle}>Sortează după</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionSelected
                ]}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortModal(false);
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.sortOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 4,
  },
  content: {
    flex: 1,
  },
  profilesList: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  sortModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: '#EBF4FF',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  sortOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});