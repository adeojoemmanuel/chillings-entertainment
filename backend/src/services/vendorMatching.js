import { supabase } from '../config/supabase.js';

/**
 * Vendor Matching Service
 * Matches service requirements to available vendors during checkout
 */
export class VendorMatching {
  /**
   * Match a service to the best available vendor
   * @param {string} serviceTypeId - Service type ID
   * @param {string} cityId - City ID
   * @param {number} quantity - Required quantity
   * @param {string} eventDate - Event date
   * @returns {Promise<Object|null>} Best matching vendor service or null
   */
  static async matchVendor(serviceTypeId, cityId, quantity, eventDate) {
    // Get all vendors offering this service type
    // First get vendor services
    const { data: vendorServices, error } = await supabase
      .from('vendor_services')
      .select('*')
      .eq('service_type_id', serviceTypeId)
      .eq('is_active', true);

    if (error || !vendorServices || vendorServices.length === 0) {
      return null;
    }

    // Filter by quantity requirements
    const quantityFiltered = vendorServices.filter(vs => {
      if (vs.max_quantity && quantity > vs.max_quantity) return false;
      if (vs.min_quantity && quantity < vs.min_quantity) return false;
      return true;
    });

    if (quantityFiltered.length === 0) {
      return null;
    }

    // Get vendor details for each service
    const vendorIds = [...new Set(quantityFiltered.map(vs => vs.vendor_id))];
    const { data: vendors, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .in('id', vendorIds)
      .eq('is_verified', true);

    if (vendorError || !vendors || vendors.length === 0) {
      return null;
    }

    // Combine vendor services with vendor data
    const vendorServicesWithVendors = quantityFiltered.map(vs => {
      const vendor = vendors.find(v => v.id === vs.vendor_id);
      return vendor ? { ...vs, vendors: vendor } : null;
    }).filter(Boolean);

    if (error || !vendorServices || vendorServices.length === 0) {
      return null;
    }

    // Filter by availability date if specified
    let availableVendors = vendorServicesWithVendors;
    if (eventDate) {
      const eventDateObj = new Date(eventDate);
      availableVendors = vendorServicesWithVendors.filter(vs => {
        if (!vs.vendors) {
          return false; // Skip if vendor is missing
        }
        if (!vs.availability_start && !vs.availability_end) {
          return true; // No date restrictions
        }
        if (vs.availability_start && eventDateObj < new Date(vs.availability_start)) {
          return false;
        }
        if (vs.availability_end && eventDateObj > new Date(vs.availability_end)) {
          return false;
        }
        return true;
      });
    }

    if (availableVendors.length === 0) {
      return null;
    }

    // Score and rank vendors
    const scoredVendors = availableVendors.map(vs => {
      const vendor = vs.vendors;
      if (!vendor) {
        return null; // Skip if vendor is missing
      }
      let score = 0;

      // Prefer verified vendors (+50 points)
      if (vendor.is_verified) {
        score += 50;
      }

      // Prefer vendors in the same city (+30 points)
      if (vendor.city_id === cityId) {
        score += 30;
      }

      // Higher rating = higher score (+rating * 10)
      score += (vendor.rating || 0) * 10;

      // Prefer vendors with lower price (if price available)
      if (vs.price_per_unit) {
        // Lower price = higher score (inverse relationship)
        // Assuming max price of $10000, score = (10000 - price) / 100
        const priceScore = Math.max(0, (10000 - vs.price_per_unit) / 100);
        score += priceScore;
      }

      return {
        ...vs,
        match_score: score
      };
    }).filter(Boolean); // Remove any null entries

    if (scoredVendors.length === 0) {
      return null;
    }

    // Sort by score (highest first)
    scoredVendors.sort((a, b) => b.match_score - a.match_score);

    // Return best match
    return scoredVendors[0];
  }

  /**
   * Match multiple services to vendors
   * @param {Array} cartItems - Array of {service_type_id, quantity}
   * @param {string} cityId - City ID
   * @param {string} eventDate - Event date
   * @returns {Promise<Array>} Array of matched vendor services
   */
  static async matchMultipleVendors(cartItems, cityId, eventDate) {
    const matches = [];

    for (const item of cartItems) {
      const match = await this.matchVendor(
        item.service_type_id,
        cityId,
        item.quantity,
        eventDate
      );

      if (match) {
        const vendorEmail = match.vendors?.email || null;
        const vendorPhone = match.vendors?.phone || null;
        
        matches.push({
          service_type_id: item.service_type_id,
          quantity: item.quantity,
          vendor_id: match.vendors.id,
          vendor_service_id: match.id,
          vendor_name: match.vendors.business_name,
          vendor_email: vendorEmail,
          vendor_phone: vendorPhone,
          unit_price: match.price_per_unit || 0,
          total_price: (match.price_per_unit || 0) * item.quantity,
          match_score: match.match_score
        });
      } else {
        // No vendor found - still include but mark as unmatched
        matches.push({
          service_type_id: item.service_type_id,
          quantity: item.quantity,
          vendor_id: null,
          vendor_service_id: null,
          vendor_name: null,
          unit_price: 0,
          total_price: 0,
          match_score: 0,
          error: 'No matching vendor found'
        });
      }
    }

    return matches;
  }

  /**
   * Check if all services can be matched to vendors
   * @param {Array} matches - Array of match results
   * @returns {Object} Validation result
   */
  static validateMatches(matches) {
    const unmatched = matches.filter(m => !m.vendor_id);
    const allMatched = unmatched.length === 0;

    return {
      all_matched: allMatched,
      matched_count: matches.length - unmatched.length,
      unmatched_count: unmatched.length,
      unmatched_services: unmatched.map(m => m.service_type_id),
      total_cost: matches.reduce((sum, m) => sum + m.total_price, 0)
    };
  }
}

