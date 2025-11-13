"use client";

import dynamic from "next/dynamic";
import AddListing from "@/components/vendor/listings/AddListing";

const EditListingPage = ({ params }) => {
  const listingId = params?.id;

  return (
    <AddListing
      listingId={listingId}
      isEditMode={true}
    />
  );
};

export default dynamic(() => Promise.resolve(EditListingPage), {
  ssr: false,
});

