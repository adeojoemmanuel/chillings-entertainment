import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Only add token if it exists and is not empty
    if (token && token.trim()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, 'Status:', error.response?.status, 'Message:', error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  socialLogin: (data) => api.post('/auth/social-login', data),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

// Events API
export const eventsAPI = {
  create: (data) => api.post('/events/create', data),
  getUserEvents: () => api.get('/events/user'),
  getAllEvents: () => api.get('/events/all'), // Public endpoint
  getEventById: (id) => api.get(`/events/${id}`), // Requires auth, returns user's events only
  getPublicEventById: (id) => api.get(`/events/public/${id}`), // Public endpoint, no auth required
  recommendServices: (eventId) => api.post('/events/recommend-services', { event_id: eventId }),
  addToCart: (data) => api.post('/events/add-to-cart', data),
  addAllToCart: (eventId) => api.post('/events/add-all-to-cart', { event_id: eventId }),
  removeFromCart: (data) => api.post('/events/remove-from-cart', data),
  getCheckoutPreview: (eventId) => api.post('/events/checkout-preview', { event_id: eventId }),
  checkout: (eventId) => api.post('/events/checkout', { event_id: eventId }),
};

// Vendors API
export const vendorsAPI = {
  register: (data) => api.post('/vendors/register', data),
  getVendors: (params) => api.get('/vendors', { params }),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  getTopOrganizers: () => api.get('/vendors/organizers'),
};

// Vetting API
export const vettingAPI = {
  checkGuests: (data) => api.post('/vetting/check-guests', data),
};

// Cities API
export const citiesAPI = {
  getCities: () => api.get('/cities'),
};

// Sponsors API
export const sponsorsAPI = {
  getSponsors: () => api.get('/sponsors'),
  applyForSponsorship: (data) => api.post('/sponsors/apply', data),
};

// Celebrity Services API
export const celebrityAPI = {
  requestService: (data) => api.post('/celebrity/request', data),
  getMyRequests: () => api.get('/celebrity/my-requests'),
};

export default api;

