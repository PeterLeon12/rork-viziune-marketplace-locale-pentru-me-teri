import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/utils/trpc';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  urgency: string;
  status: string;
  applications: number;
  postedDate: string;
  responses: { id: string; name: string; rating: number; price: string; responseTime: string }[];
}

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState('posted');
  const { user } = useAuth();
  const { data: jobs, isLoading, error } = trpc.jobs.getMyJobs.useQuery({ 
    status: activeTab === 'posted' ? 'open' : 'completed',
    limit: 50 
  });

  const renderJobCard = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'active' ? styles.statusActive : styles.statusCompleted
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'active' ? 'Activ' : 'Completat'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>Postat {item.postedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <DollarSign size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.budget}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.urgency === 'high' ? 'Urgent' : item.urgency === 'normal' ? 'Normal' : 'Nu e urgent'}
          </Text>
        </View>
      </View>

      <View style={styles.applicationsInfo}>
        <Text style={styles.applicationsText}>
          {item.applications} {item.applications === 1 ? 'aplicație' : 'aplicații'}
        </Text>
        <TouchableOpacity
          style={styles.viewApplicationsButton}
          onPress={() => router.push('/search')}
        >
          <Text style={styles.viewApplicationsText}>Vezi Aplicațiile</Text>
          <Eye size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {item.responses.length > 0 && (
        <View style={styles.responsesSection}>
          <Text style={styles.responsesTitle}>Răspunsuri Recente</Text>
          {item.responses.slice(0, 2).map((response) => (
            <View key={response.id} style={styles.responseItem}>
              <View style={styles.responseInfo}>
                <Text style={styles.responseName}>{response.name}</Text>
                <View style={styles.responseDetails}>
                  <Text style={styles.responseRating}>⭐ {response.rating}</Text>
                  <Text style={styles.responsePrice}>{response.price}</Text>
                  <Text style={styles.responseTime}>{response.responseTime}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <MessageCircle size={16} color="#2563EB" />
                <Text style={styles.contactButtonText}>Contactează</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.jobActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/post-job')}
        >
          <Text style={styles.editButtonText}>Editează</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleCompleteJob(item.id)}
        >
          <CheckCircle size={16} color="#10B981" />
          <Text style={styles.completeButtonText}>Marchează Completat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCompleteJob = (jobId: string) => {
    Alert.alert(
      'Marchează Job-ul ca Completat',
      'Ești sigur că vrei să marchezi acest job ca fiind completat?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Marchează Completat',
          onPress: () => {
            setJobs(jobs.map(job => 
              job.id === jobId ? { ...job, status: 'completed' } : job
            ));
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Plus size={48} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyStateTitle}>
        {activeTab === 'posted' ? 'Nu ai postat încă niciun job' : 'Nu ai aplicat încă la niciun job'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeTab === 'posted' 
          ? 'Postează primul tău job și primește oferte de la profesioniști verificați'
          : 'Găsește job-uri care se potrivesc cu abilitățile tale'
        }
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => activeTab === 'posted' ? router.push('/post-job') : router.push('/search')}
      >
        <Text style={styles.emptyStateButtonText}>
          {activeTab === 'posted' ? 'Postează un Job' : 'Caută Job-uri'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job-urile Mele</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
          onPress={() => setActiveTab('posted')}
        >
          <Text style={[styles.tabText, activeTab === 'posted' && styles.activeTabText]}>
            Job-uri Postate ({jobs.filter(j => j.status === 'active').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completate ({jobs.filter(j => j.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobs.filter(job => 
          activeTab === 'posted' ? job.status === 'active' : job.status === 'completed'
        )}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/post-job')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  searchButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#DBEAFE',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  jobsList: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#DBEAFE',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
  },
  moreButton: {
    padding: 4,
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  applicationsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 16,
  },
  applicationsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  viewApplicationsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewApplicationsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  responsesSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginBottom: 16,
  },
  responsesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  responseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  responseInfo: {
    flex: 1,
  },
  responseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  responseDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  responseRating: {
    fontSize: 12,
    color: '#6B7280',
  },
  responsePrice: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  responseTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
