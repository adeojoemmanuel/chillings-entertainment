-- Migration: Add preferred_currency field to users table
-- This allows users to set their preferred currency which will be used across the app

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'USD';

-- Add comment
COMMENT ON COLUMN users.preferred_currency IS 'User preferred currency code (e.g., USD, EUR, GBP, NGN)';

