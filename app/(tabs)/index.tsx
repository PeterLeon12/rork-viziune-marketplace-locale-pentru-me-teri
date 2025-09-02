import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import CategoryCard from '@/components/CategoryCard';
import RegionSelector from '@/components/RegionSelector';
import { MapPin, Star, Clock, Shield } from 'lucide-react-native';

export default function HomeScreen() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  
  const { data: categories } = trpc.profiles.getCategories.useQuery();
  const { data: areas } = trpc.profiles.getAreas.useQuery();

  const featuredCategories = [
    { id: '1', name: 'Instalații', icon: 'wrench', color: '#3B82F6', description: 'Plumbing & Heating' },
    { id: '2', name: 'Electric', icon: 'zap', color: '#F59E0B', description: 'Electrical Work' },
    { id: '3', name: 'Electrocasnice', icon: 'tv', color: '#10B981', description: 'Appliances' },
    { id: '4', name: 'Montaj AC', icon: 'wind', color: '#06B6D4', description: 'AC Installation' },
  ];

  const quickActions = [
    { title: 'Post a Job', subtitle: 'Get help from professionals', icon: '📝', action: 'post-job' },
    { title: 'Find Help Now', subtitle: 'Available professionals', icon: '🔍', action: 'search' },
    { title: 'My Jobs', subtitle: 'Track your requests', icon: '📋', action: 'my-jobs' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Get Help from Trusted Professionals</Text>
          <Text style={styles.heroSubtitle}>
            Connect with skilled artisans across Romania for any home service you need
          </Text>
          
          {/* Region Selector */}
          <RegionSelector
            selectedRegion={selectedRegion}
            onRegionSelect={(region) => {
              setSelectedRegion(region);
            }}
            regions={areas || []}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trust Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Rork?</Text>
          <View style={styles.trustFeatures}>
            <View style={styles.trustFeature}>
              <Shield size={24} color="#10B981" />
              <Text style={styles.trustFeatureTitle}>Verified Professionals</Text>
              <Text style={styles.trustFeatureText}>All artisans are background-checked</Text>
            </View>
            <View style={styles.trustFeature}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.trustFeatureTitle}>Rated & Reviewed</Text>
              <Text style={styles.trustFeatureText}>See real feedback from customers</Text>
            </View>
            <View style={styles.trustFeature}>
              <Clock size={24} color="#3B82F6" />
              <Text style={styles.trustFeatureTitle}>Quick Response</Text>
              <Text style={styles.trustFeatureText}>Get quotes within hours</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroSection: {
    backgroundColor: '#2563EB',
    padding: 24,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  regionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 200,
  },
  regionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    padding: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoriesScroll: {
    marginLeft: -24,
    paddingLeft: 24,
  },
  trustFeatures: {
    gap: 20,
  },
  trustFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trustFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    marginBottom: 4,
    flex: 1,
  },
  trustFeatureText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
  },
});