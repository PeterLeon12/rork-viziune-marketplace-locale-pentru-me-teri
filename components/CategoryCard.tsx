import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Category } from '@/types';
import { 
  Wrench, 
  Zap, 
  Tv, 
  Wind, 
  Paintbrush, 
  Hammer, 
  Sparkles 
} from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  selected?: boolean;
}

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  tv: Tv,
  wind: Wind,
  paintbrush: Paintbrush,
  hammer: Hammer,
  sparkles: Sparkles,
};

export default function CategoryCard({ category, onPress, selected = false }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Wrench;

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
        <IconComponent 
          size={24} 
          color={selected ? 'white' : 'white'} 
        />
      </View>
      <Text style={[styles.name, { color: selected ? 'white' : '#1E293B' }]}>
        {category.name}
      </Text>
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
});