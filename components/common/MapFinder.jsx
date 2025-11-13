"use client";

import { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapFinder() {
  const { googleLoaded, error, apiError } = useGoogleMaps();
  const [mapReady, setMapReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  const defaultProps = {
    center: {
      lat: 40.7128,
      lng: -74.006,
    },
    zoom: 11,
  };

  // Get user-friendly error message
  const getErrorMessage = () => {
    if (apiError === 'BillingNotEnabled') {
      return 'Google Maps requires billing to be enabled. Please enable billing in Google Cloud Console.';
    } else if (apiError === 'RefererNotAllowed') {
      return 'This domain is not authorized. Please add your domain to the API key restrictions in Google Cloud Console.';
    } else if (apiError === 'ApiProjectError') {
      return 'API project configuration error. Please check your Google Cloud Console settings.';
    } else if (error) {
      return error;
    }
    return 'Map unavailable';
  };

  // Wait for Google Maps to be fully loaded and initialized
  useEffect(() => {
    if (googleLoaded && window.google?.maps) {
      // Verify that all necessary properties exist
      const checkMapReady = () => {
        try {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.Map &&
            window.google.maps.places
          ) {
            // Additional delay to ensure all internal properties are initialized
            setTimeout(() => {
              setMapReady(true);
            }, 500);
          } else {
            setMapReady(false);
          }
        } catch (err) {
          console.error("Error checking map readiness:", err);
          setMapReady(false);
        }
      };
      checkMapReady();
    } else {
      setMapReady(false);
    }
  }, [googleLoaded]);

  // Show loading state
  if (!googleLoaded || !mapReady) {
    return (
      <div className="d-flex items-center justify-center" style={{ height: "300px" }}>
        <div className="text-14 text-light-1">Loading map...</div>
      </div>
    );
  }

  // Show error state
  if (error || apiError) {
    return (
      <div className="d-flex flex-column items-center justify-center gap-10" style={{ height: "300px", padding: "20px" }}>
        <div className="text-14 text-light-1 text-center">{getErrorMessage()}</div>
        {apiError && (
          <div className="text-12 text-light-2 text-center" style={{ maxWidth: "400px" }}>
            {apiError === 'BillingNotEnabled' && (
              <div>
                To fix this, enable billing in your Google Cloud Console project.
                <br />
                <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Enable Billing
                </a>
              </div>
            )}
            {apiError === 'RefererNotAllowed' && (
              <div>
                Add this URL to your API key's HTTP referrer restrictions:
                <br />
                <code className="text-10">{window.location.origin}/*</code>
                <br />
                <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary">
                  Configure API Key
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Render map only when everything is ready
  // Check if all required Google Maps API objects are available
  if (
    !window.google?.maps?.Map ||
    !window.google?.maps?.LatLng ||
    !window.google?.maps?.Marker
  ) {
    return (
      <div className="d-flex items-center justify-center" style={{ height: "300px" }}>
        <div className="text-14 text-light-1">Map unavailable</div>
      </div>
    );
  }

  // Don't pass bootstrapURLKeys when script is already loaded
  // This prevents GoogleMapReact from trying to load the script again
  // yesIWantToUseGoogleMapApiInternals tells it to use the existing script
  return (
    <GoogleMapReact
      yesIWantToUseGoogleMapApiInternals={true}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      <AnyReactComponent lat={40.7128} lng={-74.006} text="" />
    </GoogleMapReact>
  );
}
