import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Verify token is still valid
      authAPI.getMe()
        .then((response) => {
          const updatedUser = {
            ...response.data.user,
            preferred_currency: response.data.user.preferred_currency || 'USD'
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        })
        .catch((error) => {
          console.error('Failed to verify token:', error);
          // Only clear auth if it's a 401 (unauthorized), not 404 (route not found)
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
          // For 404, log but don't clear auth - might be server issue
          if (error.response?.status === 404) {
            console.warn('Auth endpoint not found. Server may not be running or route not registered.');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Listen for Supabase auth state changes (only if Supabase is configured)
    if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            // Sync Supabase user with backend
            const response = await authAPI.socialLogin({
              supabase_user_id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
              provider: session.user.app_metadata?.provider
            });
            const { user, token } = response.data;
            const userWithCurrency = {
              ...user,
              preferred_currency: user.preferred_currency || 'USD'
            };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userWithCurrency));
            setUser(userWithCurrency);
          } catch (error) {
            console.error('Failed to sync social auth user:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { user, token } = response.data;
    const userWithCurrency = {
      ...user,
      preferred_currency: user.preferred_currency || 'USD'
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithCurrency));
    setUser(userWithCurrency);
    return userWithCurrency;
  };

  const register = async (email, password, full_name, phone) => {
    const response = await authAPI.register({ email, password, full_name, phone });
    const { user, token } = response.data;
    const userWithCurrency = {
      ...user,
      preferred_currency: user.preferred_currency || 'USD'
    };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithCurrency));
    setUser(userWithCurrency);
    return userWithCurrency;
  };

  const logout = async () => {
    // Sign out from Supabase if signed in and configured
    if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Supabase sign out error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const signInWithProvider = async (provider) => {
    if (!supabase || !supabase.auth || typeof supabase.auth.signInWithOAuth !== 'function') {
      throw new Error('Social sign-in is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file.');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider, // 'google', 'github', 'facebook', etc.
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      const updatedUser = {
        ...response.data.user,
        preferred_currency: response.data.user.preferred_currency || 'USD'
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, signInWithProvider, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

