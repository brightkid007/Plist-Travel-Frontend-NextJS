"use client";

import dynamic from "next/dynamic";
import AddRoomType from "@/components/vendor/roomtype/AddRoomType";
import { useSearchParams } from "next/navigation";

// export const metadata = {
//   title: "Listings Management || Plist Travel",
//   description: "Vendor Listings Management for Plist Travel",
// };

const index = () => {
  const searchParams = useSearchParams();
  const subtype = searchParams.get("subtype");
  const listingId = searchParams.get("listingId");

  return <AddRoomType listingId={listingId} subtype={subtype} />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
