import dynamic from "next/dynamic";
import DashboardPage from "@/components/vendor/rateplan/add/AddPlan";

export const metadata = {
  title: "Vendor Dashboard || Plist Travel",
  description: "Vendor Dashboard for Plist Travel",
};

const index = () => {
  return <DashboardPage type={"custom"} />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
