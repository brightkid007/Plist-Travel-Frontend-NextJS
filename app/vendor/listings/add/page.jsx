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
