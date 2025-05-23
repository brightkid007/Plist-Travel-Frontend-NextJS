import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/vendor-dashboard/profile";

export const metadata = {
  title: "Operations Management || Plist Travel",
  description: "Vendor Operations Management for Plist Travel",
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
