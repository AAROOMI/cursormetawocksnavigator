import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database types (will be generated from Supabase schema)
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          logo: string | null;
          ceo_name: string;
          cio_name: string;
          ciso_name: string;
          cto_name: string;
          cybersecurity_officer_name: string | null;
          dpo_name: string | null;
          compliance_officer_name: string | null;
          license_key: string | null;
          license_status: 'active' | 'expired' | 'inactive';
          license_tier: 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial';
          license_expires_at: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['companies']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          company_id: string;
          email: string;
          name: string;
          role: string;
          is_verified: boolean;
          access_expires_at: number | null;
          password_hash: string | null;
          mfa_enabled: boolean;
          mfa_secret: string | null;
          password_reset_token: string | null;
          password_reset_expires: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          company_id: string;
          control_id: string;
          domain_name: string;
          subdomain_title: string;
          control_description: string;
          status: string;
          content: any; // JSON
          approval_history: any; // JSON
          generated_by: 'user' | 'AI Agent' | null;
          qr_code_data_url: string | null;
          barcode_data_url: string | null;
          type: 'policy' | 'risk_report' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          user_name: string;
          action: string;
          details: string;
          target_id: string | null;
          timestamp: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      assessments: {
        Row: {
          id: string;
          company_id: string;
          assessment_type: 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd' | 'risk';
          assessment_data: any; // JSON
          status: 'idle' | 'in-progress';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assessments']['Insert']>;
      };
      assessment_history: {
        Row: {
          id: string;
          company_id: string;
          assessment_type: string;
          assessment_data: any; // JSON
          timestamp: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessment_history']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['assessment_history']['Insert']>;
      };
      training_progress: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          course_id: string;
          completed_lessons: string[];
          score: number | null;
          badge_earned: boolean;
          badge_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['training_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['training_progress']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          control_id: string | null;
          status: 'To Do' | 'In Progress' | 'Done';
          due_date: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
    };
  };
};

