import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import CategoryCard from '@/components/CategoryCard';
import { MapPin, Star, Clock, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  
  const { data: categories } = trpc.profiles.getCategories.useQuery();
  const { data: areas } = trpc.profiles.getAreas.useQuery();

  const featuredCategories = [
    { id: '1', name: 'Instalații', icon: 'wrench', color: '#3B82F6', description: 'Plumbing & Heating' },
    { id: '2', name: 'Electric', icon: 'zap', color: '#F59E0B', description: 'Electrical Work' },
    { id: '3', name: 'Electrocasnice', icon: 'tv', color: '#10B981', description: 'Appliances' },
    { id: '4', name: 'Montaj AC', icon: 'wind', color: '#06B6D4', description: 'AC Installation' },
    { id: '5', name: 'Zugraveli', icon: 'paintbrush', color: '#8B5CF6', description: 'Painting' },
    { id: '6', name: 'Dulgherie', icon: 'hammer', color: '#F97316', description: 'Carpentry' },
  ];

  const quickActions = [
    { 
      title: 'Postează un Job', 
      subtitle: 'Descrie ce ai nevoie și primește oferte', 
      icon: '📝', 
      action: () => router.push('/post-job'),
      color: '#2563EB'
    },
    { 
      title: 'Găsește Ajutor', 
      subtitle: 'Profesioniști verificați în zona ta', 
      icon: '🔍', 
      action: () => router.push('/search'),
      color: '#10B981'
    },
    { 
      title: 'Job-urile Mele', 
      subtitle: 'Urmărește progresul serviciilor', 
      icon: '📋', 
      action: () => router.push('/jobs'),
      color: '#F59E0B'
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Descrie Nevoia',
      description: 'Spune-ne ce ai nevoie și când vrei să fie gata',
      icon: '✍️'
    },
    {
      step: '2',
      title: 'Primește Oferte',
      description: 'Profesioniști verificați îți trimit prețuri în câteva ore',
      icon: '💰'
    },
    {
      step: '3',
      title: 'Alege și Programează',
      description: 'Selectează cel mai bun profesionist și programează serviciul',
      icon: '✅'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section - TaskRabbit Style */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Găsește Profesioniști Verificați pentru Orice Nevoie
            </Text>
            <Text style={styles.heroSubtitle}>
              Conectează-te cu meșteri, electricieni, zugravi și mulți alții în toată România
            </Text>
            
            {/* Search CTA */}
            <TouchableOpacity 
              style={styles.searchCTA}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.searchCTAText}>Caută Profesioniști</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Hero Image Placeholder */}
          <View style={styles.heroImageContainer}>
            <Text style={styles.heroImageText}>🏠</Text>
          </View>
        </View>

        {/* Quick Actions - TaskRabbit Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ce vrei să faci?</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                onPress={action.action}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                <ArrowRight size={16} color={action.color} style={styles.arrowIcon} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Categories - TaskRabbit Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicii Populare</Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => router.push('/search')}
              />
            ))}
          </ScrollView>
        </View>

        {/* How It Works - TaskRabbit Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cum Funcționează</Text>
          <View style={styles.howItWorksContainer}>
            {howItWorks.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Features - TaskRabbit Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>De Ce Să Alegi Meșterul?</Text>
          <View style={styles.trustFeatures}>
            <View style={styles.trustFeature}>
              <View style={styles.trustIconContainer}>
                <Shield size={24} color="#10B981" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustFeatureTitle}>Profesioniști Verificați</Text>
                <Text style={styles.trustFeatureText}>Toți meșterii sunt verificați și evaluați</Text>
              </View>
            </View>
            <View style={styles.trustFeature}>
              <View style={styles.trustIconContainer}>
                <Star size={24} color="#F59E0B" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustFeatureTitle}>Evaluări Reale</Text>
                <Text style={styles.trustFeatureText}>Vezi feedback-ul real de la clienți</Text>
              </View>
            </View>
            <View style={styles.trustFeature}>
              <View style={styles.trustIconContainer}>
                <Clock size={24} color="#3B82F6" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustFeatureTitle}>Răspuns Rapid</Text>
                <Text style={styles.trustFeatureText}>Primește oferte în câteva ore</Text>
              </View>
            </View>
            <View style={styles.trustFeature}>
              <View style={styles.trustIconContainer}>
                <CheckCircle size={24} color="#8B5CF6" />
              </View>
              <View style={styles.trustContent}>
                <Text style={styles.trustFeatureTitle}>Garantat</Text>
                <Text style={styles.trustFeatureText}>Servicii de calitate garantată</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Gata să Începi?</Text>
          <Text style={styles.ctaSubtitle}>
            Postează primul tău job și primește oferte de la profesioniști verificați
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/post-job')}
          >
            <Text style={styles.ctaButtonText}>Postează un Job</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    minWidth: 250,
    justifyContent: 'center',
  },
  searchCTAText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  heroImageContainer: {
    height: 200,
    backgroundColor: '#E0E7FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  heroImageText: {
    fontSize: 100,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
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
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB', // Default color, will be overridden by inline style
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
  arrowIcon: {
    position: 'absolute',
    bottom: 10,
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
  trustIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trustContent: {
    flex: 1,
  },
  trustFeatureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  trustFeatureText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#2563EB',
    padding: 24,
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 250,
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  howItWorksContainer: {
    gap: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  stepContent: {
    flex: 1,
  },
  stepIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});