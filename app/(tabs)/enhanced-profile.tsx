import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { 
  User, 
  LogOut, 
  Phone, 
  Settings, 
  Star, 
  Clock, 
  MapPin, 
  Edit3,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Crown,
  Camera,
  Bell,
  Lock,
  Globe,
  Moon,
  Trash2,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Mail,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react-native';
import Loading from '@/components/Loading';
import { useRouter } from 'expo-router';
import EnhancedLocationPicker from '@/components/EnhancedLocationPicker';

const { width } = Dimensions.get('window');

// Authentication Screens
const WelcomeScreen = ({ onContinue }: { onContinue: () => void }) => (
  <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.authGradient}>
    <SafeAreaView style={styles.authContainer}>
      <View style={styles.authContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <User size={60} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>Meșterul</Text>
          <Text style={styles.logoSubtext}>Marketplace de Servicii</Text>
        </View>

        <View style={styles.welcomeFeatures}>
          <View style={styles.featureItem}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.featureText}>Profesioniști verificați</Text>
          </View>
          <View style={styles.featureItem}>
            <Shield size={24} color="#10B981" />
            <Text style={styles.featureText}>Plăți securizate</Text>
          </View>
          <View style={styles.featureItem}>
            <Star size={24} color="#10B981" />
            <Text style={styles.featureText}>Recenzii reale</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Începe acum</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Continuând, accepți Termenii și Condițiile și Politica de Confidențialitate
        </Text>
      </View>
    </SafeAreaView>
  </LinearGradient>
);

const PhoneScreen = ({ 
  phone, 
  setPhone, 
  onSendOTP, 
  isLoading 
}: { 
  phone: string;
  setPhone: (phone: string) => void;
  onSendOTP: () => void;
  isLoading: boolean;
}) => (
  <View style={styles.authContainer}>
    <View style={styles.authHeader}>
      <View style={styles.authIconContainer}>
        <Phone size={48} color="#3B82F6" />
      </View>
      <Text style={styles.authTitle}>Introdu numărul de telefon</Text>
      <Text style={styles.authSubtitle}>
        Vei primi un cod de verificare pe WhatsApp pentru a continua
      </Text>
    </View>

    <View style={styles.authForm}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Număr de telefon</Text>
        <TextInput
          style={styles.phoneInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="+40 XXX XXX XXX"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          autoFocus
        />
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, (!phone.trim() || isLoading) && styles.disabledButton]} 
        onPress={onSendOTP}
        disabled={!phone.trim() || isLoading}
      >
        {isLoading ? (
          <RefreshCw size={20} color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Trimite codul</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const OTPScreen = ({ 
  otp, 
  setOtp, 
  phone,
  onVerifyOTP, 
  onResendOTP,
  isLoading,
  countdown,
  canResend
}: { 
  otp: string;
  setOtp: (otp: string) => void;
  phone: string;
  onVerifyOTP: () => void;
  onResendOTP: () => void;
  isLoading: boolean;
  countdown: number;
  canResend: boolean;
}) => (
  <View style={styles.authContainer}>
    <View style={styles.authHeader}>
      <View style={styles.authIconContainer}>
        <Shield size={48} color="#3B82F6" />
      </View>
      <Text style={styles.authTitle}>Verifică codul</Text>
      <Text style={styles.authSubtitle}>
        Am trimis un cod pe WhatsApp la {phone}
      </Text>
    </View>

    <View style={styles.authForm}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cod de verificare</Text>
        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={setOtp}
          placeholder="123456"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, (!otp.trim() || isLoading) && styles.disabledButton]} 
        onPress={onVerifyOTP}
        disabled={!otp.trim() || isLoading}
      >
        {isLoading ? (
          <RefreshCw size={20} color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Verifică codul</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.secondaryButton, !canResend && styles.disabledButton]}
        onPress={onResendOTP}
        disabled={!canResend}
      >
        <Text style={[styles.secondaryButtonText, !canResend && styles.disabledText]}>
          {canResend ? 'Retrimite codul' : `Retrimite în ${countdown}s`}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RoleSelectionScreen = ({ onSelectRole, isLoading }: { 
  onSelectRole: (role: 'client' | 'pro') => void;
  isLoading: boolean;
}) => (
  <View style={styles.authContainer}>
    <View style={styles.authHeader}>
      <View style={styles.authIconContainer}>
        <Target size={48} color="#3B82F6" />
      </View>
      <Text style={styles.authTitle}>Alege rolul tău</Text>
      <Text style={styles.authSubtitle}>
        Selectează cum vrei să folosești platforma
      </Text>
    </View>

    <View style={styles.roleContainer}>
      <TouchableOpacity 
        style={styles.roleCard}
        onPress={() => onSelectRole('client')}
        disabled={isLoading}
      >
        <View style={styles.roleIcon}>
          <User size={40} color="#3B82F6" />
        </View>
        <Text style={styles.roleTitle}>Client</Text>
        <Text style={styles.roleDescription}>
          Caut profesioniști pentru servicii de care am nevoie
        </Text>
        <View style={styles.roleFeatures}>
          <Text style={styles.roleFeature}>• Postez job-uri</Text>
          <Text style={styles.roleFeature}>• Primesc oferte</Text>
          <Text style={styles.roleFeature}>• Evaluez serviciile</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.roleCard}
        onPress={() => onSelectRole('pro')}
        disabled={isLoading}
      >
        <View style={[styles.roleIcon, { backgroundColor: '#F59E0B20' }]}>
          <Award size={40} color="#F59E0B" />
        </View>
        <Text style={styles.roleTitle}>Profesionist</Text>
        <Text style={styles.roleDescription}>
          Ofer servicii și vreau să îmi găsesc clienți
        </Text>
        <View style={styles.roleFeatures}>
          <Text style={styles.roleFeature}>• Creez profil profesional</Text>
          <Text style={styles.roleFeature}>• Răspund la job-uri</Text>
          <Text style={styles.roleFeature}>• Primesc plăți</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Profile Screen
export default function EnhancedProfileScreen() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    authStep,
    otpCountdown,
    canResendOtp,
    sendOTP, 
    verifyOTP,
    resendOTP,
    logout, 
    selectRole,
    updateProfile,
    updatePreferences,
    deleteAccount,
    setAuthStep
  } = useEnhancedAuth();

  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci numărul de telefon');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendOTP(phone);
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci codul OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyOTP(phone, otp);
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsSubmitting(true);
      await resendOTP();
      Alert.alert('Succes', 'Codul a fost retrimis');
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectRole = async (role: 'client' | 'pro') => {
    try {
      setIsSubmitting(true);
      await selectRole(role);
      Alert.alert('Succes', `Cont ${role === 'pro' ? 'profesionist' : 'client'} creat cu succes!`);
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Deconectare',
      'Ești sigur că vrei să te deconectezi?',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Deconectează-te',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleUpdateProfile = async (updates: any) => {
    try {
      await updateProfile(updates);
      setEditingProfile(false);
      Alert.alert('Succes', 'Profilul a fost actualizat');
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    }
  };

  const handleLocationSelect = (location: any) => {
    handleUpdateProfile({ location: location.name });
  };

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  // Authentication Flow
  if (!isAuthenticated) {
    switch (authStep) {
      case 'welcome':
        return <WelcomeScreen onContinue={() => setAuthStep('phone')} />;
      
      case 'phone':
        return (
          <PhoneScreen
            phone={phone}
            setPhone={setPhone}
            onSendOTP={handleSendOTP}
            isLoading={isSubmitting}
          />
        );
      
      case 'otp':
        return (
          <OTPScreen
            otp={otp}
            setOtp={setOtp}
            phone={phone}
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            isLoading={isSubmitting}
            countdown={otpCountdown}
            canResend={canResendOtp}
          />
        );
      
      case 'role-selection':
        return (
          <RoleSelectionScreen
            onSelectRole={handleSelectRole}
            isLoading={isSubmitting}
          />
        );
      
      default:
        return <WelcomeScreen onContinue={() => setAuthStep('phone')} />;
    }
  }

  // Main Profile Interface
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.profile.avatar || 'https://via.placeholder.com/80' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarEdit}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user?.profile.name}</Text>
              <View style={styles.profileMeta}>
                <Text style={styles.profileRole}>
                  {user?.role === 'pro' ? 'Profesionist' : 'Client'}
                </Text>
                {user?.profile.verified && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verificat</Text>
                  </View>
                )}
              </View>
              {user?.profile.location && (
                <View style={styles.locationInfo}>
                  <MapPin size={14} color="#E5E7EB" />
                  <Text style={styles.locationText}>{user.profile.location}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditingProfile(true)}
            >
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Cards */}
        {user?.statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.statNumber}>{user.statistics.jobsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Job-uri</Text>
            </View>
            <View style={styles.statCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{user.statistics.rating?.toFixed(1) || '0.0'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Calendar size={24} color="#10B981" />
              <Text style={styles.statNumber}>{user.statistics.reviewsCount || 0}</Text>
              <Text style={styles.statLabel}>Recenzii</Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSection}>Cont</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => setEditingProfile(true)}>
            <View style={styles.menuIcon}>
              <User size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Editează profilul</Text>
              <Text style={styles.menuSubtitle}>Actualizează informațiile personale</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowLocationPicker(true)}>
            <View style={styles.menuIcon}>
              <MapPin size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Locația</Text>
              <Text style={styles.menuSubtitle}>{user?.profile.location || 'Nu este setată'}</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <View style={styles.menuIcon}>
              <Settings size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Setări</Text>
              <Text style={styles.menuSubtitle}>Notificări, confidențialitate</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <Text style={styles.menuSection}>Suport</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <HelpCircle size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Ajutor & Suport</Text>
              <Text style={styles.menuSubtitle}>FAQ, contactează-ne</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Info size={20} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Despre aplicație</Text>
              <Text style={styles.menuSubtitle}>Versiune 1.0.0</Text>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Deconectează-te</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.deleteText}>Șterge contul</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <EnhancedLocationPicker
        isVisible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelect={handleLocationSelect}
        title="Selectează locația"
        placeholder="Caută orașul tău..."
      />

      {/* Settings Modal - Simple version for now */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalCancel}>Anulează</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Setări</Text>
            <View style={styles.modalPlaceholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.settingsSection}>Notificări</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Notificări push</Text>
              <Switch value={user?.preferences.notifications.push} />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Email</Text>
              <Switch value={user?.preferences.notifications.email} />
            </View>

            <Text style={styles.settingsSection}>Confidențialitate</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Afișează numărul de telefon</Text>
              <Switch value={user?.preferences.privacy.showPhone} />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Afișează locația</Text>
              <Switch value={user?.preferences.privacy.showLocation} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (I'll continue with the styles in the next part due to length constraints)
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  
  // Authentication Styles
  authGradient: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  authContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logoSubtext: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  welcomeFeatures: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  authForm: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  phoneInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 8,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  termsText: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  
  // Role Selection
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  roleFeatures: {
    gap: 4,
  },
  roleFeature: {
    fontSize: 14,
    color: '#4B5563',
  },
  
  // Profile Screen
  profileHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileRole: {
    fontSize: 14,
    color: '#E5E7EB',
    marginRight: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  
  // Statistics
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  
  // Menu
  menuContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  menuSection: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    marginTop: 24,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#3B82F6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalPlaceholder: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  settingsSection: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1F2937',
  },
});
