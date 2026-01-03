-- Seed Data for Chillings Entertainment Platform - Nigerian Cities
-- This file contains all 36 Nigerian state capitals plus FCT Abuja

-- Insert Nigerian State Capitals
INSERT INTO cities (id, name, state, country) VALUES
    (uuid_generate_v4(), 'Abuja', 'FCT', 'Nigeria'),
    (uuid_generate_v4(), 'Abeokuta', 'Ogun', 'Nigeria'),
    (uuid_generate_v4(), 'Abakaliki', 'Ebonyi', 'Nigeria'),
    (uuid_generate_v4(), 'Ado-Ekiti', 'Ekiti', 'Nigeria'),
    (uuid_generate_v4(), 'Akure', 'Ondo', 'Nigeria'),
    (uuid_generate_v4(), 'Asaba', 'Delta', 'Nigeria'),
    (uuid_generate_v4(), 'Awka', 'Anambra', 'Nigeria'),
    (uuid_generate_v4(), 'Bauchi', 'Bauchi', 'Nigeria'),
    (uuid_generate_v4(), 'Benin City', 'Edo', 'Nigeria'),
    (uuid_generate_v4(), 'Birnin Kebbi', 'Kebbi', 'Nigeria'),
    (uuid_generate_v4(), 'Calabar', 'Cross River', 'Nigeria'),
    (uuid_generate_v4(), 'Damaturu', 'Yobe', 'Nigeria'),
    (uuid_generate_v4(), 'Dutse', 'Jigawa', 'Nigeria'),
    (uuid_generate_v4(), 'Enugu', 'Enugu', 'Nigeria'),
    (uuid_generate_v4(), 'Gombe', 'Gombe', 'Nigeria'),
    (uuid_generate_v4(), 'Gusau', 'Zamfara', 'Nigeria'),
    (uuid_generate_v4(), 'Ibadan', 'Oyo', 'Nigeria'),
    (uuid_generate_v4(), 'Ikeja', 'Lagos', 'Nigeria'),
    (uuid_generate_v4(), 'Ilorin', 'Kwara', 'Nigeria'),
    (uuid_generate_v4(), 'Jalingo', 'Taraba', 'Nigeria'),
    (uuid_generate_v4(), 'Jos', 'Plateau', 'Nigeria'),
    (uuid_generate_v4(), 'Kaduna', 'Kaduna', 'Nigeria'),
    (uuid_generate_v4(), 'Kano', 'Kano', 'Nigeria'),
    (uuid_generate_v4(), 'Katsina', 'Katsina', 'Nigeria'),
    (uuid_generate_v4(), 'Lafia', 'Nasarawa', 'Nigeria'),
    (uuid_generate_v4(), 'Lokoja', 'Kogi', 'Nigeria'),
    (uuid_generate_v4(), 'Maiduguri', 'Borno', 'Nigeria'),
    (uuid_generate_v4(), 'Makurdi', 'Benue', 'Nigeria'),
    (uuid_generate_v4(), 'Minna', 'Niger', 'Nigeria'),
    (uuid_generate_v4(), 'Owerri', 'Imo', 'Nigeria'),
    (uuid_generate_v4(), 'Oyo', 'Oyo', 'Nigeria'),
    (uuid_generate_v4(), 'Port Harcourt', 'Rivers', 'Nigeria'),
    (uuid_generate_v4(), 'Sokoto', 'Sokoto', 'Nigeria'),
    (uuid_generate_v4(), 'Umuahia', 'Abia', 'Nigeria'),
    (uuid_generate_v4(), 'Uyo', 'Akwa Ibom', 'Nigeria'),
    (uuid_generate_v4(), 'Yenagoa', 'Bayelsa', 'Nigeria'),
    (uuid_generate_v4(), 'Yola', 'Adamawa', 'Nigeria')
ON CONFLICT (name) DO NOTHING;

