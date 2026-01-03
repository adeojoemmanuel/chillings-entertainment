-- Migration: Add Supabase auth support to users table
-- Run this migration to add social auth support

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);

-- Add comment
COMMENT ON COLUMN users.supabase_user_id IS 'Supabase Auth user ID for OAuth/social login';

