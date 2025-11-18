import dynamic from "next/dynamic";
import DashboardPage from "@/components/vendor/rateplan/add/Preview";

export const metadata = {
  title: "Vendor Dashboard || Plist Travel",
  description: "Vendor Dashboard for Plist Travel",
};

const index = ({ params }) => {
  const { id, type } = params;
  return <DashboardPage ratePlanId={id} type={type} />;
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
