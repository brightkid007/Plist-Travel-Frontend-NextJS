import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-sales-link-gen"

export const metadata = {
  title: "Sales Link Generator || Plist Travel",
  description: "Generate Sales Link",
};

const SalesLinkGenerator = () => {

  return (
    <>
      <DashboardPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(SalesLinkGenerator), {
  ssr: false,
});
