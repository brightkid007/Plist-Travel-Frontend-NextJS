"use client";

import DashboardCard from "./components/DashboardCard";
import Sidebar from "../common/Sidebar";
import Header from "../../../../components/header/dashboard-header";
import ChartSelect from "./components/ChartSelect";
import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RercentBooking from "./components/RercentBooking";
import Footer from "../common/Footer";
import { useState } from "react";
import PopularList from "./components/PopularList";

const index = () => {
  const [option, setOption] = useState("rewards");
  const options = [
    { label: "Rewards", value: "rewards" },
    {
      label: "Point History",
      value: "pointhistory",
    },
  ];
  return (
    <>
      {/*  */}
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end mb-5">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">Vendor Dashboard</h1>
                <div className="text-15 text-light-1">
                  Overview of your listings, bookings, and performance metrics.
                </div>
              </div>
            </div>
            <div className="row px-10 mb-20">
              {options.map((item) => (
                <div className="col-auto px-5" key={item.value}>
                  <button
                    className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                      option === item.value ? "bg-white" : "text-light-1"
                    }`}
                    onClick={() => setOption(item.value)}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
            <DashboardCard />

            <div className="row y-gap-30 pt-20 chart_responsive">
              <div className="col-xl-7 col-lg-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">
                      Revenue & Bookings Overview
                    </h2>
                    <ChartSelect />
                  </div>
                  {/* End .d-flex */}

                  <div className="pt-30">
                    <ChartMain />
                  </div>
                </div>
              </div>
              {/* End .col */}

              <div className="col-xl-5 col-lg-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <div>
                      <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
                      <div className="text-12 text-light-1">
                        Overview of your listings, bookings, and performance
                        metrics.
                      </div>
                    </div>
                    <div>
                      <Link
                        href="#"
                        className="text-14 text-blue-1 fw-500 underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <RercentBooking />
                </div>
              </div>

              <div className="col-12">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <div>
                      <h2 className="text-18 lh-1 fw-500">Popular Listings</h2>
                      <div className="text-12 text-light-1">
                        Your most booked listings this month
                      </div>
                    </div>
                    <div>
                      <Link
                        href="#"
                        className="text-14 text-blue-1 fw-500 underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <PopularList />
                </div>
              </div>
            </div>

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
    </>
  );
};

export default index;
