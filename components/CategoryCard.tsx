import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ComprehensiveCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories?: string[];
  popular: boolean;
  emergency: boolean;
  business: boolean;
}

interface CategoryCardProps {
  category: ComprehensiveCategory;
  onPress: (category: ComprehensiveCategory) => void;
  selected?: boolean;
  showDescription?: boolean;
}

export default function CategoryCard({ 
  category, 
  onPress, 
  selected = false, 
  showDescription = false 
}: CategoryCardProps) {

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: selected ? category.color : '#F8FAFC' },
        selected && styles.selected
      ]}
      onPress={() => onPress(category)}
      testID={`category-${category.id}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: selected ? 'rgba(255,255,255,0.2)' : category.color }]}>
        <Text style={styles.emojiIcon}>{category.icon}</Text>
      </View>
      <Text style={[styles.name, { color: selected ? 'white' : '#1E293B' }]}>
        {category.name}
      </Text>
      {showDescription && (
        <Text style={[styles.description, { color: selected ? 'rgba(255,255,255,0.8)' : '#64748B' }]}>
          {category.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selected: {
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  emojiIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
});