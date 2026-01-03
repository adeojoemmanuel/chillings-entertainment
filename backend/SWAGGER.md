# Swagger API Documentation

The Chillings Entertainment Platform API is fully documented with Swagger/OpenAPI 3.0.

## Accessing Swagger UI

Once the backend server is running, you can access the Swagger documentation at:

**http://localhost:3002/api-docs**

## Features

- **Interactive API Testing**: Test all endpoints directly from the browser
- **Complete Schema Documentation**: All request/response schemas are documented
- **Authentication Support**: Test authenticated endpoints with JWT tokens
- **Request/Response Examples**: See example payloads for all endpoints

## Using Swagger UI

### 1. Testing Public Endpoints

Public endpoints (like `/api/auth/register` and `/api/auth/login`) can be tested directly:

1. Navigate to the endpoint in Swagger UI
2. Click "Try it out"
3. Fill in the request body
4. Click "Execute"
5. View the response

### 2. Testing Authenticated Endpoints

For authenticated endpoints, you need to:

1. **First, get a JWT token**:
   - Use `/api/auth/login` or `/api/auth/register` to get a token
   - Copy the `token` from the response

2. **Authorize in Swagger**:
   - Click the "Authorize" button at the top of Swagger UI
   - Enter: `Bearer <your-token-here>`
   - Click "Authorize"
   - Click "Close"

3. **Now test authenticated endpoints**:
   - All authenticated endpoints will automatically include the token
   - Test any endpoint that requires authentication

### 3. Example Workflow

#### Step 1: Register a User
```
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User"
}
```
Copy the `token` from the response.

#### Step 2: Authorize
- Click "Authorize" button
- Enter: `Bearer <token-from-step-1>`
- Click "Authorize"

#### Step 3: Create an Event
```
POST /api/events/create
{
  "title": "Test Event",
  "event_date": "2024-12-25T18:00:00Z",
  "city_id": "<your-city-id>",
  "expected_attendees": 200
}
```

#### Step 4: Get Recommendations
```
POST /api/events/recommend-services
{
  "event_id": "<event-id-from-step-3>"
}
```

#### Step 5: Checkout
```
POST /api/events/checkout
{
  "event_id": "<event-id>"
}
```

## Available Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires auth)

### Events (`/api/events`)
- `POST /create` - Create new event (requires auth)
- `GET /user` - Get user's events (requires auth)
- `GET /:id` - Get event details (requires auth)
- `POST /recommend-services` - Generate recommendations (requires auth)
- `POST /add-to-cart` - Add service to cart (requires auth)
- `POST /add-all-to-cart` - Add all to cart (requires auth)
- `POST /checkout` - Complete checkout (requires auth)

### Vendors (`/api/vendors`)
- `POST /register` - Register as vendor (requires auth)
- `GET /` - List vendors (public)

### Vetting (`/api/vetting`)
- `POST /check-guests` - Validate guests (requires auth)

## Schema Documentation

All data models are documented in the Swagger UI:

- **User** - User account information
- **Event** - Event details
- **ServiceRecommendation** - Service recommendations
- **VettingResult** - Guest validation results
- **Vendor** - Vendor information
- **Error** - Error response format

## Tips

1. **Get City IDs**: You'll need city IDs from your database to create events. Check your Supabase database or create a simple endpoint to list cities.

2. **Get Service Type IDs**: Similarly, you'll need service type IDs. These are created in the seed data.

3. **UUID Format**: All IDs are UUIDs. Make sure to use the correct format when testing.

4. **Date Format**: Event dates should be in ISO 8601 format: `2024-12-25T18:00:00Z`

5. **Token Expiration**: JWT tokens expire after 7 days. If you get 401 errors, re-authenticate.

## Troubleshooting

**Swagger UI not loading?**
- Make sure the server is running on port 3002
- Check that all dependencies are installed: `npm install`
- Check server logs for errors

**401 Unauthorized errors?**
- Make sure you've authorized with a valid token
- Token might have expired - get a new one
- Check that the token format is correct: `Bearer <token>`

**404 Not Found?**
- Check that the endpoint path is correct
- Verify the server is running
- Check that routes are properly registered

**Schema validation errors?**
- Check that required fields are included
- Verify data types match the schema
- Check UUID format for IDs

