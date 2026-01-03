import { supabase } from '../config/supabase.js';

export const getCities = async (req, res) => {
  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, state, country')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ cities: cities || [] });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

