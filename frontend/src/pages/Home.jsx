import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { eventsAPI, vendorsAPI, sponsorsAPI } from '../services/api';
import SponsorForm from '../components/SponsorForm';
import EventDetailsModal from '../components/EventDetailsModal';

const Home = () => {
  const { user, logout } = useAuth();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();
  // Notification context available if needed
  // const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState('home');
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(false);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Refs to prevent duplicate calls in React StrictMode
  const loadingRef = useRef({});

  useEffect(() => {
    if (activeTab === 'events') {
      if (!loadingRef.current.events) {
        loadingRef.current.events = true;
        loadEvents().finally(() => {
          loadingRef.current.events = false;
        });
      }
    } else if (activeTab === 'organizers') {
      if (!loadingRef.current.organizers) {
        loadingRef.current.organizers = true;
        loadOrganizers().finally(() => {
          loadingRef.current.organizers = false;
        });
      }
    } else if (activeTab === 'affiliates') {
      if (!loadingRef.current.sponsors) {
        loadingRef.current.sponsors = true;
        loadSponsors().finally(() => {
          loadingRef.current.sponsors = false;
        });
      }
    } else if (activeTab === 'home') {
      if (!loadingRef.current.home) {
        loadingRef.current.home = true;
        loadHomeData().finally(() => {
          loadingRef.current.home = false;
        });
      }
    } else if (activeTab === 'account' && user) {
      if (!loadingRef.current.userEvents) {
        loadingRef.current.userEvents = true;
        loadUserEvents().finally(() => {
          loadingRef.current.userEvents = false;
        });
      }
    }
  }, [activeTab, user]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getAllEvents();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizers = async () => {
    setLoading(true);
    try {
      const response = await vendorsAPI.getTopOrganizers();
      console.log('Organizers response:', response.data); // Debug log
      setOrganizers(response.data?.organizers || []);
    } catch (error) {
      console.error('Failed to load organizers:', error);
      setOrganizers([]); // Ensure organizers is set to empty array on error
      // Optionally show error notification if you have notification context
    } finally {
      setLoading(false);
    }
  };

  const loadHomeData = async () => {
    setHomeLoading(true);
    try {
      const response = await eventsAPI.getAllEvents();
      const allEvents = response.data.events || [];
      
      // Set featured event (first event or first upcoming event)
      const upcomingEvents = allEvents.filter(event => new Date(event.event_date) > new Date());
      if (upcomingEvents.length > 0) {
        setFeaturedEvent(upcomingEvents[0]);
      } else if (allEvents.length > 0) {
        setFeaturedEvent(allEvents[0]);
      }
      
      // Set events for Upcoming Shows section
      setEvents(allEvents);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setHomeLoading(false);
    }
  };

  const loadSponsors = async () => {
    setLoading(true);
    try {
      const response = await sponsorsAPI.getSponsors();
      setSponsors(response.data.sponsors || []);
    } catch (error) {
      console.error('Failed to load sponsors:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleAccountClick = () => {
    if (user) {
      setActiveTab('account');
    } else {
      navigate('/login');
    }
  };

  const loadUserEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsAPI.getUserEvents();
      setUserEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to load user events:', error);
      setUserEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <img src="/chilling.png" alt="Chillings" className="h-14 w-auto drop-shadow-md hover:drop-shadow-lg transition-all duration-200" />
              <h1 className="h-14 flex items-center text-3xl font-bold text-gray-800">
                Entertainment
              </h1>
            </Link>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'home'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('affiliates')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'affiliates'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Affiliates
              </button>
              <button
                onClick={() => setActiveTab('organizers')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'organizers'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Organizers
              </button>
              {user && (
                <button
                  onClick={handleAccountClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'account'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Account
                </button>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
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

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto px-4 space-x-2 py-2">
          {['home', 'events', 'affiliates', 'organizers', ...(user ? ['account'] : [])].map((tab) => (
            <button
              key={tab}
              onClick={() => tab === 'account' ? handleAccountClick() : setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Video Background Banner - Full Width */}
      {activeTab === 'home' && (
        <div className="relative w-full overflow-hidden" style={{ minHeight: '70vh', height: '70vh' }}>
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="w-full h-full object-cover scale-110"
              src="https://www.youtube.com/embed/6DsGyXaGRzw?start=30&autoplay=1&mute=1&loop=1&playlist=6DsGyXaGRzw&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
              title="Chilling Entertainment Video Background"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ pointerEvents: 'none' }}
            ></iframe>
          </div>
          
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
          
          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-4 animate-fade-in max-w-5xl mx-auto">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl animate-slide-down">
                Welcome to
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-2xl animate-slide-down animation-delay-200">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Chilling Entertainment
                </span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-lg animate-slide-up animation-delay-300">
                All your favorite events in one place. Discover, plan, and organize amazing experiences.
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up animation-delay-400">
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg backdrop-blur-sm border-2 border-white/30"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white/95 backdrop-blur-sm text-indigo-600 px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg border-2 border-white"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up animation-delay-400">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="bg-white/95 backdrop-blur-sm text-indigo-600 px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg border-2 border-white flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Marquee Text Section */}
      {activeTab === 'home' && (
        <div className="relative w-full overflow-hidden bg-white">
          {/* First Marquee Section - Left to Right */}
          <section className="relative w-full py-1 md:py-2 overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <div className="marquee-container">
              <div className="marquee-wrapper marquee-forward">
                <div className="marquee-content">
                  <span className="marquee-text">Discover Live Entertainment Like Never Before - Top Artists, Unforgettable Shows!</span>
                </div>
                <div className="marquee-content">
                  <span className="marquee-text">Discover Live Entertainment Like Never Before - Top Artists, Unforgettable Shows!</span>
                </div>
                <div className="marquee-content">
                  <span className="marquee-text">Discover Live Entertainment Like Never Before - Top Artists, Unforgettable Shows!</span>
                </div>
              </div>
            </div>
          </section>

          {/* Second Marquee Section - Right to Left */}
          <section className="relative w-full py-1 md:py-2 overflow-hidden bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50">
            <div className="marquee-container">
              <div className="marquee-wrapper marquee-reverse">
                <div className="marquee-content">
                  <span className="marquee-text">Your Gateway to Unforgettable Concerts and Performances!</span>
                </div>
                <div className="marquee-content">
                  <span className="marquee-text">Your Gateway to Unforgettable Concerts and Performances!</span>
                </div>
                <div className="marquee-content">
                  <span className="marquee-text">Your Gateway to Unforgettable Concerts and Performances!</span>
                </div>
                <div className="marquee-content">
                  <span className="marquee-text">Your Gateway to Unforgettable Concerts and Performances!</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            {homeLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                  </div>
                </div>
                <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">Loading amazing events...</p>
              </div>
            ) : (
              <>

            {/* Featured Event */}
            {featuredEvent && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden mb-12 animate-fade-in-up">
                <div className="p-8 md:p-12 text-white">
                  <div className="max-w-3xl">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{featuredEvent.title}</h3>
                    <p className="text-lg md:text-xl text-indigo-100 mb-6">
                      {featuredEvent.description || 'Get ready for an amazing experience!'}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(featuredEvent.event_date).toLocaleDateString()}</span>
                      </div>
                      {featuredEvent.cities && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{featuredEvent.cities.name}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{featuredEvent.expected_attendees} tickets</span>
                      </div>
                    </div>
                    {user ? (
                      <button
                        onClick={() => {
                          setSelectedEventId(featuredEvent.id);
                          setShowEventModal(true);
                        }}
                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200"
                      >
                        View Details
                      </button>
                    ) : (
                      <Link
                        to="/register"
                        className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transform hover:scale-105 transition-all duration-200"
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Shows Section */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Shows</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                  .filter(event => new Date(event.event_date) > new Date()) // Only future events
                  .sort((a, b) => new Date(a.event_date) - new Date(b.event_date)) // Sort by date, soonest first
                  .slice(0, 6)
                  .map((event, index) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    {event.poster_url && (
                      <div className="w-full h-40 overflow-hidden bg-gray-200">
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
                      <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                      {event.event_type && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize mb-2">
                          {event.event_type.replace('_', ' ')}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mb-4">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                      {event.cities && (
                        <p className="text-sm text-gray-500 mb-4">{event.cities.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-indigo-600">
                          {event.expected_attendees} tickets
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(event.price || 0)}
                          </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                          {event.is_paid ? 'Paid' : 'Free'}
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">All Events</h2>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No events available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setShowEventModal(true);
                    }}
                  >
                    <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    {event.poster_url && (
                      <div className="w-full h-40 overflow-hidden bg-gray-200">
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
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                      {event.event_type && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize mb-2">
                          {event.event_type.replace('_', ' ')}
                        </span>
                      )}
                      <p className="text-sm text-gray-600 mb-4">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                      {event.cities && (
                        <p className="text-sm text-gray-500 mb-4">{event.cities.name}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-indigo-600">
                          {event.expected_attendees} tickets
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrency(event.price || 0)}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                          {event.is_paid ? 'Paid' : 'Free'}
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Affiliates Tab */}
        {activeTab === 'affiliates' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Sponsors & Affiliates</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner With Us</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We work with amazing sponsors and affiliates to bring you the best events. 
                  Interested in becoming a partner? Get in touch with us!
                </p>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : sponsors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No sponsors available at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  {sponsors.map((sponsor, index) => (
                    <div
                      key={sponsor.id}
                      className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-6 flex flex-col items-center justify-center min-h-32 animate-fade-in-up hover:shadow-lg transition-shadow duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {sponsor.logo_url ? (
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.company_name}
                          className="w-16 h-16 object-contain mb-2 rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center ${sponsor.logo_url ? 'hidden' : ''}`}>
                        <span className="text-white font-bold text-xl">
                          {sponsor.company_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 text-center line-clamp-2">
                        {sponsor.company_name}
                      </p>
                      {sponsor.sponsorship_level && (
                        <span className="mt-2 px-2 py-1 text-xs font-medium rounded-full bg-indigo-200 text-indigo-800 capitalize">
                          {sponsor.sponsorship_level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowSponsorForm(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Become a Sponsor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sponsor Application Form */}
        <SponsorForm
          isOpen={showSponsorForm}
          onClose={() => setShowSponsorForm(false)}
          onSuccess={() => loadSponsors()}
        />

        {/* Organizers Tab */}
        {activeTab === 'organizers' && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Organizers</h2>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : organizers.length === 0 ? (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Organizers Yet</h3>
                  <p className="text-gray-600 mb-4">There are no event organizers available at the moment.</p>
                  <p className="text-sm text-gray-500">Organizers will appear here once they start creating events.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizers.map((organizer, index) => (
                  <div
                    key={organizer.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-gray-900 truncate">{organizer.full_name}</h4>
                        <div className="mt-2 flex items-center">
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                            {organizer.event_count} {organizer.event_count === 1 ? 'Event' : 'Events'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && user && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Account</h2>
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{user.full_name || 'User'}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">{user.role || 'User'}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/account')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* User Events Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Events</h3>
                <button
                  onClick={() => navigate('/create-event')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Event</span>
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : userEvents.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg mb-4">You haven't created any events yet.</p>
                  <button
                    onClick={() => navigate('/create-event')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                  >
                    Create Your First Event
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEventId(event.id);
                        setShowEventModal(true);
                      }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">{event.title}</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        {event.event_date && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {event.area && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.area}</span>
                          </div>
                        )}
                        {event.expected_attendees && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{event.expected_attendees} attendees</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">{formatCurrency(event.price || 0)}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          event.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : event.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {event.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Chilling Entertainment
                </h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Your gateway to unforgettable concerts and performances. Discover, plan, and organize amazing experiences all in one place.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.626-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('organizers')}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                  >
                    Organizers
                  </button>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Chilling Entertainment. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Made with</span>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 text-sm">for event organizers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEventId(null);
        }}
        eventId={selectedEventId}
      />
    </div>
  );
};

export default Home;

