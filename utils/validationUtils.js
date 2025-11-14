import { toast } from "react-toastify";

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates phone number format (allows various formats)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidPhone = (phone) => {
  if (!phone || !phone.trim()) return false;
  // Remove common phone number characters (spaces, dashes, parentheses, plus)
  const cleanedPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  // Check if it contains only digits and has reasonable length (7-15 digits)
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(cleanedPhone);
};

/**
 * Validates a step in the listing creation/edit form
 * @param {number} step - The step number to validate
 * @param {Object} listingData - The listing data object
 * @param {Array} uploadedImages - Array of uploaded images
 * @param {Array} existingImages - Array of existing images
 * @param {boolean} isNonProperty - Whether this is a non-property listing (requires event_date_time)
 * @param {string} subtype - The listing subtype (e.g., "Hotel", "Space", "EventVenue", "Vacation")
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateStep = (step, listingData, uploadedImages = [], existingImages = [], isNonProperty = false, subtype = null) => {
  switch (step) {
    case 1: // Description
      if (!listingData.title || !listingData.title.trim()) {
        toast.error("Please enter a listing title");
        return false;
      }
      if (!listingData.category_id) {
        toast.error("Please select a category");
        return false;
      }
      if (!listingData.subcategory_id) {
        toast.error("Please select a subcategory");
        return false;
      }
      // Non-property listings require event_date_time
      if (isNonProperty && !listingData.event_date_time) {
        toast.error("Please select a date & time");
        return false;
      }
      // Hotel subtype requires email and phone validation
      if (subtype === "Hotel") {
        // Email validation - validates format if provided
        if (listingData.contact_email && listingData.contact_email.trim()) {
          if (!isValidEmail(listingData.contact_email)) {
            toast.error("Please enter a valid email address");
            return false;
          }
        }
        // Phone validation - validates format if provided
        if (listingData.contact_phone && listingData.contact_phone.trim()) {
          if (!isValidPhone(listingData.contact_phone)) {
            toast.error("Please enter a valid phone number");
            return false;
          }
        }
      }
      // EventVenue and Space subtypes require manager phone validation
      if (subtype === "EventVenue" || subtype === "Space") {
        // Manager phone validation - validates format if provided
        if (listingData.manager_phone && listingData.manager_phone.trim()) {
          if (!isValidPhone(listingData.manager_phone)) {
            toast.error("Please enter a valid manager phone number");
            return false;
          }
        }
      }
      return true;

    case 2: // Images
      // Images are optional, but show warning if none
      if (uploadedImages.length === 0 && existingImages.length === 0) {
        toast.warning("No images added. You can add images later.");
      }
      return true;

    case 3: // Location
      // Location validation varies by component
      // Some components require location, others make it optional
      if (listingData.location_address_id) {
        // Saved address is selected, validation passed
        return true;
      }
      // If no saved address, check if manual address fields are filled
      // For property listings, location is optional (just show warning)
      // For non-property listings, location is required
      if (isNonProperty) {
        if (!listingData.address.line1 || !listingData.address.line1.trim()) {
          toast.error("Please enter a street address or select a saved address");
          return false;
        }
        if (!listingData.address.city || !listingData.address.city.trim()) {
          toast.error("Please enter a city or select a saved address");
          return false;
        }
      } else {
        // Property listings: location is optional, just show warning
        if (!listingData.location_address_id && (!listingData.address.line1 || listingData.address.line1.trim() === "")) {
          toast.warning("No location address selected. You can add it later.");
        }
      }
      return true;

    case 4: // Amenities
      // Amenities are optional
      return true;

    case 5: // FAQs
      // FAQs are optional
      return true;

    default:
      return true;
  }
};

/**
 * Validates room type data before saving
 * @param {Object} roomTypeData - The room type data object
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateRoomType = (roomTypeData) => {
  // Required: Property selection
  if (!roomTypeData.listing_id) {
    toast.error("Please select a property first");
    return false;
  }

  // Required: Room type name
  if (!roomTypeData.name || !roomTypeData.name.trim()) {
    toast.error("Please enter a room type name");
    return false;
  }

  // Required: Description
  if (!roomTypeData.description || !roomTypeData.description.trim()) {
    toast.error("Please enter a description for the room type");
    return false;
  }

  // Required: Base price
  const basePrice = roomTypeData.base_price;
  if (!basePrice || basePrice === "" || basePrice === null || basePrice === undefined) {
    toast.error("Please enter a base price");
    return false;
  }
  const parsedPrice = parseFloat(basePrice);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    toast.error("Please enter a valid base price (must be greater than 0)");
    return false;
  }

  // Required: Terms agreement (has asterisk in UI)
  if (!roomTypeData.terms_agreement_accepted) {
    toast.error("Please accept the Vrbo Accommodation Fee Collection Agreement");
    return false;
  }

  // Validate number of rooms if provided
  if (roomTypeData.number_of_rooms && (parseInt(roomTypeData.number_of_rooms) < 1 || isNaN(roomTypeData.number_of_rooms))) {
    toast.error("Please enter a valid number of rooms (must be at least 1)");
    return false;
  }

  // Validate occupancy if provided
  if (roomTypeData.occupancy_adults && (parseInt(roomTypeData.occupancy_adults) < 1 || isNaN(roomTypeData.occupancy_adults))) {
    toast.error("Please enter a valid number of adults (must be at least 1)");
    return false;
  }

  if (roomTypeData.occupancy_children && (parseInt(roomTypeData.occupancy_children) < 0 || isNaN(roomTypeData.occupancy_children))) {
    toast.error("Please enter a valid number of children (must be 0 or greater)");
    return false;
  }

  // Validate cleaning fee - if amount is provided, fee type must be selected
  if (roomTypeData.cleaning_fee && roomTypeData.cleaning_fee !== "" && parseFloat(roomTypeData.cleaning_fee) > 0) {
    if (!roomTypeData.cleaning_fee_type || roomTypeData.cleaning_fee_type === "") {
      toast.error("Please select a cleaning fee type");
      return false;
    }
    if (parseFloat(roomTypeData.cleaning_fee) < 0) {
      toast.error("Cleaning fee cannot be negative");
      return false;
    }
  }

  // Validate pet fee - if amount is provided, fee type must be selected
  if (roomTypeData.pet_fee && roomTypeData.pet_fee !== "" && parseFloat(roomTypeData.pet_fee) > 0) {
    if (!roomTypeData.pet_fee_type || roomTypeData.pet_fee_type === "") {
      toast.error("Please select a pet fee type");
      return false;
    }
    if (parseFloat(roomTypeData.pet_fee) < 0) {
      toast.error("Pet fee cannot be negative");
      return false;
    }
  }

  return true;
};

/**
 * Validates a specific step in the room type creation/edit form
 * @param {number} step - The step number to validate (1-5)
 * @param {Object} roomTypeData - The room type data object
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateRoomTypeStep = (step, roomTypeData) => {
  switch (step) {
    case 1: // Basic Info
      // Required: Property selection
      if (!roomTypeData.listing_id) {
        toast.error("Please select a property first");
        return false;
      }

      // Required: Room type name
      if (!roomTypeData.name || !roomTypeData.name.trim()) {
        toast.error("Please enter a room type name");
        return false;
      }

      // Required: Description
      if (!roomTypeData.description || !roomTypeData.description.trim()) {
        toast.error("Please enter a description for the room type");
        return false;
      }

      // Validate number of rooms if provided
      if (roomTypeData.number_of_rooms && (parseInt(roomTypeData.number_of_rooms) < 1 || isNaN(roomTypeData.number_of_rooms))) {
        toast.error("Please enter a valid number of rooms (must be at least 1)");
        return false;
      }

      // Validate occupancy if provided
      if (roomTypeData.occupancy_adults && (parseInt(roomTypeData.occupancy_adults) < 1 || isNaN(roomTypeData.occupancy_adults))) {
        toast.error("Please enter a valid number of adults (must be at least 1)");
        return false;
      }

      if (roomTypeData.occupancy_children && (parseInt(roomTypeData.occupancy_children) < 0 || isNaN(roomTypeData.occupancy_children))) {
        toast.error("Please enter a valid number of children (must be 0 or greater)");
        return false;
      }

      return true;

    case 2: // Room / Listing Details
      // This step is mostly optional, so just return true
      // Could add validation for specific fields if needed
      return true;

    case 3: // Competitive Rates
      // Required: Base price
      const basePrice = roomTypeData.base_price;
      if (!basePrice || basePrice === "" || basePrice === null || basePrice === undefined) {
        toast.error("Please enter a base price");
        return false;
      }
      const parsedPrice = parseFloat(basePrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        toast.error("Please enter a valid base price (must be greater than 0)");
        return false;
      }

      // Required: Terms agreement (has asterisk in UI)
      if (!roomTypeData.terms_agreement_accepted) {
        toast.error("Please accept the Vrbo Accommodation Fee Collection Agreement");
        return false;
      }

      // Validate cleaning fee - if amount is provided, fee type must be selected
      if (roomTypeData.cleaning_fee && roomTypeData.cleaning_fee !== "" && parseFloat(roomTypeData.cleaning_fee) > 0) {
        if (!roomTypeData.cleaning_fee_type || roomTypeData.cleaning_fee_type === "") {
          toast.error("Please select a cleaning fee type");
          return false;
        }
        if (parseFloat(roomTypeData.cleaning_fee) < 0) {
          toast.error("Cleaning fee cannot be negative");
          return false;
        }
      }

      // Validate pet fee - if amount is provided, fee type must be selected
      if (roomTypeData.pet_fee && roomTypeData.pet_fee !== "" && parseFloat(roomTypeData.pet_fee) > 0) {
        if (!roomTypeData.pet_fee_type || roomTypeData.pet_fee_type === "") {
          toast.error("Please select a pet fee type");
          return false;
        }
        if (parseFloat(roomTypeData.pet_fee) < 0) {
          toast.error("Pet fee cannot be negative");
          return false;
        }
      }

      return true;

    case 4: // Price
      // Base price should already be validated in step 3, but validate again if not set
      const price = roomTypeData.base_price;
      if (!price || price === "" || price === null || price === undefined) {
        toast.error("Please enter a base price");
        return false;
      }
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error("Please enter a valid base price (must be greater than 0)");
        return false;
      }

      return true;

    case 5: // Calendar
      // Calendar step is optional
      return true;

    default:
      return true;
  }
};