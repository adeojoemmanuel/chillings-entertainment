import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

// Currency symbols mapping
const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  ZAR: 'R'
};

// Currency names mapping
const CURRENCY_NAMES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  NGN: 'Nigerian Naira',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  ZAR: 'South African Rand'
};

// Exchange rates (simplified - in production, use a real API)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1500,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 150,
  CNY: 7.2,
  INR: 83,
  ZAR: 18.5
};

export const CurrencyProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load currency from user preferences or localStorage
    if (user?.preferred_currency) {
      setCurrency(user.preferred_currency);
      localStorage.setItem('preferred_currency', user.preferred_currency);
    } else {
      const savedCurrency = localStorage.getItem('preferred_currency') || 'USD';
      setCurrency(savedCurrency);
    }
    setLoading(false);
  }, [user]);

  const updateCurrency = async (newCurrency) => {
    try {
      // Update in backend if user is logged in
      if (user) {
        await authAPI.updatePreferences({ preferred_currency: newCurrency });
        // Refresh user data from backend to ensure consistency
        if (refreshUser) {
          await refreshUser();
        } else {
          // Fallback: update local user object if refreshUser is not available
          const updatedUser = { ...user, preferred_currency: newCurrency };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      setCurrency(newCurrency);
      localStorage.setItem('preferred_currency', newCurrency);
    } catch (error) {
      console.error('Failed to update currency:', error);
      
      // Check if it's a database column error
      const errorMessage = error.response?.data?.error || error.message || '';
      if (errorMessage.includes('column not found') || errorMessage.includes('preferred_currency')) {
        const migrationDetails = error.response?.data?.details || '';
        console.error('Database migration required:', migrationDetails);
        // Show user-friendly error
        alert(`Currency preference feature requires a database update.\n\nPlease run this SQL in your Supabase SQL Editor:\n\nALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'USD';\n\nOr run the migration file: database/migration_add_preferred_currency.sql`);
        throw new Error('Database migration required. Please add the preferred_currency column to the users table.');
      }
      
      // Still update locally even if backend fails (for other errors)
      setCurrency(newCurrency);
      localStorage.setItem('preferred_currency', newCurrency);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const formatCurrency = (amount, fromCurrency = 'USD') => {
    if (amount === null || amount === undefined) return '0';
    
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(amountNum)) return '0';

    // Convert to selected currency if different
    let convertedAmount = amountNum;
    if (fromCurrency !== currency) {
      const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
      const toRate = EXCHANGE_RATES[currency] || 1;
      convertedAmount = (amountNum / fromRate) * toRate;
    }

    // Format based on currency
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    
    if (currency === 'JPY' || currency === 'KRW') {
      // No decimal places for some currencies
      return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    }
    
    return `${symbol}${convertedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getCurrencySymbol = () => {
    return CURRENCY_SYMBOLS[currency] || currency;
  };

  const getCurrencyName = (code) => {
    return CURRENCY_NAMES[code] || code;
  };

  const getAvailableCurrencies = () => {
    return Object.keys(CURRENCY_NAMES).map(code => ({
      code,
      name: CURRENCY_NAMES[code],
      symbol: CURRENCY_SYMBOLS[code]
    }));
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        updateCurrency,
        formatCurrency,
        getCurrencySymbol,
        getCurrencyName,
        getAvailableCurrencies,
        loading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

