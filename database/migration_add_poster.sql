-- Migration: Add poster_url column to events table
-- Run this if the events table already exists and you need to add the poster_url column

-- Add poster_url column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN events.poster_url IS 'URL or path to event poster image';

