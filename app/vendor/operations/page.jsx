import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/vendor-dashboard/operations";

export const metadata = {
  title: "Vendor Profile || Plist Travel",
  description: "Vendor Profile for Plist Travel",
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
