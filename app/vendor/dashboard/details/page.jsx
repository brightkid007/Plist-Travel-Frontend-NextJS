import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/vendor-dashboard/dashboard/details";

export const metadata = {
  title: "Vendor Dashboard || Plist Travel",
  description: "Vendor Dashboard for Plist Travel",
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
