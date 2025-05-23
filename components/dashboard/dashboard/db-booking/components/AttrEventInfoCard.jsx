"use client";
import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const AttrEventInfoCard = () => {
  const [date, setDate] = useState(new DateObject());
  const [paricipants, setParicipants] = useState(1);
  return (
    <div className="col-12 border-light rounded-8 py-20 px-20 mt-10">
      <div className="row">
        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Location</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="City or venue"
          />
        </div>
        <div className="col-6 mt-10">
          <h1 className="text-15 lh-14 fw-500">Date</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={date}
              onChange={setDate}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-6 mt-10">
          <h1 className="text-15 lh-14 fw-500">Paricipants</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={paricipants === 0}
              className="button rounded-8 py-15 px-15 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setParicipants(paricipants - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {paricipants}
            <button
              className="button rounded-8 py-15 px-15 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setParicipants(paricipants + 1)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttrEventInfoCard;
