"use client";

import svgIcon from "@/components/data/svgIcon";
import LinkTable from "./LinkTable";

const SalesLinkGen = () => {
  const links = [
    {
      name: "London Hotels Package",
      type: "Hotel",
      clicks: 145,
      conversions: 12,
      earnings: 360.0,
      status: "Active",
    },
    {
      name: "NYC Weekend Getaway",
      type: "Package",
      clicks: 87,
      conversions: 5,
      earnings: 175.5,
      status: "Active",
    },
    {
      name: "Paris Flights Promo",
      type: "Flight",
      clicks: 210,
      conversions: 18,
      earnings: 540.0,
      status: "Expired",
    },
    {
      name: "Barcelona Tour Special",
      type: "Tour",
      clicks: 122,
      conversions: 8,
      earnings: 280.0,
      status: "Expired",
    },
  ];
  return (
    <div className="row px-10">
      <div className="col-md-3 col-sm-12">
        <div className="border-light rounded-8 bg-white shadow-3 px-15 py-15 row">
          <div className="text-20 lh-14 fw-600 px-0 col-12">Your Earnings</div>
          <div className="text-14 text-light-1 px-0 col-12">
            Summary of your referral performance
          </div>
          <div className="bg-light-2 rounded-8 py-10 px-15 mt-10 col-12">
            <div className="text-14 text-light-1">Total Earnings</div>
            <div className="text-22 lh-14 fw-600">$1355.50</div>
          </div>
          <div className="col-12 px-0 mt-10 mb-0">
            <div className="row x-gap-10 y-gap-10 items-center">
              <div className="col-lg-12 col-xl-6">
                <div className="bg-light-2 rounded-8 py-10 px-15">
                  <div className="text-14 text-light-1" style={{wordWrap: "break-word", whiteSpace: "normal"}}>Conversions</div>
                  <div className="text-22 lh-14 fw-600">43</div>
                </div>
              </div>
              <div className="col-lg-12 col-xl-6">
                <div className="bg-light-2 rounded-8 py-10 px-15">
                  <div className="text-14 text-light-1" style={{wordWrap: "break-word", whiteSpace: "normal"}}>Total Clicks</div>
                  <div className="text-22 lh-14 fw-600">564</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-light rounded-8 bg-white shadow-3 py-15 row mt-20 y-gap-15">
          <div className="py-0">
            <div className="text-20 lh-14 fw-600">Generate New Link</div>
            <div className="text-14 text-light-1">
              Create a custom referral link
            </div>
          </div>
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500 mb-5">Link Type</h1>
            <select className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-full text-14">
              <option defaultValue>Hotel</option>
              <option value="properties">Properties</option>
              <option value="animation">Flights</option>
            </select>
          </div>
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500">Reference ID (Optional)</h1>
            <input
              className="border-light rounded-8 py-5 px-20 w-full mt-5"
              type="text"
              placeholder="e.g., HOTEL123 or TOUR456"
            />
            <div className="text-14 text-light-1 mt-5">
              Specific ID for the product you want to link to
            </div>
          </div>
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500">Custom URL Path (Optional)</h1>
            <input
              className="border-light rounded-8 py-5 px-20 w-full mt-5"
              type="text"
              placeholder="your-custom-path"
            />
            <div className="text-14 text-light-1 mt-5">
              Customize the URL for better recognition
            </div>
          </div>
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500 mb-5">Commission Rate</h1>
            <select className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-full text-14">
              <option defaultValue>Standard (10%)</option>
              <option value="properties">Properties</option>
              <option value="animation">Flights</option>
            </select>
          </div>
          <div className="col-12 d-flex">
            <div className="form-checkbox">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check"></div>
              </div>
            </div>
            <div className="row">
              <div className="text-15 lh-14 ml-10 fw-500">Enable extra price</div>
              <div className="text-14 lh-14 ml-10 fw-400 text-light-1">
                Track clicks and conversions for this link
              </div>
            </div>
          </div>
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500 mb-5">Link Expiration</h1>
            <select className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-full text-14">
              <option defaultValue>Never Expires</option>
              <option value="properties">10 days</option>
              <option value="animation">1 month</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-9 col-sm-12">
        <div className="border-light rounded-8 bg-white shadow-3 row ml-5">
          <div className="px-15 py-15">
            <div className="text-20 lh-14 fw-600">Your Sales Links</div>
            <div className="text-14 text-light-1">
              Manage and track all your generated referral links
            </div>
            <LinkTable links={links} />
          </div>
          <div className="border-top-light py-20">
            <button className="text-14 w-100 fw-500 py-5 rounded-8 border-light">
              {svgIcon.export}
              <span className="ml-10">Export Link Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesLinkGen;
