import { supabase } from '../config/supabase.js';

export const registerVendor = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      business_name,
      description,
      phone,
      email,
      address,
      city_id,
      services // Array of {service_type_id, price_per_unit, unit_type, min_quantity, max_quantity}
    } = req.body;

    if (!business_name) {
      return res.status(400).json({ error: 'business_name is required' });
    }

    // Check if user already has a vendor account
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingVendor) {
      return res.status(400).json({ error: 'User already has a vendor account' });
    }

    // Create vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        user_id: userId,
        business_name,
        description,
        phone,
        email,
        address,
        city_id: city_id || null,
        is_verified: false
      })
      .select()
      .single();

    if (vendorError) {
      throw vendorError;
    }

    // Update user role to vendor
    await supabase
      .from('users')
      .update({ role: 'vendor' })
      .eq('id', userId);

    // Add vendor services if provided
    if (services && Array.isArray(services) && services.length > 0) {
      const vendorServices = services.map(service => ({
        vendor_id: vendor.id,
        service_type_id: service.service_type_id,
        price_per_unit: service.price_per_unit || null,
        unit_type: service.unit_type || 'per_event',
        min_quantity: service.min_quantity || 1,
        max_quantity: service.max_quantity || null,
        is_active: true
      }));

      await supabase
        .from('vendor_services')
        .insert(vendorServices);
    }

    res.status(201).json({
      message: 'Vendor registered successfully',
      vendor
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ error: 'Failed to register vendor' });
  }
};

export const getVendors = async (req, res) => {
  try {
    const { service_type_id, city_id, min_rating } = req.query;

    let query = supabase
      .from('vendors')
      .select(`
        *,
        cities (*),
        vendor_services (
          *,
          service_types (*)
        )
      `)
      .eq('is_verified', true); // Only show verified vendors

    if (service_type_id) {
      // Filter by service type through vendor_services
      query = query.contains('vendor_services.service_type_id', [service_type_id]);
    }

    if (city_id) {
      query = query.eq('city_id', city_id);
    }

    if (min_rating) {
      query = query.gte('rating', parseFloat(min_rating));
    }

    const { data: vendors, error } = await query;

    if (error) {
      throw error;
    }

    res.json({ vendors: vendors || [] });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
};

// Get vendor details by ID with event count
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Vendor ID is required' });
    }

    // Validate UUID format to prevent route conflicts (e.g., "organizers", "register")
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid vendor ID format' });
    }

    // Get vendor with city and services
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select(`
        *,
        cities (
          id,
          name,
          state,
          country
        ),
        vendor_services (
          id,
          service_type_id,
          price_per_unit,
          unit_type,
          min_quantity,
          max_quantity,
          availability_start,
          availability_end,
          is_active,
          service_types (
            id,
            name,
            description,
            category
          )
        )
      `)
      .eq('id', id)
      .single();

    if (vendorError || !vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Count events hosted by this vendor (from event_services)
    const { count: eventsHostedCount, error: countError } = await supabase
      .from('event_services')
      .select('*', { count: 'exact', head: true })
      .eq('vendor_id', id)
      .in('status', ['pending', 'confirmed', 'completed']);

    if (countError) {
      console.error('Error counting events:', countError);
    }

    res.json({
      vendor: {
        ...vendor,
        events_hosted_count: eventsHostedCount || 0
      }
    });
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch vendor details' });
  }
};

// Get top organizers (users who created most events)
export const getTopOrganizers = async (req, res) => {
  try {
    // Log request details to debug duplicate calls
    console.log(`[getTopOrganizers] Request from: ${req.ip}, User-Agent: ${req.get('user-agent') || 'unknown'}, Referer: ${req.get('referer') || 'none'}`);
    
    // First, get all events with user_id
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('user_id')
      .limit(1000); // Get more events to ensure we have good data

    if (eventsError) {
      console.error('Supabase events query error:', eventsError);
      throw eventsError;
    }

    // If no events, return empty array
    if (!events || events.length === 0) {
      console.log('No events found in database');
      return res.json({ organizers: [] });
    }

    // Count events per user_id
    const userEventCounts = {};
    events.forEach(event => {
      if (event.user_id) {
        userEventCounts[event.user_id] = (userEventCounts[event.user_id] || 0) + 1;
      }
    });

    // Get unique user IDs and sort by event count
    const userIds = Object.keys(userEventCounts)
      .sort((a, b) => userEventCounts[b] - userEventCounts[a])
      .slice(0, 12); // Top 12 organizers

    if (userIds.length === 0) {
      return res.json({ organizers: [] });
    }

    // Fetch user details for these IDs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name')
      .in('id', userIds);

    if (usersError) {
      console.error('Supabase users query error:', usersError);
      throw usersError;
    }

    // Map users with their event counts
    const organizers = (users || []).map(user => ({
      id: user.id,
      full_name: user.full_name,
      event_count: userEventCounts[user.id] || 0
    }))
    .sort((a, b) => b.event_count - a.event_count); // Sort again to maintain order

    console.log(`Found ${organizers.length} organizers with events`);
    res.json({ organizers });
  } catch (error) {
    console.error('Get top organizers error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch organizers',
      details: error.message 
    });
  }
};

