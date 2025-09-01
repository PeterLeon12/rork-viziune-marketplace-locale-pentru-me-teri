import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { 
  Star, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  Send
} from 'lucide-react-native';
import { mockProfiles, mockServices, mockReviews, categories, areas } from '@/constants/data';

export default function ProProfileScreen() {
  const { id } = useLocalSearchParams();
  const profile = mockProfiles.find(p => p.id === id);
  
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Profil meșter' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Profilul nu a fost găsit</Text>
        </View>
      </SafeAreaView>
    );
  }

  const services = mockServices.filter(s => s.proId === profile.id);
  const reviews = mockReviews.filter(r => r.proId === profile.id);

  const handleWhatsApp = () => {
    Linking.openURL(profile.contact.whatsappLink);
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${profile.contact.phone}`);
  };

  const handleMessage = () => {
    // In a real app, this would open the chat screen
    console.log('Open chat');
  };

  const getCategoryNames = () => {
    return profile.categories
      .map(catId => categories.find(cat => cat.id === catId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getZoneNames = () => {
    return profile.zones
      .map(zoneId => areas.find(area => area.id === zoneId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: profile.displayName,
          headerBackTitle: 'Înapoi'
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: profile.photoUrl }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{profile.displayName}</Text>
              {profile.verified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={16} color="#10B981" />
                  <Text style={styles.verifiedText}>Verificat</Text>
                </View>
              )}
            </View>
            <Text style={styles.categories}>{getCategoryNames()}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.statText}>
                  {profile.ratingAvg.toFixed(1)} ({profile.ratingCount} recenzii)
                </Text>
              </View>
              <View style={styles.stat}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.statText}>
                  Răspunde în ~{profile.responseTimeAvgMins} min
                </Text>
              </View>
            </View>
            <View style={styles.stat}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.statText}>Zone: {getZoneNames()}</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Despre</Text>
          <Text style={styles.aboutText}>{profile.about}</Text>
        </View>

        {/* Services */}
        {services.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicii & prețuri</Text>
            <Text style={styles.priceDisclaimer}>
              Prețurile sunt orientative. Confirmă oferta cu meșterul.
            </Text>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.servicePrice}>
                    de la {service.priceFrom} lei/{service.unit}
                  </Text>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Recenzii ({reviews.length})
            </Text>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.clientName}</Text>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        color={i < review.rating ? "#F59E0B" : "#E5E7EB"}
                        fill={i < review.rating ? "#F59E0B" : "#E5E7EB"}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                {review.recommend && (
                  <Text style={styles.recommendText}>✓ Recomandă acest meșter</Text>
                )}
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString('ro-RO')}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Sticky Contact Buttons */}
      <View style={styles.contactBar}>
        <TouchableOpacity
          style={[styles.contactButton, styles.whatsappButton]}
          onPress={handleWhatsApp}
        >
          <MessageCircle size={20} color="white" />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.contactButton, styles.phoneButton]}
          onPress={handlePhone}
        >
          <Phone size={20} color="white" />
          <Text style={styles.contactButtonText}>Sună</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.contactButton, styles.messageButton]}
          onPress={handleMessage}
        >
          <Send size={20} color="white" />
          <Text style={styles.contactButtonText}>Mesaj</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  categories: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  statsRow: {
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  priceDisclaimer: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  recommendText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 100,
  },
  contactBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#3B82F6',
  },
  messageButton: {
    backgroundColor: '#6B7280',
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});