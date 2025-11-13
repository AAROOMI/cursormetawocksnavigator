# Quick Start: Supabase Integration

## 🚀 Quick Setup (5 minutes)

### 1. Create Supabase Project
- Go to https://supabase.com
- Create a new project
- Wait for it to initialize

### 2. Get Your Credentials
- In Supabase Dashboard → Settings → API
- Copy **Project URL** and **anon/public key**

### 3. Configure Environment
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials:
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Database Tables
1. In Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run"

### 5. Start the App
```bash
npm run dev
```

The app will automatically use Supabase if configured, otherwise it falls back to localStorage.

## 📋 What's Included

✅ Complete database schema with all tables  
✅ Service layer for all data operations  
✅ TypeScript types for type safety  
✅ Row Level Security (RLS) policies  
✅ Automatic timestamps and triggers  
✅ Migration-ready structure  

## 🔄 Migration from localStorage

The app can work with both localStorage and Supabase. To migrate:

1. Set up Supabase (steps above)
2. The app will automatically start using Supabase
3. Existing localStorage data will remain until you clear it
4. New data will be saved to Supabase

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for detailed setup instructions and troubleshooting.

