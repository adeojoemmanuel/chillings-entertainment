import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Recommendations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();
  const [event, setEvent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [addingAll, setAddingAll] = useState(false);

  const loadEvent = useCallback(async () => {
    try {
      const response = await eventsAPI.getEventById(eventId);
      setEvent(response.data.event);
      if (response.data.event.event_recommendations) {
        setRecommendations(response.data.event.event_recommendations);
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      const response = await eventsAPI.recommendServices(eventId);
      setRecommendations(response.data.recommendations);
      if (response.data.notification) {
        showInfo(response.data.notification);
      }
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const addAllToCart = async () => {
    setAddingAll(true);
    try {
      await eventsAPI.addAllToCart(eventId);
      showSuccess('All recommendations added to cart!');
      setTimeout(() => {
        navigate(`/events/${eventId}/cart`);
      }, 1500);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to add items to cart');
    } finally {
      setAddingAll(false);
    }
  };

  const addToCart = async (serviceTypeId, quantity) => {
    // Add serviceTypeId to the adding set
    setAddingToCart(prev => new Set(prev).add(serviceTypeId));
    try {
      await eventsAPI.addToCart({
        event_id: eventId,
        service_type_id: serviceTypeId,
        quantity
      });
      showSuccess('Item added to cart!');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to add item to cart');
    } finally {
      // Remove serviceTypeId from the adding set
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceTypeId);
        return newSet;
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
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
            <h2 className="text-3xl font-bold text-gray-900">Service Recommendations</h2>
            <p className="text-gray-600 mt-1">{event?.title}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Service Recommendations</h3>
            {recommendations.length === 0 && (
              <button
                onClick={generateRecommendations}
                disabled={generating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Generating...' : 'Generate Recommendations'}
              </button>
            )}
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No recommendations yet. Generate them now!</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <button
                  onClick={addAllToCart}
                  disabled={addingAll}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                >
                  {addingAll ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add All to Cart'
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {rec.service_types?.name || 'Service'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Quantity: {rec.quantity}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rec.priority === 0 ? 'bg-red-100 text-red-800' :
                          rec.priority === 1 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rec.priority === 0 ? 'Required' :
                           rec.priority === 1 ? 'Recommended' : 'Optional'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(rec.service_type_id, rec.quantity)}
                      disabled={addingToCart.has(rec.service_type_id)}
                      className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center min-w-[120px]"
                    >
                      {addingToCart.has(rec.service_type_id) ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-800">
                  <strong>Note:</strong> Please verify that the recommended event locations are available for your chosen date.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate(`/events/${eventId}/cart`)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Go to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;

