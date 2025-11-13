/**
 * React Hook for Supabase Integration
 * 
 * This hook provides easy access to Supabase services and handles
 * the connection state.
 */

import { useState, useEffect } from 'react';
import { isSupabaseConfigured, testSupabaseConnection } from './supabaseIntegration';
import { supabase } from './supabase';

export const useSupabase = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      setError(null);
      
      const configured = isSupabaseConfigured();
      setIsConfigured(configured);
      
      if (configured) {
        try {
          const connected = await testSupabaseConnection();
          setIsConnected(connected);
          if (!connected) {
            setError('Failed to connect to Supabase. Check your credentials and network connection.');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to connect to Supabase');
          setIsConnected(false);
        }
      } else {
        setIsConnected(false);
        setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
      }
      
      setIsLoading(false);
    };

    checkConnection();
  }, []);

  return {
    isConfigured,
    isConnected,
    isLoading,
    error,
    supabase
  };
};

