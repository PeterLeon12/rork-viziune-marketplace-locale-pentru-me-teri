import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { Plus, Search, Filter, Clock, MapPin, DollarSign, Star } from 'lucide-react-native';
import { router } from 'expo-router';

// Mock data for jobs
const mockJobs = [
  {
    id: '1',
    title: 'Vreau să-mi fac o gardă nouă',
    description: 'Am nevoie de o gardă nouă în jurul casei. Materialul să fie de calitate.',
    category: 'Construcții',
    location: 'București, Sector 1',
    budget: '800-1200 RON',
    urgency: 'normal',
    postedAt: '2 zile în urmă',
    proposals: 3,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Instalare centrală termică',
    description: 'Caut un instalator pentru montarea unei centrale termice noi.',
    category: 'Instalații',
    location: 'Cluj-Napoca',
    budget: '1500-2000 RON',
    urgency: 'high',
    postedAt: '1 zi în urmă',
    proposals: 5,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Reparație ușă de garaj',
    description: 'Ușa de garaj nu se închide corect. Am nevoie de reparație urgentă.',
    category: 'Reparații',
    location: 'Timișoara',
    budget: '200-400 RON',
    urgency: 'high',
    postedAt: '3 ore în urmă',
    proposals: 2,
    rating: 4.7,
  },
];

export default function JobsScreen() {
  const { user } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState('posted');
  const [jobs] = useState(mockJobs);

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Clock size={16} color="#EF4444" />;
      case 'normal':
        return <Clock size={16} color="#3B82F6" />;
      case 'low':
        return <Clock size={16} color="#10B981" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Urgent';
      case 'normal':
        return 'Normal';
      case 'low':
        return 'Nu e urgent';
      default:
        return 'Normal';
    }
  };

  const renderJobCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={styles.urgencyBadge}>
          {getUrgencyIcon(item.urgency)}
          <Text style={styles.urgencyText}>{getUrgencyText(item.urgency)}</Text>
        </View>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>
        
        {item.budget && (
          <View style={styles.metaItem}>
            <DollarSign size={16} color="#6B7280" />
            <Text style={styles.metaText}>{item.budget}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.jobFooter}>
        <Text style={styles.postedAt}>{item.postedAt}</Text>
        <View style={styles.proposalsContainer}>
          <Text style={styles.proposalsText}>{item.proposals} oferte</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Se încarcă...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
          onPress={() => setActiveTab('posted')}
        >
          <Text style={[styles.tabText, activeTab === 'posted' && styles.activeTabText]}>
            Postate
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'in-progress' && styles.activeTab]}
          onPress={() => setActiveTab('in-progress')}
        >
          <Text style={[styles.tabText, activeTab === 'in-progress' && styles.activeTabText]}>
            În Progres
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Finalizate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'posted' && (
          <>
            {jobs.length > 0 ? (
              <FlatList
                data={jobs}
                renderItem={renderJobCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.jobsList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>Nu ai postat niciun job încă</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Creează primul tău job și începe să primești oferte de la profesioniști
                </Text>
                <TouchableOpacity
                  style={styles.createJobButton}
                  onPress={() => router.push('/post-job')}
                >
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.createJobButtonText}>Creează Primul Job</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        
        {activeTab === 'in-progress' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nu ai job-uri în progres</Text>
            <Text style={styles.emptyStateSubtitle}>
              Job-urile vor apărea aici când începi să lucrezi cu profesioniști
            </Text>
          </View>
        )}
        
        {activeTab === 'completed' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Nu ai job-uri finalizate</Text>
            <Text style={styles.emptyStateSubtitle}>
              Job-urile finalizate vor apărea aici cu recenziile tale
            </Text>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/post-job')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  jobsList: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedAt: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  proposalsContainer: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proposalsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createJobButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createJobButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

