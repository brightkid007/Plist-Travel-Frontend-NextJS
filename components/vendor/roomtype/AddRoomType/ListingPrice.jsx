import { Checkbox } from "@mui/material";

const ListingPrice = ({ roomTypeData, updateRoomTypeData }) => {
  const basePricesByDayOfWeek = !!roomTypeData?.base_prices_by_day && Object.keys(roomTypeData.base_prices_by_day).length > 0;
  const additionalPricesByGuests = !!roomTypeData?.additional_prices_by_guests && Object.keys(roomTypeData.additional_prices_by_guests).length > 0;
  const guests = additionalPricesByGuests ? Object.keys(roomTypeData.additional_prices_by_guests).length : 1;
  
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return (
    <div className="row y-gap-10 x-gap-20">
      <h1 className="text-20 lh-14 fw-600">Listing Price</h1>
      <div className="col-md-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Base Price</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter base price"
          value={roomTypeData?.base_price || ""}
          onChange={(e) => updateRoomTypeData({ base_price: e.target.value })}
        />
        <div className="text-12 text-light-1 lh-1 mt-5">
          Enter the base price for this room type.
        </div>
      </div>
      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          checked={basePricesByDayOfWeek}
          onChange={(e) => {
            if (e.target.checked) {
              const initialPrices = {};
              dayKeys.forEach(key => {
                initialPrices[key] = "";
              });
              updateRoomTypeData({ base_prices_by_day: initialPrices });
            } else {
              updateRoomTypeData({ base_prices_by_day: {} });
            }
          }}
        />
        <span className="text-16 fw-400 lh-1">Base Prices by Day of Week</span>
      </div>
      {basePricesByDayOfWeek &&
        weekDays.map((day, index) => {
          const dayKey = dayKeys[index];
          return (
            <div className="col-sm-6 mt-5" key={day}>
              <h1 className="text-14 lh-1 fw-500">{day} Price</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                step={0.01}
                placeholder={`Enter ${day} Price`}
                value={roomTypeData?.base_prices_by_day?.[dayKey] || ""}
                onChange={(e) => {
                  const newPrices = { ...(roomTypeData?.base_prices_by_day || {}) };
                  newPrices[dayKey] = e.target.value;
                  updateRoomTypeData({ base_prices_by_day: newPrices });
                }}
              />
            </div>
          );
        })}
      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          checked={additionalPricesByGuests}
          onChange={(e) => {
            if (e.target.checked) {
              const initialPrices = { 1: "" };
              updateRoomTypeData({ additional_prices_by_guests: initialPrices });
            } else {
              updateRoomTypeData({ additional_prices_by_guests: {} });
            }
          }}
        />
        <span className="text-16 fw-400 lh-1">
          Additional Base Prices by Number of Guests
        </span>
        {additionalPricesByGuests && (
          <>
            <span
              className="material-symbols-outlined cursor-pointer ml-10"
              onClick={() => {
                if (guests > 1) {
                  const newPrices = { ...(roomTypeData?.additional_prices_by_guests || {}) };
                  delete newPrices[guests];
                  updateRoomTypeData({ additional_prices_by_guests: newPrices });
                }
              }}
            >
              remove
            </span>
            <span
              className="material-symbols-outlined cursor-pointer"
              onClick={() => {
                const newPrices = { ...(roomTypeData?.additional_prices_by_guests || {}) };
                newPrices[guests + 1] = "";
                updateRoomTypeData({ additional_prices_by_guests: newPrices });
              }}
            >
              add
            </span>
          </>
        )}
      </div>
      {additionalPricesByGuests &&
        Object.keys(roomTypeData?.additional_prices_by_guests || {})
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((guestCount) => (
            <div className="col-md-6 mt-5" key={guestCount}>
              <h1 className="text-14 lh-1 fw-500">{guestCount} Guest{parseInt(guestCount) > 1 ? 's' : ''} Price</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                step={0.01}
                placeholder={`$${100 + (parseInt(guestCount) - 1) * 20}`}
                value={roomTypeData?.additional_prices_by_guests?.[guestCount] || ""}
                onChange={(e) => {
                  const newPrices = { ...(roomTypeData?.additional_prices_by_guests || {}) };
                  newPrices[guestCount] = e.target.value;
                  updateRoomTypeData({ additional_prices_by_guests: newPrices });
                }}
              />
            </div>
          ))}
    </div>
  );
};

export default ListingPrice;

