import { supabase } from '../config/supabase.js';
import { RecommendationEngine } from '../services/recommendationEngine.js';
import { VettingEngine } from '../services/vettingEngine.js';
import { VendorMatching } from '../services/vendorMatching.js';

export const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      event_date,
      city_id,
      area,
      event_type,
      poster_url,
      hosting_website,
      is_paid,
      requires_ticketing,
      expected_attendees,
      number_of_hosts,
      number_of_guests,
      guest_names
    } = req.body;

    // Validate required fields
    if (!title || !event_date || !city_id || !expected_attendees) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        title,
        description,
        event_date,
        city_id,
        area,
        event_type: event_type || null,
        poster_url: poster_url || null,
        hosting_website: hosting_website || null,
        is_paid: is_paid || false,
        requires_ticketing: requires_ticketing || false,
        expected_attendees,
        number_of_hosts: number_of_hosts || 1,
        number_of_guests: number_of_guests || 0,
        status: 'draft'
      })
      .select()
      .single();

    if (eventError) {
      throw eventError;
    }

    // Add guests if provided
    if (guest_names && Array.isArray(guest_names) && guest_names.length > 0) {
      const guestRecords = guest_names.map(name => ({
        event_id: event.id,
        guest_name: name,
        is_verified: false
      }));

      await supabase
        .from('event_guests')
        .insert(guestRecords);
    }

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    // Provide more detailed error message
    if (error.code === '22P02') {
      return res.status(400).json({ 
        error: 'Invalid UUID format. Please ensure city_id is a valid UUID.',
        details: error.message 
      });
    }
    res.status(500).json({ 
      error: 'Failed to create event',
      details: error.message 
    });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        cities (id, name, state),
        event_guests (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ events: events || [] });
  } catch (error) {
    console.error('Get events error:', {
      message: error.message,
      details: error.details || error.cause || error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });
    res.status(500).json({ 
      error: 'Failed to fetch events',
      message: error.message || 'Unknown error'
    });
  }
};

// Public endpoint to get all events
export const getAllEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        cities (id, name, state),
        users (id, full_name)
      `)
      .order('event_date', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    res.json({ events: events || [] });
  } catch (error) {
    console.error('Get all events error:', {
      message: error.message,
      details: error.details || error.cause || String(error),
      hint: error.hint || '',
      code: error.code || '',
      stack: error.stack
    });

    // Check if it's a network error
    if (error.message && (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
      console.error('\n⚠️  Network error detected. Troubleshooting steps:');
      console.error('1. Check your internet connection');
      console.error('2. Verify SUPABASE_URL in .env file (should be https://your-project.supabase.co)');
      console.error('3. Check if Supabase project is active in dashboard');
      console.error('4. Verify firewall/proxy settings');
      console.error('5. Try accessing Supabase URL in browser');
      console.error('6. Check if SUPABASE_SERVICE_KEY is correct\n');
    }

    res.status(500).json({ 
      error: 'Failed to fetch events',
      message: error.message || 'Unknown error',
      details: error.message 
    });
  }
};

// Public endpoint to get event details by ID (no authentication required)
export const getPublicEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        cities (id, name, state),
        event_guests (*)
      `)
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get public event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        cities (*),
        event_guests (*),
        event_recommendations (
          *,
          service_types (*)
        ),
        event_cart (
          *,
          service_types (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const recommendServices = async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    // Get event data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .eq('user_id', req.user.userId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Generate recommendations
    const recommendations = await RecommendationEngine.generateRecommendations(event);

    // Save recommendations to database
    await RecommendationEngine.saveRecommendations(event_id, recommendations);

    // Update event status
    await supabase
      .from('events')
      .update({ status: 'recommended' })
      .eq('id', event_id);

    res.json({
      message: 'Service recommendations generated',
      recommendations,
      notification: 'Please verify that the recommended event locations are available for your chosen date.'
    });
  } catch (error) {
    console.error('Recommend services error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { event_id, service_type_id, quantity } = req.body;

    if (!event_id || !service_type_id) {
      return res.status(400).json({ error: 'event_id and service_type_id are required' });
    }

    // Verify event belongs to user
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .eq('user_id', req.user.userId)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Add or update cart item
    const { data, error } = await supabase
      .from('event_cart')
      .upsert({
        event_id,
        service_type_id,
        quantity: quantity || 1
      }, {
        onConflict: 'event_id,service_type_id'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Item added to cart',
      cart_item: data
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const addAllToCart = async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    // Get all recommendations for this event
    const { data: recommendations, error: recError } = await supabase
      .from('event_recommendations')
      .select('service_type_id, quantity')
      .eq('event_id', event_id);

    if (recError) {
      throw recError;
    }

    if (!recommendations || recommendations.length === 0) {
      return res.status(400).json({ error: 'No recommendations found for this event' });
    }

    // Add all to cart
    const cartItems = recommendations.map(rec => ({
      event_id,
      service_type_id: rec.service_type_id,
      quantity: rec.quantity
    }));

    const { data, error } = await supabase
      .from('event_cart')
      .upsert(cartItems, {
        onConflict: 'event_id,service_type_id'
      })
      .select();

    if (error) {
      throw error;
    }

    res.json({
      message: 'All recommendations added to cart',
      cart_items: data,
      count: data.length
    });
  } catch (error) {
    console.error('Add all to cart error:', error);
    res.status(500).json({ error: 'Failed to add items to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { event_id, service_type_id } = req.body;

    if (!event_id || !service_type_id) {
      return res.status(400).json({ error: 'event_id and service_type_id are required' });
    }

    // Verify event belongs to user
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('id', event_id)
      .eq('user_id', req.user.userId)
      .single();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove item from cart
    const { error } = await supabase
      .from('event_cart')
      .delete()
      .eq('event_id', event_id)
      .eq('service_type_id', service_type_id);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const getCheckoutPreview = async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .eq('user_id', req.user.userId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get cart items with service type names
    const { data: cartItems, error: cartError } = await supabase
      .from('event_cart')
      .select(`
        service_type_id,
        quantity,
        service_types (
          id,
          name
        )
      `)
      .eq('event_id', event_id);

    if (cartError) {
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Match vendors
    const matches = await VendorMatching.matchMultipleVendors(
      cartItems.map(item => ({
        service_type_id: item.service_type_id,
        quantity: item.quantity
      })),
      event.city_id,
      event.event_date
    );

    // Enrich matches with service type names
    const enrichedMatches = matches.map(match => {
      const cartItem = cartItems.find(item => item.service_type_id === match.service_type_id);
      return {
        ...match,
        service_name: cartItem?.service_types?.name || 'Unknown Service'
      };
    });

    // Validate matches
    const validation = VendorMatching.validateMatches(matches);

    res.json({
      event_id,
      event_title: event.title,
      matches: enrichedMatches,
      validation,
      total_cost: validation.total_cost
    });
  } catch (error) {
    console.error('Checkout preview error:', error);
    res.status(500).json({ error: 'Failed to get checkout preview' });
  }
};

export const checkout = async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' });
    }

    // Get event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .eq('user_id', req.user.userId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('event_cart')
      .select('service_type_id, quantity')
      .eq('event_id', event_id);

    if (cartError) {
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Match vendors
    const matches = await VendorMatching.matchMultipleVendors(
      cartItems,
      event.city_id,
      event.event_date
    );

    // Validate matches
    const validation = VendorMatching.validateMatches(matches);

    if (!validation.all_matched) {
      return res.status(400).json({
        error: 'Some services could not be matched to vendors',
        validation,
        matches
      });
    }

    // Create event services (bookings)
    const eventServices = matches.map(match => ({
      event_id,
      service_type_id: match.service_type_id,
      vendor_id: match.vendor_id,
      vendor_service_id: match.vendor_service_id,
      quantity: match.quantity,
      unit_price: match.unit_price,
      total_price: match.total_price,
      status: 'pending'
    }));

    const { data: bookedServices, error: bookingError } = await supabase
      .from('event_services')
      .insert(eventServices)
      .select();

    if (bookingError) {
      throw bookingError;
    }

    // Update event status
    await supabase
      .from('events')
      .update({ status: 'booked' })
      .eq('id', event_id);

    // Clear cart
    await supabase
      .from('event_cart')
      .delete()
      .eq('event_id', event_id);

    res.json({
      message: 'Checkout completed successfully',
      event_id,
      booked_services: bookedServices,
      total_cost: validation.total_cost,
      services_count: bookedServices.length
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to complete checkout' });
  }
};

