import { Add, Remove } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import React from "react";

const ListingPrice = ({ data, onUpdate }) => {
  const basePricesByDayOfWeek = data?.base_prices_by_day_of_week || false;
  const additionalPricesByGuests = data?.additional_prices_by_guests || false;
  const ticketPrices = data?.ticket_prices || [{ category: "", price: "" }];
  const basePricesByDay = data?.base_prices_by_day || {};
  const guestPrices = data?.guest_prices || [{ guest_start: "", guest_end: "", price: "" }];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleFieldChange = (field, value) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        [field]: value
      });
    }
  };

  const handleTicketPriceChange = (index, field, value) => {
    const updatedPrices = [...ticketPrices];
    if (!updatedPrices[index]) {
      updatedPrices[index] = { category: "", price: "" };
    }
    updatedPrices[index][field] = field === "price" ? parseFloat(value) || "" : value;
    handleFieldChange("ticket_prices", updatedPrices);
  };

  const handleAddTicketPrice = () => {
    handleFieldChange("ticket_prices", [...ticketPrices, { category: "", price: "" }]);
  };

  const handleRemoveTicketPrice = (index) => {
    const updatedPrices = ticketPrices.filter((_, idx) => idx !== index);
    handleFieldChange("ticket_prices", updatedPrices.length > 0 ? updatedPrices : [{ category: "", price: "" }]);
  };

  const handleDayPriceChange = (day, value) => {
    handleFieldChange("base_prices_by_day", {
      ...basePricesByDay,
      [day.toLowerCase()]: parseFloat(value) || null
    });
  };

  const handleGuestPriceChange = (index, field, value) => {
    const updatedPrices = [...guestPrices];
    if (!updatedPrices[index]) {
      updatedPrices[index] = { guest_start: "", guest_end: "", price: "" };
    }
    updatedPrices[index][field] = field === "price" ? parseFloat(value) || "" : (parseInt(value) || "");
    handleFieldChange("guest_prices", updatedPrices);
  };

  const handleAddGuestPrice = () => {
    handleFieldChange("guest_prices", [...guestPrices, { guest_start: "", guest_end: "", price: "" }]);
  };

  const handleRemoveGuestPrice = (index) => {
    const updatedPrices = guestPrices.filter((_, idx) => idx !== index);
    handleFieldChange("guest_prices", updatedPrices.length > 0 ? updatedPrices : [{ guest_start: "", guest_end: "", price: "" }]);
  };

  return (
    <div className="row y-gap-10 x-gap-20">
      <div className="col-12 d-flex items-center justify-between">
        <h1 className="text-20 lh-14 fw-600">Ticket Price</h1>
        <div className="d-flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRemoveTicketPrice(ticketPrices.length - 1)}
            disabled={ticketPrices.length <= 1}
            className="cursor-pointer"
          >
            <Remove className="px-0 py-0" />
          </button>
          <span className="text-14">{ticketPrices.length}</span>
          <button
            type="button"
            onClick={handleAddTicketPrice}
            className="cursor-pointer"
          >
            <Add className="px-0 py-0" />
          </button>
        </div>
      </div>
      {ticketPrices.map((ticket, index) => (
        <React.Fragment key={index}>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Ticket Price Category <span className="text-red-1">*</span></h1>
            <select 
              className="form-select w-full border-light rounded-8 h-50 mt-10"
              value={ticket.category || ""}
              onChange={(e) => handleTicketPriceChange(index, "category", e.target.value)}
            >
              <option value="">Select category</option>
              <option value="General Admission">General Admission</option>
              <option value="VIP">VIP</option>
              <option value="Premium">Premium</option>
              <option value="Early Bird">Early Bird</option>
            </select>
          </div>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Price <span className="text-red-1">*</span></h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full h-50 mt-10"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              value={ticket.price || ""}
              onChange={(e) => handleTicketPriceChange(index, "price", e.target.value)}
            />
          </div>
        </React.Fragment>
      ))}

      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          checked={basePricesByDayOfWeek}
          onChange={(e) => handleFieldChange("base_prices_by_day_of_week", e.target.checked)}
        />
        <span className="text-16 fw-400 lh-1">Base Prices by Day of Week</span>
      </div>
      {basePricesByDayOfWeek &&
        weekDays.map((day) => (
          <div key={day} className="col-sm-6 mt-5">
            <h1 className="text-14 lh-1 fw-500">{day} Price</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="number"
              min="0"
              step="0.01"
              placeholder={`Enter ${day} Price`}
              value={basePricesByDay[day.toLowerCase()] || ""}
              onChange={(e) => handleDayPriceChange(day, e.target.value)}
            />
          </div>
        ))}
      <div className="col-12 mt-5 d-flex items-center">
        <Checkbox
          checked={additionalPricesByGuests}
          onChange={(e) => handleFieldChange("additional_prices_by_guests", e.target.checked)}
        />
        <span className="text-16 fw-400 lh-1">
          Additional Base Prices by Number of Guests
        </span>
        {additionalPricesByGuests && (
          <div className="d-flex items-center gap-2 ml-10">
            <button
              type="button"
              onClick={() => handleRemoveGuestPrice(guestPrices.length - 1)}
              disabled={guestPrices.length <= 1}
              className="cursor-pointer"
            >
              <Remove />
            </button>
            <span className="text-14">{guestPrices.length}</span>
            <button
              type="button"
              onClick={handleAddGuestPrice}
              className="cursor-pointer"
            >
              <Add />
            </button>
          </div>
        )}
      </div>
      {additionalPricesByGuests &&
        guestPrices.map((guestPrice, index) => (
          <React.Fragment key={index}>
            <div className="col-md-4 mt-5">
              <h1 className="text-14 lh-1 fw-500">
                Number of Guest Start Range <span className="text-red-1">*</span>
              </h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                min="1"
                step="1"
                placeholder={1 + index * 20}
                value={guestPrice.guest_start || ""}
                onChange={(e) => handleGuestPriceChange(index, "guest_start", e.target.value)}
              />
            </div>
            <div className="col-md-4 mt-5">
              <h1 className="text-14 lh-1 fw-500">
                Number of Guest End Range <span className="text-red-1">*</span>
              </h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                min="1"
                step="1"
                placeholder={20 + index * 20}
                value={guestPrice.guest_end || ""}
                onChange={(e) => handleGuestPriceChange(index, "guest_end", e.target.value)}
              />
            </div>
            <div className="col-md-4 mt-5">
              <h1 className="text-14 lh-1 fw-500">Guests Price <span className="text-red-1">*</span></h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="number"
                min="0"
                step="0.01"
                placeholder={`$${100 + index * 20}`}
                value={guestPrice.price || ""}
                onChange={(e) => handleGuestPriceChange(index, "price", e.target.value)}
              />
            </div>
          </React.Fragment>
        ))}
    </div>
  );
};

export default ListingPrice;
