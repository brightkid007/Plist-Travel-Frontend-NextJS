"use client";

import { useState } from "react";
import VendorDashboardLayout from "../common/layout";
import ReviewList from "./ReviewList";
import ReviewFilter from "./ReviewFilter";

const index = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    // Clean up "all" values
    const cleanedFilters = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key] !== "all" && newFilters[key] !== "" && newFilters[key] !== null && newFilters[key] !== undefined) {
        cleanedFilters[key] = newFilters[key];
      }
    });
    setFilters(cleanedFilters);
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Guest Reviews & Ratings</h1>
          <div className="text-15 text-light-1">
            View and manage guest reviews and ratings for your listings.
          </div>
        </div>
      </div>

      <ReviewFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="py-10 px-20 rounded-8 bg-white shadow-3 h-100 mt-20">
        <ReviewList filters={filters} />
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
