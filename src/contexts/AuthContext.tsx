import { dataInitService } from '../services/dataInitService';
import { supabase } from '../services/supabaseClient';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/database';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  setUserDepartment: (department: string) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check for Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Found active Supabase session');
          const userData: User = {
            id: session.user.id,
            username: session.user.email || '',
            role: 'user',
          };
          setUser(userData);
          localStorage.setItem('tracttutor_user', JSON.stringify(userData));
        } else {
          // If no Supabase session, check local storage
          const savedUser = localStorage.getItem('tracttutor_user');
          if (savedUser) {
            console.log('Found user in local storage');
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // If there's an error with Supabase, fall back to local storage
        const savedUser = localStorage.getItem('tracttutor_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (username: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Admin login (fixed credentials)
      if (role === 'admin') {
        if (username === 'Admin' && password === 'IARE@TrackTutor') {
          const userData: User = {
            id: 'admin',
            username,
            role,
          };
          setUser(userData);
          localStorage.setItem('tracttutor_user', JSON.stringify(userData));
          try {
            await dataInitService.initializeAppData();
          } catch {}
          return true;
        } else {
          return false;
        }
      }
      // User login via Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // username is email for Supabase
        password,
      });
      if (error || !data.user) {
        return false;
      }
      const userData: User = {
        id: data.user.id,
        username: data.user.email || '',
        role: 'user',
      };
      setUser(userData);
      localStorage.setItem('tracttutor_user', JSON.stringify(userData));
      try {
        await dataInitService.initializeAppData();
      } catch {}
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log('Signed out from Supabase');
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    } finally {
      // Always clear local state regardless of Supabase success
      setUser(null);
      localStorage.removeItem('tracttutor_user');
    }
  };

  const setUserDepartment = (department: string) => {
    if (user) {
      const updatedUser = { ...user, department };
      setUser(updatedUser);
      localStorage.setItem('tracttutor_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setUserDepartment }}>
      {children}
    </AuthContext.Provider>
  );
};
