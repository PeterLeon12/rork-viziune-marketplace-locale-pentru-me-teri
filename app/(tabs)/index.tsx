import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '@/lib/trpc';
import CategoryCard from '@/components/CategoryCard';
import { MapPin, Star, Clock, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';

export default function HomeScreen() {
  const { user } = useOptimalAuth();

  // Render different content based on user role
  if (user?.role === 'pro') {
    // Import and render professional dashboard
    return <ProfessionalDashboard />;
  }

  // Default to client interface
  return <ClientHomeScreen />;
}

// Professional Dashboard Component
function ProfessionalDashboard() {
  const { user } = useOptimalAuth();

  // Mock data for professional dashboard
  const stats = {
    thisMonth: {
      earnings: 2450,
      jobs: 12,
      newClients: 8,
      rating: 4.8
    },
    thisWeek: {
      viewsOnProfile: 45,
      messagesReceived: 18,
      jobApplications: 6,
      bookings: 3
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Professional Dashboard Content */}
        <View style={styles.section}>
          <Text style={styles.welcomeText}>Bună ziua, {user?.name}!</Text>
          <Text style={styles.subtitle}>Dashboard Profesional</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.thisMonth.earnings} LEI</Text>
              <Text style={styles.statLabel}>Luna aceasta</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.thisMonth.jobs}</Text>
              <Text style={styles.statLabel}>Job-uri</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Client Home Screen Component  
function ClientHomeScreen() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  
  const { data: categories } = trpc.profiles.getCategories.useQuery();
  const { data: areas } = trpc.profiles.getAreas.useQuery();

  // Get popular categories from backend
  const { data: popularCategories = [] } = trpc.profiles.getPopularCategories.useQuery();

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
              <ArrowRight size={20} color="#1F2937" />
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
            {popularCategories.map((category) => (
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
            <ArrowRight size={20} color="#1D4ED8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
    maxWidth: 300,
  },
  searchCTA: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  searchCTAText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
  },
  heroImageContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.1,
  },
  heroImageText: {
    fontSize: 100,
  },
  regionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignSelf: 'center',
    minWidth: 250,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  regionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  quickActionsGrid: {
    gap: 16,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrowIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  categoriesScroll: {
    marginLeft: -24,
  },
  howItWorksContainer: {
    gap: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  stepNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepNumberText: {
    fontSize: 24,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  trustFeatures: {
    gap: 20,
  },
  trustFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  trustIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 300,
    alignSelf: 'center',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#1D4ED8',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  
  // Professional Dashboard Styles
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});