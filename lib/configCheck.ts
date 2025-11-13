/**
 * Configuration Check Utility
 * 
 * This file provides utilities to verify that all required
 * services are properly configured.
 */

export interface ConfigStatus {
  service: string;
  configured: boolean;
  message: string;
  required: boolean;
}

/**
 * Check if Clerk is configured
 */
export const checkClerkConfig = (): ConfigStatus => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isConfigured = !!(key && key !== 'your_publishable_key_here' && key.startsWith('pk_'));
  
  return {
    service: 'Clerk Authentication',
    configured: isConfigured,
    message: isConfigured 
      ? 'Clerk is configured and ready'
      : 'Clerk is not configured. Add VITE_CLERK_PUBLISHABLE_KEY to .env',
    required: false // Optional - falls back to custom auth
  };
};

/**
 * Check if Supabase is configured
 */
export const checkSupabaseConfig = (): ConfigStatus => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = !!(
    url && 
    key && 
    url !== 'your_supabase_project_url_here' && 
    key !== 'your_supabase_anon_key_here' &&
    url.startsWith('http')
  );
  
  return {
    service: 'Supabase Backend',
    configured: isConfigured,
    message: isConfigured
      ? 'Supabase is configured and ready'
      : 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env',
    required: false // Optional - falls back to localStorage
  };
};

/**
 * Check if Gemini API is configured
 */
export const checkGeminiConfig = (): ConfigStatus => {
  const key = import.meta.env.GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  const isConfigured = !!(key && key !== 'your_gemini_api_key_here' && key.length > 20);
  
  return {
    service: 'Google Gemini AI',
    configured: isConfigured,
    message: isConfigured
      ? 'Gemini API is configured and ready'
      : 'Gemini API is not configured. Add GEMINI_API_KEY to .env (optional - AI features will be disabled)',
    required: false // Optional - AI features will be disabled
  };
};

/**
 * Get all configuration statuses
 */
export const getAllConfigStatuses = (): ConfigStatus[] => {
  return [
    checkClerkConfig(),
    checkSupabaseConfig(),
    checkGeminiConfig()
  ];
};

/**
 * Check if all required services are configured
 */
export const areRequiredServicesConfigured = (): boolean => {
  const statuses = getAllConfigStatuses();
  return statuses
    .filter(s => s.required)
    .every(s => s.configured);
};

/**
 * Get configuration summary
 */
export const getConfigSummary = (): {
  allConfigured: boolean;
  statuses: ConfigStatus[];
  missingRequired: string[];
  missingOptional: string[];
} => {
  const statuses = getAllConfigStatuses();
  const missingRequired = statuses
    .filter(s => s.required && !s.configured)
    .map(s => s.service);
  const missingOptional = statuses
    .filter(s => !s.required && !s.configured)
    .map(s => s.service);
  
  return {
    allConfigured: missingRequired.length === 0,
    statuses,
    missingRequired,
    missingOptional
  };
};

