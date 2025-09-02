import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Star, MapPin, Clock, Shield, MessageCircle, Phone } from 'lucide-react-native';

interface ProProfile {
  id: string;
  displayName: string;
  company: string;
  categories: string[];
  zones: string[];
  minPrice: number;
  about: string;
  verified: boolean;
  responseTimeAvgMins: number;
  ratingAvg: number;
  ratingCount: number;
  photoUrl: string | null;
}

interface ProCardProps {
  profile: ProProfile;
  onPress?: () => void;
}

export function ProCard({ profile, onPress }: ProCardProps) {
  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const formatPrice = (price: number) => {
    return `from ${price} RON`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            {profile.photoUrl ? (
              <Image source={{ uri: profile.photoUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {profile.displayName.charAt(0).toUpperCase()}
              </Text>
            )}
            {profile.verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.displayName}>{profile.displayName}</Text>
            <Text style={styles.company}>{profile.company}</Text>
          </View>
        </View>
        
        {/* Rating */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{profile.ratingAvg}</Text>
          </View>
          <Text style={styles.ratingCount}>({profile.ratingCount})</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {profile.categories.slice(0, 3).map((category, index) => (
          <View key={index} style={styles.categoryChip}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        ))}
        {profile.categories.length > 3 && (
          <Text style={styles.moreCategories}>+{profile.categories.length - 3} more</Text>
        )}
      </View>

      {/* About */}
      <Text style={styles.about} numberOfLines={2}>
        {profile.about}
      </Text>

      {/* Location and Response Time */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {profile.zones.slice(0, 2).join(', ')}
            {profile.zones.length > 2 && ' + more'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            Responds in {formatResponseTime(profile.responseTimeAvgMins)}
          </Text>
        </View>
      </View>

      {/* Price and Actions */}
      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(profile.minPrice)}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton}>
            <MessageCircle size={16} color="#2563EB" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton}>
            <Phone size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    flex: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  moreCategories: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  about: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
    marginLeft: 4,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});