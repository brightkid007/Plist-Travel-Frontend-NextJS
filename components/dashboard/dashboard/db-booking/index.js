
import Sidebar from "../common/Sidebar";
import Header from "@/components/header/dashboard-header";

import Footer from "../common/Footer";
import BookingTable from "./components/BookingTable";
import BookingForm from "@/components/dashboard/dashboard/db-booking/components/BookingForm";

const index = () => {
  return (
    <>
      {/*  */}
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">Create New Booking</h1>
                <div className="text-15 text-light-1">
                Add a new walk-in booking.
                </div>
              </div>
              {/* End .col-12 */}
            </div>
            {/* End .row */}

            <div className="py-30 px-30 rounded-22 bg-white shadow-3 row x-gap-20 y-gap-20 items-center">
              <BookingForm />
              {/* End tabs */}
            </div>

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
    </>
  );
};

export default index;
