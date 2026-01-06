import { supabase } from '../config/supabase.js';
import { sendEmail } from '../services/emailService.js';

export const requestCelebrityService = async (req, res) => {
  try {
    const {
      event_id,
      planner_name,
      planner_email,
      planner_phone,
      event_title,
      event_date,
      event_time,
      event_location,
      city_id,
      event_type,
      expected_attendees,
      budget_range,
      celebrity_preferences,
      special_requirements
    } = req.body;

    // Validate required fields
    if (!planner_name || !planner_email || !event_title || !event_date || !event_location) {
      return res.status(400).json({ 
        error: 'Planner name, email, event title, event date, and event location are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(planner_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate event_id if provided
    if (event_id) {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, user_id')
        .eq('id', event_id)
        .single();

      if (eventError || !event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Verify the event belongs to the authenticated user
      if (req.user && event.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'You can only link requests to your own events' });
      }
    }

    // Create celebrity service request
    const { data: request, error: requestError } = await supabase
      .from('celebrity_requests')
      .insert({
        user_id: req.user?.userId || null, // Optional: can be anonymous
        event_id: event_id || null,
        planner_name,
        planner_email,
        planner_phone: planner_phone || null,
        event_title,
        event_date,
        event_time: event_time || null,
        event_location,
        city_id: city_id || null,
        event_type: event_type || null,
        expected_attendees: expected_attendees ? parseInt(expected_attendees) : null,
        budget_range: budget_range || null,
        celebrity_preferences: celebrity_preferences || null,
        special_requirements: special_requirements || null,
        status: 'pending'
      })
      .select()
      .single();

    if (requestError) {
      throw requestError;
    }

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@chillingsentertainment.com';
      await sendEmail({
        to: adminEmail,
        subject: `New Celebrity Service Request: ${event_title}`,
        html: `
          <h2>New Celebrity Service Request</h2>
          <p>A new request for celebrity services has been submitted and requires your review.</p>
          
          <h3>Request Details:</h3>
          <ul>
            <li><strong>Request ID:</strong> ${request.id}</li>
            <li><strong>Planner Name:</strong> ${planner_name}</li>
            <li><strong>Planner Email:</strong> ${planner_email}</li>
            <li><strong>Planner Phone:</strong> ${planner_phone || 'Not provided'}</li>
            <li><strong>Event Title:</strong> ${event_title}</li>
            <li><strong>Event Date:</strong> ${event_date}${event_time ? ` at ${event_time}` : ''}</li>
            <li><strong>Event Location:</strong> ${event_location}</li>
            <li><strong>Event Type:</strong> ${event_type || 'Not specified'}</li>
            <li><strong>Expected Attendees:</strong> ${expected_attendees || 'Not specified'}</li>
            <li><strong>Budget Range:</strong> ${budget_range || 'Not specified'}</li>
            <li><strong>Celebrity Preferences:</strong> ${celebrity_preferences || 'Not specified'}</li>
            <li><strong>Special Requirements:</strong> ${special_requirements || 'None'}</li>
            ${event_id ? `<li><strong>Linked Event ID:</strong> ${event_id}</li>` : ''}
          </ul>
          
          <p>Please review this request and provide a quote or contact the planner.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to planner
    try {
      await sendEmail({
        to: planner_email,
        subject: 'Celebrity Service Request Received - Chillings Entertainment',
        html: `
          <h2>Thank You for Your Request!</h2>
          <p>Dear ${planner_name},</p>
          
          <p>We have received your request for celebrity services for your event "<strong>${event_title}</strong>".</p>
          
          <h3>Your Request Summary:</h3>
          <ul>
            <li><strong>Event Date:</strong> ${event_date}${event_time ? ` at ${event_time}` : ''}</li>
            <li><strong>Event Location:</strong> ${event_location}</li>
            <li><strong>Budget Range:</strong> ${budget_range || 'Not specified'}</li>
          </ul>
          
          <p>Our team will review your request and get back to you within 24-48 hours with:</p>
          <ul>
            <li>Available celebrity options</li>
            <li>Pricing information</li>
            <li>Next steps for booking</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>The Chillings Entertainment Team</p>
          
          <hr>
          <p style="font-size: 12px; color: #666;">Request ID: ${request.id}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Celebrity service request submitted successfully. We will review your request and get back to you within 24-48 hours!',
      request: {
        id: request.id,
        event_title: request.event_title,
        status: request.status
      }
    });
  } catch (error) {
    console.error('Request celebrity service error:', error);
    res.status(500).json({ 
      error: 'Failed to submit celebrity service request',
      message: error.message || 'Unknown error'
    });
  }
};

export const getUserCelebrityRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: requests, error } = await supabase
      .from('celebrity_requests')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ requests: requests || [] });
  } catch (error) {
    console.error('Get user celebrity requests error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch celebrity requests',
      message: error.message || 'Unknown error'
    });
  }
};

