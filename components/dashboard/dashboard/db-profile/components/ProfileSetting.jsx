"use client";

import { useState } from "react";
import AvatarUploader from "@/components/dashboard/dashboard/db-settings/components/AvatarUploader";
import SavedItems from "@/components/dashboard/dashboard/db-profile/components/SavedItems";
import ProfileDetail from "@/components/dashboard/dashboard/db-profile/components/ProfileDetail";

const ProfileSettings = () => {
    const options = [
        { label: "Profile Details", value: "profileDetails", content: <ProfileDetail /> },
        {
            label: "Saved Items", value: "savedItems", content: <SavedItems />,
        },
    ];
    const [option, setOption] = useState("profileDetails");
    return (
        <div className="overflow-scroll scroll-bar-1 pt-30">

    
            <div className="row px-10 mt-30">
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
                                    className={`text-14 w-100 fw-500 py-5 rounded-8 ${option === item.value ? "bg-white" : "text-light-1"
                                        }`}
                                    onClick={() => setOption(item.value)}
                                >
                                    {item.label}
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-10"> */}
                    {options.map((item) => option === item.value && item.content)}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;