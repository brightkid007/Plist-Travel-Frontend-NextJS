import dynamic from "next/dynamic";
import DashboardPage from "@/components/vendor/property/setting";

export const metadata = {
  title: "Property Setting || Plist Travel",
  description: "Vendor Property Setting for Plist Travel",
};

const index = () => {
  return <DashboardPage />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
