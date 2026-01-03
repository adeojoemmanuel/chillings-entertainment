import { supabase } from '../config/supabase.js';

/**
 * Service Recommendation Engine
 * Automatically recommends required services based on event parameters
 */
export class RecommendationEngine {
  /**
   * Generate service recommendations for an event
   * @param {Object} eventData - Event data object
   * @returns {Promise<Array>} Array of service recommendations
   */
  static async generateRecommendations(eventData) {
    const {
      expected_attendees,
      city_id,
      is_paid,
      requires_ticketing,
      number_of_hosts,
      number_of_guests,
      event_date
    } = eventData;

    const recommendations = [];

    // Get all service types
    const { data: serviceTypes, error: serviceError } = await supabase
      .from('service_types')
      .select('*');

    if (serviceError || !serviceTypes) {
      throw new Error('Failed to fetch service types');
    }

    const serviceMap = {};
    serviceTypes.forEach(st => {
      serviceMap[st.name.toLowerCase()] = st;
    });

    // Required services based on event size
    const attendeeTier = this.getAttendeeTier(expected_attendees);

    // 1. Event Center/Venue (always required)
    if (serviceMap['event center']) {
      recommendations.push({
        service_type_id: serviceMap['event center'].id,
        service_name: serviceMap['event center'].name,
        quantity: 1,
        priority: 0, // Required
        reason: `Required venue for ${expected_attendees} attendees`
      });
    }

    // 2. Chairs (based on attendees)
    if (serviceMap['chairs']) {
      const chairQuantity = Math.ceil(expected_attendees * 1.1); // 10% buffer
      recommendations.push({
        service_type_id: serviceMap['chairs'].id,
        service_name: serviceMap['chairs'].name,
        quantity: chairQuantity,
        priority: 0,
        reason: `Seating for ${expected_attendees} attendees (with 10% buffer)`
      });
    }

    // 3. Sound System (required for events with hosts/guests)
    if (serviceMap['sound system'] && (number_of_hosts > 0 || number_of_guests > 0)) {
      const systemCount = attendeeTier === 'large' ? 2 : 1;
      recommendations.push({
        service_type_id: serviceMap['sound system'].id,
        service_name: serviceMap['sound system'].name,
        quantity: systemCount,
        priority: 0,
        reason: `Audio system required for ${number_of_hosts} host(s) and ${number_of_guests} guest(s)`
      });
    }

    // 4. Microphones (based on number of hosts)
    if (serviceMap['microphones'] && number_of_hosts > 0) {
      const micCount = Math.max(number_of_hosts, 2); // At least 2 mics
      recommendations.push({
        service_type_id: serviceMap['microphones'].id,
        service_name: serviceMap['microphones'].name,
        quantity: micCount,
        priority: 0,
        reason: `Microphones for ${number_of_hosts} host(s)`
      });
    }

    // 5. Tents (for outdoor events or large events)
    if (serviceMap['tents'] && attendeeTier === 'large') {
      const tentCount = expected_attendees > 500 ? 2 : 1;
      recommendations.push({
        service_type_id: serviceMap['tents'].id,
        service_name: serviceMap['tents'].name,
        quantity: tentCount,
        priority: 1, // Recommended
        reason: `Tent(s) recommended for large event (${expected_attendees} attendees)`
      });
    }

    // 6. Ticketing Service (if required)
    if (requires_ticketing && serviceMap['ticketing service']) {
      recommendations.push({
        service_type_id: serviceMap['ticketing service'].id,
        service_name: serviceMap['ticketing service'].name,
        quantity: 1,
        priority: 0,
        reason: 'Ticketing service required for ticket sales'
      });
    }

    // 7. Security (based on event size)
    if (serviceMap['security']) {
      const securityCount = this.calculateSecurityCount(expected_attendees);
      recommendations.push({
        service_type_id: serviceMap['security'].id,
        service_name: serviceMap['security'].name,
        quantity: securityCount,
        priority: 0,
        reason: `Security personnel required for event with ${expected_attendees} attendees`
      });
    }

    // 8. Catering (always recommended)
    if (serviceMap['catering']) {
      const cateringQuantity = Math.ceil(expected_attendees * 1.1);
      recommendations.push({
        service_type_id: serviceMap['catering'].id,
        service_name: serviceMap['catering'].name,
        quantity: cateringQuantity,
        priority: 1,
        reason: `Catering for ${expected_attendees} attendees`
      });
    }

    // 9. Fireworks (optional, for special events)
    if (serviceMap['fireworks'] && attendeeTier === 'large' && number_of_guests > 0) {
      recommendations.push({
        service_type_id: serviceMap['fireworks'].id,
        service_name: serviceMap['fireworks'].name,
        quantity: 1,
        priority: 2, // Optional
        reason: 'Fireworks display for special event with celebrity guests'
      });
    }

    // 10. Event Consultant (recommended for large/complex events)
    if (serviceMap['event consultant'] && attendeeTier !== 'small') {
      recommendations.push({
        service_type_id: serviceMap['event consultant'].id,
        service_name: serviceMap['event consultant'].name,
        quantity: 1,
        priority: 1,
        reason: `Event consultant recommended for ${attendeeTier} event`
      });
    }

    // 11. Licensing Consultant (always recommended)
    if (serviceMap['licensing consultant']) {
      recommendations.push({
        service_type_id: serviceMap['licensing consultant'].id,
        service_name: serviceMap['licensing consultant'].name,
        quantity: 1,
        priority: 1,
        reason: 'Licensing consultant for permits and legal compliance'
      });
    }

    return recommendations;
  }

  /**
   * Determine attendee tier
   * @param {number} attendees - Number of attendees
   * @returns {string} Tier: 'small', 'medium', 'large'
   */
  static getAttendeeTier(attendees) {
    if (attendees < 100) return 'small';
    if (attendees < 500) return 'medium';
    return 'large';
  }

  /**
   * Calculate required security personnel
   * @param {number} attendees - Number of attendees
   * @returns {number} Number of security personnel
   */
  static calculateSecurityCount(attendees) {
    if (attendees < 50) return 2;
    if (attendees < 200) return 4;
    if (attendees < 500) return 6;
    if (attendees < 1000) return 10;
    return Math.ceil(attendees / 100); // 1 per 100 attendees for very large events
  }

  /**
   * Save recommendations to database
   * @param {string} eventId - Event ID
   * @param {Array} recommendations - Array of recommendation objects
   * @returns {Promise<Object>} Insert result
   */
  static async saveRecommendations(eventId, recommendations) {
    const records = recommendations.map(rec => ({
      event_id: eventId,
      service_type_id: rec.service_type_id,
      quantity: rec.quantity,
      priority: rec.priority,
      reason: rec.reason
    }));

    const { data, error } = await supabase
      .from('event_recommendations')
      .upsert(records, { onConflict: 'event_id,service_type_id' })
      .select();

    if (error) {
      throw new Error(`Failed to save recommendations: ${error.message}`);
    }

    return data;
  }
}

