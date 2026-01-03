import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const EventDetailsModal = ({ isOpen, onClose, eventId }) => {
  const { showError } = useNotification();
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEventDetails = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      // Use public endpoint so it works for all users, even non-authenticated ones
      const response = await eventsAPI.getPublicEventById(eventId);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Failed to load event details:', error);
      showError(error.response?.data?.error || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [eventId, showError]);

  useEffect(() => {
    if (isOpen && eventId) {
      loadEventDetails();
    } else {
      setEvent(null);
      setLoading(true);
    }
  }, [isOpen, eventId, loadEventDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 shadow-md"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {loading ? (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading event details...</p>
              </div>
            </div>
          ) : event ? (
            <div className="bg-white">
              {/* Event Poster */}
              {event.poster_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-200">
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

              <div className="px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
                    <p className="text-gray-600">{new Date(event.event_date).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ml-4 ${
                    event.status === 'booked' ? 'bg-green-100 text-green-800' :
                    event.status === 'recommended' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </span>
                </div>

                {/* Description */}
                {event.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                )}

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                    <p className="text-gray-900">{event.cities?.name || 'N/A'} {event.area && `- ${event.area}`}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Ticket Count</h3>
                    <p className="text-gray-900">{event.expected_attendees || 'N/A'}</p>
                  </div>
                  {event.event_type && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Event Type</h3>
                      <p className="text-gray-900 capitalize">{event.event_type.replace('_', ' ')}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Event Category</h3>
                    <p className="text-gray-900">{event.is_paid ? 'Paid' : 'Free'} Event</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Ticketing</h3>
                    <p className="text-gray-900">{event.requires_ticketing ? 'Required' : 'Not Required'}</p>
                  </div>
                  {event.price && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                      <p className="text-gray-900 font-semibold">{formatCurrency(event.price)}</p>
                    </div>
                  )}
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

                {/* Invited Guests */}
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

                {/* Action Buttons */}
                {user ? (
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    {event.status === 'recommended' && (
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/events/${eventId}/recommendations`);
                        }}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        View Recommendations
                      </button>
                    )}
                    {event.status === 'recommended' && (
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/events/${eventId}/cart`);
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Cart
                      </button>
                    )}
                    {event.event_cart && event.event_cart.length > 0 && (
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/events/${eventId}/checkout`);
                        }}
                        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Go to Checkout
                      </button>
                    )}
                    {event.status === 'draft' && (
                      <button
                        onClick={async () => {
                          try {
                            await eventsAPI.recommendServices(eventId);
                            onClose();
                            navigate(`/events/${eventId}/recommendations`);
                          } catch (error) {
                            showError(error.response?.data?.error || 'Failed to generate recommendations');
                          }
                        }}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Generate Recommendations
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/dashboard');
                      }}
                      className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/login');
                      }}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Sign In to View Actions
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/register');
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">Failed to load event details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

