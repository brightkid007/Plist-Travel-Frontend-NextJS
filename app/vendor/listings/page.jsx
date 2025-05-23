import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/vendor-dashboard/listings";

export const metadata = {
  title: "Listings Management || Plist Travel",
  description: "Vendor Listings Management for Plist Travel",
};

const VenderDashboard = () => {
  return (
    <>
      <DashboardPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(VenderDashboard), {
  ssr: false,
});
