import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Modal,
  Switch,

  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  MapPin,
  Filter,
  Star,
  X,
  ChevronDown,
  Sliders,
  Clock,
  Shield,
  Award,
  DollarSign,
  Map,
  Calendar,
  CheckCircle,
  Users,
  Zap,
  Target,
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { ProCard } from '@/components/ProCard';
import EnhancedLocationPicker from '@/components/EnhancedLocationPicker';

interface SearchFilters {
  query: string;
  category: string | null;
  area: string | null;
  minPrice: number;
  maxPrice: number;
  priceRange: string | null;
  minRating: number;
  verified: boolean | null;
  backgroundChecked: boolean | null;
  insuranceVerified: boolean | null;
  minExperience: number;
  maxExperience: number;
  minJobsCompleted: number;
  minCompletionRate: number;
  availableNow: boolean | null;
  emergencyAvailable: boolean | null;
  weekendAvailable: boolean | null;
  responseTimeMax: number;
  maxDistance: number;
  requiredSkills: string[];
  skillLevel: string | null;
  specializations: string[];
  warrantyProvided: boolean | null;
  businessLicense: boolean | null;
  languages: string[];
  sortBy: string;
}

const initialFilters: SearchFilters = {
  query: '',
  category: null,
  area: null,
  minPrice: 0,
  maxPrice: 2000,
  priceRange: null,
  minRating: 0,
  verified: null,
  backgroundChecked: null,
  insuranceVerified: null,
  minExperience: 0,
  maxExperience: 50,
  minJobsCompleted: 0,
  minCompletionRate: 0,
  availableNow: null,
  emergencyAvailable: null,
  weekendAvailable: null,
  responseTimeMax: 180, // 3 hours
  maxDistance: 50,
  requiredSkills: [],
  skillLevel: null,
  specializations: [],
  warrantyProvided: null,
  businessLicense: null,
  languages: [],
  sortBy: 'recommended',
};

const commonSkills = [
  'Instalații sanitare', 'Electricitate', 'Reparații electrocasnice',
  'Montaj AC', 'Zugrăveli', 'Dulgherie', 'Curățenie profesională',
  'Grădinărit', 'Reparații auto', 'IT & Computer'
];

export default function EnhancedSearchScreen() {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // tRPC queries
  const { data: searchFilters } = trpc.enhancedSearch.getSearchFilters.useQuery();
  const { data: popularSearches } = trpc.enhancedSearch.getPopularSearches.useQuery();
  
  const { data: searchResults, isLoading, refetch } = trpc.enhancedSearch.advancedSearch.useQuery({
    query: filters.query || undefined,
    category: filters.category || undefined,
    area: filters.area || undefined,
    minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice < 2000 ? filters.maxPrice : undefined,
    priceRange: filters.priceRange as "0-100" | "100-300" | "300-500" | "500-1000" | "1000+" | undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    verified: filters.verified || undefined,
    availableNow: filters.availableNow || undefined,
    responseTimeMax: filters.responseTimeMax < 180 ? filters.responseTimeMax : undefined,
    sortBy: filters.sortBy as "rating" | "recommended" | "price_low_to_high" | "price_high_to_low" | "response_time" | "newest",
    limit: 20,
  });

  const { data: searchSuggestions } = trpc.enhancedSearch.getSearchSuggestions.useQuery(
    { query: filters.query, limit: 5 },
    { enabled: filters.query.length > 2 }
  );

  useEffect(() => {
    refetch();
  }, [filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.area) count++;
    if (filters.minRating > 0) count++;
    if (filters.verified !== null) count++;
    if (filters.emergencyAvailable !== null) count++;
    if (filters.weekendAvailable !== null) count++;
    if (filters.priceRange) count++;
    if (filters.requiredSkills.length > 0) count++;
    if (filters.specializations.length > 0) count++;
    return count;
  };

  const renderSearchHeader = () => (
    <View style={styles.searchHeader}>
      <View style={styles.searchBar}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Caută profesioniști, servicii, locații..."
          value={filters.query}
          onChangeText={(text) => updateFilter('query', text)}
          placeholderTextColor="#9CA3AF"
        />
        {filters.query.length > 0 && (
          <TouchableOpacity onPress={() => updateFilter('query', '')}>
            <X size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchActions}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            getActiveFiltersCount() > 0 && styles.filterButtonActive
          ]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={16} color={getActiveFiltersCount() > 0 ? "#FFFFFF" : "#6B7280"} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Sliders size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuickFilters = () => (
    <ScrollView 
      horizontal 
      style={styles.quickFilters} 
      showsHorizontalScrollIndicator={false}
    >
      <TouchableOpacity 
        style={styles.locationChip}
        onPress={() => setShowLocationPicker(true)}
      >
        <MapPin size={14} color="#3B82F6" />
        <Text style={styles.locationText}>
          {selectedLocationName || 'Toate locațiile'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.quickFilterChip,
          filters.emergencyAvailable && styles.quickFilterChipActive
        ]}
        onPress={() => updateFilter('emergencyAvailable', !filters.emergencyAvailable)}
      >
        <Zap size={14} color={filters.emergencyAvailable ? "#FFFFFF" : "#6B7280"} />
        <Text style={[
          styles.quickFilterText,
          filters.emergencyAvailable && styles.quickFilterTextActive
        ]}>
          Urgente
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.quickFilterChip,
          filters.verified && styles.quickFilterChipActive
        ]}
        onPress={() => updateFilter('verified', !filters.verified)}
      >
        <Shield size={14} color={filters.verified ? "#FFFFFF" : "#6B7280"} />
        <Text style={[
          styles.quickFilterText,
          filters.verified && styles.quickFilterTextActive
        ]}>
          Verificați
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.quickFilterChip,
          filters.weekendAvailable && styles.quickFilterChipActive
        ]}
        onPress={() => updateFilter('weekendAvailable', !filters.weekendAvailable)}
      >
        <Calendar size={14} color={filters.weekendAvailable ? "#FFFFFF" : "#6B7280"} />
        <Text style={[
          styles.quickFilterText,
          filters.weekendAvailable && styles.quickFilterTextActive
        ]}>
          Weekend
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.quickFilterChip,
          filters.minRating >= 4 && styles.quickFilterChipActive
        ]}
        onPress={() => updateFilter('minRating', filters.minRating >= 4 ? 0 : 4)}
      >
        <Star size={14} color={filters.minRating >= 4 ? "#FFFFFF" : "#6B7280"} />
        <Text style={[
          styles.quickFilterText,
          filters.minRating >= 4 && styles.quickFilterTextActive
        ]}>
          4+ stele
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSearchSuggestions = () => {
    if (!searchSuggestions || searchSuggestions.length === 0) return null;
    
    return (
      <View style={styles.suggestions}>
        {searchSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => updateFilter('query', suggestion.title)}
          >
            <Text style={styles.suggestionText}>{suggestion.title}</Text>
            <Text style={styles.suggestionType}>{suggestion.type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Se caută profesioniști...</Text>
        </View>
      );
    }

    if (!searchResults?.profiles || searchResults.profiles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nu am găsit profesioniști</Text>
          <Text style={styles.emptyText}>
            Încearcă să modifici filtrele sau să cauți ceva diferit
          </Text>
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Șterge filtrele</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {searchResults.pagination.total} profesioniști găsiți
          </Text>
          <Text style={styles.resultsSort}>
            Sortare: {searchFilters?.sortOptions?.find(opt => opt.value === filters.sortBy)?.label || 'Recomandat'}
          </Text>
        </View>
        
        <FlatList
          data={searchResults.profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProCard
              profile={item}
              onPress={() => router.push(`/pro/${item.id}`)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    );
  };

  const renderAdvancedFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Filtre avansate</Text>
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Șterge</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Categorii</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryChips}>
                {searchFilters?.categories?.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      filters.category === category.id && styles.categoryChipActive
                    ]}
                    onPress={() => updateFilter('category', 
                      filters.category === category.id ? null : category.id
                    )}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      filters.category === category.id && styles.categoryChipTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Interval de prețuri</Text>
            <View style={styles.priceRangeChips}>
              {searchFilters?.priceRanges?.map((range) => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.priceChip,
                    filters.priceRange === range.value && styles.priceChipActive
                  ]}
                  onPress={() => updateFilter('priceRange',
                    filters.priceRange === range.value ? null : range.value
                  )}
                >
                  <Text style={[
                    styles.priceChipText,
                    filters.priceRange === range.value && styles.priceChipTextActive
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Rating minim</Text>
            <View style={styles.ratingButtons}>
              {searchFilters?.ratingOptions?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.ratingButton,
                    filters.minRating === option.value && styles.ratingButtonActive
                  ]}
                  onPress={() => updateFilter('minRating', option.value)}
                >
                  <Text style={[
                    styles.ratingButtonText,
                    filters.minRating === option.value && styles.ratingButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Experience */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Experiență (ani)</Text>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInput}>
                <Text style={styles.rangeLabel}>Minim</Text>
                <TextInput
                  style={styles.rangeTextInput}
                  value={filters.minExperience.toString()}
                  onChangeText={(text) => updateFilter('minExperience', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.rangeInput}>
                <Text style={styles.rangeLabel}>Maxim</Text>
                <TextInput
                  style={styles.rangeTextInput}
                  value={filters.maxExperience.toString()}
                  onChangeText={(text) => updateFilter('maxExperience', parseInt(text) || 50)}
                  keyboardType="numeric"
                  placeholder="50"
                />
              </View>
            </View>
          </View>

          {/* Verification Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Verificări</Text>
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Profil verificat</Text>
                <Switch
                  value={filters.verified === true}
                  onValueChange={(value) => updateFilter('verified', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Verificare background</Text>
                <Switch
                  value={filters.backgroundChecked === true}
                  onValueChange={(value) => updateFilter('backgroundChecked', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Asigurare verificată</Text>
                <Switch
                  value={filters.insuranceVerified === true}
                  onValueChange={(value) => updateFilter('insuranceVerified', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Availability */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Disponibilitate</Text>
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Disponibil acum</Text>
                <Switch
                  value={filters.availableNow === true}
                  onValueChange={(value) => updateFilter('availableNow', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Intervenții urgente</Text>
                <Switch
                  value={filters.emergencyAvailable === true}
                  onValueChange={(value) => updateFilter('emergencyAvailable', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Lucrează în weekend</Text>
                <Switch
                  value={filters.weekendAvailable === true}
                  onValueChange={(value) => updateFilter('weekendAvailable', value ? true : null)}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Skills */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Competențe necesare</Text>
            <View style={styles.skillsGrid}>
              {commonSkills.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    filters.requiredSkills.includes(skill) && styles.skillChipActive
                  ]}
                  onPress={() => {
                    const updatedSkills = filters.requiredSkills.includes(skill)
                      ? filters.requiredSkills.filter(s => s !== skill)
                      : [...filters.requiredSkills, skill];
                    updateFilter('requiredSkills', updatedSkills);
                  }}
                >
                  <Text style={[
                    styles.skillChipText,
                    filters.requiredSkills.includes(skill) && styles.skillChipTextActive
                  ]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.applyFiltersButton} 
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyFiltersText}>
              Aplică filtrele ({searchResults?.pagination.total || 0} rezultate)
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowSortModal(false)}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sortare</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.modalContent}>
          {searchFilters?.sortOptions?.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                filters.sortBy === option.value && styles.sortOptionActive
              ]}
              onPress={() => {
                updateFilter('sortBy', option.value);
                setShowSortModal(false);
              }}
            >
              <Star 
                size={20} 
                color={filters.sortBy === option.value ? "#3B82F6" : "#6B7280"} 
              />
              <View style={{ flex: 1 }}>
                <Text style={[
                  styles.sortOptionText,
                  filters.sortBy === option.value && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                <Text style={styles.sortOptionDescription}>
                  {option.description}
                </Text>
              </View>
              {filters.sortBy === option.value && (
                <CheckCircle size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const handleLocationSelect = (location: any) => {
    updateFilter('area', location.id);
    setSelectedLocationName(location.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderSearchHeader()}
      {filters.query.length > 2 && renderSearchSuggestions()}
      {renderQuickFilters()}
      {renderResults()}
      {renderAdvancedFiltersModal()}
      {renderSortModal()}
      
      <EnhancedLocationPicker
        isVisible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        title="Selectează locația"
        placeholder="Caută oraș, județ sau cartier..."
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  searchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  quickFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  quickFilterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  quickFilterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  quickFilterTextActive: {
    color: '#FFFFFF',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 6,
    minWidth: 120,
  },
  locationText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  suggestions: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  suggestionType: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  resultsSort: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  clearText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryChips: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  priceRangeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  priceChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  priceChipTextActive: {
    color: '#FFFFFF',
  },
  ratingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ratingButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  ratingButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  ratingButtonTextActive: {
    color: '#FFFFFF',
  },
  rangeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  rangeTextInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  switchContainer: {
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skillChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  skillChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  skillChipTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyFiltersButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  sortOptionActive: {
    backgroundColor: '#F0F9FF',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  sortOptionTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  sortOptionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
