"use client";

import { useState } from "react";
import FormInput from "@/components/common/form/FormInput";
import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";

const Description = ({ bookingType, setBookingType }) => {
  const [rooms, setRooms] = useState(3);
  const [maxAdults, setMaxAdults] = useState(2);
  const [maxChildren, setMaxChildren] = useState(1);
  const [maxOccupancy, setMaxOccupancy] = useState(3);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const router = useRouter();

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Basic Information</h1>
      <div className="row y-gap-20 x-gap-10 justify-between items-center">
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-1 fw-500">Property</h1>
          <select
            className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10"
            onChange={(event) => {
              if (event.target.value === "create-new-property") {
                router.push("/vendor/listings/add?type=property&subtype=Hotel");
              }
            }}
          >
            <option defaultValue>Select property</option>
            <option value="create-new-property">Create New Property</option>
          </select>
        </div>
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-1 fw-500">Booking Type</h1>
          <select
            className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10"
            value={bookingType}
            onChange={(event) => {
              setShowSnackbar(true);
              setBookingType(event.target.value);
            }}
          >
            <option value="day-night">Book by Day/Night</option>
            <option value="hour">Book by Hour</option>
          </select>

          <Snackbar
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowSnackbar(false)}
          >
            <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
              All prices would need to be reviewed.
            </Alert>
          </Snackbar>
        </div>
        <FormInput
          label="Room Type"
          type="text"
          name="roomType"
          placeholder="Hotel ABC Executive Suite"
        />
        <FormInput
          onChange={(e) => {
            setMaxAdults(Number(e.target.value));
            setMaxOccupancy(Number(e.target.value) + maxChildren);
          }}
          label="Max no. of Adults"
          type="number"
          name="maxAdults"
          gridClass="col-sm-4"
          placeholder="2"
          min={1}
          defaultValue={maxAdults}
        />
        <FormInput
          onChange={(e) => {
            setMaxChildren(Number(e.target.value));
            setMaxOccupancy(Number(e.target.value) + maxAdults);
          }}
          label="Max no. of Children"
          type="number"
          name="maxChildren"
          gridClass="col-sm-4"
          placeholder="1"
          min={0}
          defaultValue={maxChildren}
        />
        <FormInput
          label="Max no. of Occupancy"
          type="number"
          name="maxOccupancy"
          gridClass="col-sm-4"
          placeholder="3"
          value={maxOccupancy}
        />
        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Amenities</h1>
          <div className="row mt-10">
            <div className="col-sm-6 form-checkbox d-flex items-center">
              <input type="checkbox" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Free WiFi</div>
            </div>
            <div className="col-sm-6 form-checkbox d-flex items-center">
              <input type="checkbox" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Swimming Pool</div>
            </div>
            <div className="col-sm-6 form-checkbox d-flex items-center">
              <input type="checkbox" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Air Conditioning</div>
            </div>
            <div className="col-sm-6 form-checkbox d-flex items-center">
              <input type="checkbox" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Breakfast Included</div>
            </div>
          </div>
        </div>
        <FormInput
          label="Description"
          rows={3}
          type="textarea"
          name="description"
          placeholder="Enter description for the room"
          gridClass="col-12"
        />
        <div className="col-12">
          <h1 className="text-14 lh-12 fw-500">Photos</h1>
          <div className="border-light rounded-8 px-15 py-15 mt-10">
            <div className="border-light rounded-8 border-dashed py-30 text-center">
              <span className="material-symbols-outlined text-light-1 text-40">
                upload
              </span>
              <div className="text-14 lh-1 text-light-1">
                Drag and drop or click to upload file
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-12 fw-500">
            Number of Available Rooms of this Type
          </h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="number"
            min={1}
            placeholder="Enter number of rooms available"
            onChange={(e) => setRooms(Number(e.target.value))}
          />
        </div>
        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Room Numbers</h1>
          <div className="row">
            {Array(rooms)
              .fill(null)
              .map((_, index) => (
                <FormInput
                  placeholder={"Room " + (index + 1)}
                  gridClass="col-sm-6"
                />
              ))}
          </div>
          <button
            className="button rounded-8 text-14 fw-500 mt-10 border-light px-15 py-10"
            onClick={() => setRooms(rooms + 1)}
          >
            <i className="icon-plus mr-15 text-14 fw-400"></i> Add Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Description;
