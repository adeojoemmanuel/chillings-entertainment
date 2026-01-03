-- Migration: Add event_type column to events table
-- Run this migration to add event_type support to existing databases

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_type VARCHAR(50);

-- Add comment to document the column
COMMENT ON COLUMN events.event_type IS 'Type of event: sport, concert, wedding, conference, festival, other';

