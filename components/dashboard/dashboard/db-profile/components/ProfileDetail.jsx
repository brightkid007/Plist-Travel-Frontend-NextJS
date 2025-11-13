"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, updateCurrentUser } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const ProfileDetail = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

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
        address: profile.address || user?.address || "",
      });
    } catch (error) {
      toast.error(error?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      // Use user data from context as initial values
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || prev.first_name,
        last_name: user.last_name || prev.last_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
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
      const response = await updateCurrentUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
      });
      const updatedUser = response?.data || response;
      
      // Update auth context
      if (updatedUser) {
        updateUser({
          first_name: updatedUser.profile?.first_name || updatedUser.first_name,
          last_name: updatedUser.profile?.last_name || updatedUser.last_name,
          email: updatedUser.email,
          phone: updatedUser.profile?.phone || updatedUser.phone,
          address: updatedUser.profile?.address || updatedUser.address,
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
      <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-15">
        <div className="text-20 lh-14 fw-600 px-0">Profile Information</div>
        <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
          Update your personal information and contact details
        </div>
        <div className="col-12 mb-20">
          <form onSubmit={handleSubmit}>
            <div className="row mb-20 y-gap-10">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">First Name</h1>
                <input
                  className="border-light rounded-8 py-5 px-20 w-full mt-10"
                  type="text"
                  placeholder="Enter First Name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">Last Name</h1>
                <input
                  className="border-light rounded-8 py-5 px-20 w-full mt-10"
                  type="text"
                  placeholder="Enter Last Name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-20 y-gap-10">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">Email</h1>
                <input
                  className="border-light rounded-8 py-5 px-20 w-full mt-10"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h1 className="text-15 lh-14 fw-500">Phone Number</h1>
                <input
                  className="border-light rounded-8 py-5 px-20 w-full mt-10"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-20 y-gap-10">
              <div className="col-12">
                <h1 className="text-15 lh-14 fw-500">Address</h1>
                <input
                  className="border-light rounded-8 py-5 px-20 w-full mt-10"
                  type="text"
                  placeholder="123 Main St, New York, NY 10001"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 d-flex justify-end">
              <button 
                type="submit"
                className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;
