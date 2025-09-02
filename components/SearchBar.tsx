import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import RegionSelector from './RegionSelector';

interface Region {
  id: string;
  name: string;
  city: string;
  county: string;
}

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regions: Region[];
  onSearch: () => void;
}

export default function SearchBar({ 
  query, 
  onQueryChange, 
  selectedRegion, 
  onRegionSelect,
  regions,
  onSearch 
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Ce ai nevoie?"
            value={query}
            onChangeText={onQueryChange}
            onSubmitEditing={onSearch}
            returnKeyType="search"
          />
        </View>
      </View>
      
      {regions && regions.length > 0 && (
        <RegionSelector
          selectedRegion={selectedRegion}
          onRegionSelect={onRegionSelect}
          regions={regions}
        />
      )}
      
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Search size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  searchButton: {
    backgroundColor: '#3B82F6',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});