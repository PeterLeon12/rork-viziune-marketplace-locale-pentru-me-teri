import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useOptimalAuth } from '../contexts/OptimalAuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useOptimalAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Eroare', 'Te rog completează toate câmpurile');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Eroare', 'Parola trebuie să aibă cel puțin 6 caractere');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name, role);
      // Will automatically navigate to tabs due to auth state change
    } catch (error: any) {
      Alert.alert('Eroare de înregistrare', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Alătură-te Meșterul!</Text>
            <Text style={styles.subtitle}>Creează-ți contul și începe să lucrezi</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Numele tău complet"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Lock size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Parolă (minim 6 caractere)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Alege tipul de cont:</Text>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'client' && styles.roleButtonActive
                  ]}
                  onPress={() => setRole('client')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === 'client' && styles.roleButtonTextActive
                  ]}>
                    Client
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    role === 'client' && styles.roleDescriptionActive
                  ]}>
                    Caut profesioniști
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'pro' && styles.roleButtonActive
                  ]}
                  onPress={() => setRole('pro')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    role === 'pro' && styles.roleButtonTextActive
                  ]}>
                    Profesionist
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    role === 'pro' && styles.roleDescriptionActive
                  ]}>
                    Ofer servicii
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Se înregistrează...' : 'Înregistrare'}
              </Text>
              {!isLoading && <ArrowRight size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>
                Ai deja cont? Conectează-te
              </Text>
            </TouchableOpacity>
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
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  roleSection: {
    gap: 12,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  roleButtonTextActive: {
    color: '#10B981',
  },
  roleDescription: {
    fontSize: 12,
    color: '#D1FAE5',
  },
  roleDescriptionActive: {
    color: '#6B7280',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    textAlign: 'center',
    color: '#D1FAE5',
    fontSize: 16,
    marginTop: 16,
  },
});
