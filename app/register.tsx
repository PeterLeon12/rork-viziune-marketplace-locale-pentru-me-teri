import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';
import { router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, Award, ArrowRight, Sparkles, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useSimpleAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Eroare', 'Parolele nu se potrivesc');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Eroare', 'Parola trebuie să aibă minim 6 caractere');
      return;
    }
    
    if (!agreeTerms) {
      Alert.alert('Eroare', 'Trebuie să accepți termenii și condițiile');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name, role);
      // Navigation will be handled by the auth context
    } catch (error: any) {
      Alert.alert('Eroare', error.message || 'Nu am putut să creez contul');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowRight size={24} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Sparkles size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>Meșterul</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              <Text style={styles.welcomeTitle}>Creează-ți contul 🚀</Text>
              <Text style={styles.welcomeSubtitle}>
                Alătură-te comunității Meșterul și începe să lucrezi
              </Text>

              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text style={styles.roleTitle}>Vreau să fiu:</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      role === 'client' && styles.roleButtonActive
                    ]}
                    onPress={() => setRole('client')}
                  >
                    <User size={24} color={role === 'client' ? '#FFFFFF' : '#667eea'} />
                    <Text style={[
                      styles.roleButtonText,
                      role === 'client' && styles.roleButtonTextActive
                    ]}>
                      Client
                    </Text>
                    <Text style={[
                      styles.roleButtonSubtext,
                      role === 'client' && styles.roleButtonSubtextActive
                    ]}>
                      Caut servicii
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.roleButton,
                      role === 'pro' && styles.roleButtonActive
                    ]}
                    onPress={() => setRole('pro')}
                  >
                    <Award size={24} color={role === 'pro' ? '#FFFFFF' : '#667eea'} />
                    <Text style={[
                      styles.roleButtonText,
                      role === 'pro' && styles.roleButtonTextActive
                    ]}>
                      Profesionist
                    </Text>
                    <Text style={[
                      styles.roleButtonSubtext,
                      role === 'pro' && styles.roleButtonSubtextActive
                    ]}>
                      Ofer servicii
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numele complet</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ion Popescu"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="ion@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parola</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Minim 6 caractere"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirmă parola</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repetă parola"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms Agreement */}
              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={styles.termsCheckbox}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View style={[
                    styles.checkbox,
                    agreeTerms && styles.checkboxActive
                  ]}>
                    {agreeTerms && <CheckCircle size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.termsText}>
                    Accept <Text style={styles.termsLink}>Termenii și Condițiile</Text> și{' '}
                    <Text style={styles.termsLink}>Politica de Confidențialitate</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  (!name || !email || !password || !confirmPassword || !agreeTerms || isLoading) && styles.disabledButton
                ]}
                onPress={handleRegister}
                disabled={!name || !email || !password || !confirmPassword || !agreeTerms || isLoading}
              >
                {isLoading ? (
                  <Text style={styles.registerButtonText}>Se creează contul...</Text>
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Creează contul</Text>
                    <ArrowRight size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              {/* Login Prompt */}
              <View style={styles.loginPrompt}>
                <Text style={styles.loginText}>Ai deja cont? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Conectează-te</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: height * 0.05,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  roleSection: {
    marginBottom: 32,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  roleButtonSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  roleButtonSubtextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#667eea',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});
