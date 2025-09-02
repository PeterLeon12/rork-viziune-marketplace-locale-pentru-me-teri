import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Search, MapPin, X, ChevronRight, Star } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

interface Location {
  id: string;
  name: string;
  fullName: string;
  city: string;
  county: string;
  type: 'county_capital' | 'major_city' | 'city' | 'town' | 'neighborhood' | 'sector';
  population?: number;
}

interface EnhancedLocationPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  selectedLocation?: Location | null;
  title?: string;
  placeholder?: string;
}

export default function EnhancedLocationPicker({
  isVisible,
  onClose,
  onLocationSelect,
  selectedLocation,
  title = 'Selectează locația',
  placeholder = 'Caută oraș, județ sau cartier...'
}: EnhancedLocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'search' | 'popular' | 'counties'>('search');
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);

  // tRPC queries
  const { data: locationSuggestions, isLoading: isSearching } = trpc.enhancedSearch.getLocationSuggestions.useQuery(
    { query: searchQuery, limit: 15 },
    { enabled: searchQuery.length > 0 }
  );

  const { data: popularLocations } = trpc.enhancedSearch.getPopularLocations.useQuery();
  const { data: counties } = trpc.enhancedSearch.getAllCounties.useQuery();
  const { data: majorCities } = trpc.enhancedSearch.getMajorCities.useQuery();

  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const { data: countyLocations } = trpc.enhancedSearch.getLocationsByCounty.useQuery(
    { county: selectedCounty!, includeNeighborhoods: true },
    { enabled: !!selectedCounty }
  );

  useEffect(() => {
    if (isVisible) {
      setSearchQuery('');
      setSelectedTab('search');
      setSelectedCounty(null);
    }
  }, [isVisible]);

  const handleLocationSelect = (location: Location) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.id !== location.id);
      return [location, ...filtered].slice(0, 5);
    });
    
    onLocationSelect(location);
    onClose();
  };

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'county_capital':
      case 'major_city':
        return '🏛️';
      case 'city':
        return '🏙️';
      case 'neighborhood':
      case 'sector':
        return '🏘️';
      default:
        return '📍';
    }
  };

  const getLocationTypeLabel = (type: Location['type']) => {
    switch (type) {
      case 'county_capital':
        return 'Reședință de județ';
      case 'major_city':
        return 'Oraș major';
      case 'city':
        return 'Oraș';
      case 'neighborhood':
        return 'Cartier';
      case 'sector':
        return 'Sector';
      default:
        return 'Localitate';
    }
  };

  const renderLocationItem = (location: Location, showType: boolean = true) => (
    <TouchableOpacity 
      key={location.id}
      style={styles.locationItem}
      onPress={() => handleLocationSelect(location)}
    >
      <View style={styles.locationIcon}>
        <Text style={styles.iconText}>{getLocationIcon(location.type)}</Text>
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <View style={styles.locationDetails}>
          <Text style={styles.locationSubtext}>{location.county}</Text>
          {showType && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.locationType}>{getLocationTypeLabel(location.type)}</Text>
            </>
          )}
          {location.population && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.population}>
                {location.population.toLocaleString()} locuitori
              </Text>
            </>
          )}
        </View>
      </View>
      
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderSearchTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length > 0 ? (
        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Se caută...</Text>
            </View>
          ) : locationSuggestions && locationSuggestions.length > 0 ? (
            <FlatList
              data={locationSuggestions}
              renderItem={({ item }) => renderLocationItem(item)}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nu am găsit locații pentru "{searchQuery}"</Text>
              <Text style={styles.emptySubtext}>Încearcă să cauți un alt oraș sau județ</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.defaultContent}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Căutări recente</Text>
              {recentSearches.map(location => renderLocationItem(location, false))}
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orașe populare</Text>
            {majorCities?.cities.slice(0, 6).map(city => 
              renderLocationItem({
                id: city.id,
                name: city.displayName,
                fullName: `${city.displayName}, ${city.county}`,
                city: city.city,
                county: city.county,
                type: city.type,
                population: city.population
              } as Location, false)
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderPopularTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={popularLocations?.majorCities}
        renderItem={({ item }) => renderLocationItem({
          id: item.id,
          name: item.displayName,
          fullName: `${item.displayName}, ${item.county}`,
          city: item.city,
          county: item.county,
          type: item.type,
          population: item.population
        } as Location)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.tabHeader}>
            <Text style={styles.tabHeaderText}>Cele mai importante orașe din România</Text>
          </View>
        }
      />
    </View>
  );

  const renderCountiesTab = () => (
    <View style={styles.tabContent}>
      {!selectedCounty ? (
        <FlatList
          data={counties?.counties}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.countyItem}
              onPress={() => setSelectedCounty(item)}
            >
              <View style={styles.countyIcon}>
                <Text style={styles.iconText}>🏛️</Text>
              </View>
              <Text style={styles.countyName}>Județul {item}</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.tabHeader}>
              <Text style={styles.tabHeaderText}>Selectează județul</Text>
            </View>
          }
        />
      ) : (
        <View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedCounty(null)}
          >
            <Text style={styles.backText}>← Înapoi la județe</Text>
          </TouchableOpacity>
          
          <Text style={styles.selectedCountyTitle}>Județul {selectedCounty}</Text>
          
          <FlatList
            data={countyLocations?.locations}
            renderItem={({ item }) => renderLocationItem({
              id: item.id,
              name: item.name,
              fullName: `${item.name}, ${item.county}`,
              city: item.city,
              county: item.county,
              type: item.type,
              population: item.population
            } as Location)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'search' && styles.activeTab]}
            onPress={() => setSelectedTab('search')}
          >
            <Search size={16} color={selectedTab === 'search' ? '#3B82F6' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'search' && styles.activeTabText]}>
              Caută
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'popular' && styles.activeTab]}
            onPress={() => setSelectedTab('popular')}
          >
            <Star size={16} color={selectedTab === 'popular' ? '#3B82F6' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'popular' && styles.activeTabText]}>
              Populare
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'counties' && styles.activeTab]}
            onPress={() => setSelectedTab('counties')}
          >
            <MapPin size={16} color={selectedTab === 'counties' ? '#3B82F6' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'counties' && styles.activeTabText]}>
              Județe
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'search' && renderSearchTab()}
        {selectedTab === 'popular' && renderPopularTab()}
        {selectedTab === 'counties' && renderCountiesTab()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  defaultContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  locationType: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  population: {
    fontSize: 12,
    color: '#6B7280',
  },
  tabHeader: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  tabHeaderText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  countyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  countyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  selectedCountyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});
