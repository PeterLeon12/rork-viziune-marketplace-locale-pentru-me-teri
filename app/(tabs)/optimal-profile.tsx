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
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useOptimalAuth } from '@/contexts/OptimalAuthContext';
import { 
  User, 
  LogOut, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  Settings, 
  Star, 
  MapPin, 
  Edit3,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Award,
  Camera,
  Bell,
  Globe,
  Trash2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react-native';
import Loading from '@/components/Loading';
import { useRouter } from 'expo-router';
import EnhancedLocationPicker from '@/components/EnhancedLocationPicker';

// Welcome Screen
const WelcomeScreen = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) => (
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

        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={onLogin}>
            <Text style={styles.primaryButtonText}>Conectează-te</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={onRegister}>
            <Text style={styles.secondaryButtonText}>Creează cont</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          Continuând, accepți Termenii și Condițiile și Politica de Confidențialitate
        </Text>
      </View>
    </SafeAreaView>
  </LinearGradient>
);

// Login Screen
const LoginScreen = ({ 
  onBack, 
  onForgotPassword, 
  onRegister,
  onLogin,
  isLoading 
}: { 
  onBack: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }
    onLogin(email, password);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.authHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.authTitle}>Bine ai revenit!</Text>
          <Text style={styles.authSubtitle}>
            Conectează-te pentru a continua
          </Text>
        </View>

        <ScrollView style={styles.authForm} showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
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
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Parola</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Parola ta"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoComplete="password"
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

          <View style={styles.loginOptions}>
            <TouchableOpacity 
              style={styles.rememberOption}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <CheckCircle size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Ține-mă conectat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgotText}>Ai uitat parola?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, (!email || !password || isLoading) && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? (
              <RefreshCw size={20} color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Conectează-te</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>sau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.socialButtonText}>Continuă cu Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.facebookIcon}>
              <Text style={styles.facebookIconText}>f</Text>
            </View>
            <Text style={styles.socialButtonText}>Continuă cu Facebook</Text>
          </TouchableOpacity>

          <View style={styles.switchAuth}>
            <Text style={styles.switchText}>Nu ai cont? </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.switchLink}>Creează unul acum</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Register Screen
const RegisterScreen = ({ 
  onBack, 
  onLogin,
  onRegister,
  isLoading 
}: { 
  onBack: () => void;
  onLogin: () => void;
  onRegister: (email: string, password: string, name: string, role: 'client' | 'pro') => void;
  isLoading: boolean;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = () => {
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
    onRegister(email, password, name, role);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.authHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.authTitle}>Creează-ți contul</Text>
          <Text style={styles.authSubtitle}>
            Alătură-te comunității Meșterul
          </Text>
        </View>

        <ScrollView style={styles.authForm} showsVerticalScrollIndicator={false}>
          {/* Role Selection */}
          <View style={styles.roleSelection}>
            <Text style={styles.inputLabel}>Vreau să fiu:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
                onPress={() => setRole('client')}
              >
                <User size={20} color={role === 'client' ? '#FFFFFF' : '#3B82F6'} />
                <Text style={[styles.roleButtonText, role === 'client' && styles.roleButtonTextActive]}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'pro' && styles.roleButtonActive]}
                onPress={() => setRole('pro')}
              >
                <Award size={20} color={role === 'pro' ? '#FFFFFF' : '#3B82F6'} />
                <Text style={[styles.roleButtonText, role === 'pro' && styles.roleButtonTextActive]}>
                  Profesionist
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Numele complet</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ion Popescu"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                autoComplete="name"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Parola</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmă parola</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput]}
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

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.rememberOption}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <CheckCircle size={16} color="#FFFFFF" />}
              </View>
              <Text style={styles.termsTextSmall}>
                Accept <Text style={styles.termsLink}>Termenii și Condițiile</Text> și{' '}
                <Text style={styles.termsLink}>Politica de Confidențialitate</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[
              styles.primaryButton, 
              (!name || !email || !password || !confirmPassword || !agreeTerms || isLoading) && styles.disabledButton
            ]} 
            onPress={handleRegister}
            disabled={!name || !email || !password || !confirmPassword || !agreeTerms || isLoading}
          >
            {isLoading ? (
              <RefreshCw size={20} color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Creează contul</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchAuth}>
            <Text style={styles.switchText}>Ai deja cont? </Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.switchLink}>Conectează-te</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Forgot Password Screen
const ForgotPasswordScreen = ({ 
  onBack, 
  onSendEmail,
  isLoading 
}: { 
  onBack: () => void;
  onSendEmail: (email: string) => void;
  isLoading: boolean;
}) => {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    if (!email.trim()) {
      Alert.alert('Eroare', 'Te rugăm să introduci adresa de email');
      return;
    }
    onSendEmail(email);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <View style={styles.authHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.authTitle}>Ai uitat parola?</Text>
        <Text style={styles.authSubtitle}>
          Introdu email-ul și îți vom trimite instrucțiuni pentru resetare
        </Text>
      </View>

      <View style={styles.authForm}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputWrapper}>
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
              autoFocus
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, (!email || isLoading) && styles.disabledButton]} 
          onPress={handleSendEmail}
          disabled={!email || isLoading}
        >
          {isLoading ? (
            <RefreshCw size={20} color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Trimite email-ul</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Main Profile Screen
export default function OptimalProfileScreen() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    authMode,
    needsOnboarding,
    login,
    register,
    logout, 
    forgotPassword,
    loginWithGoogle,
    loginWithFacebook,
    updateProfile,
    updatePreferences,
    sendEmailVerification,
    setAuthMode
  } = useOptimalAuth();

  const [showSettings, setShowSettings] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      Alert.alert('Succes', 'Te-ai conectat cu succes!');
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    }
  };

  const handleRegister = async (email: string, password: string, name: string, role: 'client' | 'pro') => {
    try {
      await register(email, password, name, role);
      Alert.alert('Succes', 'Contul a fost creat cu succes!');
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await forgotPassword(email);
      setAuthMode('login');
    } catch (error: any) {
      Alert.alert('Eroare', error.message);
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

  const handleLocationSelect = (location: any) => {
    updateProfile({ location: location.name });
  };

  if (isLoading) {
    return <Loading message="Se încarcă..." />;
  }

  // Authentication Flow
  if (!isAuthenticated) {
    switch (authMode) {
      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => setAuthMode('login')}
            onRegister={() => setAuthMode('register')}
          />
        );
      
      case 'login':
        return (
          <LoginScreen
            onBack={() => setAuthMode('welcome')}
            onForgotPassword={() => setAuthMode('forgot-password')}
            onRegister={() => setAuthMode('register')}
            onLogin={handleLogin}
            isLoading={isLoading}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen
            onBack={() => setAuthMode('welcome')}
            onLogin={() => setAuthMode('login')}
            onRegister={handleRegister}
            isLoading={isLoading}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onBack={() => setAuthMode('login')}
            onSendEmail={handleForgotPassword}
            isLoading={isLoading}
          />
        );
      
      default:
        return (
          <WelcomeScreen
            onLogin={() => setAuthMode('login')}
            onRegister={() => setAuthMode('register')}
          />
        );
    }
  }

  // Main Profile Interface (simplified version of the previous one)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient colors={['#3B82F6', '#1E40AF']} style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || 'https://via.placeholder.com/80' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.avatarEdit}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <View style={styles.profileMeta}>
                <Text style={styles.profileRole}>
                  {user?.role === 'pro' ? 'Profesionist' : 'Client'}
                </Text>
                {user?.verified ? (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.verifiedText}>Verificat</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.unverifiedBadge}
                    onPress={sendEmailVerification}
                  >
                    <AlertCircle size={16} color="#F59E0B" />
                    <Text style={styles.unverifiedText}>Verifică email</Text>
                  </TouchableOpacity>
                )}
              </View>
              {user?.location && (
                <View style={styles.locationInfo}>
                  <MapPin size={14} color="#E5E7EB" />
                  <Text style={styles.locationText}>{user.location}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowSettings(true)}
            >
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => setShowLocationPicker(true)}>
            <MapPin size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Locația</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => setShowSettings(true)}>
            <Settings size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Setări</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <HelpCircle size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Ajutor</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Deconectează-te</Text>
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

      {/* Simple Settings Modal */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalCancel}>Închide</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Setări</Text>
            <View style={styles.modalPlaceholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Notificări</Text>
              <Switch value={user?.preferences.notifications} />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingTitle}>Actualizări prin email</Text>
              <Switch value={user?.preferences.emailUpdates} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Styles (continuing with a comprehensive stylesheet...)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  
  // Authentication Styles
  authGradient: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
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
    alignItems: 'flex-start',
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
  authButtons: {
    width: '100%',
    gap: 12,
  },
  authHeader: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    padding: 8,
  },
  authTitle: {
    fontSize: 28,
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
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
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
    borderColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  termsText: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  rememberText: {
    fontSize: 14,
    color: '#374151',
  },
  forgotText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  facebookIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  roleSelection: {
    marginBottom: 24,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  roleButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsTextSmall: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: '#3B82F6',
    fontWeight: '500',
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
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unverifiedText: {
    fontSize: 12,
    color: '#F59E0B',
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
  
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  
  // Logout
  logoutContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  },
  logoutText: {
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
    paddingTop: 24,
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
