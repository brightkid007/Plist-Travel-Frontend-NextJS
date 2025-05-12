"use client";

import { useState } from "react";
import AvatarUploader from "@/components/dashboard/dashboard/db-settings/components/AvatarUploader";
import SavedItems from "@/components/dashboard/dashboard/db-profile/components/SavedItems";
import ProfileDetail from "@/components/dashboard/dashboard/db-profile/components/ProfileDetail";
import SavedBookingCard from "./SavedBookingCard";

const ProfileSettings = () => {
  const options = [
    {
      label: "Profile Details",
      value: "profileDetails",
      content: <ProfileDetail />,
    },
    {
      label: "Saved Items",
      value: "savedItems",
      content: <SavedItems />,
    },
  ];
  const [option, setOption] = useState("profileDetails");
  return (
    <div className="row px-10">
      <div className="col-md-4 col-sm-12">
        <div className="border-light rounded-8 bg-white shadow-3 px-20 py-20 d-flex flex-column justify-content-center align-items-center">
          <div>
            <AvatarUploader />
          </div>

          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            👤 Member since April 2023
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            🤍 2 saved hotels
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            ⏳ 5 completed bookings
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            📝 3 countries visited
          </div>
          <button className="button rounded-16 py-10 px-30 text-12 -dark-1 bg-blue-1 text-white">
            100 Loyalty Points
          </button>
        </div>
      </div>
      <div className="col-md-8">
        <div className="row bg-light-2 py-5 rounded-8">
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
        <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-15">
          <div className="col-12 text-20 lh-14 fw-600 px-0">Saved Hotels</div>
          <div className="col-12 text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
            Update your personal information and contact details
          </div>
          <div className="col-12 px-15">
            <div className="row x-gap-40 y-gap-10">
              <SavedBookingCard
                name={"The Montcalm At Brewery London"}
                location={"London, UK"}
                image={"/img/destinations/1/1.png"}
              />
              <SavedBookingCard
                name={"Staycity Aparthotels"}
                location={"Barcelona, Spain"}
                image={"/img/destinations/1/1.png"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
