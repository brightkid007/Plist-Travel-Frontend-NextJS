import { Checkbox } from "@mui/material";
import { useState } from "react";

const ListingPrice = () => {
  const [basePricesByDayOfWeek, setBasePricesByDayOfWeek] = useState(false);
  const [additionalPricesByGuests, setAdditionalPricesByGuests] =
    useState(false);
  const [guests, setGuests] = useState(1);
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
      <h1 className="text-20 lh-14 fw-600">Listing Price</h1>
      <div className="col-12 mt-5">
        <div className="border-light rounded-8 px-15 py-15">
          <div className="d-flex justify-between items-center">
            <div className="d-flex flex-column items-start">
              <span className="text-16 fw-500 mb-5 lh-1">Single Room</span>
              <span className="text-14 fw-400 text-light-1 lh-1">2 Person</span>
            </div>
            <span className="text-20 fw-600 lh-1">$50.00</span>
          </div>
          <div className="d-flex justify-between items-center mt-20">
            <div className="d-flex flex-column items-start">
              <span className="text-16 fw-500 mb-5 lh-1">Single Room</span>
              <span className="text-14 fw-400 text-light-1 lh-1">2 Person</span>
            </div>
            <span className="text-20 fw-600 lh-1">$50.00</span>
          </div>
        </div>
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
            <div className="col-md-6 mt-5" key={index}>
              <h1 className="text-14 lh-1 fw-500">{index + 1} Guests Price</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                min="0"
                step="0.01"
                placeholder={`$${100 + index * 20}`}
              />
            </div>
          ))}
    </div>
  );
};

export default ListingPrice;
