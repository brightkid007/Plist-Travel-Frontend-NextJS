"use client";

import { useState } from "react";
import Image from "next/image";
import Rewards from "./Rewards";
import PointHistory from "./PointHistory";

const LoyaltySettings = () => {
  const options = [
    { label: "Rewards", value: "rewards", content: <Rewards /> },
    {
      label: "Point History",
      value: "pointhistory",
      content: <PointHistory />,
    },
  ];
  const [option, setOption] = useState("rewards");
  return (
    <div className="row px-10">
      <div className="col-md-4 col-sm-12">
        <div className="border-light rounded-8 bg-white shadow-3 px-20 py-20 d-flex flex-column justify-content-center align-items-center">
          <div className="text-20 lh-14 fw-600 mb-20">Your Loyalty Status</div>
          <div className="row justify-center items-center">
            <div className="col-auto">
              <div className="d-flex ratio ratio-1:1 w-200">
                <Image
                  width={200}
                  height={200}
                  src="/img/misc/avatar-1.png"
                  alt="image"
                  className="img-ratio rounded-full"
                />
                {/* <div className="d-flex justify-end px-10 py-10 h-100 w-1/1 absolute">
                                                      <div className="size-40 bg-white rounded-full flex-center cursor-pointer">
                                                        <i className="icon-trash text-16" />
                                                      </div>
                                                    </div> */}
              </div>
            </div>
            <div className="col-12 text-18 fw-600 text-center">Asf</div>
            <div class="col-auto py-5 px-15 rounded-16 text-10 lh-16 fw-500 ml-10 bg-dark-3 text-white">
              Pending
            </div>
          </div>
          <div className="d-flex justify-between mt-20">
            <div className="text-12 lh-14 fw-500">Current Points</div>
            <div className="text-12 lh-14 fw-600">100</div>
          </div>
          <div className="w-100 bg-dark-3 rounded-16 py-5 mt-10 mb-10"></div>
          <div className="d-flex justify-between items-center">
            <div className="text-10 lh-14 text-light-1 fw-400">Bronze</div>
            <div className="text-10 lh-14 text-light-1 fw-400">Silver</div>
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            400 more points to reach Silver
          </div>
          <div className="rounded-8 bg-blue-2 px-15 py-10">
            <div className="text-12 lh-14 fw-600">Member Benefits</div>
            <div className="text-12 lh-14 fw-400 mt-5">
              <i className="icon icon-check mr-5 text-blue-1"></i>
              Earn points on every booking
            </div>
            <div className="text-12 lh-14 fw-400 mt-5">
              <i className="icon icon-check mr-5 text-blue-1"></i>
              Exclusive member discounts
            </div>
            <div className="text-12 lh-14 fw-400 mt-5">
              <i className="icon icon-check mr-5 text-blue-1"></i>
              Priority customer support
            </div>
          </div>
        </div>

        <div className="border-light rounded-8 bg-white shadow-3 px-20 py-15 mt-20 mb-20">
          <div className="text-20 lh-14 fw-600 mb-15">How to Earn Points</div>
          <div className="d-flex mb-15">
            <img src="/img/dashboard/icons/bookings.svg" alt="icon" />
            <div className="ml-10">
              <div className="text-14 lh-14 fw-500">Bookings</div>
              <div className="text-12 lh-14 fw-400 text-light-1">
                Earn 10 points for every $1 spent on bookings
              </div>
            </div>
          </div>
          <div className="d-flex mb-15">
            <img src="/img/dashboard/icons/reviews.svg" alt="icon" />
            <div className="ml-10">
              <div className="text-14 lh-14 fw-500">Reviews</div>
              <div className="text-12 lh-14 fw-400 text-light-1">
                Earn 50 points for each review you submit{" "}
              </div>
            </div>
          </div>
          <div className="d-flex mb-15">
            <img src="/img/dashboard/icons/referals.svg" alt="icon" />
            <div className="ml-10">
              <div className="text-14 lh-14 fw-500">Referrals</div>
              <div className="text-12 lh-14 fw-400 text-light-1">
                Earn 250 points for each friend you refer{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8 col-sm-12">
        <div className="row bg-light-2 py-5 rounded-8 mr-0">
          {options.map((item) => (
            <div className="col-6 px-5" key={item.value}>
              <button
                className={`text-14 w-100 fw-500 py-5 rounded-8 ${
                  option === item.value ? "bg-white" : "text-light-1"
                }`}
                onClick={() => setOption(item.value)}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
        {options.map((item) => option === item.value && item.content)}
      </div>
    </div>
  );
};

export default LoyaltySettings;
