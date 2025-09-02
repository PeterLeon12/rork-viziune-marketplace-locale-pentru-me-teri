import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { trpc } from '@/lib/trpc';
import { ProCard } from '@/components/ProCard';
import { Search, MapPin, Filter, Star, X, ChevronDown } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price' | 'responseTime'>('recommended');

  const { data: categories } = trpc.profiles.getCategories.useQuery();
  const { data: areas } = trpc.profiles.getAreas.useQuery();
  
  // Real search using tRPC
  const { data: searchResults, isLoading } = trpc.profiles.searchProfiles.useQuery({
    query: searchQuery || undefined,
    category: selectedCategory || undefined,
    area: selectedArea || undefined,
    sortBy: sortBy,
    limit: 20,
  });

  // Use real data if available, fallback to mock data
  const profiles = searchResults?.profiles || [];
  const isLoadingProfiles = isLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută profesioniști, servicii..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, (selectedCategory || selectedArea) && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={(selectedCategory || selectedArea) ? "#2563EB" : "#6B7280"} />
          {(selectedCategory || selectedArea) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {(selectedCategory ? 1 : 0) + (selectedArea ? 1 : 0)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtre</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedCategory(null);
                setSelectedArea(null);
              }}
            >
              <Text style={styles.clearFiltersText}>Șterge toate</Text>
            </TouchableOpacity>
          </View>
          
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tipul de Serviciu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedCategory && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={[
                    styles.filterChipText,
                    !selectedCategory && styles.filterChipTextActive
                  ]}>Toate</Text>
                </TouchableOpacity>
                {categories?.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.filterChip,
                      selectedCategory === category.name && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === category.name && styles.filterChipTextActive
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Area Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Locația</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !selectedArea && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedArea(null)}
                >
                  <Text style={[
                    styles.filterChipText,
                    !selectedArea && styles.filterChipTextActive
                  ]}>Toate Zonele</Text>
                </TouchableOpacity>
                {areas?.slice(0, 15).map((area) => (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.filterChip,
                      selectedArea === area.name && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedArea(area.name)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedArea === area.name && styles.filterChipTextActive
                    ]}>{area.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Sortează după</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'recommended', label: 'Recomandat' },
                { key: 'rating', label: 'Rating' },
                { key: 'price', label: 'Preț' },
                { key: 'responseTime', label: 'Răspuns Rapid' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortOption,
                    sortBy === option.key && styles.sortOptionActive
                  ]}
                  onPress={() => setSortBy(option.key as any)}
                >
                  <Text style={[
                    styles.sortOptionText,
                    sortBy === option.key && styles.sortOptionTextActive
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Rezultate</Text>
          <Text style={styles.resultsCount}>{profiles.length} profesioniști găsiți</Text>
        </View>

        {isLoadingProfiles ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Căutare în curs...</Text>
            <Text style={styles.emptyStateText}>
              Încărcăm profesioniștii care îndeplinesc criteriile de căutare.
            </Text>
          </View>
        ) : profiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Nu s-au găsit profesioniști</Text>
            <Text style={styles.emptyStateText}>
              Încearcă să modifici criteriile de căutare sau filtrele
            </Text>
          </View>
        ) : (
          <View style={styles.profilesList}>
            {profiles.map((profile) => (
              <ProCard key={profile.id} profile={profile} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#E0E7FF',
  },
  filterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearFiltersText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  profilesList: {
    padding: 16,
    gap: 16,
  },
});