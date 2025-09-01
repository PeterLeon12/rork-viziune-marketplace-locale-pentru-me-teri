import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SearchFilters, SortOption } from '@/types';
import { Filter, Star, Shield, Clock, ChevronDown } from 'lucide-react-native';
import { sortOptions } from '@/constants/data';

interface FilterBarProps {
  filters: SearchFilters;
  sortBy: SortOption['key'];
  onFiltersChange: (filters: SearchFilters) => void;
  onSortChange: (sort: SortOption['key']) => void;
  onFilterPress: () => void;
}

export default function FilterBar({ 
  filters, 
  sortBy, 
  onFiltersChange, 
  onSortChange, 
  onFilterPress 
}: FilterBarProps) {
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof SearchFilters] !== undefined && 
    filters[key as keyof SearchFilters] !== null
  ).length;

  const currentSort = sortOptions.find(option => option.key === sortBy);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity 
          style={[styles.filterButton, activeFiltersCount > 0 && styles.activeFilter]}
          onPress={onFilterPress}
        >
          <Filter size={16} color={activeFiltersCount > 0 ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.filterText, activeFiltersCount > 0 && styles.activeFilterText]}>
            Filtre {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, filters.verified && styles.activeFilter]}
          onPress={() => onFiltersChange({ ...filters, verified: !filters.verified })}
        >
          <Shield size={16} color={filters.verified ? '#10B981' : '#6B7280'} />
          <Text style={[styles.filterText, filters.verified && styles.activeFilterText]}>
            Verificat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, filters.availableNow && styles.activeFilter]}
          onPress={() => onFiltersChange({ ...filters, availableNow: !filters.availableNow })}
        >
          <Clock size={16} color={filters.availableNow ? '#F59E0B' : '#6B7280'} />
          <Text style={[styles.filterText, filters.availableNow && styles.activeFilterText]}>
            Disponibil acum
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, filters.minRating && styles.activeFilter]}
          onPress={() => onFiltersChange({ 
            ...filters, 
            minRating: filters.minRating ? undefined : 4.5 
          })}
        >
          <Star size={16} color={filters.minRating ? '#F59E0B' : '#6B7280'} />
          <Text style={[styles.filterText, filters.minRating && styles.activeFilterText]}>
            4.5+ ⭐
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.sortButton}>
        <Text style={styles.sortText}>{currentSort?.label}</Text>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#3B82F6',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  sortText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
    fontWeight: '500',
  },
});