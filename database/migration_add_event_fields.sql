-- Migration: Add poster_url and hosting_website columns to events table
-- Run this if the events table already exists and you need to add these columns

-- Add poster_url column to events table (if not exists)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- Add hosting_website column to events table (if not exists)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS hosting_website TEXT;

-- Add comments to the columns
COMMENT ON COLUMN events.poster_url IS 'URL or path to event poster image';
COMMENT ON COLUMN events.hosting_website IS 'URL to event hosting website';

