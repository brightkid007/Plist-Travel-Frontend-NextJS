"use client";

import Sidebar from "../../common/Sidebar";
import Header from "@/components/header/dashboard-header";
import Footer from "../../common/Footer";
import { useState } from "react";
import Hotel from "./hotel";
import Vacation from "./vacation";
import Event from "./event";
import Tour from "./tour";
import Activity from "./activity";

const index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Analytics", value: "analytics" },
    { label: "Reports", value: "reports" },
  ];

  const [option, setOption] = useState("hotel");
  const options = [
    { label: "Hotel", value: "hotel", content: <Hotel /> },
    {
      label: "Vacation Rental",
      value: "vacation_rental",
      content: <Vacation />,
    },
    {
      label: "Event Venue",
      value: "event_venue",
      content: <Event />
    },
    {
      label: "Tour Operator",
      value: "tour_operator",
      content: <Tour />,
    },
    {
      label: "Activity Operator",
      value: "activity_operator",
      content: <Activity />,
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
            <div className="row y-gap-20 justify-between items-center mb-5">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">Dashboard</h1>
                <div className="text-15 text-light-1">
                  Monitor your business performance with industry-specific
                  metrics
                </div>
              </div>
              <div className="col-auto">
                <select
                  className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-200 sm:w-full text-14"
                  onChange={(e) => setOption(e.target.value)}
                >
                  {options.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row px-10 mb-20">
              {tabs.map((item) => (
                <div className="col-auto px-5" key={item.value}>
                  <button
                    className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                      activeTab === item.value ? "bg-white" : "text-light-1"
                    }`}
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
            {options.map((item) => item.value === option && item.content)}

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
