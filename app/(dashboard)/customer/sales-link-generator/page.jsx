"use client";

import dynamic from "next/dynamic";
import Header1 from "@/components/header/header-1";
import DefaultFooter from "@/components/footer/default";
import { useState } from "react";

const SalesLinkGenerator = () => {
  const [linkType, setLinkType] = useState("Hotel");
  const [commissionRate, setCommissionRate] = useState("Standard (10%)");

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
    <>
      <Header1 />
      <div className="py-40"></div>
      <div className="container mb-30">
        <h1 className="text-30 lh-14 fw-600 mt-30">Sales Link Generator</h1>
        <div className="text-15 text-light-1">
          Create and manage custom referral links to earn commission on bookings
        </div>
        <div className="row px-10 mt-30">
          <div className="col-md-3 col-sm-12">
            <div className="border-light rounded-8 bg-white shadow-3 px-15 py-15 row">
              <div className="text-20 lh-14 fw-600 px-0">Your Earnings</div>
              <div className="text-14 text-light-1 px-0">
                Summary of your referral performance
              </div>
              <div className="bg-light-2 rounded-8 py-10 px-15 mt-10">
                <div className="text-14 text-light-1">Total Earnings</div>
                <div className="text-22 lh-14 fw-600">$1355.50</div>
              </div>
              <div className="d-flex items-center mt-10 px-0">
                <div className="bg-light-2 rounded-8 py-10 px-15 mr-5 w-100">
                  <div className="text-14 text-light-1">Conversions</div>
                  <div className="text-22 lh-14 fw-600">43</div>
                </div>
                <div className="bg-light-2 rounded-8 py-10 px-15 ml-5 w-100">
                  <div className="text-14 text-light-1">Total Clicks</div>
                  <div className="text-22 lh-14 fw-600">564</div>
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
                <h1 className="text-15 lh-14 fw-500">
                  Reference ID (Optional)
                </h1>
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
                <h1 className="text-15 lh-14 fw-500">
                  Custom URL Path (Optional)
                </h1>
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
                <div class="form-checkbox">
                  <input type="checkbox" name="name" />
                  <div class="form-checkbox__mark">
                    <div class="form-checkbox__icon icon-check"></div>
                  </div>
                </div>
                <div className="row">
                  <div class="text-15 lh-14 ml-10 fw-500">
                    Enable extra price
                  </div>
                  <div class="text-14 lh-14 ml-10 fw-400 text-light-1">
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
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_307_66390)">
                      <path
                        d="M14.832 10V12.6667C14.832 13.0203 14.6916 13.3594 14.4415 13.6095C14.1915 13.8595 13.8523 14 13.4987 14H4.16536C3.81174 14 3.4726 13.8595 3.22256 13.6095C2.97251 13.3594 2.83203 13.0203 2.83203 12.6667V10"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.5 6.66797L8.83333 10.0013L12.1667 6.66797"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.83203 10V2"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_307_66390">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.832031)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="ml-10">Export Link Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DefaultFooter />
    </>
  );
};

const LinkTable = ({ links }) => {
  return (
    <div className="w-100 mt-10 overflow-scroll scroll-bar-1">
      <table className="table-3 -border-bottom col-12">
        <thead className="bg-light-2">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Clicks</th>
            <th>Earnings</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, index) => (
            <tr>
              <td>
                <div className="text-14 lh-16 fw-500">{link.name}</div>
                <div className="text-12 lh-16 fw-500 text-light-1">
                  https://plistravels.com/r/london-hot…
                </div>
              </td>
              <td>
                <span className="border-light text-center px-10 rounded-100 text-12 fw-500 mr-20">
                  {link.type}
                </span>
              </td>
              <td>
                <div className="text-12 lh-16 fw-500">{link.clicks}</div>
                <div className="text-12 lh-16 fw-500 text-light-1">
                  {link.conversions} conversions
                </div>
              </td>
              <td className="lh-16">${link.earnings}</td>
              <td>
                {link.status == "Active" ? (
                  <span className="rounded-100 px-10 text-center text-12 fw-500 bg-green-1 text-green-2">
                    Active
                  </span>
                ) : (
                  <span className="rounded-100 px-10 text-center text-12 fw-500 bg-light-2 text-dark-1">
                    Expired
                  </span>
                )}
              </td>
              <td className="fw-500">
                <div className="d-flex">
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/paste.svg" />
                  </div>
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/link.svg" />
                  </div>
                  <div className="px-5 py-5">
                    <img src="/img/dashboard/icons/delete.svg" />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SalesLinkGenerator), {
  ssr: false,
});
