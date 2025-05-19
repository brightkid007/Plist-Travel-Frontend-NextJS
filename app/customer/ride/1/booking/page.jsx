import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-booking";

export const metadata = {
  title: "Plist || Travel Platform",
  description: "Plist - Ride Booking",
};

const BookingPage = () => {
  return (
    <>
      <DashboardPage serviceType={"Ride"} />
    </>
  );
};

export default dynamic(() => Promise.resolve(BookingPage), {
  ssr: false,
});
