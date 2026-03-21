import Header from '@stevederico/skateboard-ui/Header';
import DynamicIcon from '@stevederico/skateboard-ui/DynamicIcon';
import { useEffect, useState } from "react";
import { apiRequest } from '@stevederico/skateboard-ui/Utilities';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

/**
 * Home view component displaying rental listings grid with search
 *
 * Features:
 * - Fetches listings from /listings endpoint
 * - Search filtering by title, location, summary
 * - Responsive card grid layout
 * - Links to detail pages at /app/r/:id
 *
 * @component
 * @returns {JSX.Element} Home view with listings grid
 */
export default function HomeView() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiRequest('/listings');
        setListings(data);
        setFilteredListings(data);
        trackEvent('listings-loaded', { count: data.length });
      } catch (err) {
        setError(err.message);
        trackEvent('listings-load-failed', { error: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredListings(listings);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = listings.filter(listing =>
      listing.title?.toLowerCase().includes(query) ||
      listing.location?.toLowerCase().includes(query) ||
      listing.summary?.toLowerCase().includes(query)
    );
    setFilteredListings(filtered);

    // Track search after debounce
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        trackEvent('search-performed', {
          query: searchQuery.substring(0, 100),
          resultsCount: filtered.length
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, listings]);

  /**
   * Handle listing card click for analytics
   * @param {Object} listing - Listing object
   */
  const handleListingClick = (listing) => {
    trackEvent('listing-clicked', {
      listingId: listing._id,
      title: listing.title?.substring(0, 100),
      price: listing.price,
      location: listing.location?.substring(0, 100)
    });
  };

  /**
   * Format price for display
   * @param {number} price - Price in dollars
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    if (!price) return '$0';
    return `$${price.toLocaleString()}`;
  };

  return (
    <>
      <Header title="Rentals" />

      <div className="flex flex-col h-screen bg-background">
        {/* Search */}
        <div data-section-id="search-bar" className="p-4 border-b bg-background">
          <div className="relative">
            <DynamicIcon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rentals..."
              data-umami-event="search-input-focused"
              className="w-full pl-11 pr-4 py-3 bg-accent border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-app"
            />
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Error loading listings: {error}</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-8 opacity-60">
              <DynamicIcon name="home" size={48} className="mx-auto mb-4 opacity-40" />
              <p>{searchQuery ? 'No rentals match your search' : 'No rentals available'}</p>
            </div>
          ) : (
            <div data-section-id="listings-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/app/r/${listing._id}`}
                  onClick={() => handleListingClick(listing)}
                  data-umami-event="listing-card-clicked"
                  className="group bg-accent rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {listing.photos?.[0] ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DynamicIcon name="image" size={32} className="opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                    <p className="text-muted-foreground text-sm truncate">{listing.location}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      {listing.bedrooms && (
                        <span className="flex items-center gap-1">
                          <DynamicIcon name="bed" size={14} />
                          {listing.bedrooms}
                        </span>
                      )}
                      {listing.bathrooms && (
                        <span className="flex items-center gap-1">
                          <DynamicIcon name="bath" size={14} />
                          {listing.bathrooms}
                        </span>
                      )}
                      {listing.sqft && (
                        <span className="flex items-center gap-1">
                          <DynamicIcon name="square" size={14} />
                          {listing.sqft.toLocaleString()} sqft
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-xl font-bold text-app">{formatPrice(listing.price)}</span>
                      <span className="text-muted-foreground text-sm">/ night</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
