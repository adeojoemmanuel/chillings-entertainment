-- Migration: Add price column to events table
-- This allows events to have a ticket price

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0;

-- Add comment
COMMENT ON COLUMN events.price IS 'Ticket price for the event (in USD by default, will be converted based on user preference)';

