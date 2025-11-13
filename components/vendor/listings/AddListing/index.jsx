"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VendorDashboardLayout from "../../common/layout";
import { getListingById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

// Property components
import AddVacation from "../property/AddVacation";
import AddHotel from "../property/AddHotel";
import AddSpace from "../property/AddSpace";
import AddEventVenue from "../property/AddEventVenue";

// Non-property components
import AddEvent from "../non-property/AddEvent";
import AddActivity from "../non-property/AddActivity";
import AddTour from "../non-property/AddTour";

// Flight and Ride components (to be created)
// import AddFlight from "../non-property/AddFlight";
// import AddRide from "../non-property/AddRide";

// Helper functions - moved outside component for better performance
// Map subtype to service name for property type
const getServiceFromSubtype = (subtype) => {
  if (!subtype) return "Vacation Rentals";
  const subtypeMap = {
    "Hotel": "Hotels",
    "Space": "Spaces",
    "Vacation": "Vacation Rentals",
    "EventVenue": "Event Venues",
  };
  return subtypeMap[subtype] || "Vacation Rentals";
};

// Map type to service name for non-property types
const getServiceFromType = (type) => {
  if (!type) return null;
  const typeMap = {
    "activity": "Activities",
    "tour": "Tours",
    "event": "Events",
    "flight": "Flights",
    "ride": "Rides",
  };
  return typeMap[type] || null;
};

// Map listing category/subcategory to subtype for property type
const getSubtypeFromListing = (listing) => {
  if (!listing || listing.type !== "property") {
    return null;
  }

  const categoryName = (listing.category?.name || "").toLowerCase().trim();
  const subcategoryName = (listing.subcategory?.name || "").toLowerCase().trim();
  const combinedName = `${categoryName} ${subcategoryName}`.toLowerCase().trim();

  // Check category name first (more specific)
  if (categoryName.includes("hotel") || subcategoryName.includes("hotel")) {
    return "Hotel";
  }
  if (categoryName.includes("vacation") || categoryName.includes("rental") || 
      subcategoryName.includes("vacation") || subcategoryName.includes("rental")) {
    return "Vacation";
  }
  if (categoryName.includes("space") || subcategoryName.includes("space")) {
    return "Space";
  }
  if (categoryName.includes("event") || categoryName.includes("venue") || 
      subcategoryName.includes("event") || subcategoryName.includes("venue")) {
    return "EventVenue";
  }

  // Check combined name as fallback
  if (combinedName.includes("hotel")) {
    return "Hotel";
  }
  if (combinedName.includes("vacation") || combinedName.includes("rental")) {
    return "Vacation";
  }
  if (combinedName.includes("space")) {
    return "Space";
  }
  if (combinedName.includes("event") || combinedName.includes("venue")) {
    return "EventVenue";
  }

  // Default to Vacation if unable to determine
  return "Vacation";
};

/**
 * Unified AddListing Component
 * 
 * @param {string} type - Listing type: "property", "activity", "tour", "event", "flight", "ride"
 * @param {string} subtype - Listing subtype (for property only): "Hotel", "Space", "Vacation", "EventVenue"
 * @param {string} listingId - Listing ID for edit mode
 * @param {boolean} isEditMode - Whether in edit mode
 * @param {string} service - Service name (optional, derived from type/subtype if not provided)
 */
const AddListing = ({ 
  type: propType, 
  subtype: propSubtype, 
  listingId, 
  isEditMode = false,
  service: propService 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(isEditMode && listingId);
  const [listingType, setListingType] = useState(null);
  const [listingSubtype, setListingSubtype] = useState(null);
  const [serviceName, setServiceName] = useState(null);

  // Get type from props, URL params, or listing data
  const type = propType || searchParams.get("type") || listingType;
  
  // Get subtype from props, URL params, or listing data
  const subtype = propSubtype || searchParams.get("subtype") || listingSubtype;

  // Load listing data when in edit mode
  useEffect(() => {
    const loadListingData = async () => {
      if (!isEditMode || !listingId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getListingById(listingId);
        const listingData = response?.data || response;

        if (listingData) {
          const detectedType = listingData.type;
          setListingType(detectedType);

          // For property type, determine subtype
          if (detectedType === "property") {
            // First check if subtype exists in the database
            const dbSubtype = listingData.subtype;
            if (dbSubtype) {
              // Use subtype from database
              setListingSubtype(dbSubtype);
              setServiceName(getServiceFromSubtype(dbSubtype));
            } else {
              // Fallback: determine subtype from category/subcategory
              const detectedSubtype = getSubtypeFromListing(listingData);
              setListingSubtype(detectedSubtype);
              setServiceName(getServiceFromSubtype(detectedSubtype));
            }
          } else {
            // For non-property types, use type to determine service
            setServiceName(getServiceFromType(detectedType));
          }
        } else {
          toast.error("Listing not found");
          router.push("/vendor/listings/property");
        }
      } catch (error) {
        console.error("Error loading listing:", error);
        toast.error(error?.message || "Failed to load listing");
        router.push("/vendor/listings/property");
      } finally {
        setLoading(false);
      }
    };

    loadListingData();
  }, [isEditMode, listingId, router]);

  // Determine service name if not already set (for add mode)
  useEffect(() => {
    if (!isEditMode && !serviceName) {
      if (type === "property" && subtype) {
        setServiceName(getServiceFromSubtype(subtype));
      } else if (type && type !== "property") {
        setServiceName(getServiceFromType(type));
      } else if (propService) {
        setServiceName(propService);
      }
    }
  }, [type, subtype, propService, serviceName, isEditMode]);

  // Render appropriate component based on type and subtype
  const renderComponent = () => {
    if (!type) {
      return (
        <div className="d-flex flex-column items-center justify-center py-40">
          <span className="material-symbols-outlined text-48 text-light-1 mb-10">
            error
          </span>
          <div className="text-16 text-light-1 mb-10">Listing type is required</div>
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/listings/property")}
          >
            Back to Listings
          </button>
        </div>
      );
    }

    // Property type - use appropriate component based on subtype
    if (type === "property") {
      const service = serviceName || getServiceFromSubtype(subtype || "Vacation");
      const finalSubtype = subtype || (isEditMode ? listingSubtype : null);
      
      // Route to appropriate component based on subtype
      switch (finalSubtype) {
        case "Hotel":
          return (
            <AddHotel
              listingId={listingId}
              isEditMode={isEditMode}
              service={service}
            />
          );
        case "Space":
          return (
            <AddSpace
              listingId={listingId}
              isEditMode={isEditMode}
              service={service}
            />
          );
        case "EventVenue":
          return (
            <AddEventVenue
              listingId={listingId}
              isEditMode={isEditMode}
              service={service}
            />
          );
        case "Vacation":
        default:
          // Default to AddVacation for Vacation and unknown subtypes
          return (
            <AddVacation
              listingId={listingId}
              isEditMode={isEditMode}
              service={service}
            />
          );
      }
    }

    // Non-property types
    const service = serviceName || getServiceFromType(type);

    switch (type) {
      case "activity":
        return (
          <AddActivity
            service={service}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "tour":
        return (
          <AddTour
            service={service}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "event":
        return (
          <AddEvent
            service={service}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "flight":
        // TODO: Create AddFlight component
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              info
            </span>
            <div className="text-16 text-light-1 mb-10">Flight listings are not yet available</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );

      case "ride":
        // TODO: Create AddRide component
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              info
            </span>
            <div className="text-16 text-light-1 mb-10">Ride listings are not yet available</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );

      default:
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              error
            </span>
            <div className="text-16 text-light-1 mb-10">Invalid listing type: {type}</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <VendorDashboardLayout>
        <div className="d-flex justify-center items-center py-40">
          <CircularProgress />
          <span className="ml-10 text-14">Loading listing...</span>
        </div>
      </VendorDashboardLayout>
    );
  }

  return <>{renderComponent()}</>;
};

export default AddListing;

