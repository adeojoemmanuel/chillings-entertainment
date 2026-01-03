-- Seed Data for Chillings Entertainment Platform - Sponsors & Affiliates
-- This file contains mock data for the sponsors table

-- Clear existing sponsor data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE sponsors CASCADE;

-- Insert mock sponsors with various sponsorship levels
INSERT INTO sponsors (company_name, contact_name, email, phone, website, description, logo_url, sponsorship_level, status, created_at) VALUES

-- Platinum Sponsors (Top tier)
('TechCorp Global', 'Sarah Johnson', 'sarah.johnson@techcorp.com', '+1-555-0101', 'https://www.techcorp.com', 'Leading technology solutions provider specializing in event management software and digital infrastructure. We power seamless event experiences through innovative technology.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop&crop=center', 'platinum', 'approved', NOW() - INTERVAL '30 days'),

('EventPro Solutions', 'Michael Chen', 'michael.chen@eventpro.com', '+1-555-0102', 'https://www.eventpro.com', 'Premier event management company with over 20 years of experience. We specialize in large-scale corporate events, conferences, and entertainment shows.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center', 'platinum', 'approved', NOW() - INTERVAL '25 days'),

('Global Entertainment Group', 'Emma Williams', 'emma.williams@geg.com', '+1-555-0103', 'https://www.geg.com', 'International entertainment conglomerate producing world-class concerts, festivals, and live performances. Connecting artists with audiences worldwide.', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop&crop=center', 'platinum', 'approved', NOW() - INTERVAL '20 days'),

-- Gold Sponsors
('Sound & Vision Systems', 'David Martinez', 'david.martinez@svsystems.com', '+1-555-0201', 'https://www.svsystems.com', 'Professional audio-visual equipment rental and installation services. We provide state-of-the-art sound systems, lighting, and video equipment for events of all sizes.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center', 'gold', 'approved', NOW() - INTERVAL '18 days'),

('Catering Excellence', 'Lisa Anderson', 'lisa.anderson@cateringex.com', '+1-555-0202', 'https://www.cateringex.com', 'Award-winning catering services for corporate events, weddings, and special occasions. We create memorable culinary experiences with locally sourced ingredients.', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop&crop=center', 'gold', 'approved', NOW() - INTERVAL '15 days'),

('Venue Masters International', 'Robert Taylor', 'robert.taylor@venuemasters.com', '+1-555-0203', 'https://www.venuemasters.com', 'Premier venue management company offering exclusive access to luxury event spaces, convention centers, and unique locations worldwide.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop&crop=center', 'gold', 'approved', NOW() - INTERVAL '12 days'),

('Security First Services', 'Jennifer Brown', 'jennifer.brown@securityfirst.com', '+1-555-0204', 'https://www.securityfirst.com', 'Professional event security and crowd management services. We ensure safe and secure environments for all types of events with trained security personnel.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=400&fit=crop&crop=center', 'gold', 'approved', NOW() - INTERVAL '10 days'),

-- Silver Sponsors
('Creative Marketing Agency', 'James Wilson', 'james.wilson@creativemarketing.com', '+1-555-0301', 'https://www.creativemarketing.com', 'Full-service marketing agency specializing in event promotion, social media management, and brand activation. We help events reach their target audience effectively.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center', 'silver', 'approved', NOW() - INTERVAL '8 days'),

('Transportation Solutions', 'Patricia Davis', 'patricia.davis@transportsolutions.com', '+1-555-0302', 'https://www.transportsolutions.com', 'Premium transportation services for events including shuttle buses, luxury vehicles, and VIP transportation. We ensure smooth logistics for attendees.', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop&crop=center', 'silver', 'approved', NOW() - INTERVAL '7 days'),

('Photography & Videography Pro', 'Christopher Lee', 'chris.lee@photovideopro.com', '+1-555-0303', 'https://www.photovideopro.com', 'Professional event photography and videography services. We capture every moment with high-quality equipment and experienced photographers.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center', 'silver', 'approved', NOW() - INTERVAL '6 days'),

('Floral Design Studio', 'Amanda Garcia', 'amanda.garcia@floralstudio.com', '+1-555-0304', 'https://www.floralstudio.com', 'Elegant floral arrangements and event decoration services. We create stunning visual experiences with fresh flowers and creative design concepts.', 'https://images.unsplash.com/photo-1516048015610-7f3b4c0a0e36?w=400&h=400&fit=crop&crop=center', 'silver', 'approved', NOW() - INTERVAL '5 days'),

('Stage & Set Design Co.', 'Daniel Rodriguez', 'daniel.rodriguez@stagedesign.com', '+1-555-0305', 'https://www.stagedesign.com', 'Custom stage design and set construction for concerts, conferences, and theatrical productions. We bring creative visions to life with professional craftsmanship.', 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop&crop=center', 'silver', 'approved', NOW() - INTERVAL '4 days'),

-- Bronze Sponsors
('Print & Branding Solutions', 'Michelle White', 'michelle.white@printbranding.com', '+1-555-0401', 'https://www.printbranding.com', 'Complete printing and branding services including banners, signage, promotional materials, and custom merchandise for events.', 'https://images.unsplash.com/photo-1586075010923-a2fda4734c3e?w=400&h=400&fit=crop&crop=center', 'bronze', 'approved', NOW() - INTERVAL '3 days'),

('Event Insurance Partners', 'Kevin Moore', 'kevin.moore@eventinsurance.com', '+1-555-0402', 'https://www.eventinsurance.com', 'Specialized insurance coverage for events including liability, cancellation, and equipment protection. We provide peace of mind for event organizers.', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop&crop=center', 'bronze', 'approved', NOW() - INTERVAL '2 days'),

('Ticketing Platform Pro', 'Nicole Jackson', 'nicole.jackson@ticketingpro.com', '+1-555-0403', 'https://www.ticketingpro.com', 'Advanced ticketing and registration platform with real-time analytics, QR code scanning, and seamless payment processing for events.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center', 'bronze', 'approved', NOW() - INTERVAL '1 day'),

('Waste Management Services', 'Brian Thompson', 'brian.thompson@wastemgmt.com', '+1-555-0404', 'https://www.wastemgmt.com', 'Eco-friendly waste management and recycling services for events. We help events maintain sustainability standards with responsible waste disposal.', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=400&fit=crop&crop=center', 'bronze', 'approved', NOW() - INTERVAL '12 hours'),

-- Partner Sponsors
('Local Media Network', 'Rachel Harris', 'rachel.harris@localmedia.com', '+1-555-0501', 'https://www.localmedia.com', 'Regional media partner providing event coverage, advertising, and promotional support through radio, television, and digital platforms.', 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=400&fit=crop&crop=center', 'partner', 'approved', NOW() - INTERVAL '6 hours'),

('Community Foundation', 'Thomas Clark', 'thomas.clark@communityfoundation.com', '+1-555-0502', 'https://www.communityfoundation.com', 'Non-profit organization supporting local events and community initiatives. We foster connections and promote cultural activities in our region.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=400&fit=crop&crop=center', 'partner', 'approved', NOW() - INTERVAL '3 hours'),

('Event Volunteers Network', 'Stephanie Lewis', 'stephanie.lewis@volunteers.com', '+1-555-0503', 'https://www.volunteers.com', 'Volunteer recruitment and management platform connecting event organizers with dedicated volunteers. We help events run smoothly with passionate support.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=center', 'partner', 'approved', NOW() - INTERVAL '1 hour'),

-- Pending Applications (for testing)
('New Tech Startup', 'Alex Turner', 'alex.turner@newtech.com', '+1-555-0601', 'https://www.newtech.com', 'Innovative startup offering AI-powered event analytics and attendee engagement tools. We are seeking partnership opportunities to showcase our technology.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop&crop=center', 'bronze', 'pending', NOW() - INTERVAL '30 minutes'),

('Green Events Initiative', 'Maria Green', 'maria.green@greenevents.com', '+1-555-0602', 'https://www.greenevents.com', 'Sustainability-focused organization promoting eco-friendly event practices. We provide consulting and certification services for green events.', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop&crop=center', 'silver', 'pending', NOW() - INTERVAL '15 minutes');

-- Note: Logo URLs use Unsplash images for demonstration
-- These are high-quality stock images related to each sponsor's industry
-- In production, replace these with actual sponsor logo URLs from your CDN or storage service

