"use client";

import { Checkbox } from "@mui/material";
import { useState } from "react";
import Calendar from "../../roomtype/AddRoomType/Calendar";
import { useRouter } from "next/navigation";
// import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
// import { TimeRangePicker } from "@mui/x-date-pickers-pro/TimeRangePicker";

const Services = () => {
  const [services, setServices] = useState(1);
  const [schedulingNeed, setSchedulingNeed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hours = Array.from({ length: 48 }, (_, i) => (i + 1) * 0.5);
  const handleClose = () => {
    setShowModal(false);
  };
const router = useRouter();

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Service Details</div>
      <div className="text-12 text-light-1 lh-1">
        Manage your services, availability, and pricing information.
      </div>
      <div className="col-12">
        <h1 className="text-13 lh-14 fw-500">Description of Services</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Description of Services"
        />
      </div>
      <div className="col-12 mb-10">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">Service & Pricing</div>
          {/* <div className="d-flex col-sm-auto">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setServices(services + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add Service
            </button>
          </div> */}
        </div>
        <div className="col-12 border-light rounded-8 px-15 py-15 mt-10">
          <div className="row x-gap-15 y-gap-15 justify-between items-center y-gap-10">
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Service Name</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Service Name"
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Service Type</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Service Type"
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Base Price</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                prefix="$"
                type="text"
                placeholder="Enter Base Price"
              />
            </div>
            <div className="col-12 d-flex gap-2 items-center">
              <Checkbox
                className="px-0 py-0"
                value={schedulingNeed}
                onChange={() => setSchedulingNeed(!schedulingNeed)}
              />
              <h1 className="text-14 lh-14 fw-500">Scheduling Needed</h1>
            </div>
            {schedulingNeed && (
              <>
                {/* <div className="col-md-4">
                  <h1 className="text-13 lh-14 fw-500">Hours Available</h1>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeRangePicker format="HH:mm" className="mt-5" />
                    </LocalizationProvider>
                </div> */}
                <div className="col-sm-6">
                  <h1 className="text-13 lh-14 fw-500">Hours Available</h1>
                  <select className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 h-55 w-full text-14 mt-5">
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} {hour <= 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6">
                  <h1 className="text-13 lh-14 fw-500">
                    Availability Per Timeframe
                  </h1>
                  <input
                    className="border-light rounded-8 py-5 px-15 w-full h-55 mt-5"
                    type="text"
                    placeholder="Enter Availability Per Timeframe"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Calendar />

      {/* <div className="col-12">
        <div className="text-18 fw-500 mt-10 col-auto">
          Cancellation Policies
        </div>
        <div className="col-12 border-light rounded-8 px-15 py-15 mt-10">
          <div className="text-16  fw-500">Flexible Cancellation Policy</div>
          <div className="d-flex items-start mt-5">
            <span className="material-symbols-outlined text-15 fw-500 mr-10 lh-19">
              schedule
            </span>
            <div>
              <div className="text-14 fw-500">
                Full refund if cancelled 24 hours before check-in
              </div>
              <div className="text-12 text-light-1 lh-1">
                Guests can receive a full refund if they cancel at least 24
                hours before the check-in date.
              </div>
            </div>
          </div>
          <textarea
            className="border-light rounded-8 py-5 px-15 w-full mt-20"
            type="text"
            placeholder="Add custom policy details..."
          />
        </div>
      </div> */}

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button className="button border-light rounded-8 text-12 py-10 px-15 mr-10">
          Cancel
        </button>
        <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15" onClick={() => router.push("/vendor/addon")}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Services;
