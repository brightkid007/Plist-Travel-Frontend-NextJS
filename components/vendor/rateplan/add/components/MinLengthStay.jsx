"use client";

import { Checkbox } from "@mui/material";

const MinLengthStay = ({
  minStay,
  maxStay,
  onMinStayChange,
  onMaxStayChange,
}) => {
  const hasMaxStay = maxStay !== null && maxStay !== undefined;

  return (
    <div className="ml-20 mt-5">
      <div className="w-210">
        <input
          type="number"
          min="1"
          value={minStay || "1"}
          onChange={(event) =>
            onMinStayChange(
              event.target.value ? parseInt(event.target.value) : null
            )
          }
          className="border-light rounded-8 px-10 h-50 bg-white"
        />
      </div>
      <div className="d-flex items-center mt-5">
        <Checkbox
          className="px-0 py-0"
          checked={hasMaxStay}
          onChange={() => onMaxStayChange(hasMaxStay ? null : minStay || 1)}
        />
        <div className="text-14 lh-14 ml-5">Max. length of stay</div>
      </div>
      {hasMaxStay && (
        <div className="w-210 mt-5">
          <input
            type="number"
            min={minStay || 1}
            value={maxStay || ""}
            onChange={(event) =>
              onMaxStayChange(
                event.target.value ? parseInt(event.target.value) : null
              )
            }
            className="border-light rounded-8 px-10 h-50 bg-white"
          />
        </div>
      )}
    </div>
  );
};

export default MinLengthStay;

