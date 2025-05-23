"use client";

import { useState } from "react";
import ImageCard from "@/components/dashboard/image-card/ImageCard";
import TravelerInformationCard from "@/components/dashboard/dashboard/db-booking/components/TravelInformationCard";
import BookingPaymentCard from "@/components/dashboard/dashboard/db-booking/components/BookingPaymentCard";
import BookingCouponApplyCard from "@/components/dashboard/dashboard/db-booking/components/BookingCouponApplyCard";
import BookingStatusCard from "@/components/dashboard/dashboard/db-booking/components/BookingStatusCard";
import FlightInfoCard from "./FlightInfoCard";
import PropertyInfoCard from "./PropertyInfoCard";
import RideInfoCard from "./RideInfoCard";
import TourInfoCard from "./TourInfoCard";
import AttrEventInfoCard from "./AttrEventInfoCard";

const BookingForm = ({ serviceType }) => {
  const COMPONENT_MAP = {
    Property: <PropertyInfoCard />,
    Tour: <TourInfoCard />,
    Ride: <RideInfoCard />,
    Flight: <FlightInfoCard />,
    AttrEvent: <AttrEventInfoCard />,
  };

  const [travelerCount, setTravelerCount] = useState(1);
  const [isGroupBooking, setIsGroupBooking] = useState(false);

  const handleToggleGroupBooking = () => {
    setIsGroupBooking((prev) => !prev);
  };
  return (
    <>
      <ImageCard />
      <div className="form-check form-switch mt-10">
        <div className="row items-center">
          <input
            className="form-check-input border-light ml-0 col-auto"
            type="checkbox"
            role="switch"
            id="flexSwitchCheck"
            checked={isGroupBooking}
            onChange={handleToggleGroupBooking}
          />
          <label
            className="form-check-label col-auto"
            htmlFor="flexSwitchCheck"
          >
            This is group booking
          </label>
        </div>
      </div>
      {isGroupBooking && (
        <>
          <div className="d-flex justify-between py-0 px-0 w-full lg:pb-40 md:pb-32">
            <h1 className="text-15 lh-14 fw-500">Traveler Information</h1>
            <button
              className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white"
              onClick={() => setTravelerCount(travelerCount + 1)}
            >
              + Add a Traveler
              <i className="icon icon-chevron-right ml-10" />
            </button>
          </div>

          {Array.from({ length: travelerCount }).map((_, index) => (
            <TravelerInformationCard
              key={index}
              index={index}
              travelerCount={travelerCount}
              setTravelerCount={setTravelerCount}
            />
          ))}
        </>
      )}
      {/* </div> */}
      {COMPONENT_MAP[serviceType]}

      <BookingPaymentCard />
      <BookingCouponApplyCard />
      <BookingStatusCard roomPrice={80} extraPrice={5} discount={2} />

      <div className="col-12 py-20 px-20 w-full mt-10">
        <div className="row y-gap-20 justify-end gap-2">
          <button className="button rounded-8 py-10 px-30 text-12 -dark-1 border-light text-light-1 col-auto">
            {/* <i className="icon icon-chevron-left mr-10" />  */}
            Cancel
          </button>
          <button className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto">
            Create Booking
            {/* <i className="icon icon-chevron-right ml-10" /> */}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
