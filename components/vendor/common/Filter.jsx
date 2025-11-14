import { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const Filter = ({ filters = {}, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories and subcategories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          getListingCategories(),
          getListingSubcategories(),
        ]);
        
        const categoriesData = categoriesRes?.data || categoriesRes || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        const subcategoriesData = subcategoriesRes?.data || subcategoriesRes || [];
        setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      } catch (error) {
        console.error("Error loading filter data:", error);
        toast.error("Failed to load filter options");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ ...filters, [key]: value });
    }
  };

  const handleDateChange = (key, date) => {
    if (date && date.isValid) {
      const dateString = date.format("YYYY-MM-DD");
      handleFilterChange(key, dateString);
    } else {
      handleFilterChange(key, "");
    }
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = filters.listing_category_id && filters.listing_category_id !== "all"
    ? subcategories.filter(
        (sub) => (sub.listing_category_id || sub.category_id) === parseInt(filters.listing_category_id, 10)
      )
    : subcategories;

  // Determine status based on dates and is_active
  const getStatusValue = () => {
    if (filters.is_active !== undefined && filters.is_active !== "all") {
      return filters.is_active === "true" || filters.is_active === true ? "active" : "inactive";
    }
    return filters.status || "all";
  };

  return (
    <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={getStatusValue()}
          onChange={(e) => {
            const status = e.target.value;
            if (status === "all") {
              handleFilterChange("is_active", "all");
              handleFilterChange("status", "all");
            } else if (status === "active") {
              handleFilterChange("is_active", "true");
            } else if (status === "inactive") {
              handleFilterChange("is_active", "false");
            } else {
              handleFilterChange("status", status);
            }
          }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={filters.listing_category_id || "all"}
          onChange={(e) => {
            handleFilterChange("listing_category_id", e.target.value);
            // Reset subcategory when category changes
            handleFilterChange("listing_subcategory_id", "all");
          }}
          disabled={loading}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={filters.listing_subcategory_id || "all"}
          onChange={(e) => handleFilterChange("listing_subcategory_id", e.target.value)}
          disabled={loading || !filters.listing_category_id || filters.listing_category_id === "all"}
        >
          <option value="all">All Sub Categories</option>
          {filteredSubcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-auto">
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={filters.date_from ? new DateObject(filters.date_from) : null}
            onChange={(date) => handleDateChange("date_from", date)}
            numberOfMonths={1}
            offsetY={10}
            format="YYYY-MM-DD"
            placeholder="Date From"
          />
        </div>
      </div>
      <div className="col-sm-auto">
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={filters.date_to ? new DateObject(filters.date_to) : null}
            onChange={(date) => handleDateChange("date_to", date)}
            numberOfMonths={1}
            offsetY={10}
            format="YYYY-MM-DD"
            placeholder="Date To"
          />
        </div>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 w-140 sm:w-full text-14"
          value={filters.listing_type || "all"}
          onChange={(e) => handleFilterChange("listing_type", e.target.value)}
        >
          <option value="all">All Types</option>
          <optgroup label="Property List">
            <option value="property">Property</option>
          </optgroup>
          <optgroup label="Non-Property List">
            <option value="tour">Tour</option>
            <option value="activity">Activity</option>
            <option value="event">Event</option>
          </optgroup>
        </select>
      </div>
    </div>
  );
};

export default Filter;
