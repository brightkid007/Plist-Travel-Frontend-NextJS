import DatePicker, { DateObject } from "react-multi-date-picker";

const ReviewFilter = ({ filters = {}, onFilterChange }) => {
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

  return (
    <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
      {/* Search Filter */}
      <div className="col-sm-auto">
        <div className="position-relative d-flex items-center w-180 sm:w-full">
          <input
            type="text"
            placeholder="Search reviews..."
            className="border-light bg-white rounded-8 px-10 py-5 pl-30"
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <i
            className="icon-search text-light-1 position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></i>
        </div>
      </div>

      {/* Status Filter */}
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={filters.status || "all"}
          onChange={(e) => {
            const status = e.target.value;
            handleFilterChange("status", status);
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="col-sm-auto">
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
          value={filters.rating || "all"}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Date From Filter */}
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

      {/* Date To Filter */}
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
            minDate={filters.date_from ? new DateObject(filters.date_from) : null}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewFilter;

