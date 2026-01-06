-- Simple SQL script to update vendors with random mock emails and phone numbers
-- Run this script to populate missing contact information

-- Update emails for vendors without email
UPDATE vendors
SET email = LOWER(REGEXP_REPLACE(business_name, '[^a-zA-Z0-9]', '', 'g')) 
    || FLOOR(RANDOM() * 10000)::INTEGER 
    || '@' || 
    CASE (FLOOR(RANDOM() * 5)::INTEGER)
        WHEN 0 THEN 'gmail.com'
        WHEN 1 THEN 'yahoo.com'
        WHEN 2 THEN 'outlook.com'
        WHEN 3 THEN 'company.com'
        ELSE 'business.com'
    END
WHERE email IS NULL OR email = '';

-- Update phone numbers for vendors without phone
UPDATE vendors
SET phone = '(' || 
    (200 + FLOOR(RANDOM() * 800))::TEXT || 
    ') ' || 
    (200 + FLOOR(RANDOM() * 800))::TEXT || 
    '-' || 
    (1000 + FLOOR(RANDOM() * 9000))::TEXT
WHERE phone IS NULL OR phone = '';

-- Verify updates
SELECT 
    id,
    business_name,
    email,
    phone,
    is_verified,
    created_at
FROM vendors
WHERE email IS NOT NULL AND phone IS NOT NULL
ORDER BY created_at DESC;




