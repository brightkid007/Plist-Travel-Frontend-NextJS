import Hotels from "@/components/hotels/Hotels";
import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TravelerInformationCard from "./TravelInformationCard";

export const ServiceDetail = ({ selectedItems, activeTab, setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  const COMPONENT_MAP = {
    Flights: {
      label: "Flight",
      name: "Flight Details",
      content: <FlightDetails />,
    },
    Properties: {
      label: "Property",
      name: "Property Details",
      content: <HotelDetails />,
    },
    Rides: {
      label: "Ride",
      name: "Rides Details",
      content: <TransportationDetails />,
    },
    Tours: {
      label: "Tours",
      name: "Tours Details",
      content: <ToursDetails />,
    },
    "Attractions/Events": {
      label: "Attraction/Events",
      name: "Attractions & Events Details",
      content: <ActivitiesDetails />,
    },
  };

  const categoryList = selectedItems.map((item) => COMPONENT_MAP[item.name]);

  return (
    <>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        <h1 className="text-20 lh-14 fw-600">
          {categoryList.map((item, index) =>
            activeCategory === index ? item.name : null
          )}
        </h1>
        <div className="col-12 row y-gap-10">
          {categoryList.map((item, index) => (
            <div
              key={index}
              className={
                "col-auto py-5 px-15 rounded-16 text-10 lh-16 fw-500 uppercase ml-10 mb-20 " +
                (activeCategory >= index
                  ? "bg-dark-3 text-white"
                  : "bg-blue-2 text-dark-3")
              }
            >
              {item.label}
            </div>
          ))}
          {categoryList.map(
            (item, index) => index == activeCategory && item.content
          )}
        </div>
        <div className="col-12 px-30 mt-10">
          <div className="row y-gap-20 justify-between items-end">
            <button
              className="button rounded-8 py-10 px-30 text-12 -dark-1 border-light text-light-1 col-auto"
              onClick={() => {
                if (activeCategory == 0) {
                  setActiveTab(activeTab - 1);
                } else {
                  setActiveCategory(Math.max(0, activeCategory - 1));
                }
              }}
            >
              <i className="icon icon-chevron-left mr-10" /> Back
            </button>
            <button
              className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto"
              onClick={() => {
                if (activeCategory === categoryList.length - 1) {
                  setActiveTab(activeTab + 1);
                } else {
                  setActiveCategory(activeCategory + 1);
                }
              }}
            >
              Continue
              <i className="icon icon-chevron-right ml-10" />
            </button>
          </div>
        </div>
      </div>
      <div className="row y-gap-20 justify-between items-end mt-20">
        <div className="col-auto">
          <div className="sectionTitle -md">
            <h2 className="sectionTitle__title">Search Results</h2>
            <p className=" sectionTitle__text mt-5 sm:mt-0">6 options found</p>
          </div>
        </div>
        <div className="col-auto md:d-none row justify-between items-center">
          Sort by:
          <select className="form-select rounded-4 border-light justify-between text-16 fw-500 ml-20 px-20 h-50 w-140 sm:w-full text-14">
            <option defaultValue>All</option>
            <option value="properties">Properties</option>
            <option value="animation">Flights</option>
            <option value="design">Rides</option>
            <option value="illustration">Attractions & Events</option>
            <option value="lifestyle">Tours</option>
            <option value="business">Travel Packages</option>
          </select>
        </div>
        <div className="relative overflow-hidden pt-40 sm:pt-20 js-section-slider item_gap-x30">
          <Hotels />
        </div>
      </div>
    </>
  );
};

const FlightDetails = () => {
  const options = [
    { label: "One Way", value: "oneway" },
    { label: "Round Trip", value: "roundtrip" },
    { label: "Multi-City", value: "multicity" },
  ];
  const [departureDate, setDepartureDate] = useState(new DateObject());
  const [returnDate, setReturnDate] = useState(
    new DateObject().add(10, "days")
  );
  const [passengers, setPassengers] = useState(1);
  return (
    <>
      <h1 className="text-16 lh-14 fw-500">Flight Details</h1>
      <h1 className="text-14 lh-12 fw-500">Flight Type</h1>
      <div className="col-12 row y-gap-10 items-center">
        {options.map((option, index) => (
          <div className="col-auto" key={index}>
            <div className="form-radio">
              <div className="radio d-flex items-center">
                <input type="radio" name="flight-type" value={option.value} />
                <div className="radio__mark">
                  <div className="radio__icon" />
                </div>
                <div className="ml-10">{option.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 row y-gap-10 pl-30">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Origin</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="City or Airport"
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Destination</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="City or Airport"
          />
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
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Return Date</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={returnDate}
              onChange={setReturnDate}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Passengers</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={passengers == 0}
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setPassengers(passengers - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {passengers}
            <button
              className="button rounded-8 py-20 px-20 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setPassengers(passengers + 1, categoryList.length)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h1 className="text-15 lh-14 fw-500">Class</h1>
          <select className="form-select rounded-4 border-light px-20 justify-between text-16 fw-500 h-50 w-full sm:w-full text-14 mt-10">
            <option defaultValue>Economy</option>
            <option value="properties">Properties</option>
            <option value="animation">Flights</option>
            <option value="design">Rides</option>
            <option value="illustration">Attractions & Events</option>
            <option value="lifestyle">Tours</option>
            <option value="business">Travel Packages</option>
          </select>
        </div>
      </div>
    </>
  );
};

const HotelDetails = () => {
  const [checkInDate, setCheckInDate] = useState(new DateObject());
  const [checkOutDate, setCheckOutDate] = useState(
    new DateObject().add(10, "days")
  );
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  return (
    <>
      <h1 className="text-16 lh-14 fw-500">Property Details</h1>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Destination/Hotel Name</h1>
        <input
          className="border-light rounded-8 py-5 px-20 w-full mt-10"
          type="text"
          placeholder="City, region or Hotel Name"
        />
      </div>
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
      <div className="col-lg-4 col-md-4 col-sm-12">
        <h1 className="text-15 lh-14 fw-500">Rooms</h1>
        <div className="d-flex mt-10 items-center fw-600">
          <button
            disabled={rooms == 1}
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
      <div className="col-lg-4 col-md-4 col-sm-12">
        <h1 className="text-15 lh-14 fw-500">Adults</h1>
        <div className="d-flex mt-10 items-center fw-600">
          <button
            disabled={adults == 1}
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
      <div className="col-lg-4 col-md-4 col-sm-12">
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
      <h1 className="text-15 lh-14 fw-500">Traveler Information</h1>
      {Array.from({ length: adults }).map((_, index) => (
        <TravelerInformationCard
          key={index}
          index={index}
          adults={adults}
          setAdults={setAdults}
        />
      ))}
    </>
  );
};

const TransportationDetails = () => {
  const options = [
    { label: "Airport Transfer", value: "airporttransfer" },
    { label: "Intercity Transfer", value: "intercitytransfer" },
    { label: "Hourly Rental", value: "hourlyrental" },
    { label: "Bus/Coach", value: "buscoach" },
  ];
  const [date, setDate] = useState(new DateObject());
  const [passengers, setPassengers] = useState(1);

  return (
    <>
      <h1 className="text-16 lh-14 fw-500">Ground Transportation Details</h1>
      <h1 className="text-14 lh-12 fw-500">Transportation Type</h1>
      {options.map((option, index) => (
        <div className="col-6" key={index}>
          <div className="form-radio">
            <div className="radio d-flex items-center">
              <input type="radio" name="flight-type" value={option.value} />
              <div className="radio__mark">
                <div className="radio__icon" />
              </div>
              <div className="ml-10">{option.label}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="col-12 row y-gap-20 pl-30">
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Pickup Location</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="Airport, hotel or address"
          />
        </div>
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Dropoff Location</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="Airport, hotel or address"
          />
        </div>
        <div className="col-6">
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
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Passengers</h1>
          <div className="d-flex mt-10 items-center fw-600">
            <button
              disabled={passengers == 0}
              className="button rounded-8 py-15 px-15 text-12 -dark-1 border-light mr-20 col-auto"
              onClick={() => setPassengers(passengers - 1)}
            >
              <i className="icon icon-minus" />
            </button>
            {passengers}
            <button
              className="button rounded-8 py-15 px-15 text-12 -dark-1 border-light ml-20 col-auto"
              onClick={() => setPassengers(passengers + 1)}
            >
              <i className="icon icon-plus" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ToursDetails = () => {
  const [date, setDate] = useState(new DateObject());
  const [paricipants, setParicipants] = useState(1);
  return (
    <>
      <h1 className="text-16 lh-14 fw-500">Tour Details</h1>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Tour Type</h1>
        <input
          className="border-light rounded-8 py-5 px-20 w-full mt-10"
          type="text"
          placeholder="e.g. Guided Tour"
        />
      </div>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Destination</h1>
        <input
          className="border-light rounded-8 py-5 px-20 w-full mt-10"
          type="text"
          placeholder="City or region"
        />
      </div>
      <div className="col-6 pl-40">
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
      <div className="col-6">
        <h1 className="text-15 lh-14 fw-500">Paricipants</h1>
        <div className="d-flex mt-10 items-center fw-600">
          <button
            disabled={paricipants == 0}
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
    </>
  );
};

const ActivitiesDetails = () => {
  const [date, setDate] = useState(new DateObject());
  const [paricipants, setParicipants] = useState(1);
  return (
    <>
      <h1 className="text-16 lh-14 fw-500">Activities & Events Details</h1>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Activity Type</h1>
        <input
          className="border-light rounded-8 py-5 px-20 w-full mt-10"
          type="text"
          placeholder="e.g. Adventure Activities"
        />
      </div>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Location</h1>
        <input
          className="border-light rounded-8 py-5 px-20 w-full mt-10"
          type="text"
          placeholder="City or venue"
        />
      </div>
      <div className="col-6">
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
      <div className="col-6">
        <h1 className="text-15 lh-14 fw-500">Paricipants</h1>
        <div className="d-flex mt-10 items-center fw-600">
          <button
            disabled={paricipants == 0}
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
    </>
  );
};
