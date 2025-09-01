import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import ProCard from '@/components/ProCard';
import FilterBar from '@/components/FilterBar';
import { ProProfile } from '@/types';

export default function SearchScreen() {
  const {
    searchResults,
    filters,
    sortBy,
    setFilters,
    setSortBy,
    performSearch,
  } = useAppStore();

  useEffect(() => {
    performSearch();
  }, []);

  const handleProPress = (profile: ProProfile) => {
    router.push(`/pro/${profile.id}`);
  };

  const handleFilterPress = () => {
    // In a real app, this would open a filter modal
    console.log('Open filters modal');
  };

  const renderProCard = ({ item }: { item: ProProfile }) => (
    <ProCard profile={item} onPress={handleProPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Nu am găsit meșteri</Text>
      <Text style={styles.emptyDescription}>
        Încearcă să modifici filtrele sau să cauți în altă zonă
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Rezultate căutare',
          headerBackTitle: 'Înapoi'
        }} 
      />
      
      <FilterBar
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={setFilters}
        onSortChange={setSortBy}
        onFilterPress={handleFilterPress}
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {searchResults.length} meșteri găsiți
        </Text>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderProCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  resultsHeader: {
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
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});