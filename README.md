# Chillings Entertainment Platform

A full-stack web application for organizing events with intelligent service recommendations, celebrity vetting, and vendor matching.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │ Dashboard│  │  Events  │  │  Vendors │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│       │             │              │              │         │
└───────┼─────────────┼──────────────┼──────────────┼─────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                           │
                  ┌────────▼────────┐
                  │  API Gateway    │
                  │  (Express.js)   │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐
│   Auth       │  │  Chillings Entertainment   │  │  Vendor    │
│   Service    │  │  - Vetting      │  │  Service  │
│              │  │  - Recommendations│  │           │
└──────────────┘  └─────────────────┘  └────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────▼────────┐
                  │   Supabase      │
                  │   PostgreSQL    │
                  └─────────────────┘
```

## 📁 Project Structure

```
chillings-entertainment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── vendorController.js
│   │   │   └── vettingController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   ├── recommendationEngine.js
│   │   │   ├── vettingEngine.js
│   │   │   └── vendorMatching.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── events.js
│   │   │   └── vendors.js
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   ├── cart/
│   │   │   └── vendors/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── VendorRegister.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── database/
│   ├── schema.sql
│   └── seeds.sql
└── README.md
```

## 🗄️ Database Schema

See `database/schema.sql` for complete table definitions.

### Core Tables:
- `users` - User accounts
- `vendors` - Vendor accounts
- `vendor_services` - Services offered by vendors
- `events` - Event records
- `event_guests` - Invited guests/celebrities per event
- `event_recommendations` - System-generated service recommendations
- `event_cart` - Shopping cart items
- `event_services` - Final booked services
- `celebrity_history` - Historical event data for celebrities
- `cities` - City master data
- `service_types` - Service type catalog

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure Supabase credentials in `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Run database migrations:
   - Go to Supabase SQL Editor
   - Run `database/schema.sql`
   - Run `database/seeds.sql`

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `POST /api/events/create` - Create new event
- `GET /api/events/user` - Get user's events
- `GET /api/events/:id` - Get event details
- `POST /api/events/recommend-services` - Get service recommendations
- `POST /api/events/checkout` - Complete event booking

### Vendors
- `POST /api/vendors/register` - Register as vendor
- `GET /api/vendors` - List vendors (with filters)

### Vetting
- `POST /api/vetting/check-guests` - Validate invited guests

## 🔑 Key Features

1. **Celebrity Vetting Engine**: Validates invited guests based on historical event data
2. **Service Recommendation Engine**: Automatically suggests required services based on event parameters
3. **Vendor Matching**: Matches services to registered vendors during checkout
4. **Smart Cart**: Add individual or all recommended services at once

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens

## 📋 Detailed API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token"
}
```

#### GET /api/auth/me
Get current authenticated user (requires authentication).

---

### Event Endpoints

#### POST /api/events/create
Create a new event (requires authentication).

**Request Body:**
```json
{
  "title": "Summer Music Festival",
  "description": "Annual summer music event",
  "event_date": "2024-07-15T18:00:00Z",
  "city_id": "uuid",
  "area": "Downtown",
  "is_paid": true,
  "requires_ticketing": true,
  "expected_attendees": 500,
  "number_of_hosts": 2,
  "number_of_guests": 3,
  "guest_names": ["John Doe", "Jane Smith"]
}
```

#### GET /api/events/user
Get all events for the authenticated user.

#### GET /api/events/:id
Get event details by ID.

#### POST /api/events/recommend-services
Generate service recommendations for an event.

**Request Body:**
```json
{
  "event_id": "uuid"
}
```

**Response:**
```json
{
  "message": "Service recommendations generated",
  "recommendations": [
    {
      "service_type_id": "uuid",
      "service_name": "Tents",
      "quantity": 2,
      "priority": 1,
      "reason": "Tent(s) recommended for large event"
    }
  ],
  "notification": "Please verify that the recommended event locations are available for your chosen date."
}
```

#### POST /api/events/add-to-cart
Add a service to the event cart.

**Request Body:**
```json
{
  "event_id": "uuid",
  "service_type_id": "uuid",
  "quantity": 1
}
```

#### POST /api/events/add-all-to-cart
Add all recommended services to cart.

**Request Body:**
```json
{
  "event_id": "uuid"
}
```

#### POST /api/events/checkout
Complete checkout and match services to vendors.

**Request Body:**
```json
{
  "event_id": "uuid"
}
```

**Response:**
```json
{
  "message": "Checkout completed successfully",
  "event_id": "uuid",
  "booked_services": [...],
  "total_cost": 15000.00,
  "services_count": 8
}
```

---

### Vendor Endpoints

#### POST /api/vendors/register
Register as a vendor (requires authentication).

**Request Body:**
```json
{
  "business_name": "Premium Event Services",
  "description": "Full-service event provider",
  "phone": "+1234567890",
  "email": "vendor@example.com",
  "address": "123 Main St",
  "city_id": "uuid",
  "services": [
    {
      "service_type_id": "uuid",
      "price_per_unit": 500.00,
      "unit_type": "per_event",
      "min_quantity": 1,
      "max_quantity": 10
    }
  ]
}
```

#### GET /api/vendors
List vendors (public endpoint, supports filtering).

**Query Parameters:**
- `service_type_id`: Filter by service type
- `city_id`: Filter by city
- `min_rating`: Minimum rating

---

### Vetting Endpoints

#### POST /api/vetting/check-guests
Validate invited guests/celebrities (requires authentication).

**Request Body:**
```json
{
  "guest_names": ["John Doe", "Jane Smith"],
  "city_id": "uuid",
  "expected_attendees": 500
}
```

**Response:**
```json
{
  "results": [
    {
      "guest_name": "John Doe",
      "is_verified": true,
      "previous_events": 3,
      "avg_attendance": 450,
      "max_attendance": 600,
      "notes": "Verified: 3 previous events...",
      "is_realistic": true
    }
  ],
  "summary": {
    "total_guests": 2,
    "verified_count": 2,
    "realistic_count": 2,
    "verification_rate": 100,
    "all_verified": true,
    "all_realistic": true
  }
}
```

---

## 🔧 Key Algorithms

### Celebrity Vetting Algorithm

The vetting engine:
1. Queries historical event data for each guest in the specified city
2. Calculates average and maximum attendance from past events
3. Compares expected attendance against historical data
4. Verifies guests with 2+ previous events and realistic attendance projections
5. Returns detailed verification results with notes

### Service Recommendation Algorithm

The recommendation engine considers:
- **Event Size**: Small (<100), Medium (100-500), Large (500+)
- **Attendee Count**: Determines quantities for chairs, catering, security
- **Event Type**: Paid/free, ticketing requirements
- **Hosts/Guests**: Determines audio equipment needs
- **Priority Levels**: Required (0), Recommended (1), Optional (2)

### Vendor Matching Algorithm

During checkout, the system:
1. Finds all vendors offering each required service
2. Filters by availability dates and quantity requirements
3. Scores vendors based on:
   - Verification status (+50 points)
   - Same city location (+30 points)
   - Rating (rating × 10 points)
   - Price competitiveness
4. Selects highest-scoring vendor for each service

---

## 📝 Database Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### Step 2: Run Schema
1. Open Supabase SQL Editor
2. Copy and paste contents of `database/schema.sql`
3. Execute the script

### Step 3: Seed Data
1. In Supabase SQL Editor
2. Copy and paste contents of `database/seeds.sql`
3. Execute the script

**Note**: The seed data includes sample vendors, but user accounts should be created through the registration API for proper password hashing.

---

## 🧪 Testing the Application

### 1. Create User Account
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User"
}
```

### 2. Create Event
```bash
POST http://localhost:5000/api/events/create
Authorization: Bearer <token>
{
  "title": "Test Event",
  "event_date": "2024-12-25T18:00:00Z",
  "city_id": "<city_id>",
  "expected_attendees": 200,
  "guest_names": ["John Doe"]
}
```

### 3. Generate Recommendations
```bash
POST http://localhost:5000/api/events/recommend-services
Authorization: Bearer <token>
{
  "event_id": "<event_id>"
}
```

### 4. Checkout
```bash
POST http://localhost:5000/api/events/checkout
Authorization: Bearer <token>
{
  "event_id": "<event_id>"
}
```

---

## 🚨 Important Notes

1. **Password Hashing**: User passwords must be hashed using bcrypt. The seed data includes placeholder hashes - create users through the API.

2. **City IDs**: When creating events, use actual city IDs from your database. The frontend includes hardcoded cities for demo purposes.

3. **Vendor Verification**: Vendors must be marked as `is_verified: true` to appear in search results and be matched during checkout.

4. **Date Format**: Event dates should be in ISO 8601 format with timezone.

5. **Environment Variables**: Ensure all environment variables are set correctly in both backend and frontend `.env` files.

---

## 📦 Project Structure Details

### Backend Services

- **vettingEngine.js**: Validates celebrity guests based on historical data
- **recommendationEngine.js**: Generates service recommendations based on event parameters
- **vendorMatching.js**: Matches services to vendors during checkout

### Frontend Components

- **AuthContext**: Manages user authentication state
- **Dashboard**: Main user dashboard with event list
- **CreateEvent**: Event creation form with guest vetting
- **Recommendations**: Displays and manages service recommendations
- **Cart**: Shopping cart before checkout
- **VendorRegister**: Vendor onboarding form

---

## 🔐 Security Considerations

1. **JWT Tokens**: Tokens expire after 7 days
2. **Password Hashing**: Uses bcrypt with salt rounds
3. **SQL Injection**: Uses Supabase client with parameterized queries
4. **CORS**: Configured for frontend origin
5. **Authentication**: Protected routes require valid JWT token

---

## 🐛 Troubleshooting

### Backend Issues
- Check Supabase credentials in `.env`
- Verify database schema is created
- Check JWT_SECRET is set
- Review server logs for errors

### Frontend Issues
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for API errors
- Ensure backend is running on correct port
- Clear localStorage if authentication issues occur

### Database Issues
- Verify all tables are created
- Check foreign key constraints
- Ensure seed data ran successfully
- Review Supabase logs for SQL errors

