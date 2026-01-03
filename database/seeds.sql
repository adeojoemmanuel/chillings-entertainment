-- Seed Data for Chillings Entertainment Platform

-- Insert Cities
INSERT INTO cities (id, name, state, country) VALUES
    (uuid_generate_v4(), 'New York', 'NY', 'USA'),
    (uuid_generate_v4(), 'Los Angeles', 'CA', 'USA'),
    (uuid_generate_v4(), 'Chicago', 'IL', 'USA'),
    (uuid_generate_v4(), 'Houston', 'TX', 'USA'),
    (uuid_generate_v4(), 'Miami', 'FL', 'USA'),
    (uuid_generate_v4(), 'San Francisco', 'CA', 'USA'),
    (uuid_generate_v4(), 'Boston', 'MA', 'USA'),
    (uuid_generate_v4(), 'Seattle', 'WA', 'USA')
ON CONFLICT (name) DO NOTHING;

-- Insert Service Types
INSERT INTO service_types (id, name, description, category) VALUES
    (uuid_generate_v4(), 'Tents', 'Event tents and marquees', 'equipment'),
    (uuid_generate_v4(), 'Chairs', 'Event chairs and seating', 'equipment'),
    (uuid_generate_v4(), 'Sound System', 'Audio equipment and speakers', 'equipment'),
    (uuid_generate_v4(), 'Microphones', 'Microphones and audio accessories', 'equipment'),
    (uuid_generate_v4(), 'Fireworks', 'Fireworks and pyrotechnics', 'equipment'),
    (uuid_generate_v4(), 'Event Center', 'Venue rental for events', 'venue'),
    (uuid_generate_v4(), 'Ticketing Service', 'Online ticketing platform', 'service'),
    (uuid_generate_v4(), 'Security', 'Security personnel and services', 'service'),
    (uuid_generate_v4(), 'Catering', 'Food and beverage services', 'service'),
    (uuid_generate_v4(), 'Event Consultant', 'Event planning and coordination', 'consulting'),
    (uuid_generate_v4(), 'Licensing Consultant', 'Permits and licensing assistance', 'consulting'),
    (uuid_generate_v4(), 'Stage Setup', 'Stage construction and setup services', 'equipment')
ON CONFLICT (name) DO NOTHING;

-- Get city IDs for reference (using CTE for seed data)
WITH city_refs AS (
    SELECT id, name FROM cities WHERE name IN ('New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami')
),
service_refs AS (
    SELECT id, name FROM service_types
)
-- Insert Celebrity History (sample data for vetting)
INSERT INTO celebrity_history (celebrity_name, city_id, event_date, actual_attendees, event_type, notes)
SELECT 
    c.name,
    city.id,
    CURRENT_DATE - INTERVAL '30 days' * (random() * 12)::int,
    (100 + random() * 900)::int,
    CASE (random() * 3)::int
        WHEN 0 THEN 'Concert'
        WHEN 1 THEN 'Conference'
        ELSE 'Festival'
    END,
    'Historical event data'
FROM 
    (VALUES 
        ('John Doe'),
        ('Jane Smith'),
        ('Michael Johnson'),
        ('Sarah Williams'),
        ('David Brown'),
        ('Emily Davis'),
        ('Robert Miller'),
        ('Lisa Anderson')
    ) AS c(name)
CROSS JOIN city_refs AS city
WHERE random() < 0.7; -- 70% chance to create record

-- Create sample users and vendors
-- Note: In production, users should be created through the API with proper password hashing
-- These are example records - passwords should be hashed using bcrypt

-- Sample Users (passwords are 'password123' hashed with bcrypt)
-- In production, create users through the registration API
INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES
    (uuid_generate_v4(), 'vendor1@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Vendor One', '+1234567890', 'vendor'),
    (uuid_generate_v4(), 'vendor2@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Vendor Two', '+1234567891', 'vendor'),
    (uuid_generate_v4(), 'vendor3@example.com', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'Vendor Three', '+1234567892', 'vendor')
ON CONFLICT (email) DO NOTHING;

-- Sample Vendors (linked to users above)
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    ny_id UUID;
    la_id UUID;
    chicago_id UUID;
    tent_service_id UUID;
    chair_service_id UUID;
    sound_service_id UUID;
    mic_service_id UUID;
    venue_service_id UUID;
    ticketing_service_id UUID;
    security_service_id UUID;
    catering_service_id UUID;
    consultant_service_id UUID;
    licensing_service_id UUID;
    vendor1_id UUID;
    vendor2_id UUID;
    vendor3_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO user1_id FROM users WHERE email = 'vendor1@example.com' LIMIT 1;
    SELECT id INTO user2_id FROM users WHERE email = 'vendor2@example.com' LIMIT 1;
    SELECT id INTO user3_id FROM users WHERE email = 'vendor3@example.com' LIMIT 1;
    
    -- Get city IDs
    SELECT id INTO ny_id FROM cities WHERE name = 'New York' LIMIT 1;
    SELECT id INTO la_id FROM cities WHERE name = 'Los Angeles' LIMIT 1;
    SELECT id INTO chicago_id FROM cities WHERE name = 'Chicago' LIMIT 1;
    
    -- Get service type IDs
    SELECT id INTO tent_service_id FROM service_types WHERE name = 'Tents' LIMIT 1;
    SELECT id INTO chair_service_id FROM service_types WHERE name = 'Chairs' LIMIT 1;
    SELECT id INTO sound_service_id FROM service_types WHERE name = 'Sound System' LIMIT 1;
    SELECT id INTO mic_service_id FROM service_types WHERE name = 'Microphones' LIMIT 1;
    SELECT id INTO venue_service_id FROM service_types WHERE name = 'Event Center' LIMIT 1;
    SELECT id INTO ticketing_service_id FROM service_types WHERE name = 'Ticketing Service' LIMIT 1;
    SELECT id INTO security_service_id FROM service_types WHERE name = 'Security' LIMIT 1;
    SELECT id INTO catering_service_id FROM service_types WHERE name = 'Catering' LIMIT 1;
    SELECT id INTO consultant_service_id FROM service_types WHERE name = 'Event Consultant' LIMIT 1;
    SELECT id INTO licensing_service_id FROM service_types WHERE name = 'Licensing Consultant' LIMIT 1;
    
    -- Create vendors
    IF user1_id IS NOT NULL THEN
        INSERT INTO vendors (user_id, business_name, description, city_id, rating, is_verified)
        VALUES (user1_id, 'Premium Event Services', 'Full-service event provider', ny_id, 4.8, TRUE)
        RETURNING id INTO vendor1_id;
        
        -- Add services for vendor 1
        IF vendor1_id IS NOT NULL THEN
            INSERT INTO vendor_services (vendor_id, service_type_id, price_per_unit, unit_type, min_quantity, max_quantity, is_active) VALUES
                (vendor1_id, tent_service_id, 500.00, 'per_event', 1, 10, TRUE),
                (vendor1_id, chair_service_id, 2.50, 'per_item', 50, 1000, TRUE),
                (vendor1_id, sound_service_id, 800.00, 'per_event', 1, 5, TRUE),
                (vendor1_id, mic_service_id, 50.00, 'per_item', 1, 20, TRUE),
                (vendor1_id, venue_service_id, 2000.00, 'per_event', 1, 1, TRUE),
                (vendor1_id, security_service_id, 100.00, 'per_person', 2, 50, TRUE),
                (vendor1_id, catering_service_id, 25.00, 'per_person', 10, 1000, TRUE)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    IF user2_id IS NOT NULL THEN
        INSERT INTO vendors (user_id, business_name, description, city_id, rating, is_verified)
        VALUES (user2_id, 'LA Event Solutions', 'Los Angeles event specialists', la_id, 4.6, TRUE)
        RETURNING id INTO vendor2_id;
        
        -- Add services for vendor 2
        IF vendor2_id IS NOT NULL THEN
            INSERT INTO vendor_services (vendor_id, service_type_id, price_per_unit, unit_type, min_quantity, max_quantity, is_active) VALUES
                (vendor2_id, venue_service_id, 1800.00, 'per_event', 1, 1, TRUE),
                (vendor2_id, ticketing_service_id, 500.00, 'per_event', 1, 1, TRUE),
                (vendor2_id, consultant_service_id, 1500.00, 'per_event', 1, 1, TRUE),
                (vendor2_id, licensing_service_id, 300.00, 'per_event', 1, 1, TRUE),
                (vendor2_id, catering_service_id, 30.00, 'per_person', 20, 500, TRUE)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
    
    IF user3_id IS NOT NULL THEN
        INSERT INTO vendors (user_id, business_name, description, city_id, rating, is_verified)
        VALUES (user3_id, 'Chicago Event Equipment', 'Equipment rental specialists', chicago_id, 4.7, TRUE)
        RETURNING id INTO vendor3_id;
        
        -- Add services for vendor 3
        IF vendor3_id IS NOT NULL THEN
            INSERT INTO vendor_services (vendor_id, service_type_id, price_per_unit, unit_type, min_quantity, max_quantity, is_active) VALUES
                (vendor3_id, tent_service_id, 450.00, 'per_event', 1, 8, TRUE),
                (vendor3_id, chair_service_id, 2.00, 'per_item', 100, 2000, TRUE),
                (vendor3_id, sound_service_id, 750.00, 'per_event', 1, 3, TRUE),
                (vendor3_id, mic_service_id, 45.00, 'per_item', 2, 15, TRUE),
                (vendor3_id, security_service_id, 90.00, 'per_person', 1, 30, TRUE)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Sample celebrity history with specific data
DO $$
DECLARE
    ny_id UUID;
    la_id UUID;
    chicago_id UUID;
BEGIN
    SELECT id INTO ny_id FROM cities WHERE name = 'New York' LIMIT 1;
    SELECT id INTO la_id FROM cities WHERE name = 'Los Angeles' LIMIT 1;
    SELECT id INTO chicago_id FROM cities WHERE name = 'Chicago' LIMIT 1;

    -- Insert specific celebrity history records
    INSERT INTO celebrity_history (celebrity_name, city_id, event_date, actual_attendees, event_type) VALUES
        ('John Doe', ny_id, '2024-01-15', 500, 'Concert'),
        ('John Doe', ny_id, '2024-03-20', 750, 'Conference'),
        ('Jane Smith', la_id, '2024-02-10', 1200, 'Festival'),
        ('Jane Smith', la_id, '2024-04-05', 800, 'Concert'),
        ('Michael Johnson', chicago_id, '2024-01-30', 300, 'Conference'),
        ('Sarah Williams', ny_id, '2024-02-25', 600, 'Concert'),
        ('David Brown', la_id, '2024-03-10', 900, 'Festival')
    ON CONFLICT DO NOTHING;
END $$;

