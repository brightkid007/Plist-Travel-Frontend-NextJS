"use client";

import svgIcon from "@/components/data/svgIcon";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VendorDashboardLayout from "../../common/layout";
import BasicInfo from "./BasicInfo";
import Rates from "./Rates";
import ListingDetails from "./ListingDetails";
import ListingPrice from "./ListingPrice";
import Calendar from "./Calendar";
import { createRoomType, updateRoomType, getRoomTypeById, uploadMedia } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { validateRoomType, validateRoomTypeStep } from "@/utils/validationUtils";

/**
 * Unified AddRoomType Component
 * 
 * @param {string} subtype - Listing subtype: "Hotel", "Space", "Vacation", "EventVenue"
 * @param {string} listingId - Listing ID for the property
 * @param {string} roomTypeId - Room type ID for editing (optional)
 */
const AddRoomType = ({ listingId: propListingId, subtype: propSubtype, roomTypeId: propRoomTypeId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get subtype, listingId, and roomTypeId from props or URL params
  const subtype = propSubtype || searchParams.get("subtype") || "Hotel";
  const listingId = propListingId || searchParams.get("listingId") || null;
  const roomTypeId = propRoomTypeId || searchParams.get("roomTypeId") || null;

  const [bookingType, setBookingType] = useState("day-night");
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Room type data state - shared across all steps
  const [roomTypeData, setRoomTypeData] = useState({
    // Basic Info
    name: "",
    description: "",
    listing_id: listingId ? parseInt(listingId) : null,
    booking_type: "by_day", // "by_day" or "by_night" for day-night, "by_hour" for hour
    occupancy_adults: 2,
    occupancy_children: 1,
    number_of_rooms: 1,
    room_numbers: [],
    amenities: [],
    
    // Listing Details
    size: "",
    living_rooms: "",
    bedrooms: "",
    bathrooms: "",
    check_in_hour: "",
    check_out_hour: "",
    late_check_in: "",
    additional_note: "",
    extra_people: "",
    minimum_stay: "",
    booking_advance_days: "",
    booking_advance_months: "",
    cancellation_policy: "",
    smoking_allowed: false,
    party_allowed: false,
    pets_allowed: false,
    children_allowed: true,
    rules: "",
    instant_booking: false,
    
    // Rates
    base_price: "",
    cleaning_fee: "",
    cleaning_fee_type: "",
    pet_fee: "",
    pet_fee_type: "",
    discount_active: false,
    terms_agreement_accepted: false,
    
    // Pricing
    base_prices_by_day: {},
    additional_prices_by_guests: {},
    
    // Images
    images: [],
  });

  // Load existing room type if editing
  useEffect(() => {
    if (roomTypeId) {
      loadRoomType();
    }
  }, [roomTypeId]);

  const loadRoomType = async () => {
    try {
      setLoading(true);
      const response = await getRoomTypeById(roomTypeId);
      const data = response?.data || response;
      if (data) {
        setRoomTypeData(prev => ({
          ...prev,
          ...data,
          listing_id: data.listing_id || listingId ? parseInt(listingId) : null,
        }));
        setBookingType(data.booking_type === "by_hour" ? "hour" : "day-night");
      }
    } catch (error) {
      console.error("Error loading room type:", error);
      toast.error(error?.message || "Failed to load room type");
    } finally {
      setLoading(false);
    }
  };

  // Update room type data helper
  const updateRoomTypeData = (updates) => {
    setRoomTypeData(prev => ({ ...prev, ...updates }));
  };

  // Save room type to backend
  const saveRoomType = async () => {
    // Validate before saving
    if (!validateRoomType(roomTypeData)) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for backend (exclude images as they're uploaded separately)
      const { images, ...dataToSave } = {
        ...roomTypeData,
        booking_type: bookingType === "hour" ? "by_hour" : (bookingType === "day-night" ? "by_night" : "by_day"),
      };

      let response;
      let savedRoomTypeId = roomTypeId;
      
      if (roomTypeId) {
        // Update existing room type
        response = await updateRoomType(roomTypeId, dataToSave);
        toast.success("Room type updated successfully!");
      } else {
        // Create new room type
        response = await createRoomType(dataToSave);
        toast.success("Room type created successfully!");
        savedRoomTypeId = response?.data?.id || response?.id;
        if (savedRoomTypeId) {
          // If images exist, upload them
          if (images && images.length > 0 && savedRoomTypeId) {
            try {
              // Upload images using listing_id (room type images might need separate endpoint)
              // For now, we'll upload to the listing's media and note that room type images need backend support
              const uploadPromises = images.map((file) =>
                uploadMedia(file, roomTypeData.listing_id)
              );
              await Promise.all(uploadPromises);
              toast.success("Images uploaded successfully!");
            } catch (error) {
              console.error("Error uploading images:", error);
              toast.warning("Room type saved, but some images failed to upload. Room type images may need a separate endpoint.");
            }
          }
          
          router.push(`/vendor/room-type/add?listingId=${listingId}&subtype=${subtype}&roomTypeId=${savedRoomTypeId}`);
          return;
        }
      }

      // Upload images if updating and images exist
      if (images && images.length > 0 && savedRoomTypeId) {
        try {
          const uploadPromises = images.map((file) =>
            uploadMedia(file, roomTypeData.listing_id)
          );
          await Promise.all(uploadPromises);
          toast.success("Images uploaded successfully!");
        } catch (error) {
          console.error("Error uploading images:", error);
          toast.warning("Room type updated, but some images failed to upload. Room type images may need a separate endpoint.");
        }
      }

      // Navigate after save
      router.push(`/vendor/room-type?listingId=${listingId}`);
    } catch (error) {
      console.error("Error saving room type:", error);
      toast.error(error?.message || "Failed to save room type");
    } finally {
      setLoading(false);
    }
  };

  // Memoize propertySteps to prevent re-creating components on every render
  const propertySteps = useMemo(() => [
    {
      id: 1,
      name: "Basic Info",
      content: (
        <BasicInfo 
          bookingType={bookingType} 
          setBookingType={setBookingType} 
          listingId={listingId} 
          subtype={subtype}
          roomTypeData={roomTypeData}
          updateRoomTypeData={updateRoomTypeData}
        />
      ),
    },
    {
      id: 2,
      name: "Room / Listing Details",
      content: (
        <ListingDetails 
          bookingType={bookingType} 
          listingId={listingId}
          roomTypeData={roomTypeData}
          updateRoomTypeData={updateRoomTypeData}
        />
      ),
    },
    {
      id: 3,
      name: "Competitive Rates",
      content: (
        <Rates 
          bookingType={bookingType} 
          listingId={listingId}
          roomTypeData={roomTypeData}
          updateRoomTypeData={updateRoomTypeData}
        />
      ),
    },
    {
      id: 4,
      name: "Price",
      content: (
        <ListingPrice 
          listingId={listingId}
          roomTypeData={roomTypeData}
          updateRoomTypeData={updateRoomTypeData}
        />
      ),
    },
    {
      id: 5,
      name: "Calendar",
      content: <Calendar />,
    },
  ], [bookingType, listingId, subtype, roomTypeData]);

  const handleNext = async () => {
    // Validate current step before proceeding
    if (!validateRoomTypeStep(activeStep, roomTypeData)) {
      return; // Stop if validation fails
    }

    if (activeStep < propertySteps.length) {
      setActiveStep(activeStep + 1);
    } else {
      // Save on final step (already validated by validateRoomTypeStep)
      await saveRoomType();
    }
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        <div className="text-20 fw-600">Add Room Type</div>
        <div className="text-14 lh-1 text-light-1">
          Enter name and description for the room. You can also specify number
          of adults and children the room can accommodate.
        </div>
        <div className="col-12 overflow-scroll scroll-bar-1">
          <div className="d-flex justify-between">
            {propertySteps.map((step, index) => (
              <div
                className="d-flex flex-column items-center"
                style={{ minWidth: "120px" }}
                key={index}
              >
                <div
                  className={
                    "size-35 flex-center rounded-full cursor-pointer text-14 " +
                    (step.id > activeStep
                      ? "bg-light-2 text-light-1"
                      : "bg-blue-1 text-white")
                  }
                >
                  {step.id < activeStep ? svgIcon.icon_check : step.id}
                </div>
                <div className="text-12 text-center mt-10">{step.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12">
          <div className="border-light rounded-8 px-20 py-15">
            {propertySteps[activeStep - 1].content}
          </div>
        </div>

        <div className="col-12 d-flex justify-between">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="border-light bg-light-2 rounded-8 py-5 px-20 fw-500 bg-white text-14"
            disabled={activeStep === 1}
          >
            Previous
          </button>
          <button
            className="rounded-8 py-5 px-20 bg-dark-4 text-white text-14"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? "Saving..." : activeStep < propertySteps.length ? "Continue" : "Save"}
          </button>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default AddRoomType;

