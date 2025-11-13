-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY DEFAULT 'company-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    name TEXT NOT NULL,
    logo TEXT,
    ceo_name TEXT NOT NULL,
    cio_name TEXT NOT NULL,
    ciso_name TEXT NOT NULL,
    cto_name TEXT NOT NULL,
    cybersecurity_officer_name TEXT,
    dpo_name TEXT,
    compliance_officer_name TEXT,
    license_key TEXT,
    license_status TEXT CHECK (license_status IN ('active', 'expired', 'inactive')),
    license_tier TEXT CHECK (license_tier IN ('monthly', 'quarterly', 'semi-annually', 'yearly', 'trial')),
    license_expires_at BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT 'user-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Administrator', 'CISO', 'CTO', 'CIO', 'CEO', 'Security Analyst', 'Employee')),
    is_verified BOOLEAN DEFAULT false,
    access_expires_at BIGINT,
    password_hash TEXT, -- bcrypt hash
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret TEXT,
    password_reset_token TEXT,
    password_reset_expires BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, email)
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY DEFAULT 'policy-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    control_id TEXT NOT NULL,
    domain_name TEXT NOT NULL,
    subdomain_title TEXT NOT NULL,
    control_description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Pending CISO Approval', 'Pending CTO Approval', 'Pending CIO Approval', 'Pending CEO Approval', 'Approved', 'Rejected')),
    content JSONB NOT NULL,
    approval_history JSONB DEFAULT '[]'::jsonb,
    generated_by TEXT CHECK (generated_by IN ('user', 'AI Agent')),
    qr_code_data_url TEXT,
    barcode_data_url TEXT,
    type TEXT CHECK (type IN ('policy', 'risk_report')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT 'log-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    target_id TEXT,
    timestamp BIGINT NOT NULL DEFAULT extract(epoch from now())::bigint * 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY DEFAULT 'assessment-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('ecc', 'pdpl', 'sama', 'cma', 'hrsd', 'risk')),
    assessment_data JSONB NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('idle', 'in-progress')) DEFAULT 'idle',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, assessment_type)
);

-- Assessment history table
CREATE TABLE IF NOT EXISTS assessment_history (
    id TEXT PRIMARY KEY DEFAULT 'history-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    assessment_data JSONB NOT NULL,
    timestamp BIGINT NOT NULL DEFAULT extract(epoch from now())::bigint * 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training progress table
CREATE TABLE IF NOT EXISTS training_progress (
    id TEXT PRIMARY KEY DEFAULT 'training-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    completed_lessons TEXT[] DEFAULT '{}',
    score INTEGER,
    badge_earned BOOLEAN DEFAULT false,
    badge_id TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id, course_id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY DEFAULT 'task-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    control_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')) DEFAULT 'To Do',
    due_date BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_company_id ON assessments(company_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_training_progress_company_user ON training_progress(company_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id ON tasks(company_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_progress_updated_at BEFORE UPDATE ON training_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all operations for now (you can restrict later based on user roles)
-- Companies: Users can only access their own company
CREATE POLICY "Users can view their own company" ON companies
    FOR SELECT USING (true); -- For now, allow all. Update based on auth later

CREATE POLICY "Users can update their own company" ON companies
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert companies" ON companies
    FOR INSERT WITH CHECK (true);

-- Users: Users can view users in their company
CREATE POLICY "Users can view users in their company" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update users in their company" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert users in their company" ON users
    FOR INSERT WITH CHECK (true);

-- Documents: Users can access documents in their company
CREATE POLICY "Users can view documents in their company" ON documents
    FOR SELECT USING (true);

CREATE POLICY "Users can update documents in their company" ON documents
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert documents in their company" ON documents
    FOR INSERT WITH CHECK (true);

-- Audit logs: Users can view audit logs in their company
CREATE POLICY "Users can view audit logs in their company" ON audit_logs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert audit logs in their company" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Assessments: Users can access assessments in their company
CREATE POLICY "Users can view assessments in their company" ON assessments
    FOR SELECT USING (true);

CREATE POLICY "Users can update assessments in their company" ON assessments
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert assessments in their company" ON assessments
    FOR INSERT WITH CHECK (true);

-- Assessment history: Users can access assessment history in their company
CREATE POLICY "Users can view assessment history in their company" ON assessment_history
    FOR SELECT USING (true);

CREATE POLICY "Users can insert assessment history in their company" ON assessment_history
    FOR INSERT WITH CHECK (true);

-- Training progress: Users can access their training progress
CREATE POLICY "Users can view training progress in their company" ON training_progress
    FOR SELECT USING (true);

CREATE POLICY "Users can update training progress in their company" ON training_progress
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert training progress in their company" ON training_progress
    FOR INSERT WITH CHECK (true);

-- Tasks: Users can access tasks in their company
CREATE POLICY "Users can view tasks in their company" ON tasks
    FOR SELECT USING (true);

CREATE POLICY "Users can update tasks in their company" ON tasks
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert tasks in their company" ON tasks
    FOR INSERT WITH CHECK (true);

