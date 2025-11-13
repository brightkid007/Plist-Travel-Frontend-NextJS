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

  // Initialize Google Places Autocomplete when useAutocomplete is true and Google Maps is loaded
  useEffect(() => {
    if (!useAutocomplete || !googleLoaded || !inputRef.current) {
      return;
    }

    // Clean up existing autocomplete if any
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
      autocompleteRef.current = null;
    }

    // Retry mechanism to ensure input element is in the DOM
    const tryInitialize = () => {
      if (!inputRef.current || !window.google?.maps?.places?.Autocomplete) {
        // Retry after a short delay
        setTimeout(tryInitialize, 100);
        return;
      }

      try {
        // Create autocomplete instance
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            fields: ['address_components', 'geometry', 'formatted_address'],
          }
        );

        autocompleteRef.current = autocomplete;

        // Listen for place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (!place.geometry || !place.address_components) {
            console.warn('No address details available for the selected place');
            return;
          }

          // Extract address components
          let line1 = '';
          let city = '';
          let state = '';
          let postalCode = '';
          let country = '';
          let region = '';

          place.address_components.forEach((component) => {
            const type = component.types[0];

            switch (type) {
              case 'street_number':
                line1 = component.long_name + ' ' + line1;
                break;
              case 'route':
                line1 += component.long_name;
                break;
              case 'locality':
                city = component.long_name;
                break;
              case 'administrative_area_level_1':
                state = component.short_name;
                break;
              case 'postal_code':
                postalCode = component.long_name;
                break;
              case 'country':
                country = component.long_name;
                break;
              case 'administrative_area_level_2':
                region = component.long_name;
                break;
              default:
                break;
            }
          });

          // Update parent component
          if (onUpdateRef.current) {
            onUpdateRef.current('line1', line1.trim());
            onUpdateRef.current('city', city);
            onUpdateRef.current('state', state);
            onUpdateRef.current('postal_code', postalCode);
            onUpdateRef.current('country', country);
            onUpdateRef.current('region', region);
          }
        });
      } catch (err) {
        console.error('Error initializing autocomplete:', err);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      tryInitialize();
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [useAutocomplete, googleLoaded]);

  const handleAddressSelect = (addressId) => {
    if (onUpdate) {
      onUpdate('location_address_id', addressId);
      // Clear manual address fields when selecting a saved address
      onUpdate('line1', '');
      onUpdate('city', '');
      onUpdate('state', '');
      onUpdate('postal_code', '');
      onUpdate('country', '');
      onUpdate('region', '');
    }
  };

  const handleManualInputChange = (field, value) => {
    if (onUpdate) {
      onUpdate(field, value);
      // Clear location_address_id when manually entering address
      if (address.location_address_id) {
        onUpdate('location_address_id', null);
      }
    }
  };

  const handleToggleInputMethod = () => {
    setUseAutocomplete(!useAutocomplete);
    // Clear address fields when switching methods
    if (onUpdate) {
      onUpdate('line1', '');
      onUpdate('city', '');
      onUpdate('state', '');
      onUpdate('postal_code', '');
      onUpdate('country', '');
      onUpdate('region', '');
      onUpdate('location_address_id', null);
    }
  };

  // Find selected address details
  const selectedAddress = savedAddresses.find(
    (addr) => addr.id === address.location_address_id
  );

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Location</h1>

      {/* Toggle between saved addresses and manual input */}
      <div className="col-12 mt-5">
        <div className="d-flex items-center gap-10 mb-10">
          <button
            className={`px-15 py-5 rounded-8 text-14 fw-500 ${
              !useAutocomplete
                ? "bg-blue-1 text-white"
                : "bg-light-2 text-light-1"
            }`}
            onClick={handleToggleInputMethod}
          >
            Use Saved Address
          </button>
          <button
            className={`px-15 py-5 rounded-8 text-14 fw-500 ${
              useAutocomplete
                ? "bg-blue-1 text-white"
                : "bg-light-2 text-light-1"
            }`}
            onClick={handleToggleInputMethod}
          >
            Enter Manually
          </button>
        </div>
      </div>

      {!useAutocomplete ? (
        /* Saved Addresses Dropdown */
        <>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Address</h1>
            {loadingAddresses ? (
              <div className="d-flex items-center py-10">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading addresses...</span>
                </div>
                <span className="ml-10 text-14">Loading addresses...</span>
              </div>
            ) : savedAddresses.length === 0 ? (
              <div className="border-light rounded-8 px-15 py-10 mt-10 text-14 text-light-1">
                No saved addresses. Switch to "Enter Manually" to add an address.
              </div>
            ) : (
              <select
                className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
                value={address.location_address_id || ""}
                onChange={(e) => {
                  const addressId = e.target.value ? parseInt(e.target.value, 10) : null;
                  handleAddressSelect(addressId);
                }}
              >
                <option value="">Select address</option>
                {savedAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.line1}, {addr.city}, {addr.state} {addr.postal_code}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Display selected address details (read-only) */}
          {selectedAddress && (
            <>
              <div className="col-sm-3 mt-5">
                <h1 className="text-14 lh-12 fw-500">City</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="text"
                  placeholder="Enter city"
                  value={selectedAddress.city || ""}
                  readOnly
                />
              </div>

              <div className="col-sm-3 mt-5">
                <h1 className="text-14 lh-12 fw-500">State</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="text"
                  placeholder="Enter state"
                  value={selectedAddress.state || ""}
                  readOnly
                />
              </div>

              <div className="col-sm-6 mt-5">
                <h1 className="text-14 lh-12 fw-500">Region</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="text"
                  placeholder="Enter region"
                  value={selectedAddress.region || ""}
                  readOnly
                />
              </div>

              <div className="col-sm-6 mt-5">
                <h1 className="text-14 lh-12 fw-500">Postal Code</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="text"
                  placeholder="Enter postal code"
                  value={selectedAddress.postal_code || ""}
                  readOnly
                />
              </div>

              <div className="col-sm-6 mt-5">
                <h1 className="text-14 lh-12 fw-500">Country</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="text"
                  placeholder="Enter country"
                  value={selectedAddress.country || ""}
                  readOnly
                />
              </div>
            </>
          )}
        </>
      ) : (
        /* Manual Address Input with Autocomplete */
        <>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Street Address</h1>
            <input
              ref={inputRef}
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter street address"
              value={address.line1 || ""}
              onChange={(e) => handleManualInputChange("line1", e.target.value)}
            />
            {error && (
              <div className="text-12 text-red-1 mt-5">
                Google Maps Autocomplete is not available: {error}
              </div>
            )}
          </div>

          <div className="col-sm-3 mt-5">
            <h1 className="text-14 lh-12 fw-500">City</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter city"
              value={address.city || ""}
              onChange={(e) => handleManualInputChange("city", e.target.value)}
            />
          </div>

          <div className="col-sm-3 mt-5">
            <h1 className="text-14 lh-12 fw-500">State</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter state"
              value={address.state || ""}
              onChange={(e) => handleManualInputChange("state", e.target.value)}
            />
          </div>

          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Region</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter region"
              value={address.region || ""}
              onChange={(e) => handleManualInputChange("region", e.target.value)}
            />
          </div>

          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Postal Code</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter postal code"
              value={address.postal_code || ""}
              onChange={(e) => handleManualInputChange("postal_code", e.target.value)}
            />
          </div>

          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Country</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter country"
              value={address.country || ""}
              onChange={(e) => handleManualInputChange("country", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Map */}
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
