import dynamic from "next/dynamic";
import Header1 from "@/components/header/header-1";
import Footer from "@/components/footer/footer-5";

import DashboardPage from "@/components/dashboard/dashboard/db-booking";

export const metadata = {
  title: "Plist || Travel Platform",
  description: "Plist - Travel Package Builder",
};

const BookingPage = () => {
  return (
    <>
      <DashboardPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(BookingPage), {
  ssr: false,
});
