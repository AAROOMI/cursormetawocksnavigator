# Supabase Integration Example

This document shows how to integrate Supabase into your existing App.tsx.

## Basic Usage

### 1. Import Supabase Services

```typescript
import { 
  companyService, 
  userService, 
  documentService,
  isSupabaseConfigured 
} from './lib/supabaseIntegration';
```

### 2. Check if Supabase is Configured

```typescript
const useSupabase = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);
  
  return isConfigured;
};

// In your component
const supabaseEnabled = useSupabase();
```

### 3. Load Companies from Supabase

```typescript
// Replace localStorage loading with:
useEffect(() => {
  if (supabaseEnabled) {
    companyService.getAll()
      .then(setCompanies)
      .catch(console.error);
  } else {
    // Fallback to localStorage
    const saved = localStorage.getItem('companies');
    if (saved) setCompanies(JSON.parse(saved));
  }
}, [supabaseEnabled]);
```

### 4. Save Companies to Supabase

```typescript
const handleSaveCompany = async (company: CompanyProfile) => {
  if (supabaseEnabled && currentCompanyId) {
    try {
      await companyService.update(currentCompanyId, company);
      addNotification('Company saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save company:', error);
      addNotification('Failed to save company', 'error');
    }
  } else {
    // Fallback to localStorage
    const companies = [...prevCompanies];
    const index = companies.findIndex(c => c.id === company.id);
    if (index >= 0) {
      companies[index] = company;
      setCompanies(companies);
      localStorage.setItem('companies', JSON.stringify(companies));
    }
  }
};
```

### 5. Load Users for a Company

```typescript
useEffect(() => {
  if (supabaseEnabled && currentCompanyId) {
    userService.getByCompany(currentCompanyId)
      .then(setUsers)
      .catch(console.error);
  } else {
    // Fallback to localStorage
    const users = allCompanyData[currentCompanyId]?.users || [];
    setUsers(users);
  }
}, [currentCompanyId, supabaseEnabled]);
```

### 6. Create a New User

```typescript
const handleCreateUser = async (userData: Omit<User, 'id'>) => {
  if (supabaseEnabled && currentCompanyId) {
    try {
      const newUser = await userService.create(userData, currentCompanyId);
      setUsers(prev => [...prev, newUser]);
      addNotification('User created successfully', 'success');
    } catch (error) {
      console.error('Failed to create user:', error);
      addNotification('Failed to create user', 'error');
    }
  } else {
    // Fallback to localStorage
    const newUser = { ...userData, id: `user-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    // Save to localStorage...
  }
};
```

### 7. Load Documents

```typescript
useEffect(() => {
  if (supabaseEnabled && currentCompanyId) {
    documentService.getByCompany(currentCompanyId)
      .then(setDocuments)
      .catch(console.error);
  } else {
    // Fallback to localStorage
    const docs = allCompanyData[currentCompanyId]?.documents || [];
    setDocuments(docs);
  }
}, [currentCompanyId, supabaseEnabled]);
```

### 8. Add Audit Log Entry

```typescript
const addAuditLog = async (action: AuditAction, details: string, targetId?: string) => {
  if (!currentCompanyId || !currentUser) return;
  
  const logEntry: AuditLogEntry = {
    id: `log-${Date.now()}`,
    timestamp: Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    action,
    details,
    targetId
  };
  
  if (supabaseEnabled) {
    try {
      await auditLogService.create(logEntry, currentCompanyId);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  } else {
    // Fallback to localStorage
    setAllCompanyData(prev => {
      const currentData = prev[currentCompanyId] || { auditLog: [] };
      return {
        ...prev,
        [currentCompanyId]: {
          ...currentData,
          auditLog: [logEntry, ...(currentData.auditLog || [])]
        }
      };
    });
  }
};
```

## Complete Migration Pattern

Here's a pattern you can use to gradually migrate:

```typescript
// Create a data service wrapper
const useDataService = () => {
  const supabaseEnabled = useSupabase();
  
  return {
    // Companies
    loadCompanies: async () => {
      if (supabaseEnabled) {
        return await companyService.getAll();
      } else {
        const saved = localStorage.getItem('companies');
        return saved ? JSON.parse(saved) : [];
      }
    },
    
    saveCompanies: async (companies: CompanyProfile[]) => {
      if (supabaseEnabled) {
        // Save each company
        for (const company of companies) {
          try {
            const existing = await companyService.getById(company.id);
            if (existing) {
              await companyService.update(company.id, company);
            } else {
              await companyService.create(company);
            }
          } catch (error) {
            console.error(`Failed to save company ${company.id}:`, error);
          }
        }
      } else {
        localStorage.setItem('companies', JSON.stringify(companies));
      }
    },
    
    // Add more methods for other data types...
  };
};
```

## Real-time Subscriptions (Optional)

You can also set up real-time subscriptions for live updates:

```typescript
useEffect(() => {
  if (!supabaseEnabled || !currentCompanyId) return;
  
  const subscription = supabase
    .channel('documents')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'documents',
        filter: `company_id=eq.${currentCompanyId}`
      },
      (payload) => {
        console.log('Document changed:', payload);
        // Update your local state
        if (payload.eventType === 'INSERT') {
          setDocuments(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setDocuments(prev => prev.map(d => d.id === payload.new.id ? payload.new : d));
        } else if (payload.eventType === 'DELETE') {
          setDocuments(prev => prev.filter(d => d.id !== payload.old.id));
        }
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, [supabaseEnabled, currentCompanyId]);
```

## Error Handling

Always wrap Supabase calls in try-catch:

```typescript
try {
  const data = await companyService.getAll();
  setCompanies(data);
} catch (error: any) {
  console.error('Failed to load companies:', error);
  addNotification(
    error.message || 'Failed to load companies. Using local data.',
    'info'
  );
  // Fallback to localStorage
  const saved = localStorage.getItem('companies');
  if (saved) setCompanies(JSON.parse(saved));
}
```

## Testing

Test your integration:

1. Start with Supabase disabled (no .env file)
2. Verify localStorage still works
3. Add Supabase credentials
4. Verify data loads from Supabase
5. Create/update data and verify it saves
6. Check Supabase dashboard to confirm data is there

