// TypeScript interfaces for Chillings Entertainment Platform

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'user' | 'vendor' | 'admin';
  created_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city_id?: string;
  rating: number;
  is_verified: boolean;
  created_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  category: 'venue' | 'equipment' | 'service' | 'consulting';
}

export interface VendorService {
  id: string;
  vendor_id: string;
  service_type_id: string;
  price_per_unit: number;
  unit_type: string;
  min_quantity: number;
  max_quantity?: number;
  is_active: boolean;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_date: string;
  city_id: string;
  area?: string;
  is_paid: boolean;
  requires_ticketing: boolean;
  expected_attendees: number;
  number_of_hosts: number;
  number_of_guests: number;
  status: 'draft' | 'pending_vetting' | 'recommended' | 'cart' | 'booked' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EventGuest {
  id: string;
  event_id: string;
  guest_name: string;
  is_verified: boolean;
  verification_notes?: string;
}

export interface CelebrityHistory {
  id: string;
  celebrity_name: string;
  city_id: string;
  event_date: string;
  actual_attendees?: number;
  event_type?: string;
  notes?: string;
}

export interface EventRecommendation {
  id: string;
  event_id: string;
  service_type_id: string;
  quantity: number;
  priority: number; // 0=required, 1=recommended, 2=optional
  reason: string;
}

export interface EventCartItem {
  id: string;
  event_id: string;
  service_type_id: string;
  quantity: number;
}

export interface EventService {
  id: string;
  event_id: string;
  service_type_id: string;
  vendor_id: string;
  vendor_service_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface City {
  id: string;
  name: string;
  state?: string;
  country: string;
}

export interface VettingResult {
  guest_name: string;
  is_verified: boolean;
  previous_events: number;
  avg_attendance?: number;
  max_attendance?: number;
  notes: string;
  is_realistic: boolean;
}

export interface ServiceRecommendation {
  service_type_id: string;
  service_name: string;
  quantity: number;
  priority: number;
  reason: string;
}

