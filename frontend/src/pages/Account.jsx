import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotification } from '../context/NotificationContext';

const Account = () => {
  const { user, logout } = useAuth();
  const { currency, updateCurrency, getAvailableCurrencies } = useCurrency();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(user?.preferred_currency || currency || 'USD');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Update selectedCurrency when user's preferred_currency changes
    if (user?.preferred_currency) {
      setSelectedCurrency(user.preferred_currency);
    } else if (currency) {
      setSelectedCurrency(currency);
    }
  }, [user?.preferred_currency, currency]);

  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    const previousCurrency = selectedCurrency;
    setSelectedCurrency(newCurrency);
    setSaving(true);
    
    try {
      // Update currency in backend and refresh user data
      await updateCurrency(newCurrency);
      showNotification(
        `Currency preference updated to ${getAvailableCurrencies().find(c => c.code === newCurrency)?.name || newCurrency}!`,
        'success'
      );
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.error || 'Failed to update currency preference';
      
      // Check if it's a migration error
      if (errorMessage.includes('migration') || errorMessage.includes('column')) {
        const details = error.response?.data?.details || '';
        showNotification(
          `Database migration required. ${details ? 'Check console for SQL command.' : 'Please contact administrator.'}`,
          'error'
        );
      } else {
        showNotification(errorMessage, 'error');
      }
      // Revert to previous currency on error
      setSelectedCurrency(previousCurrency);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currencies = getAvailableCurrencies();

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
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
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

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h2>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        {/* Account Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{user?.full_name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {user?.phone && (
                  <p className="text-sm text-gray-600">{user.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Currency Preference Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Currency Preference
          </h3>
          
          <p className="text-gray-600 mb-4">
            Select your preferred currency. This will be saved as your default currency and used to display prices throughout the application.
          </p>

          <div className="max-w-md">
            <label htmlFor="currency-select" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Currency
            </label>
            <select
              id="currency-select"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
            
            {saving && (
              <p className="mt-2 text-sm text-indigo-600 flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving your preference...
              </p>
            )}
            
            {!saving && user?.preferred_currency && selectedCurrency === user.preferred_currency && (
              <p className="mt-2 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your default currency preference has been saved
              </p>
            )}
          </div>

          {/* Currency Preview */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-indigo-600">
                {currencies.find(c => c.code === selectedCurrency)?.symbol || '$'}
              </span>
              <span className="text-lg text-gray-700">1,234.56</span>
              <span className="text-sm text-gray-500">({selectedCurrency})</span>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Additional Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Account Role</p>
                <p className="text-sm text-gray-600 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

