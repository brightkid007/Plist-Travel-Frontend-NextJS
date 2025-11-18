"use client";

import { Checkbox, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAddOnService, updateAddOnService, getAddOnServiceById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import Calendar from "../../roomtype/AddRoomType/Calendar";

const Services = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addOnServiceId = searchParams.get("id");
  const isEditMode = !!addOnServiceId;

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    base_price: "",
    description: "",
    requires_scheduling: false,
    hours_available: "",
    availability_per_timeframe: "",
    // Calendar fields
    calendar_type: 1,
    calendar_start_date: null,
    calendar_end_date: null,
    blocked_dates: [],
    available_dates: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const hours = Array.from({ length: 48 }, (_, i) => (i + 1) * 0.5);

  useEffect(() => {
    if (addOnServiceId) {
      loadAddOnServiceData();
    }
  }, [addOnServiceId]);

  const loadAddOnServiceData = async () => {
    try {
      setLoading(true);
      const response = await getAddOnServiceById(addOnServiceId);
      const serviceData = response?.data || response;

      if (serviceData) {
        // Format dates properly - convert Date objects to YYYY-MM-DD strings
        const formatDate = (date) => {
          if (!date) return null;
          if (typeof date === 'string') return date.split('T')[0]; // Extract date part from ISO string
          if (date instanceof Date) return date.toISOString().split('T')[0];
          return date;
        };

        setFormData({
          name: serviceData.name || "",
          type: serviceData.type || "",
          base_price: serviceData.base_price ? parseFloat(serviceData.base_price).toString() : "",
          description: serviceData.name || "", // Use name as description for now
          requires_scheduling: serviceData.requires_scheduling || false,
          hours_available: serviceData.hours_available ? parseFloat(serviceData.hours_available).toString() : "",
          availability_per_timeframe: serviceData.availability_per_timeframe ? parseInt(serviceData.availability_per_timeframe, 10).toString() : "",
          // Calendar fields - ensure dates are formatted as YYYY-MM-DD strings
          calendar_type: serviceData.calendar_type || 1,
          calendar_start_date: formatDate(serviceData.calendar_start_date),
          calendar_end_date: formatDate(serviceData.calendar_end_date),
          blocked_dates: serviceData.blocked_dates && Array.isArray(serviceData.blocked_dates) ? serviceData.blocked_dates : [],
          available_dates: serviceData.available_dates && Array.isArray(serviceData.available_dates) ? serviceData.available_dates : [],
        });
      }
    } catch (error) {
      console.error("Error loading add-on service:", error);
      toast.error(error?.message || "Failed to load add-on service");
      router.push("/vendor/addon");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    if (!formData.base_price || parseFloat(formData.base_price) <= 0) {
      toast.error("Please enter a valid base price");
      return;
    }

    try {
      setSaving(true);

      // Prepare data for backend (only fields in model)
      const payload = {
        name: formData.name.trim(),
        type: formData.type?.trim() || null,
        base_price: parseFloat(formData.base_price),
        requires_scheduling: formData.requires_scheduling || false,
        // Scheduling fields
        hours_available: formData.hours_available && formData.hours_available !== ""
          ? parseFloat(formData.hours_available)
          : null,
        availability_per_timeframe: formData.availability_per_timeframe && formData.availability_per_timeframe !== ""
          ? parseInt(formData.availability_per_timeframe, 10)
          : null,
        // Calendar fields - ensure proper date formatting
        calendar_type: formData.calendar_type || 1,
        calendar_start_date: formData.calendar_start_date 
          ? (typeof formData.calendar_start_date === 'string' 
              ? formData.calendar_start_date 
              : formData.calendar_start_date instanceof DateObject
              ? formData.calendar_start_date.format("YYYY-MM-DD")
              : new Date(formData.calendar_start_date).toISOString().split('T')[0])
          : null,
        calendar_end_date: formData.calendar_end_date 
          ? (typeof formData.calendar_end_date === 'string' 
              ? formData.calendar_end_date 
              : formData.calendar_end_date instanceof DateObject
              ? formData.calendar_end_date.format("YYYY-MM-DD")
              : new Date(formData.calendar_end_date).toISOString().split('T')[0])
          : null,
        blocked_dates: formData.blocked_dates && Array.isArray(formData.blocked_dates) && formData.blocked_dates.length > 0
          ? formData.blocked_dates
          : null,
        available_dates: formData.available_dates && Array.isArray(formData.available_dates) && formData.available_dates.length > 0
          ? formData.available_dates
          : null,
      };

      console.log("Saving calendar data:", {
        calendar_type: payload.calendar_type,
        calendar_start_date: payload.calendar_start_date,
        calendar_end_date: payload.calendar_end_date,
        blocked_dates: payload.blocked_dates,
        available_dates: payload.available_dates,
      });

      if (isEditMode) {
        await updateAddOnService(addOnServiceId, payload);
        toast.success("Add-on service updated successfully");
      } else {
        await createAddOnService(payload);
        toast.success("Add-on service created successfully");
      }

      router.push("/vendor/addon");
    } catch (error) {
      console.error("Error saving add-on service:", error);
      toast.error(error?.message || `Failed to ${isEditMode ? "update" : "create"} add-on service`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/vendor/addon");
  };

  if (loading) {
    return (
      <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
        <div className="col-12 text-center py-40">
          <CircularProgress size={24} />
          <span className="text-14 text-light-1 ml-10">Loading add-on service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row y-gap-15 x-gap-10 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">
        {isEditMode ? "Edit Add-On Service" : "Add New Add-On Service"}
      </div>
      <div className="text-12 text-light-1 lh-1">
        Manage your services, availability, and pricing information.
      </div>
      <div className="col-12">
        <h1 className="text-13 lh-14 fw-500">Description of Services</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Description of Services"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <div className="col-12 mb-10">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">Service & Pricing</div>
          {/* <div className="d-flex col-sm-auto">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setServices(services + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add Service
            </button>
          </div> */}
        </div>
        <div className="col-12 border-light rounded-8 px-15 py-15 mt-10">
          <div className="row x-gap-15 y-gap-15 justify-between items-center y-gap-10">
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">
                Service Name <span className="text-red-1">*</span>
              </h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Service Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">Service Type</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="text"
                placeholder="Enter Service Type (e.g., Residential, Automotive)"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <h1 className="text-13 lh-14 fw-500">
                Base Price <span className="text-red-1">*</span>
              </h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter Base Price"
                value={formData.base_price}
                onChange={(e) => handleInputChange("base_price", e.target.value)}
                required
              />
            </div>
            <div className="col-12 d-flex gap-2 items-center">
              <Checkbox
                className="px-0 py-0"
                checked={formData.requires_scheduling}
                onChange={(e) => handleInputChange("requires_scheduling", e.target.checked)}
              />
              <h1 className="text-14 lh-14 fw-500">Scheduling Needed</h1>
            </div>
            {formData.requires_scheduling && (
              <>
                {/* <div className="col-md-4">
                  <h1 className="text-13 lh-14 fw-500">Hours Available</h1>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeRangePicker format="HH:mm" className="mt-5" />
                    </LocalizationProvider>
                </div> */}
                <div className="col-sm-6">
                  <h1 className="text-13 lh-14 fw-500">Hours Available</h1>
                  <select
                    className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 h-50 w-full text-14 mt-5"
                    value={formData.hours_available}
                    onChange={(e) => handleInputChange("hours_available", e.target.value)}
                  >
                    <option value="">Select hours</option>
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} {hour <= 1 ? "hour" : "hours"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-sm-6">
                  <h1 className="text-13 lh-14 fw-500">
                    Availability Per Timeframe
                  </h1>
                  <input
                    className="border-light rounded-8 py-5 px-15 w-full h-50 mt-5"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter number of available slots (e.g., 50)"
                    value={formData.availability_per_timeframe}
                    onChange={(e) => handleInputChange("availability_per_timeframe", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Calendar
        roomTypeData={formData}
        updateRoomTypeData={(data) => {
          setFormData((prev) => {
            const updated = {
              ...prev,
              ...data,
            };
            return updated;
          });
        }}
      />

      {/* <div className="col-12">
        <div className="text-18 fw-500 mt-10 col-auto">
          Cancellation Policies
        </div>
        <div className="col-12 border-light rounded-8 px-15 py-15 mt-10">
          <div className="text-16  fw-500">Flexible Cancellation Policy</div>
          <div className="d-flex items-start mt-5">
            <span className="material-symbols-outlined text-15 fw-500 mr-10 lh-19">
              schedule
            </span>
            <div>
              <div className="text-14 fw-500">
                Full refund if cancelled 24 hours before check-in
              </div>
              <div className="text-12 text-light-1 lh-1">
                Guests can receive a full refund if they cancel at least 24
                hours before the check-in date.
              </div>
            </div>
          </div>
          <textarea
            className="border-light rounded-8 py-5 px-15 w-full mt-20"
            type="text"
            placeholder="Add custom policy details..."
          />
        </div>
      </div> */}

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button
          className="button border-light rounded-8 text-12 py-10 px-15 mr-10"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? (
            <>
              <CircularProgress size={14} className="mr-10" style={{ color: "white" }} />
              {isEditMode ? "Updating..." : "Saving..."}
            </>
          ) : (
            isEditMode ? "Update" : "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default Services;
