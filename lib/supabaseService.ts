import { supabase } from './supabase';
import type { 
  User, 
  CompanyProfile, 
  PolicyDocument, 
  AuditLogEntry, 
  AssessmentItem, 
  Risk, 
  Task, 
  UserTrainingProgress,
  License
} from '../types';

// Helper to hash passwords (in production, use bcrypt on server-side)
// For now, we'll store plain text passwords (NOT RECOMMENDED FOR PRODUCTION)
// In production, implement proper password hashing on the backend

// ==================== COMPANY OPERATIONS ====================

export const companyService = {
  async getAll(): Promise<CompanyProfile[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(company => ({
      id: company.id,
      name: company.name,
      logo: company.logo || '',
      ceoName: company.ceo_name,
      cioName: company.cio_name,
      cisoName: company.ciso_name,
      ctoName: company.cto_name,
      cybersecurityOfficerName: company.cybersecurity_officer_name || undefined,
      dpoName: company.dpo_name || undefined,
      complianceOfficerName: company.compliance_officer_name || undefined,
      license: company.license_key ? {
        key: company.license_key,
        status: company.license_status as 'active' | 'expired' | 'inactive',
        tier: company.license_tier as 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial',
        expiresAt: company.license_expires_at || 0
      } : undefined
    }));
  },

  async getById(id: string): Promise<CompanyProfile | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      ceoName: data.ceo_name,
      cioName: data.cio_name,
      cisoName: data.ciso_name,
      ctoName: data.cto_name,
      cybersecurityOfficerName: data.cybersecurity_officer_name || undefined,
      dpoName: data.dpo_name || undefined,
      complianceOfficerName: data.compliance_officer_name || undefined,
      license: data.license_key ? {
        key: data.license_key,
        status: data.license_status as 'active' | 'expired' | 'inactive',
        tier: data.license_tier as 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial',
        expiresAt: data.license_expires_at || 0
      } : undefined
    };
  },

  async create(company: Omit<CompanyProfile, 'id'>): Promise<CompanyProfile> {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        logo: company.logo || null,
        ceo_name: company.ceoName,
        cio_name: company.cioName,
        ciso_name: company.cisoName,
        cto_name: company.ctoName,
        cybersecurity_officer_name: company.cybersecurityOfficerName || null,
        dpo_name: company.dpoName || null,
        compliance_officer_name: company.complianceOfficerName || null,
        license_key: company.license?.key || null,
        license_status: company.license?.status || null,
        license_tier: company.license?.tier || null,
        license_expires_at: company.license?.expiresAt || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      ceoName: data.ceo_name,
      cioName: data.cio_name,
      cisoName: data.ciso_name,
      ctoName: data.cto_name,
      cybersecurityOfficerName: data.cybersecurity_officer_name || undefined,
      dpoName: data.dpo_name || undefined,
      complianceOfficerName: data.compliance_officer_name || undefined,
      license: data.license_key ? {
        key: data.license_key,
        status: data.license_status as 'active' | 'expired' | 'inactive',
        tier: data.license_tier as 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial',
        expiresAt: data.license_expires_at || 0
      } : undefined
    };
  },

  async update(id: string, updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const { data, error } = await supabase
      .from('companies')
      .update({
        name: updates.name,
        logo: updates.logo || null,
        ceo_name: updates.ceoName,
        cio_name: updates.cioName,
        ciso_name: updates.cisoName,
        cto_name: updates.ctoName,
        cybersecurity_officer_name: updates.cybersecurityOfficerName || null,
        dpo_name: updates.dpoName || null,
        compliance_officer_name: updates.complianceOfficerName || null,
        license_key: updates.license?.key || null,
        license_status: updates.license?.status || null,
        license_tier: updates.license?.tier || null,
        license_expires_at: updates.license?.expiresAt || null
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      logo: data.logo || '',
      ceoName: data.ceo_name,
      cioName: data.cio_name,
      cisoName: data.ciso_name,
      ctoName: data.cto_name,
      cybersecurityOfficerName: data.cybersecurity_officer_name || undefined,
      dpoName: data.dpo_name || undefined,
      complianceOfficerName: data.compliance_officer_name || undefined,
      license: data.license_key ? {
        key: data.license_key,
        status: data.license_status as 'active' | 'expired' | 'inactive',
        tier: data.license_tier as 'monthly' | 'quarterly' | 'semi-annually' | 'yearly' | 'trial',
        expiresAt: data.license_expires_at || 0
      } : undefined
    };
  }
};

// ==================== USER OPERATIONS ====================

export const userService = {
  async getByCompany(companyId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as User['role'],
      isVerified: user.is_verified,
      accessExpiresAt: user.access_expires_at || undefined,
      password: user.password_hash || undefined, // In production, never expose this
      mfaEnabled: user.mfa_enabled,
      mfaSecret: user.mfa_secret || undefined,
      passwordResetToken: user.password_reset_token || undefined,
      passwordResetExpires: user.password_reset_expires || undefined
    }));
  },

  async getByEmail(email: string, companyId?: string): Promise<User | null> {
    let query = supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as User['role'],
      isVerified: data.is_verified,
      accessExpiresAt: data.access_expires_at || undefined,
      password: data.password_hash || undefined,
      mfaEnabled: data.mfa_enabled,
      mfaSecret: data.mfa_secret || undefined,
      passwordResetToken: data.password_reset_token || undefined,
      passwordResetExpires: data.password_reset_expires || undefined
    };
  },

  async create(user: Omit<User, 'id'>, companyId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        company_id: companyId,
        email: user.email.toLowerCase(),
        name: user.name,
        role: user.role,
        is_verified: user.isVerified,
        access_expires_at: user.accessExpiresAt || null,
        password_hash: user.password || null, // In production, hash this
        mfa_enabled: user.mfaEnabled || false,
        mfa_secret: user.mfaSecret || null,
        password_reset_token: user.passwordResetToken || null,
        password_reset_expires: user.passwordResetExpires || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as User['role'],
      isVerified: data.is_verified,
      accessExpiresAt: data.access_expires_at || undefined,
      password: data.password_hash || undefined,
      mfaEnabled: data.mfa_enabled,
      mfaSecret: data.mfa_secret || undefined
    };
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email?.toLowerCase(),
        role: updates.role,
        is_verified: updates.isVerified,
        access_expires_at: updates.accessExpiresAt || null,
        password_hash: updates.password || null, // In production, hash this
        mfa_enabled: updates.mfaEnabled,
        mfa_secret: updates.mfaSecret || null,
        password_reset_token: updates.passwordResetToken || null,
        password_reset_expires: updates.passwordResetExpires || null
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as User['role'],
      isVerified: data.is_verified,
      accessExpiresAt: data.access_expires_at || undefined,
      password: data.password_hash || undefined,
      mfaEnabled: data.mfa_enabled,
      mfaSecret: data.mfa_secret || undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ==================== DOCUMENT OPERATIONS ====================

export const documentService = {
  async getByCompany(companyId: string): Promise<PolicyDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(doc => ({
      id: doc.id,
      controlId: doc.control_id,
      domainName: doc.domain_name,
      subdomainTitle: doc.subdomain_title,
      controlDescription: doc.control_description,
      status: doc.status as PolicyDocument['status'],
      content: doc.content,
      approvalHistory: doc.approval_history || [],
      createdAt: new Date(doc.created_at).getTime(),
      updatedAt: new Date(doc.updated_at).getTime(),
      generatedBy: doc.generated_by as 'user' | 'AI Agent' | undefined,
      qrCodeDataUrl: doc.qr_code_data_url || undefined,
      barcodeDataUrl: doc.barcode_data_url || undefined,
      type: doc.type as 'policy' | 'risk_report' | undefined
    }));
  },

  async create(document: Omit<PolicyDocument, 'id' | 'createdAt' | 'updatedAt'>, companyId: string): Promise<PolicyDocument> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        company_id: companyId,
        control_id: document.controlId,
        domain_name: document.domainName,
        subdomain_title: document.subdomainTitle,
        control_description: document.controlDescription,
        status: document.status,
        content: document.content,
        approval_history: document.approvalHistory || [],
        generated_by: document.generatedBy || null,
        qr_code_data_url: document.qrCodeDataUrl || null,
        barcode_data_url: document.barcodeDataUrl || null,
        type: document.type || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      controlId: data.control_id,
      domainName: data.domain_name,
      subdomainTitle: data.subdomain_title,
      controlDescription: data.control_description,
      status: data.status as PolicyDocument['status'],
      content: data.content,
      approvalHistory: data.approval_history || [],
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
      generatedBy: data.generated_by as 'user' | 'AI Agent' | undefined,
      qrCodeDataUrl: data.qr_code_data_url || undefined,
      barcodeDataUrl: data.barcode_data_url || undefined,
      type: data.type as 'policy' | 'risk_report' | undefined
    };
  },

  async update(id: string, updates: Partial<PolicyDocument>): Promise<PolicyDocument> {
    const { data, error } = await supabase
      .from('documents')
      .update({
        status: updates.status,
        content: updates.content,
        approval_history: updates.approvalHistory,
        qr_code_data_url: updates.qrCodeDataUrl || null,
        barcode_data_url: updates.barcodeDataUrl || null
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      controlId: data.control_id,
      domainName: data.domain_name,
      subdomainTitle: data.subdomain_title,
      controlDescription: data.control_description,
      status: data.status as PolicyDocument['status'],
      content: data.content,
      approvalHistory: data.approval_history || [],
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
      generatedBy: data.generated_by as 'user' | 'AI Agent' | undefined,
      qrCodeDataUrl: data.qr_code_data_url || undefined,
      barcodeDataUrl: data.barcode_data_url || undefined,
      type: data.type as 'policy' | 'risk_report' | undefined
    };
  }
};

// ==================== AUDIT LOG OPERATIONS ====================

export const auditLogService = {
  async getByCompany(companyId: string, limit = 100): Promise<AuditLogEntry[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      userId: log.user_id,
      userName: log.user_name,
      action: log.action as AuditLogEntry['action'],
      details: log.details,
      targetId: log.target_id || undefined
    }));
  },

  async create(log: Omit<AuditLogEntry, 'id'>, companyId: string): Promise<AuditLogEntry> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        company_id: companyId,
        user_id: log.userId,
        user_name: log.userName,
        action: log.action,
        details: log.details,
        target_id: log.targetId || null,
        timestamp: log.timestamp
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      timestamp: data.timestamp,
      userId: data.user_id,
      userName: data.user_name,
      action: data.action as AuditLogEntry['action'],
      details: data.details,
      targetId: data.target_id || undefined
    };
  }
};

// ==================== ASSESSMENT OPERATIONS ====================

export const assessmentService = {
  async getByCompany(companyId: string, type: 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd' | 'risk'): Promise<AssessmentItem[] | Risk[] | null> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('company_id', companyId)
      .eq('assessment_type', type)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data?.assessment_data || null;
  },

  async getStatus(companyId: string, type: 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd' | 'risk'): Promise<'idle' | 'in-progress'> {
    const { data, error } = await supabase
      .from('assessments')
      .select('status')
      .eq('company_id', companyId)
      .eq('assessment_type', type)
      .single();
    
    if (error || !data) return 'idle';
    
    return data.status as 'idle' | 'in-progress';
  },

  async upsert(companyId: string, type: 'ecc' | 'pdpl' | 'sama' | 'cma' | 'hrsd' | 'risk', data: AssessmentItem[] | Risk[], status: 'idle' | 'in-progress'): Promise<void> {
    const { error } = await supabase
      .from('assessments')
      .upsert({
        company_id: companyId,
        assessment_type: type,
        assessment_data: data,
        status: status
      }, {
        onConflict: 'company_id,assessment_type'
      });
    
    if (error) throw error;
  },

  async saveHistory(companyId: string, type: string, data: AssessmentItem[] | Risk[]): Promise<void> {
    const { error } = await supabase
      .from('assessment_history')
      .insert({
        company_id: companyId,
        assessment_type: type,
        assessment_data: data,
        timestamp: Date.now()
      });
    
    if (error) throw error;
  },

  async getHistory(companyId: string, type: string): Promise<Array<{ timestamp: number; data: AssessmentItem[] | Risk[] }>> {
    const { data, error } = await supabase
      .from('assessment_history')
      .select('*')
      .eq('company_id', companyId)
      .eq('assessment_type', type)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(h => ({
      timestamp: h.timestamp,
      data: h.assessment_data
    }));
  }
};

// ==================== TRAINING PROGRESS OPERATIONS ====================

export const trainingService = {
  async getByCompany(companyId: string): Promise<UserTrainingProgress> {
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    
    const progress: UserTrainingProgress = {};
    
    (data || []).forEach(item => {
      if (!progress[item.course_id]) {
        progress[item.course_id] = {
          completedLessons: item.completed_lessons || [],
          score: item.score || undefined,
          badgeEarned: item.badge_earned,
          badgeId: item.badge_id
        };
      }
    });
    
    return progress;
  },

  async upsert(companyId: string, userId: string, courseId: string, progress: { completedLessons: string[]; score?: number; badgeEarned: boolean; badgeId: string }): Promise<void> {
    const { error } = await supabase
      .from('training_progress')
      .upsert({
        company_id: companyId,
        user_id: userId,
        course_id: courseId,
        completed_lessons: progress.completedLessons,
        score: progress.score || null,
        badge_earned: progress.badgeEarned,
        badge_id: progress.badgeId
      }, {
        onConflict: 'company_id,user_id,course_id'
      });
    
    if (error) throw error;
  }
};

// ==================== TASK OPERATIONS ====================

export const taskService = {
  async getByCompany(companyId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      controlId: task.control_id || undefined,
      status: task.status as Task['status'],
      createdAt: new Date(task.created_at).getTime(),
      dueDate: task.due_date || undefined
    }));
  },

  async create(task: Omit<Task, 'id' | 'createdAt'>, companyId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        company_id: companyId,
        title: task.title,
        control_id: task.controlId || null,
        status: task.status,
        due_date: task.dueDate || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      controlId: data.control_id || undefined,
      status: data.status as Task['status'],
      createdAt: new Date(data.created_at).getTime(),
      dueDate: data.due_date || undefined
    };
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        control_id: updates.controlId || null,
        status: updates.status,
        due_date: updates.dueDate || null
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      controlId: data.control_id || undefined,
      status: data.status as Task['status'],
      createdAt: new Date(data.created_at).getTime(),
      dueDate: data.due_date || undefined
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

