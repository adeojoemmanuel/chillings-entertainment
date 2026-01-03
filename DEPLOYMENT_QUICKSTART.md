# Deployment Quick Start Guide

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🚀 Fastest Deployment Path (Recommended)

### Backend: Railway
### Frontend: Vercel

---

## Step 1: Prepare Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Create/Select Project
2. Go to **SQL Editor** → Run `database/schema.sql`
3. Run `database/seeds.sql` (optional)
4. Go to **Settings** → **API** → Copy:
   - Project URL
   - `anon` key
   - `service_role` key

---

## Step 2: Deploy Backend (10 minutes)

### Using Railway

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. Set **Root Directory**: `backend`
5. Add Environment Variables:

```env
NODE_ENV=production
PORT=3003
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=generate-with-command-below
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Click **Deploy**
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

---

## Step 3: Deploy Frontend (10 minutes)

### Using Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. **Add New Project** → Import your repo
3. Configure:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add Environment Variables:

```env
REACT_APP_API_URL=your-backend-url-from-step-2
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

5. Click **Deploy**
6. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 4: Update Backend CORS (2 minutes)

If your frontend and backend are on different domains:

1. In Railway, go to your backend service
2. Add environment variable or update code:

In `backend/src/server.js`, update CORS:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

Redeploy backend.

---

## Step 5: Test (5 minutes)

1. Visit your frontend URL
2. Register a new user
3. Create an event
4. Test recommendations
5. Check backend health: `https://your-backend-url.com/health`

---

## ✅ Done!

Your application is now live!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Docs**: `https://your-backend-url.com/api-docs`

---

## Alternative Platforms

### Backend Alternatives
- **Render**: [render.com](https://render.com) - Free tier available
- **Heroku**: [heroku.com](https://heroku.com) - Paid
- **DigitalOcean**: [digitalocean.com](https://digitalocean.com) - App Platform

### Frontend Alternatives
- **Netlify**: [netlify.com](https://netlify.com) - Free tier
- **AWS S3 + CloudFront**: Enterprise option

---

## Troubleshooting

### Backend not connecting to database
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- Check Supabase project is active

### Frontend can't reach backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration
- Rebuild frontend after changing env vars

### 401 Unauthorized errors
- Check JWT_SECRET is set
- Verify token in localStorage
- Check token expiration

---

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring
3. Set up error tracking
4. Enable database backups
5. Review security settings

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

