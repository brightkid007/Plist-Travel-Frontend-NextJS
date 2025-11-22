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
  const size = data?.size || "";
  const eventMaximumCapacity = data?.event_maximum_capacity || "";
  const isMultiDay = data?.is_multi_day || false;
  const eventDays = data?.event_days || (isMultiDay ? [{ date: "", duration: "", start_time: "", end_time: "" }] : []);
  const performerSpeakerInfo = data?.performer_speaker_info || "";
  const ageRestriction = data?.age_restriction || "";
  const specialOffersId = data?.special_offers_id || "";
  const parkingInfo = data?.parking_info || "";
  const covidSafetyGuidelines = data?.covid_safety_guidelines || "";
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

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Details</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Size in m2</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter property size"
          value={size}
          onChange={(e) => handleFieldChange("size", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Maximum Capacity</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          step="1"
          placeholder="Enter maximum capacity for the event"
          value={eventMaximumCapacity}
          onChange={(e) => handleFieldChange("event_maximum_capacity", e.target.value)}
        />
      </div>

      <div className="col-12 mt-10 px-10">
        <div className="row x-gap-10 y-gap-10 border-light items-end rounded-8 py-10 px-10 w-full">
          <div className="d-flex items-center gap-2">
            <Checkbox
              className="px-0 py-0"
              checked={isMultiDay}
              onChange={(e) => handleMultiDayChange(!isMultiDay)}
            />
            <div className="text-14 lh-12 fw-500">Multi-Day Event</div>
          </div>
          {isMultiDay && eventDays.map((day, idx) => (
            <React.Fragment key={idx}>
              <div className="col-md-3 col-sm-6">
                <div className="col-12 text-14 lh-12 fw-500">
                  Day {idx + 1}:
                </div>
                <h1 className="text-14 lh-12 fw-500">Event Date <span className="text-red-1">*</span></h1>
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
                <h1 className="text-14 lh-12 fw-500">Event Start Time <span className="text-red-1">*</span></h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full"
                  type="time"
                  value={day.start_time || ""}
                  onChange={(e) => handleDayChange(idx, "start_time", e.target.value)}
                />
              </div>

              <div className="col-md-3 col-sm-6">
                <h1 className="text-14 lh-12 fw-500">Event End Time <span className="text-red-1">*</span></h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full"
                  type="time"
                  value={day.end_time || ""}
                  onChange={(e) => handleDayChange(idx, "end_time", e.target.value)}
                />
              </div>
              {eventDays.length > 1 && (
                <div className="col-12 d-flex justify-end">
                  <button
                    type="button"
                    className="text-12 text-red-1 mt-5"
                    onClick={() => handleRemoveDay(idx)}
                  >
                    Remove Day
                  </button>
                </div>
              )}
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
        <h1 className="text-14 lh-12 fw-500">Performer/Speaker Info</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Performers: The Rock Band, DJ Mike"
          value={performerSpeakerInfo}
          onChange={(e) => handleFieldChange("performer_speaker_info", e.target.value)}
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Age Restriction</h1>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={ageRestriction}
          onChange={(e) => handleFieldChange("age_restriction", e.target.value)}
        >
          <option value="">Select age restriction</option>
          <option value="18+">18+ only</option>
          <option value="21+">21+ only</option>
          <option value="all">All ages</option>
        </select>
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
        <h1 className="text-14 lh-12 fw-500">COVID/Safety Guidelines</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="i.e. Masks required, social distancing enforced"
          value={covidSafetyGuidelines}
          onChange={(e) => handleFieldChange("covid_safety_guidelines", e.target.value)}
        />
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
          <h1 className="text-14 lh-12 fw-500">Accessibility Info</h1>
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
