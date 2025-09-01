import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Phone } from 'lucide-react-native';
import Loading from '@/components/Loading';

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, login, logout, sendOTP } = useAuth();
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authHeader}>
            <User size={48} color="#3B82F6" />
            <Text style={styles.authTitle}>Conectează-te</Text>
            <Text style={styles.authSubtitle}>
              {step === 'phone'
                ? 'Introdu numărul de telefon pentru a primi codul OTP'
                : 'Introdu codul OTP primit pe WhatsApp'}
            </Text>
          </View>

          {step === 'phone' ? (
            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <Phone size={20} color="#64748B" />
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
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Se trimite...' : 'Trimite OTP'}
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
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Se verifică...' : 'Conectează-te'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep('phone')}
              >
                <Text style={styles.backButtonText}>Înapoi</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.demoNote}>
            Demo: Folosește codul OTP "123456"
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={48} color="white" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Istoric comenzi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Recenziile mele</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Setări</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Deconectează-te</Text>
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    gap: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#1E293B',
  },
  otpInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
  },
  demoNote: {
    marginTop: 24,
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileContainer: {
    flex: 1,
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#64748B',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});