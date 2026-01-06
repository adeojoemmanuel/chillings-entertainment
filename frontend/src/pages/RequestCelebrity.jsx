import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { celebrityAPI, eventsAPI, citiesAPI } from '../services/api';

const RequestCelebrity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [formData, setFormData] = useState({
    event_id: '',
    planner_name: user?.full_name || '',
    planner_email: user?.email || '',
    planner_phone: '',
    event_title: '',
    event_date: '',
    event_time: '',
    event_location: '',
    city_id: '',
    event_type: '',
    expected_attendees: '',
    budget_range: '',
    celebrity_preferences: '',
    special_requirements: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cities
        const citiesResponse = await citiesAPI.getCities();
        setCities(citiesResponse.data.cities || []);

        // Load user events if authenticated
        if (user) {
          try {
            const eventsResponse = await eventsAPI.getUserEvents();
            setUserEvents(eventsResponse.data.events || []);
          } catch (error) {
            console.error('Failed to load events:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // If an event is selected, populate some fields from it
    if (name === 'event_id' && value) {
      const selectedEvent = userEvents.find(e => e.id === value);
      if (selectedEvent) {
        const eventDate = new Date(selectedEvent.event_date);
        setFormData(prev => ({
          ...prev,
          event_title: selectedEvent.title || prev.event_title,
          event_date: eventDate.toISOString().split('T')[0] || prev.event_date,
          event_time: eventDate.toTimeString().slice(0, 5) || prev.event_time,
          city_id: selectedEvent.city_id || prev.city_id,
          event_type: selectedEvent.event_type || prev.event_type,
          expected_attendees: selectedEvent.expected_attendees?.toString() || prev.expected_attendees
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await celebrityAPI.requestService({
        ...formData,
        event_id: formData.event_id || null,
        expected_attendees: formData.expected_attendees ? parseInt(formData.expected_attendees) : null
      });

      showSuccess('Your celebrity service request has been submitted successfully! We will review your request and get back to you within 24-48 hours.');
      
      // Reset form
      setFormData({
        event_id: '',
        planner_name: user?.full_name || '',
        planner_email: user?.email || '',
        planner_phone: '',
        event_title: '',
        event_date: '',
        event_time: '',
        event_location: '',
        city_id: '',
        event_type: '',
        expected_attendees: '',
        budget_range: '',
        celebrity_preferences: '',
        special_requirements: ''
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to submit celebrity service request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <img src="/chilling.png" alt="Chillings" className="h-10 w-auto drop-shadow-md hover:drop-shadow-lg transition-all duration-200" />
              <h1 className="h-10 flex items-center text-3xl font-bold text-gray-800">
                Entertainment
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.full_name}</span>
                </div>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Header */}
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 hover:text-indigo-600 border border-gray-200"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Request Celebrity Services</h2>
            <p className="text-gray-600 mt-1">Fill out the form to request top celebrities for your event</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">🌟 Bring Top Celebrities to Your Event</h3>
            <p className="text-sm text-indigo-700">
              Our team specializes in connecting event planners with A-list celebrities, top performers, and influential personalities. 
              Submit your request and we'll provide you with available options, pricing, and booking details within 24-48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Link to Existing Event (Optional) */}
            {userEvents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Existing Event (Optional)
                </label>
                <select
                  name="event_id"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={formData.event_id}
                  onChange={handleChange}
                >
                  <option value="">Select an event (optional)</option>
                  {userEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {new Date(event.event_date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Selecting an event will auto-fill some fields below</p>
              </div>
            )}

            {/* Planner Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Planner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="planner_name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={formData.planner_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="planner_email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={formData.planner_email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="planner_phone"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="+1 (555) 123-4567"
                    value={formData.planner_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="event_title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Summer Music Festival 2024"
                    value={formData.event_title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={formData.event_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                    <input
                      type="time"
                      name="event_time"
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={formData.event_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="event_location"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Central Park, New York, NY"
                    value={formData.event_location}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      name="city_id"
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={formData.city_id}
                      onChange={handleChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}, {city.state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select
                      name="event_type"
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      value={formData.event_type}
                      onChange={handleChange}
                    >
                      <option value="">Select event type</option>
                      <option value="sport">Sport Event</option>
                      <option value="concert">Concert</option>
                      <option value="wedding">Wedding</option>
                      <option value="conference">Conference</option>
                      <option value="festival">Festival</option>
                      <option value="party">Party</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendees</label>
                  <input
                    type="number"
                    name="expected_attendees"
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 5000"
                    value={formData.expected_attendees}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Celebrity Service Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Celebrity Service Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select
                    name="budget_range"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    value={formData.budget_range}
                    onChange={handleChange}
                  >
                    <option value="">Select budget range</option>
                    <option value="low">Low ($5,000 - $25,000)</option>
                    <option value="medium">Medium ($25,000 - $100,000)</option>
                    <option value="high">High ($100,000 - $500,000)</option>
                    <option value="premium">Premium ($500,000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Celebrity Preferences</label>
                  <textarea
                    name="celebrity_preferences"
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Top hip-hop artists, A-list actors, or specific celebrity names..."
                    value={formData.celebrity_preferences}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-sm text-gray-500">Tell us about the type of celebrities or specific names you're interested in</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
                  <textarea
                    name="special_requirements"
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Need celebrity to perform for 30 minutes, require meet-and-greet session, specific dress code..."
                    value={formData.special_requirements}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-sm text-gray-500">Any special requirements or notes for the celebrity appearance</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestCelebrity;

