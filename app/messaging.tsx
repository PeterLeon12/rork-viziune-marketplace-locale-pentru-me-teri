import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  MoreVertical,
  MessageCircle,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { trpc } from '@/lib/trpc';

interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  createdAt: string;
  readAt?: string;
}

interface Conversation {
  id: string;
  clientId: string;
  proId: string;
  jobId: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
}

export default function MessagingScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get or create conversation
  const { mutate: getOrCreateConversation } = trpc.messaging.getOrCreateConversation.useMutation({
    onSuccess: (data) => {
      setConversation(data);
      // Fetch messages for this conversation
      if (data.id) {
        fetchMessages();
      }
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to start conversation');
    },
  });

  // Get messages
  const { refetch: fetchMessages } = trpc.messaging.getMessages.useQuery(
    { conversationId: conversation?.id || '', limit: 50 },
    { enabled: !!conversation?.id }
  );

  // Send message
  const { mutate: sendMessage } = trpc.messaging.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessage('');
      // Refresh messages
      if (conversation?.id) {
        fetchMessages();
      }
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to send message');
    },
  });

  useEffect(() => {
    if (params.jobId && params.proId && user?.id) {
      getOrCreateConversation({
        clientId: user.id,
        proId: params.proId as string,
        jobId: params.jobId as string,
      });
    }
  }, [params.jobId, params.proId, user?.id]);

  const handleSendMessage = () => {
    if (!message.trim() || !conversation?.id || !user?.id) return;

    sendMessage({
      conversationId: conversation.id,
      senderId: user.id,
      content: message.trim(),
      messageType: 'text',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {new Date(item.createdAt).toLocaleTimeString('ro-RO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#1F2937" />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Chat cu Profesionistul</Text>
        <Text style={styles.headerSubtitle}>Job: {params.jobTitle || 'Detalii job'}</Text>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {renderHeader()}
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        inverted
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>Începe conversația</Text>
            <Text style={styles.emptyStateSubtitle}>
              Trimite primul mesaj pentru a începe să comunici cu profesionistul
            </Text>
          </View>
        }
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Paperclip size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Scrie un mesaj..."
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} color={message.trim() ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  myMessageTime: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#6B7280',
    textAlign: 'left',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    padding: 12,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
});
