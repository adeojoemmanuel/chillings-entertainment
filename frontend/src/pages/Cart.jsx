import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';

const Cart = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [event, setEvent] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'indigo'
  });

  const loadEvent = useCallback(async () => {
    try {
      const response = await eventsAPI.getEventById(eventId);
      setEvent(response.data.event);
      if (response.data.event.event_cart) {
        setCartItems(response.data.event.event_cart);
      }
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

  const handleCheckout = () => {
    // Navigate to checkout page instead of directly completing
    navigate(`/events/${eventId}/checkout`);
  };

  const addToCart = async (serviceTypeId, quantity) => {
    try {
      await eventsAPI.addToCart({
        event_id: eventId,
        service_type_id: serviceTypeId,
        quantity
      });
      showSuccess('Item added to cart!');
      // Reload event to update cart items
      loadEvent();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to add item to cart');
    }
  };

  const addAllToCart = async () => {
    try {
      await eventsAPI.addAllToCart(eventId);
      showSuccess('All recommendations added to cart!');
      // Reload event to update cart items
      loadEvent();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to add items to cart');
    }
  };

  const removeFromCart = async (serviceTypeId) => {
    const serviceName = cartItems.find(item => item.service_type_id === serviceTypeId)?.service_types?.name || 'this item';
    
    setConfirmDialog({
      isOpen: true,
      title: 'Remove from Cart',
      message: `Are you sure you want to remove "${serviceName}" from the cart?`,
      onConfirm: async () => {
        try {
          await eventsAPI.removeFromCart({
            event_id: eventId,
            service_type_id: serviceTypeId
          });
          showSuccess('Item removed from cart!');
          // Reload event to update cart items
          loadEvent();
        } catch (error) {
          showError(error.response?.data?.error || 'Failed to remove item from cart');
        }
      },
      confirmText: 'Remove',
      cancelText: 'Cancel',
      confirmColor: 'red'
    });
  };

  // Check if a recommendation is already in cart
  const isInCart = (serviceTypeId) => {
    return cartItems.some(item => item.service_type_id === serviceTypeId);
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
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Event Engine
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
            <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-xl font-semibold text-gray-700 mt-1">{event?.title}</p>
          </div>
        </div>

        {/* Recommended Services Section */}
        {recommendations.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recommended Services</h3>
              {recommendations.some(rec => !isInCart(rec.service_type_id)) && (
                <button
                  onClick={addAllToCart}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Add All to Cart
                </button>
              )}
            </div>
            <div className="space-y-3">
              {recommendations.map((rec) => {
                const inCart = isInCart(rec.service_type_id);
                return (
                  <div
                    key={rec.id}
                    className={`border rounded-lg p-4 flex justify-between items-center ${
                      inCart ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {rec.service_types?.name || 'Service'}
                        </h4>
                        {inCart && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                            In Cart
                          </span>
                        )}
                      </div>
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
                    {!inCart && (
                      <button
                        onClick={() => addToCart(rec.service_type_id, rec.quantity)}
                        className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cart Items Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Items in Cart</h3>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              {recommendations.length === 0 && (
                <button
                  onClick={() => navigate(`/events/${eventId}/recommendations`)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                >
                  View Recommendations
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-green-300 bg-green-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.service_types?.name || 'Service'}
                      </h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium">
                        In Cart
                      </span>
                      <button
                        onClick={() => removeFromCart(item.service_type_id)}
                        className="flex items-center justify-center w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        aria-label="Remove from cart"
                        title="Remove from cart"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-gray-900">
                    Total Items: {cartItems.length}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Review matched vendors before completing your booking.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        confirmColor={confirmDialog.confirmColor}
      />
    </div>
  );
};

export default Cart;

