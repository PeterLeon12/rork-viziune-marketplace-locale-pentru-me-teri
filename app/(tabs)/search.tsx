import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import { ProCard } from '@/components/ProCard';
import { Search, MapPin, Filter, Star } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
      about: 'Instalator cu 15 ani experiență. Specializat în instalații sanitare și de încălzire.',
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
      about: 'Electriciană certificată cu 10 ani experiență. Reparații și instalații electrice.',
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
      about: 'Specialist în montaj și întreținere AC. Servicii profesionale și garantate.',
      verified: false,
      responseTimeAvgMins: 60,
      ratingAvg: 4.6,
      ratingCount: 12,
      photoUrl: null,
    },
  ];

  const filteredProfiles = mockProfiles.filter(profile => {
    if (searchQuery && !profile.displayName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !profile.company.toLowerCase().includes(searchQuery.toLowerCase())) {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for professionals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Service Type</Text>
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
                  ]}>All</Text>
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
            <Text style={styles.filterLabel}>Location</Text>
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
                  ]}>All Areas</Text>
                </TouchableOpacity>
                {areas?.slice(0, 10).map((area) => (
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
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredProfiles.length} Professional{filteredProfiles.length !== 1 ? 's' : ''} Found
          </Text>
          {selectedCategory && (
            <Text style={styles.resultsSubtitle}>
              in {selectedCategory} services
            </Text>
          )}
        </View>

        {filteredProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No professionals found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search criteria or filters
            </Text>
          </View>
        ) : (
          <View style={styles.profilesList}>
            {filteredProfiles.map((profile) => (
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
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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