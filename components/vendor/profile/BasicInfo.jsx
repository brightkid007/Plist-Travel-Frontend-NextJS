"use client";

import { useState, useEffect, useRef } from "react";
import { getCurrentUser, updateCurrentUser, getUserAddresses, createAddress, updateAddress, deleteAddress } from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const BasicInfo = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddresses, setEditingAddresses] = useState({});
  const [originalAddresses, setOriginalAddresses] = useState([]);
  const [deletedAddressIds, setDeletedAddressIds] = useState([]);
  const [headquartersAddressId, setHeadquartersAddressId] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const autocompleteRefs = useRef({});
  const [vendorTypes, setVendorTypes] = useState({
    hotel: false,
    vacation_rental: false,
    spaces: false,
    tours: false,
    event_activity: false,
  });

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
        country: profile.country || "",
        region: profile.region || "",
        website_url: profile.website_url || "",
        description: profile.description || "",
      });

      // Set headquarters address ID if it exists in profile
      if (profile.headquarters_address_id) {
        setHeadquartersAddressId(profile.headquarters_address_id);
      }

      // Load vendor types from profile
      if (profile.vendor_types) {
        const types = Array.isArray(profile.vendor_types) ? profile.vendor_types : [];
        setVendorTypes({
          hotel: types.includes("hotel"),
          vacation_rental: types.includes("vacation_rental"),
          spaces: types.includes("spaces"),
          tours: types.includes("tours"),
          event_activity: types.includes("event_activity"),
        });
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      if (!user?.id) return;
      const res = await getUserAddresses(user.id);
      const addrList = res?.data || res || [];
      const addressesArray = Array.isArray(addrList) ? addrList : [];
      setAddresses(addressesArray);
      setOriginalAddresses(addressesArray.map(addr => ({ ...addr }))); // Deep copy for comparison

      // Initialize editing state for each address
      const editingState = {};
      addressesArray.forEach(addr => {
        editingState[addr.id] = {
          street: addr.line1 || addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zip_code: addr.postal_code || addr.zip_code || "",
          country: addr.country || "",
          region: addr.region || "",
        };
      });
      setEditingAddresses(editingState);
      setDeletedAddressIds([]); // Reset deleted addresses on load

    } catch (e) {
      toast.error(e?.message || "Failed to load addresses");
    }
  };

  // Use shared Google Maps hook
  const { googleLoaded: googleMapsLoaded, error: googleMapsError } = useGoogleMaps();
  
  useEffect(() => {
    setGoogleLoaded(googleMapsLoaded);
    if (googleMapsError) {
      console.warn('Google Maps API error:', googleMapsError);
    }
  }, [googleMapsLoaded, googleMapsError]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        business_name: user.business_name || prev.business_name,
        owner_first_name: user.owner_first_name || prev.owner_first_name,
        owner_last_name: user.owner_last_name || prev.owner_last_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
      loadProfile();
      loadAddresses();
    }
  }, [user]);

  // Sync headquarters address data when both addresses and headquartersAddressId are available
  useEffect(() => {
    if (headquartersAddressId && addresses.length > 0 && editingAddresses[headquartersAddressId]) {
      const hqData = editingAddresses[headquartersAddressId];
      setFormData(prev => ({
        ...prev,
        address: [hqData.street, hqData.city, hqData.state, hqData.zip_code, hqData.country]
          .filter(Boolean)
          .join(", "),
        city: hqData.city || prev.city,
        state: hqData.state || prev.state,
        zip_code: hqData.zip_code || prev.zip_code,
        country: hqData.country || prev.country,
        region: hqData.region || prev.region,
      }));
    }
  }, [headquartersAddressId, addresses, editingAddresses]);

  useEffect(() => {
    if (googleLoaded && window.google && addresses.length > 0) {
      const timer = setTimeout(() => {
        addresses.forEach((address) => {
          const addressId = address.id;
          const inputId = `autocomplete-${addressId}`;
          const inputElement = document.getElementById(inputId);

          if (inputElement && !autocompleteRefs.current[addressId]) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
              types: ['address'],
              fields: ['address_components', 'formatted_address']
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.address_components) {
                const addressComponents = place.address_components;
                let streetNumber = '';
                let route = '';
                let city = '';
                let state = '';
                let zipCode = '';
                let country = '';

                addressComponents.forEach((component) => {
                  const types = component.types;
                  if (types.includes('street_number')) {
                    streetNumber = component.long_name;
                  }
                  if (types.includes('route')) {
                    route = component.long_name;
                  }
                  if (types.includes('locality') || types.includes('administrative_area_level_2')) {
                    city = component.long_name;
                  }
                  if (types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                  }
                  if (types.includes('postal_code')) {
                    zipCode = component.long_name;
                  }
                  if (types.includes('country')) {
                    country = component.long_name;
                  }
                });

                const fullStreet = [streetNumber, route].filter(Boolean).join(' ');

                setEditingAddresses(prev => {
                  const updated = { ...prev };
                  if (!updated[addressId]) {
                    updated[addressId] = {};
                  }
                  updated[addressId] = {
                    ...updated[addressId],
                    street: fullStreet || place.formatted_address,
                    city: city || updated[addressId].city || '',
                    state: state || updated[addressId].state || '',
                    zip_code: zipCode || updated[addressId].zip_code || '',
                    country: country || updated[addressId].country || '',
                  };
                  return updated;
                });
              }
            });

            autocompleteRefs.current[addressId] = autocomplete;
          }
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        // Cleanup removed addresses
        Object.keys(autocompleteRefs.current).forEach((key) => {
          if (addresses.findIndex(a => a.id.toString() === key) === -1) {
            delete autocompleteRefs.current[key];
          }
        });
      };
    }
  }, [googleLoaded, addresses]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (addressId, field, value) => {
    setEditingAddresses(prev => ({
      ...prev,
      [addressId]: {
        ...prev[addressId],
        [field]: value
      }
    }));
  };

  const handleDeleteAddress = (addressId) => {
    const isNew = addressId.toString().startsWith("new-");

    if (!isNew) {
      // Mark existing address for deletion
      setDeletedAddressIds(prev => [...prev, addressId]);
    }

    // Remove from local state
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));

    // Remove from editing state
    setEditingAddresses(prev => {
      const newState = { ...prev };
      delete newState[addressId];
      return newState;
    });

    // If deleted address was HQ, clear HQ selection
    if (headquartersAddressId === addressId) {
      setHeadquartersAddressId(null);
      setFormData(prev => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        zip_code: "",
        region: "",
      }));
    }
  };

  const handleAddAddress = () => {
    const newAddressId = `new-${Date.now()}`;
    const newAddress = {
      id: newAddressId,
      street: "",
      city: "",
      state: "",
      zip_code: "",
    };

    setAddresses(prev => [...prev, newAddress]);
    setEditingAddresses(prev => ({
      ...prev,
      [newAddressId]: {
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        region: "",
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // Validate all addresses before saving
      const newAddresses = addresses.filter(addr => addr.id.toString().startsWith("new-"));
      const existingAddresses = addresses.filter(addr => !addr.id.toString().startsWith("new-"));

      // Validate new addresses
      for (const addr of newAddresses) {
        const addressData = editingAddresses[addr.id];
        if (!addressData || !addressData.street || !addressData.city) {
          toast.error("All addresses must have Street and City filled in");
          return;
        }
      }

      // Validate existing addresses
      for (const addr of existingAddresses) {
        const addressData = editingAddresses[addr.id];
        if (!addressData || !addressData.street || !addressData.city) {
          toast.error("All addresses must have Street and City filled in");
          return;
        }
      }

      // Store HQ address data before saving (in case it's a new address)
      const hqAddressData = headquartersAddressId ? editingAddresses[headquartersAddressId] : null;
      const hqIsNew = headquartersAddressId && headquartersAddressId.toString().startsWith("new-");
      const hqTempId = hqIsNew ? headquartersAddressId : null;

      // Save addresses: delete, create, update
      const addressPromises = [];
      const tempIdToIndexMap = new Map();

      // Delete addresses
      for (const addressId of deletedAddressIds) {
        addressPromises.push(deleteAddress(addressId));
      }

      // Create new addresses
      // Map frontend fields (street, zip_code) to backend fields (line1, postal_code)
      for (const addr of newAddresses) {
        const addressData = editingAddresses[addr.id];
        // Ensure we never send id field - let database auto-generate it
        const payload = {
          line1: addressData.street || "",
          city: addressData.city || "",
          state: addressData.state || "",
          postal_code: addressData.zip_code || "",
          country: addressData.country || "",
          region: addressData.region || "",
        };
        // Explicitly remove id if it exists
        delete payload.id;
        addressPromises.push(createAddress(payload));
        tempIdToIndexMap.set(addr.id, addressPromises.length - 1);
      }

      // Update existing addresses (check if changed)
      for (const addr of existingAddresses) {
        const addressData = editingAddresses[addr.id];
        const original = originalAddresses.find(a => a.id === addr.id);

        const originalStreet = original.line1 || original.street || "";
        const originalZipCode = original.postal_code || original.zip_code || "";
        const originalRegion = original.region || "";
        const isModified = !original ||
          originalStreet !== addressData.street ||
          original.city !== addressData.city ||
          original.state !== (addressData.state || "") ||
          originalZipCode !== (addressData.zip_code || "") ||
          original.country !== (addressData.country || "") ||
          originalRegion !== (addressData.region || "");

        if (isModified) {
          // Map frontend fields (street, zip_code) to backend fields (line1, postal_code)
          const payload = {
            line1: addressData.street || "",
            city: addressData.city || "",
            state: addressData.state || "",
            postal_code: addressData.zip_code || "",
            country: addressData.country || "",
            region: addressData.region || "",
          };
          addressPromises.push(updateAddress(addr.id, payload));
        }
      }

      // Execute all address operations
      const addressResults = await Promise.all(addressPromises);

      // If HQ was a new address, get the created address ID
      let finalHqId = headquartersAddressId;
      if (hqIsNew && hqTempId && tempIdToIndexMap.has(hqTempId)) {
        const resultIndex = tempIdToIndexMap.get(hqTempId);
        const createResult = addressResults[resultIndex];
        const newAddress = createResult?.data || createResult;
        if (newAddress?.id) {
          finalHqId = newAddress.id;
        }
      }

      // Reload addresses to get updated IDs and refresh state
      await loadAddresses();

      // Update HQ selection if it was a new address
      if (hqIsNew && finalHqId && finalHqId !== headquartersAddressId) {
        setHeadquartersAddressId(finalHqId);
      }

      // Update profile
      let payload = { ...formData };
      if (finalHqId && hqAddressData) {
        payload = {
          ...payload,
          address: [hqAddressData.street, hqAddressData.city, hqAddressData.state, hqAddressData.zip_code, hqAddressData.country]
            .filter(Boolean)
            .join(", "),
          city: hqAddressData.city || "",
          state: hqAddressData.state || "",
          zip_code: hqAddressData.zip_code || "",
          country: hqAddressData.country || payload.country,
          headquarters_address_id: finalHqId,
        };
      } else if (finalHqId) {
        payload.headquarters_address_id = finalHqId;
      } else {
        payload.headquarters_address_id = null;
      }

      // Add vendor types to payload
      const selectedVendorTypes = [];
      if (vendorTypes.hotel) selectedVendorTypes.push("hotel");
      if (vendorTypes.vacation_rental) selectedVendorTypes.push("vacation_rental");
      if (vendorTypes.spaces) selectedVendorTypes.push("spaces");
      if (vendorTypes.tours) selectedVendorTypes.push("tours");
      if (vendorTypes.event_activity) selectedVendorTypes.push("event_activity");
      payload.vendor_types = selectedVendorTypes;

      const response = await updateCurrentUser(payload);
      const updatedUser = response?.data || response;

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

      toast.success("Profile and addresses updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile and addresses");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600">Basic Infomation</div>
      {loading ? (
        <div className="col-12 mt-5 d-flex items-center gap-10">
          <CircularProgress size={20} thickness={5} />
          <div className="text-16 text-light-1">Loading profile...</div>
        </div>
      ) : (
        <>
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
            <select
              className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
              value={headquartersAddressId || ""}
              onChange={(e) => {
                const id = e.target.value ? (e.target.value.toString().startsWith("new-") ? e.target.value : parseInt(e.target.value, 10)) : null;
                setHeadquartersAddressId(id);
                if (id && addresses.length > 0) {
                  const selectedData = editingAddresses[id];
                  if (selectedData) {
                    setFormData((prev) => ({
                      ...prev,
                      address: [selectedData.street, selectedData.city, selectedData.state, selectedData.zip_code, selectedData.country]
                        .filter(Boolean)
                        .join(", "),
                      city: selectedData.city || "",
                      state: selectedData.state || "",
                      zip_code: selectedData.zip_code || "",
                      country: selectedData.country || prev.country,
                      region: selectedData.region || prev.region,
                    }));
                  }
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    region: "",
                  }));
                }
              }}
            >
              <option value="">-- Select Headquarters Address --</option>
              {addresses.map((a) => {
                const addrData = editingAddresses[a.id] || {};
                const label = [addrData.street, addrData.city, addrData.state, addrData.zip_code, addrData.country].filter(Boolean).join(", ");
                return (
                  <option key={a.id} value={a.id}>
                    {label || `Address #${a.id}`}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">City</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter City"
              value={formData.city}
              readOnly
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">State/Province</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter State/Province"
              value={formData.state}
              readOnly
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Zip Code / Postal Code</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter Zip Code / Postal Code"
              value={formData.zip_code}
              readOnly
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Country</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter Country"
              value={formData.country}
              readOnly
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Region</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter Region"
              value={formData.region}
              readOnly
            />
          </div>
          <div className="col-12">
            <div className="row justify-between items-center">
              <div className="text-18 fw-500 mt-10 col-auto">
                Location Addresses
              </div>
              <div className="d-flex col-sm-auto pr-50">
                <button
                  className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
                  onClick={handleAddAddress}
                  type="button"
                >
                  <span className="material-symbols-outlined mr-10 text-15 fw-500">
                    add_circle
                  </span>
                  Add Address
                </button>
              </div>
            </div>
            {addresses.map((address) => {
              const isNew = address.id.toString().startsWith("new-");
              const addressData = editingAddresses[address.id] || {};

              return (
                <div key={address.id} className="row border-top-light pt-15 mt-15">
                  <div className="col-12">
                    <h1 className="text-13 lh-14 fw-500">Street Address</h1>
                    <input
                      id={`autocomplete-${address.id}`}
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter Street Address"
                      value={addressData.street || ""}
                      onChange={(e) => handleAddressChange(address.id, "street", e.target.value)}
                      disabled={saving}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-15">
                    <h1 className="text-13 lh-14 fw-500">City</h1>
                    <input
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter City"
                      value={addressData.city || ""}
                      onChange={(e) => handleAddressChange(address.id, "city", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-15">
                    <h1 className="text-13 lh-14 fw-500">State/Province</h1>
                    <input
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter State/Province"
                      value={addressData.state || ""}
                      onChange={(e) => handleAddressChange(address.id, "state", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-15">
                    <h1 className="text-13 lh-14 fw-500">Zip Code / Postal Code</h1>
                    <input
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter Zip Code / Postal Code"
                      value={addressData.zip_code || ""}
                      onChange={(e) => handleAddressChange(address.id, "zip_code", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-15">
                    <h1 className="text-13 lh-14 fw-500">Country</h1>
                    <input
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter Country"
                      value={addressData.country || ""}
                      onChange={(e) => handleAddressChange(address.id, "country", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-15">
                    <h1 className="text-13 lh-14 fw-500">Region</h1>
                    <input
                      className="border-light rounded-8 py-5 px-15 w-full mt-5"
                      type="text"
                      placeholder="Enter Region"
                      value={addressData.region || ""}
                      onChange={(e) => handleAddressChange(address.id, "region", e.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <div className="col-12 mt-15 d-flex gap-10">
                    <button
                      className="button border-light text-red-1 rounded-8 text-12 py-8 px-15"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={saving}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            {addresses.length === 0 && (
              <div className="text-center text-light-1 py-20">
                <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '10px', opacity: 0.5 }}>
                  location_on
                </span>
                No location addresses. Click "Add Address" to create one.
              </div>
            )}
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
              <input
                type="checkbox"
                checked={vendorTypes.hotel}
                onChange={(e) => setVendorTypes(prev => ({ ...prev, hotel: e.target.checked }))}
                disabled={saving}
              />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-12 ml-10">Hotel</div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 py-0">
            <div className="form-checkbox d-flex items-center">
              <input
                type="checkbox"
                checked={vendorTypes.vacation_rental}
                onChange={(e) => setVendorTypes(prev => ({ ...prev, vacation_rental: e.target.checked }))}
                disabled={saving}
              />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-12 ml-10">Vacation Rental Owners</div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 py-0">
            <div className="form-checkbox d-flex items-center">
              <input
                type="checkbox"
                checked={vendorTypes.spaces}
                onChange={(e) => setVendorTypes(prev => ({ ...prev, spaces: e.target.checked }))}
                disabled={saving}
              />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-12 ml-10">Spaces Owners</div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 py-0">
            <div className="form-checkbox d-flex items-center">
              <input
                type="checkbox"
                checked={vendorTypes.tours}
                onChange={(e) => setVendorTypes(prev => ({ ...prev, tours: e.target.checked }))}
                disabled={saving}
              />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-12 ml-10">Tours Operators</div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12 py-0">
            <div className="form-checkbox d-flex items-center">
              <input
                type="checkbox"
                checked={vendorTypes.event_activity}
                onChange={(e) => setVendorTypes(prev => ({ ...prev, event_activity: e.target.checked }))}
                disabled={saving}
              />
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
        </>
      )}
    </div>
  );
};

export default BasicInfo;
