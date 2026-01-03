# Nigerian Events and Cities Seed Data

This file contains comprehensive seed data for the Chillings Entertainment platform, including:
- All major Nigerian cities (state capitals + commercial cities)
- 10 sample events across different Nigerian cities
- Event guests, recommendations, and celebrity history

## Files

- `seeds_events_nigeria.sql` - Complete seed data with cities and events

## Prerequisites

Before running this seed file, ensure you have:

1. **Service Types** - Run the service types seed from `seeds.sql`:
   ```sql
   -- Service types should include:
   -- Tents, Chairs, Sound System, Microphones, Event Center, 
   -- Ticketing Service, Security, Catering, etc.
   ```

2. **At least one user** - You need at least one user in the database. You can:
   - Register a user through the API
   - Or manually insert a user (with hashed password)

## How to Use

### Option 1: Using Supabase SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `seeds_events_nigeria.sql`
4. Click **Run** to execute

### Option 2: Using psql Command Line

```bash
psql -h your-supabase-host -U postgres -d postgres -f database/seeds_events_nigeria.sql
```

### Option 3: Using Supabase CLI

```bash
psql "your-connection-string" -f database/seeds_events_nigeria.sql
```

## What Gets Created

### Cities (50+ cities)
- All 36 state capitals
- Major commercial cities (Lagos, Warri, Onitsha, Aba, etc.)
- All set with `country = 'Nigeria'`

### Events (10 sample events)

1. **Lagos Music Festival 2024**
   - Location: Lagos, Tafawa Balewa Square
   - Attendees: 5,000
   - Status: Recommended
   - Guests: Burna Boy, Wizkid, Davido, Tiwa Savage, Asake
   - Poster: Music festival image

2. **Abuja Business Summit 2024**
   - Location: Abuja, International Conference Centre
   - Attendees: 1,000
   - Status: Draft
   - Poster: Business conference image

3. **Kano Durbar Festival**
   - Location: Kano, Emir Palace Grounds
   - Attendees: 3,000
   - Status: Recommended
   - Guests: Emir of Kano, Traditional Dancers Group
   - Poster: Cultural festival image

4. **Port Harcourt Tech Expo 2024**
   - Location: Port Harcourt, Civic Centre
   - Attendees: 800
   - Status: Booked
   - Poster: Tech conference image

5. **Ibadan Food & Culture Festival**
   - Location: Ibadan, Agodi Gardens
   - Attendees: 2,000
   - Status: Recommended
   - Poster: Food festival image

6. **Kaduna Fashion Week**
   - Location: Kaduna, State Stadium
   - Attendees: 1,500
   - Status: Draft
   - Guests: 3 fashion designers
   - Poster: Fashion show image

7. **Benin City Art & Culture Exhibition**
   - Location: Benin City, National Museum
   - Attendees: 500
   - Status: Recommended
   - Poster: Art exhibition image

8. **Calabar Carnival 2024**
   - Location: Calabar, Stadium
   - Attendees: 10,000
   - Status: Recommended
   - Guests: 10 performers
   - Poster: Carnival image

9. **Enugu Comedy Night**
   - Location: Enugu, Nnamdi Azikiwe Stadium
   - Attendees: 2,000
   - Status: Draft
   - Guests: 5 comedians
   - Poster: Comedy show image

10. **Jos International Film Festival**
    - Location: Jos, Cultural Centre
    - Attendees: 1,200
    - Status: Recommended
    - Poster: Film festival image

### Service Recommendations

Events include service recommendations such as:
- Venues
- Sound systems
- Tents
- Chairs
- Security
- Catering
- Ticketing services

### Celebrity History

Historical data for vetting system including:
- Burna Boy, Wizkid, Davido, Tiwa Savage, Asake events in Lagos
- Cultural events in Kano and Abuja
- Attendance records for vetting accuracy

## Notes

- **User Requirement**: Events are linked to the first user in your database. If no users exist, events won't be created.
- **Service Types**: Ensure service types are seeded first (from `seeds.sql`)
- **Poster URLs**: Events use placeholder Unsplash images. You can update these with actual poster URLs.
- **Dates**: Events are scheduled for future dates (15-60 days from now)
- **Conflict Handling**: Uses `ON CONFLICT DO NOTHING` to prevent duplicates

## Customization

You can modify the seed file to:
- Change event dates
- Add more events
- Update poster URLs
- Add more cities
- Modify event details

## Troubleshooting

### Events not created?
- Check if you have at least one user in the database
- Verify service types exist
- Check that cities were inserted successfully

### Duplicate errors?
- The seed file uses `ON CONFLICT DO NOTHING` to handle duplicates
- Safe to run multiple times

### Missing data?
- Ensure you run service types seed first
- Check that cities were inserted before events

## Next Steps

After seeding:
1. Log in to the application
2. View events in the dashboard
3. Test event recommendations
4. Test guest vetting functionality
5. Test vendor matching

