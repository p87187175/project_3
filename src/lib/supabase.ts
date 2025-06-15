import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Test function to verify connection and data
export const testConnection = async () => {
  try {
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    console.log('Auth connection successful:', authData);

    // Test database
    const { data: machinesData, error: machinesError } = await supabase
      .from('machines')
      .select('*')
      .limit(1);
    if (machinesError) throw machinesError;
    console.log('Database connection successful:', machinesData);

    // Test realtime (subscribe only once, then unsubscribe and remove)
    const channel = supabase.channel('test-channel');
    let subscribed = false;
    await new Promise((resolve) => {
      channel.subscribe((status) => {
        if (!subscribed && status === 'SUBSCRIBED') {
          subscribed = true;
          console.log('Realtime connection status:', status);
          channel.unsubscribe();
          supabase.removeChannel(channel);
          resolve(true);
        }
      });
    });

    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};