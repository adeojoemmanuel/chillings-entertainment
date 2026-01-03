import { supabase } from '../config/supabase.js';

/**
 * Celebrity Vetting Engine
 * Validates invited guests based on historical event data
 */
export class VettingEngine {
  /**
   * Check and validate a list of guests for an event
   * @param {string[]} guestNames - Array of guest/celebrity names
   * @param {string} cityId - City ID where event will take place
   * @param {number} expectedAttendees - Expected number of attendees
   * @returns {Promise<Array>} Array of vetting results
   */
  static async checkGuests(guestNames, cityId, expectedAttendees) {
    const results = [];

    for (const guestName of guestNames) {
      const result = await this.checkSingleGuest(guestName, cityId, expectedAttendees);
      results.push(result);
    }

    return results;
  }

  /**
   * Check a single guest/celebrity
   * @param {string} guestName - Name of the guest
   * @param {string} cityId - City ID
   * @param {number} expectedAttendees - Expected attendees
   * @returns {Promise<Object>} Vetting result
   */
  static async checkSingleGuest(guestName, cityId, expectedAttendees) {
    // Get historical events for this celebrity in this city
    const { data: history, error } = await supabase
      .from('celebrity_history')
      .select('*')
      .eq('celebrity_name', guestName)
      .eq('city_id', cityId)
      .order('event_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching celebrity history:', error);
      return {
        guest_name: guestName,
        is_verified: false,
        previous_events: 0,
        notes: 'Error retrieving historical data',
        is_realistic: false
      };
    }

    const previousEvents = history || [];
    const previousEventsCount = previousEvents.length;

    if (previousEventsCount === 0) {
      return {
        guest_name: guestName,
        is_verified: false,
        previous_events: 0,
        notes: 'No previous events found for this celebrity in this city. Attendance projection may be unreliable.',
        is_realistic: false
      };
    }

    // Calculate statistics
    const attendances = previousEvents
      .map(h => h.actual_attendees)
      .filter(a => a !== null && a !== undefined);

    const avgAttendance = attendances.length > 0
      ? Math.round(attendances.reduce((a, b) => a + b, 0) / attendances.length)
      : 0;

    const maxAttendance = attendances.length > 0
      ? Math.max(...attendances)
      : 0;

    // Determine if expected attendance is realistic
    // Consider it realistic if expected is within 150% of max historical attendance
    const isRealistic = expectedAttendees <= (maxAttendance * 1.5);

    // Verification logic
    const isVerified = previousEventsCount >= 2 && isRealistic;

    let notes = '';
    if (previousEventsCount >= 2) {
      notes = `Verified: ${previousEventsCount} previous events in this city. `;
    } else {
      notes = `Limited history: Only ${previousEventsCount} previous event(s) in this city. `;
    }

    notes += `Average attendance: ${avgAttendance}, Max attendance: ${maxAttendance}. `;

    if (!isRealistic) {
      notes += `Warning: Expected attendance (${expectedAttendees}) exceeds historical max by more than 50%. `;
    } else {
      notes += `Expected attendance appears realistic.`;
    }

    return {
      guest_name: guestName,
      is_verified: isVerified,
      previous_events: previousEventsCount,
      avg_attendance: avgAttendance,
      max_attendance: maxAttendance,
      notes: notes.trim(),
      is_realistic: isRealistic
    };
  }

  /**
   * Get overall vetting summary for an event
   * @param {Array} vettingResults - Array of individual vetting results
   * @returns {Object} Summary
   */
  static getVettingSummary(vettingResults) {
    const total = vettingResults.length;
    const verified = vettingResults.filter(r => r.is_verified).length;
    const realistic = vettingResults.filter(r => r.is_realistic).length;

    return {
      total_guests: total,
      verified_count: verified,
      realistic_count: realistic,
      verification_rate: total > 0 ? (verified / total) * 100 : 0,
      all_verified: verified === total,
      all_realistic: realistic === total
    };
  }
}

