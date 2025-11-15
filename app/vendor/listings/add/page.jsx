"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Property component
import AddListing from "@/components/vendor/listings/AddListing";

// Non-property components
const AddEvent = dynamic(() => import("@/components/vendor/listings/non-property/AddEvent"), {
  ssr: false,
});
const AddActivity = dynamic(() => import("@/components/vendor/listings/non-property/AddActivity"), {
  ssr: false,
});
const AddTour = dynamic(() => import("@/components/vendor/listings/non-property/AddTour"), {
  ssr: false,
});

// export const metadata = {
//   title: "Listings Management || Plist Travel",
//   description: "Vendor Listings Management for Plist Travel",
// };

const index = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // property, activity, tour, event, flight, ride
  const subtype = searchParams.get("subtype"); // Hotel, Space, Vacation, EventVenue (for property only)

  // Render appropriate component based on type
  if (!type || type === "property") {
    return (
      <AddListing
        type={type || "property"}
        subtype={subtype}
        isEditMode={false}
      />
    );
  }

  // Non-property types - render directly
  if (type === "event") {
    return (
      <AddEvent
        type={type}
        listingId={null}
        isEditMode={false}
      />
    );
  }

  if (type === "activity") {
    return (
      <AddActivity
        type={type}
        listingId={null}
        isEditMode={false}
      />
    );
  }

  if (type === "tour") {
    return (
      <AddTour
        type={type}
        listingId={null}
        isEditMode={false}
      />
    );
  }

  // Fallback for unsupported types (flight, ride, etc.)
  return (
    <AddListing
      type={type}
      subtype={subtype}
      isEditMode={false}
    />
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
