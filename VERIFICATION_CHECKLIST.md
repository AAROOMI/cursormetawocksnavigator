# Complete Setup Verification Checklist

Use this checklist to verify that your app is fully configured and functional.

## ✅ Environment Variables Check

### Required in `.env` file:

- [ ] **Clerk Authentication**
  - `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` or `pk_live_...`
  - ✅ Should start with `pk_`
  - ✅ Get from: https://clerk.com → Your App → API Keys

- [ ] **Supabase Backend** (Optional but recommended)
  - `VITE_SUPABASE_URL=https://xxxxx.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=eyJhbGci...`
  - ✅ Get from: https://supabase.com → Your Project → Settings → API

- [ ] **Google Gemini AI** (Optional - for AI features)
  - `GEMINI_API_KEY=AIza...`
  - ✅ Get from: https://aistudio.google.com/apikey

## ✅ Package Dependencies

Verify all packages are installed:
```bash
npm install
```

Should have:
- [x] `@clerk/clerk-react` - Clerk authentication
- [x] `@supabase/supabase-js` - Supabase backend
- [x] `@google/genai` - Google Gemini AI
- [x] `react` & `react-dom` - React framework
- [x] `vite` - Build tool

## ✅ Configuration Files

- [x] `vite.config.ts` - Updated with all env vars
- [x] `index.tsx` - ClerkProvider wrapper added
- [x] `App.tsx` - Clerk integration added
- [x] `lib/supabase.ts` - Supabase client configured
- [x] `lib/clerkIntegration.ts` - Clerk utilities created
- [x] `components/ClerkAuthWrapper.tsx` - Auth wrapper created

## ✅ Database Setup (If using Supabase)

- [ ] **Supabase Project Created**
  - Go to https://supabase.com
  - Create new project
  - Wait for setup to complete

- [ ] **Database Schema Executed**
  - Open Supabase Dashboard → SQL Editor
  - Copy contents of `supabase/schema.sql`
  - Run the SQL script
  - Verify tables are created:
    - [ ] companies
    - [ ] users
    - [ ] documents
    - [ ] audit_logs
    - [ ] assessments
    - [ ] assessment_history
    - [ ] training_progress
    - [ ] tasks

## ✅ Application Features

### Authentication
- [ ] **Clerk Auth** (if configured)
  - Sign in page appears
  - Can create account
  - Can sign in
  - UserButton appears in header
  - Sign out works

- [ ] **Custom Auth** (if Clerk not configured)
  - Custom login page appears
  - Can login with test credentials
  - Logout works

### Core Features
- [ ] **Dashboard** - Loads and displays data
- [ ] **Control Navigator** - Can browse controls
- [ ] **Documents** - Can view/manage documents
- [ ] **Assessments** - Can create/update assessments
- [ ] **Training** - Training module works
- [ ] **Risk Assessment** - Risk features work
- [ ] **User Management** - User CRUD operations
- [ ] **Company Profile** - Company management

### AI Features (if Gemini configured)
- [ ] **Document Generation** - AI can generate policies
- [ ] **Noora Assistant** - AI assistant works
- [ ] **Risk Assistant** - Risk AI assistant works

### Backend Features (if Supabase configured)
- [ ] **Data Persistence** - Data saves to Supabase
- [ ] **Real-time Updates** - Changes sync (if enabled)
- [ ] **Multi-user Support** - Multiple users can access

## ✅ Testing Steps

### 1. Start the Application
```bash
npm run dev
```

### 2. Check Configuration Banner
- Open http://localhost:3000
- Look for configuration status banner at top
- Should show status of all services

### 3. Test Authentication
- If Clerk configured: Should see Clerk sign-in
- If Clerk not configured: Should see custom login
- Test sign in/sign up

### 4. Test Core Features
- Navigate to Dashboard
- Browse controls in Navigator
- Create a document
- Start an assessment
- Check user management

### 5. Test AI Features (if Gemini configured)
- Try generating a document
- Use Noora Assistant
- Use Risk Assistant

### 6. Test Backend (if Supabase configured)
- Create data (company, user, document)
- Check Supabase dashboard to verify data saved
- Refresh page - data should persist

## ✅ Browser Console Check

Open browser DevTools (F12) and check:
- [ ] No critical errors
- [ ] Configuration warnings (if any) are expected
- [ ] API calls succeed (if services configured)

## ✅ Common Issues & Solutions

### Issue: Clerk not working
**Solution:**
- Check `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- Restart dev server after changing `.env`
- Verify key starts with `pk_`

### Issue: Supabase connection failed
**Solution:**
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify Supabase project is active
- Check network connection

### Issue: Gemini API errors
**Solution:**
- Check `GEMINI_API_KEY` in `.env`
- Verify API key is valid
- Check API quota/limits

### Issue: Data not persisting
**Solution:**
- If using Supabase: Check database connection
- If using localStorage: Check browser storage
- Verify data is being saved (check console logs)

## ✅ Production Readiness

Before deploying:
- [ ] Use **live** Clerk keys (not test keys)
- [ ] Use **production** Supabase project
- [ ] Set environment variables in hosting platform
- [ ] Enable email verification in Clerk
- [ ] Configure CORS in Supabase
- [ ] Set up database backups
- [ ] Test all features in production environment

## 📊 Status Summary

After completing checks, your app should have:

✅ **Authentication**: Clerk or Custom Auth working  
✅ **Backend**: Supabase or localStorage working  
✅ **AI Features**: Gemini API working (if configured)  
✅ **Core Features**: All main features functional  
✅ **Data Persistence**: Data saves correctly  
✅ **User Experience**: Smooth navigation and interactions  

---

**Next Steps:**
1. Complete all checks above
2. Fix any issues found
3. Test thoroughly
4. Deploy to production

**Need Help?**
- Check `CLERK_SETUP.md` for Clerk setup
- Check `SUPABASE_SETUP.md` for Supabase setup
- Check browser console for errors
- Review configuration status banner in app

