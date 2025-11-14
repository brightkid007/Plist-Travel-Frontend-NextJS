import { useState, useEffect } from "react";
import StarRating from "../common/StarRating";

/**
 * Unified Description component for all property types (Hotel, Space, Vacation, EventVenue)
 * Adapts labels based on subtype
 */
const Description = ({ data, categories = [], subcategories = [], onUpdate, subtype }) => {
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Get title label and placeholder based on subtype
  const getTitleLabel = () => {
    switch (subtype) {
      case "Space":
        return { label: "Space Name", placeholder: "Enter space name" };
      case "EventVenue":
        return { label: "Venue Name", placeholder: "Enter venue name" };
      case "Hotel":
      case "Vacation":
      default:
        return { label: "Listing Title", placeholder: "Enter listing title" };
    }
  };

  const titleConfig = getTitleLabel();

  // Filter subcategories based on selected category
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

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Property Description</h1>
      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">
          {titleConfig.label} <span className="text-red-1">*</span>
        </h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder={titleConfig.placeholder}
          value={data?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Category <span className="text-red-1">*</span></h1>
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
        <h1 className="text-14 lh-12 fw-500">Subcategory <span className="text-red-1">*</span></h1>
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

      {/* Contact Information - Hotel */}
      {subtype === "Hotel" && (
        <div className="col-12 px-10 mt-10">
          <div className="row border-light rounded-8 px-10 py-10 y-gap-10 x-gap-10">
            <h1 className="text-18 lh-12 fw-500">Contact Information</h1>

            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Email</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="email"
                placeholder="Enter your email"
                value={data?.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
              />
            </div>
            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Phone Number</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="tel"
                placeholder="Enter your phone number"
                value={data?.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Person - EventVenue and Space */}
      {(subtype === "EventVenue" || subtype === "Space") && (
        <div className="col-12 px-10 mt-10">
          <div className="row border-light rounded-8 px-10 py-10 y-gap-10 x-gap-10">
            <h1 className="text-18 lh-12 fw-500">Contact Person</h1>

            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Manager</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="text"
                placeholder="Enter manager name"
                value={data?.manager_name || ""}
                onChange={(e) => handleChange("manager_name", e.target.value)}
              />
            </div>
            <div className="col-sm-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Phone</h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-10"
                type="tel"
                placeholder="Enter phone number"
                value={data?.manager_phone || ""}
                onChange={(e) => handleChange("manager_phone", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Parking Info - EventVenue only */}
      {subtype === "EventVenue" && (
        <div className="col-sm-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Parking Info</h1>
          <textarea
            rows={3}
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="text"
            placeholder="Describe parking information"
            value={data?.parking_info || ""}
            onChange={(e) => handleChange("parking_info", e.target.value)}
          />
        </div>
      )}

      <div className="col-sm-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Listing Description</h1>
        <textarea
          rows={5}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder={
            subtype === "EventVenue" ? "Describe your venue" :
            subtype === "Space" ? "Describe your space" :
            "Describe your property"
          }
          value={data?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default Description;
