import { dataInitService } from '../services/dataInitService';

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
    // Check for existing session
    const savedUser = localStorage.getItem('tracttutor_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Add this import at the top

  const login = async (username: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - replace with real API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        role,
      };
      
      setUser(userData);
      localStorage.setItem('tracttutor_user', JSON.stringify(userData));
      
      // Initialize application data after successful login
      try {
        await dataInitService.initializeAppData();
        console.log("Application data initialized after login");
      } catch (dataError) {
        console.error("Failed to initialize application data after login:", dataError);
        // Continue with login even if data initialization fails
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tracttutor_user');
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
