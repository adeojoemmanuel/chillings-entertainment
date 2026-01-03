# Troubleshooting Guide - Fetch Failed Error

## Error: "TypeError: fetch failed"

This error indicates a network connectivity issue between your backend and Supabase.

### Quick Fixes

1. **Check Your Internet Connection**
   ```bash
   # Test internet connectivity
   ping google.com
   ```

2. **Verify Supabase URL**
   - Check your `.env` file in the `backend` directory
   - Ensure `SUPABASE_URL` is in the format: `https://your-project-id.supabase.co`
   - Make sure there's no trailing slash
   - Verify the URL is accessible in your browser

3. **Verify Supabase Project Status**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Check if your project is active
   - Paused projects won't accept connections

4. **Check Environment Variables**
   ```bash
   cd backend
   # Make sure .env file exists
   cat .env | grep SUPABASE
   ```
   
   Should show:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

5. **Test Supabase Connection Manually**
   ```bash
   # Test if you can reach Supabase
   curl https://your-project-id.supabase.co/rest/v1/
   ```

6. **Check Firewall/Proxy Settings**
   - Corporate firewalls may block Supabase
   - Check if you're behind a proxy
   - Try from a different network

7. **Verify API Keys**
   - Go to Supabase Dashboard → Settings → API
   - Copy the correct keys:
     - **Project URL** → `SUPABASE_URL`
     - **anon public** key → `SUPABASE_KEY`
     - **service_role** key → `SUPABASE_SERVICE_KEY`

8. **Restart the Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Common Issues

#### Issue: Supabase URL is incorrect
**Solution**: Double-check the URL format. It should be:
- ✅ `https://abcdefghijklmnop.supabase.co`
- ❌ `https://supabase.co/project/...`
- ❌ `http://...` (must be HTTPS)

#### Issue: Project is paused
**Solution**: 
- Go to Supabase dashboard
- Resume the project if it's paused
- Free tier projects pause after inactivity

#### Issue: Network timeout
**Solution**:
- Check your internet connection speed
- Try from a different network
- Check if there are any VPN issues

#### Issue: SSL Certificate Error
**Solution**:
- Update Node.js to latest version
- Check system date/time is correct
- Try updating certificates

### Testing Connection

**Use the built-in diagnostic tool** (recommended):

```bash
cd backend
npm run test:supabase
```

This will test:
- Environment variables
- URL accessibility
- API key validity
- Database connectivity
- Table accessibility

**Or run it directly:**
```bash
cd backend
node test-supabase-connection.js
```

The diagnostic tool provides detailed information about what's working and what's not, making it easier to identify the issue.

### Still Having Issues?

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Review Logs**: Check Supabase dashboard logs
3. **Contact Support**: If project is active and URL is correct, contact Supabase support

### Environment File Example

Make sure your `backend/.env` file looks like this:

```env
NODE_ENV=development
PORT=3003
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-secret-key
```

**Important**: Never commit `.env` files to version control!

