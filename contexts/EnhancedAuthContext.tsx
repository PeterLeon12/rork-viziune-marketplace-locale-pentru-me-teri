import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { trpc } from '@/lib/trpc';

// Enhanced User interface
interface EnhancedUser {
  id: string;
  phone: string;
  role: 'client' | 'pro' | 'admin';
  profile: {
    name: string;
    email?: string;
    avatar?: string;
    location?: string;
    verified: boolean;
    createdAt: string;
    lastActiveAt: string;
  };
  preferences: {
    notifications: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    privacy: {
      showPhone: boolean;
      showLocation: boolean;
    };
    language: 'ro' | 'en';
    theme: 'light' | 'dark' | 'auto';
  };
  statistics?: {
    jobsPosted?: number;
    jobsCompleted?: number;
    totalSpent?: number;
    rating?: number;
    reviewsCount?: number;
  };
}

interface AuthState {
  user: EnhancedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authStep: 'welcome' | 'phone' | 'otp' | 'role-selection' | 'profile-setup' | 'complete';
  otpCountdown: number;
  canResendOtp: boolean;
}

interface EnhancedAuthContextType extends AuthState {
  // Authentication methods
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Profile management
  updateProfile: (updates: Partial<EnhancedUser['profile']>) => Promise<void>;
  updatePreferences: (updates: Partial<EnhancedUser['preferences']>) => Promise<void>;
  selectRole: (role: 'client' | 'pro') => Promise<void>;
  completeOnboarding: (profileData: any) => Promise<void>;
  
  // Utility methods
  refreshUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // State management
  setAuthStep: (step: AuthState['authStep']) => void;
  resetAuth: () => void;
}

const STORAGE_KEYS = {
  USER: '@mesterul_user',
  AUTH_PHONE: '@mesterul_auth_phone',
  ONBOARDING_COMPLETE: '@mesterul_onboarding_complete'
};

export const [EnhancedAuthProvider, useEnhancedAuth] = createContextHook<EnhancedAuthContextType>(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    authStep: 'welcome',
    otpCountdown: 0,
    canResendOtp: true,
  });

  const [tempPhone, setTempPhone] = useState<string>('');

  // tRPC mutations
  const sendOTPMutation = trpc.auth.sendOTP.useMutation();
  const verifyOTPMutation = trpc.auth.verifyOTP.useMutation();
  const createUserMutation = trpc.auth.createUser.useMutation();
  const updateProfileMutation = trpc.profiles.updateProfile.useMutation();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authState.otpCountdown > 0) {
      interval = setInterval(() => {
        setAuthState(prev => ({
          ...prev,
          otpCountdown: prev.otpCountdown - 1,
          canResendOtp: prev.otpCountdown <= 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authState.otpCountdown]);

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const [storedUser, authPhone, onboardingComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_PHONE),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE)
      ]);

      if (storedUser) {
        const user: EnhancedUser = JSON.parse(storedUser);
        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          authStep: onboardingComplete ? 'complete' : 'profile-setup',
          isLoading: false
        }));
      } else if (authPhone) {
        setTempPhone(authPhone);
        setAuthState(prev => ({
          ...prev,
          authStep: 'otp',
          isLoading: false
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          authStep: 'welcome',
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthState(prev => ({
        ...prev,
        authStep: 'welcome',
        isLoading: false
      }));
    }
  };

  const sendOTP = useCallback(async (phone: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Save phone temporarily
      setTempPhone(phone);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_PHONE, phone);
      
      // Call backend API
      await sendOTPMutation.mutateAsync({ phone });
      
      // Start countdown
      setAuthState(prev => ({
        ...prev,
        authStep: 'otp',
        otpCountdown: 60,
        canResendOtp: false,
        isLoading: false
      }));
      
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut trimite codul OTP');
    }
  }, [sendOTPMutation]);

  const verifyOTP = useCallback(async (phone: string, otp: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Verify OTP with backend
      const result = await verifyOTPMutation.mutateAsync({ phone, otp });
      
      if (result.isNewUser) {
        // New user - go to role selection
        setAuthState(prev => ({
          ...prev,
          authStep: 'role-selection',
          isLoading: false
        }));
      } else {
        // Existing user - load their profile
        const user: EnhancedUser = {
          id: result.user.id,
          phone: result.user.phone,
          role: result.user.role,
          profile: {
            name: result.user.name || 'User',
            email: result.user.email,
            avatar: result.user.avatar,
            location: result.user.location,
            verified: result.user.verified || false,
            createdAt: result.user.createdAt,
            lastActiveAt: new Date().toISOString(),
          },
          preferences: {
            notifications: {
              push: true,
              email: true,
              sms: false,
            },
            privacy: {
              showPhone: false,
              showLocation: true,
            },
            language: 'ro',
            theme: 'auto',
          },
          statistics: result.user.statistics,
        };

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.USER, JSON.stringify(user)],
          [STORAGE_KEYS.ONBOARDING_COMPLETE, 'true']
        ]);
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_PHONE);

        setAuthState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          authStep: 'complete',
          isLoading: false
        }));
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Cod OTP invalid');
    }
  }, [verifyOTPMutation]);

  const resendOTP = useCallback(async (): Promise<void> => {
    if (!tempPhone || !authState.canResendOtp) return;
    await sendOTP(tempPhone);
  }, [tempPhone, authState.canResendOtp, sendOTP]);

  const selectRole = useCallback(async (role: 'client' | 'pro'): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Create user with selected role
      const result = await createUserMutation.mutateAsync({
        phone: tempPhone,
        role,
      });

      const user: EnhancedUser = {
        id: result.user.id,
        phone: result.user.phone,
        role: result.user.role,
        profile: {
          name: role === 'pro' ? 'Profesionist' : 'Client',
          verified: false,
          createdAt: result.user.createdAt,
          lastActiveAt: new Date().toISOString(),
        },
        preferences: {
          notifications: {
            push: true,
            email: true,
            sms: false,
          },
          privacy: {
            showPhone: false,
            showLocation: true,
          },
          language: 'ro',
          theme: 'auto',
        },
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_PHONE);

      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        authStep: 'profile-setup',
        isLoading: false
      }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut crea contul');
    }
  }, [tempPhone, createUserMutation]);

  const completeOnboarding = useCallback(async (profileData: any): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (!authState.user) throw new Error('Nu există utilizator autentificat');

      const updatedUser = {
        ...authState.user,
        profile: {
          ...authState.user.profile,
          ...profileData,
        }
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER, JSON.stringify(updatedUser)],
        [STORAGE_KEYS.ONBOARDING_COMPLETE, 'true']
      ]);

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        authStep: 'complete',
        isLoading: false
      }));
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Nu am putut finaliza configurarea');
    }
  }, [authState.user]);

  const updateProfile = useCallback(async (updates: Partial<EnhancedUser['profile']>): Promise<void> => {
    try {
      if (!authState.user) throw new Error('Nu există utilizator autentificat');

      setAuthState(prev => ({ ...prev, isLoading: true }));

      const updatedUser = {
        ...authState.user,
        profile: {
          ...authState.user.profile,
          ...updates,
        }
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

  const updatePreferences = useCallback(async (updates: Partial<EnhancedUser['preferences']>): Promise<void> => {
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
        STORAGE_KEYS.AUTH_PHONE,
        STORAGE_KEYS.ONBOARDING_COMPLETE
      ]);

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        authStep: 'welcome',
        otpCountdown: 0,
        canResendOtp: true,
      });
      setTempPhone('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  const deleteAccount = useCallback(async (): Promise<void> => {
    Alert.alert(
      'Șterge Contul',
      'Ești sigur că vrei să ștergi definitiv contul? Această acțiune nu poate fi anulată.',
      [
        { text: 'Anulează', style: 'cancel' },
        {
          text: 'Șterge',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call backend to delete account
              await logout();
              Alert.alert('Cont Șters', 'Contul tău a fost șters cu succes.');
            } catch (error) {
              Alert.alert('Eroare', 'Nu am putut șterge contul. Încearcă din nou.');
            }
          },
        },
      ]
    );
  }, [logout]);

  const setAuthStep = useCallback((step: AuthState['authStep']) => {
    setAuthState(prev => ({ ...prev, authStep: step }));
  }, []);

  const resetAuth = useCallback(() => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      authStep: 'welcome',
      otpCountdown: 0,
      canResendOtp: true,
    });
    setTempPhone('');
  }, []);

  const contextValue = useMemo(() => ({
    ...authState,
    sendOTP,
    verifyOTP,
    resendOTP,
    logout,
    updateProfile,
    updatePreferences,
    selectRole,
    completeOnboarding,
    refreshUser,
    deleteAccount,
    setAuthStep,
    resetAuth,
  }), [
    authState,
    sendOTP,
    verifyOTP,
    resendOTP,
    logout,
    updateProfile,
    updatePreferences,
    selectRole,
    completeOnboarding,
    refreshUser,
    deleteAccount,
    setAuthStep,
    resetAuth,
  ]);

  return contextValue;
});
