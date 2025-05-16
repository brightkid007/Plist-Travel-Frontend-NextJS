import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-booking-history";

export const metadata = {
  title: "Booking History Detail || Plist Travel",
  description: "Booking History and Book Again!",
};

const TravelBookingHistoryPage = () => {
  return (
    <>
      <DashboardPage />
    </>
  );
};

export default dynamic(() => Promise.resolve(TravelBookingHistoryPage), {
  ssr: false,
});
