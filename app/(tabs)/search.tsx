import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import { useAppStore } from '@/store/useAppStore';
import { trpc } from '@/lib/trpc';
import ProCard from '@/components/ProCard';

export default function SearchTabScreen() {
  const {
    searchQuery,
    selectedArea,
    selectedCategory,
    setSearchQuery,
    setSelectedArea,
    performSearch,
  } = useAppStore();

  // Fetch search results from backend
  const { data: searchResults, isLoading } = trpc.profiles.searchProfiles.useQuery({
    query: searchQuery,
    category: selectedCategory,
    area: selectedArea,
  });

  const handleAreaPress = () => {
    // In a real app, this would open an area selection modal
    console.log('Open area selection');
  };

  const handleSearch = () => {
    performSearch();
    router.push('/search');
  };

  const handleProPress = (proId: string) => {
    router.push(`/pro/${proId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedArea={selectedArea}
        onAreaPress={handleAreaPress}
        onSearch={handleSearch}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Se încarcă...</Text>
          </View>
        ) : searchResults?.profiles && searchResults.profiles.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {searchResults.profiles.length} meșteri găsiți
            </Text>
            {searchResults.profiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                onPress={() => handleProPress(profile.id)}
              >
                <ProCard profile={profile} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.title}>Caută meșteri</Text>
            <Text style={styles.description}>
              Folosește bara de căutare de mai sus pentru a găsi meșteri în zona ta
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});