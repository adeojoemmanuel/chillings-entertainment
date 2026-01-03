# Environment Variables Examples

This document provides examples of environment variable files for both frontend and backend.

## Backend `.env` File

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3003
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_KEY=your-anon-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for sponsor notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Admin Email (for sponsor application notifications)
ADMIN_EMAIL=admin@chillingsentertainment.com
```

### Email Setup Notes:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the App Password as `SMTP_PASS`

2. **Other Email Providers:**
   - **SendGrid**: Use `smtp.sendgrid.net` as host
   - **AWS SES**: Use your SES SMTP credentials
   - **Mailgun**: Use `smtp.mailgun.org` as host

3. **If SMTP is not configured:**
   - The system will log emails to the console instead
   - This is useful for development/testing

## Frontend `.env` File

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:3003

# Supabase Configuration (for social sign-in)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

For production, update the API URL to your backend server URL.

### Social Sign-In Setup:

1. **Enable OAuth Providers in Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable the providers you want (Google, GitHub, Facebook, etc.)
   - Configure OAuth credentials for each provider

2. **Set Redirect URLs:**
   - In Supabase dashboard, go to Authentication > URL Configuration
   - Add your redirect URL: `http://localhost:3000/auth/callback` (for development)
   - Add production URL: `https://yourdomain.com/auth/callback` (for production)

3. **Get Supabase Credentials:**
   - Go to Settings > API in Supabase dashboard
   - Copy the "Project URL" → `REACT_APP_SUPABASE_URL`
   - Copy the "anon public" key → `REACT_APP_SUPABASE_ANON_KEY`
