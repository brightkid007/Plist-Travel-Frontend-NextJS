"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header1 from "@/components/header/header-1";
import AvatarUploader from "@/components/dashboard/dashboard/db-settings/components/AvatarUploader";

const ProfilePage = () => {
    const options = [
        { label: "Profile Details", value: "profileDetails", content: <ProfileDetail /> },
        {
            label: "Saved Items", value: "savedItems", content: <SavedItems />,
        },
    ];
    const [option, setOption] = useState("profileDetails");
    return (
        <>
            <Header1 />
            <div className="py-40"></div>
            {/* <div className="container"> */}
            <div className="dashboard__content bg-light-2">
                <div className="text-30 lh-14 fw-600 mt-30">My Profile</div>
                <div className="row px-10 mt-30">
                    <div className="col-md-4 col-sm-12">
                        <div className="border-light rounded-8 bg-white shadow-3 px-20 py-20">

                            <div className="row justify-center items-center">
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
        </>
    );
};

const ProfileDetail = () => {

    return (
        <>
            <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-10">
                <div className="text-20 lh-14 fw-600 px-0">Profile Information</div>
                <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
                    Update your personal information and contact details
                </div>
                <div className="col-12 mb-20">
                    <div className="row mb-20 y-gap-10">
                        <div className="col-6">
                            <h1 className="text-15 lh-14 fw-500">Name</h1>
                            <input
                                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                                type="text"
                                placeholder="asf"
                            />
                        </div>
                        <div className="col-6">
                            <h1 className="text-15 lh-14 fw-500">Email</h1>
                            <input
                                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                                type="text"
                                placeholder="asdfasdf@asdfasdf.com"
                            />
                        </div>

                    </div>
                    <div className="col-12 mb-20">
                        <h1 className="text-15 lh-14 fw-500">Bio</h1>
                        <input
                            className="border-light rounded-8 py-5 px-20 w-full mt-10"
                            type="text"
                            placeholder="Travel enthusiast and foodie. Love exploring new places and cultures."
                        />
                    </div>

                    <div className="row mb-20 y-gap-10">
                        <div className="col-6">
                            <h1 className="text-15 lh-14 fw-500">Phone Number</h1>
                            <input
                                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                                type="text"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div className="col-6">
                            <h1 className="text-15 lh-14 fw-500">Address</h1>
                            <input
                                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                                type="text"
                                placeholder="123 Main St, New York, NY 10001"
                            />
                        </div>

                    </div>
                </div>
            </div>

            <div className="col-lg-12 col-md-6 col-sm-6 row mr-10">
                <div className="row">
                    <div className="col-4 px-0">
                        <img
                            src="/img/destinations/1/1.png"
                            alt=""
                            className="rounded-start object-cover"
                        />
                    </div>
                    <div className="col-8 bg-blue-2 px-15 py-10 rounded-end">
                        <div className="text-14 lh-16 fw-600 mt-5">Hotel Discount</div>
                        <div className="text-12 lh-16 text-light-1 fw-400 mt-5">
                            Get $50 off your next hotel booking
                        </div>
                        {/* <div className="text-12 lh-16 text-blue-1 fw-500 mt-10 mb-10">
                            500 points
                        </div> */}
                        <div className="d-flex justify-between mt-24">
                            <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-blue-1 fw-400 mt-5">
                                View
                            </button>
                            <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-light-1 fw-400 mt-5">
                                X
                            </button>
                        </div>
                    </div>

                </div>

                <div className="row">
                    <div className="col-4 px-0">
                        <img
                            src="/img/destinations/1/1.png"
                            alt=""
                            className="rounded-start object-cover max-h-24"
                        />
                    </div>
                    <div className="col-8 bg-blue-2 px-15 py-10 rounded-end">
                        <div className="text-14 lh-16 fw-600 mt-5">Hotel Discount</div>
                        <div className="text-12 lh-16 text-light-1 fw-400 mt-5">
                            Get $50 off your next hotel booking
                        </div>
                        {/* <div className="text-12 lh-16 text-blue-1 fw-500 mt-10 mb-10">
                            500 points
                        </div> */}
                        <div className="d-flex justify-between mt-24">
                            <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-blue-1 fw-400 mt-5">
                                View
                            </button>
                            <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-light-1 fw-400 mt-5">
                                X
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

const SavedItems = () => {
    return (
        <>
            <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-10">
                <div className="text-20 lh-14 fw-600 px-0">Saved Searchs</div>
                <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
                    Your recent saved search queries
                </div>
                <div className="col-12 mb-20">
                    <SearchItem />
                    <SearchItem />
                </div>
            </div>

            <div className="row">
                <div className="col-4 px-0">
                    <img
                        src="/img/destinations/1/1.png"
                        alt=""
                        className="rounded-start object-cover max-h-24"
                    />
                </div>
                <div className="col-8 bg-blue-2 px-15 py-10 rounded-end">
                    <div className="text-14 lh-16 fw-600 mt-5">Hotel Discount</div>
                    <div className="text-12 lh-16 text-light-1 fw-400 mt-5">
                        Get $50 off your next hotel booking
                    </div>
                    {/* <div className="text-12 lh-16 text-blue-1 fw-500 mt-10 mb-10">
                            500 points
                        </div> */}
                    <div className="d-flex justify-between mt-24">
                        <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-blue-1 fw-400 mt-5">
                            View
                        </button>
                        <button className="text-12 lh-16 rounded-4 py-5 px-10 text-white bg-light-1 fw-400 mt-5">
                            X
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

const SearchItem = () => {
    return (
        <div className="col-12 row bg-gray-700 p-2 rounded-md border-light rounded-8">
            <div className="col-8 flex">
                <p className="text-14 text-black">Hotels in Paris</p>
                <p className="text-12 text-gray-500">Saved on 2023-05-15</p>
            </div>

            <div className="col-4 justify-between">
                <button className="text-14 text-black">
                    Search Again
                </button>
                <button className="text-14 text-black">
                    X
                </button>
            </div>
        </div>
    )
}

export default dynamic(() => Promise.resolve(ProfilePage), {
    ssr: false,
});
