import { useState, useEffect } from 'react';

/**
 * Shared hook for loading Google Maps API script
 * Prevents duplicate script loading across components
 */
export const useGoogleMaps = () => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for Google Maps API errors
    // Google Maps errors are typically logged to console, so we monitor console errors
    const originalConsoleError = console.error;
    const handleConsoleError = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('BillingNotEnabledMapError')) {
        setApiError('BillingNotEnabled');
      } else if (errorMessage.includes('RefererNotAllowedMapError')) {
        setApiError('RefererNotAllowed');
      } else if (errorMessage.includes('ApiProjectMapError')) {
        setApiError('ApiProjectError');
      }
      // Call original console.error
      originalConsoleError.apply(console, args);
    };

    // Override console.error temporarily to catch Google Maps errors
    console.error = handleConsoleError;

    // Also listen for Google Maps specific error events
    const handleApiError = (e) => {
      const errorMessage = e.message || e.error || JSON.stringify(e);
      if (errorMessage.includes('BillingNotEnabled')) {
        setApiError('BillingNotEnabled');
      } else if (errorMessage.includes('RefererNotAllowed')) {
        setApiError('RefererNotAllowed');
      } else if (errorMessage.includes('ApiProject')) {
        setApiError('ApiProjectError');
      }
    };

    // Listen for window error events that might contain Google Maps errors
    const handleWindowError = (event) => {
      if (event.message && event.message.includes('Google Maps')) {
        if (event.message.includes('BillingNotEnabled')) {
          setApiError('BillingNotEnabled');
        } else if (event.message.includes('RefererNotAllowed')) {
          setApiError('RefererNotAllowed');
        }
      }
    };

    window.addEventListener('error', handleWindowError);

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setGoogleLoaded(true);
      // Check for errors after a delay
      setTimeout(() => {
        // Check console for any recent errors
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
          // Script exists, but might have errors
          // Errors will be caught by console.error override
        }
      }, 1000);
      return () => {
        console.error = originalConsoleError;
        window.removeEventListener('error', handleWindowError);
      };
    }

    // Check if script is already loading (global flag)
    if (window.__GOOGLE_MAPS_SCRIPT_LOADING__) {
      // Poll until available
      const checkTimer = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkTimer);
          setGoogleLoaded(true);
        }
      }, 200);
      // Safety timeout after 10s
      const timeout = setTimeout(() => {
        clearInterval(checkTimer);
        if (!window.google?.maps?.places) {
          setError('Google Maps API failed to load within timeout');
        }
      }, 10000);
      return () => {
        clearInterval(checkTimer);
        clearTimeout(timeout);
      };
    }

    // Check if script already exists in DOM (check for any Google Maps script)
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');

    if (existingScripts.length > 0) {
      // Script exists, wait for it to load
      const checkTimer = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkTimer);
          setGoogleLoaded(true);
        }
      }, 200);
      const timeout = setTimeout(() => {
        clearInterval(checkTimer);
        if (!window.google?.maps?.places) {
          setError('Google Maps API failed to load within timeout');
        }
      }, 10000);
      return () => {
        clearInterval(checkTimer);
        clearTimeout(timeout);
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
      setError('Google Maps API key is not set. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.');
      return;
    }

    // Set global loading flag to prevent other components from loading
    window.__GOOGLE_MAPS_SCRIPT_LOADING__ = true;

    const script = document.createElement('script');
    script.setAttribute('data-google-maps', 'true');
    script.setAttribute('data-google-maps-key', apiKey); // Store key to detect duplicates
    script.setAttribute('id', 'google-maps-script'); // Add ID for easier detection
    // Load with places library for autocomplete functionality
    // The maps library (core) is loaded by default, no need to specify it
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    // Wait a bit for the API to fully initialize
    const checkReady = () => {
      if (window.google && window.google.maps) {
        // Check for both maps and places
        if (window.google.maps.places) {
          setGoogleLoaded(true);
          window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
        } else {
          // Places might load slightly later, wait a bit more
          setTimeout(() => {
            if (window.google?.maps?.places) {
              setGoogleLoaded(true);
              window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
            } else {
              setError('Google Maps API loaded but places library not available');
              window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
            }
          }, 500);
        }
      } else {
        setError('Google Maps API failed to initialize');
        window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
      }
    };

    script.onload = () => {
      // Small delay to ensure API is ready
      setTimeout(() => {
        checkReady();
        // After checking if loaded, also check for API errors
        // Check again after a longer delay to catch errors that appear later
        setTimeout(() => {
          // Check if API is actually functional (not just loaded)
          try {
            if (window.google && window.google.maps) {
              // Try to create a test map to see if it works
              // If this fails, there's likely a billing/referer error
            }
          } catch (err) {
            // Error creating map, likely a configuration issue
            if (err.message && err.message.includes('billing')) {
              setApiError('BillingNotEnabled');
            } else if (err.message && err.message.includes('referer')) {
              setApiError('RefererNotAllowed');
            }
          }
        }, 2000);
      }, 100);
    };

    script.onerror = (e) => {
      setError('Failed to load Google Maps API script');
      window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
      // Check if error is due to referer restrictions
      // This might not be detectable here, but we'll show a generic error
      console.error('Google Maps script failed to load. This might be due to API key restrictions or network issues.');
      // Remove the script element on error
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
      // Don't remove the script on unmount as other components might be using it
      // Just clear the loading flag if this component was the one loading it
      if (window.__GOOGLE_MAPS_SCRIPT_LOADING__ && script.parentNode) {
        // Only clear if script failed to load
        if (!window.google?.maps?.places) {
          window.__GOOGLE_MAPS_SCRIPT_LOADING__ = false;
        }
      }
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  return { googleLoaded, error, apiError };
};

