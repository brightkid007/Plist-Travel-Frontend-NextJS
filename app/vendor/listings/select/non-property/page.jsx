"use client";

import dynamic from "next/dynamic";
import VendorDashboardLayout from "@/components/vendor/common/layout";
import SelectServices from "@/components/vendor/listings/non-property/SelectServices";

const NonPropertySelectPage = () => {
  return (
    <VendorDashboardLayout>
      <SelectServices />
    </VendorDashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(NonPropertySelectPage), {
  ssr: false,
});

