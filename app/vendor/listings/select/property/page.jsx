"use client";

import dynamic from "next/dynamic";
import VendorDashboardLayout from "@/components/vendor/common/layout";
import SelectServices from "@/components/vendor/listings/property/SelectServices";

const PropertySelectPage = () => {
  return (
    <VendorDashboardLayout>
      <SelectServices />
    </VendorDashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(PropertySelectPage), {
  ssr: false,
});

