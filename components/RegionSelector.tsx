import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { X, MapPin, ChevronDown } from 'lucide-react-native';

interface Region {
  id: string;
  name: string;
  city: string;
  county: string;
}

interface RegionSelectorProps {
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  regions: Region[];
}

export default function RegionSelector({ selectedRegion, onRegionSelect, regions }: RegionSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle undefined regions
  if (!regions || regions.length === 0) {
    return (
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <MapPin size={20} color="#6B7280" />
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>Locația</Text>
          <Text style={styles.selectorValue}>
            {selectedRegion ? `${selectedRegion.name}, ${selectedRegion.county}` : 'Se încarcă...'}
          </Text>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>
    );
  }

  // Group regions by county
  const regionsByCounty = regions.reduce((acc, region) => {
    if (!acc[region.county]) {
      acc[region.county] = [];
    }
    acc[region.county].push(region);
    return acc;
  }, {} as Record<string, Region[]>);

  // Filter regions based on search
  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.county.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegionsByCounty = filteredRegions.reduce((acc, region) => {
    if (!acc[region.county]) {
      acc[region.county] = [];
    }
    acc[region.county].push(region);
    return acc;
  }, {} as Record<string, Region[]>);

  const handleRegionSelect = (region: Region) => {
    onRegionSelect(region);
    setIsVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsVisible(true)}
      >
        <MapPin size={20} color="#6B7280" />
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>Locația</Text>
          <Text style={styles.selectorValue}>
            {selectedRegion ? `${selectedRegion.name}, ${selectedRegion.county}` : 'Selectează orașul'}
          </Text>
        </View>
        <ChevronDown size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selectează orașul</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Caută oraș sau județ..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView style={styles.regionsList} showsVerticalScrollIndicator={false}>
            {Object.entries(filteredRegionsByCounty).map(([county, countyRegions]) => (
              <View key={county} style={styles.countySection}>
                <Text style={styles.countyTitle}>{county}</Text>
                {countyRegions.map((region) => (
                  <TouchableOpacity
                    key={region.id}
                    style={[
                      styles.regionItem,
                      selectedRegion?.id === region.id && styles.selectedRegionItem
                    ]}
                    onPress={() => handleRegionSelect(region)}
                  >
                    <View style={styles.regionInfo}>
                      <Text style={[
                        styles.regionName,
                        selectedRegion?.id === region.id && styles.selectedRegionName
                      ]}>
                        {region.name}
                      </Text>
                      {region.city !== region.name && (
                        <Text style={styles.regionCity}>{region.city}</Text>
                      )}
                    </View>
                    {selectedRegion?.id === region.id && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorContent: {
    flex: 1,
    marginLeft: 12,
  },
  selectorLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  regionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countySection: {
    marginBottom: 24,
  },
  countyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingTop: 16,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedRegionItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedRegionName: {
    color: '#3B82F6',
  },
  regionCity: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
});
