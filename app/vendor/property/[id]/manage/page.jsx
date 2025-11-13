import dynamic from "next/dynamic";
import DashboardPage from "@/components/vendor/property/manage";

const index = () => {
  return <DashboardPage />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
