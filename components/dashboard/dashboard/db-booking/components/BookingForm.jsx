"use client";

import { useState } from "react";
import ImageCard from "@/components/dashboard/image-card/ImageCard";
import TravelerInformationCard from "@/components/dashboard/dashboard/db-booking/components/TravelInformationCard";
import BookingTimeCard from "@/components/dashboard/dashboard/db-booking/components/BookingTimeCard";
import BookingPaymentCard from "@/components/dashboard/dashboard/db-booking/components/BookingPaymentCard";
import BookingCouponApplyCard from "@/components/dashboard/dashboard/db-booking/components/BookingCouponApplyCard";
import BookingStatusCard from "@/components/dashboard/dashboard/db-booking/components/BookingStatusCard";
import Switch from "@/components/common/form/Switch";

const BookingForm = () => {
    const [travelerCount, setTravelerCount] = useState(1);
    const [isGroupBooking, setIsGroupBooking] = useState(false);

    const handleAddTraveler = () => {
        setTravelerCount(prev => Math.max(1, prev + 1));
    };

    const handleToggleGroupBooking = () => {
        setIsGroupBooking(prev => !prev);
    };
    return (
        <>
            {/* <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
                <div className="col-12">
                    <h1 className="text-30 lh-14 fw-600">Create New Booking</h1>
                    <div className="text-15 text-light-1">
                    Add a new walk-in booking.
                    </div>
                </div>
                </div> */}
                
                <div className="tabs -underline-2 js-tabs">
                <div className="tabs__content pt-30 js-tabs-content">
                    <div className="col-auto row x-gap-20 y-gap-20 items-center">
                    {/* <div className="tabs__pane -tab-item-1 is-tab-el-active"> */}
                    <div className="col-12  w-full ml-15 mt-10">
                        <Switch labelText={"This is group booking"} onToggle={handleToggleGroupBooking} isChecked={isGroupBooking} />
                    </div>
                    
                    <ImageCard />
                    {/* <div className="d-flex y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32 mt-10"> */}
                    {isGroupBooking && (
                        <>
                        <div className="d-flex justify-between py-20 px-20 w-full ml-15 lg:pb-40 md:pb-32 mt-10">
                            <h1 className="text-15 lh-14 fw-500">Traveler Information</h1>
                            <button
                            className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white"
                            onClick={handleAddTraveler}
                            >
                            + Add a Traveler
                            <i className="icon icon-chevron-right ml-10" />
                            </button>
                        </div>

                        {Array.from({ length: travelerCount }).map((_, index) => (
                            <TravelerInformationCard key={index} index={index} />
                        ))}
                        </>
                    )}
                    {/* </div> */}
                    <BookingTimeCard />
                    <BookingPaymentCard />
                    <BookingCouponApplyCard />
                    <BookingStatusCard roomPrice={80} extraPrice={5} discount={2}  />

                    <div className="col-12 py-20 px-20 w-full ml-15 mt-10">
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

                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingForm;