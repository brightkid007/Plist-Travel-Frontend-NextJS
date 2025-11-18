"use client";

import { useState, useEffect } from "react";
import { Checkbox, Radio } from "@mui/material";
import { getRatePlans } from "@/helpers/backend_helper";

const RatePlan = ({ formData, ratePlans, onInputChange, onLoadRatePlans }) => {
    const [allRatePlans, setAllRatePlans] = useState([]);
    const fetchRatePlans = async () => {
        const response = await getRatePlans();
        setAllRatePlans(response?.rate_plans || []);
    };

    useEffect(() => {
        fetchRatePlans();
    }, []);

    const [ratePlanType, setRatePlanType] = useState("new");
    const [syncRoomStatus, setSyncRoomStatus] = useState(true);
    const [syncRates, setSyncRates] = useState(true);
    const [priceAdjustment, setPriceAdjustment] = useState("more");
    const [adjustmentValue, setAdjustmentValue] = useState(5);
    const handleRatePlanTypeChange = (event) => {
        setRatePlanType(event.target.value);
    };

    return (
        <>
            <div className="d-flex items-center">
                <Radio
                    checked={ratePlanType === "new"}
                    onChange={handleRatePlanTypeChange}
                    value="new"
                />
                <div className="text-14 lh-14 ml-5">Set up as a new rate plan</div>
            </div>
            <div className="d-flex items-center">
                <Radio
                    checked={ratePlanType === "exist"}
                    onChange={handleRatePlanTypeChange}
                    value="exist"
                />
                <div className="text-14 lh-14 ml-5">
                    Derive rates from an existing rate plan
                </div>
            </div>

            {ratePlanType === "exist" && (
                <div className="ml-40 bg-light-2 rounded-8 py-10 px-10">
                    <div className="text-14 mb-5">Which rate plan?</div>
                    <select className="border-light form-select rounded-8 bg-white px-10 h-50 w-full">
                        <option value="">Select rate plan</option>
                        {allRatePlans.map((ratePlan) => (
                            <option key={ratePlan.id} value={ratePlan.id}>
                                {ratePlan.title}
                            </option>
                        ))}
                    </select>
                    <div className="text-14 mt-5 mb-5">
                        What kind of data would you like to synchronize for the rate plan?
                    </div>
                    <div className="d-flex items-center">
                        <Checkbox
                            className="px-0 py-0"
                            checked={syncRoomStatus}
                            onChange={() => setSyncRoomStatus(!syncRoomStatus)}
                        />
                        <div className="text-14 lh-14 ml-5">Room status & restrictions</div>
                    </div>
                    <div className="d-flex items-center mt-5">
                        <Checkbox
                            className="px-0 py-0"
                            checked={syncRates}
                            onChange={() => setSyncRates(!syncRates)}
                        />
                        <div className="text-14 lh-14 ml-5">Rates</div>
                    </div>
                    <div className="text-14 mt-5 mb-5">
                        For this rate plan, you want it to be cheaper or more expensive than
                        breakfast-excluded+Flexible-until 1 day before arrival(prepay)?
                    </div>
                    <div className="d-flex items-center">
                        <Radio
                            className="px-0 py-0"
                            name="price-adjustment"
                            value="cheaper"
                            checked={priceAdjustment === "cheaper"}
                            onChange={() => setPriceAdjustment("cheaper")}
                        />
                        <div className="text-14 lh-14 ml-5">
                            Cheaper than breakfast-excluded+Flexible-until 1 day before
                            arrival(prepay)
                        </div>
                    </div>

                    <div className="d-flex items-center mt-5">
                        <Radio
                            className="px-0 py-0"
                            name="price-adjustment"
                            value="more"
                            checked={priceAdjustment === "more"}
                            onChange={() => setPriceAdjustment("more")}
                        />
                        <div className="text-14 lh-14 ml-5">
                            More expensive than breakfast-excluded+Flexible-until 1 day before
                            arrival(prepay)
                        </div>
                    </div>

                    {/* Adjustment Value Input */}
                    <div className="d-flex items-center mt-10 mb-10 pl-30">
                        <div className="w-180">
                            <input
                                type="number"
                                className="px-15 h-50 bg-white border-light rounded-8"
                                value={adjustmentValue}
                                onChange={(e) =>
                                    setAdjustmentValue(parseInt(e.target.value)) || 0
                                }
                                min="0"
                            />
                        </div>
                        <select className="bg-white border-light rounded-8 h-50 px-15 w-140">
                            <option value="percent">%</option>
                            <option value="dollar">$</option>
                        </select>
                    </div>

                    {/* Summary */}
                    <div
                        className="ml-30 text-14 lh-14 bg-light-3 px-20 py-10 rounded-8"
                        style={{ display: "inline-block" }}
                    >
                        Rate: {adjustmentValue}%{" "}
                        {priceAdjustment === "more" ? "More expensive" : "Cheaper"} than
                        breakfast-excluded+Flexible-until 1 day before arrival(prepay) 😊
                    </div>
                </div>
            )}
        </>
    );
};

export default RatePlan;

