"use client";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const BookingCouponApplyCard = () => {
  return (
    <div className="col-12 border-light rounded-8 py-20 px-20 w-full mt-10">
      <div className="row">
        <h1 className="text-15 lh-14 fw-500">Apply Coupon</h1>
        <div className="d-flex gap-2 mt-10">
          <input
            className="border-light rounded-8 py-5 px-20 w-full"
            type="text"
            placeholder="20000"
          />
          <button className="button rounded-8 px-30 text-12 -dark-1 bg-dark-3 text-white">
            Apply
          </button>
        </div>
        {/* <input
                    className="border-light rounded-8 py-5 px-20 w-full mt-10"
                    type="text"
                    placeholder="20000"
                    /> */}
      </div>
    </div>
  );
};

export default BookingCouponApplyCard;
