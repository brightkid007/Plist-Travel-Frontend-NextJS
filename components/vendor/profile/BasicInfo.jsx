"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, updateCurrentUser } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const BasicInfo = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locationCount, setLocationCount] = useState(1);
  const [formData, setFormData] = useState({
    business_name: "",
    owner_first_name: "",
    owner_last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "USA",
    region: "northeast",
    website_url: "",
    description: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser();
        const userData = response?.data || response || {};
        const profile = userData.profile || {};
        
        setFormData({
          business_name: profile.business_name || user?.business_name || "",
          owner_first_name: profile.owner_first_name || "",
          owner_last_name: profile.owner_last_name || "",
          email: userData.email || user?.email || "",
          phone: profile.phone || user?.phone || "",
          address: profile.address || user?.address || "",
          city: profile.city || "",
          state: profile.state || "",
          zip_code: profile.zip_code || "",
          country: profile.country || "USA",
          region: profile.region || "northeast",
          website_url: profile.website_url || "",
          description: profile.description || "",
        });
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Use user data from context as initial values
      setFormData(prev => ({
        ...prev,
        business_name: user.business_name || prev.business_name,
        owner_first_name: user.owner_first_name || prev.owner_first_name,
        owner_last_name: user.owner_last_name || prev.owner_last_name,
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
      const response = await updateCurrentUser(formData);
      const updatedUser = response?.data || response;
      
      // Update auth context
      if (updatedUser) {
        updateUser({
          business_name: updatedUser.profile?.business_name || updatedUser.business_name,
          owner_first_name: updatedUser.profile?.owner_first_name,
          owner_last_name: updatedUser.profile?.owner_last_name,
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
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600">Basic Infomation</div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Vendor Business Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Business Name"
          value={formData.business_name}
          onChange={(e) => handleChange("business_name", e.target.value)}
        />
      </div>
      <div className="col-md-3 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner First Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter First Name"
          value={formData.owner_first_name}
          onChange={(e) => handleChange("owner_first_name", e.target.value)}
        />
      </div>
      <div className="col-md-3 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner Last Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Last Name"
          value={formData.owner_last_name}
          onChange={(e) => handleChange("owner_last_name", e.target.value)}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Owner Email</h1>
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
      <div className="text-18 fw-500 mt-10">Headquarters Business Address</div>
      <div className="col-12">
        <h1 className="text-13 lh-14 fw-500">Address</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">City</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter City"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">State/Province</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter State/Province"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Zip Code / Postal Code</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Zip Code / Postal Code"
          value={formData.zip_code}
          onChange={(e) => handleChange("zip_code", e.target.value)}
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Country</h1>
        <select 
          className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        >
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
        </select>
      </div>
      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Region</h1>
        <select 
          className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
          value={formData.region}
          onChange={(e) => handleChange("region", e.target.value)}
        >
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
          <div className="row">
            {/* <div
              className="row justify-between items-center mt-10"
              key={index}
            >
              <input
                className="border-light rounded-8 py-5 px-15 w-full"
                type="text"
                placeholder="Enter Address"
              />
              <button
                disabled={locationCount === 1}
                className="ml-10 pt-5 px-5"
                onClick={() => setLocationCount(locationCount - 1)}
              >
                <span className="material-symbols-outlined text-red-2 text-15 fw-500">
                  delete
                </span>
              </button>
            </div> */}
            <div className="col-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">Address</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Address"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">City</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter City"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">State/Province</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter State/Province"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">Zip Code / Postal Code</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Zip Code / Postal Code"
              />
            </div>
            <div className="col-md-6 col-sm-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">Country</h1>
              <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
              </select>
            </div>
            <div className="col-md-6 col-sm-12 mt-15">
              <h1 className="text-13 lh-14 fw-500">Region</h1>
              <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
                <option value="northeast">Northeast</option>
                <option value="southeast">Southeast</option>
                <option value="midwest">Midwest</option>
                <option value="southwest">Southwest</option>
                <option value="west">West</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 mt-10">
        <h1 className="text-13 lh-14 fw-500">Website URL</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="url"
          placeholder="https://"
          value={formData.website_url}
          onChange={(e) => handleChange("website_url", e.target.value)}
        />
      </div>
      <div className="col-12 mt-10">
        <h1 className="text-13 lh-14 fw-500">Business Description</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          rows={4}
          placeholder="Enter business description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
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
        <button 
          className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default BasicInfo;
