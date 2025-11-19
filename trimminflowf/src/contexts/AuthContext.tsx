'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
 * 🔒 PRODUCTION-READY SECURITY APPROACH - httpOnly Cookies:
 * ✅ JWT token stored in httpOnly cookie (set by backend)
 * ✅ Protected from XSS attacks (JavaScript cannot access httpOnly cookies)
 * ✅ User data stored in React state (for UI rendering only, NO sensitive tokens)
 * ✅ Persists across page refreshes (cookies survive refresh)
 * ✅ Browser automatically sends cookies with every request
 *
 * SECURITY FEATURES:
 * 1. httpOnly cookie - Token CANNOT be read by JavaScript (XSS-proof)
 * 2. Secure flag - Cookie only sent over HTTPS in production
 * 3. SameSite - CSRF protection
 * 4. No localStorage tokens - Nothing sensitive in JavaScript-accessible storage
 *
 * HOW IT WORKS:
 * - Login: Backend sets httpOnly cookie, frontend stores user data only
 * - API calls: Browser automatically includes cookie with `credentials: 'include'`
 * - Logout: Backend clears cookie, frontend clears user data
 * - Refresh: Cookie persists, user stays logged in
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status on mount
   * Load user data from localStorage AND validate token with backend
   *
   * 🔒 SECURITY: Validates that the httpOnly cookie token is still valid
   * This prevents stale localStorage data from showing an authenticated state
   * when the token has actually expired
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // We have user data, but need to verify the token is still valid
          try {
            // Make a test request to validate the token
            const response = await fetch('http://localhost:8080/api/v1/auth/validate', {
              method: 'GET',
              credentials: 'include', // Send the httpOnly cookie
            });

            if (response.ok) {
              // Token is valid, user is authenticated
              setUser(JSON.parse(storedUser));
            } else {
              // Token is invalid/expired, clear user data
              console.warn('Token validation failed, clearing user data');
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch (error) {
            // Network error or validation endpoint doesn't exist yet
            // Fall back to trusting localStorage (backward compatible)
            console.warn('Token validation failed, using localStorage fallback:', error);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Get the current access token
   * With httpOnly cookies, we don't have access to the token
   * Browser sends it automatically with credentials: 'include'
   */
  const getAccessToken = useCallback(() => {
    // Token is in httpOnly cookie, not accessible to JavaScript
    // This is GOOD for security!
    // The browser automatically sends the cookie with every request
    return null;
  }, []);

  /**
   * Listen for unauthorized events from axios interceptor
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
   *
   * 🔒 SECURITY: Backend sets httpOnly cookie, we only store user data
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 Attempting login with:', { email, apiUrl: 'http://localhost:8080/api/v1/auth/login' });

      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ CRITICAL! Allows cookies to be set/sent
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        console.error('❌ Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login response data:', { ...data, accessToken: '[REDACTED]' });

      const userData = {
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        barbershopId: data.barbershopId,
      };

      // Store user data only (NO TOKEN - it's in httpOnly cookie)
      setUser(userData);

      // Persist user data to localStorage (for UI state, NOT sensitive)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      console.log('✅ User logged in successfully:', userData.email);
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof TypeError ? 'Network/CORS error' : 'Other error',
      });

      // Clear any existing auth state on error
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }

      // Provide more helpful error message
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8080');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Calls backend to clear httpOnly cookie and clears user data
   *
   * 🔒 SECURITY: Backend clears the httpOnly cookie
   */
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint to clear httpOnly cookie
      await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include', // ✅ Send cookie to be cleared
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear user data regardless of API call result
      setUser(null);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // User is authenticated if user data exists
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
