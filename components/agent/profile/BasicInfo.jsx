"use client";

import { Switch } from "@mui/material";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, updateCurrentUser } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const BasicInfo = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        const userData = response?.data || response || {};
        const profile = userData.profile || {};
        
        setFormData({
          first_name: profile.first_name || user?.first_name || "",
          last_name: profile.last_name || user?.last_name || "",
          email: userData.email || user?.email || "",
          phone: profile.phone || user?.phone || "",
        });
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Use user data from context as initial values
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      // Then load full profile
      loadProfile();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateCurrentUser(formData);
      const updatedUser = response?.data || response;
      
      // Update auth context
      if (updatedUser) {
        updateUser({
          first_name: updatedUser.profile?.first_name || updatedUser.first_name,
          last_name: updatedUser.profile?.last_name || updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.profile?.phone || updatedUser.phone,
        });
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-center items-center" style={{ minHeight: "200px" }}>
        <div className="text-16 text-light-1">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <div className="row y-gap-10 bg-white px-10 py-15 rounded-8">
        <div className="col-12">
          <div className="text-20 fw-600 lh-14">Basic Infomation</div>
          <div className="text-14 text-light-1 lh-1">
            Manage your personal information
          </div>
        </div>
        <div className="col-md-2 col-sm-12 d-flex flex-column justify-center items-center">
          <User size={50} />
          <button className="button border-light text-14 rounded-8 text-12 py-10 px-15 mt-10">
            Change Photo
          </button>
        </div>
        <div className="col-md-10 col-sm-12">
          <div className="row y-gap-10 x-gap-10 items-center">
            <div className="col-md-6 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">First Name</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter First Name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Last Name</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Last Name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Email Address</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Phone Number</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="tel"
                placeholder="+1 (123) 456 7890"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex mt-10">
          <button 
            className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="row y-gap-10 bg-white px-10 py-15 rounded-8 mt-20">
        <div className="col-12">
          <div className="text-20 fw-600 lh-14">Account Settings</div>
          <div className="text-14 text-light-1 lh-1">
            Manage your account preferences
          </div>
        </div>
        <div className="col-12 mt-10 d-flex items-center justify-between">
          <div>
            <div className="text-12 fw-600 lh-14">Email Notifications</div>
            <div className="text-12 text-light-1 lh-1">
              Receive email notifications for bookings and updates
            </div>
          </div>
          <Switch size="small" />
        </div>
        <div className="col-12 mt-10 d-flex items-center justify-between">
          <div>
            <div className="text-12 fw-600 lh-14">SMS Notifications</div>
            <div className="text-12 text-light-1 lh-1">
              Receive SMS alerts for important updates
            </div>
          </div>
          <Switch size="small" />
        </div>
        <div className="col-12 mt-10 d-flex items-center justify-between">
          <div>
            <div className="text-12 fw-600 lh-14">
              Two-Factor Authentication
            </div>
            <div className="text-12 text-light-1 lh-1">
              Add an extra layer of security to your account
            </div>
          </div>
          <Switch size="small" />
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
