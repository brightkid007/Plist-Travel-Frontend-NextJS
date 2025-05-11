"use client";

import dynamic from "next/dynamic";
// import { useState } from "react";
import Header1 from "@/components/header/header-1";
import Footer from "@/components/footer/footer-5";

import ImageCard from "@/components/dashboard/image-card/ImageCard";
import TravelerInformationCard from "@/components/dashboard/dashboard/common/TravelInformationCard";
import BookingTimeCard from "@/components/dashboard/dashboard/common/BookingTimeCard";

// export const metadata = {
//   title: "Plist || Travel Platform",
//   description: "Plist - Travel Package Builder",
// };

const PropertyBookingPage = () => {


  return (
    <>
      <Header1 />
      <div className="py-30"></div>
      <div className="dashboard">
        <div className="dashboard__content bg-light-2 pb-30">
          <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
            <div className="col-12">
              <h1 className="text-30 lh-14 fw-600">Create New Booking</h1>
              <div className="text-15 text-light-1">
                Add a new walk-in booking.
              </div>
            </div>
          </div>
          <div className="tabs -underline-2 js-tabs">
            <div className="tabs__content pt-30 js-tabs-content">
              <div className="col-auto row x-gap-20 y-gap-20 items-center">
                {/* <div className="tabs__pane -tab-item-1 is-tab-el-active"> */}
                <ImageCard />
                <div className="d-flex y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
                  <h1 className="text-15 lh-14 fw-500">Traveler Information</h1>
                  <button
                    className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto"
                  >
                    + Add a Traveler
                    <i className="icon icon-chevron-right ml-10" />
                  </button>
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                  <TravelerInformationCard key={index} index={index} />
                ))}
                {/* </div> */}
                <BookingTimeCard />

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(PropertyBookingPage), {
  ssr: false,
});
