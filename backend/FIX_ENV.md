# Fix Your Supabase API Keys

## Issue
You're getting "Invalid API key" error because your `SUPABASE_SERVICE_KEY` is a placeholder.

## Solution

1. **Go to your Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Get Your Service Role Key**:
   - Go to **Settings** → **API**
   - Find the **service_role** key (NOT the anon key)
   - ⚠️ **This key has admin access - keep it secret!**

3. **Update your `.env` file**:
   ```bash
   cd backend
   nano .env  # or use your preferred editor
   ```

4. **Replace the placeholder**:
   Find this line:
   ```
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxMjM0NTY3LCJleHAiOjE5NTY4MTA1Njc5fQ.example-service-key
   ```

   Replace it with your actual service_role key:
   ```
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-service-role-key-here
   ```

5. **Restart your backend server**:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## Verify Your Keys

Your `.env` should have:
- ✅ `SUPABASE_URL` - Your project URL (looks correct)
- ✅ `SUPABASE_KEY` - Your anon/public key (looks correct)
- ❌ `SUPABASE_SERVICE_KEY` - Your service_role key (needs to be updated)

## Important Notes

- The **anon key** (`SUPABASE_KEY`) is safe to expose in frontend code
- The **service_role key** (`SUPABASE_SERVICE_KEY`) has admin access - NEVER commit it to git or expose it publicly
- Make sure your `.env` file is in `.gitignore` (it should be)

## After Updating

Once you update the key and restart the server, try registering again. The error should be resolved.

