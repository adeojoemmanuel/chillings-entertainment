import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();

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
              <Link
                to="/"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h1>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to the Chillings Entertainment Help Center. Find answers to common questions and learn how to use our platform.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Create an account to start organizing events</li>
              <li>Register as a vendor to offer your services</li>
              <li>Browse events and discover amazing experiences</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I create an event?</h3>
                <p className="text-gray-600">Go to your dashboard and click "Create Event". Fill in the event details and our system will generate service recommendations.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How does vendor matching work?</h3>
                <p className="text-gray-600">After adding services to your cart, proceed to checkout. Our system automatically matches each service with available vendors in your event location.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Can I register as a vendor?</h3>
                <p className="text-gray-600">Yes! Go to the vendor registration page from your dashboard to start offering your services to event organizers.</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Need more help?</strong> Contact our support team at{' '}
                <a href="mailto:support@chillingsentertainment.com" className="text-indigo-600 hover:text-indigo-700">
                  support@chillingsentertainment.com
                </a>
                {' '}or visit our <Link to="/contact" className="text-indigo-600 hover:text-indigo-700">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

