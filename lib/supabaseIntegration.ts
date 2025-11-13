/**
 * Supabase Integration Helper
 * 
 * This file provides a wrapper to easily switch between localStorage and Supabase
 * or use both during migration.
 */

import { 
  companyService, 
  userService, 
  documentService, 
  auditLogService, 
  assessmentService, 
  trainingService, 
  taskService 
} from './supabaseService';
import { supabase } from './supabase';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'your_supabase_project_url_here' && key !== 'your_supabase_anon_key_here');
};

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured');
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

// Export all services for easy import
export {
  companyService,
  userService,
  documentService,
  auditLogService,
  assessmentService,
  trainingService,
  taskService,
  supabase
};

