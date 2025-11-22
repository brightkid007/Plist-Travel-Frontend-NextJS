import { Checkbox } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CancellationPolicy from "../../../common/CancellationPolicy";
import { getMyCoupons } from "@/helpers/backend_helper";

const ListingDetails = ({ 
  listingId,
  data,
  onUpdate 
}) => {
  const router = useRouter();
  
  // Initialize data from props
  const groupSizeLimit = data?.group_size_limit || "";
  const inclusions = data?.inclusions || "";
  const exclusions = data?.exclusions || "";
  const isMultiDay = data?.is_multi_day || false;
  const eventDays = data?.event_days || (isMultiDay ? [{ date: "", duration: "", start_time: "", end_time: "" }] : []);
  const specialOffersId = data?.special_offers_id || null;
  const parkingInfo = data?.parking_info || "";
  const safetyGuidelines = data?.safety_guidelines || "";
  const guideName = data?.guide_name || "";
  const guideDetail = data?.guide_detail || "";
  const itineraryDetails = data?.itinerary_details || [{ type: "", details: "" }];
  const cancellationPolicyId = data?.cancellation_policy_id || null;
  const accessibilityInfo = data?.accessibility_info || "";
  const isAccessibilityEnabled = data?.is_accessibility_enabled || false;

  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // Load coupons on component mount
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const response = await getMyCoupons({ is_active: true });
        const couponsData = response?.data?.data || response?.data || response || [];
        setCoupons(Array.isArray(couponsData) ? couponsData : []);
      } catch (error) {
        console.error("Error loading coupons:", error);
        setCoupons([]);
      } finally {
        setLoadingCoupons(false);
      }
    };
    loadCoupons();
  }, []);

  const handleFieldChange = (field, value) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        [field]: value
      });
    }
  };

  const handleDayChange = (index, field, value) => {
    const updatedDays = [...eventDays];
    if (!updatedDays[index]) {
      updatedDays[index] = { date: "", duration: "", start_time: "", end_time: "" };
    }
    updatedDays[index][field] = value;
    handleFieldChange("event_days", updatedDays);
  };

  const handleMultiDayChange = (checked) => {
    // Update both fields in a single state update to avoid race conditions
    const currentEventDays = data?.event_days || [];
    
    if (checked) {
      // If enabling multi-day and no days exist, add one
      if (currentEventDays.length === 0) {
        if (onUpdate) {
          onUpdate({
            ...data,
            is_multi_day: checked,
            event_days: [{ date: "", duration: "", start_time: "", end_time: "" }]
          });
        }
      } else {
        // Just update is_multi_day if days already exist
        handleFieldChange("is_multi_day", checked);
      }
    } else {
      // If disabling multi-day, clear all days
      if (onUpdate) {
        onUpdate({
          ...data,
          is_multi_day: checked,
          event_days: []
        });
      }
    }
  };

  const handleAddDay = () => {
    handleFieldChange("event_days", [...eventDays, { date: "", duration: "", start_time: "", end_time: "" }]);
  };

  const handleRemoveDay = (index) => {
    const updatedDays = eventDays.filter((_, idx) => idx !== index);
    handleFieldChange("event_days", updatedDays.length > 0 ? updatedDays : []);
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItineraries = [...itineraryDetails];
    if (!updatedItineraries[index]) {
      updatedItineraries[index] = { type: "", details: "" };
    }
    updatedItineraries[index][field] = value;
    handleFieldChange("itinerary_details", updatedItineraries);
  };

  const handleAddItinerary = () => {
    handleFieldChange("itinerary_details", [...itineraryDetails, { type: "", details: "" }]);
  };

  const handleRemoveItinerary = (index) => {
    const updatedItineraries = itineraryDetails.filter((_, idx) => idx !== index);
    handleFieldChange("itinerary_details", updatedItineraries.length > 0 ? updatedItineraries : [{ type: "", details: "" }]);
  };

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Details</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Group Size Limit</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="1"
          step="1"
          placeholder="The maximum number of participants allowed."
          value={groupSizeLimit}
          onChange={(e) => handleFieldChange("group_size_limit", e.target.value)}
        />
      </div>

      <div className="col-sm-3 mt-5">
        <h1 className="text-14 lh-12 fw-500">Inclusions</h1>
        <select 
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={inclusions}
          onChange={(e) => handleFieldChange("inclusions", e.target.value)}
        >
          <option value="">Select inclusions</option>
          <option value="guide">Guide</option>
          <option value="entrance-fees">Entrance fees</option>
          <option value="meals">Meals</option>
          <option value="transportation">Transportation</option>
        </select>
      </div>

      <div className="col-sm-3 mt-5">
        <h1 className="text-14 lh-12 fw-500">Exclusions</h1>
        <select 
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={exclusions}
          onChange={(e) => handleFieldChange("exclusions", e.target.value)}
        >
          <option value="">Select exclusions</option>
          <option value="meals">Meals</option>
          <option value="transportation">Transportation</option>
          <option value="entrance-fees">Entrance fees</option>
        </select>
      </div>

      <div className="col-12 mt-10 px-10">
        <div className="row x-gap-10 y-gap-10 border-light items-end rounded-8 py-10 px-10 w-full">
          <div className="d-flex items-center gap-2">
            <Checkbox
              className="px-0 py-0"
              checked={isMultiDay}
              onChange={(e) => handleMultiDayChange(e.target.checked)}
            />
            <div className="text-14 lh-12 fw-500">Multi-Day Tour</div>
          </div>
          {isMultiDay && eventDays.map((day, idx) => (
            <React.Fragment key={idx}>
              <div className="col-md-3 col-sm-6">
                <div className="col-12 text-14 lh-12 fw-500">
                  Day {idx + 1}:
                </div>
                <h1 className="text-14 lh-12 fw-500">Tour Date</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full"
                  type="date"
                  value={day.date || ""}
                  onChange={(e) => handleDayChange(idx, "date", e.target.value)}
                />
              </div>

              <div className="col-md-3 col-sm-6">
                <h1 className="text-14 lh-12 fw-500">Duration</h1>
                <select 
                  className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full"
                  value={day.duration || ""}
                  onChange={(e) => handleDayChange(idx, "duration", e.target.value)}
                >
                  <option value="">Select duration</option>
                  <option value="1">1 hour</option>
                  {Array(23)
                    .fill(null)
                    .map((_, index) => (
                      <option key={index + 2} value={index + 2}>{index + 2} hours</option>
                    ))}
                </select>
              </div>

              <div className="col-md-3 col-sm-6">
                <h1 className="text-14 lh-12 fw-500">Tour Start Time</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full"
                  type="time"
                  value={day.start_time || ""}
                  onChange={(e) => handleDayChange(idx, "start_time", e.target.value)}
                />
              </div>

              <div className="col-md-3 col-sm-6">
                <h1 className="text-14 lh-12 fw-500">Tour End Time</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full"
                  type="time"
                  value={day.end_time || ""}
                  onChange={(e) => handleDayChange(idx, "end_time", e.target.value)}
                />
                {eventDays.length > 1 && (
                  <button
                    type="button"
                    className="text-12 text-red-1 mt-5"
                    onClick={() => handleRemoveDay(idx)}
                  >
                    Remove Day
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
          {isMultiDay && (
            <div className="col-12 mt-10">
              <button
                type="button"
                className="button border-light rounded-8 px-15 py-10 fw-500"
                onClick={handleAddDay}
              >
                Add Day
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Special Offers</h1>
        <div className="text-12 text-light-1 lh-1 mt-5">
          Any special offers or discounts available.
        </div>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={specialOffersId || ""}
          onChange={(e) => {
            if (e.target.value === "new-offer") {
              router.push("/vendor/coupon");
            } else {
              handleFieldChange("special_offers_id", e.target.value || null);
            }
          }}
          disabled={loadingCoupons}
        >
          <option value="">Select special offers</option>
          {loadingCoupons ? (
            <option value="" disabled>Loading coupons...</option>
          ) : (
            <>
              {coupons.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.code} {coupon.discount_value ? `(${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : '$' + coupon.discount_value} off)` : ''}
                </option>
              ))}
              <option value="new-offer">
                + Create New Special Offer
              </option>
            </>
          )}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Parking Info</h1>
        <div className="text-12 text-light-1 lh-1 mt-5">
          Information about parking availability.
        </div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Free parking available, shuttle service provided"
          value={parkingInfo}
          onChange={(e) => handleFieldChange("parking_info", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Safety Guidelines</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="i.e. Masks required, social distancing enforced"
          value={safetyGuidelines}
          onChange={(e) => handleFieldChange("safety_guidelines", e.target.value)}
        />
      </div>

      <div className="col-sm-3 mt-5">
        <h1 className="text-14 lh-12 fw-500">Guide Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Sarah Johnson"
          value={guideName}
          onChange={(e) => handleFieldChange("guide_name", e.target.value)}
        />
      </div>

      <div className="col-sm-3 mt-5">
        <h1 className="text-14 lh-12 fw-500">Detail about Guide</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Experienced historian"
          value={guideDetail}
          onChange={(e) => handleFieldChange("guide_detail", e.target.value)}
        />
      </div>

      <div className="col-12 mt-5">
        <div className="d-flex items-center gap-2">
          <h1 className="text-14 lh-12 fw-500">Itinerary Details</h1>
          {itineraryDetails.length > 1 && (
            <button
              type="button"
              className="text-12 text-red-1"
              onClick={() => handleRemoveItinerary(itineraryDetails.length - 1)}
            >
              Remove
            </button>
          )}
          <button
            type="button"
            className="text-12 text-blue-1"
            onClick={handleAddItinerary}
          >
            Add
          </button>
        </div>
        {itineraryDetails.map((itinerary, index) => (
          <React.Fragment key={index}>
            <div className="col-sm-6 mt-10">
              <select 
                className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full"
                value={itinerary.type || ""}
                onChange={(e) => handleItineraryChange(index, "type", e.target.value)}
              >
                <option value="">Select Itinerary Type</option>
                <option value="historic-landmarks">Historic Landmarks</option>
                <option value="museums">Museums</option>
                <option value="parks">Parks</option>
                <option value="restaurants">Restaurants</option>
                <option value="shopping">Shopping</option>
              </select>
            </div>
            <div className="col-sm-6 mt-10">
              <input
                className="border-light rounded-8 py-5 px-15 w-full"
                type="text"
                placeholder="Enter Itinerary Details"
                value={itinerary.details || ""}
                onChange={(e) => handleItineraryChange(index, "details", e.target.value)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="col-12 mt-5 border-bottom-light pb-10">
        <h1 className="text-14 lh-12 fw-500">Cancellation Policy</h1>
        <CancellationPolicy
          listingId={listingId}
          selectedPolicyId={cancellationPolicyId}
          onPolicyChange={(policyId) => handleFieldChange("cancellation_policy_id", policyId)}
        />
      </div>

      <div className="col-12 mt-10">
        <div className="d-flex items-center gap-1">
          <Checkbox 
            className="px-0 py-0"
            checked={isAccessibilityEnabled}
            onChange={(e) => handleFieldChange("is_accessibility_enabled", e.target.checked)}
          />
          <h1 className="text-14 lh-12 fw-500">Accessibility Features</h1>
        </div>
        <textarea
          rows={2}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Describe Accessibility"
          value={accessibilityInfo}
          onChange={(e) => handleFieldChange("accessibility_info", e.target.value)}
          disabled={!isAccessibilityEnabled}
        />
      </div>
    </div>
  );
};

export default ListingDetails;
