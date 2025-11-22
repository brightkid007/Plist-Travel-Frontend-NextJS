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
import { createRoomType, updateRoomType, getRoomTypeById, uploadRoomTypeMedia, deleteMediaAsset } from "@/helpers/backend_helper";
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
    cancellation_policy_id: null,
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
    imagesToDelete: [], // IDs of existing images to delete when saving

    // Calendar
    calendar_type: 1, // 1 = Open Calendar, 2 = Blocked Calendar
    calendar_start_date: null, // Start date for calendar period
    calendar_end_date: null, // End date for calendar period
    blocked_dates: [], // Array of blocked dates (when calendar is open)
    available_dates: [], // Array of available dates (when calendar is blocked)
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
        // Parse amenities if it's a string (should already be an array from service, but handle both cases)
        let amenities = data.amenities || [];

        if (!Array.isArray(amenities)) {
          amenities = [];
        }

        // Parse cancellation_policy_id from cancellation_policy text field if stored as ID
        let cancellationPolicyId = null;
        if (data.cancellation_policy) {
          // Try to parse as ID if it's a numeric string
          const policyId = parseInt(data.cancellation_policy, 10);
          if (!isNaN(policyId)) {
            cancellationPolicyId = policyId;
          }
        }

        // Set booking type based on backend value
        let bookingTypeValue = "day-night";
        if (data.booking_type === "by_hour") {
          bookingTypeValue = "hour";
        } else if (data.booking_type === "by_day") {
          bookingTypeValue = "day-night";
        } else if (data.booking_type === "by_night") {
          bookingTypeValue = "day-night";
        }

        // Update room type data with all fields
        setRoomTypeData(prev => ({
          ...prev,
          // Basic Info
          name: data.name || "",
          description: data.description || "",
          listing_id: data.listing_id || (listingId ? parseInt(listingId) : null),
          booking_type: data.booking_type || "by_day",
          occupancy_adults: data.occupancy_adults || 2,
          occupancy_children: data.occupancy_children || 1,
          number_of_rooms: data.number_of_rooms !== null && data.number_of_rooms !== undefined ? data.number_of_rooms : 1,
          room_numbers: data.room_numbers && Array.isArray(data.room_numbers) ? data.room_numbers : [],
          amenities: amenities,

          // Listing Details
          size: data.size || "",
          living_rooms: data.living_rooms || "",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          check_in_hour: data.check_in_hour || "",
          check_out_hour: data.check_out_hour || "",
          late_check_in: data.late_check_in || "",
          additional_note: data.additional_note || "",
          extra_people: data.extra_people || "",
          minimum_stay: data.minimum_stay || "",
          booking_advance_days: data.booking_advance_days || "",
          booking_advance_months: data.booking_advance_months || "",
          cancellation_policy_id: cancellationPolicyId || data.cancellation_policy_id || null,
          smoking_allowed: data.smoking_allowed || false,
          party_allowed: data.party_allowed || false,
          pets_allowed: data.pets_allowed || false,
          children_allowed: data.children_allowed !== undefined ? data.children_allowed : true,
          rules: data.rules || "",
          instant_booking: data.instant_booking || false,

          // Rates
          base_price: data.base_price !== null && data.base_price !== undefined ? data.base_price : "",
          cleaning_fee: data.cleaning_fee !== null && data.cleaning_fee !== undefined ? data.cleaning_fee : "",
          cleaning_fee_type: data.cleaning_fee_type || "",
          pet_fee: data.pet_fee !== null && data.pet_fee !== undefined ? data.pet_fee : "",
          pet_fee_type: data.pet_fee_type || "",
          discount_active: data.discount_active || false,
          terms_agreement_accepted: data.terms_agreement_accepted || false,

          // Pricing - handle null values from database
          base_prices_by_day: data.base_prices_by_day && typeof data.base_prices_by_day === 'object' ? data.base_prices_by_day : {},
          additional_prices_by_guests: data.additional_prices_by_guests && typeof data.additional_prices_by_guests === 'object' ? data.additional_prices_by_guests : {},

          // Calendar
          calendar_type: data.calendar_type || 1,
          calendar_start_date: data.calendar_start_date || null,
          calendar_end_date: data.calendar_end_date || null,
          blocked_dates: data.blocked_dates && Array.isArray(data.blocked_dates) ? data.blocked_dates : [],
          available_dates: data.available_dates && Array.isArray(data.available_dates) ? data.available_dates : [],

          // Images - kept from previous state as they're file objects, not URLs
          // Note: You may want to load existing images from media endpoint if available
        }));

        setBookingType(bookingTypeValue);
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

      // Prepare data for backend (exclude images and imagesToDelete as they're handled separately)
      const { images, imagesToDelete, ...dataToSave } = {
        ...roomTypeData,
        booking_type: bookingType === "hour" ? "by_hour" : (bookingType === "day-night" ? "by_night" : "by_day"),
      };
      
      // Map cancellation_policy_id to cancellation_policy (model expects TEXT field, not ID)
      // The model stores cancellation_policy as TEXT, so we convert the ID to string
      if (roomTypeData.cancellation_policy_id) {
        dataToSave.cancellation_policy = String(roomTypeData.cancellation_policy_id);
      } else if (roomTypeData.cancellation_policy) {
        dataToSave.cancellation_policy = String(roomTypeData.cancellation_policy);
      }
      
      // Remove cancellation_policy_id from dataToSave as the model doesn't have this field
      delete dataToSave.cancellation_policy_id;
      
      // Handle empty strings for numeric fields (convert to null or undefined)
      // Sequelize will handle JSON fields automatically, but empty objects should be handled
      if (dataToSave.base_price === "" || dataToSave.base_price === null) {
        dataToSave.base_price = null;
      } else if (dataToSave.base_price !== undefined) {
        dataToSave.base_price = parseFloat(dataToSave.base_price);
      }
      
      if (dataToSave.cleaning_fee === "" || dataToSave.cleaning_fee === null) {
        dataToSave.cleaning_fee = null;
      } else if (dataToSave.cleaning_fee !== undefined) {
        dataToSave.cleaning_fee = parseFloat(dataToSave.cleaning_fee);
      }
      
      if (dataToSave.pet_fee === "" || dataToSave.pet_fee === null) {
        dataToSave.pet_fee = null;
      } else if (dataToSave.pet_fee !== undefined) {
        dataToSave.pet_fee = parseFloat(dataToSave.pet_fee);
      }
      
      // Handle JSON fields - ensure empty objects are saved as null instead
      if (dataToSave.base_prices_by_day && Object.keys(dataToSave.base_prices_by_day).length === 0) {
        dataToSave.base_prices_by_day = null;
      }
      
      if (dataToSave.additional_prices_by_guests && Object.keys(dataToSave.additional_prices_by_guests).length === 0) {
        dataToSave.additional_prices_by_guests = null;
      }
      
      // Ensure JSON fields are valid objects (remove empty string values from objects)
      if (dataToSave.base_prices_by_day && typeof dataToSave.base_prices_by_day === 'object') {
        const cleanedPrices = {};
        Object.keys(dataToSave.base_prices_by_day).forEach(key => {
          const value = dataToSave.base_prices_by_day[key];
          if (value !== "" && value !== null && value !== undefined) {
            cleanedPrices[key] = parseFloat(value) || value;
          }
        });
        dataToSave.base_prices_by_day = Object.keys(cleanedPrices).length > 0 ? cleanedPrices : null;
      }
      
      if (dataToSave.additional_prices_by_guests && typeof dataToSave.additional_prices_by_guests === 'object') {
        const cleanedPrices = {};
        Object.keys(dataToSave.additional_prices_by_guests).forEach(key => {
          const value = dataToSave.additional_prices_by_guests[key];
          if (value !== "" && value !== null && value !== undefined) {
            cleanedPrices[key] = parseFloat(value) || value;
          }
        });
        dataToSave.additional_prices_by_guests = Object.keys(cleanedPrices).length > 0 ? cleanedPrices : null;
      }
      
      // Handle calendar JSON fields - ensure empty arrays are saved as null
      if (dataToSave.blocked_dates && Array.isArray(dataToSave.blocked_dates) && dataToSave.blocked_dates.length === 0) {
        dataToSave.blocked_dates = null;
      }
      
      if (dataToSave.available_dates && Array.isArray(dataToSave.available_dates) && dataToSave.available_dates.length === 0) {
        dataToSave.available_dates = null;
      }
      
      // Handle room_numbers JSON field - ensure empty arrays are saved as null
      if (dataToSave.room_numbers && Array.isArray(dataToSave.room_numbers)) {
        // Remove empty strings from array
        const cleanedRoomNumbers = dataToSave.room_numbers.filter(num => num !== "" && num !== null && num !== undefined);
        dataToSave.room_numbers = cleanedRoomNumbers.length > 0 ? cleanedRoomNumbers : null;
      }
      
      // Ensure integer fields are properly converted (empty strings to null, valid values to integers)
      const integerFields = [
        'occupancy_adults',
        'occupancy_children',
        'number_of_rooms',
        'extra_people',
        'minimum_stay',
        'booking_advance_days',
        'booking_advance_months',
        'living_rooms',
        'bedrooms',
        'bathrooms',
      ];

      integerFields.forEach((field) => {
        if (dataToSave[field] !== undefined) {
          if (dataToSave[field] === "" || dataToSave[field] === null || dataToSave[field] === undefined) {
            dataToSave[field] = null;
          } else {
            const parsed = parseInt(dataToSave[field], 10);
            dataToSave[field] = isNaN(parsed) ? null : parsed;
          }
        }
      });

      let response;
      let savedRoomTypeId = roomTypeId;

      if (roomTypeId) {
        // Update existing room type
        response = await updateRoomType(roomTypeId, dataToSave);
        toast.success("Room type updated successfully!");

        // Delete images marked for deletion
        if (imagesToDelete && imagesToDelete.length > 0) {
          try {
            const deletePromises = imagesToDelete.map((imageId) =>
              deleteMediaAsset(imageId)
            );
            await Promise.all(deletePromises);
            console.log("Deleted images:", imagesToDelete.length);
          } catch (error) {
            console.error("Error deleting images:", error);
            toast.warning("Room type updated, but some images failed to delete.");
          }
        }
      } else {
        // Create new room type
        response = await createRoomType(dataToSave);
        toast.success("Room type created successfully!");
        savedRoomTypeId = response?.data?.id || response?.id;
        if (savedRoomTypeId) {
          // If images exist, upload them as room type specific images
          if (images && images.length > 0 && savedRoomTypeId) {
            try {
              // Upload images using room_type_id (separate from listing images)
              const uploadPromises = images.map((file) =>
                uploadRoomTypeMedia(file, savedRoomTypeId)
              );
              await Promise.all(uploadPromises);
              toast.success("Room type images uploaded successfully!");
            } catch (error) {
              console.error("Error uploading room type images:", error);
              toast.warning("Room type saved, but some images failed to upload.");
            }
          }

          router.push(`/vendor/room-type/add?listingId=${listingId}&subtype=${subtype}&roomTypeId=${savedRoomTypeId}`);
          return;
        }
      }

      // Upload images if updating and images exist
      if (images && images.length > 0 && savedRoomTypeId) {
        try {
          // Upload images using room_type_id (separate from listing images)
          const uploadPromises = images.map((file) =>
            uploadRoomTypeMedia(file, savedRoomTypeId)
          );
          await Promise.all(uploadPromises);
          toast.success("Room type images uploaded successfully!");
        } catch (error) {
          console.error("Error uploading room type images:", error);
          toast.warning("Room type updated, but some images failed to upload.");
        }
      }

      // Navigate after save
      router.push(`/vendor/room-type`);
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
      content: (
        <Calendar
          roomTypeData={roomTypeData}
          updateRoomTypeData={updateRoomTypeData}
        />
      ),
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
        <div className="text-20 fw-600">
          {roomTypeId ? "Edit Room Type" : "Add Room Type"}
        </div>
        <div className="text-14 lh-1 text-light-1">
          {roomTypeId
            ? "Update the room type information below. You can modify all fields as needed."
            : "Enter name and description for the room. You can also specify number of adults and children the room can accommodate."}
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

