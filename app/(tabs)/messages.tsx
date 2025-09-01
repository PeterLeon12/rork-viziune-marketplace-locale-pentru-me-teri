import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, Clock } from 'lucide-react-native';

const mockConversations = [
  {
    id: '1',
    proName: 'Instalații Pro SRL',
    lastMessage: 'Pot veni mâine dimineața pentru verificare',
    timestamp: '10:30',
    unread: true,
  },
  {
    id: '2',
    proName: 'ElectricMaster',
    lastMessage: 'Mulțumesc pentru recenzie!',
    timestamp: 'Ieri',
    unread: false,
  },
];

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesaje</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {mockConversations.length > 0 ? (
          mockConversations.map((conversation) => (
            <TouchableOpacity key={conversation.id} style={styles.conversationCard}>
              <View style={styles.conversationInfo}>
                <Text style={styles.proName}>{conversation.proName}</Text>
                <Text style={[
                  styles.lastMessage,
                  conversation.unread && styles.unreadMessage
                ]}>
                  {conversation.lastMessage}
                </Text>
              </View>
              <View style={styles.conversationMeta}>
                <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                {conversation.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Niciun mesaj încă</Text>
            <Text style={styles.emptyDescription}>
              Conversațiile cu meșterii vor apărea aici
            </Text>
          </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  conversationCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  conversationInfo: {
    flex: 1,
  },
  proName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
  },
  unreadMessage: {
    color: '#374151',
    fontWeight: '500',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});