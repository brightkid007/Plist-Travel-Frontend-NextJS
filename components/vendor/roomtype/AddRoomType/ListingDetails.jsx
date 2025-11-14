import { Dialog, Radio } from "@mui/material";
import CancellationPolicy from "../../common/CancellationPolicy";

const ListingDetails = ({ bookingType, roomTypeData, updateRoomTypeData }) => {

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Details</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Size in m2</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter property size"
          value={roomTypeData?.size || ""}
          onChange={(e) => updateRoomTypeData({ size: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Living Rooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Enter number of living rooms"
          value={roomTypeData?.living_rooms || ""}
          onChange={(e) => updateRoomTypeData({ living_rooms: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Number of Bedrooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Enter number of bedrooms"
          value={roomTypeData?.bedrooms || ""}
          onChange={(e) => updateRoomTypeData({ bedrooms: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Number of Bathrooms</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Enter number of bathrooms"
          value={roomTypeData?.bathrooms || ""}
          onChange={(e) => updateRoomTypeData({ bathrooms: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Check-in hour</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
          value={roomTypeData?.check_in_hour || ""}
          onChange={(e) => updateRoomTypeData({ check_in_hour: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Check-out hour</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
          value={roomTypeData?.check_out_hour || ""}
          onChange={(e) => updateRoomTypeData({ check_out_hour: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Late Check-in</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="time"
          value={roomTypeData?.late_check_in || ""}
          onChange={(e) => updateRoomTypeData({ late_check_in: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Additional Note about this Room Type</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter additional note about this room type"
          value={roomTypeData?.additional_note || ""}
          onChange={(e) => updateRoomTypeData({ additional_note: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Extra People</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Enter number of extra people allowed"
          value={roomTypeData?.extra_people || ""}
          onChange={(e) => updateRoomTypeData({ extra_people: e.target.value })}
        />
      </div>
      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">
          What's the shortest number of nights travelers can book?
        </h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Enter Minimum Stay"
          value={roomTypeData?.minimum_stay || ""}
          onChange={(e) => updateRoomTypeData({ minimum_stay: e.target.value })}
        />
        <div className="text-12 text-light-1 lh-1 mt-5">
          We suggest 3 or less for more bookings
        </div>
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">
          How many {bookingType == "hour" ? "hours" : "days"} before check-in
          will you accept bookings?
        </h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder={
            (bookingType == "hour" ? "Hours" : "Days") + " before check-in"
          }
          value={roomTypeData?.booking_advance_days || ""}
          onChange={(e) => updateRoomTypeData({ booking_advance_days: e.target.value })}
        />
      </div>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">
          How many months before check-in will you accept bookings?
        </h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          placeholder="Months before check-in"
          value={roomTypeData?.booking_advance_months || ""}
          onChange={(e) => updateRoomTypeData({ booking_advance_months: e.target.value })}
        />
      </div>
      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Cancellation Policy</h1>
        <CancellationPolicy />
      </div>
      <div className="col-md-3 col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Smoking Allowed</h1>
        <div className="form-radio">
          <div className="radio d-flex items-center">
            <input 
              type="radio" 
              name="smoking-allowed" 
              checked={roomTypeData?.smoking_allowed === true}
              onChange={() => updateRoomTypeData({ smoking_allowed: true })}
            />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input 
              type="radio" 
              name="smoking-allowed" 
              checked={roomTypeData?.smoking_allowed === false}
              onChange={() => updateRoomTypeData({ smoking_allowed: false })}
            />
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
            <input 
              type="radio" 
              name="party-allowed" 
              checked={roomTypeData?.party_allowed === true}
              onChange={() => updateRoomTypeData({ party_allowed: true })}
            />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input 
              type="radio" 
              name="party-allowed" 
              checked={roomTypeData?.party_allowed === false}
              onChange={() => updateRoomTypeData({ party_allowed: false })}
            />
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
            <input 
              type="radio" 
              name="pets-allowed" 
              checked={roomTypeData?.pets_allowed === true}
              onChange={() => updateRoomTypeData({ pets_allowed: true })}
            />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input 
              type="radio" 
              name="pets-allowed" 
              checked={roomTypeData?.pets_allowed === false}
              onChange={() => updateRoomTypeData({ pets_allowed: false })}
            />
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
            <input 
              type="radio" 
              name="children-allowed" 
              checked={roomTypeData?.children_allowed === true}
              onChange={() => updateRoomTypeData({ children_allowed: true })}
            />
            <div className="radio__mark">
              <div className="radio__icon" />
            </div>
            <div className="ml-10">Yes</div>
          </div>
          <div className="radio d-flex items-center ml-20">
            <input 
              type="radio" 
              name="children-allowed" 
              checked={roomTypeData?.children_allowed === false}
              onChange={() => updateRoomTypeData({ children_allowed: false })}
            />
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
          rows={3}
          type="textarea"
          placeholder="Extra rule will be mentioned here"
          value={roomTypeData?.rules || ""}
          onChange={(e) => updateRoomTypeData({ rules: e.target.value })}
        />
        <div className="form-checkbox d-flex items-center">
          <input 
            type="checkbox" 
            name="instant-booking"
            checked={roomTypeData?.instant_booking || false}
            onChange={(e) => updateRoomTypeData({ instant_booking: e.target.checked })}
          />
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

