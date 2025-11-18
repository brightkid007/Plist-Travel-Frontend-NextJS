"use client";

import { Radio } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useState, useEffect } from "react";

const OptionalPeriod = ({
  bookingPeriodEnabled,
  bookingStartDate,
  bookingEndDate,
  onBookingPeriodEnabledChange,
  onBookingStartDateChange,
  onBookingEndDateChange,
}) => {
  // Convert date string or DateObject to DateObject
  const parseDate = (date) => {
    if (!date) return new DateObject();
    if (date instanceof DateObject) return date;
    if (typeof date === "string") {
      try {
        return new DateObject(date);
      } catch {
        return new DateObject();
      }
    }
    return new DateObject();
  };

  const [startDate, setStartDate] = useState(parseDate(bookingStartDate));
  const [endDate, setEndDate] = useState(parseDate(bookingEndDate));

  // Update state when props change (for edit mode)
  useEffect(() => {
    setStartDate(parseDate(bookingStartDate));
  }, [bookingStartDate]);

  useEffect(() => {
    setEndDate(parseDate(bookingEndDate));
  }, [bookingEndDate]);

  return (
    <>
      <div className="d-flex items-center mt-5">
        <Radio
          checked={!bookingPeriodEnabled}
          onClick={() => onBookingPeriodEnabledChange(false)}
        />
        <div className="text-14 lh-14 ml-5">No</div>
      </div>
      <div className="d-flex items-center mt-5">
        <Radio
          checked={bookingPeriodEnabled}
          onClick={() => onBookingPeriodEnabledChange(true)}
        />
        <div className="text-14 lh-14 ml-5">Yes</div>
      </div>

      {bookingPeriodEnabled && (
        <div className="pl-20 d-flex items-center gap-2 mt-10">
          <div className="position-relative col-sm-auto">
            <div className="border-light rounded-8 pt-15 px-15 w-full h-50 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  onBookingStartDateChange(date);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMMM DD"
              />
            </div>
            <label
              className="position-absolute lh-1 text-12 text-light-1 px-5"
              style={{ left: "10px", top: "-5px", backgroundColor: "white" }}
            >
              Start date
            </label>
          </div>
          <div className="position-relative col-sm-auto">
            <div className="border-light rounded-8 pt-15 px-15 w-full h-50 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  onBookingEndDateChange(date);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMMM DD"
              />
            </div>
            <label
              className="position-absolute lh-1 text-12 text-light-1 px-5"
              style={{ left: "10px", top: "-5px", backgroundColor: "white" }}
            >
              End date
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default OptionalPeriod;

