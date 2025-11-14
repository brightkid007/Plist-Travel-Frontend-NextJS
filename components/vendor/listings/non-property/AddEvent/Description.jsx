import { useState, useEffect } from "react";
import StarRating from "../../common/StarRating";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Description = ({ data, categories = [], subcategories = [], onUpdate }) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    if (data?.category_id) {
      const filtered = subcategories.filter(
        (sub) => sub.listing_category_id === data.category_id
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [data?.category_id, subcategories]);

  const handleChange = (field, value) => {
    if (onUpdate) {
      onUpdate(field, value);
    }
  };

  // Convert string date to dayjs object for DateTimePicker
  const getDateTimeValue = () => {
    if (!data?.event_date_time) return null;
    if (dayjs.isDayjs(data.event_date_time)) return data.event_date_time;
    if (typeof data.event_date_time === 'string') {
      return dayjs(data.event_date_time);
    }
    return null;
  };

  const handleDateTimeChange = (newValue) => {
    if (newValue && dayjs.isDayjs(newValue)) {
      // Store as ISO string for backend compatibility
      handleChange("event_date_time", newValue.toISOString());
    } else {
      handleChange("event_date_time", null);
    }
  };

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Event Description</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Name <span className="text-red-1">*</span></h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter event name"
          value={data?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Date & Time <span className="text-red-1">*</span></h1>
        <div className="mt-10">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={getDateTimeValue()}
              onChange={handleDateTimeChange}
              slotProps={{
                textField: {
                  required: true,
                  sx: {
                    width: "100%",
                    "& .MuiPickersInputBase-root": { height: 45 },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Category <span className="text-red-1">*</span></h1>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={data?.category_id || ""}
          onChange={(e) => {
            const categoryId = e.target.value ? parseInt(e.target.value, 10) : null;
            handleChange("category_id", categoryId);
            if (onUpdate) {
              onUpdate("subcategory_id", null);
            }
          }}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Subcategory <span className="text-red-1">*</span></h1>
        <select
          className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10"
          value={data?.subcategory_id || ""}
          onChange={(e) => {
            const subcategoryId = e.target.value ? parseInt(e.target.value, 10) : null;
            handleChange("subcategory_id", subcategoryId);
          }}
          disabled={!data?.category_id}
          required
        >
          <option value="">Select subcategory</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Star Rating</h1>
        <div className="mt-10">
          <StarRating
            value={data?.star_rating || 0}
            onChange={(rating) => handleChange("star_rating", rating)}
          />
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Event Description</h1>
        <textarea
          rows={5}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Describe your event"
          value={data?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="col-12 px-10 mt-10">
        <div className="row border-light rounded-8 px-10 py-10 y-gap-10 x-gap-10">
          <h1 className="text-18 lh-12 fw-500">Organizer Contact Info</h1>

          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Email</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="email"
              placeholder="Enter Email"
              value={data?.contact_email || ""}
              onChange={(e) => handleChange("contact_email", e.target.value)}
            />
          </div>
          <div className="col-sm-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Phone</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="tel"
              placeholder="Enter phone number"
              value={data?.contact_phone || ""}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
