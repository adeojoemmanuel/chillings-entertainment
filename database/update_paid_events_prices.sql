-- SQL Query to update prices for some paid events
-- This will set prices for events that are marked as paid (is_paid = true)
-- You can adjust the prices and WHERE conditions as needed

-- Update a few paid events with different price ranges
UPDATE events 
SET price = CASE 
    -- Set different prices based on event type or random selection
    WHEN event_type = 'concert' THEN 75.00
    WHEN event_type = 'sport' THEN 50.00
    WHEN event_type = 'wedding' THEN 100.00
    WHEN event_type = 'conference' THEN 150.00
    WHEN event_type = 'festival' THEN 60.00
    ELSE 45.00
END,
    is_paid = true
WHERE is_paid = true 
  AND (price IS NULL OR price = 0)
  AND id IN (
    SELECT id FROM events 
    WHERE is_paid = true 
    ORDER BY created_at DESC 
    LIMIT 10  -- Update up to 10 events
  );

-- Alternative: Update all paid events with random prices between $20 and $200
-- Uncomment the query below if you want to use this instead:

/*
UPDATE events 
SET price = (
    20 + (RANDOM() * 180)::DECIMAL(10,2)
)
WHERE is_paid = true 
  AND (price IS NULL OR price = 0);
*/

-- Alternative: Set specific prices for specific events by ID
-- Replace the UUIDs with actual event IDs from your database:

/*
UPDATE events 
SET price = 99.99,
    is_paid = true
WHERE id = 'your-event-id-here'::uuid;

UPDATE events 
SET price = 149.50,
    is_paid = true
WHERE id = 'another-event-id-here'::uuid;
*/

-- View the updated events to verify:
SELECT 
    id,
    title,
    event_type,
    is_paid,
    price,
    expected_attendees,
    status,
    created_at
FROM events 
WHERE is_paid = true 
  AND price > 0
ORDER BY created_at DESC;

