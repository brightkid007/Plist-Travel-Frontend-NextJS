import MapFinder from "@/components/common/MapFinder";
import { useEffect, useRef, useState, useCallback } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { getUserAddresses } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const Location = ({ address = {}, onUpdate }) => {
  const { googleLoaded, error } = useGoogleMaps();
  const { user } = useAuth();
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [useAutocomplete, setUseAutocomplete] = useState(false); // Default to dropdown (false = use saved addresses)

  // Load saved addresses from profile
  const loadSavedAddresses = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoadingAddresses(true);
      const response = await getUserAddresses(user.id);
      const addrList = response?.data || response || [];
      const addressesArray = Array.isArray(addrList) ? addrList : [];
      setSavedAddresses(addressesArray);
    } catch (err) {
      console.error('Error loading saved addresses:', err);
      toast.error('Failed to load saved addresses');
    } finally {
      setLoadingAddresses(false);
    }
  }, [user]);

  useEffect(() => {
    loadSavedAddresses();
  }, [loadSavedAddresses]);

  // Log error if any
  useEffect(() => {
    if (error) {
      console.warn('Google Maps API error:', error);
    }
  }, [error]);

  // Store onUpdate in a ref to avoid recreating autocomplete on every render
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  // Initialize Google Places Autocomplete (only when useAutocomplete is true)
  useEffect(() => {
    if (!useAutocomplete) {
      // Clean up autocomplete if switching away from autocomplete mode
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        } catch (error) {
          console.error('Error clearing autocomplete listeners:', error);
        }
      }
      return;
    }

    if (!googleLoaded || !window.google?.maps?.places) {
      return;
    }

    const initializeAutocomplete = () => {
      // Use ref first, fallback to getElementById
      const inputElement = inputRef.current || document.getElementById('listing-address-autocomplete');
      if (!inputElement) {
        return false;
      }

      // Clean up existing autocomplete if it exists
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (error) {
          console.error('Error clearing existing autocomplete listeners:', error);
        }
        autocompleteRef.current = null;
      }

      try {
        console.log('Initializing Google Places Autocomplete on element:', inputElement);
        const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.address_components || !onUpdateRef.current) {
            return;
          }

          const addressComponents = place.address_components;
          let streetNumber = '';
          let route = '';
          let city = '';
          let state = '';
          let zipCode = '';
          let country = '';
          let region = '';

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            }
            if (types.includes('route')) {
              route = component.long_name;
            }
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_2') && !city) {
              city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
              // Region is the long name of administrative_area_level_1
              if (!region) {
                region = component.long_name;
              }
            }
            if (types.includes('postal_code')) {
              zipCode = component.long_name;
            }
            if (types.includes('country')) {
              country = component.long_name;
            }
          });

          // Combine street number and route
          const fullStreet = [streetNumber, route].filter(Boolean).join(' ').trim();

          // Update all address fields using the ref to get the latest onUpdate
          const update = onUpdateRef.current;
          if (update) {
            // Clear location_address_id when using autocomplete (manual entry)
            update('location_address_id', null);
            if (fullStreet) {
              update('line1', fullStreet);
            } else if (place.formatted_address) {
              update('line1', place.formatted_address);
            }
            if (city) update('city', city);
            if (state) update('state', state);
            if (zipCode) update('postal_code', zipCode);
            if (country) update('country', country);
            if (region) update('region', region);
          }
        });

        autocompleteRef.current = autocomplete;
        return true;
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
        return false;
      }
    };

    // Initialize autocomplete when input is available
    // Retry mechanism to handle React rendering delays
    let retryTimer = null;
    let attemptCount = 0;
    const maxAttempts = 20; // Increased attempts for reliability

    const tryInitialize = () => {
      // Check if we should still be in autocomplete mode
      if (!useAutocomplete) {
        return;
      }

      attemptCount++;
      const inputElement = inputRef.current || document.getElementById('listing-address-autocomplete');
      
      if (inputElement) {
        const success = initializeAutocomplete();
        if (success) {
          console.log('Google Places Autocomplete initialized successfully');
          return; // Successfully initialized, stop retrying
        }
      }

      // Retry if element not found and we haven't exceeded max attempts
      if (attemptCount < maxAttempts && useAutocomplete) {
        retryTimer = setTimeout(() => {
          tryInitialize();
        }, 100);
      } else if (attemptCount >= maxAttempts) {
        console.warn('Failed to initialize autocomplete after', maxAttempts, 'attempts');
      }
    };

    // Start initialization with a small delay to allow React to render
    // Use requestAnimationFrame for better timing with React's render cycle
    const initTimer = requestAnimationFrame(() => {
      setTimeout(() => {
        tryInitialize();
      }, 100);
    });

    // Cleanup function
    return () => {
      cancelAnimationFrame(initTimer);
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (autocompleteRef.current && window.google?.maps?.event) {
        try {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (error) {
          console.error('Error clearing autocomplete listeners:', error);
        }
        autocompleteRef.current = null;
      }
    };
  }, [googleLoaded, useAutocomplete]);

  const handleChange = (field, value) => {
    if (onUpdate) {
      // When manually editing address fields, clear location_address_id
      // since we're no longer using a saved address
      if (field !== 'location_address_id' && address?.location_address_id) {
        onUpdate('location_address_id', null);
      }
      onUpdate(field, value);
    }
  };

  // Handle address selection from dropdown
  const handleAddressSelect = (addressId) => {
    if (!addressId || addressId === "") {
      // Clear address if "Select an address" is selected
      if (onUpdate) {
        onUpdate('location_address_id', null);
        onUpdate('line1', '');
        onUpdate('city', '');
        onUpdate('state', '');
        onUpdate('postal_code', '');
        onUpdate('country', '');
        onUpdate('region', '');
      }
      return;
    }

    const selectedAddress = savedAddresses.find(addr => addr.id === parseInt(addressId));
    if (selectedAddress && onUpdate) {
      // Set the location_address_id first
      onUpdate('location_address_id', parseInt(addressId));
      // Map backend fields to frontend fields
      onUpdate('line1', selectedAddress.line1 || selectedAddress.street || '');
      onUpdate('city', selectedAddress.city || '');
      onUpdate('state', selectedAddress.state || '');
      onUpdate('postal_code', selectedAddress.postal_code || selectedAddress.zip_code || '');
      onUpdate('country', selectedAddress.country || '');
      onUpdate('region', selectedAddress.region || '');
    }
  };

  // Get formatted address string for display
  const getAddressDisplayString = (addr) => {
    const parts = [];
    if (addr.line1 || addr.street) parts.push(addr.line1 || addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.postal_code || addr.zip_code) parts.push(addr.postal_code || addr.zip_code);
    if (addr.country) parts.push(addr.country);
    return parts.join(', ') || 'Address';
  };

  // Find if current address matches a saved address
  // Also check if location_address_id is set (for when a saved address is selected)
  const getSelectedAddressId = () => {
    // First check if location_address_id is provided in the address object or props
    // This would be set when a saved address is selected
    if (address?.location_address_id) {
      return address.location_address_id.toString();
    }
    
    // Otherwise, try to match by address fields
    if (!address?.line1) return "";
    const matchingAddress = savedAddresses.find(addr => {
      const addrLine1 = addr.line1 || addr.street || '';
      const addrCity = addr.city || '';
      const addrState = addr.state || '';
      const addrPostal = addr.postal_code || addr.zip_code || '';
      return (
        addrLine1 === (address.line1 || '') &&
        addrCity === (address.city || '') &&
        addrState === (address.state || '') &&
        addrPostal === (address.postal_code || '')
      );
    });
    return matchingAddress ? matchingAddress.id.toString() : "";
  };

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Location</h1>

      <div className="col-12 mt-5">
        <div className="d-flex items-center justify-between mb-10">
          <h1 className="text-14 lh-12 fw-500">Street Address</h1>
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={() => setUseAutocomplete(!useAutocomplete)}
              className="text-12 text-primary cursor-pointer hover:underline"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              {useAutocomplete ? 'Use saved addresses' : 'Enter manually'}
            </button>
          )}
        </div>
        {useAutocomplete ? (
          <input
            ref={inputRef}
            id="listing-address-autocomplete"
            className="border-light rounded-8 h-45 px-15 w-full"
            type="text"
            placeholder="Enter street address"
            value={address?.line1 || ""}
            onChange={(e) => handleChange("line1", e.target.value)}
            autoComplete="off"
          />
        ) : (
          <select
            className="form-select border-light rounded-8 h-45 px-15 w-full mt-10"
            value={getSelectedAddressId()}
            onChange={(e) => handleAddressSelect(e.target.value)}
            disabled={loadingAddresses}
          >
            <option value="">Select a saved address</option>
            {savedAddresses.length === 0 && !loadingAddresses && (
              <option value="" disabled>No saved addresses. Add addresses in Profile Management.</option>
            )}
            {loadingAddresses && (
              <option value="" disabled>Loading addresses...</option>
            )}
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {getAddressDisplayString(addr)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">City</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter city"
          value={address?.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">State/Province</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter state/province"
          value={address?.state || ""}
          onChange={(e) => handleChange("state", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Postal Code</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter postal code"
          value={address?.postal_code || ""}
          onChange={(e) => handleChange("postal_code", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Country</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter country"
          value={address?.country || ""}
          onChange={(e) => handleChange("country", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Region</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter region"
          value={address?.region || ""}
          onChange={(e) => handleChange("region", e.target.value)}
        />
      </div>

      <div className="col-12 mt-5">
        <div
          className="border-light rounded-8 px-10"
          style={{ height: "300px" }}
        >
          <MapFinder />
        </div>
      </div>
    </div>
  );
};

export default Location;

