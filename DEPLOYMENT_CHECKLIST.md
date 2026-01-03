# Deployment Quick Checklist

Use this checklist during deployment to ensure nothing is missed.

## Pre-Deployment

- [ ] Supabase production project created
- [ ] Database schema applied (`database/schema.sql`)
- [ ] Seed data applied (`database/seeds.sql`)
- [ ] Production Supabase credentials saved securely
- [ ] JWT_SECRET generated (32+ character random string)
- [ ] Email SMTP credentials ready (if using email features)
- [ ] Git repository pushed to GitHub/GitLab
- [ ] All environment variables documented

## Backend Deployment

### Railway
- [ ] Railway account created
- [ ] Project created and connected to GitHub
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint working: `/health`
- [ ] Backend URL saved

### Alternative Platforms
- [ ] Platform account created
- [ ] Application deployed
- [ ] Environment variables configured
- [ ] Health check passing
- [ ] Backend URL obtained

## Frontend Deployment

### Vercel
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `build`
- [ ] Environment variables added:
  - [ ] `REACT_APP_API_URL`
  - [ ] `REACT_APP_SUPABASE_URL`
  - [ ] `REACT_APP_SUPABASE_ANON_KEY`
- [ ] Deployment successful
- [ ] Frontend URL saved

### Alternative Platforms
- [ ] Platform account created
- [ ] Application deployed
- [ ] Environment variables configured
- [ ] Frontend accessible
- [ ] Frontend URL obtained

## Environment Variables Verification

### Backend
- [ ] `NODE_ENV=production`
- [ ] `PORT=3003` (or configured port)
- [ ] `SUPABASE_URL` (production URL)
- [ ] `SUPABASE_KEY` (anon key)
- [ ] `SUPABASE_SERVICE_KEY` (service role key)
- [ ] `JWT_SECRET` (secure random string)
- [ ] `SMTP_HOST` (if using email)
- [ ] `SMTP_PORT` (if using email)
- [ ] `SMTP_USER` (if using email)
- [ ] `SMTP_PASS` (if using email)
- [ ] `SMTP_FROM` (if using email)
- [ ] `ADMIN_EMAIL` (if using email)

### Frontend
- [ ] `REACT_APP_API_URL` (backend production URL)
- [ ] `REACT_APP_SUPABASE_URL` (production Supabase URL)
- [ ] `REACT_APP_SUPABASE_ANON_KEY` (anon key)

## Testing

### Backend API Tests
- [ ] Health check: `GET /health` returns 200
- [ ] User registration: `POST /api/auth/register` works
- [ ] User login: `POST /api/auth/login` works
- [ ] Get user: `GET /api/auth/me` works (with token)
- [ ] Create event: `POST /api/events/create` works
- [ ] Get events: `GET /api/events/user` works
- [ ] CORS configured correctly

### Frontend Tests
- [ ] Homepage loads
- [ ] Registration form works
- [ ] Login form works
- [ ] Dashboard accessible after login
- [ ] Create event form works
- [ ] Event details page loads
- [ ] Recommendations page works
- [ ] Cart page works
- [ ] No console errors
- [ ] API calls successful

### Integration Tests
- [ ] User can register
- [ ] User can login
- [ ] User can create event
- [ ] Recommendations generate
- [ ] Services can be added to cart
- [ ] Checkout completes
- [ ] Vendor matching works

## Security

- [ ] HTTPS enabled (SSL certificates)
- [ ] CORS configured for frontend domain only
- [ ] Environment variables not in Git
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT_SECRET used
- [ ] Supabase RLS policies reviewed
- [ ] Service role key only in backend
- [ ] No sensitive data in frontend code

## Database

- [ ] Production database created
- [ ] Schema migrations applied
- [ ] Seed data loaded (if needed)
- [ ] RLS policies configured
- [ ] Backups enabled
- [ ] Database connection tested
- [ ] Query performance acceptable

## Post-Deployment

- [ ] Custom domain configured (if applicable)
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Documentation updated
- [ ] Team notified of deployment

## Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback

## Documentation

- [ ] API documentation accessible
- [ ] Deployment guide updated
- [ ] Environment variables documented
- [ ] Team access to hosting platforms
- [ ] Credentials stored securely (password manager)

## Monitoring Setup

- [ ] Uptime monitoring configured
- [ ] Error logging set up
- [ ] Performance monitoring active
- [ ] Alerts configured
- [ ] Log aggregation set up (optional)

## Final Verification

- [ ] All tests passing
- [ ] No critical errors in logs
- [ ] Application accessible to users
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Backup strategy active

---

## Quick Commands Reference

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Health
```bash
curl https://your-backend-url.com/health
```

### Test Backend API
```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'
```

### Build Frontend Locally
```bash
cd frontend
npm install
npm run build
```

### Check Environment Variables (Backend)
```bash
# Railway
railway variables

# Render
# Check in dashboard

# Heroku
heroku config
```

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Backend URL**: _______________
**Frontend URL**: _______________
**Notes**: _______________

