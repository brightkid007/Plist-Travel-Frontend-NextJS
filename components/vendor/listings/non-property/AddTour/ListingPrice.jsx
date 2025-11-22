import { Add, Remove } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import React, { useState } from "react";

const ListingPrice = () => {
  const [basePricesByDayOfWeek, setBasePricesByDayOfWeek] = useState(false);
  const [additionalPricesByGuests, setAdditionalPricesByGuests] =
    useState(false);
  const [guests, setGuests] = useState(1);
  const [prices, setPrices] = useState(1);

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <div className="row y-gap-10 x-gap-20">
      <h1 className="text-20 lh-14 fw-600">
        Price
        <Remove
          className="px-0 py-0"
          onClick={() => setPrices(Math.max(1, prices - 1))}
        />
        <Add className="px-0 py-0" onClick={() => setPrices(prices + 1)} />
      </h1>
      {Array(prices)
        .fill(null)
        .map((_, index) => (
          <React.Fragment key={index}>
            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Price Category <span className="text-red-1">*</span></h1>
              <select className="form-select w-full border-light rounded-8 h-50 mt-10">
                <option value="50">General Admission</option>
                <option value="100">VIP</option>
              </select>
            </div>
            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Price <span className="text-red-1">*</span></h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full h-50 mt-10"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>
          </React.Fragment>
        ))}

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Price per Person</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full h-50 mt-10"
          type="number"
          min="0"
          step="0.01"
          placeholder="i.e. $15 per person"
        />
      </div>
      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          value={basePricesByDayOfWeek}
          onChange={() => setBasePricesByDayOfWeek(!basePricesByDayOfWeek)}
        />
        <span className="text-16 fw-400 lh-1">Base Prices by Day of Week</span>
      </div>
      {basePricesByDayOfWeek &&
        weekDays.map((day) => (
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-1 fw-500">{day} Price</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="number"
              min="0"
              step="0.01"
              placeholder={`Enter ${day} Price`}
            />
          </div>
        ))}
      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          value={additionalPricesByGuests}
          onChange={() =>
            setAdditionalPricesByGuests(!additionalPricesByGuests)
          }
        />
        <span className="text-16 fw-400 lh-1">
          Additional Base Prices by Number of Guests
        </span>
        <span
          class="material-symbols-outlined cursor-pointer ml-10"
          onClick={() => setGuests(Math.max(guests - 1, 1))}
        >
          remove
        </span>
        <span
          class="material-symbols-outlined cursor-pointer"
          onClick={() => setGuests(guests + 1)}
        >
          add
        </span>
      </div>
      {additionalPricesByGuests &&
        Array(guests)
          .fill(null)
          .map((_, index) => (
            <React.Fragment key={index}>
              <div className="col-md-4 mt-5">
                <h1 className="text-14 lh-1 fw-500">
                  Number of Guest Start Range
                </h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="number"
                  min="1"
                  step="1"
                  placeholder={1 + index * 20}
                />
              </div>
              <div className="col-md-4 mt-5">
                <h1 className="text-14 lh-1 fw-500">
                  Number of Guest End Range
                </h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="number"
                  min="1"
                  step="1"
                  placeholder={20 + index * 20}
                />
              </div>
              <div className="col-md-4 mt-5">
                <h1 className="text-14 lh-1 fw-500">Guests Price</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-10"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={`$${100 + index * 20}`}
                />
              </div>
            </React.Fragment>
          ))}
    </div>
  );
};

export default ListingPrice;
