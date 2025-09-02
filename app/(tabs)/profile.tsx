import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
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
  Crown
} from 'lucide-react-native';
import Loading from '@/components/Loading';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, login, logout, sendOTP } = useAuth();
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci numărul de telefon');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendOTP(phone);
      setStep('otp');
      Alert.alert('Succes', 'Codul OTP a fost trimis pe WhatsApp');
    } catch (error) {
      Alert.alert('Eroare', 'Nu am putut trimite codul OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    if (!otp.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci codul OTP');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(phone, otp);
      Alert.alert('Succes', 'Te-ai conectat cu succes!');
    } catch (error) {
      Alert.alert('Eroare', 'Cod OTP invalid');
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

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <View style={styles.authIconContainer}>
              <User size={48} color="#2563EB" />
            </View>
            <Text style={styles.authTitle}>Bine ai venit pe Meșterul!</Text>
            <Text style={styles.authSubtitle}>
              {step === 'phone'
                ? 'Conectează-te pentru a accesa toate funcționalitățile platformei'
                : 'Introdu codul OTP primit pe WhatsApp pentru a continua'}
            </Text>
          </View>

          {step === 'phone' ? (
            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <Phone size={20} color="#6B7280" />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="+40 7XX XXX XXX"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Se trimite...' : 'Trimite Cod OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="Introdu codul OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
              <TouchableOpacity
                style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Se verifică...' : 'Conectează-te'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setStep('phone')}
              >
                <Text style={styles.secondaryButtonText}>Înapoi</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.demoNoteContainer}>
            <AlertCircle size={16} color="#F59E0B" />
            <Text style={styles.demoNote}>
              Demo: Folosește codul OTP &quot;123456&quot;
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={48} color="white" />
          </View>
          <Text style={styles.userName}>{user?.name || 'Utilizator Meșterul'}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
          <View style={styles.verificationBadge}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.verificationText}>Cont Verificat</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Job-uri Postate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Job-uri Completate</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
                <Clock size={20} color="#2563EB" />
              </View>
              <Text style={styles.menuItemText}>Istoric Job-uri</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                <Star size={20} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>Recenziile Mele</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#D1FAE5' }]}>
                <MapPin size={20} color="#10B981" />
              </View>
              <Text style={styles.menuItemText}>Locațiile Mele</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F3E8FF' }]}>
                <Edit3 size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.menuItemText}>Editează Profilul</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
                <Settings size={20} color="#EF4444" />
              </View>
              <Text style={styles.menuItemText}>Setări</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                <Crown size={20} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>Planuri de Abonare</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
                <Shield size={20} color="#F59E0B" />
              </View>
              <Text style={styles.menuItemText}>Confidențialitate</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#DBEAFE' }]}>
                <HelpCircle size={20} color="#2563EB" />
              </View>
              <Text style={styles.menuItemText}>Ajutor & Suport</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E0E7FF' }]}>
                <Info size={20} color="#6366F1" />
              </View>
              <Text style={styles.menuItemText}>Despre Meșterul</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Deconectează-te</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Meșterul v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
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
  inputContainer: {
    gap: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#1F2937',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 4,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  demoNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  demoNote: {
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileContainer: {
    flex: 1,
    paddingTop: 60,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10B981',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});