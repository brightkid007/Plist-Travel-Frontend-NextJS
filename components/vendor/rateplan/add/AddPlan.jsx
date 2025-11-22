"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import VendorDashboardLayout from "@/components/vendor/common/layout";
import {
  createRatePlan,
  updateRatePlan,
  getRatePlanById,
  getCancellationPolicies,
  createCancellationPolicy,
  getRatePlans,
} from "@/helpers/backend_helper";
import CancellationPolicy from "./components/CancellationPolicy";
import ReservationRestrictions from "./components/ReservationRestrictions";
import PaymentMethod from "./components/PaymentMethod";
import OptionalPeriod from "./components/OptionalPeriod";
import RatePlan from "./components/RatePlan";
import RoomType from "./components/RoomType";
import MinLengthStay from "./components/MinLengthStay";
import AddOnServices from "./components/AddOnServices";

const index = ({ ratePlanId, isEditMode = false, type = "custom" }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [cancellationPolicies, setCancellationPolicies] = useState([]);

  // Form state - centralized state management
  const [formData, setFormData] = useState({
    title: "",
    plan_type: type,
    currency: "USD",
    includes_breakfast: false,
    includes_add_ons: false,
    add_on_service_id: null,
    special_offer: "",
    setup_fee: "",
    min_stay: null,
    max_stay: null,
    max_guests: null,
    check_in_time: "",
    check_out_time: "",
    cancellation_policy_id: null,
    payment_method: "prepay",
    booking_period_enabled: false,
    booking_start_date: null,
    booking_end_date: null,
    restrict_res_time_enabled: false,
    min_reservation_days: null,
    max_reservation_days: null,
    restrict_los_enabled: false,
    sell_on_website_only: false,
    only_for_b2b: false,
    bundle_only: false,
    ticket_holder_exclusive: false,
    management_mode: "standalone",
    derived_from_rate_plan_id: null,
    derived_sync_scope: null,
    derived_adjustment_type: null,
    derived_adjustment_direction: null,
    derived_adjustment_value: null,
    room_type_ids: [],
    is_active: true,
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load rate plan data if in edit mode
  useEffect(() => {
    if (isEditMode && ratePlanId) {
      loadRatePlanData();
    }
  }, [isEditMode, ratePlanId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const policiesRes = await getCancellationPolicies().catch(() => ({ data: [] }));

      setCancellationPolicies(policiesRes?.data || []);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadRatePlanData = async () => {
    try {
      setLoading(true);
      const response = await getRatePlanById(ratePlanId);
      const ratePlan = response?.data?.rate_plan || response?.rate_plan || response?.data || response;

      if (ratePlan) {
        // Helper function to format dates
        const formatDate = (date) => {
          if (!date) return null;
          if (typeof date === "string") return date.split("T")[0]; // Extract date part from ISO string
          if (date instanceof Date) return date.toISOString().split("T")[0];
          return date;
        };

        // Extract room type IDs from room_type_id_list
        // Ensure it's an array and convert to integers
        const roomTypeIds = Array.isArray(ratePlan.room_type_id_list) 
          ? ratePlan.room_type_id_list.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
          : [];
        console.log("roomTypeIds", roomTypeIds);
        setFormData({
          title: ratePlan.title || "",
          plan_type: ratePlan.plan_type || type,
          currency: ratePlan.currency || "USD",
          includes_breakfast: Boolean(ratePlan.includes_breakfast),
          includes_add_ons: Boolean(ratePlan.includes_add_ons),
          add_on_service_id: ratePlan.add_on_service_id || null,
          special_offer: ratePlan.special_offer || "",
          setup_fee: ratePlan.setup_fee ? parseFloat(ratePlan.setup_fee).toString() : "",
          min_stay: ratePlan.min_stay || null,
          max_stay: ratePlan.max_stay || null,
          max_guests: ratePlan.max_guests || null,
          check_in_time: ratePlan.check_in_time || "",
          check_out_time: ratePlan.check_out_time || "",
          cancellation_policy_id: ratePlan.cancellation_policy_id || null,
          payment_method: ratePlan.payment_method === "pay_at_property" ? "postpay" : "prepay",
          booking_period_enabled: Boolean(ratePlan.booking_period_enabled),
          booking_start_date: formatDate(ratePlan.booking_start_date),
          booking_end_date: formatDate(ratePlan.booking_end_date),
          restrict_res_time_enabled: Boolean(ratePlan.restrict_res_time_enabled),
          min_reservation_days: ratePlan.min_reservation_days || null,
          max_reservation_days: ratePlan.max_reservation_days || null,
          restrict_los_enabled: Boolean(ratePlan.restrict_los_enabled),
          sell_on_website_only: Boolean(ratePlan.sell_on_website_only),
          only_for_b2b: Boolean(ratePlan.only_for_b2b),
          bundle_only: Boolean(ratePlan.bundle_only),
          ticket_holder_exclusive: Boolean(ratePlan.ticket_holder_exclusive),
          management_mode: ratePlan.management_mode || "standalone",
          derived_from_rate_plan_id: ratePlan.derived_from_rate_plan_id || null,
          derived_sync_scope: ratePlan.derived_sync_scope || null,
          derived_adjustment_type: ratePlan.derived_adjustment_type || null,
          derived_adjustment_direction: ratePlan.derived_adjustment_direction || null,
          derived_adjustment_value: ratePlan.derived_adjustment_value ? parseFloat(ratePlan.derived_adjustment_value).toString() : null,
          room_type_ids: roomTypeIds,
          is_active: ratePlan.is_active !== undefined ? Boolean(ratePlan.is_active) : true,
        });
      }
    } catch (error) {
      console.error("Error loading rate plan:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to load rate plan");
      router.push("/vendor/rateplan");
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || formData.title.trim() === "") {
      toast.error("Please enter a rate plan name");
      return;
    }
    console.log("formData", formData.room_type_ids);
    
    // Check if room_type_ids is an array and has items
    const roomTypeIds = Array.isArray(formData.room_type_ids) ? formData.room_type_ids : [];
    if (roomTypeIds.length === 0) {
      toast.error("Please select at least one room type");
      return;
    }

    try {
      setSubmitting(true);

      // Helper function to format dates
      const formatDate = (date) => {
        if (!date) return null;
        if (typeof date === "string") return date;
        if (date.format) return date.format("YYYY-MM-DD");
        if (date instanceof Date) {
          return date.toISOString().split("T")[0];
        }
        return null;
      };

      // Prepare payload - only include defined values
      const payload = {
        title: formData.title.trim(),
        plan_type: formData.plan_type || "custom",
        currency: formData.currency || "USD",
        includes_breakfast: Boolean(formData.includes_breakfast),
        includes_add_ons: Boolean(formData.includes_add_ons),
        room_type_ids: Array.isArray(formData.room_type_ids) ? formData.room_type_ids : [],
        is_active: formData.is_active !== undefined ? Boolean(formData.is_active) : true,
      };

      // Add-on service ID (only if includes_add_ons is true)
      if (formData.includes_add_ons && formData.add_on_service_id) {
        payload.add_on_service_id = parseInt(formData.add_on_service_id);
      } else {
        payload.add_on_service_id = null;
      }

      // Optional string fields
      if (formData.special_offer && formData.special_offer.trim() !== "") {
        payload.special_offer = formData.special_offer.trim();
      }

      // Optional numeric fields
      if (formData.setup_fee && parseFloat(formData.setup_fee) > 0) {
        payload.setup_fee = parseFloat(formData.setup_fee);
      }
      if (formData.min_stay && parseInt(formData.min_stay) > 0) {
        payload.min_stay = parseInt(formData.min_stay);
      }
      if (formData.max_stay && parseInt(formData.max_stay) > 0) {
        payload.max_stay = parseInt(formData.max_stay);
      }
      if (formData.max_guests && parseInt(formData.max_guests) > 0) {
        payload.max_guests = parseInt(formData.max_guests);
      }

      // Time fields
      if (formData.check_in_time && formData.check_in_time.trim() !== "") {
        payload.check_in_time = formData.check_in_time;
      }
      if (formData.check_out_time && formData.check_out_time.trim() !== "") {
        payload.check_out_time = formData.check_out_time;
      }

      // Cancellation policy
      if (formData.cancellation_policy_id) {
        payload.cancellation_policy_id = parseInt(formData.cancellation_policy_id);
      }

      // Payment method
      payload.payment_method = formData.payment_method === "postpay" ? "pay_at_property" : "prepay";

      // Booking period
      payload.booking_period_enabled = Boolean(formData.booking_period_enabled);
      if (formData.booking_period_enabled) {
        const startDate = formatDate(formData.booking_start_date);
        const endDate = formatDate(formData.booking_end_date);
        if (startDate) payload.booking_start_date = startDate;
        if (endDate) payload.booking_end_date = endDate;
      } else {
        // Clear dates if booking period is disabled
        payload.booking_start_date = null;
        payload.booking_end_date = null;
      }

      // Reservation restrictions
      payload.restrict_res_time_enabled = Boolean(formData.restrict_res_time_enabled);
      if (formData.restrict_res_time_enabled) {
        if (formData.min_reservation_days && parseInt(formData.min_reservation_days) > 0) {
          payload.min_reservation_days = parseInt(formData.min_reservation_days);
        } else {
          payload.min_reservation_days = null;
        }
        if (formData.max_reservation_days && parseInt(formData.max_reservation_days) > 0) {
          payload.max_reservation_days = parseInt(formData.max_reservation_days);
        } else {
          payload.max_reservation_days = null;
        }
      } else {
        payload.min_reservation_days = null;
        payload.max_reservation_days = null;
      }

      // Length of stay restrictions
      payload.restrict_los_enabled = Boolean(formData.restrict_los_enabled);

      // Exclusive options
      payload.sell_on_website_only = Boolean(formData.sell_on_website_only);
      payload.only_for_b2b = Boolean(formData.only_for_b2b);
      payload.bundle_only = Boolean(formData.bundle_only);
      payload.ticket_holder_exclusive = Boolean(formData.ticket_holder_exclusive);

      // Management mode
      payload.management_mode = formData.management_mode || "standalone";

      // Derived plan settings (only if management_mode is "derived")
      if (formData.management_mode === "derived") {
        if (formData.derived_from_rate_plan_id) {
          payload.derived_from_rate_plan_id = parseInt(formData.derived_from_rate_plan_id);
        }
        if (formData.derived_sync_scope) {
          payload.derived_sync_scope = formData.derived_sync_scope;
        }
        if (formData.derived_adjustment_type) {
          payload.derived_adjustment_type = formData.derived_adjustment_type;
        }
        if (formData.derived_adjustment_direction) {
          payload.derived_adjustment_direction = formData.derived_adjustment_direction;
        }
        if (formData.derived_adjustment_value && parseFloat(formData.derived_adjustment_value) !== 0) {
          payload.derived_adjustment_value = parseFloat(formData.derived_adjustment_value);
        }
      }

      var response;
      if (isEditMode) {
        response = await updateRatePlan(ratePlanId, payload);
      } else {
        response = await createRatePlan(payload);
      }

      const ratePlan = response?.data?.rate_plan || response?.rate_plan;
      if (ratePlan) {
        toast.success("Rate plan updated successfully!");
        router.push("/vendor/rateplan");
        // const planType = ratePlan.plan_type || formData.plan_type || type || "custom";
        // router.push(`/vendor/rateplan/${ratePlan.id}/preview/${planType}`);
      } else {
        toast.error("Rate plan updated but no data returned");
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} rate plan:`, error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        `Failed to ${isEditMode ? "update" : "create"} rate plan. Please check all required fields.`;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const hourlySteps =
    type === "hourly"
      ? [
        {
          title: "Would you like to put a restriction on the length of stay?",
          content: (
            <div className="d-flex items-center gap-2 ml-20 mt-10">
              <select
                className="border-light form-select rounded-8 bg-white px-10 h-50 w-140"
                value={formData.max_stay || ""}
                onChange={(e) => handleInputChange("max_stay", e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">No restriction</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <div className="text-14 lh-14 ml-5">hour(s)</div>
            </div>
          ),
        },
        {
          title: "Would you like to set an earliest check-in time?",
          content: (
            <div className="ml-20 mt-10">
              <select
                className="border-light form-select rounded-8 bg-white px-10 h-50 w-140"
                value={formData.check_in_time ? formData.check_in_time.replace(":00", "") : ""}
                onChange={(e) => handleInputChange("check_in_time", e.target.value ? `${e.target.value}:00` : "")}
              >
                <option value="">Not set</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>
          ),
        },
        {
          title: "Would you like to set a latest check-out time?",
          content: (
            <div className="ml-20 mt-10">
              <select
                className="border-light form-select rounded-8 bg-white px-10 h-50 w-140"
                value={formData.check_out_time ? formData.check_out_time.replace(":00", "") : ""}
                onChange={(e) => handleInputChange("check_out_time", e.target.value ? `${e.target.value}:00` : "")}
              >
                <option value="">Not set</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>
          ),
        },
      ]
      : [];

  const monthlySteps =
    type === "monthly"
      ? [
        {
          title: "Min. Length of Stay",
          content: (
            <MinLengthStay
              minStay={formData.min_stay}
              maxStay={formData.max_stay}
              onMinStayChange={(value) => handleInputChange("min_stay", value)}
              onMaxStayChange={(value) => handleInputChange("max_stay", value)}
            />
          ),
        },
      ]
      : [];

  const mealSteps =
    type !== "hourly"
      ? [
        {
          title: "Are Add-On services included in the rate?",
          content: (
            <AddOnServices
              includesAddOns={formData.includes_add_ons}
              onIncludesAddOnsChange={(value) => {
                handleInputChange("includes_add_ons", value);
                // Clear add-on service ID if user selects "No"
                if (!value) {
                  handleInputChange("add_on_service_id", null);
                }
              }}
              selectedAddOnServiceId={formData.add_on_service_id}
              onAddOnServiceIdChange={(id) => handleInputChange("add_on_service_id", id)}
            />
          ),
        },
      ]
      : [];

  const steps = [
    {
      title: "Name your rate plan",
      subtitle: (
        <div className="text-12 text-light-1 lh-14">
          The site plan name is for your reference and won't appear to Trip.com
          users
        </div>
      ),
      content: (
        <div className="ml-20 mt-10">
          <div className="w-180">
            <input
              type="text"
              placeholder="Enter rate plan name"
              className="border-light rounded-8 bg-white px-10 py-5"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>
          <div className="text-12 text-light-1 lh-14 mt-5">Rate plan name</div>
        </div>
      ),
    },
    ...hourlySteps,
    ...monthlySteps,
    {
      title: "Select a cancellation policy",
      subtitle: (
        <div className="text-12 text-light-1 lh-14">
          If there is no suitable cancellation policy for you, you can
          <span
            className="text-blue-1 ml-5 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            modify new
          </span>
        </div>
      ),
      content: (
        <CancellationPolicy
          showModal={showModal}
          setShowModal={setShowModal}
          policies={cancellationPolicies}
          selectedPolicy={formData.cancellation_policy_id}
          onSelectPolicy={(id) => handleInputChange("cancellation_policy_id", id)}
          onCreatePolicy={async (policyData) => {
            try {
              const response = await createCancellationPolicy(policyData);
              const newPolicy = response?.data || response;
              setCancellationPolicies((prev) => [...prev, newPolicy]);
              handleInputChange("cancellation_policy_id", newPolicy.id);
              setShowModal(false);
              toast.success("Cancellation policy created successfully");
            } catch (error) {
              toast.error(error?.response?.data?.message || "Failed to create policy");
            }
          }}
        />
      ),
    },
    ...mealSteps,
    {
      title:
        "Would you like to set up reservation restrictions for this rate plan? (Including reservation time, length of stay, exclusive company)",
      content: (
        <ReservationRestrictions
          formData={formData}
          onInputChange={handleInputChange}
        />
      ),
    },
    {
      title: "Select payment method",
      content: (
        <PaymentMethod
          paymentMethod={formData.payment_method}
          onPaymentMethodChange={(value) => handleInputChange("payment_method", value)}
        />
      ),
    },
    {
      title: "Set Booking Period",
      content: (
        <OptionalPeriod
          bookingPeriodEnabled={formData.booking_period_enabled}
          bookingStartDate={formData.booking_start_date}
          bookingEndDate={formData.booking_end_date}
          onBookingPeriodEnabledChange={(value) => handleInputChange("booking_period_enabled", value)}
          onBookingStartDateChange={(value) => handleInputChange("booking_start_date", value)}
          onBookingEndDateChange={(value) => handleInputChange("booking_end_date", value)}
        />
      ),
    },
    // {
    //   title: "How will you manage this rate plan?",
    //   content: (
    //     <RatePlan
    //       formData={formData}
    //       ratePlans={ratePlans}
    //       onInputChange={handleInputChange}
    //       onLoadRatePlans={async () => {
    //         const ratePlansRes = await getRatePlans().catch(() => ({ data: { rate_plans: [] } }));
    //         setRatePlans(ratePlansRes?.data?.rate_plans || []);
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Create this rate plan for the following room types",
      content: (
        <RoomType
          roomTypeIds={formData.room_type_ids}
          onRoomTypeIdsChange={(ids) => handleInputChange("room_type_ids", ids)}
        />
      ),
    },
  ].filter(Boolean);

  if (loading && isEditMode) {
    return (
      <VendorDashboardLayout>
        <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
          <div className="col-12 text-center py-40">
            <CircularProgress size={24} />
            <span className="text-14 text-light-1 ml-10">Loading rate plan...</span>
          </div>
        </div>
      </VendorDashboardLayout>
    );
  }

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-10 justify-between items-end mb-10">
        <h1 className="text-30 lh-14 fw-600">{isEditMode ? `Edit ${type} rate plan` : `Add a ${type} rate plan`}</h1>
      </div>

      <div className="bg-white rounded-8 py-20 px-20">
        <div className="row y-gap-20 x-gap-20">
          {steps.map((step, index) => (
            <div className="col-12" key={index}>
              <div className="text-18 lh-14">
                {index + 1}. {step.title}
              </div>
              {step.subtitle}
              {step.content}
            </div>
          ))}
        </div>
        <div className="border-top-light mt-15 pt-15 d-flex justify-end gap-2">
          <button
            className="text-14 border-light rounded-8 px-15 py-5"
            onClick={() => router.push("/vendor/rateplan")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="text-white bg-blue-1 rounded-8 px-15 py-5 text-14"
            onClick={handleSubmit}
            disabled={submitting || loading}
          >
            {submitting ? (
              <>
                <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditMode ? "Update Rate Plan" : "Create Rate Plan"
            )}
          </button>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default index;

