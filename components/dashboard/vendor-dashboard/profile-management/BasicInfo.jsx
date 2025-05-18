import { useState } from "react";

const BasicInfo = () => {
  const [locationCount, setLocationCount] = useState(1);
  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600">Basic Infomation</div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Vendor Business Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Business Name"
        />
      </div>
      <div className="col-md-3 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner First Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter First Name"
        />
      </div>
      <div className="col-md-3 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner Last Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Last Name"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner Email</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Email"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Phone Number</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="tel"
          placeholder="+1 (123) 456 7890"
        />
      </div>
      <div className="text-18 fw-500 mt-10">Headquarters Business Address</div>
      <div className="col-12">
        <h1 className="text-13 lh-14 fw-500">Address</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Address"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">City</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter City"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">State/Province</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter State/Province"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Zip Code / Postal Code</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Zip Code / Postal Code"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Country</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
        </select>
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Region</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="northeast">Northeast</option>
          <option value="southeast">Southeast</option>
          <option value="midwest">Midwest</option>
          <option value="southwest">Southwest</option>
          <option value="west">West</option>
        </select>
      </div>
      <div className="col-12">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">
            Location Addresses
          </div>
          <div className="d-flex col-sm-auto pr-50">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setLocationCount(locationCount + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add Address
            </button>
          </div>
        </div>
        {Array.from({ length: locationCount }).map((_, index) => (
          <div
            className="d-flex justify-between items-center mt-10"
            key={index}
          >
            <input
              className="border-light rounded-8 py-5 px-15 w-full"
              type="text"
              placeholder="Enter Address"
            />
            <button
              className="ml-10 pt-5 px-5"
              onClick={() => setLocationCount(Math.max(1, locationCount - 1))}
            >
              <span className="material-symbols-outlined text-red-2 text-15 fw-500">
                delete
              </span>
            </button>
          </div>
        ))}
      </div>
      <div className="col-12 mt-10">
        <h1 className="text-13 lh-14 fw-500">Website URL</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="https://"
        />
      </div>
      <h1 className="text-15 lh-1 fw-500 mt-15">Vendor Type</h1>
      <div className="text-12 lh-1 text-light-1 fw-400">
        Select one or more options that apply to your business
      </div>
      <div className="col-md-6 col-sm-12 py-0">
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-12 ml-10">Hotel</div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 py-0">
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-12 ml-10">Vacation Rental Owners</div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 py-0">
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-12 ml-10">Spaces Owners</div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 py-0">
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-12 ml-10">Tours Operators</div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12 py-0">
        <div className="form-checkbox d-flex items-center">
          <input type="checkbox" name="name" />
          <div className="form-checkbox__mark">
            <div className="form-checkbox__icon icon-check" />
          </div>
          <div className="text-12 ml-10">Event / Activity Operator</div>
        </div>
      </div>

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button className="button border-light rounded-8 text-12 py-10 px-15 mr-10">Cancel</button>
        <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15">Save Changes</button>
      </div>
    </div>
  );
};

export default BasicInfo;
