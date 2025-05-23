import { useState } from "react";

const ListingDetails = () => {
  const [rooms, setRooms] = useState(1);

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Details</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Size in m2</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter property size"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Living Rooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter number of living rooms"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Bedrooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter number of bedrooms"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Bathrooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter number of bathrooms"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Check-in hour</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Check-out hour</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Late Check-in</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Outdoor facilities</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter outdoor facilities"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Extra People</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter number of extra people allowed"
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Availability</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter availability"
        />
      </div>
      <div className="col-12 mt-5">
        <div className="border-light rounded-8 px-15 py-15">
          <div className="text-16 fw-500 mb-10 lh-1">
            Rooms or Listings Type Image
          </div>
          {Array(rooms)
            .fill(null)
            .map((_, index) => (
              <RoomImageForm key={index} />
            ))}
          <button
            className="button border-light rounded-8 py-10 px-15 mt-15 text-14 fw-500"
            onClick={() => setRooms(rooms + 1)}
          >
            Add Room
          </button>
        </div>
      </div>
      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Cancellation Policy</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter cancellation policy"
        />
      </div>
      <div className="col-md-3 col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Smoking Allowed</h1>
        <div className="form-radio">
          <div className="radio d-flex items-center">
            <input type="radio" name="smoking-allowed" value={true} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input type="radio" name="smoking-allowed" value={false} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">No</div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Party Allowed</h1>
        <div className="form-radio">
          <div className="radio d-flex items-center">
            <input type="radio" name="party-allowed" value={true} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input type="radio" name="party-allowed" value={false} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">No</div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Pets Allowed</h1>
        <div className="form-radio">
          <div className="radio d-flex items-center">
            <input type="radio" name="pets-allowed" value={true} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input type="radio" name="pets-allowed" value={false} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">No</div>
          </div>
        </div>
      </div>

      <div className="col-md-3 col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Children Allowed</h1>
        <div className="form-radio">
          <div className="radio d-flex items-center">
            <input type="radio" name="children-allowed" value={true} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input type="radio" name="children-allowed" value={false} />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">No</div>
          </div>
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Other rules</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Extra rule will be mentioned here"
        />
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-14 fw-500 ml-10">Allow Instant Booking</div>
        </div>
      </div>
    </div>
  );
};

const RoomImageForm = () => {
  return (
    <div className="row y-gap-10 x-gap-10 items-end">
      <div className="col-sm-4 mt-5">
        <h1 className="text-14 lh-1 fw-500">Room Type</h1>
        <select className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10">
          <option defaultValue>Select room type</option>
        </select>
      </div>
      <div className="col-sm-4 mt-5">
        <h1 className="text-14 lh-1 fw-500">Person</h1>
        <select className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10">
          <option defaultValue>Select occupancy</option>
        </select>
      </div>
      <div className="col-sm-4">
        <div className="border-light rounded-8 py-10 px-15 text-center text-13 fw-500">
          Image Upload
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
