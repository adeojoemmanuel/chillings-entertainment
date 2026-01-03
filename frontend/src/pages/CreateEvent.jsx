import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { eventsAPI, vettingAPI, citiesAPI } from '../services/api';

const CreateEvent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showError, showWarning } = useNotification();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [vettingResults, setVettingResults] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    city_id: '',
    area: '',
    event_type: '',
    poster_url: '',
    hosting_website: '',
    is_paid: false,
    requires_ticketing: false,
    expected_attendees: '',
    number_of_hosts: 1,
    number_of_guests: 0,
    guest_names: []
  });
  const [posterPreview, setPosterPreview] = useState('');
  const [guestName, setGuestName] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterUploadMethod, setPosterUploadMethod] = useState('file'); // 'url' or 'file'

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await citiesAPI.getCities();
        setCities(response.data.cities || []);
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Fallback to empty array if API fails
        setCities([]);
      }
    };
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size should be less than 5MB');
        return;
      }

      setPosterFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, poster_url: base64String });
        setPosterPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const addGuest = () => {
    if (guestName.trim()) {
      setFormData({
        ...formData,
        guest_names: [...formData.guest_names, guestName.trim()],
        number_of_guests: formData.guest_names.length + 1
      });
      setGuestName('');
    }
  };

  const removeGuest = (index) => {
    const newGuests = formData.guest_names.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      guest_names: newGuests,
      number_of_guests: newGuests.length
    });
  };

  const handleVetGuests = async () => {
    if (!formData.city_id || formData.guest_names.length === 0) {
      showWarning('Please select a city and add at least one guest');
      return;
    }

    setLoading(true);
    try {
      const response = await vettingAPI.checkGuests({
        guest_names: formData.guest_names,
        city_id: formData.city_id,
        expected_attendees: parseInt(formData.expected_attendees)
      });
      setVettingResults(response.data);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to vet guests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventDateTime = `${formData.event_date}T${formData.event_time}:00`;
      const response = await eventsAPI.create({
        ...formData,
        event_date: eventDateTime,
        expected_attendees: parseInt(formData.expected_attendees),
        number_of_hosts: parseInt(formData.number_of_hosts),
        number_of_guests: formData.guest_names.length
      });

      const eventId = response.data.event.id;
      
      // Automatically generate recommendations
      try {
        await eventsAPI.recommendServices(eventId);
        // Navigate to recommendations page
        navigate(`/events/${eventId}/recommendations`);
      } catch (recError) {
        console.error('Failed to generate recommendations:', recError);
        // Still navigate to event details even if recommendations fail
        navigate(`/events/${eventId}`);
        showWarning('Event created successfully, but failed to generate recommendations. You can try again from the event details page.');
      }
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to create event');
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
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">{user?.full_name}</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
            <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
            <p className="text-gray-600 mt-1">Fill in the details to create your event</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
                <input
                  type="time"
                  name="event_time"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={formData.event_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <select
                  name="city_id"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <input
                  type="text"
                  name="area"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Downtown, Central Park"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
              <select
                name="event_type"
                required
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Poster</label>
              
              {/* Upload Method Toggle */}
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setPosterUploadMethod('file');
                    setFormData({ ...formData, poster_url: '' });
                    setPosterPreview('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    posterUploadMethod === 'file'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosterUploadMethod('url');
                    setPosterFile(null);
                    setFormData({ ...formData, poster_url: '' });
                    setPosterPreview('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    posterUploadMethod === 'url'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Use URL
                </button>
              </div>

              {/* URL Input */}
              {posterUploadMethod === 'url' && (
                <div>
                  <input
                    type="url"
                    name="poster_url"
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/poster.jpg"
                    value={formData.poster_url}
                    onChange={(e) => {
                      setFormData({ ...formData, poster_url: e.target.value });
                      setPosterPreview(e.target.value);
                    }}
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter a URL to an image</p>
                </div>
              )}

              {/* File Upload */}
              {posterUploadMethod === 'file' && (
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  {posterFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: <span className="font-medium">{posterFile.name}</span> ({(posterFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {/* Preview */}
              {posterPreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={posterPreview}
                    alt="Event poster preview"
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Hosting Website</label>
              <input
                type="url"
                name="hosting_website"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/event-page"
                value={formData.hosting_website}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">Optional: Link to your event's website or registration page</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendees *</label>
                <input
                  type="number"
                  name="expected_attendees"
                  required
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 500"
                  value={formData.expected_attendees}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Hosts</label>
                <input
                  type="number"
                  name="number_of_hosts"
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2"
                  value={formData.number_of_hosts}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_paid"
                  className="rounded border-gray-300"
                  checked={formData.is_paid}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-700">Paid Event</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requires_ticketing"
                  className="rounded border-gray-300"
                  checked={formData.requires_ticketing}
                  onChange={handleChange}
                />
                <span className="ml-2 text-sm text-gray-700">Requires Ticketing</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invited Guests / Celebrities
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
                >
                  Add
                </button>
              </div>
              {formData.guest_names.length > 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleVetGuests}
                    disabled={loading}
                    className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold disabled:opacity-50 disabled:transform-none"
                  >
                    {loading ? 'Verifying...' : 'Verify Guests'}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.guest_names.map((name, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeGuest(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {vettingResults && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Vetting Results</h3>
                <div className="space-y-2">
                  {vettingResults.results.map((result, idx) => (
                    <div key={idx} className="text-sm">
                      <strong>{result.guest_name}:</strong> {result.is_verified ? '✓ Verified' : '✗ Not Verified'}
                      <p className="text-yellow-700">{result.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
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
                    Creating...
                  </span>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;

