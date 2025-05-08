"use client";

import React, { useState } from "react";
// import FilterHotelsTabs from "./filter-tabs/FilterHotelsTabs";
import FilterTab from "@/components/common/form/FilterTab";
import {bookingHistoryTabs} from "@/components/data/bookingHistoryTabs";
import FilterBookings from "./FilterBookings"

export default function BookingHistoryFilter() {
  const [filterOption, setFilterOption] = useState("all");
  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end">

          <div className="col-auto tabs -pills-2 ">
            <FilterTab
              options={bookingHistoryTabs}
              tabOption={filterOption}
              setTabOption={setFilterOption}
            />
          </div>
          {/* End .col-auto */}
        </div>
        {/* End .row */}

        <div className="relative overflow-hidden pt-40 sm:pt-20">
          <div className="row y-gap-30">
            <FilterBookings filterOption={filterOption} />
          </div>
        </div>
        {/* End relative */}
      </div>
    </section>
  );
}
