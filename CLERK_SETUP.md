# Clerk Authentication Setup Guide

This guide will help you integrate Clerk authentication into your Compliance Navigator application.

## ⚠️ Important Note

**This is a React + Vite application, NOT Next.js.** The integration uses `@clerk/clerk-react` (not `@clerk/nextjs`).

## Prerequisites

1. A Clerk account (sign up at https://clerk.com)
2. Node.js and npm installed
3. The application dependencies installed (`npm install`)

## Step 1: Create a Clerk Application

1. Go to https://clerk.com and sign in (or create an account)
2. Click "Create Application"
3. Choose your authentication methods:
   - **Email** (recommended)
   - **Social providers** (Google, GitHub, etc.) - optional
4. Click "Create Application"
5. Wait for the application to be created

## Step 2: Get Your Clerk Keys

1. In your Clerk dashboard, go to **API Keys**
2. You'll see:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Copy both keys (you'll need them in the next step)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Clerk keys:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

   **Important**: 
   - The publishable key must start with `VITE_` for Vite to expose it to the browser
   - Never commit your `.env` file to version control (it's in `.gitignore`)

## Step 4: Start the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. You should see Clerk's sign-in interface instead of the custom login page

## Step 5: Test Authentication

1. Click "Sign up" to create a new account
2. Enter your email and create a password
3. Verify your email (if email verification is enabled)
4. You should be redirected to the main application

## How It Works

### Automatic Detection

The app automatically detects if Clerk is configured:
- **If Clerk is configured**: Uses Clerk authentication
- **If Clerk is NOT configured**: Falls back to custom authentication (localStorage)

### Integration Points

1. **`index.tsx`**: Wraps the app with `<ClerkProvider>`
2. **`App.tsx`**: Checks for Clerk configuration and uses `ClerkAuthWrapper` if available
3. **`ClerkAuthWrapper.tsx`**: Handles Clerk authentication flow and user management
4. **`lib/clerkIntegration.ts`**: Utilities for mapping Clerk users to internal user types

### User Management

When using Clerk:
- Users authenticate through Clerk
- User roles are stored in your database (Supabase or localStorage)
- The app maps Clerk users to your internal user system
- Company assignment happens through the company selector

## Integrating with Your Database

To store user roles and company assignments:

### Option 1: Use Supabase (Recommended)

1. Create a table to link Clerk users to companies:
   ```sql
   CREATE TABLE clerk_user_companies (
     id TEXT PRIMARY KEY,
     clerk_user_id TEXT NOT NULL UNIQUE,
     company_id TEXT NOT NULL REFERENCES companies(id),
     role TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. Update `ClerkAuthWrapper` to fetch user data from Supabase

### Option 2: Use localStorage (Development Only)

User data is stored in localStorage with keys like:
- `clerk_user_{userId}_company` - Stores company ID
- `clerk_user_{userId}_company_{companyId}` - Stores user role

## Customization

### Customize Sign-In/Sign-Up UI

Edit `components/ClerkAuthWrapper.tsx` to customize the appearance:

```typescript
<SignIn 
  routing="hash"
  appearance={{
    elements: {
      rootBox: "mx-auto",
      card: "shadow-lg rounded-lg",
      headerTitle: "text-2xl font-bold",
      // ... more customization options
    }
  }}
/>
```

See [Clerk's Appearance API](https://clerk.com/docs/customization/overview) for more options.

### Add Social Providers

1. In Clerk Dashboard → User & Authentication → Social Connections
2. Enable providers (Google, GitHub, etc.)
3. Configure OAuth credentials
4. Users will see these options on the sign-in page

## Troubleshooting

### Clerk Not Working

1. **Check environment variables**:
   ```bash
   echo $VITE_CLERK_PUBLISHABLE_KEY
   ```
   Should show your publishable key (not empty)

2. **Check browser console** for errors

3. **Verify the key format**:
   - Publishable key should start with `pk_test_` or `pk_live_`
   - Make sure there are no extra spaces or quotes

### Still Seeing Custom Login

- Clerk is not configured or the key is invalid
- Check that `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Restart the dev server after changing `.env`

### User Not Assigned to Company

- The app will show a company selector if multiple companies exist
- For single company, it's auto-assigned
- Check localStorage or database for company assignments

## Production Deployment

### Environment Variables

For production:
1. Use **live keys** from Clerk (not test keys)
2. Set environment variables in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other platforms: Check their documentation

### Security

- ✅ Publishable key is safe to expose in the browser
- ❌ Secret key should NEVER be exposed (only use server-side)
- ✅ Enable email verification in production
- ✅ Set up proper CORS in Clerk dashboard
- ✅ Configure allowed redirect URLs

## Next Steps

1. **Set up user roles**: Create a system to assign roles to Clerk users
2. **Company management**: Link Clerk users to companies in your database
3. **Permissions**: Update RBAC to work with Clerk user IDs
4. **Migration**: Migrate existing users to Clerk (if needed)

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk Discord: https://clerk.com/discord
- React Quickstart: https://clerk.com/docs/quickstarts/react

---

**Status**: Clerk integration is complete! Configure your keys and start using it. 🎉

