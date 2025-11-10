import { useState, useEffect, useRef } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const Filter = ({ onFilterChange, options }) => {
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const debounceTimer = useRef(null);

  const categories = Array.isArray(options?.categories) ? options.categories : [];
  const subcategories = Array.isArray(options?.subcategories) ? options.subcategories : [];
  const statuses = Array.isArray(options?.statuses) ? options.statuses : [];
  const types = Array.isArray(options?.types) ? options.types : [];

  // Filter subcategories based on selected category (from options)
  const filteredSubcategories =
    category !== "all"
      ? subcategories.filter((sub) => {
          const categoryId = parseInt(category, 10);
          return sub.listing_category_id === categoryId || sub.category_id === categoryId;
        })
      : subcategories;

  // Reset subcategory when category changes and current selection is invalid
  useEffect(() => {
    if (category === "all") {
      setSubcategory("all");
    } else if (subcategory !== "all") {
      const currentSub = subcategories.find((sub) => sub.id === parseInt(subcategory, 10));
      if (currentSub) {
        const categoryId = parseInt(category, 10);
        const subCategoryId = currentSub.listing_category_id || currentSub.category_id;
        if (subCategoryId !== categoryId) {
          setSubcategory("all");
        }
      }
    }
  }, [category, subcategory, subcategories]);

  useEffect(() => {
    if (onFilterChange) {
      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for debouncing
      debounceTimer.current = setTimeout(() => {
        // Map frontend filter values to backend enum values
        const mapTypeToBackend = (type) => {
          if (!type || type === "all") return undefined;
          // Map property types to "property"
          if (["hotel", "vacation", "venue", "spaces"].includes(type)) {
            return "property";
          }
          // Map non-property types
          if (["tour", "activity", "event"].includes(type)) {
            return type;
          }
          // For other types like "ride", "flight", "travel-packages", return undefined or handle as needed
          return undefined;
        };

        const filters = {
          status: status !== "all" ? status : undefined,
          category: category !== "all" && !isNaN(parseInt(category, 10)) ? parseInt(category, 10) : undefined,
          subcategory: subcategory !== "all" && !isNaN(parseInt(subcategory, 10)) ? parseInt(subcategory, 10) : undefined,
          type: mapTypeToBackend(type),
          date_from: startDate ? startDate.format("YYYY-MM-DD") : undefined,
          date_to: endDate ? endDate.format("YYYY-MM-DD") : undefined,
        };
        // Remove undefined values
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
        onFilterChange(filters);
      }, 300); // 300ms debounce delay
    }

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [status, category, subcategory, type, startDate, endDate]);

  return (
    <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        >
          <option value="all">
            {category === "all" ? "All Subcategories" : "All Subcategories"}
          </option>
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
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              // Ensure endDate is not earlier than startDate
              if (endDate && date && endDate.toDate && date.toDate) {
                if (endDate.toDate() < date.toDate()) {
                  setEndDate(date);
                }
              }
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
            placeholder="Start Date"
            maxDate={endDate || undefined}
          />
        </div>
      </div>
      <div className="col-sm-auto">
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={endDate}
            onChange={(date) => {
              // Ensure endDate is not earlier than startDate
              if (startDate && date && startDate.toDate && date.toDate) {
                if (date.toDate() < startDate.toDate()) {
                  setEndDate(startDate);
                  return;
                }
              }
              setEndDate(date);
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
            placeholder="End Date"
            minDate={startDate || undefined}
          />
        </div>
      </div>

      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 w-140 sm:w-full text-14"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
