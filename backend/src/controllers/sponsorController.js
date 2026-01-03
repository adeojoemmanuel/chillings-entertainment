import { supabase } from '../config/supabase.js';
import { sendEmail } from '../services/emailService.js';

export const getSponsors = async (req, res) => {
  try {
    const { data: sponsors, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ sponsors: sponsors || [] });
  } catch (error) {
    console.error('Get sponsors error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sponsors',
      message: error.message || 'Unknown error'
    });
  }
};

export const applyForSponsorship = async (req, res) => {
  try {
    const {
      company_name,
      contact_name,
      email,
      phone,
      website,
      description,
      logo_url,
      sponsorship_level
    } = req.body;

    // Validate required fields
    if (!company_name || !contact_name || !email) {
      return res.status(400).json({ error: 'Company name, contact name, and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create sponsor application
    const { data: sponsor, error: sponsorError } = await supabase
      .from('sponsors')
      .insert({
        company_name,
        contact_name,
        email,
        phone: phone || null,
        website: website || null,
        description: description || null,
        logo_url: logo_url || null,
        sponsorship_level: sponsorship_level || 'partner',
        status: 'pending'
      })
      .select()
      .single();

    if (sponsorError) {
      throw sponsorError;
    }

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@chillingsentertainment.com';
      await sendEmail({
        to: adminEmail,
        subject: `New Sponsor Application: ${company_name}`,
        html: `
          <h2>New Sponsor Application</h2>
          <p>A new sponsor application has been submitted and requires your review.</p>
          
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Company Name:</strong> ${company_name}</li>
            <li><strong>Contact Name:</strong> ${contact_name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
            <li><strong>Website:</strong> ${website || 'Not provided'}</li>
            <li><strong>Sponsorship Level:</strong> ${sponsorship_level || 'partner'}</li>
            <li><strong>Description:</strong> ${description || 'Not provided'}</li>
          </ul>
          
          <p>Please review and approve or reject this application in the admin panel.</p>
          <p>Application ID: ${sponsor.id}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Sponsor application submitted successfully. We will review your application and get back to you soon!',
      sponsor: {
        id: sponsor.id,
        company_name: sponsor.company_name,
        status: sponsor.status
      }
    });
  } catch (error) {
    console.error('Apply for sponsorship error:', error);
    res.status(500).json({ 
      error: 'Failed to submit sponsor application',
      message: error.message || 'Unknown error'
    });
  }
};

