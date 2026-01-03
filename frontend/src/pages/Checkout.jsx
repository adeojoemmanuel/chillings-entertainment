import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useCurrency } from '../context/CurrencyContext';
import ConfirmDialog from '../components/ConfirmDialog';
import VendorDetailsModal from '../components/VendorDetailsModal';

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { formatCurrency } = useCurrency();
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingCheckout, setCompletingCheckout] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'indigo'
  });

  const loadCheckoutPreview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getCheckoutPreview(eventId);
      setCheckoutData(response.data);
    } catch (error) {
      console.error('Failed to load checkout preview:', error);
      showError(error.response?.data?.error || 'Failed to load checkout preview');
      // Navigate back to cart if preview fails
      setTimeout(() => {
        navigate(`/events/${eventId}/cart`);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [eventId, navigate, showError]);

  useEffect(() => {
    loadCheckoutPreview();
  }, [loadCheckoutPreview]);

  const handleCompleteCheckout = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Complete Checkout',
      message: 'Are you sure you want to complete the checkout? This will finalize your booking with the matched vendors.',
      onConfirm: async () => {
        setCompletingCheckout(true);
        try {
          await eventsAPI.checkout(eventId);
          showSuccess('Checkout completed successfully! Your event has been booked.');
          setTimeout(() => {
            navigate(`/events/${eventId}`);
          }, 1500);
        } catch (error) {
          showError(error.response?.data?.error || 'Checkout failed');
        } finally {
          setCompletingCheckout(false);
        }
      },
      confirmText: 'Complete Checkout',
      cancelText: 'Cancel',
      confirmColor: 'indigo'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout preview...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load checkout preview.</p>
          <button
            onClick={() => navigate(`/events/${eventId}/cart`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const { matches, validation, total_cost, event_title } = checkoutData;
  const matchedVendors = matches.filter(m => m.vendor_id);
  const unmatchedServices = matches.filter(m => !m.vendor_id);

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
                onClick={() => navigate(`/events/${eventId}/cart`)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 text-gray-700 hover:text-indigo-600 border border-gray-200"
                aria-label="Back to cart"
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
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
          <p className="text-xl font-semibold text-gray-700 mt-1">{event_title}</p>
        </div>

        {/* Matched Vendors Section */}
        {matchedVendors.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Matched Vendors</h3>
            <div className="space-y-4">
              {matchedVendors.map((match, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedVendorId(match.vendor_id);
                    setShowVendorModal(true);
                  }}
                  className="border border-green-200 bg-green-50 rounded-lg p-6 cursor-pointer transition-colors transition-shadow duration-200 hover:border-green-300 hover:bg-green-100 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{match.service_name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold">{match.vendor_name}</span>
                          <span className="ml-2 text-xs text-indigo-600 font-medium">(Click to view details)</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {match.vendor_email ? (
                            <a 
                              href={`mailto:${match.vendor_email}`} 
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {match.vendor_email}
                            </a>
                          ) : (
                            <span className="text-gray-500 italic">Email not available</span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {match.vendor_phone ? (
                            <a 
                              href={`tel:${match.vendor_phone}`} 
                              className="text-indigo-600 hover:text-indigo-800 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {match.vendor_phone}
                            </a>
                          ) : (
                            <span className="text-gray-500 italic">Phone not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600 mb-1">Quantity: {match.quantity}</div>
                      <div className="text-sm text-gray-600 mb-1">Unit Price: {formatCurrency(match.unit_price)}</div>
                      <div className="text-lg font-bold text-indigo-600">{formatCurrency(match.total_price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unmatched Services Warning */}
        {unmatchedServices.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">⚠️ Services Without Matched Vendors</h3>
            <div className="space-y-2">
              {unmatchedServices.map((match, index) => (
                <div key={index} className="text-yellow-800">
                  <span className="font-semibold">{match.service_name}</span> - No matching vendor found
                </div>
              ))}
            </div>
            <p className="text-sm text-yellow-700 mt-4">
              You cannot complete checkout until all services have matched vendors. Please remove these services or try again later.
            </p>
          </div>
        )}

        {/* Summary and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Cost</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{formatCurrency(total_cost)}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Matched: {validation.matched_count} / {matches.length}
              </div>
              {validation.unmatched_count > 0 && (
                <div className="text-sm text-yellow-600 mt-1">
                  Unmatched: {validation.unmatched_count}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/events/${eventId}/cart`)}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
            >
              Back to Cart
            </button>
            <button
              onClick={handleCompleteCheckout}
              disabled={completingCheckout || !validation.all_matched}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
            >
              {completingCheckout ? 'Processing...' : 'Complete Checkout'}
            </button>
          </div>
          {!validation.all_matched && (
            <p className="text-sm text-yellow-600 mt-4 text-center">
              Please ensure all services have matched vendors before completing checkout.
            </p>
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

      {/* Vendor Details Modal */}
      {selectedVendorId && (() => {
        const selectedMatch = matchedVendors.find(m => m.vendor_id === selectedVendorId);
        return (
          <VendorDetailsModal
            isOpen={showVendorModal}
            onClose={() => {
              setShowVendorModal(false);
              setSelectedVendorId(null);
            }}
            vendorId={selectedVendorId}
            serviceName={selectedMatch?.service_name}
            serviceTypeId={selectedMatch?.service_type_id}
          />
        );
      })()}
    </div>
  );
};

export default Checkout;

