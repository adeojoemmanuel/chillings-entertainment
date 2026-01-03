# Nigerian Cities Seed Data

This file contains instructions for populating the database with Nigerian state capitals.

## Files

- `seeds_nigeria.sql` - Contains all 36 Nigerian state capitals plus FCT Abuja

## How to Use

### Option 1: Using Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `seeds_nigeria.sql`
4. Click "Run" to execute

### Option 2: Using psql Command Line

```bash
psql -h your-supabase-host -U postgres -d postgres -f database/seeds_nigeria.sql
```

### Option 3: Using Supabase CLI

```bash
supabase db reset --db-url "your-connection-string"
# Then run the seed file
psql "your-connection-string" -f database/seeds_nigeria.sql
```

## Cities Included

The seed file includes all 36 Nigerian state capitals plus the Federal Capital Territory (Abuja):

1. Abuja (FCT)
2. Abeokuta (Ogun)
3. Abakaliki (Ebonyi)
4. Ado-Ekiti (Ekiti)
5. Akure (Ondo)
6. Asaba (Delta)
7. Awka (Anambra)
8. Bauchi (Bauchi)
9. Benin City (Edo)
10. Birnin Kebbi (Kebbi)
11. Calabar (Cross River)
12. Damaturu (Yobe)
13. Dutse (Jigawa)
14. Enugu (Enugu)
15. Gombe (Gombe)
16. Gusau (Zamfara)
17. Ibadan (Oyo)
18. Ikeja (Lagos)
19. Ilorin (Kwara)
20. Jalingo (Taraba)
21. Jos (Plateau)
22. Kaduna (Kaduna)
23. Kano (Kano)
24. Katsina (Katsina)
25. Lafia (Nasarawa)
26. Lokoja (Kogi)
27. Maiduguri (Borno)
28. Makurdi (Benue)
29. Minna (Niger)
30. Owerri (Imo)
31. Oyo (Oyo)
32. Port Harcourt (Rivers)
33. Sokoto (Sokoto)
34. Umuahia (Abia)
35. Uyo (Akwa Ibom)
36. Yenagoa (Bayelsa)
37. Yola (Adamawa)

## Notes

- All cities are set with `country = 'Nigeria'`
- The `ON CONFLICT (name) DO NOTHING` clause ensures no duplicates if run multiple times
- Each city gets a unique UUID automatically

