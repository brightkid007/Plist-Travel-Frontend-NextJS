"use client";

import DashboardCard from "./components/DashboardCard";
import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RercentBooking from "./components/RercentBooking";
import { useState } from "react";
import PopularList from "./components/PopularList";
import VenderDashboardLayout from "../common/layout";

const index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Analytics", value: "analytics" },
    { label: "Reports", value: "reports" },
  ];
  const data = [
    {
      title: "Total Sales",
      amount: "$24,231.89",
      improve: "+15.2% from last month",
      icon: "/img/dashboard/icons/1.svg",
    },
    {
      title: "Total Bookings",
      amount: "432",
      improve: "+8.2% from last month",
      icon: "/img/dashboard/icons/3.svg",
    },
    {
      title: "Net Earnings",
      amount: "$18,565.00",
      improve: "+12.5% from last month",
      icon: "/img/dashboard/icons/2.svg",
    },
    {
      title: "Active Listings",
      amount: "12",
      improve: "+2 new listings this month",
      icon: "/img/dashboard/icons/4.svg",
    },
  ];
  return (
    <VenderDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Vendor Dashboard</h1>
          <div className="text-15 text-light-1">
            Overview of your listings, bookings, and performance metrics.
          </div>
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
      <DashboardCard data={data} />

      <div className="row y-gap-30 pt-20 chart_responsive">
        <div className="col-xl-7 col-lg-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <div className="d-flex justify-between items-center">
              <h2 className="text-18 lh-1 fw-500">
                Revenue & Bookings Overview
              </h2>
              {/* <ChartSelect /> */}
            </div>

            <div className="pt-30">
              <ChartMain />
            </div>
          </div>
        </div>

        <div className="col-xl-5 col-lg-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3 h-100">
            <div className="d-flex justify-between items-center">
              <div>
                <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
                <div className="text-12 text-light-1">
                  Overview of your listings, bookings, and performance metrics.
                </div>
              </div>
              <div>
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div>
            </div>

            <RercentBooking />
          </div>
        </div>

        <div className="col-12">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <div className="d-flex justify-between items-center">
              <div>
                <h2 className="text-18 lh-1 fw-500">Popular Listings</h2>
                <div className="text-12 text-light-1">
                  Your most booked listings this month
                </div>
              </div>
              <div>
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div>
            </div>

            <PopularList />
          </div>
        </div>
      </div>
    </VenderDashboardLayout>
  );
};

export default index;
