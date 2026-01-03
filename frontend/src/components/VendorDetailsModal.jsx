import React, { useState, useEffect, useCallback } from 'react';
import { vendorsAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useCurrency } from '../context/CurrencyContext';

const VendorDetailsModal = ({ isOpen, onClose, vendorId, serviceName, serviceTypeId }) => {
  const { showError } = useNotification();
  const { formatCurrency } = useCurrency();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadVendorDetails = useCallback(async () => {
    if (!vendorId) return;
    
    try {
      setLoading(true);
      const response = await vendorsAPI.getVendorById(vendorId);
      setVendor(response.data.vendor);
    } catch (error) {
      console.error('Failed to load vendor details:', error);
      showError(error.response?.data?.error || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  }, [vendorId, showError]);

  useEffect(() => {
    if (isOpen && vendorId) {
      loadVendorDetails();
    } else {
      setVendor(null);
      setLoading(true);
    }
  }, [isOpen, vendorId, loadVendorDetails]);

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
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
                <p className="text-gray-600">Loading vendor details...</p>
              </div>
            </div>
          ) : vendor ? (
            <div className="bg-white px-6 py-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{vendor.business_name}</h3>
                    {vendor.is_verified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-2xl font-bold text-gray-900">{vendor.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {vendor.events_hosted_count || 0} {vendor.events_hosted_count === 1 ? 'Event' : 'Events'} Hosted
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {vendor.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700">{vendor.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {vendor.email && (
                    <div className="flex items-center text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Email Address</div>
                        <a href={`mailto:${vendor.email}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                          {vendor.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Phone Number</div>
                        <a href={`tel:${vendor.phone}`} className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
                          {vendor.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-start text-gray-700">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Address</div>
                        <div className="text-lg font-semibold text-gray-900">{vendor.address}</div>
                        {vendor.cities && (
                          <div className="text-sm text-gray-600 mt-1">
                            {vendor.cities.name}{vendor.cities.state ? `, ${vendor.cities.state}` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h4>
                {vendor.vendor_services && vendor.vendor_services.length > 0 ? (
                  (() => {
                    // Filter to show only the specific service for this checkout
                    const relevantService = vendor.vendor_services.find(
                      service => service.service_type_id === serviceTypeId && service.is_active
                    ) || vendor.vendor_services.find(service => service.is_active);

                    if (!relevantService) {
                      return <p className="text-gray-500">Service details not available.</p>;
                    }

                    return (
                      <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="text-xl font-bold text-gray-900 mb-2">
                              {serviceName || relevantService.service_types?.name || 'Service'}
                            </h5>
                            {relevantService.service_types?.description && (
                              <p className="text-sm text-gray-700 mb-4">{relevantService.service_types.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {relevantService.service_types?.category && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 capitalize">
                                  {relevantService.service_types.category}
                                </span>
                              )}
                              {relevantService.unit_type && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                  {relevantService.unit_type.replace('_', ' ')}
                                </span>
                              )}
                              {relevantService.min_quantity && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                  Min Quantity: {relevantService.min_quantity}
                                </span>
                              )}
                              {relevantService.max_quantity && (
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                  Max Quantity: {relevantService.max_quantity}
                                </span>
                              )}
                            </div>
                            {relevantService.availability_start || relevantService.availability_end ? (
                              <div className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">Availability:</span>{' '}
                                {relevantService.availability_start ? new Date(relevantService.availability_start).toLocaleDateString() : 'Any'} - {relevantService.availability_end ? new Date(relevantService.availability_end).toLocaleDateString() : 'Any'}
                              </div>
                            ) : null}
                          </div>
                          <div className="text-right ml-6">
                            {relevantService.price_per_unit ? (
                              <div>
                                <div className="text-3xl font-bold text-indigo-600 mb-1">
                                  {formatCurrency(relevantService.price_per_unit)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  per {relevantService.unit_type?.replace('_', ' ') || 'unit'}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">Price on request</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-gray-500">Service details not available.</p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">Failed to load vendor details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;

