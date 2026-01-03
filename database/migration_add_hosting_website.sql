-- Migration: Add hosting_website column to events table
-- Run this if the events table already exists and you need to add the hosting_website column

-- Add hosting_website column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS hosting_website TEXT;

-- Add comment to the column
COMMENT ON COLUMN events.hosting_website IS 'URL to event hosting website';

