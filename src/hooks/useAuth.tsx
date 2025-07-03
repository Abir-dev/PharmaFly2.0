import React, { useState, useEffect, createContext, useContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock user for development - replace with your actual authentication
  useEffect(() => {
    // For now, we'll use a mock user. In the future, integrate with your existing login system
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      full_name: 'John Doe',
      role: 'customer',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Uncomment the line below to simulate a logged-in user
    // setUser(mockUser);
  }, []);

  const signIn = async (email: string, password: string) => {
    // TODO: Integrate with your existing login system
    // For now, return success for demo purposes
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // TODO: Integrate with your existing signup system
    // For now, return success for demo purposes
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };
    
    // Update local user state
    setUser(prev => prev ? { ...prev, ...updates } : null);
    return { error: null };
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 