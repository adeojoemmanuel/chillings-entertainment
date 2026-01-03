-- Chillings Entertainment Platform Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cities table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Types catalog
CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50), -- 'venue', 'equipment', 'service', 'consulting'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Nullable for social auth users
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    supabase_user_id UUID UNIQUE, -- For Supabase OAuth/social login
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'vendor', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city_id UUID REFERENCES cities(id),
    rating DECIMAL(3,2) DEFAULT 0.0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor Services (many-to-many: vendors can offer multiple services)
CREATE TABLE vendor_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES service_types(id) ON DELETE CASCADE,
    price_per_unit DECIMAL(10,2),
    unit_type VARCHAR(50), -- 'per_event', 'per_hour', 'per_person', 'per_item'
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER,
    availability_start DATE,
    availability_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_id, service_type_id)
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    city_id UUID NOT NULL REFERENCES cities(id),
    area VARCHAR(100),
    event_type VARCHAR(50), -- 'sport', 'concert', 'wedding', 'conference', 'festival', 'other'
    poster_url TEXT, -- URL or path to event poster image
    hosting_website TEXT, -- URL to event hosting website
    is_paid BOOLEAN DEFAULT FALSE,
    requires_ticketing BOOLEAN DEFAULT FALSE,
    expected_attendees INTEGER NOT NULL,
    number_of_hosts INTEGER DEFAULT 1,
    number_of_guests INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_vetting', 'recommended', 'cart', 'booked', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Guests (invited celebrities/guests)
CREATE TABLE event_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Celebrity History (historical event data for vetting)
CREATE TABLE celebrity_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    celebrity_name VARCHAR(255) NOT NULL,
    city_id UUID NOT NULL REFERENCES cities(id),
    event_date DATE NOT NULL,
    actual_attendees INTEGER,
    event_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Recommendations (system-generated service recommendations)
CREATE TABLE event_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    quantity INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 0, -- 0=required, 1=recommended, 2=optional
    reason TEXT, -- Why this service was recommended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, service_type_id)
);

-- Event Cart (user's shopping cart)
CREATE TABLE event_cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, service_type_id)
);

-- Event Services (final booked services with vendor assignment)
CREATE TABLE event_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    service_type_id UUID NOT NULL REFERENCES service_types(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    vendor_service_id UUID REFERENCES vendor_services(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_city_id ON events(city_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_event_guests_event_id ON event_guests(event_id);
CREATE INDEX idx_vendor_services_vendor_id ON vendor_services(vendor_id);
CREATE INDEX idx_vendor_services_service_type_id ON vendor_services(service_type_id);
CREATE INDEX idx_event_recommendations_event_id ON event_recommendations(event_id);
CREATE INDEX idx_event_cart_event_id ON event_cart(event_id);
CREATE INDEX idx_event_services_event_id ON event_services(event_id);
CREATE INDEX idx_celebrity_history_name_city ON celebrity_history(celebrity_name, city_id);
CREATE INDEX idx_users_supabase_user_id ON users(supabase_user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

