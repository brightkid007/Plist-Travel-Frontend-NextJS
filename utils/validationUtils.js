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

    case 4: // Amenities (property) or Listing Details (non-property)
      if (isNonProperty) {
        // Non-property: Listing Details validation
        const listingDetails = listingData.listingDetails || {};
        
        // Validate event days if multi-day event
        if (listingDetails.is_multi_day) {
          if (!listingDetails.event_days || !Array.isArray(listingDetails.event_days) || listingDetails.event_days.length === 0) {
            toast.error("Please add at least one event day for multi-day events");
            return false;
          }
          // Validate each event day has required fields
          const invalidDays = listingDetails.event_days.some((day, index) => {
            if (!day.date || !day.date.trim()) {
              toast.error(`Please enter event date for Day ${index + 1}`);
              return true;
            }
            if (!day.start_time || !day.start_time.trim()) {
              toast.error(`Please enter event start time for Day ${index + 1}`);
              return true;
            }
            if (!day.end_time || !day.end_time.trim()) {
              toast.error(`Please enter event end time for Day ${index + 1}`);
              return true;
            }
            return false;
          });
          if (invalidDays) {
            return false;
          }
        }
        
        // Cancellation policy is optional but recommended
        // Other fields are optional
      } else {
        // Property: Amenities are optional
      }
      return true;

    case 5: // Listing Price (non-property) or FAQs (property)
      if (isNonProperty) {
        // Non-property: Listing Price validation
        const listingPrice = listingData.listingPrice || {};
        
        // Validate ticket prices
        if (!listingPrice.ticket_prices || !Array.isArray(listingPrice.ticket_prices) || listingPrice.ticket_prices.length === 0) {
          toast.error("Please add at least one ticket price");
          return false;
        }
        
        // Validate each ticket price has category and price
        const invalidTicketPrices = listingPrice.ticket_prices.some((ticket, index) => {
          if (!ticket.category || !ticket.category.trim()) {
            toast.error(`Please select a ticket price category for Ticket ${index + 1}`);
            return true;
          }
          if (!ticket.price || ticket.price === "" || ticket.price === null || ticket.price === undefined) {
            toast.error(`Please enter a price for Ticket ${index + 1}`);
            return true;
          }
          const parsedPrice = parseFloat(ticket.price);
          if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error(`Please enter a valid price for Ticket ${index + 1} (must be greater than 0)`);
            return true;
          }
          return false;
        });
        if (invalidTicketPrices) {
          return false;
        }
        
        // Validate base prices by day if enabled
        if (listingPrice.base_prices_by_day_of_week && listingPrice.base_prices_by_day) {
          const dayPrices = listingPrice.base_prices_by_day;
          const hasInvalidPrice = Object.keys(dayPrices).some((day) => {
            const price = dayPrices[day];
            if (price !== null && price !== undefined && price !== "") {
              const parsedPrice = parseFloat(price);
              if (isNaN(parsedPrice) || parsedPrice <= 0) {
                toast.error(`Please enter a valid price for ${day} (must be greater than 0)`);
                return true;
              }
            }
            return false;
          });
          if (hasInvalidPrice) {
            return false;
          }
        }
        
        // Validate guest prices if enabled
        if (listingPrice.additional_prices_by_guests) {
          if (!listingPrice.guest_prices || !Array.isArray(listingPrice.guest_prices) || listingPrice.guest_prices.length === 0) {
            toast.error("Please add at least one guest price range when 'Additional Base Prices by Number of Guests' is enabled");
            return false;
          }
          const invalidGuestPrices = listingPrice.guest_prices.some((guestPrice, index) => {
            if (!guestPrice.guest_start || guestPrice.guest_start === "" || guestPrice.guest_start === null) {
              toast.error(`Please enter guest start range for Guest Price ${index + 1}`);
              return true;
            }
            if (!guestPrice.guest_end || guestPrice.guest_end === "" || guestPrice.guest_end === null) {
              toast.error(`Please enter guest end range for Guest Price ${index + 1}`);
              return true;
            }
            if (!guestPrice.price || guestPrice.price === "" || guestPrice.price === null || guestPrice.price === undefined) {
              toast.error(`Please enter a price for Guest Price ${index + 1}`);
              return true;
            }
            const parsedStart = parseInt(guestPrice.guest_start);
            const parsedEnd = parseInt(guestPrice.guest_end);
            const parsedPrice = parseFloat(guestPrice.price);
            if (isNaN(parsedStart) || parsedStart < 1) {
              toast.error(`Please enter a valid guest start range for Guest Price ${index + 1} (must be at least 1)`);
              return true;
            }
            if (isNaN(parsedEnd) || parsedEnd < parsedStart) {
              toast.error(`Please enter a valid guest end range for Guest Price ${index + 1} (must be greater than start range)`);
              return true;
            }
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
              toast.error(`Please enter a valid price for Guest Price ${index + 1} (must be greater than 0)`);
              return true;
            }
            return false;
          });
          if (invalidGuestPrices) {
            return false;
          }
        }
      } else {
        // Property: FAQs are optional
      }
      return true;

    case 6: // FAQs (non-property) or skipped for property
      if (isNonProperty) {
        // Non-property: FAQs are optional
      }
      return true;

    case 7: // Calendar (non-property only)
      if (isNonProperty) {
        // Non-property: Calendar validation
        const calendar = listingData.calendar || {};
        
        // Calendar type must be set (defaults to 1 if not set)
        if (!calendar.calendar_type || (calendar.calendar_type !== 1 && calendar.calendar_type !== 2)) {
          toast.error("Please select a calendar type");
          return false;
        }
        
        // If calendar start and end dates are provided, validate them
        if (calendar.calendar_start_date && calendar.calendar_end_date) {
          const startDate = new Date(calendar.calendar_start_date);
          const endDate = new Date(calendar.calendar_end_date);
          
          if (isNaN(startDate.getTime())) {
            toast.error("Please enter a valid start date");
            return false;
          }
          
          if (isNaN(endDate.getTime())) {
            toast.error("Please enter a valid end date");
            return false;
          }
          
          if (endDate < startDate) {
            toast.error("End date must be after or equal to start date");
            return false;
          }
        }
        
        // Blocked/available dates are optional
      }
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