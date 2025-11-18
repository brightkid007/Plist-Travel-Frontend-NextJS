"use client";

import { Checkbox, Radio } from "@mui/material";
import MinLengthStay from "./MinLengthStay";
import { useState, useEffect } from "react";

const ReservationRestrictions = ({ formData, onInputChange }) => {
    // Determine if restrictions are enabled based on formData
    const [hasRestrictions, setHasRestrictions] = useState(formData.restrict_res_time_enabled || formData.restrict_los_enabled ||
        formData.sell_on_website_only || formData.only_for_b2b ||
        formData.bundle_only || formData.ticket_holder_exclusive ? "yes" : "no");

    const [reservationTime, setReservationTime] = useState(formData.restrict_res_time_enabled || false);
    const [lengthOfStay, setLengthOfStay] = useState(formData.restrict_los_enabled || false);
    const [exclusiveChannel, setExclusiveChannel] = useState(
        formData.only_for_b2b ? "tripBiz" :
            formData.bundle_only ? "bundle" :
                formData.ticket_holder_exclusive ? "ticket" : "none"
    );
    const [reservation, setReservation] = useState(formData.min_reservation_days || 0);
    const [lengthOfStayValue, setLengthOfStayValue] = useState(formData.min_stay || 0);

    // Sync local state when formData changes (for edit mode)
    useEffect(() => {
        setReservationTime(formData.restrict_res_time_enabled || false);
        setLengthOfStay(formData.restrict_los_enabled || false);
        setExclusiveChannel(
            formData.only_for_b2b ? "tripBiz" :
                formData.bundle_only ? "bundle" :
                    formData.ticket_holder_exclusive ? "ticket" : "none"
        );
        setReservation(formData.min_reservation_days || 0);
        setLengthOfStayValue(formData.min_stay || 0);
    }, [formData.restrict_res_time_enabled, formData.restrict_los_enabled, formData.only_for_b2b,
    formData.bundle_only, formData.ticket_holder_exclusive, formData.min_reservation_days, formData.min_stay]);

    const handleRestrictionChange = (event) => {
        const value = event.target.value;
        if (value === "no") {
            // Clear all restrictions
            onInputChange("restrict_res_time_enabled", false);
            onInputChange("restrict_los_enabled", false);
            onInputChange("sell_on_website_only", false);
            onInputChange("only_for_b2b", false);
            onInputChange("bundle_only", false);
            onInputChange("ticket_holder_exclusive", false);
            onInputChange("min_reservation_days", null);
            onInputChange("max_reservation_days", null);
            setReservationTime(false);
            setLengthOfStay(false);
            setExclusiveChannel("none");
            setReservation(0);
            setLengthOfStayValue(0);
        }
        else {
            setHasRestrictions("yes");
        }
    };

    return (
        <>
            <div className="d-flex items-center">
                <Radio
                    checked={hasRestrictions === "no"}
                    onChange={handleRestrictionChange}
                    value="no"
                />
                <div className="text-14 lh-14 ml-5">No</div>
            </div>
            <div className="d-flex items-center">
                <Radio
                    checked={hasRestrictions === "yes"}
                    onChange={handleRestrictionChange}
                    value="yes"
                />
                <div className="text-14 lh-14 ml-5">Yes</div>
            </div>

            {hasRestrictions === "yes" && (
                <div className="ml-40 bg-light-2 rounded-8 py-10 px-10">
                    {/* Reservation Time Restrictions */}
                    <div className="d-flex items-center">
                        <Checkbox
                            className="px-0 py-0"
                            checked={reservationTime}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setReservationTime(checked);
                                onInputChange("restrict_res_time_enabled", checked);
                                if (!checked) {
                                    onInputChange("min_reservation_days", null);
                                    onInputChange("max_reservation_days", null);
                                    setReservation(0);
                                }
                            }}
                        />
                        <div className="text-14 lh-14 ml-5">
                            Restrictions on reservation time
                        </div>
                    </div>

                    {reservationTime && (
                        <div className="mt-5 pl-30">
                            <div className="text-12 mb-5">Minimum days</div>
                            <div className="w-210">
                                <input
                                    type="number"
                                    onChange={(event) => {
                                        const value = parseInt(event.target.value) || 0;
                                        setReservation(value);
                                        onInputChange("min_reservation_days", value > 0 ? value : null);
                                    }}
                                    className="bg-white border-light rounded-8 px-10 py-5"
                                    value={reservation}
                                    min="0"
                                />
                            </div>
                            <div className="text-12 text-light-1 lh-14 mt-5">
                                {reservation} day(s) and more
                            </div>
                        </div>
                    )}

                    {/* Length of Stay Restrictions */}
                    <div className="d-flex items-center mt-5">
                        <Checkbox
                            className="px-0 py-0"
                            checked={lengthOfStay}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setLengthOfStay(checked);
                                onInputChange("restrict_los_enabled", checked);
                            }}
                        />
                        <div className="text-14 lh-14 ml-5">
                            Restrictions on length of stay
                        </div>
                    </div>

                    {lengthOfStay && (
                        <MinLengthStay
                            minStay={formData.min_stay}
                            maxStay={formData.max_stay}
                            onMinStayChange={(value) => {
                                setLengthOfStayValue(value || 0);
                                onInputChange("min_stay", value);
                            }}
                            onMaxStayChange={(value) => onInputChange("max_stay", value)}
                        />
                    )}

                    {/* Exclusive Channel Settings */}
                    <div className="mt-5 d-flex items-center">
                        <Checkbox
                            className="px-0 py-0"
                            checked={exclusiveChannel !== "none"}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                const newChannel = checked ? "tripBiz" : "none";
                                setExclusiveChannel(newChannel);
                                onInputChange("only_for_b2b", newChannel === "tripBiz");
                                onInputChange("bundle_only", false);
                                onInputChange("ticket_holder_exclusive", false);
                                onInputChange("sell_on_website_only", false);
                            }}
                        />
                        <div className="text-14 lh-14 ml-5">
                            Set as exclusive selling channel
                        </div>

                    </div>

                    {exclusiveChannel !== "none" && (
                        <div className="mt-5 pl-30">
                            <div className="d-flex items-center">
                                <Radio
                                    className="px-0 py-0"
                                    name="exclusive-channel"
                                    value="tripBiz"
                                    checked={exclusiveChannel === "tripBiz"}
                                    onChange={(e) => {
                                        setExclusiveChannel("tripBiz");
                                        onInputChange("only_for_b2b", true);
                                        onInputChange("bundle_only", false);
                                        onInputChange("ticket_holder_exclusive", false);
                                        onInputChange("sell_on_website_only", false);
                                    }}
                                />
                                <div className="text-14 lh-14 ml-5">Only for Trip Biz</div>
                            </div>
                            <div className="d-flex items-center mt-5">
                                <Radio
                                    className="px-0 py-0"
                                    name="exclusive-channel"
                                    value="bundle"
                                    checked={exclusiveChannel === "bundle"}
                                    onChange={(e) => {
                                        setExclusiveChannel("bundle");
                                        onInputChange("only_for_b2b", false);
                                        onInputChange("bundle_only", true);
                                        onInputChange("ticket_holder_exclusive", false);
                                        onInputChange("sell_on_website_only", false);
                                    }}
                                />
                                <div className="text-14 lh-14 ml-5">
                                    Bundle & save only (only for room+flight bundle, vacation
                                    bundle, etc.)
                                </div>
                            </div>
                            <div className="d-flex items-center mt-5">
                                <Radio
                                    className="px-0 py-0"
                                    name="exclusive-channel"
                                    value="ticket"
                                    checked={exclusiveChannel === "ticket"}
                                    onChange={(e) => {
                                        setExclusiveChannel("ticket");
                                        onInputChange("only_for_b2b", false);
                                        onInputChange("bundle_only", false);
                                        onInputChange("ticket_holder_exclusive", true);
                                        onInputChange("sell_on_website_only", false);
                                    }}
                                />
                                <div className="text-14 lh-14 ml-5">
                                    Ticket booker exclusive (only for the guests who have booked
                                    transportation or other ticket services recently)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ReservationRestrictions;

