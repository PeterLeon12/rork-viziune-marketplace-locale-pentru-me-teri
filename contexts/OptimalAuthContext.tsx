import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { trpc } from '@/lib/trpc';

// Simple, optimal user interface
interface OptimalUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'pro' | 'admin';
  avatar?: string;
  location?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: 'ro' | 'en';
    theme: 'light' | 'dark' | 'auto';
  };
  statistics?: {
    jobsPosted?: number;
    jobsCompleted?: number;
    rating?: number;
    reviewsCount?: number;
  };
}

interface AuthState {
  user: OptimalUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authMode: 'welcome' | 'login' | 'register' | 'forgot-password' | 'complete';
  needsOnboarding: boolean;
}

interface OptimalAuthContextType extends AuthState {
  // Primary authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'client' | 'pro') => Promise<void>;
  logout: () => Promise<void>;
  
  // Password management
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  
  // Social authentication (for future)
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  
  // Profile management
  updateProfile: (updates: Partial<OptimalUser>) => Promise<void>;
  updatePreferences: (updates: Partial<OptimalUser['preferences']>) => Promise<void>;
  completeOnboarding: (profileData: any) => Promise<void>;
  
  // Utility methods
  refreshUser: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // State management
  setAuthMode: (mode: AuthState['authMode']) => void;
  resetAuth: () => void;
}

const STORAGE_KEYS = {
  USER: '@mesterul_user_v2',
  TOKEN: '@mesterul_token',
  REMEMBER_EMAIL: '@mesterul_remember_email',
  ONBOARDING_COMPLETE: '@mesterul_onboarding_complete_v2'
};

export const [OptimalAuthProvider, useOptimalAuth] = createContextHook<OptimalAuthContextType>(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    authMode: 'welcome',
    needsOnboarding: false,
  });

  // tRPC mutations
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const forgotPasswordMutation = trpc.auth.forgotPassword.useMutation();
  const updateProfileMutation = trpc.profiles.updateProfile.useMutation();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const [storedUser, token, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE)
      ]);

      if (storedUser && token) {
        const user: OptimalUser = JSON.parse(storedUser);
        
        // Verify token is still valid (in a real app, you'd validate with backend)
        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          authMode: 'complete',
          needsOnboarding: !onboardingComplete,
          isLoading: false
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          authMode: 'welcome',
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState(prev => ({
        ...prev,
        authMode: 'welcome',
        isLoading: false
      }));
    }
  };

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would call your backend API
      if (email && password.length >= 6) {
        const mockUser: OptimalUser = {
          id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0],
          role: 'client',
          verified: true,
          createdAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailUpdates: true,
            language: 'ro',
            theme: 'auto',
          },
        };

        const mockToken = 'mock_jwt_token_' + Date.now();

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(mockUser)],
          [STORAGE_KEYS.TOKEN, mockToken],
          [STORAGE_KEYS.REMEMBER_EMAIL, email],
        ]);

        setAuthState(prev => ({
          ...prev,
          user: mockUser,
          isAuthenticated: true,
          authMode: 'complete',
          needsOnboarding: false,
          isLoading: false
        }));
      } else {
        throw new Error('Email sau parolă invalidă');
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu ne-am putut conecta. Verifică datele introduse.');
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: 'client' | 'pro'): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate registration
      if (email && password.length >= 6 && name.trim()) {
        const mockUser: OptimalUser = {
          id: 'user_' + Date.now(),
          email,
          name: name.trim(),
          role,
          verified: false, // New users need email verification
          createdAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailUpdates: true,
            language: 'ro',
            theme: 'auto',
          },
        };

        const mockToken = 'mock_jwt_token_' + Date.now();

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(mockUser)],
          [STORAGE_KEYS.TOKEN, mockToken],
          [STORAGE_KEYS.REMEMBER_EMAIL, email],
        ]);

        setAuthState(prev => ({
          ...prev,
          user: mockUser,
          isAuthenticated: true,
          authMode: 'complete',
          needsOnboarding: true,
          isLoading: false
        }));

        // Auto-send verification email
        setTimeout(() => {
          Alert.alert(
            'Verificare email',
            'Am trimis un email de verificare la adresa ta. Verifică inbox-ul și click pe link.',
            [{ text: 'OK' }]
          );
        }, 1000);
      } else {
        throw new Error('Toate câmpurile sunt obligatorii. Parola trebuie să aibă minim 6 caractere.');
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut crea contul. Încearcă din nou.');
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate forgot password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      Alert.alert(
        'Email trimis!',
        'Dacă există un cont cu această adresă, vei primi un email cu instrucțiuni pentru resetarea parolei.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut trimite email-ul de resetare.');
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      Alert.alert(
        'Parolă resetată!',
        'Parola ta a fost schimbată cu succes. Poți să te conectezi cu noua parolă.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut reseta parola.');
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // This would integrate with Google Sign-In
      Alert.alert('Google Login', 'Google Sign-In va fi disponibil în curând!');
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Nu ne-am putut conecta cu Google.');
    }
  }, []);

  const loginWithFacebook = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // This would integrate with Facebook Login
      Alert.alert('Facebook Login', 'Facebook Login va fi disponibil în curând!');
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Nu ne-am putut conecta cu Facebook.');
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<OptimalUser>): Promise<void> => {
    try {
      if (!authState.user) throw new Error('Nu există utilizator autentificat');

      setAuthState(prev => ({ ...prev, isLoading: true }));

      const updatedUser = {
        ...authState.user,
        ...updates,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut actualiza profilul');
    }
  }, [authState.user]);

  const updatePreferences = useCallback(async (updates: Partial<OptimalUser['preferences']>): Promise<void> => {
    try {
      if (!authState.user) throw new Error('Nu există utilizator autentificat');

      const updatedUser = {
        ...authState.user,
        preferences: {
          ...authState.user.preferences,
          ...updates,
        }
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Nu am putut actualiza preferințele');
    }
  }, [authState.user]);

  const completeOnboarding = useCallback(async (profileData: any): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (!authState.user) throw new Error('Nu există utilizator autentificat');

      const updatedUser = {
        ...authState.user,
        ...profileData,
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(updatedUser)],
        [STORAGE_KEYS.ONBOARDING_COMPLETE, 'true']
      ]);

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        needsOnboarding: false,
        isLoading: false
      }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut finaliza configurarea');
    }
  }, [authState.user]);

  const sendEmailVerification = useCallback(async (): Promise<void> => {
    try {
      if (!authState.user) throw new Error('Nu există utilizator autentificat');
      
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Email de verificare trimis!',
        'Verifică inbox-ul și click pe linkul de verificare.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      throw new Error('Nu am putut trimite email-ul de verificare');
    }
  }, [authState.user]);

  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    try {
      if (!authState.user) throw new Error('Nu există utilizator autentificat');
      
      const updatedUser = {
        ...authState.user,
        verified: true,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));

      Alert.alert('Email verificat!', 'Contul tău a fost verificat cu succes.');
    } catch (error: any) {
      throw new Error('Nu am putut verifica email-ul');
    }
  }, [authState.user]);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Refresh user data from backend
      // This would call a getUserProfile endpoint
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('Error refreshing user:', error);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.ONBOARDING_COMPLETE
      ]);
      // Keep REMEMBER_EMAIL for convenience

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        authMode: 'welcome',
        needsOnboarding: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const setAuthMode = useCallback((mode: AuthState['authMode']) => {
    setAuthState(prev => ({ ...prev, authMode: mode }));
  }, []);

  const resetAuth = useCallback(() => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      authMode: 'welcome',
      needsOnboarding: false,
    });
  }, []);

  const contextValue = useMemo(() => ({
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    updateProfile,
    updatePreferences,
    completeOnboarding,
    refreshUser,
    sendEmailVerification,
    verifyEmail,
    setAuthMode,
    resetAuth,
  }), [
    authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    updateProfile,
    updatePreferences,
    completeOnboarding,
    refreshUser,
    sendEmailVerification,
    verifyEmail,
    setAuthMode,
    resetAuth,
  ]);

  return contextValue;
});
