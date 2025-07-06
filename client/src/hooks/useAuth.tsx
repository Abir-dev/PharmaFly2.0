import React, { useState, useEffect, createContext, useContext } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: string | null }>;
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

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('pharmafly_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('pharmafly_token');
      const storedUser = localStorage.getItem('pharmafly_user');
      
      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders(),
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('pharmafly_token');
            localStorage.removeItem('pharmafly_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('pharmafly_token');
          localStorage.removeItem('pharmafly_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        setUser(data.user);
        localStorage.setItem('pharmafly_token', data.token);
        localStorage.setItem('pharmafly_user', JSON.stringify(data.user));
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.error || 'Login failed' };
      }
    } catch (error) {
      setLoading(false);
      return { error: 'Network error. Please check your connection.' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        setUser(data.user);
        localStorage.setItem('pharmafly_token', data.token);
        localStorage.setItem('pharmafly_user', JSON.stringify(data.user));
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        if (data.details && Array.isArray(data.details)) {
          // Handle validation errors
          const errorMessages = data.details.map((detail: any) => detail.msg).join(', ');
          return { error: errorMessages };
        }
        return { error: data.error || 'Registration failed' };
      }
    } catch (error) {
      setLoading(false);
      return { error: 'Network error. Please check your connection.' };
    }
  };

  const signOut = async () => {
    try {
      // Call logout endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of server response
      setUser(null);
      localStorage.removeItem('pharmafly_token');
      localStorage.removeItem('pharmafly_user');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('pharmafly_user', JSON.stringify(data.user));
        return { error: null };
      } else {
        return { error: data.error || 'Profile update failed' };
      }
    } catch (error) {
      return { error: 'Network error' };
    }
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