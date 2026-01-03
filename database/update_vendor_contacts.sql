-- Update vendors with random mock emails and phone numbers
-- This script generates random contact information for vendors that don't have email/phone

-- Function to generate random email
CREATE OR REPLACE FUNCTION generate_random_email(business_name TEXT) RETURNS TEXT AS $$
DECLARE
    clean_name TEXT;
    random_num INTEGER;
    domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com', 'business.com', 'vendor.com'];
    domain TEXT;
BEGIN
    -- Clean business name (remove spaces, special chars, lowercase)
    clean_name := LOWER(REGEXP_REPLACE(business_name, '[^a-zA-Z0-9]', '', 'g'));
    
    -- Generate random number
    random_num := FLOOR(RANDOM() * 10000)::INTEGER;
    
    -- Pick random domain
    domain := domains[1 + FLOOR(RANDOM() * array_length(domains, 1))::INTEGER];
    
    -- Return email
    RETURN clean_name || random_num || '@' || domain;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random phone number
CREATE OR REPLACE FUNCTION generate_random_phone() RETURNS TEXT AS $$
DECLARE
    area_code INTEGER;
    exchange INTEGER;
    number_part INTEGER;
BEGIN
    -- Generate US phone number format: (XXX) XXX-XXXX
    area_code := 200 + FLOOR(RANDOM() * 800)::INTEGER; -- 200-999
    exchange := 200 + FLOOR(RANDOM() * 800)::INTEGER;  -- 200-999
    number_part := 1000 + FLOOR(RANDOM() * 9000)::INTEGER; -- 1000-9999
    
    RETURN '(' || area_code || ') ' || exchange || '-' || number_part;
END;
$$ LANGUAGE plpgsql;

-- Update vendors with random emails (only where email is NULL or empty)
UPDATE vendors
SET 
    email = generate_random_email(business_name),
    phone = generate_random_phone()
WHERE 
    email IS NULL 
    OR email = ''
    OR phone IS NULL
    OR phone = '';

-- Show updated vendors
SELECT 
    id,
    business_name,
    email,
    phone,
    is_verified
FROM vendors
ORDER BY created_at DESC
LIMIT 20;

-- Clean up functions (optional - comment out if you want to keep them)
-- DROP FUNCTION IF EXISTS generate_random_email(TEXT);
-- DROP FUNCTION IF EXISTS generate_random_phone();

