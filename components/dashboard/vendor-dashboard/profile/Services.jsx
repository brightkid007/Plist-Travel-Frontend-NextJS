import { useState } from "react";
import FileUploadForm from "./components/FileUploadForm";

const Services = () => {
  const [services, setServices] = useState(1);
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
      <div className="col-12">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">Service & Pricing</div>
          <div className="d-flex col-sm-auto">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setServices(services + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add Service
            </button>
          </div>
        </div>
        {Array.from({ length: services }).map((_, index) => (
          <div
            className="col-12 border-light rounded-8 px-15 py-15 mt-10"
            key={index}
          >
            <div className="row justify-between items-center y-gap-10">
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
              <div className="col-12">
                <h1 className="text-13 lh-14 fw-500">Description</h1>
                <textarea
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type="text"
                  placeholder="Enter Description"
                />
              </div>
              <div className="col-12 d-flex justify-end">
                <button
                  disabled={services === 1}
                  className="button text-12 px-5 text-red-1 fw-400"
                  onClick={() => setServices(services - 1)}
                >
                  <i className="icon-close mr-10 text-10"></i>Remove Service
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-12">
        <div className="text-18 fw-500 mt-10 col-auto">
          Availability Calendar
        </div>
        <div className="col-12 border-light rounded-8 px-15 py-15 mt-10">
          <div className="border-light border-dashed d-flex flex-column justify-center items-center rounded-8 py-30 px-15">
            <i className="icon-calendar-2 text-26 text-light-1"></i>
            <div className="text-18 fw-500 mt-10">Availability Calendar</div>
            <div className="text-14 text-light-1">
              Manage your service availability
            </div>
            <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15 mt-10">
              <i className="icon-calendar-2 mr-10 text-12"></i>Open Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
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
      </div>

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button className="button border-light rounded-8 text-12 py-10 px-15 mr-10">
          Cancel
        </button>
        <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Services;
