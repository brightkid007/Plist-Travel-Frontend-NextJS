import { useState, useEffect, useRef } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const Filter = ({ onFilterChange }) => {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (onFilterChange) {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for debouncing
      debounceTimer.current = setTimeout(() => {
        const filters = {
          status: status !== "all" ? status : undefined,
          category: category !== "all" ? category : undefined,
          subcategory: subcategory !== "all" ? subcategory : undefined,
          type: type !== "all" ? type : undefined,
          startDate: startDate ? startDate.format("YYYY-MM-DD") : new DateObject(),
          endDate: endDate ? endDate.format("YYYY-MM-DD") : new DateObject(),
        };
        onFilterChange(filters);
      }, 300); // 300ms debounce delay
    }

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [status, category, subcategory, type, startDate, endDate]);

  return (
    <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
        </select>
      </div>
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="all">All Subcategories</option>
        </select>
      </div>
      <div className="col-sm-auto">
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>
      <div className="col-sm-auto">
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 w-140 sm:w-full text-14"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          <optgroup label="Property List">
            <option value="hotel">Hotel</option>
            <option value="vacation">Vacation Rental</option>
            <option value="venue">Event Venue</option>
            <option value="spaces">Spaces</option>
          </optgroup>
          <optgroup label="Non-Property List">
            <option value="tour">Tour</option>
            <option value="activity">Activity</option>
            <option value="event">Event</option>
            <option value="ride">Ride</option>
            <option value="flight">Flight</option>
          </optgroup>
          <option value="travel-packages">Travel Packages</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
