import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = useCallback(async (phone: string): Promise<void> => {
    try {
      setIsLoading(true);
      // In a real app, this would call your backend API
      console.log('Sending OTP to:', phone);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just log the OTP
      console.log('OTP sent successfully (demo: 123456)');
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (phone: string, otp: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would verify OTP with your backend
      if (otp !== '123456') {
        throw new Error('Invalid OTP');
      }

      // Create mock user
      const mockUser: User = {
        id: 'user_' + Date.now(),
        role: 'client',
        phone,
        name: 'User',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    sendOTP,
  }), [user, isLoading, login, logout, sendOTP]);
});