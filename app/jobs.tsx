import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { useAppStore } from '@/store/useAppStore';
import { Clock, MapPin, Euro, User } from 'lucide-react-native';

export default function JobsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const { categories, areas } = useAppStore();

  const { data: jobsData, isLoading, refetch } = trpc.jobs.getOpenJobs.useQuery({
    category: selectedCategory || undefined,
    area: selectedArea || undefined,
    limit: 20,
  });

  const applyToJobMutation = trpc.jobs.applyToJob.useMutation({
    onSuccess: () => {
      Alert.alert('Succes', 'Aplicația a fost trimisă cu succes!');
      refetch();
    },
    onError: (error) => {
      Alert.alert('Eroare', error.message);
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleApplyToJob = (jobId: string) => {
    Alert.prompt(
      'Aplică la Job',
      'Scrie un mesaj pentru client:',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Trimite',
          onPress: (message) => {
            if (message && message.trim()) {
              applyToJobMutation.mutate({
                jobId,
                message: message.trim(),
              });
            }
          },
        },
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'urgent': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'Scăzută';
      case 'medium': return 'Medie';
      case 'high': return 'Ridicată';
      case 'urgent': return 'Urgent';
      default: return 'Medie';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job-uri Disponibile</Text>
        <Text style={styles.subtitle}>
          {jobsData?.jobs.length || 0} job-uri găsite
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, !selectedCategory && styles.filterButtonActive]}
            onPress={() => setSelectedCategory('')}
          >
            <Text style={[styles.filterButtonText, !selectedCategory && styles.filterButtonTextActive]}>
              Toate categoriile
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.filterButton, selectedCategory === category.id && styles.filterButtonActive]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[styles.filterButtonText, selectedCategory === category.id && styles.filterButtonTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Se încarcă job-urile...</Text>
          </View>
        ) : jobsData?.jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nu s-au găsit job-uri</Text>
            <Text style={styles.emptyDescription}>
              Încearcă să modifici filtrele sau verifică din nou mai târziu
            </Text>
          </View>
        ) : (
          jobsData?.jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(job.urgency) }]}>
                  <Text style={styles.urgencyText}>
                    {getUrgencyLabel(job.urgency)}
                  </Text>
                </View>
              </View>

              <Text style={styles.jobDescription} numberOfLines={3}>
                {job.description}
              </Text>

              <View style={styles.jobDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.area}</Text>
                </View>
                
                {job.budget && (
                  <View style={styles.detailItem}>
                    <Euro size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{job.budget} RON</Text>
                  </View>
                )}

                <View style={styles.detailItem}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    {new Date(job.createdAt).toLocaleDateString('ro-RO')}
                  </Text>
                </View>
              </View>

              <View style={styles.jobFooter}>
                <View style={styles.clientInfo}>
                  <User size={16} color="#6B7280" />
                  <Text style={styles.clientName}>{job.client.name}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApplyToJob(job.id)}
                  disabled={applyToJobMutation.isPending}
                >
                  <Text style={styles.applyButtonText}>
                    {applyToJobMutation.isPending ? 'Se trimite...' : 'Aplică'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clientName: {
    fontSize: 12,
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
