import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Search, MapPin } from 'lucide-react-native';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedArea: string | null;
  onAreaPress: () => void;
  onSearch: () => void;
}

export default function SearchBar({ 
  query, 
  onQueryChange, 
  selectedArea, 
  onAreaPress, 
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
        
        <TouchableOpacity style={styles.locationContainer} onPress={onAreaPress}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.locationText} numberOfLines={1}>
            {selectedArea || 'Alege zona'}
          </Text>
        </TouchableOpacity>
      </View>
      
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
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
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