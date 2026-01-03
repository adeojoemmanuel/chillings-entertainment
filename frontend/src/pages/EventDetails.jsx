import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showError } = useNotification();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvent = useCallback(async () => {
    try {
      const response = await eventsAPI.getEventById(eventId);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Event not found</div>;
  }

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
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 hover:text-indigo-600 border border-gray-200"
                aria-label="Go back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Header */}
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 hover:text-indigo-600 border border-gray-200"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Event Details</h2>
            <p className="text-gray-600 mt-1">{event?.title}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {event.poster_url && (
            <div className="w-full h-64 md:h-96 overflow-hidden bg-gray-200">
              <img
                src={event.poster_url}
                alt={`${event.title} poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-600">{new Date(event.event_date).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                event.status === 'booked' ? 'bg-green-100 text-green-800' :
                event.status === 'recommended' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status}
              </span>
            </div>

            {event.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-gray-900">{event.cities?.name} {event.area && `- ${event.area}`}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ticket Count</h3>
              <p className="text-gray-900">{event.expected_attendees}</p>
            </div>
            {event.event_type && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
                <p className="text-gray-900 capitalize">{event.event_type.replace('_', ' ')}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Category</h3>
              <p className="text-gray-900">{event.is_paid ? 'Paid' : 'Free'} Event</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ticketing</h3>
              <p className="text-gray-900">{event.requires_ticketing ? 'Required' : 'Not Required'}</p>
            </div>
            {event.hosting_website && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Event Website</h3>
                <a
                  href={event.hosting_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline flex items-center gap-2"
                >
                  <span>{event.hosting_website}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {event.event_guests && event.event_guests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invited Guests</h3>
              <div className="flex flex-wrap gap-2">
                {event.event_guests.map((guest) => (
                  <span
                    key={guest.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      guest.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {guest.guest_name} {guest.is_verified ? '✓' : '?'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user && (
            <div className="flex space-x-4">
              {event.status === 'recommended' && (
                <button
                  onClick={() => navigate(`/events/${eventId}/recommendations`)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  View Recommendations
                </button>
              )}
              {event.status === 'recommended' && (
                <button
                  onClick={() => navigate(`/events/${eventId}/cart`)}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  View Cart
                </button>
              )}
              {event.event_cart && event.event_cart.length > 0 && (
                <button
                  onClick={() => navigate(`/events/${eventId}/checkout`)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
                >
                  Go to Checkout
                </button>
              )}
              {event.status === 'draft' && (
                <button
                  onClick={async () => {
                    try {
                      await eventsAPI.recommendServices(eventId);
                      navigate(`/events/${eventId}/recommendations`);
                    } catch (error) {
                      showError(error.response?.data?.error || 'Failed to generate recommendations');
                    }
                  }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Generate Recommendations
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          )}
          {!user && (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign In to View Actions
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700"
              >
                Create Account
              </Link>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

