import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { 
  Search, 
  MessageSquare, 
  Plus,
  Phone,
  Video,
  MoreVertical,
  Send
} from 'lucide-react-native';
import { router } from 'expo-router';

// Mock conversations data
const mockConversations = [
  {
    id: '1',
    name: 'Ion Popescu',
    profession: 'Instalator',
    lastMessage: 'Pot să vin mâine dimineața să vedem ce e de făcut.',
    timestamp: '10:30',
    unread: 2,
    avatar: 'https://via.placeholder.com/60',
    online: true,
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    profession: 'Curățenie',
    lastMessage: 'Am terminat cu curățenia. Totul arată perfect!',
    timestamp: 'Ieri',
    unread: 0,
    avatar: 'https://via.placeholder.com/60',
    online: false,
  },
  {
    id: '3',
    name: 'Alexandru Dumitrescu',
    profession: 'Constructor',
    lastMessage: 'Materialele au ajuns. Când să încep lucrarea?',
    timestamp: 'Marți',
    unread: 1,
    avatar: 'https://via.placeholder.com/60',
    online: true,
  },
];

export default function MessagesScreen() {
  const { user } = useSimpleAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations] = useState(mockConversations);

  const handleConversationPress = (conversation: any) => {
    router.push('/messaging');
  };

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.conversationBody}>
          <Text style={styles.profession}>{item.profession}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
        
        <Text 
          style={[
            styles.lastMessage, 
            item.unread > 0 && styles.unreadMessage
          ]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
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
        <Text style={styles.headerTitle}>Mesaje</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Plus size={24} color="#667eea" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Caută conversații..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Conversations List */}
      <View style={styles.conversationsContainer}>
        {conversations.length > 0 ? (
          <FlatList
            data={conversations}
            renderItem={renderConversationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.conversationsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <MessageSquare size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>Niciun mesaj încă</Text>
            <Text style={styles.emptyStateSubtitle}>
              Conversațiile tale vor apărea aici când vei începe să vorbești cu profesioniștii
            </Text>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => router.push('/search')}
            >
              <Text style={styles.startButtonText}>Caută Profesioniști</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  conversationsContainer: {
    flex: 1,
  },
  conversationsList: {
    paddingVertical: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  conversationBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profession: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  unreadMessage: {
    color: '#374151',
    fontWeight: '500',
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
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});