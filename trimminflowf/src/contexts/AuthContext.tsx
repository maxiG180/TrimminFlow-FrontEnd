'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setTokenGetter } from '@/lib/axios';

/**
 * User information stored in auth context
 */
export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  barbershopId: string;
}

/**
 * Auth context value type
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 *
 * This provider manages authentication state using in-memory storage for JWT tokens.
 *
 * SECURITY APPROACH - In-Memory Token Storage:
 * - Access token is stored ONLY in memory (React state)
 * - Token is NOT stored in localStorage or cookies
 * - Token is lost on page refresh (user must re-login)
 * - This prevents XSS attacks from stealing tokens
 *
 * WHY IN-MEMORY?
 * 1. localStorage - Vulnerable to XSS attacks (malicious scripts can read it)
 * 2. Cookies - Can be vulnerable to CSRF attacks (unless httpOnly, but then JS can't read it)
 * 3. In-Memory - Most secure, but requires re-login on refresh
 *
 * For production, you might want to:
 * - Add refresh tokens in httpOnly cookies
 * - Implement silent refresh mechanism
 * - Add token expiry handling
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Get the current access token from memory
   */
  const getAccessToken = useCallback(() => {
    return accessToken;
  }, [accessToken]);

  /**
   * Set up axios interceptor with token getter
   * This allows axios to access the token from memory
   */
  useEffect(() => {
    setTokenGetter(getAccessToken);
  }, [getAccessToken]);

  /**
   * Listen for unauthorized events from axios interceptor
   * Automatically logout user when token expires
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, []);

  /**
   * Login function
   *
   * @param email - User's email
   * @param password - User's password
   * @throws Error if login fails
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store token in memory (React state)
      setAccessToken(data.accessToken);

      // Store user info in memory
      setUser({
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        barbershopId: data.barbershopId,
      });
    } catch (error) {
      // Clear any existing auth state on error
      setAccessToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears all authentication state from memory
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // Optionally redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!accessToken,
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 *
 * Usage:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
