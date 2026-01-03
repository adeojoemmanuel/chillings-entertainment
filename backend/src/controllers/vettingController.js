import { VettingEngine } from '../services/vettingEngine.js';

export const checkGuests = async (req, res) => {
  try {
    const { guest_names, city_id, expected_attendees } = req.body;

    if (!guest_names || !Array.isArray(guest_names) || guest_names.length === 0) {
      return res.status(400).json({ error: 'guest_names array is required' });
    }

    if (!city_id) {
      return res.status(400).json({ error: 'city_id is required' });
    }

    if (!expected_attendees || expected_attendees <= 0) {
      return res.status(400).json({ error: 'expected_attendees must be a positive number' });
    }

    // Check each guest
    const results = await VettingEngine.checkGuests(
      guest_names,
      city_id,
      expected_attendees
    );

    // Get summary
    const summary = VettingEngine.getVettingSummary(results);

    res.json({
      results,
      summary
    });
  } catch (error) {
    console.error('Vetting error:', error);
    res.status(500).json({ error: 'Failed to check guests' });
  }
};

