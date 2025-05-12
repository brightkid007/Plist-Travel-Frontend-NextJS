import Link from "next/link";

import Sidebar from "../common/Sidebar";
import Header from "@/components/header/dashboard-header";

import Footer from "../common/Footer";
import BookingHistoryFilter from "@/components/dashboard/dashboard/db-booking-history/components/BookingHistoryFilter";

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
            <div className="d-flex y-gap-20 justify-between pb-20 lg:pb-40 md:pb-32">
                <h1 className="text-30 lh-14 fw-600">Booking History</h1>
                <Link href="/customer/search">

                <button
                    className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto"
                >
                    + New Booking
                </button>
            </Link>
              {/* End .col-12 */}
            </div>
            {/* End .row */}
            <div className="text-15 text-light-1">
                View and manage your past and upcoming bookings
            </div>

            <div className="py-30 px-30 rounded-22 bg-white shadow-3">
              <BookingHistoryFilter />
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
