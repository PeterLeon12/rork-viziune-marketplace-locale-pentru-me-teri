import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { ProProfile } from '@/types';
import { Star, Shield, Clock, Phone, MessageCircle } from 'lucide-react-native';
import { categories } from '@/constants/data';
import { Linking } from 'react-native';

interface ProCardProps {
  profile: ProProfile;
  onPress: (profile: ProProfile) => void;
}

export default function ProCard({ profile, onPress }: ProCardProps) {
  const handleWhatsApp = () => {
    Linking.openURL(profile.contact.whatsappLink);
  };

  const handlePhone = () => {
    Linking.openURL(`tel:${profile.contact.phone}`);
  };

  const getCategoryNames = () => {
    return profile.categories
      .map(catId => categories.find(cat => cat.id === catId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(profile)}
      testID={`pro-card-${profile.id}`}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: profile.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.displayName}
            </Text>
            {profile.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#10B981" />
              </View>
            )}
          </View>
          <Text style={styles.categories} numberOfLines={1}>
            {getCategoryNames()}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.rating}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>
                {profile.ratingAvg.toFixed(1)} ({profile.ratingCount})
              </Text>
            </View>
            <View style={styles.responseTime}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.responseTimeText}>
                ~{profile.responseTimeAvgMins} min
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>
          de la {profile.minPrice} lei
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.whatsappButton]}
            onPress={handleWhatsApp}
          >
            <MessageCircle size={16} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.phoneButton]}
            onPress={handlePhone}
          >
            <Phone size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  categories: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '500',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  whatsappButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  phoneButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
});