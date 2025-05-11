import dynamic from "next/dynamic";
import DashboardPage from "@/components/dashboard/dashboard/db-booking-history"

export const metadata = {
  title: "Home-2 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const TravelBookingHistoryPage = () => {
  return (
    <>
      <DashboardPage />
      {/* End Page Title */}

      
      
    </>
  );
};

export default dynamic(() => Promise.resolve(TravelBookingHistoryPage), { ssr: false });
