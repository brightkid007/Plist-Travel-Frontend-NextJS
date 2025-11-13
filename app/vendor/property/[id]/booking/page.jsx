import dynamic from "next/dynamic";
import BookingForm from "@/components/dashboard/dashboard/db-booking/components/BookingForm";
import VendorDashboardLayout from "@/components/vendor/common/layout";

export const metadata = {
  title: "Plist || Travel Platform",
  description: "Plist - Property Booking",
};

const index = () => {
  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-end pb-20 lg:pb-40 md:pb-32">
        <div className="col-12">
          <h1 className="text-30 lh-14 fw-600">Create New Booking</h1>
          <div className="text-15 text-light-1">Add a new walk-in booking.</div>
        </div>
      </div>

      <div className="py-30 px-30 rounded-22 bg-white shadow-3 row x-gap-20 y-gap-20 items-center">
        <BookingForm serviceType={"Property"} />
      </div>
    </VendorDashboardLayout>
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
