# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for the Compliance Navigator application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. The application dependencies installed (`npm install`)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Compliance Navigator (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to be set up (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. (Optional) Add your Gemini API key if you want to use AI features:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste it into the SQL Editor
5. Click "Run" to execute the schema
6. You should see "Success. No rows returned" if everything worked

This will create all the necessary tables:
- `companies` - Company profiles and license information
- `users` - User accounts and authentication
- `documents` - Policy documents and approvals
- `audit_logs` - Audit trail of all actions
- `assessments` - Compliance assessments (ECC, PDPL, SAMA, CMA, HRSD, Risk)
- `assessment_history` - Historical assessment data
- `training_progress` - User training progress
- `tasks` - Task management

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see all the tables listed
3. The tables should be empty initially

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser (http://localhost:3000)
3. Try creating a new company account
4. Check the Supabase dashboard → Table Editor → `companies` table to see if data was created

## Step 7: Migrate Existing Data (Optional)

If you have existing data in localStorage that you want to migrate:

1. The app will automatically use Supabase once configured
2. You can manually export data from localStorage and import it using the Supabase dashboard or API
3. Or use the migration script (if provided)

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: The current implementation stores passwords in plain text (NOT SECURE). For production:
   - Implement proper password hashing (bcrypt) on the backend
   - Use Supabase Auth for proper authentication
   - Never store plain text passwords

2. **Row Level Security (RLS)**: The schema includes RLS policies, but they're currently set to allow all operations. For production:
   - Update RLS policies to restrict access based on user roles
   - Implement proper authentication checks
   - Use Supabase Auth JWT tokens for secure access

3. **API Keys**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## Troubleshooting

### Connection Issues

- Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that your Supabase project is active
- Ensure your network allows connections to Supabase

### Database Errors

- Check the Supabase dashboard → Logs for error messages
- Verify the schema was created correctly in Table Editor
- Make sure all foreign key relationships are correct

### Authentication Issues

- The current implementation uses custom authentication
- For production, consider migrating to Supabase Auth
- Check that user passwords match between frontend and database

## Next Steps

1. **Set up Supabase Auth** (recommended for production):
   - Enable email authentication in Supabase dashboard
   - Update the app to use Supabase Auth instead of custom auth
   - Implement proper session management

2. **Configure RLS Policies**:
   - Update Row Level Security policies based on user roles
   - Test that users can only access their company's data

3. **Set up Real-time Subscriptions** (optional):
   - Enable real-time for tables that need live updates
   - Update the app to subscribe to changes

4. **Backup and Monitoring**:
   - Set up database backups in Supabase dashboard
   - Configure monitoring and alerts
   - Set up database connection pooling if needed

## Support

For issues or questions:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Project Issues: Check the project repository

