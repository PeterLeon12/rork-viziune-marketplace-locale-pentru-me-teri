import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,

} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { mockProfiles, mockServices, mockReviews, areas, categories } from '@/constants/data';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Shield,

} from 'lucide-react-native';
import Loading from '@/components/Loading';

export default function ProProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

  const profile = mockProfiles.find(p => p.id === id);
  const services = mockServices.filter(s => s.proId === id);
  const reviews = mockReviews.filter(r => r.proId === id);

  if (!profile) {
    return <Loading message="Se încarcă profilul..." />;
  }

  const profileAreas = areas.filter(area => profile.zones.includes(area.id));
  const profileCategories = categories.filter(cat => profile.categories.includes(cat.id));

  const handleWhatsApp = async () => {
    try {
      const supported = await Linking.canOpenURL(profile.contact.whatsappLink);
      if (supported) {
        await Linking.openURL(profile.contact.whatsappLink);
      } else {
        console.log('WhatsApp not available');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
    }
  };

  const handleCall = async () => {
    try {
      const phoneUrl = `tel:${profile.contact.phone}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      }
    } catch (error) {
      console.error('Error making call:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        color={i < Math.floor(rating) ? '#F59E0B' : '#E5E7EB'}
        fill={i < Math.floor(rating) ? '#F59E0B' : 'transparent'}
      />
    ));
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Despre</Text>
        <Text style={styles.aboutText}>{profile.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zone acoperite</Text>
        <View style={styles.tagsContainer}>
          {profileAreas.map(area => (
            <View key={area.id} style={styles.tag}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.tagText}>{area.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorii</Text>
        <View style={styles.tagsContainer}>
          {profileCategories.map(category => (
            <View key={category.id} style={[styles.tag, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.tagText, { color: category.color }]}>{category.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      {services.length === 0 ? (
        <Text style={styles.emptyText}>Nu sunt servicii disponibile</Text>
      ) : (
        services.map(service => (
          <View key={service.id} style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <Text style={styles.servicePrice}>
              de la {service.priceFrom} lei/{service.unit}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      {reviews.length === 0 ? (
        <Text style={styles.emptyText}>Nu sunt recenzii disponibile</Text>
      ) : (
        reviews.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.clientName}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>
              {new Date(review.createdAt).toLocaleDateString('ro-RO')}
            </Text>
            {review.recommend && (
              <View style={styles.recommendBadge}>
                <Text style={styles.recommendText}>✓ Recomandă</Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: profile.displayName,
          headerStyle: { backgroundColor: '#3B82F6' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '600' },
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: profile.photoUrl || 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.displayName}>{profile.displayName}</Text>
                {profile.verified && (
                  <Shield size={20} color="#10B981" fill="#10B981" />
                )}
              </View>
              <Text style={styles.company}>{profile.company}</Text>
              
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {renderStars(profile.ratingAvg)}
                </View>
                <Text style={styles.ratingText}>
                  {profile.ratingAvg} ({profile.ratingCount} recenzii)
                </Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={16} color="#64748B" />
                  <Text style={styles.metaText}>
                    Răspunde în ~{profile.responseTimeAvgMins} min
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              Despre
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'services' && styles.activeTab]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
              Servicii ({services.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Recenzii ({reviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'reviews' && renderReviewsTab()}
      </ScrollView>

      {/* Sticky Contact Buttons */}
      <View style={styles.contactButtons}>
        <TouchableOpacity 
          style={[styles.contactButton, styles.whatsappButton]}
          onPress={handleWhatsApp}
        >
          <MessageCircle size={20} color="white" />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.contactButton, styles.callButton]}
          onPress={handleCall}
        >
          <Phone size={20} color="white" />
          <Text style={styles.contactButtonText}>Sună</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  profileInfo: {
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  company: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#64748B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  recommendBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 32,
  },
  contactButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: '#3B82F6',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});