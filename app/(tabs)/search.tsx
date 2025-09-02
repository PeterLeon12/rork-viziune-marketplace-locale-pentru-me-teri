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
  
  // Mock search results for now - replace with real API call
  const mockProfiles = [
    {
      id: '1',
      displayName: 'Ion Popescu',
      company: 'Instalatorii Popescu',
      categories: ['Instalator', 'Încălzire'],
      zones: ['Cluj-Napoca', 'Turda'],
      minPrice: 50,
      about: 'Instalator cu 15 ani experiență. Specializat în instalații sanitare și de încălzire. Lucrări garantate și prețuri corecte.',
      verified: true,
      responseTimeAvgMins: 30,
      ratingAvg: 4.8,
      ratingCount: 25,
      photoUrl: null,
    },
    {
      id: '2',
      displayName: 'Maria Ionescu',
      company: 'Electro Maria',
      categories: ['Electric', 'Electrocasnice'],
      zones: ['București', 'Ilfov'],
      minPrice: 60,
      about: 'Electriciană certificată cu 10 ani experiență. Reparații și instalații electrice. Lucrări de calitate și prețuri corecte.',
      verified: true,
      responseTimeAvgMins: 45,
      ratingAvg: 4.9,
      ratingCount: 18,
      photoUrl: null,
    },
    {
      id: '3',
      displayName: 'Alexandru Dumitrescu',
      company: 'AC Expert',
      categories: ['Montaj AC', 'Electrocasnice'],
      zones: ['Timișoara', 'Arad'],
      minPrice: 80,
      about: 'Specialist în montaj și întreținere AC. Servicii profesionale și garantate. Răspuns rapid și prețuri competitive.',
      verified: false,
      responseTimeAvgMins: 60,
      ratingAvg: 4.6,
      ratingCount: 12,
      photoUrl: null,
    },
    {
      id: '4',
      displayName: 'Vasile Munteanu',
      company: 'Zugravi Munteanu',
      categories: ['Zugraveli', 'Renovări'],
      zones: ['Cluj-Napoca', 'Dej'],
      minPrice: 40,
      about: 'Zugrav cu 20 ani experiență. Renovări complete, zugrăveli interioare și exterioare. Calitate superioară garantată.',
      verified: true,
      responseTimeAvgMins: 90,
      ratingAvg: 4.7,
      ratingCount: 32,
      photoUrl: null,
    },
  ];

  const filteredProfiles = mockProfiles.filter(profile => {
    if (searchQuery && !profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !profile.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !profile.about.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory && !profile.categories.includes(selectedCategory)) {
      return false;
    }
    if (selectedArea && !profile.zones.includes(selectedArea)) {
      return false;
    }
    return true;
  });

  const sortProfiles = (profiles: typeof mockProfiles) => {
    switch (sortBy) {
      case 'rating':
        return [...profiles].sort((a, b) => b.ratingAvg - a.ratingAvg);
      case 'price':
        return [...profiles].sort((a, b) => a.minPrice - b.minPrice);
      case 'responseTime':
        return [...profiles].sort((a, b) => a.responseTimeAvgMins - b.responseTimeAvgMins);
      case 'recommended':
      default:
        return [...profiles].sort((a, b) => {
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
  };

  const sortedProfiles = sortProfiles(filteredProfiles);

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
          <Text style={styles.resultsTitle}>
            {sortedProfiles.length} Profesionist{sortedProfiles.length !== 1 ? 'i' : ''} Găsiți
          </Text>
          {selectedCategory && (
            <Text style={styles.resultsSubtitle}>
              în serviciile de {selectedCategory}
            </Text>
          )}
          {selectedArea && (
            <Text style={styles.resultsSubtitle}>
              în zona {selectedArea}
            </Text>
          )}
        </View>

        {sortedProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Nu s-au găsit profesioniști</Text>
            <Text style={styles.emptyStateText}>
              Încearcă să modifici criteriile de căutare sau filtrele
            </Text>
          </View>
        ) : (
          <View style={styles.profilesList}>
            {sortedProfiles.map((profile) => (
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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