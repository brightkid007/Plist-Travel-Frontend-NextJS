"use client";

import flight from "/public/img/dashboard/services/flight.svg";
import hotel from "/public/img/dashboard/services/hotel.svg";
import transportation from "/public/img/dashboard/services/transportation.svg";
import tours from "/public/img/dashboard/services/tours.svg";
import activities from "/public/img/dashboard/services/activities.svg";
import Image from "next/image";
import { useEffect } from "react";
import svgIcon from "@/components/data/svgIcon";

export const PackageSummary = ({ selectedItems }) => {
  const COMPONENT_MAP = {
    Rides: {
      name: "Ride",
      icon: transportation,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            {svgIcon.bus}
            <div className="text-12 lh-14 fw-600 ml-5">Hourly Transfer</div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.location_picker}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Pickup location to Dropoff location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.calendar}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    Flights: {
      name: "Flight",
      icon: flight,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            {svgIcon.flight}
            <div className="text-12 lh-14 fw-600 ml-5">To</div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.calendar}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.users}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              1 passenger(s), Economy class
            </div>
          </div>
        </>
      ),
    },
    Tours: {
      name: "Tours",
      icon: tours,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            {svgIcon.map}
            <div className="text-12 lh-14 fw-600 ml-5">Guided Tour</div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.location_picker}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Tour location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.calendar}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    "Attractions/Events": {
      name: "Attractions/Events",
      icon: activities,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            {svgIcon.adventure}
            <div className="text-12 lh-14 fw-600 ml-5">Adventure Activity</div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.location_picker}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              Activity location
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.calendar}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
        </>
      ),
    },
    Properties: {
      name: "Property",
      icon: hotel,
      content: (
        <>
          <div className="mt-10 d-flex items-center">
            {svgIcon.flat}
            <div className="text-12 lh-14 fw-600 ml-5">Hotel accommodation</div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.calendar}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              No date selected
            </div>
          </div>
          <div className="mt-10 d-flex items-center">
            {svgIcon.users}
            <div className="text-12 text-light-1 lh-14 fw-400 ml-5">
              1 room(s), 2 adult(s), 0 child(ren)
            </div>
          </div>
        </>
      ),
    },
  };

  const selectedService = selectedItems.map((item) => COMPONENT_MAP[item.name]);
  return (
    <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
      <h1 className="text-20 lh-14 fw-600">Package Summary</h1>
      {selectedItems.map((item, index) => (
        <div
          key={index}
          className="col-auto py-5 px-15 rounded-16 text-10 lh-16 fw-500 uppercase ml-10 mb-10 bg-blue-2 text-dark-3"
        >
          {item.name}
        </div>
      ))}
      <h1 className="text-18 lh-14 fw-500">Package Summary</h1>
      <div className="px-15">
        <div className="py-15 px-15 rounded-8 border-light bg-white">
          <div className="text-18 lh-14 fw-600">Package Preview</div>
          <div className="text-12 text-light-1 lh-14 fw-400 mb-10">
            This is how your Package will appear to clients.
          </div>
          <div className="row">
            <img
              src="/img/general/convChannel2.png"
              className="px-0 w-100"
              style={{ height: "150px", objectFit: "fill" }}
              alt=""
            />
          </div>
          <div className="row justify-between items-center mt-15">
            <div className="col-sm-12 col-md-auto">
              <div className="text-18 lh-16 rounded-4 fw-600">
                Exclusive Bali Getaway
              </div>
              <div className="text-12 text-light-1 lh-16 fw-400">
                Package Tour
              </div>
            </div>

            <div className="col-sm-12 col-md-auto d-flex flex-column items-end">
              <div className="text-10 text-light-1 lh-16 fw-400 line-through">
                $1,999
              </div>
              <div className="text-18 lh-16 rounded-4 text-green-2 fw-600">
                $1,699
              </div>
              <div className="text-10 text-light-1 lh-16 fw-400">
                per person
              </div>
            </div>
          </div>
          <div className="text-12 lh-16 fw-400">
            Experience the ultimate luxury escape to Bali with this exclusive
            package designed for discerning travelers. Enjoy pristine beaches,
            cultural excursions, and world-class amenities.
          </div>
          <div className="text-12 lh-16 fw-400 mt-10">Inclusions:</div>
          <div className="text-12 lh-16 fw-400">
            • 5-Night Luxury Hotel Stay
          </div>
          <div className="text-12 lh-16 fw-400"> • Daily Breakfast</div>
          <div className="text-12 lh-16 fw-400"> • Airport Transfers</div>
          <div className="text-12 text-light-1 lh-16 fw-400 mt-10">
            Valid until: April 30, 2024
          </div>
          <div className="text-12 text-light-1 lh-16 fw-400 mt-10">
            Terms & Conditions:
          </div>
          <div className="text-12 text-light-1 lh-16 fw-400 mb-10">
            Subject to availability. Blackout dates may apply. Cancellation
            policy: 50% refund if cancelled 30 days before arrival, no refund
            thereafter.
          </div>
          <button className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-12">
            Book Now
          </button>
        </div>
      </div>
      <h1 className="text-18 lh-14 fw-500">Selected Services</h1>
      {selectedService.map((item, index) => (
        <div key={index} className="col-md-6 col-sm-12">
          <div className="py-15 px-15 rounded-8 bg-white shadow-3 border-light">
            <div className="d-flex items-center">
              <Image
                src={item.icon}
                alt={item.name}
                width={30}
                height={30}
                unoptimized
              />
              <div className="text-15 lh-14 fw-500 ml-10">{item.name}</div>
            </div>
            {item.content}
          </div>
        </div>
      ))}
      <div className="py-5 px-15">
        <div className="py-15 px-15 rounded-8 border-light bg-white">
          <div className="d-flex items-center justify-between">
            <div className="text-12 lh-14 fw-500">Status</div>
            <div className="col-auto py-5 px-15 rounded-100 text-10 lh-16 fw-500 ml-10 bg-yellow-1 text-dark-3">
              Pending
            </div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Room(s) Price:</div>
            <div className="text-12 lh-14 fw-500">$ 200,000.00</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Extra(s) price:</div>
            <div className="text-12 lh-14 fw-500">$ 0.00</div>
          </div>
          <div className="d-flex items-center justify-between mt-5">
            <div className="text-12 lh-14 fw-500">Discount:</div>
            <div className="text-12 lh-14 fw-500">$ 0.00</div>
          </div>
          <div className="d-flex items-center justify-between border-top-light pt-15 mt-15">
            <div className="text-12 lh-14 fw-600">Total:</div>
            <div className="text-12 lh-14 fw-600">$ 200,000.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};
