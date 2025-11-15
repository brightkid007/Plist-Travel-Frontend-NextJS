import { Dialog, Radio } from "@mui/material";
import { useState, useEffect } from "react";
import { getCancellationPolicies, createCancellationPolicy } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const CancellationPolicy = ({ listingId, selectedPolicyId, onPolicyChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [cancelAbility, setCancelAbility] = useState(false);
  const [cancellationPeriod, setCancellationPeriod] = useState("1_day_before");
  const [penaltyPercentage, setPenaltyPercentage] = useState(100);

  // Load cancellation policies from backend
  useEffect(() => {
    if (listingId) {
      loadCancellationPolicies();
    } else {
      setPolicies([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const loadCancellationPolicies = async () => {
    if (!listingId) return;

    try {
      setLoading(true);
      const response = await getCancellationPolicies({ listing_id: listingId, is_active: true });
      const policiesData = response?.data || response || [];
      setPolicies(Array.isArray(policiesData) ? policiesData : []);
    } catch (error) {
      console.error("Error loading cancellation policies:", error);
      toast.error(error?.message || "Failed to load cancellation policies");
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPolicyName("");
    setCancelAbility(false);
    setCancellationPeriod("1_day_before");
    setPenaltyPercentage(100);
  };

  const handleSavePolicy = async () => {
    if (!policyName.trim()) {
      toast.error("Please enter a cancellation policy name");
      return;
    }

    if (!listingId) {
      toast.error("Please select a property first");
      return;
    }

    try {
      setLoading(true);
      const policyData = {
        listing_id: listingId,
        name: policyName.trim(),
        allows_free_cancellation: cancelAbility,
        free_cancellation_period: cancelAbility ? cancellationPeriod : null,
        penalty_percentage: cancelAbility ? penaltyPercentage : 100,
      };

      const response = await createCancellationPolicy(policyData);
      const newPolicy = response?.data || response;
      
      // Reload policies
      await loadCancellationPolicies();
      
      // Select the newly created policy
      if (newPolicy?.id && onPolicyChange) {
        onPolicyChange(newPolicy.id);
      }

      toast.success("Cancellation policy created successfully!");
      handleClose();
    } catch (error) {
      console.error("Error creating cancellation policy:", error);
      toast.error(error?.message || "Failed to create cancellation policy");
    } finally {
      setLoading(false);
    }
  };

  const formatPolicyName = (policy) => {
    if (!policy.allows_free_cancellation) {
      return `${policy.name} (No free cancellation)`;
    }
    
    const periodMap = {
      same_day: "same day",
      "1_day_before": "1 day",
      "2_days_before": "2 days",
      "3_days_before": "3 days",
      "7_days_before": "7 days",
      "14_days_before": "14 days",
      "30_days_before": "30 days",
    };
    
    const period = periodMap[policy.free_cancellation_period] || "1 day";
    return `${policy.name} (Free cancellation until ${period} before arrival)`;
  };

  return (
    <>
      <div className="text-12 text-light-1 lh-14">
        If there is no suitable cancellation policy for you, you can
        <span
          className="text-blue-1 ml-5 cursor-pointer underline"
          onClick={() => setShowModal(true)}
        >
          create new
        </span>
      </div>
      {loading && policies.length === 0 ? (
        <div className="text-14 text-light-1 mt-10">Loading cancellation policies...</div>
      ) : policies.length === 0 ? (
        <div className="text-14 text-light-1 mt-10">No cancellation policies available. Create one to get started.</div>
      ) : (
        policies.map((policy) => (
          <div className="d-flex items-center gap-2 mt-5" key={policy.id}>
            <Radio
              checked={selectedPolicyId === policy.id}
              onClick={() => onPolicyChange && onPolicyChange(policy.id)}
              className="px-0 py-0"
            />
            <div className="text-14 lh-14">{formatPolicyName(policy)}</div>
          </div>
        ))
      )}
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
      >
        <div className="px-20 py-20" style={{ width: "500px" }}>
          <h1 className="text-20 fw-500 mb-10">Cancellation Policy</h1>
          <div className="text-12 text-light-1 lh-14 mb-10">
            Cancellation time is calculated from 23:59 (local time zone) on the
            check-in date. If the check-in date is May 20, 2025, and guests can
            apply free cancellation 1 day before the check-in date, then guests
            can cancel the reservation for free before 23:59 2025-5-19.
          </div>

          <div className="text-14 fw-500 mt-10">
            Can the guest cancel for free within certain period?
          </div>
          <div className="d-flex items-center mt-5">
            <Radio
              checked={!cancelAbility}
              className="px-0 py-0"
              onClick={() => setCancelAbility(false)}
            />
            <div className="text-14 lh-14 ml-5">No</div>
          </div>
          <div className="d-flex items-center mt-5">
            <Radio
              checked={cancelAbility}
              className="px-0 py-0"
              onClick={() => setCancelAbility(true)}
            />
            <div className="text-14 lh-14 ml-5">Yes</div>
          </div>

          {cancelAbility && (
            <>
              <div className="text-14 fw-500 mt-10">
                How long in advance can the guest cancel for free?
              </div>
              <select
                className="form-select px-10 py-10 w-full text-14 mt-5"
                value={cancellationPeriod}
                onChange={(event) => setCancellationPeriod(event.target.value)}
              >
                <option value="same_day">23:59 on the same day as check-in</option>
                <option value="1_day_before">23:59 on the day 1 day prior to check-in</option>
                <option value="2_days_before">23:59 on the day 2 days prior to check-in</option>
                <option value="3_days_before">23:59 on the day 3 days prior to check-in</option>
                <option value="7_days_before">23:59 on the day 7 days prior to check-in</option>
                <option value="14_days_before">23:59 on the day 14 days prior to check-in</option>
                <option value="30_days_before">23:59 on the day 30 days prior to check-in</option>
              </select>

              <div className="text-14 fw-500 lh-14 mt-10">
                How much money will be deducted if the guest cancels after the
                free cancellation period?
              </div>
              <select
                className="form-select px-10 py-10 w-full text-14 mt-5"
                value={penaltyPercentage}
                onChange={(event) => setPenaltyPercentage(parseFloat(event.target.value))}
              >
                <option value={100}>100% of the total rate</option>
                <option value={80}>80% of the total rate</option>
                <option value={50}>50% of the total rate</option>
                <option value={25}>25% of the total rate</option>
                <option value={0}>0% of the total rate</option>
              </select>
              <div className="text-12 text-light-1 lh-14 mt-5">
                For postpay rate plans, the guarantee must be processed in
                accordance with the cancellation policy
              </div>
            </>
          )}

          <div className="text-14 fw-500 lh-14 mt-10">
            Cancellation Policy Name
          </div>
          <input
            className="text-14 border-light rounded-8 bg-white px-10 py-5 mt-5"
            placeholder="Enter cancellation policy name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
          />

          <div className="bg-light-2 rounded-8 py-10 px-15 mt-10 mb-10">
            <div className="text-14 fw-500 lh-14">Preview</div>
            <div className="text-12 fw-500 lh-14 mt-5">Cancellation Policy</div>
            {cancelAbility ? (
              <>
                <div className="text-12 lh-14 mt-5">
                  &middot; The reservation can be canceled for free until 23:59,{" "}
                  {cancellationPeriod.replace(/_/g, " ")} before check-in
                </div>
                <div className="text-12 lh-14 mt-5">
                  &middot; If the reservation is canceled after 23:59,{" "}
                  {cancellationPeriod.replace(/_/g, " ")} before check-in, {penaltyPercentage}% of
                  the booking total will be charged
                </div>
                <div className="text-12 fw-500 lh-14 mt-5">
                  Post pay guarantee policy (pre-pay rate plans can ignore)
                </div>
                <div className="text-12 lh-14 mt-5">
                  &middot; For postpay rate plans, the guarantee must be
                  processed in accordance with the cancellation policy
                </div>
                <div className="text-12 fw-500 lh-14 mt-5">No show</div>
                <div className="text-12 lh-14 mt-5">
                  &middot; If the guest is a no show, they will be charged in
                  accordance with the cancellation policy.
                </div>
              </>
            ) : (
              <div className="text-12 lh-14 mt-5">
                Guests can't cancel for free. {penaltyPercentage}% of the booking total will be charged for any cancellation.
              </div>
            )}
          </div>

          <div className="d-flex justify-end gap-2">
            <button
              className="text-14 border-light rounded-8 px-10 py-5"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
              onClick={handleSavePolicy}
              disabled={loading || !policyName.trim()}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CancellationPolicy;