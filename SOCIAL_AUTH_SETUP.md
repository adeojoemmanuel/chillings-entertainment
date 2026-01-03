# Social Sign-In Setup Guide

This guide explains how to set up multiple social sign-in providers (Google, GitHub, Facebook, etc.) using Supabase OAuth.

## Prerequisites

1. A Supabase project (https://supabase.com)
2. OAuth credentials for each provider you want to enable

## Step 1: Database Migration

Run the migration to add support for Supabase auth users:

```sql
-- Execute database/migration_add_supabase_auth.sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);
```

## Step 2: Configure Supabase OAuth Providers

1. **Go to Supabase Dashboard:**
   - Navigate to your project
   - Go to **Authentication** > **Providers**

2. **Enable Providers:**
   - Enable **Google**, **GitHub**, **Facebook**, or any other provider you want
   - For each provider, you'll need to:
     - Create OAuth app credentials (see provider-specific instructions below)
     - Enter Client ID and Client Secret in Supabase

3. **Configure Redirect URLs:**
   - Go to **Authentication** > **URL Configuration**
   - Add redirect URL: `http://localhost:3000/auth/callback` (development)
   - Add redirect URL: `https://yourdomain.com/auth/callback` (production)

## Step 3: Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`

## Step 4: Configure Environment Variables

### Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:3003
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Backend `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

## Step 5: Provider-Specific Setup

### Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### GitHub OAuth:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click **New OAuth App**
3. Configure:
   - Application name: Chillings Entertainment
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### Facebook OAuth:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Facebook Login** product
4. Configure:
   - Valid OAuth Redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
5. Copy App ID and App Secret to Supabase

## Step 6: Install Dependencies

```bash
# Frontend
cd frontend
npm install @supabase/supabase-js

# Backend (already installed)
cd backend
npm install
```

## Step 7: Test Social Sign-In

1. Start both frontend and backend servers
2. Navigate to `/login` or `/register`
3. Click on a social sign-in button (Google, GitHub, etc.)
4. Complete OAuth flow
5. You should be redirected back and logged in

## How It Works

1. User clicks social sign-in button
2. Frontend redirects to Supabase OAuth provider
3. User authenticates with provider (Google, GitHub, etc.)
4. Provider redirects back to `/auth/callback`
5. `AuthCallback` component processes the session
6. `AuthContext` syncs Supabase user with backend
7. Backend creates/updates user in database
8. User is logged in with JWT token

## Troubleshooting

### "Supabase not configured" error:
- Check that `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set in frontend `.env`
- Restart the frontend server after adding env variables

### OAuth redirect fails:
- Verify redirect URL is correctly set in Supabase dashboard
- Check that redirect URL matches exactly (including http/https and port)

### User not created in database:
- Check backend logs for errors
- Verify `supabase_user_id` column exists in users table
- Check that migration was run successfully

### Multiple accounts with same email:
- The system links accounts by email if `supabase_user_id` doesn't exist
- Existing email/password users can link their social accounts

## Supported Providers

Currently implemented:
- ✅ Google
- ✅ GitHub
- 🔄 Facebook (can be added by enabling in Supabase)
- 🔄 Twitter/X (can be added by enabling in Supabase)
- 🔄 Apple (can be added by enabling in Supabase)

To add more providers, simply enable them in Supabase dashboard and they will appear automatically in the sign-in options.

