# Chillings Entertainment Platform - Setup Guide

This guide will walk you through setting up the Chillings Entertainment Platform from scratch.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier works)
- A code editor (VS Code recommended)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: event-organizer (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for project to be created (2-3 minutes)

### 1.2 Get API Keys

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

### 1.3 Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `database/schema.sql` from this project
4. Copy and paste the entire contents
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify tables were created in **Table Editor**

### 1.4 Seed Database

1. In **SQL Editor**, create a new query
2. Open `database/seeds.sql` from this project
3. Copy and paste the entire contents
4. Click **Run**
5. Verify data was inserted:
   - Check `cities` table has 8 cities
   - Check `service_types` table has 11 service types
   - Check `celebrity_history` has records

**Important**: The seed data includes placeholder user accounts. In production, create users through the registration API.

## Step 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and fill in your Supabase credentials:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_string_here
PORT=5000
NODE_ENV=development
```

**Generate JWT_SECRET**: You can use any random string, or generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Test Backend

```bash
npm run dev
```

You should see: `Server running on port 5000`

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","message":"Chillings Entertainment API is running"}
```

## Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure Environment

1. Create `.env` file in the `frontend` directory:
```bash
touch .env
```

2. Add the API URL:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 3.3 Start Frontend

```bash
npm start
```

The app should open at `http://localhost:3000`

## Step 4: Create Test Data

### 4.1 Register a User

1. Go to `http://localhost:3000/register`
2. Create an account:
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`

### 4.2 Create Sample Vendors (Optional)

You can create vendors through the UI or use the API:

```bash
# First, login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copy the token from response, then:
curl -X POST http://localhost:5000/api/vendors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "business_name": "My Event Services",
    "description": "Full service provider",
    "city_id": "CITY_ID_FROM_DATABASE",
    "services": [
      {
        "service_type_id": "SERVICE_TYPE_ID",
        "price_per_unit": 500,
        "unit_type": "per_event",
        "min_quantity": 1,
        "max_quantity": 10
      }
    ]
  }'
```

**Note**: Get city_id and service_type_id from your Supabase database.

## Step 5: Test the Application

### 5.1 Create an Event

1. Login to the app
2. Click "Create Event"
3. Fill in event details:
   - Title: "Test Event"
   - Date: Future date
   - City: Select from dropdown
   - Expected Attendees: 200
   - Add a guest name: "John Doe"
4. Click "Create Event"

### 5.2 Generate Recommendations

1. After creating event, you'll be redirected to recommendations page
2. Click "Generate Recommendations"
3. Review the recommended services
4. Click "Add All to Cart" or add individual items

### 5.3 Checkout

1. Go to Cart
2. Click "Proceed to Checkout"
3. System will match services to vendors
4. Booking will be completed

## Troubleshooting

### Backend Issues

**Error: Missing Supabase environment variables**
- Check your `.env` file exists and has all required variables
- Restart the server after changing `.env`

**Error: Connection to Supabase failed**
- Verify your SupABASE_URL is correct
- Check your internet connection
- Verify Supabase project is active

**Error: JWT verification failed**
- Check JWT_SECRET is set in `.env`
- Ensure token hasn't expired (7 days)

### Frontend Issues

**Error: Cannot connect to API**
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

**Error: 401 Unauthorized**
- Token may have expired - try logging out and back in
- Check localStorage has a valid token

### Database Issues

**Error: Table doesn't exist**
- Run `schema.sql` again in Supabase SQL Editor
- Check table names match exactly

**Error: Foreign key constraint**
- Ensure seed data is run after schema
- Check that referenced IDs exist

**No vendors found during checkout**
- Verify vendors are marked as `is_verified: true` in database
- Check vendors have services matching your event needs
- Ensure vendor services are `is_active: true`

## Next Steps

1. **Add More Vendors**: Create vendor accounts for all service types
2. **Add Celebrity Data**: Populate `celebrity_history` with real data
3. **Customize Recommendations**: Adjust logic in `recommendationEngine.js`
4. **Enhance UI**: Customize Tailwind styles
5. **Add Features**: Payment processing, email notifications, etc.

## Production Deployment

### Backend

1. Use environment variables from your hosting provider
2. Set `NODE_ENV=production`
3. Use a process manager like PM2
4. Set up SSL/HTTPS

### Frontend

1. Build for production: `npm run build`
2. Deploy `build/` folder to hosting (Vercel, Netlify, etc.)
3. Update `REACT_APP_API_URL` to production backend URL

### Database

1. Use Supabase production project
2. Set up database backups
3. Monitor performance

## Support

For issues or questions:
1. Check the main README.md
2. Review API documentation in README
3. Check Supabase logs for database errors
4. Review browser console for frontend errors

