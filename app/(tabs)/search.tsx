import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import { useAppStore } from '@/store/useAppStore';

export default function SearchTabScreen() {
  const {
    searchQuery,
    selectedArea,
    setSearchQuery,
    setSelectedArea,
    performSearch,
  } = useAppStore();

  const handleAreaPress = () => {
    // In a real app, this would open an area selection modal
    console.log('Open area selection');
  };

  const handleSearch = () => {
    performSearch();
    router.push('/search');
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
      
      <View style={styles.content}>
        <Text style={styles.title}>Caută meșteri</Text>
        <Text style={styles.description}>
          Folosește bara de căutare de mai sus pentru a găsi meșteri în zona ta
        </Text>
      </View>
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