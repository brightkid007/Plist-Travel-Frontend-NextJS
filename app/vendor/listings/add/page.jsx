"use client";

import dynamic from "next/dynamic";
import AddListing from "@/components/vendor/listings/AddListing";
import { useSearchParams } from "next/navigation";

// export const metadata = {
//   title: "Listings Management || Plist Travel",
//   description: "Vendor Listings Management for Plist Travel",
// };

const index = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // property, activity, tour, event, flight, ride
  const subtype = searchParams.get("subtype"); // Hotel, Space, Vacation, EventVenue (for property only)
  const service = searchParams.get("service"); // Legacy support: Hotels, Spaces, Vacation Rentals, etc.

  // Map legacy service names to type/subtype
  const getTypeAndSubtypeFromService = (service) => {
    if (!service) return { type: null, subtype: null };

    const serviceMap = {
      "Hotels": { type: "property", subtype: "Hotel" },
      "Spaces": { type: "property", subtype: "Space" },
      "Vacation Rentals": { type: "property", subtype: "Vacation" },
      "Event Venues": { type: "property", subtype: "EventVenue" },
      "Events": { type: "event", subtype: null },
      "Activities": { type: "activity", subtype: null },
      "Tours": { type: "tour", subtype: null },
      "Flights": { type: "flight", subtype: null },
      "Rides": { type: "ride", subtype: null },
    };

    return serviceMap[service] || { type: null, subtype: null };
  };

  // If service is provided (legacy), map it to type/subtype
  const legacyMapping = service ? getTypeAndSubtypeFromService(service) : { type: null, subtype: null };
  const finalType = type || legacyMapping.type;
  const finalSubtype = subtype || legacyMapping.subtype;

  return (
    <AddListing
      type={finalType}
      subtype={finalSubtype}
      service={service}
      isEditMode={false}
    />
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
