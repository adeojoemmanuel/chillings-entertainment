# Sponsors Seed Data

This document explains how to use the `seeds_sponsors.sql` file to populate the sponsors table with mock data.

## Overview

The `seeds_sponsors.sql` file contains mock data for the "Our Sponsors & Affiliates" section, including:

- **Platinum Sponsors** (3): Top-tier sponsors with premium visibility
- **Gold Sponsors** (4): Major sponsors with high visibility
- **Silver Sponsors** (5): Standard sponsors with good visibility
- **Bronze Sponsors** (4): Entry-level sponsors
- **Partner Sponsors** (3): Community and media partners
- **Pending Applications** (2): New applications awaiting approval

## How to Use

### Option 1: Using Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `seeds_sponsors.sql`
5. Click **Run** to execute the script

### Option 2: Using psql Command Line

```bash
psql -h your-db-host -U postgres -d your-database -f database/seeds_sponsors.sql
```

### Option 3: Using Supabase CLI

```bash
supabase db reset  # This will reset and apply all migrations
# Then run the seed file
psql -h your-db-host -U postgres -d your-database -f database/seeds_sponsors.sql
```

## Data Structure

Each sponsor record includes:

- **company_name**: Name of the sponsoring company
- **contact_name**: Primary contact person
- **email**: Contact email address
- **phone**: Contact phone number
- **website**: Company website URL
- **description**: Brief description of the company and services
- **logo_url**: URL to company logo (currently using placeholder.com)
- **sponsorship_level**: Tier level (platinum, gold, silver, bronze, partner)
- **status**: Approval status (approved, pending, rejected)
- **created_at**: Timestamp of when the record was created

## Sponsorship Levels

1. **Platinum**: Highest tier with maximum visibility and benefits
2. **Gold**: Major sponsors with high visibility
3. **Silver**: Standard sponsors with good visibility
4. **Bronze**: Entry-level sponsors
5. **Partner**: Community partners, media partners, and affiliates

## Status Values

- **approved**: Sponsor is active and visible on the platform
- **pending**: Application is awaiting admin approval
- **rejected**: Application was rejected (not included in seed data)

## Customization

### Replace Logo URLs

The seed data uses placeholder.com for logos. To use real logos:

1. Upload sponsor logos to your CDN or storage service
2. Replace the `logo_url` values in the SQL file with actual URLs
3. Re-run the seed script (you may want to truncate the table first)

### Add More Sponsors

To add more sponsors, simply add more `INSERT` statements following the same format:

```sql
INSERT INTO sponsors (company_name, contact_name, email, phone, website, description, logo_url, sponsorship_level, status, created_at) VALUES
('Company Name', 'Contact Name', 'email@company.com', '+1-555-0000', 'https://www.company.com', 'Description', 'https://logo-url.com', 'gold', 'approved', NOW());
```

### Modify Existing Data

To update existing sponsors, use `UPDATE` statements:

```sql
UPDATE sponsors 
SET logo_url = 'https://new-logo-url.com', 
    description = 'Updated description'
WHERE company_name = 'Company Name';
```

## Notes

- The seed data includes realistic company names, descriptions, and contact information
- All approved sponsors are set with `status = 'approved'` so they will appear on the frontend
- Pending sponsors are included for testing the approval workflow
- Logo URLs are placeholders - replace them with actual logo URLs in production
- The `created_at` timestamps are varied to simulate real-world data entry over time

## Verification

After running the seed script, verify the data:

```sql
-- Count sponsors by level
SELECT sponsorship_level, COUNT(*) as count 
FROM sponsors 
WHERE status = 'approved'
GROUP BY sponsorship_level
ORDER BY 
  CASE sponsorship_level
    WHEN 'platinum' THEN 1
    WHEN 'gold' THEN 2
    WHEN 'silver' THEN 3
    WHEN 'bronze' THEN 4
    WHEN 'partner' THEN 5
  END;

-- View all approved sponsors
SELECT company_name, sponsorship_level, created_at 
FROM sponsors 
WHERE status = 'approved'
ORDER BY 
  CASE sponsorship_level
    WHEN 'platinum' THEN 1
    WHEN 'gold' THEN 2
    WHEN 'silver' THEN 3
    WHEN 'bronze' THEN 4
    WHEN 'partner' THEN 5
  END,
  created_at DESC;
```

