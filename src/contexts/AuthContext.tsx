import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: Record<string, User> = {
  'tailor@factory.com': {
    id: '1',
    name: 'John Tailor',
    role: 'tailor',
    email: 'tailor@factory.com',
    department: 'Cutting'
  },
  'mechanic@factory.com': {
    id: '2',
    name: 'Mike Mechanic',
    role: 'mechanic',
    email: 'mechanic@factory.com',
    department: 'Maintenance'
  },
  'manager@factory.com': {
    id: '3',
    name: 'Sarah Manager',
    role: 'manager',
    email: 'manager@factory.com',
    department: 'Operations'
  },
  'head@factory.com': {
    id: '4',
    name: 'David Head',
    role: 'head',
    email: 'head@factory.com',
    department: 'Administration'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setIsLoading(true);
        await fetchUserData(session.user.id);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        setUser(null);
        setError('User not found in users table. Please contact admin.');
        setIsLoading(false);
        return;
      }
      setUser(data as User);
      setIsLoading(false);
    } catch (error) {
      setUser(null);
      setError('Error fetching user data.');
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if this is a demo login
      if (DEMO_USERS[email] && password === 'password') {
        // For demo purposes, simulate successful login
        setUser(DEMO_USERS[email]);
        setIsLoading(false);
        return true;
      }
      
      // Try actual Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // If Supabase auth fails, check if it's a demo user
        if (DEMO_USERS[email] && password === 'password') {
          setUser(DEMO_USERS[email]);
          setIsLoading(false);
          return true;
        }
        throw error;
      }
      
      return !!data.user;
    } catch (error) {
      setError('Invalid email or password.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If it's a demo user, just clear the state
      if (user && DEMO_USERS[user.email]) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      // Otherwise, use Supabase logout
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      setError('Error logging out.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}