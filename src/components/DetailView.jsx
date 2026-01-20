import Header from '@stevederico/skateboard-ui/Header';
import DynamicIcon from '@stevederico/skateboard-ui/DynamicIcon';
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '@stevederico/skateboard-ui/Utilities';
import { trackEvent } from '../utils/analytics';

/**
 * Detail view component for individual rental listing
 *
 * Features:
 * - Photo gallery with horizontal scroll
 * - Property info (title, location, beds/baths/sqft)
 * - Price display with night calculation
 * - Check-in/check-out date inputs
 * - Reserve button
 * - Amenities list
 * - Policies (rental, cancellation, house rules)
 * - Host contact info
 *
 * @component
 * @returns {JSX.Element} Detail view with full listing info
 */
export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState(0);
  const viewStartTime = useRef(Date.now());

  useEffect(() => {
    trackEvent('page-viewed', { page: 'detail', listingId: id });
    viewStartTime.current = Date.now();

    const fetchListing = async () => {
      try {
        const data = await apiRequest(`/listings/${id}`);
        setListing(data);
        trackEvent('listing-viewed', {
          listingId: id,
          title: data.title?.substring(0, 100),
          price: data.price,
          location: data.location?.substring(0, 100),
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms
        });
      } catch (err) {
        setError(err.message);
        trackEvent('listing-view-failed', { listingId: id, error: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchListing();

    // Track view duration on unmount
    return () => {
      const duration = Date.now() - viewStartTime.current;
      trackEvent('listing-view-duration', {
        listingId: id,
        durationMs: duration,
        durationSec: Math.round(duration / 1000)
      });
    };
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);

      if (diff > 0) {
        trackEvent('dates-selected', {
          listingId: id,
          nights: diff,
          totalPrice: listing?.price ? listing.price * diff : 0
        });
      }
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut, id, listing?.price]);

  /**
   * Format price for display
   * @param {number} price - Price in dollars
   * @returns {string} Formatted price string
   */
  const formatPrice = (price) => {
    if (!price) return '$0';
    return `$${price.toLocaleString()}`;
  };

  /**
   * Handle reserve button click
   */
  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      trackEvent('reserve-validation-failed', {
        listingId: id,
        reason: 'missing-dates'
      });
      alert('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      trackEvent('reserve-validation-failed', {
        listingId: id,
        reason: 'invalid-dates'
      });
      alert('Check-out must be after check-in');
      return;
    }

    const totalPrice = listing.price * nights;
    trackEvent('reserve-clicked', {
      listingId: id,
      title: listing.title?.substring(0, 100),
      nights: nights,
      pricePerNight: listing.price,
      totalPrice: totalPrice,
      checkIn: checkIn,
      checkOut: checkOut
    });

    alert(`Booking request submitted for ${nights} nights. Total: ${formatPrice(totalPrice)}`);
  };

  /**
   * Handle host contact click
   */
  const handleHostContact = (method) => {
    trackEvent('host-contacted', {
      listingId: id,
      method: method
    });
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." backButton onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app"></div>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Header title="Error" backButton onBack={() => navigate(-1)} />
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <DynamicIcon name="alert-circle" size={48} className="text-red-500 mb-4" />
          <p className="text-red-500">{error || 'Listing not found'}</p>
          <button
            onClick={() => navigate('/app/home')}
            className="mt-4 px-4 py-2 bg-app text-white rounded-lg"
          >
            Back to Listings
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={listing.title} backButton onBack={() => navigate(-1)} />

      <div className="flex flex-col bg-background pb-24">
        {/* Photo Gallery */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 p-4 min-w-max">
            {listing.photos?.length > 0 ? (
              listing.photos.map((photo, index) => (
                <div key={index} className="w-80 h-60 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={photo}
                    alt={`${listing.title} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-80 h-60 flex-shrink-0 rounded-xl bg-accent flex items-center justify-center">
                <DynamicIcon name="image" size={48} className="opacity-30" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Title & Location */}
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <DynamicIcon name="map-pin" size={16} />
              {listing.location}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 border-y border-accent">
            {listing.bedrooms && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <DynamicIcon name="bed" size={20} />
                  <span className="text-xl font-semibold">{listing.bedrooms}</span>
                </div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
            )}
            {listing.bathrooms && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <DynamicIcon name="bath" size={20} />
                  <span className="text-xl font-semibold">{listing.bathrooms}</span>
                </div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </div>
            )}
            {listing.sqft && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <DynamicIcon name="square" size={20} />
                  <span className="text-xl font-semibold">{listing.sqft.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Sq Ft</p>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.summary && (
            <div>
              <h2 className="text-lg font-semibold mb-2">About this place</h2>
              <p className="text-muted-foreground leading-relaxed">{listing.summary}</p>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <DynamicIcon name="check" size={16} className="text-app" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          <div className="space-y-4">
            {listing.rentalPolicy && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Rental Policy</h2>
                <p className="text-muted-foreground text-sm">{listing.rentalPolicy}</p>
              </div>
            )}
            {listing.cancellationPolicy && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Cancellation Policy</h2>
                <p className="text-muted-foreground text-sm">{listing.cancellationPolicy}</p>
              </div>
            )}
            {listing.houseRules && (
              <div>
                <h2 className="text-lg font-semibold mb-2">House Rules</h2>
                <p className="text-muted-foreground text-sm">{listing.houseRules}</p>
              </div>
            )}
          </div>

          {/* Host Info */}
          {listing.host && (
            <div className="bg-accent rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3">Host</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-app/20 flex items-center justify-center">
                  <DynamicIcon name="user" size={24} className="text-app" />
                </div>
                <div>
                  <p className="font-medium">{listing.host.name}</p>
                  {listing.host.email && (
                    <a
                      href={`mailto:${listing.host.email}`}
                      onClick={() => handleHostContact('email')}
                      className="text-sm text-app"
                    >
                      {listing.host.email}
                    </a>
                  )}
                  {listing.host.phone && (
                    <p className="text-sm text-muted-foreground">{listing.host.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Booking Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-accent p-4 safe-area-pb">
        <div className="max-w-2xl mx-auto">
          {/* Date Inputs */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-accent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-app"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-accent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-app"
              />
            </div>
          </div>

          {/* Price & Reserve */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-app">{formatPrice(listing.price)}</span>
                <span className="text-muted-foreground">/ night</span>
              </div>
              {nights > 0 && (
                <p className="text-sm text-muted-foreground">
                  {nights} night{nights > 1 ? 's' : ''} = {formatPrice(listing.price * nights)} total
                </p>
              )}
            </div>
            <button
              onClick={handleReserve}
              className="px-6 py-3 bg-app text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
