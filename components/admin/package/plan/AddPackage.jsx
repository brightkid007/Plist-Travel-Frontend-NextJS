"use client";

import AdminDashboardLayout from "../../common/layout";
import FormInput from "@/components/common/form/FormInput";
import { Checkbox } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { createPackagePlan, updatePackagePlan, getPackagePlanById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [planType, setPlanType] = useState("subscription");
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [price, setPrice] = useState("");
  const [commissionPercent, setCommissionPercent] = useState("");
  const [durationUnit, setDurationUnit] = useState("months");
  const [durationValue, setDurationValue] = useState("1");
  const [trialDays, setTrialDays] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [hoverFeatureIdx, setHoverFeatureIdx] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const addFeature = () => {
    const value = (newFeature || "").trim();
    if (!value) return;
    if (!features.includes(value)) setFeatures([...features, value]);
    setNewFeature("");
    setHoverFeatureIdx(-1);
  };

  const removeFeatureAt = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
    setHoverFeatureIdx(-1);
  };

  useEffect(() => {
    // Load plan data when in edit mode
    const loadPlanData = async () => {
      if (!isEditMode || !editId) return;

      try {
        setLoading(true);
        const res = await getPackagePlanById(editId);
        const plan = res?.plan || res?.data?.plan || res?.data || res || {};

        // Populate form fields
        setName(plan.name || "");
        setDescription(plan.description || "");
        setPlanType(plan.model || plan.plan_type || "subscription");
        setIsActive(plan.status === "Active" || plan.status === "active" || plan.is_active !== false);
        setIsPopular(plan.is_popular || false);
        setSortOrder(plan.sort_order ? String(plan.sort_order) : "");
        setFeatures(Array.isArray(plan.features) ? plan.features : []);

        if (plan.price !== undefined && plan.price !== null) {
          setPrice(String(plan.price));
        }
        if (plan.commission_percent !== undefined && plan.commission_percent !== null) {
          setCommissionPercent(String(plan.commission_percent));
        }
        if (plan.duration_unit) {
          setDurationUnit(plan.duration_unit);
        }
        if (plan.duration_value !== undefined && plan.duration_value !== null) {
          setDurationValue(String(plan.duration_value));
        }
        if (plan.trial_days !== undefined && plan.trial_days !== null) {
          setTrialDays(String(plan.trial_days));
        }
      } catch (e) {
        toast.error(e?.message || "Failed to load plan");
        router.push("/admin/package/plan");
      } finally {
        setLoading(false);
      }
    };

    loadPlanData();
  }, [isEditMode, editId, router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        name,
        description,
        model: planType,
        status: isActive ? "Active" : "Inactive",
        sort_order: sortOrder ? parseInt(sortOrder) : null,
        is_popular: isPopular,
        features: features,
      };

      if (planType === "subscription") {
        payload.price = price ? parseFloat(price) : null;
        payload.duration_unit = durationUnit;
        payload.duration_value = durationValue ? parseInt(durationValue) : null;
        payload.trial_days = trialDays ? parseInt(trialDays) : 0;
      } else if (planType === "fee-per-booking") {
        payload.commission_percent = commissionPercent ? parseFloat(commissionPercent) : null;
      } else if (planType === "both") {
        payload.price = price ? parseFloat(price) : null;
        payload.duration_unit = durationUnit;
        payload.duration_value = durationValue ? parseInt(durationValue) : null;
        payload.commission_percent = commissionPercent ? parseFloat(commissionPercent) : null;
      }

      if (!payload.name.trim()) {
        toast.error("Please enter package name");
        setSaving(false);
        return;
      }
      if (!["subscription", "fee-per-booking", "both"].includes(planType)) {
        toast.error("Please select a valid plan type");
        setSaving(false);
        return;
      }
      // Additional validations
      const validUnits = ["days", "months", "quarters", "years"];
      if (!Array.isArray(payload.features) || payload.features.some((f) => typeof f !== "string" || !f.trim())) {
        toast.error("Features must be non-empty text items");
        setSaving(false);
        return;
      }
      if (payload.sort_order !== null && (!Number.isInteger(payload.sort_order) || payload.sort_order < 0)) {
        toast.error("Sort order must be a non-negative integer");
        setSaving(false);
        return;
      }
      if (planType === "subscription" || planType === "both") {
        if (!(typeof payload.price === "number") || !(payload.price > 0)) {
          toast.error("Price must be greater than 0");
          setSaving(false);
          return;
        }
        if (!validUnits.includes(payload.duration_unit)) {
          toast.error("Duration unit must be days, months, quarters or years");
          setSaving(false);
          return;
        }
        if (!Number.isInteger(payload.duration_value) || payload.duration_value < 1) {
          toast.error("Duration value must be an integer ≥ 1");
          setSaving(false);
          return;
        }
        if (!Number.isInteger(payload.trial_days) || payload.trial_days < 0) {
          toast.error("Trial days must be an integer ≥ 0");
          setSaving(false);
          return;
        }
      }
      if (planType === "fee-per-booking" || planType === "both") {
        if (typeof payload.commission_percent !== "number" || payload.commission_percent < 0 || payload.commission_percent > 100) {
          toast.error("Commission percent must be between 0 and 100");
          setSaving(false);
          return;
        }
      }
      if (isEditMode) {
        await updatePackagePlan(editId, payload);
        toast.success("Plan updated");
      } else {
        await createPackagePlan(payload);
        toast.success("Plan created");
      }
      router.push("/admin/package/plan");
    } catch (e) {
      toast.error(e?.message || "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Package Plan Management</h1>
          <div className="text-14 text-light-1 lh-14">
            Manage and monitor all package plans across the platform.
          </div>
        </div>
      </div>

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
        <h1 className="text-22 lh-14 fw-600">{isEditMode ? "Edit Package" : "Add New Package"}</h1>
        {loading && (
          <div className="text-14 text-light-1 mb-10">Loading plan data...</div>
        )}
        <div className="row y-gap-15 x-gap-15">
          <FormInput
            label="Package Name"
            placeholder="Enter package name"
            gridClass="col-sm-6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormInput
            label="Package Description"
            placeholder="Enter package description"
            gridClass="col-sm-6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />


          <div className="col-sm-6 mt-5">
            <h1 className="text-14 fw-500 lh-14">Plan Type</h1>
            <select
              className="form-select border-light rounded-8 h-45 mt-5 px-15"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="subscription">Subscription</option>
              <option value="fee-per-booking">Fee per Booking</option>
              <option value="both">Both</option>
            </select>
          </div>

          {(planType === "subscription" || planType === "both") && (
            <>
              <FormInput
                type="number"
                step="0.01"
                label="Price($)"
                tooltip="Package price currency is set from System Setting"
                placeholder="Enter price"
                gridClass="col-sm-6"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <div className="col-sm-6 mt-5">
                <h1 className="text-14 fw-500 lh-14">Package Duration Unit</h1>
                <select className="form-select border-light rounded-8 h-40 mt-10 px-15" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="quarters">Quarters</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div className="col-sm-6 mt-5">
                <h1 className="text-14 fw-500 lh-14">Duration Value</h1>
                <select className="form-select border-light rounded-8 h-40 mt-10 px-15" value={durationValue} onChange={(e) => setDurationValue(e.target.value)}>
                  {Array(10)
                    .fill(null)
                    .map((_, index) => (
                      <option value={index + 1} key={index}>
                        {index + 1}
                      </option>
                    ))}
                </select>
              </div>

              <FormInput
                type="number"
                step="1"
                label="Trial Days"
                placeholder="Enter trial days"
                gridClass="col-sm-6"
                value={trialDays}
                onChange={(e) => setTrialDays(e.target.value)}
              />
            </>
          )}

          {(planType === "fee-per-booking" || planType === "both") && (
            <FormInput
              type="number"
              step="0.01"
              label="Commission Percent (%)"
              placeholder="Enter commission percent"
              gridClass="col-sm-6"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
            />
          )}

          <FormInput
            type="number"
            step="1"
            label="Sort Order"
            placeholder="i.e. 1"
            value={sortOrder}
            gridClass="col-sm-6"
            onChange={(e) => setSortOrder(e.target.value)}
          />


          <div className="col-12">
            <label className="text-14 fw-500">Feature</label>
            <div className="d-flex gap-2 mt-5">
              <input
                className="form-control border-light rounded-8"
                placeholder="Enter a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <button
                type="button"
                className="button bg-blue-1 text-white px-15 rounded-8"
                onClick={addFeature}
              >
                +
              </button>
            </div>
            {features.length > 0 && (
              <div className="mt-10">
                {features.map((f, idx) => (
                  <div
                    key={idx}
                    className="d-flex items-center text-14 gap-2 mt-5"
                    onMouseEnter={() => setHoverFeatureIdx(idx)}
                    onMouseLeave={() => setHoverFeatureIdx(-1)}
                  >
                    {hoverFeatureIdx === idx ? (
                      <CancelIcon
                        sx={{ color: red[500], fontSize: 18, cursor: "pointer" }}
                        onClick={() => removeFeatureAt(idx)}
                        titleAccess="Remove feature"
                      />
                    ) : (
                      <CheckIcon sx={{ color: green[400], fontSize: 16 }} />
                    )}
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-12"></div>

          <div className="col-sm-auto mt-5 d-flex gap-2 items-center">
            <Checkbox className="px-0 py-0" checked={isPopular} onClick={() => setIsPopular(!isPopular)} />
            <div className="text-14 fw-500 lh-14">Mark package as Popular</div>
          </div>

          <div className="col-12"></div>
          <div className="col-sm-2 mt-5 d-flex gap-2 items-center">
            <Checkbox
              className="px-0 py-0"
              checked={isActive}
              onClick={() => setIsActive(!isActive)}
            />
            <div className="text-14 fw-500 lh-14">Is Active</div>
          </div>
          {/* No vendor/ERP linkage fields in current DB schema */}

          <div className="col-12 d-flex justify-end gap-2">
            <button
              className="text-14 border-light rounded-8 px-15 py-5"
              onClick={() => router.push("/admin/package/plan")}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-5"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
