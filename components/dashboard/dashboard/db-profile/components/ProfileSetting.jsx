"use client";

import { useState, useEffect } from "react";
import AvatarUploader from "@/components/dashboard/dashboard/db-settings/components/AvatarUploader";
import SavedItems from "@/components/dashboard/dashboard/db-profile/components/SavedItems";
import ProfileDetail from "@/components/dashboard/dashboard/db-profile/components/ProfileDetail";
import SavedBookingCard from "./SavedBookingCard";
import { getCurrentUser } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    memberSince: null,
    savedHotels: 0,
    completedBookings: 0,
    countriesVisited: 0,
    loyaltyPoints: 0,
  });

  const loadUserStats = async () => {
    try {
      const response = await getCurrentUser();
      const userData = response?.data || response || {};
      
      // Format member since date
      let memberSince = "N/A";
      if (userData.createdAt) {
        const date = new Date(userData.createdAt);
        memberSince = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else if (user?.createdAt) {
        const date = new Date(user.createdAt);
        memberSince = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      setUserStats({
        memberSince,
        savedHotels: userData.saved_hotels_count || 0,
        completedBookings: userData.completed_bookings_count || 0,
        countriesVisited: userData.countries_visited_count || 0,
        loyaltyPoints: userData.loyalty_points || userData.profile?.loyalty_points || 0,
      });
    } catch (error) {
      // Silently fail - use default values
      console.error("Failed to load user stats:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

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
            👤 Member since {userStats.memberSince}
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            🤍 {userStats.savedHotels} saved {userStats.savedHotels === 1 ? 'hotel' : 'hotels'}
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            ⏳ {userStats.completedBookings} completed {userStats.completedBookings === 1 ? 'booking' : 'bookings'}
          </div>
          <div className="text-12 lh-14 mt-10 mb-10 fw-400">
            📝 {userStats.countriesVisited} {userStats.countriesVisited === 1 ? 'country' : 'countries'} visited
          </div>
          <button className="button rounded-16 py-10 px-30 text-12 -dark-1 bg-blue-1 text-white">
            {userStats.loyaltyPoints} Loyalty Points
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
