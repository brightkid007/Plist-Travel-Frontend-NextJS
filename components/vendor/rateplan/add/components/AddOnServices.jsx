"use client";

import { useState, useEffect } from "react";
import { getAddOnServices } from "@/helpers/backend_helper";

import { Radio } from "@mui/material";

const AddOnServices = ({ includesAddOns, onIncludesAddOnsChange, selectedAddOnServiceId, onAddOnServiceIdChange }) => {
  const [addOnServices, setAddOnServices] = useState([]);

  const fetchAddOnServices = async () => {
    const response = await getAddOnServices();
    setAddOnServices(response?.data || response || []);
  };

  useEffect(() => {
    fetchAddOnServices();
  }, []);

  const handleAddOnServiceChange = (e) => {
    const selectedId = e.target.value ? parseInt(e.target.value) : null;
    if (onAddOnServiceIdChange) {
      onAddOnServiceIdChange(selectedId);
    }
  };

  return (
    <>
      <div className="d-flex items-center">
        <Radio
          checked={!includesAddOns}
          onChange={() => onIncludesAddOnsChange(false)}
          value="no"
        />
        <div className="text-14 lh-14 ml-5">No</div>
      </div>
      <div className="d-flex items-center">
        <Radio
          checked={includesAddOns}
          onChange={() => onIncludesAddOnsChange(true)}
          value="yes"
        />
        <div className="text-14 lh-14 ml-5">Yes</div>
      </div>
      {includesAddOns && (
        <div className="ml-40 mt-10">
          <select
            className="border-light form-select rounded-8 bg-white px-10 h-50 w-full"
            value={selectedAddOnServiceId || ""}
            onChange={handleAddOnServiceChange}
          >
            <option value="">Select add-on service</option>
            {addOnServices.map((addOnService) => (
              <option key={addOnService.id} value={addOnService.id}>
                {addOnService.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default AddOnServices;

