'use client'
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const BookingPaymentCard = () => {
    const [departureDate, setDepartureDate] = useState(new DateObject());
    const [returnDate, setReturnDate] = useState(
        new DateObject().add(10, "days")
    );
    return (
        <div className="col-12 row border-light rounded-8 py-20 px-20 w-full ml-15 mt-10">
            
            <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Amount</h1>
                <input
                    className="border-light rounded-8 py-5 px-20 w-full mt-10"
                    type="text"
                    placeholder="20000"
                />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Payment Method</h1>
                <select
                    className="form-select border-light rounded-2 py-2 px-3 w-100 mt-2"
                    defaultValue="credit"
                >
                    <option value="credit">Credit Card</option>
                    <option value="apple">Apple Pay</option>
                    <option value="stripe">Stripe</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="flutter">Flutterwave</option>
                </select>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Payment Account</h1>
                <select
                    className="form-select border-light rounded-2 py-2 px-3 w-100 mt-2"
                    defaultValue=""
                >
                    <option value="">#34EFSFA56</option>
                </select>
            </div>
            <div className="col-12 mt-10">
                <h1 className="text-15 lh-14 fw-500">Payment Note</h1>
                <textarea
                    className="border-light rounded-8 py-5 px-20 w-full mt-10"
                    rows={4}
                    placeholder="Add any payment notes or special instructions here"
                />
            </div>

        </div>
    )
}

export default BookingPaymentCard;