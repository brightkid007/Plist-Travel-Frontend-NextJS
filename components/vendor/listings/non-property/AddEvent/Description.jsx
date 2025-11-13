import { Checkbox } from "@mui/material";
import { useState } from "react";
import StarRating from "../../common/StarRating";

const Description = () => {
  const [starRating, setStarRating] = useState(0);

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Event Description</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter venue name"
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Date & Time</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="i.e. July 15, 2023, 6 PM"
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Category</h1>
        <select className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10">
          <option defaultValue>Select category</option>
          <option value="concert">Concert</option>
          <option value="festival">Festival</option>
          <option value="workshop">Workshop</option>
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Subcategory</h1>
        <select className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10">
          <option defaultValue>Select subcategory type</option>
          {/* <optgroup label="Property List">
            <option value="hotel">Hotel</option>
            <option value="vacation-rental">Vacation Rental</option>
            <option value="event-venue">Event Venue</option>
            <option value="spaces">Spaces</option>
          </optgroup>
          <optgroup label="Non-Property List">
            <option value="tour">Tour</option>
            <option value="activity">Activity</option>
            <option value="event">Event</option>
          </optgroup> */}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Star Rating</h1>
        <div className="mt-10">
          <StarRating
            value={starRating}
            onChange={setStarRating}
          />
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Description</h1>
        <textarea
          rows={3}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Describe your property"
        />
      </div>

      <div className="col-12 px-10 mt-10">
        <div className="row border-light rounded-8 px-10 py-10 y-gap-10 x-gap-10">
          <h1 className="text-18 lh-12 fw-500">Organizer Contact Info</h1>

          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Email</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter Email"
            />
          </div>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Phone</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="text"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
