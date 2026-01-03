# Chillings Entertainment Platform - Deployment Guide

This guide provides step-by-step instructions for deploying both the frontend and backend of the Chillings Entertainment Platform to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
   - [Option A: Railway](#option-a-railway-recommended)
   - [Option B: Render](#option-b-render)
   - [Option C: Heroku](#option-c-heroku)
   - [Option D: AWS EC2](#option-d-aws-ec2)
   - [Option E: DigitalOcean App Platform](#option-e-digitalocean-app-platform)
3. [Frontend Deployment](#frontend-deployment)
   - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
   - [Option B: Netlify](#option-b-netlify)
   - [Option C: AWS S3 + CloudFront](#option-c-aws-s3--cloudfront)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project created and configured
- [ ] Database schema and seeds applied
- [ ] All environment variables documented
- [ ] Production Supabase credentials ready
- [ ] Domain name (optional but recommended)
- [ ] SSL certificates (handled by most platforms)
- [ ] Git repository set up (GitHub/GitLab/Bitbucket)

---

## Backend Deployment

### Option A: Railway (Recommended)

Railway is easy to use and provides automatic deployments from Git.

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

#### Step 2: Deploy Backend

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Railway will auto-detect Node.js
4. Set the root directory to `backend`
5. Click **"Deploy"**

#### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3003
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-secure-random-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@chillingsentertainment.com
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4: Configure Build Settings

1. Go to **Settings** → **Build**
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm start`
4. Set **Root Directory**: `backend`

#### Step 5: Get Backend URL

1. Railway will provide a URL like: `https://your-app.railway.app`
2. Copy this URL for frontend configuration

---

### Option B: Render

Render provides free tier hosting with automatic SSL.

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `chillings-entertainment-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend`)

#### Step 3: Environment Variables

In **Environment** section, add all variables from Railway section above.

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Get your backend URL: `https://your-app.onrender.com`

**Note**: Free tier services spin down after inactivity. Consider upgrading for production.

---

### Option C: Heroku

#### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App

```bash
heroku login
cd backend
heroku create chillings-entertainment-backend
```

#### Step 3: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3003
heroku config:set SUPABASE_URL=https://your-project.supabase.co
heroku config:set SUPABASE_KEY=your-anon-key
heroku config:set SUPABASE_SERVICE_KEY=your-service-role-key
heroku config:set JWT_SECRET=your-secure-random-string
# Add all other environment variables
```

#### Step 4: Deploy

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Deploy to Heroku
heroku git:remote -a chillings-entertainment-backend
git push heroku main
```

#### Step 5: Verify

```bash
heroku open
# Or visit: https://chillings-entertainment-backend.herokuapp.com/health
```

---

### Option D: AWS EC2

For more control and scalability.

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click **"Launch Instance"**
3. Choose Ubuntu 22.04 LTS
4. Select instance type (t2.micro for free tier)
5. Configure security group:
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow SSH (port 22)
   - Allow custom TCP (port 3003)
6. Launch and download key pair

#### Step 2: Connect to Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Node.js and PM2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### Step 4: Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/chillings-entertainment.git
cd chillings-entertainment/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Paste all environment variables
```

#### Step 5: Start Application with PM2

```bash
# Start application
pm2 start src/server.js --name chillings-entertainment-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs
```

#### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/chillings-entertainment
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/chillings-entertainment /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 7: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option E: DigitalOcean App Platform

#### Step 1: Create Account

1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up

#### Step 2: Create App

1. Go to **Apps** → **Create App**
2. Connect GitHub repository
3. Configure:
   - **Type**: Web Service
   - **Source Directory**: `backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: `3003`

#### Step 3: Environment Variables

Add all environment variables in the **Environment Variables** section.

#### Step 4: Deploy

Click **"Create Resources"** and wait for deployment.

---

## Frontend Deployment

### Option A: Vercel (Recommended)

Vercel is optimized for React applications and provides excellent performance.

#### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### Step 2: Import Project

1. Click **"Add New"** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Step 3: Environment Variables

Add environment variables:

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

#### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy automatically
3. You'll get a URL like: `https://your-app.vercel.app`

#### Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

### Option B: Netlify

#### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

#### Step 2: Deploy Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Connect GitHub repository
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

#### Step 3: Environment Variables

Go to **Site settings** → **Environment variables** and add:

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

#### Step 4: Redeploy

After adding environment variables, trigger a new deployment.

---

### Option C: AWS S3 + CloudFront

For enterprise-grade hosting.

#### Step 1: Build Frontend

```bash
cd frontend
npm install
npm run build
```

#### Step 2: Create S3 Bucket

1. Go to AWS Console → S3
2. Create bucket: `chillings-entertainment-frontend`
3. Disable **"Block all public access"**
4. Enable **"Static website hosting"**
5. Set index document: `index.html`
6. Set error document: `index.html` (for React Router)

#### Step 3: Upload Build Files

```bash
# Install AWS CLI if not installed
aws s3 sync build/ s3://chillings-entertainment-frontend --delete
```

#### Step 4: Configure Bucket Policy

In S3 bucket → **Permissions** → **Bucket Policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chillings-entertainment-frontend/*"
    }
  ]
}
```

#### Step 5: Setup CloudFront Distribution

1. Go to CloudFront → **Create Distribution**
2. **Origin Domain**: Select your S3 bucket
3. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
4. **Default Root Object**: `index.html`
5. **Error Pages**: Add custom error response for 403/404 → 200 → `/index.html`
6. Create distribution

#### Step 6: Update Environment Variables

Rebuild frontend with production API URL:

```bash
REACT_APP_API_URL=https://your-backend-url.com npm run build
aws s3 sync build/ s3://chillings-entertainment-frontend --delete
```

---

## Database Setup

### Supabase Production Configuration

1. **Create Production Project** (if not using existing):
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Choose production region

2. **Run Database Migrations**:
   - Go to SQL Editor
   - Run `database/schema.sql`
   - Run `database/seeds.sql` (or seed data manually)

3. **Configure Row Level Security (RLS)**:
   - Review and enable RLS policies as needed
   - Test with production credentials

4. **Backup Configuration**:
   - Enable automatic backups
   - Set backup retention policy

5. **Get Production Credentials**:
   - Settings → API
   - Copy Project URL and keys
   - Use these in backend environment variables

---

## Environment Configuration

### Backend Production Environment Variables

Create a `.env` file or set in your hosting platform:

```env
# Server
NODE_ENV=production
PORT=3003

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-secure-random-string-min-32-chars

# Email (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@chillingsentertainment.com
```

### Frontend Production Environment Variables

Set in your hosting platform:

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: 
- Frontend environment variables must start with `REACT_APP_`
- Rebuild frontend after changing environment variables
- Never commit `.env` files to Git

---

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://your-backend-url.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Chillings Entertainment API is running",
  "database": "connected"
}
```

### 2. Test API Endpoints

```bash
# Test registration
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "full_name": "Test User"
  }'

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Frontend Verification

1. Visit your frontend URL
2. Test user registration
3. Test login
4. Create an event
5. Test service recommendations
6. Test checkout flow

### 4. Check Logs

- **Backend**: Check hosting platform logs for errors
- **Frontend**: Check browser console for errors
- **Database**: Check Supabase logs

### 5. Performance Testing

- Test API response times
- Check frontend load times
- Monitor database query performance

---

## Troubleshooting

### Backend Issues

#### Error: Cannot connect to database
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- Check Supabase project is active
- Verify network connectivity

#### Error: CORS issues
- Update CORS configuration in `server.js` to include frontend URL
- Check allowed origins in hosting platform

#### Error: Environment variables not loading
- Verify variables are set in hosting platform
- Restart application after adding variables
- Check variable names match exactly

### Frontend Issues

#### Error: Cannot connect to API
- Verify `REACT_APP_API_URL` is correct
- Check backend is running and accessible
- Verify CORS is configured correctly

#### Error: Blank page after deployment
- Check browser console for errors
- Verify build completed successfully
- Check routing configuration

#### Error: Environment variables not working
- Rebuild frontend after adding variables
- Verify variables start with `REACT_APP_`
- Clear browser cache

### Database Issues

#### Error: Table doesn't exist
- Run schema migration in Supabase SQL Editor
- Verify migrations completed successfully

#### Error: Permission denied
- Check RLS policies in Supabase
- Verify service role key is used for admin operations

---

## Security Checklist

- [ ] Use strong `JWT_SECRET` (32+ characters, random)
- [ ] Never commit `.env` files
- [ ] Use HTTPS for all connections
- [ ] Enable CORS only for frontend domain
- [ ] Use Supabase service key only in backend
- [ ] Enable Supabase RLS policies
- [ ] Set up database backups
- [ ] Monitor error logs regularly
- [ ] Use environment-specific credentials
- [ ] Enable rate limiting (consider adding middleware)

---

## Monitoring and Maintenance

### Recommended Tools

1. **Application Monitoring**:
   - Sentry (error tracking)
   - LogRocket (session replay)
   - New Relic (APM)

2. **Uptime Monitoring**:
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

3. **Analytics**:
   - Google Analytics
   - Plausible (privacy-friendly)

### Regular Maintenance

- Monitor error logs weekly
- Review database performance monthly
- Update dependencies quarterly
- Review security patches
- Backup database regularly
- Monitor API usage and costs

---

## Cost Estimation

### Free Tier Options

- **Railway**: $5/month free credit
- **Render**: Free tier (with limitations)
- **Vercel**: Free tier (generous)
- **Netlify**: Free tier (generous)
- **Supabase**: Free tier (500MB database)

### Paid Options (Approximate)

- **Backend Hosting**: $5-20/month
- **Frontend Hosting**: $0-10/month
- **Database (Supabase Pro)**: $25/month
- **Domain**: $10-15/year
- **Email Service**: $0-10/month

**Total**: ~$40-80/month for small to medium traffic

---

## Support

For deployment issues:

1. Check hosting platform documentation
2. Review application logs
3. Check Supabase status page
4. Review this deployment guide
5. Check GitHub issues

---

## Next Steps After Deployment

1. Set up custom domain
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Configure backups
5. Set up CI/CD pipeline
6. Add error tracking
7. Configure analytics
8. Set up staging environment
9. Document API endpoints
10. Create user documentation

---

**Last Updated**: 2024
**Version**: 1.0

