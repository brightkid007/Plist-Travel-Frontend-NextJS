"use client";

import { useState } from "react";
import { Radio, Dialog } from "@mui/material";
import { toast } from "react-toastify";
import { createCancellationPolicy } from "@/helpers/backend_helper";

const CancellationPolicy = ({
  showModal,
  setShowModal,
  policies = [],
  selectedPolicy,
  onSelectPolicy,
  onCreatePolicy,
}) => {
  const handleClose = () => {
    setShowModal(false);
  };
  const [policyName, setPolicyName] = useState("");
  const [cancelAbility, setCancelAbility] = useState(false);
  const [cancellationPeriod, setCancellationPeriod] = useState("1 day");
  const [postpayGuarantee, setPostpayGuarantee] = useState("100%");

  return (
    <>
      {policies.length === 0 ? (
        <div className="text-14 text-light-1">
          No cancellation policies available. Create one below.
        </div>
      ) : (
        policies.map((policy) => (
          <div className="d-flex items-center" key={policy.id}>
            <Radio
              checked={selectedPolicy === policy.id}
              onClick={() => onSelectPolicy(policy.id)}
            />
            <div className="text-14 lh-14 ml-5">{policy.name || policy.title}</div>
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
                onChange={(event) => setCancellationPeriod(event.target.value)}
              >
                <option value="1 day">
                  23:59 on the day 1 day prior to check-in
                </option>
                <option value="2 days">
                  23:59 on the day 2 days prior to check-in
                </option>
              </select>

              <div className="text-14 fw-500 lh-14 mt-10">
                How much money will be deducted if the guest cancels after the
                free cancellation period?
              </div>
              <select
                className="form-select px-10 py-10 w-full text-14 mt-5"
                onChange={(event) => setPostpayGuarantee(event.target.value)}
              >
                <option value="100%">100% of the total rate</option>
                <option value="80%">80% of the total rate</option>
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
                  {cancellationPeriod} before check-in
                </div>
                <div className="text-12 lh-14 mt-5">
                  &middot; If the reservation is canceled after 23:59,{" "}
                  {cancellationPeriod} before check-in, {postpayGuarantee} of
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
                Guests can't cancel for free.
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
              onClick={async () => {
                if (!policyName) {
                  toast.error("Please enter a policy name");
                  return;
                }
                const penaltyPercent = postpayGuarantee === "100%" ? 100 : 80;
                const freePeriod =
                  cancellationPeriod === "1 day" ? "1_day_before" : "2_days_before";
                await onCreatePolicy({
                  name: policyName,
                  allows_free_cancellation: cancelAbility,
                  free_cancellation_period: cancelAbility ? freePeriod : null,
                  penalty_percentage: cancelAbility ? penaltyPercent : 100,
                });
                setPolicyName("");
                setCancelAbility(false);
                setCancellationPeriod("1 day");
                setPostpayGuarantee("100%");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CancellationPolicy;

