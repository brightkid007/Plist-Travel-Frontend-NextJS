"use client";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const PropertyInfoCard = () => {
  const [checkInDate, setCheckInDate] = useState(new DateObject());
  const [checkOutDate, setCheckOutDate] = useState(
    new DateObject().add(10, "days")
  );
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  return (
    <div className="col-12 border-light rounded-8 py-20 px-20 mt-10">
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Check-in Date</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={checkInDate}
              onChange={setCheckInDate}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Check-out Date</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={checkOutDate}
              onChange={setCheckOutDate}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
          <h1 className="text-15 lh-14 fw-500">Rooms</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={rooms == 0}
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setRooms(rooms - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {rooms}
            <button
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setRooms(rooms + 1)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
          <h1 className="text-15 lh-14 fw-500">Adults</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={adults == 0}
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setAdults(adults - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {adults}
            <button
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setAdults(adults + 1)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 mt-10">
          <h1 className="text-15 lh-14 fw-500">Children</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={children == 0}
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setChildren(children - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {children}
            <button
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setChildren(children + 1)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoCard;
