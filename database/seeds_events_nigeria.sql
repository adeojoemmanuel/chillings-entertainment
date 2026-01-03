-- Seed Data for Chillings Entertainment Platform - Nigerian Cities (Extended) and Mock Events
-- This file contains major Nigerian cities and sample events

-- Insert Major Nigerian Cities (including state capitals and major commercial cities)
INSERT INTO cities (id, name, state, country) VALUES
    -- State Capitals
    (uuid_generate_v4(), 'Abuja', 'FCT', 'Nigeria'),
    (uuid_generate_v4(), 'Abeokuta', 'Ogun', 'Nigeria'),
    (uuid_generate_v4(), 'Abakaliki', 'Ebonyi', 'Nigeria'),
    (uuid_generate_v4(), 'Ado-Ekiti', 'Ekiti', 'Nigeria'),
    (uuid_generate_v4(), 'Akure', 'Ondo', 'Nigeria'),
    (uuid_generate_v4(), 'Asaba', 'Delta', 'Nigeria'),
    (uuid_generate_v4(), 'Awka', 'Anambra', 'Nigeria'),
    (uuid_generate_v4(), 'Bauchi', 'Bauchi', 'Nigeria'),
    (uuid_generate_v4(), 'Benin City', 'Edo', 'Nigeria'),
    (uuid_generate_v4(), 'Birnin Kebbi', 'Kebbi', 'Nigeria'),
    (uuid_generate_v4(), 'Calabar', 'Cross River', 'Nigeria'),
    (uuid_generate_v4(), 'Damaturu', 'Yobe', 'Nigeria'),
    (uuid_generate_v4(), 'Dutse', 'Jigawa', 'Nigeria'),
    (uuid_generate_v4(), 'Enugu', 'Enugu', 'Nigeria'),
    (uuid_generate_v4(), 'Gombe', 'Gombe', 'Nigeria'),
    (uuid_generate_v4(), 'Gusau', 'Zamfara', 'Nigeria'),
    (uuid_generate_v4(), 'Ibadan', 'Oyo', 'Nigeria'),
    (uuid_generate_v4(), 'Ikeja', 'Lagos', 'Nigeria'),
    (uuid_generate_v4(), 'Ilorin', 'Kwara', 'Nigeria'),
    (uuid_generate_v4(), 'Jalingo', 'Taraba', 'Nigeria'),
    (uuid_generate_v4(), 'Jos', 'Plateau', 'Nigeria'),
    (uuid_generate_v4(), 'Kaduna', 'Kaduna', 'Nigeria'),
    (uuid_generate_v4(), 'Kano', 'Kano', 'Nigeria'),
    (uuid_generate_v4(), 'Katsina', 'Katsina', 'Nigeria'),
    (uuid_generate_v4(), 'Lafia', 'Nasarawa', 'Nigeria'),
    (uuid_generate_v4(), 'Lokoja', 'Kogi', 'Nigeria'),
    (uuid_generate_v4(), 'Maiduguri', 'Borno', 'Nigeria'),
    (uuid_generate_v4(), 'Makurdi', 'Benue', 'Nigeria'),
    (uuid_generate_v4(), 'Minna', 'Niger', 'Nigeria'),
    (uuid_generate_v4(), 'Owerri', 'Imo', 'Nigeria'),
    (uuid_generate_v4(), 'Oyo', 'Oyo', 'Nigeria'),
    (uuid_generate_v4(), 'Port Harcourt', 'Rivers', 'Nigeria'),
    (uuid_generate_v4(), 'Sokoto', 'Sokoto', 'Nigeria'),
    (uuid_generate_v4(), 'Umuahia', 'Abia', 'Nigeria'),
    (uuid_generate_v4(), 'Uyo', 'Akwa Ibom', 'Nigeria'),
    (uuid_generate_v4(), 'Yenagoa', 'Bayelsa', 'Nigeria'),
    (uuid_generate_v4(), 'Yola', 'Adamawa', 'Nigeria'),
    -- Major Commercial Cities
    (uuid_generate_v4(), 'Lagos', 'Lagos', 'Nigeria'),
    (uuid_generate_v4(), 'Warri', 'Delta', 'Nigeria'),
    (uuid_generate_v4(), 'Onitsha', 'Anambra', 'Nigeria'),
    (uuid_generate_v4(), 'Aba', 'Abia', 'Nigeria'),
    (uuid_generate_v4(), 'Ikorodu', 'Lagos', 'Nigeria'),
    (uuid_generate_v4(), 'Abeokuta', 'Ogun', 'Nigeria'),
    (uuid_generate_v4(), 'Ogbomoso', 'Oyo', 'Nigeria'),
    (uuid_generate_v4(), 'Zaria', 'Kaduna', 'Nigeria'),
    (uuid_generate_v4(), 'Ilesa', 'Osun', 'Nigeria'),
    (uuid_generate_v4(), 'Osogbo', 'Osun', 'Nigeria'),
    (uuid_generate_v4(), 'Ife', 'Osun', 'Nigeria'),
    (uuid_generate_v4(), 'Ado-Ekiti', 'Ekiti', 'Nigeria'),
    (uuid_generate_v4(), 'Ikot Ekpene', 'Akwa Ibom', 'Nigeria'),
    (uuid_generate_v4(), 'Ugep', 'Cross River', 'Nigeria')
ON CONFLICT (name) DO NOTHING;

-- Create sample events with Nigerian cities
-- Note: This assumes you have at least one user in the database
-- You should create a user first through the registration API or manually

DO $$
DECLARE
    -- City IDs
    lagos_id UUID;
    abuja_id UUID;
    kano_id UUID;
    port_harcourt_id UUID;
    ibadan_id UUID;
    kaduna_id UUID;
    benin_id UUID;
    calabar_id UUID;
    enugu_id UUID;
    jos_id UUID;
    -- Service Type IDs
    tent_service_id UUID;
    chair_service_id UUID;
    sound_service_id UUID;
    mic_service_id UUID;
    venue_service_id UUID;
    ticketing_service_id UUID;
    security_service_id UUID;
    catering_service_id UUID;
    -- Sample user ID (will use first user or create one)
    sample_user_id UUID;
    -- Event IDs for linking
    event1_id UUID;
    event2_id UUID;
    event3_id UUID;
BEGIN
    -- Get city IDs
    SELECT id INTO lagos_id FROM cities WHERE name = 'Lagos' LIMIT 1;
    SELECT id INTO abuja_id FROM cities WHERE name = 'Abuja' LIMIT 1;
    SELECT id INTO kano_id FROM cities WHERE name = 'Kano' LIMIT 1;
    SELECT id INTO port_harcourt_id FROM cities WHERE name = 'Port Harcourt' LIMIT 1;
    SELECT id INTO ibadan_id FROM cities WHERE name = 'Ibadan' LIMIT 1;
    SELECT id INTO kaduna_id FROM cities WHERE name = 'Kaduna' LIMIT 1;
    SELECT id INTO benin_id FROM cities WHERE name = 'Benin City' LIMIT 1;
    SELECT id INTO calabar_id FROM cities WHERE name = 'Calabar' LIMIT 1;
    SELECT id INTO enugu_id FROM cities WHERE name = 'Enugu' LIMIT 1;
    SELECT id INTO jos_id FROM cities WHERE name = 'Jos' LIMIT 1;
    
    -- Get service type IDs
    SELECT id INTO tent_service_id FROM service_types WHERE name = 'Tents' LIMIT 1;
    SELECT id INTO chair_service_id FROM service_types WHERE name = 'Chairs' LIMIT 1;
    SELECT id INTO sound_service_id FROM service_types WHERE name = 'Sound System' LIMIT 1;
    SELECT id INTO mic_service_id FROM service_types WHERE name = 'Microphones' LIMIT 1;
    SELECT id INTO venue_service_id FROM service_types WHERE name = 'Event Center' LIMIT 1;
    SELECT id INTO ticketing_service_id FROM service_types WHERE name = 'Ticketing Service' LIMIT 1;
    SELECT id INTO security_service_id FROM service_types WHERE name = 'Security' LIMIT 1;
    SELECT id INTO catering_service_id FROM service_types WHERE name = 'Catering' LIMIT 1;
    
    -- Get or create a sample user (use first user if exists, otherwise skip events)
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Only create events if we have a user and cities
    IF sample_user_id IS NOT NULL AND lagos_id IS NOT NULL THEN
        -- Event 1: Lagos Music Festival
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Lagos Music Festival 2024',
            'The biggest music festival in West Africa featuring top Nigerian and international artists. Experience live performances, food vendors, and amazing entertainment.',
            NOW() + INTERVAL '30 days',
            lagos_id,
            'Tafawa Balewa Square',
            'concert',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            true,
            true,
            5000,
            3,
            5,
            'recommended'
        ) RETURNING id INTO event1_id;
        
        -- Add guests for event 1
        IF event1_id IS NOT NULL THEN
            INSERT INTO event_guests (event_id, guest_name, is_verified) VALUES
                (event1_id, 'Burna Boy', true),
                (event1_id, 'Wizkid', true),
                (event1_id, 'Davido', true),
                (event1_id, 'Tiwa Savage', true),
                (event1_id, 'Asake', false)
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Event 2: Abuja Business Conference
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Abuja Business Summit 2024',
            'Annual business conference bringing together entrepreneurs, investors, and industry leaders. Network, learn, and grow your business.',
            NOW() + INTERVAL '45 days',
            abuja_id,
            'International Conference Centre',
            'conference',
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            true,
            true,
            1000,
            2,
            0,
            'draft'
        ) RETURNING id INTO event2_id;
        
        -- Event 3: Kano Cultural Festival
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Kano Durbar Festival',
            'Traditional cultural festival showcasing the rich heritage of Northern Nigeria. Experience traditional music, dance, and horse riding displays.',
            NOW() + INTERVAL '60 days',
            kano_id,
            'Emir Palace Grounds',
            'festival',
            'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
            false,
            false,
            3000,
            1,
            2,
            'recommended'
        ) RETURNING id INTO event3_id;
        
        -- Add guests for event 3
        IF event3_id IS NOT NULL THEN
            INSERT INTO event_guests (event_id, guest_name, is_verified) VALUES
                (event3_id, 'Emir of Kano', true),
                (event3_id, 'Traditional Dancers Group', true)
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Event 4: Port Harcourt Tech Expo
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Port Harcourt Tech Expo 2024',
            'Technology exhibition and conference featuring startups, innovators, and tech companies. Discover the latest in Nigerian tech innovation.',
            NOW() + INTERVAL '20 days',
            port_harcourt_id,
            'Port Harcourt Civic Centre',
            'conference',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
            true,
            true,
            800,
            2,
            0,
            'booked'
        );
        
        -- Event 5: Ibadan Food Festival
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Ibadan Food & Culture Festival',
            'Celebrate Nigerian cuisine and culture. Taste traditional dishes, watch cooking demonstrations, and enjoy live cultural performances.',
            NOW() + INTERVAL '25 days',
            ibadan_id,
            'Agodi Gardens',
            'festival',
            'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
            false,
            false,
            2000,
            1,
            0,
            'recommended'
        );
        
        -- Event 6: Kaduna Fashion Week
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Kaduna Fashion Week',
            'Premier fashion event showcasing Nigerian designers and models. Runway shows, exhibitions, and networking opportunities.',
            NOW() + INTERVAL '35 days',
            kaduna_id,
            'Kaduna State Stadium',
            'other',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            true,
            true,
            1500,
            2,
            3,
            'draft'
        );
        
        -- Event 7: Benin City Art Exhibition
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Benin City Art & Culture Exhibition',
            'Showcasing contemporary and traditional Nigerian art. Featuring works from local and international artists.',
            NOW() + INTERVAL '40 days',
            benin_id,
            'National Museum',
            'other',
            'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
            false,
            false,
            500,
            1,
            0,
            'recommended'
        );
        
        -- Event 8: Calabar Carnival
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Calabar Carnival 2024',
            'Africa''s biggest street party! Join thousands in colorful costumes, music, and celebration. A month-long festival of culture and entertainment.',
            NOW() + INTERVAL '50 days',
            calabar_id,
            'Calabar Stadium',
            'festival',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            false,
            false,
            10000,
            5,
            10,
            'recommended'
        );
        
        -- Event 9: Enugu Comedy Show
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Enugu Comedy Night',
            'Laugh out loud with Nigeria''s funniest comedians. An evening of non-stop laughter and entertainment.',
            NOW() + INTERVAL '15 days',
            enugu_id,
            'Nnamdi Azikiwe Stadium',
            'concert',
            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
            true,
            true,
            2000,
            1,
            5,
            'draft'
        );
        
        -- Event 10: Jos Film Festival
        INSERT INTO events (
            id, user_id, title, description, event_date, city_id, area,
            event_type, poster_url, is_paid, requires_ticketing, expected_attendees,
            number_of_hosts, number_of_guests, status
        ) VALUES (
            uuid_generate_v4(),
            sample_user_id,
            'Jos International Film Festival',
            'Celebrating Nigerian cinema and international films. Screenings, workshops, and awards ceremony.',
            NOW() + INTERVAL '55 days',
            jos_id,
            'Jos Cultural Centre',
            'other',
            'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
            true,
            true,
            1200,
            2,
            0,
            'recommended'
        );
        
        -- Add recommendations for event 1 (Lagos Music Festival)
        IF event1_id IS NOT NULL AND tent_service_id IS NOT NULL THEN
            INSERT INTO event_recommendations (event_id, service_type_id, quantity, priority, reason) VALUES
                (event1_id, venue_service_id, 1, 0, 'Large outdoor venue required for 5000 attendees'),
                (event1_id, sound_service_id, 3, 0, 'Multiple sound systems needed for main stage and side stages'),
                (event1_id, tent_service_id, 5, 1, 'Tents recommended for VIP areas and food vendors'),
                (event1_id, chair_service_id, 2000, 1, 'Seating for VIP and reserved sections'),
                (event1_id, security_service_id, 50, 0, 'Security required for large crowd management'),
                (event1_id, catering_service_id, 1, 1, 'Food vendors and catering services'),
                (event1_id, ticketing_service_id, 1, 0, 'Online ticketing platform required')
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Add recommendations for event 2 (Abuja Business Conference)
        IF event2_id IS NOT NULL THEN
            INSERT INTO event_recommendations (event_id, service_type_id, quantity, priority, reason) VALUES
                (event2_id, venue_service_id, 1, 0, 'Conference center with meeting rooms'),
                (event2_id, sound_service_id, 1, 0, 'Sound system for presentations'),
                (event2_id, mic_service_id, 10, 0, 'Microphones for speakers and Q&A sessions'),
                (event2_id, chair_service_id, 1000, 0, 'Seating for all attendees'),
                (event2_id, catering_service_id, 1, 1, 'Coffee breaks and lunch catering'),
                (event2_id, security_service_id, 10, 1, 'Security for VIP attendees')
            ON CONFLICT DO NOTHING;
        END IF;
        
        -- Add recommendations for event 3 (Kano Durbar)
        IF event3_id IS NOT NULL THEN
            INSERT INTO event_recommendations (event_id, service_type_id, quantity, priority, reason) VALUES
                (event3_id, tent_service_id, 10, 1, 'Tents for viewing areas and refreshments'),
                (event3_id, chair_service_id, 1000, 1, 'Seating for spectators'),
                (event3_id, sound_service_id, 2, 1, 'Sound system for announcements and music'),
                (event3_id, security_service_id, 30, 0, 'Security for crowd control'),
                (event3_id, catering_service_id, 1, 2, 'Food and refreshment vendors')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Add celebrity history for vetting system
DO $$
DECLARE
    lagos_id UUID;
    abuja_id UUID;
    kano_id UUID;
    port_harcourt_id UUID;
    ibadan_id UUID;
BEGIN
    SELECT id INTO lagos_id FROM cities WHERE name = 'Lagos' LIMIT 1;
    SELECT id INTO abuja_id FROM cities WHERE name = 'Abuja' LIMIT 1;
    SELECT id INTO kano_id FROM cities WHERE name = 'Kano' LIMIT 1;
    SELECT id INTO port_harcourt_id FROM cities WHERE name = 'Port Harcourt' LIMIT 1;
    SELECT id INTO ibadan_id FROM cities WHERE name = 'Ibadan' LIMIT 1;
    
    IF lagos_id IS NOT NULL THEN
        INSERT INTO celebrity_history (celebrity_name, city_id, event_date, actual_attendees, event_type, notes) VALUES
            ('Burna Boy', lagos_id, '2023-12-15', 8000, 'Concert', 'Sold out show at Tafawa Balewa Square'),
            ('Wizkid', lagos_id, '2023-11-20', 12000, 'Concert', 'Massive turnout, exceeded expectations'),
            ('Davido', lagos_id, '2023-10-10', 10000, 'Concert', 'Successful event with high attendance'),
            ('Tiwa Savage', lagos_id, '2023-09-05', 5000, 'Concert', 'Great performance, good crowd'),
            ('Asake', lagos_id, '2023-08-18', 6000, 'Concert', 'Rising star, growing fanbase')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF abuja_id IS NOT NULL THEN
        INSERT INTO celebrity_history (celebrity_name, city_id, event_date, actual_attendees, event_type, notes) VALUES
            ('Burna Boy', abuja_id, '2023-11-10', 4000, 'Concert', 'Good turnout in capital city'),
            ('Wizkid', abuja_id, '2023-09-25', 5000, 'Concert', 'Successful event')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF kano_id IS NOT NULL THEN
        INSERT INTO celebrity_history (celebrity_name, city_id, event_date, actual_attendees, event_type, notes) VALUES
            ('Emir of Kano', kano_id, '2023-12-01', 5000, 'Cultural Festival', 'Traditional durbar celebration'),
            ('Traditional Dancers Group', kano_id, '2023-11-15', 2000, 'Cultural Event', 'Cultural performance')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

