import { useState, useEffect } from "react";
import { getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Filter = ({ filters = {}, onFilterChange, statusOptions = null, showStatusFilter = true }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default status options if not provided
  const defaultStatusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Use provided statusOptions or default, or empty array if status filter should be hidden
  const statusOptionsToUse = showStatusFilter 
    ? (statusOptions || defaultStatusOptions)
    : [];

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

  const handleDateRangeChange = (newValue) => {
    if (newValue && newValue[0] && newValue[1]) {
      const dateFrom = newValue[0].format("YYYY-MM-DD");
      const dateTo = newValue[1].format("YYYY-MM-DD");
      
      // Validate that date_to is greater than or equal to date_from
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      if (toDate < fromDate) {
        toast.error("End date must be greater than or equal to start date");
        return;
      }
      
      handleFilterChange("date_from", dateFrom);
      handleFilterChange("date_to", dateTo);
    } else {
      handleFilterChange("date_from", "");
      handleFilterChange("date_to", "");
    }
  };

  // Convert filter dates to dayjs for DateRangePicker
  const dateRangeValue = filters.date_from && filters.date_to
    ? [dayjs(filters.date_from), dayjs(filters.date_to)]
    : [null, null];

  // Filter subcategories based on selected category
  const filteredSubcategories = filters.listing_category_id && filters.listing_category_id !== "all"
    ? subcategories.filter(
      (sub) => (sub.listing_category_id || sub.category_id) === parseInt(filters.listing_category_id, 10)
    )
    : subcategories;


  return (
    <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
      {showStatusFilter && statusOptionsToUse.length > 0 && (
        <div className="col-sm-auto">
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.status || "all"}
            onChange={(e) => {
              handleFilterChange("status", e.target.value)
            }}
          >
            <option value="all">All Statuses</option>
            {statusOptionsToUse.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label || option.value.charAt(0).toUpperCase() + option.value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

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
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={filters.listing_category_id || "all"}
          onChange={(e) => {
            handleFilterChange("listing_category_id", e.target.value);
          }}
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            value={dateRangeValue}
            onChange={handleDateRangeChange}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "border-radius": "8px",
                    "background-color": "white",
                    height: "50px",
                  },
                  "& .MuiInputBase-input": {
                    "font-size": "12px",
                  },
                },
              },
            }}
            format="YYYY-MM-DD"
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default Filter;
