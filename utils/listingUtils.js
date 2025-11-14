/**
 * Converts listing type and subtype to service name
 * @param {string} type - Listing type: "property", "activity", "tour", "event", "flight", "ride"
 * @param {string} subtype - Listing subtype (for property only): "Hotel", "Space", "Vacation", "EventVenue"
 * @returns {string|null} - Service name or null if invalid
 */
export const getServiceName = (type, subtype = null) => {
  if (!type) return null;

  // Property listings - use subtype to determine service name
  if (type === "property") {
    if (!subtype) return null;
    
    const subtypeMap = {
      "Hotel": "Hotels",
      "Space": "Spaces",
      "Vacation": "Vacation Rentals",
      "EventVenue": "Event Venues",
    };
    
    return subtypeMap[subtype] || null;
  }

  // Non-property listings - use type to determine service name
  const typeMap = {
    "activity": "Activities",
    "tour": "Tours",
    "event": "Events",
    "flight": "Flights",
    "ride": "Rides",
  };

  return typeMap[type] || null;
};

/**
 * Converts service name to type and subtype
 * @param {string} serviceName - Service name: "Hotels", "Spaces", "Vacation Rentals", "Event Venues", "Activities", "Tours", "Events"
 * @returns {Object} - Object with type and subtype properties
 */
export const getTypeFromService = (serviceName) => {
  if (!serviceName) return { type: null, subtype: null };

  // Property services
  const propertyServiceMap = {
    "Hotels": { type: "property", subtype: "Hotel" },
    "Spaces": { type: "property", subtype: "Space" },
    "Vacation Rentals": { type: "property", subtype: "Vacation" },
    "Event Venues": { type: "property", subtype: "EventVenue" },
  };

  if (propertyServiceMap[serviceName]) {
    return propertyServiceMap[serviceName];
  }

  // Non-property services
  const nonPropertyServiceMap = {
    "Activities": { type: "activity", subtype: null },
    "Tours": { type: "tour", subtype: null },
    "Events": { type: "event", subtype: null },
    "Flights": { type: "flight", subtype: null },
    "Rides": { type: "ride", subtype: null },
  };

  if (nonPropertyServiceMap[serviceName]) {
    return nonPropertyServiceMap[serviceName];
  }

  return { type: null, subtype: null };
};
