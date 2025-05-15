import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-booking";

export const metadata = {
  title: "Plist || Travel Platform",
  description: "Plist - Tour Booking",
};

const BookingPage = () => {
  return (
    <>
      <DashboardPage serviceType={"Tour"} />
    </>
  );
};

export default dynamic(() => Promise.resolve(BookingPage), {
  ssr: false,
});
