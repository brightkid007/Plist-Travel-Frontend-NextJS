'use client'
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const BookingTimeCard = () => {
    const [departureDate, setDepartureDate] = useState(new DateObject());
    const [returnDate, setReturnDate] = useState(
        new DateObject().add(10, "days")
    );
    return (
        <div className="col-12 row border-light rounded-8 py-20 px-20 w-full ml-15 mt-10">
            <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">Arrival Date</h1>
                <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
                    <DatePicker
                        inputClass="custom_input-picker"
                        containerClassName="custom_container-picker"
                        value={departureDate}
                        onChange={setDepartureDate}
                        numberOfMonths={1}
                        offsetY={10}
                        format="MMMM DD"
                    />
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">Departure Date</h1>
                <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
                    <DatePicker
                        inputClass="custom_input-picker"
                        containerClassName="custom_container-picker"
                        value={departureDate}
                        onChange={setDepartureDate}
                        numberOfMonths={1}
                        offsetY={10}
                        format="MMMM DD"
                    />
                </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Arrival Time</h1>
                <input
                    className="border-light rounded-8 py-5 px-20 w-full mt-10"
                    type="text"
                    placeholder="02:00 PM"
                />
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Departure Time</h1>
                <input
                    className="border-light rounded-8 py-5 px-20 w-full mt-10"
                    type="text"
                    placeholder="12:00 PM"
                />
            </div>
        </div>
    )
}

export default BookingTimeCard;