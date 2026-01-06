-- Migration: Add celebrity service requests table
-- This table stores requests from event planners to bring top celebrities to their events

CREATE TABLE IF NOT EXISTS celebrity_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional: link to existing event
    planner_name VARCHAR(255) NOT NULL,
    planner_email VARCHAR(255) NOT NULL,
    planner_phone VARCHAR(20),
    event_title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_location VARCHAR(255) NOT NULL,
    city_id UUID REFERENCES cities(id),
    event_type VARCHAR(50),
    expected_attendees INTEGER,
    budget_range VARCHAR(50), -- 'low', 'medium', 'high', 'premium'
    celebrity_preferences TEXT, -- Specific celebrities or types they want
    special_requirements TEXT, -- Any special requirements or notes
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'
    admin_notes TEXT,
    quoted_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_celebrity_requests_user_id ON celebrity_requests(user_id);
CREATE INDEX idx_celebrity_requests_event_id ON celebrity_requests(event_id);
CREATE INDEX idx_celebrity_requests_status ON celebrity_requests(status);
CREATE INDEX idx_celebrity_requests_created_at ON celebrity_requests(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_celebrity_requests_updated_at BEFORE UPDATE ON celebrity_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

