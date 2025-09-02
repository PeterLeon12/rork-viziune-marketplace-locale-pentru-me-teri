import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TrendingUp, 
  DollarSign, 
  Star, 
  Calendar, 
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Award,
  Eye,
  MessageCircle,
  Briefcase,
  MapPin,
  Settings
} from 'lucide-react-native';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { router } from 'expo-router';

export default function ProfessionalDashboard() {
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

  const recentJobs = [
    {
      id: '1',
      title: 'Reparare instalație sanitară',
      client: 'Maria Popescu',
      location: 'Cluj-Napoca, Mănăștur',
      budget: '200-300 LEI',
      status: 'active',
      timeLeft: '2 zile',
      applicants: 3
    },
    {
      id: '2',
      title: 'Instalare sistem încălzire',
      client: 'Ion Radu',
      location: 'Cluj-Napoca, Zorilor',
      budget: '500-800 LEI',
      status: 'pending',
      timeLeft: '5 zile',
      applicants: 7
    },
    {
      id: '3',
      title: 'Revizie generală instalații',
      client: 'Ana Ionescu',
      location: 'Cluj-Napoca, Gheorgheni',
      budget: '150-250 LEI',
      status: 'new',
      timeLeft: '1 zi',
      applicants: 1
    }
  ];

  const upcomingBookings = [
    {
      id: '1',
      client: 'Gheorghe Mihai',
      service: 'Instalare boiler',
      date: 'Mâine, 10:00',
      location: 'Cluj-Napoca',
      value: '350 LEI'
    },
    {
      id: '2',
      client: 'Elena Vasile',
      service: 'Reparare țevi',
      date: 'Miercuri, 14:30',
      location: 'Florești',
      value: '180 LEI'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'new': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activ';
      case 'pending': return 'În așteptare';
      case 'new': return 'Nou';
      default: return 'Necunoscut';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Bună ziua, {user?.name}!</Text>
            <Text style={styles.headerSubtitle}>
              Gestionează-ți business-ul eficient
            </Text>
            
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.thisMonth.earnings} LEI</Text>
                <Text style={styles.statLabel}>Luna aceasta</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.thisMonth.jobs}</Text>
                <Text style={styles.statLabel}>Job-uri</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.thisMonth.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acțiuni Rapide</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/professional/jobs')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <Briefcase size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Oportunități</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/professional/calendar')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
                <Calendar size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Calendar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/professional/analytics')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F59E0B20' }]}>
                <TrendingUp size={24} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>Statistici</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/professional/portfolio')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF620' }]}>
                <Award size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.actionText}>Portofoliu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performanță Săptămână</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <Eye size={20} color="#3B82F6" />
                <Text style={styles.performanceValue}>{stats.thisWeek.viewsOnProfile}</Text>
              </View>
              <Text style={styles.performanceLabel}>Vizualizări profil</Text>
            </View>
            
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <MessageCircle size={20} color="#10B981" />
                <Text style={styles.performanceValue}>{stats.thisWeek.messagesReceived}</Text>
              </View>
              <Text style={styles.performanceLabel}>Mesaje primite</Text>
            </View>
            
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <Briefcase size={20} color="#F59E0B" />
                <Text style={styles.performanceValue}>{stats.thisWeek.jobApplications}</Text>
              </View>
              <Text style={styles.performanceLabel}>Aplicații trimise</Text>
            </View>
            
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeader}>
                <CheckCircle size={20} color="#8B5CF6" />
                <Text style={styles.performanceValue}>{stats.thisWeek.bookings}</Text>
              </View>
              <Text style={styles.performanceLabel}>Rezervări noi</Text>
            </View>
          </View>
        </View>

        {/* Recent Job Opportunities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Oportunități Recente</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/professional/jobs')}>
              <Text style={styles.seeAllText}>Vezi toate</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jobsContainer}>
            {recentJobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                      {getStatusText(job.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.jobDetails}>
                  <View style={styles.jobDetailRow}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>{job.client}</Text>
                  </View>
                  <View style={styles.jobDetailRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>{job.location}</Text>
                  </View>
                  <View style={styles.jobDetailRow}>
                    <DollarSign size={14} color="#6B7280" />
                    <Text style={styles.jobDetailText}>{job.budget}</Text>
                  </View>
                </View>
                
                <View style={styles.jobFooter}>
                  <View style={styles.jobMeta}>
                    <Clock size={14} color="#F59E0B" />
                    <Text style={styles.timeLeftText}>{job.timeLeft}</Text>
                    <Text style={styles.applicantsText}>• {job.applicants} aplicanți</Text>
                  </View>
                  <ArrowRight size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Programări Următoare</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/professional/calendar')}>
              <Text style={styles.seeAllText}>Calendar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bookingsContainer}>
            {upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.bookingClient}>{booking.client}</Text>
                  <Text style={styles.bookingValue}>{booking.value}</Text>
                </View>
                <Text style={styles.bookingService}>{booking.service}</Text>
                <View style={styles.bookingFooter}>
                  <View style={styles.bookingTime}>
                    <Calendar size={14} color="#F59E0B" />
                    <Text style={styles.bookingDate}>{booking.date}</Text>
                  </View>
                  <View style={styles.bookingLocation}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.bookingLocationText}>{booking.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Completion */}
        <View style={styles.section}>
          <View style={styles.profileCompletion}>
            <View style={styles.completionHeader}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.completionTitle}>Completează-ți profilul</Text>
            </View>
            <Text style={styles.completionDescription}>
              Un profil complet te ajută să primești mai multe job-uri
            </Text>
            <View style={styles.completionProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75% complet</Text>
            </View>
            <TouchableOpacity 
              style={styles.completionButton}
              onPress={() => router.push('/(tabs)/professional/profile')}
            >
              <Text style={styles.completionButtonText}>Completează</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: -20,
  },
  headerContent: {
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FEF3C7',
    marginBottom: 24,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FEF3C7',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobsContainer: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    gap: 8,
    marginBottom: 12,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeLeftText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  applicantsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingsContainer: {
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  bookingService: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  bookingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bookingLocationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileCompletion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  completionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  completionProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  completionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
