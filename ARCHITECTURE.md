# Chillings Entertainment Platform - Architecture Documentation

## System Overview

The Chillings Entertainment Platform is a full-stack web application that helps users plan events by:
1. Creating events with detailed specifications
2. Validating invited guests/celebrities based on historical data
3. Automatically recommending required services
4. Matching services to vendors during checkout

## Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Context API**: State management for authentication

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Supabase Client**: Database and authentication
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

### Database
- **Supabase PostgreSQL**: Managed PostgreSQL database
- **UUID**: Primary keys
- **Timestamps**: Automatic updated_at tracking

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Components:**
- `Login.jsx` / `Register.jsx`: Authentication UI
- `Dashboard.jsx`: Main user interface
- `CreateEvent.jsx`: Event creation form
- `Recommendations.jsx`: Service recommendations display
- `Cart.jsx`: Shopping cart interface
- `VendorRegister.jsx`: Vendor onboarding
- `EventDetails.jsx`: Event information display

**State Management:**
- `AuthContext`: Global authentication state
- Component-level state for forms and UI

**Routing:**
```
/ → /dashboard (redirect)
/login → Login page
/register → Registration page
/dashboard → User dashboard
/create-event → Event creation
/events/:id → Event details
/events/:id/recommendations → Service recommendations
/events/:id/cart → Shopping cart
/vendor-register → Vendor registration
```

### 2. API Layer (Backend)

**Route Structure:**
```
/api/auth/* → Authentication endpoints
/api/events/* → Event management
/api/vendors/* → Vendor management
/api/vetting/* → Guest validation
```

**Middleware:**
- `authenticateToken`: JWT verification
- `cors`: Cross-origin resource sharing
- `express.json`: JSON body parsing

### 3. Business Logic Layer

**Services:**

1. **VettingEngine** (`services/vettingEngine.js`)
   - Validates celebrity guests
   - Queries historical event data
   - Calculates attendance statistics
   - Determines verification status

2. **RecommendationEngine** (`services/recommendationEngine.js`)
   - Analyzes event parameters
   - Generates service recommendations
   - Assigns priority levels
   - Saves recommendations to database

3. **VendorMatching** (`services/vendorMatching.js`)
   - Finds vendors for each service
   - Filters by availability and capacity
   - Scores and ranks vendors
   - Selects best matches

### 4. Data Layer

**Database Tables:**

- **users**: User accounts
- **vendors**: Vendor accounts
- **vendor_services**: Services offered by vendors
- **events**: Event records
- **event_guests**: Invited guests per event
- **event_recommendations**: System recommendations
- **event_cart**: Shopping cart items
- **event_services**: Final bookings
- **celebrity_history**: Historical event data
- **cities**: City master data
- **service_types**: Service catalog

## Data Flow

### Event Creation Flow

```
User Input → CreateEvent Component
  ↓
POST /api/events/create
  ↓
eventController.createEvent()
  ↓
Insert into events table
  ↓
Insert into event_guests table
  ↓
Return event_id
  ↓
Redirect to Recommendations page
```

### Recommendation Flow

```
User clicks "Generate Recommendations"
  ↓
POST /api/events/recommend-services
  ↓
eventController.recommendServices()
  ↓
Fetch event data
  ↓
RecommendationEngine.generateRecommendations()
  ↓
Analyze event parameters
  ↓
Generate service list with priorities
  ↓
Save to event_recommendations table
  ↓
Return recommendations to frontend
```

### Checkout Flow

```
User clicks "Proceed to Checkout"
  ↓
POST /api/events/checkout
  ↓
eventController.checkout()
  ↓
Fetch cart items
  ↓
VendorMatching.matchMultipleVendors()
  ↓
For each service:
  - Find available vendors
  - Filter by quantity/availability
  - Score vendors
  - Select best match
  ↓
Create event_services records
  ↓
Update event status to 'booked'
  ↓
Clear cart
  ↓
Return booking confirmation
```

### Vetting Flow

```
User adds guests and clicks "Verify Guests"
  ↓
POST /api/vetting/check-guests
  ↓
vettingController.checkGuests()
  ↓
VettingEngine.checkGuests()
  ↓
For each guest:
  - Query celebrity_history
  - Calculate statistics
  - Determine verification
  ↓
Return vetting results
```

## Key Algorithms

### Celebrity Vetting Algorithm

```javascript
1. For each guest name:
   a. Query celebrity_history WHERE celebrity_name = name AND city_id = city
   b. Calculate:
      - previous_events_count
      - avg_attendance = mean(actual_attendees)
      - max_attendance = max(actual_attendees)
   c. Determine is_realistic:
      - expected_attendees <= max_attendance * 1.5
   d. Determine is_verified:
      - previous_events_count >= 2 AND is_realistic
   e. Generate notes with statistics
2. Return results array with summary
```

### Service Recommendation Algorithm

```javascript
1. Determine attendee_tier (small/medium/large)
2. Always recommend:
   - Event Center (1)
   - Chairs (expected_attendees * 1.1)
3. If hosts/guests > 0:
   - Sound System (1-2 based on tier)
   - Microphones (max(hosts, 2))
4. If large event:
   - Tents (1-2)
5. If requires_ticketing:
   - Ticketing Service (1)
6. Calculate security_count:
   - <50: 2, <200: 4, <500: 6, <1000: 10, else: attendees/100
7. Always recommend:
   - Catering (attendees * 1.1)
   - Licensing Consultant (1)
8. If large event with guests:
   - Fireworks (optional)
9. If not small:
   - Event Consultant
10. Return recommendations with priorities
```

### Vendor Matching Algorithm

```javascript
1. For each service in cart:
   a. Query vendor_services WHERE service_type_id = service_id
   b. Filter by:
      - is_active = true
      - quantity >= min_quantity
      - quantity <= max_quantity
   c. Get vendor details WHERE id IN vendor_ids AND is_verified = true
   d. Filter by availability dates if provided
   e. Score each vendor:
      - +50 if verified
      - +30 if same city
      - +rating * 10
      - +price_score (inverse of price)
   f. Sort by score descending
   g. Select top vendor
2. Validate all services matched
3. Return matches or error
```

## Security Considerations

1. **Authentication**
   - JWT tokens with 7-day expiration
   - Password hashing with bcrypt (10 rounds)
   - Protected routes require valid token

2. **Authorization**
   - Users can only access their own events
   - Vendor registration requires authentication
   - Service matching only shows verified vendors

3. **Data Validation**
   - Input validation on all endpoints
   - SQL injection prevention via Supabase client
   - Type checking for numeric fields

4. **Error Handling**
   - Graceful error messages
   - No sensitive data in error responses
   - Logging for debugging

## Scalability Considerations

1. **Database**
   - Indexes on frequently queried columns
   - Foreign key constraints for data integrity
   - UUID primary keys for distributed systems

2. **API**
   - Stateless design (JWT tokens)
   - Horizontal scaling possible
   - Caching opportunities for service types/cities

3. **Frontend**
   - Code splitting with React Router
   - Lazy loading for large components
   - Optimistic UI updates

## Future Enhancements

1. **Real-time Updates**
   - WebSocket support for live event updates
   - Push notifications for booking confirmations

2. **Advanced Features**
   - Payment processing integration
   - Email notifications
   - Calendar integration
   - Multi-language support

3. **Analytics**
   - Event analytics dashboard
   - Vendor performance metrics
   - Recommendation accuracy tracking

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

## Performance Optimizations

1. **Database**
   - Add indexes for common queries
   - Use connection pooling
   - Implement query result caching

2. **API**
   - Rate limiting
   - Request batching
   - Response compression

3. **Frontend**
   - Image optimization
   - Code minification
   - CDN for static assets

