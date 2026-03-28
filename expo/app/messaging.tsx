import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Smile,
  File,
  Download,
  Play,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  Camera,
  Mic,
  MicOff
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Enhanced mock conversation data with file sharing
const mockConversation = {
  id: '1',
  participant: {
    name: 'Ion Popescu',
    profession: 'Instalator',
    avatar: 'https://via.placeholder.com/60',
    online: true,
  },
  messages: [
    {
      id: '1',
      text: 'Bună ziua! Am văzut că aveți nevoie de instalarea unei centrale termice.',
      sender: 'them',
      timestamp: '10:30',
      type: 'text',
    },
    {
      id: '2',
      text: 'Da, exact! Când ați putea să veniți să vedeți ce e de făcut?',
      sender: 'me',
      timestamp: '10:32',
      type: 'text',
    },
    {
      id: '3',
      text: 'Pot să vin mâine dimineața în jurul orei 9:00. Vă convine?',
      sender: 'them',
      timestamp: '10:35',
      type: 'text',
    },
    {
      id: '4',
      text: '',
      sender: 'me',
      timestamp: '10:36',
      type: 'image',
      attachments: [
        {
          type: 'image',
          url: 'https://via.placeholder.com/300x200',
          name: 'centrala_veche.jpg',
          size: '245 KB'
        }
      ]
    },
    {
      id: '5',
      text: 'Aceasta este centrala actuală. Vă las și adresa: Strada Florilor nr. 25, București.',
      sender: 'me',
      timestamp: '10:37',
      type: 'text',
    },
    {
      id: '6',
      text: 'Perfect! Vă trimit o ofertă detaliată.',
      sender: 'them',
      timestamp: '10:40',
      type: 'text',
    },
    {
      id: '7',
      text: '',
      sender: 'them',
      timestamp: '10:42',
      type: 'file',
      attachments: [
        {
          type: 'document',
          url: 'https://example.com/oferta.pdf',
          name: 'Oferta_Centrala_Viessmann.pdf',
          size: '1.2 MB'
        }
      ]
    },
    {
      id: '8',
      text: '',
      sender: 'them',
      timestamp: '10:45',
      type: 'quote',
      quote: {
        title: 'Instalare centrală termică Viessmann',
        description: 'Instalare completă centrală termică în condensație 24kW cu sistem de încălzire și apă caldă menajeră',
        price: '4500 RON',
        duration: '2 zile',
        validUntil: '2024-02-15',
        items: [
          'Centrală Viessmann Vitodens 050-W 24kW',
          'Kit evacuare coaxial',
          'Vana de gaz cu filtru',
          'Manoperă instalare și configurare',
          'Garanție 5 ani'
        ]
      }
    },
    {
      id: '9',
      text: 'Oferta arată bine! Când putem programa instalarea?',
      sender: 'me',
      timestamp: '11:15',
      type: 'text',
    },
  ],
};

export default function MessagingScreen() {
  const { user } = useSimpleAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockConversation.messages);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'me' as const,
        timestamp: new Date().toLocaleTimeString('ro-RO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'text' as const,
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleAttachmentPress = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleImageAttachment = () => {
    setShowAttachmentOptions(false);
    // Simulate image attachment
    const newMessage = {
      id: Date.now().toString(),
      text: '',
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'image' as const,
      attachments: [
        {
          type: 'image',
          url: 'https://via.placeholder.com/300x200',
          name: 'imagine_noua.jpg',
          size: '187 KB'
        }
      ]
    };
    
    setMessages([...messages, newMessage]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleFileAttachment = () => {
    setShowAttachmentOptions(false);
    // Simulate file attachment
    const newMessage = {
      id: Date.now().toString(),
      text: '',
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'file' as const,
      attachments: [
        {
          type: 'document',
          url: 'https://example.com/document.pdf',
          name: 'document_important.pdf',
          size: '892 KB'
        }
      ]
    };
    
    setMessages([...messages, newMessage]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === 'me';
    
    return (
      <View style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.theirMessageContainer
      ]}>
        {!isMe && (
          <Image 
            source={{ uri: mockConversation.participant.avatar }} 
            style={styles.messageAvatar} 
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessageBubble : styles.theirMessageBubble,
          item.type !== 'text' && styles.attachmentBubble
        ]}>
          {/* Text Message */}
          {item.type === 'text' && (
            <>
              <Text style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.theirMessageText
              ]}>
                {item.text}
              </Text>
            </>
          )}

          {/* Image Message */}
          {item.type === 'image' && item.attachments && (
            <View style={styles.imageAttachment}>
              <TouchableOpacity onPress={() => setSelectedImage(item.attachments[0].url)}>
                <Image 
                  source={{ uri: item.attachments[0].url }} 
                  style={styles.attachedImage} 
                />
              </TouchableOpacity>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName}>{item.attachments[0].name}</Text>
                <Text style={styles.attachmentSize}>{item.attachments[0].size}</Text>
              </View>
            </View>
          )}

          {/* File Message */}
          {item.type === 'file' && item.attachments && (
            <View style={styles.fileAttachment}>
              <View style={styles.fileIcon}>
                <File size={24} color="#667eea" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{item.attachments[0].name}</Text>
                <Text style={styles.fileSize}>{item.attachments[0].size}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Download size={16} color="#667eea" />
              </TouchableOpacity>
            </View>
          )}

          {/* Quote Message */}
          {item.type === 'quote' && item.quote && (
            <View style={styles.quoteContainer}>
              <View style={styles.quoteHeader}>
                <Text style={styles.quoteTitle}>{item.quote.title}</Text>
                <Text style={styles.quotePrice}>{item.quote.price}</Text>
              </View>
              
              <Text style={styles.quoteDescription}>{item.quote.description}</Text>
              
              <View style={styles.quoteDetails}>
                <View style={styles.quoteDetailItem}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.quoteDetailText}>Durată: {item.quote.duration}</Text>
                </View>
                <View style={styles.quoteDetailItem}>
                  <CheckCircle size={14} color="#6B7280" />
                  <Text style={styles.quoteDetailText}>Valid până: {new Date(item.quote.validUntil).toLocaleDateString('ro-RO')}</Text>
                </View>
              </View>

              <View style={styles.quoteItems}>
                {item.quote.items.map((quoteItem: string, index: number) => (
                  <Text key={index} style={styles.quoteItem}>• {quoteItem}</Text>
                ))}
              </View>

              <View style={styles.quoteActions}>
                <TouchableOpacity style={styles.quoteActionButton}>
                  <Text style={styles.quoteActionText}>Acceptă oferta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.quoteActionButton, styles.quoteActionButtonSecondary]}>
                  <Text style={[styles.quoteActionText, styles.quoteActionTextSecondary]}>Negociază</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Add text if exists for non-text messages */}
          {item.type !== 'text' && item.text && (
            <Text style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.theirMessageText,
              { marginTop: 8 }
            ]}>
              {item.text}
            </Text>
          )}
          
          <Text style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.participantInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: mockConversation.participant.avatar }} 
                style={styles.participantAvatar} 
              />
              {mockConversation.participant.online && (
                <View style={styles.onlineIndicator} />
              )}
            </View>
            
            <View style={styles.participantDetails}>
              <Text style={styles.participantName}>
                {mockConversation.participant.name}
              </Text>
              <Text style={styles.participantStatus}>
                {mockConversation.participant.online ? 'Activ acum' : 'Ultima oară activ ieri'}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Phone size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <Video size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton}>
              <MoreVertical size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Messages List */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.messagesContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Attachment Options */}
        {showAttachmentOptions && (
          <View style={styles.attachmentOptions}>
            <TouchableOpacity style={styles.attachmentOption} onPress={handleImageAttachment}>
              <Camera size={24} color="#667eea" />
              <Text style={styles.attachmentOptionText}>Cameră</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentOption} onPress={handleImageAttachment}>
              <ImageIcon size={24} color="#667eea" />
              <Text style={styles.attachmentOptionText}>Galerie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentOption} onPress={handleFileAttachment}>
              <File size={24} color="#667eea" />
              <Text style={styles.attachmentOptionText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentOption} onPress={() => setShowAttachmentOptions(false)}>
              <MapPin size={24} color="#667eea" />
              <Text style={styles.attachmentOptionText}>Locație</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Scrie un mesaj..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
              />
              
              <View style={styles.inputActions}>
                <TouchableOpacity 
                  style={styles.inputActionButton}
                  onPress={handleAttachmentPress}
                >
                  <Paperclip size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.inputActionButton}
                  onPress={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? (
                    <MicOff size={20} color="#EF4444" />
                  ) : (
                    <Mic size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputActionButton}>
                  <Smile size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                message.trim() || isRecording ? styles.sendButtonActive : styles.sendButtonInactive
              ]}
              onPress={sendMessage}
              disabled={!message.trim() && !isRecording}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Image Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setSelectedImage(null)}
          >
            <X size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage || '' }} style={styles.fullImage} />
        </View>
      </Modal>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  participantDetails: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  participantStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 6,
  },
  theirMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirMessageTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    minHeight: 20,
    maxHeight: 60,
  },
  inputActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  inputActionButton: {
    padding: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#667eea',
  },
  sendButtonInactive: {
    backgroundColor: '#D1D5DB',
  },
  attachmentBubble: {
    padding: 0,
    overflow: 'hidden',
  },
  imageAttachment: {
    overflow: 'hidden',
  },
  attachedImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  attachmentInfo: {
    padding: 12,
  },
  attachmentName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  downloadButton: {
    padding: 8,
  },
  quoteContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  quotePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  quoteDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteDetails: {
    gap: 8,
    marginBottom: 12,
  },
  quoteDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quoteDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  quoteItems: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 4,
  },
  quoteItem: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  quoteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quoteActionButton: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quoteActionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  quoteActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quoteActionTextSecondary: {
    color: '#667eea',
  },
  attachmentOptions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 20,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  attachmentOptionText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 12,
  },
});