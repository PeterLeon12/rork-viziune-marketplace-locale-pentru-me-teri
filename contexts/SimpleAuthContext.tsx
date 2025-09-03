import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple user interface
interface SimpleUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'pro';
}

interface SimpleAuthState {
  user: SimpleUser | null;
  isLoading: boolean;
}

interface SimpleAuthContextType {
  user: SimpleUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'client' | 'pro') => Promise<void>;
  logout: () => Promise<void>;
}

// Create context
const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

// Provider component
export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimpleAuthState>({
    user: null,
    isLoading: true,
  });

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔐 Initializing authentication...');
      try {
        const storedUser = await AsyncStorage.getItem('@simple_user');
        console.log('📱 Stored user data:', storedUser);
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ User found in storage:', parsedUser);
          setState({
            user: parsedUser,
            isLoading: false,
          });
        } else {
          console.log('❌ No user found in storage');
          setState({
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('🚨 Auth init error:', error);
        setState({
          user: null,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simple mock login
    const mockUser: SimpleUser = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      role: 'client',
    };

    await AsyncStorage.setItem('@simple_user', JSON.stringify(mockUser));
    setState({ user: mockUser, isLoading: false });
  };

  const register = async (email: string, password: string, name: string, role: 'client' | 'pro') => {
    // Simple mock registration
    const mockUser: SimpleUser = {
      id: 'user_' + Date.now(),
      email,
      name,
      role,
    };

    await AsyncStorage.setItem('@simple_user', JSON.stringify(mockUser));
    setState({ user: mockUser, isLoading: false });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@simple_user');
    setState({ user: null, isLoading: false });
  };

  const value: SimpleAuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    login,
    register,
    logout,
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

// Hook
export const useSimpleAuth = (): SimpleAuthContextType => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
  }
  return context;
};
