"use client";

import DashboardCard from "./components/DashboardCard";
// import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RecentBooking from "./components/RecentBooking";
import { useState, useEffect } from "react";
import PerformenceMetrics from "./components/PerformenceMetrics";
import AdminDashboardLayout from "../common/layout";
import data from "./data";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { 
  getAdminDashboard, 
  getAdminAnalytics, 
  getAdminMetrics,
  getAdminBookings,
  getAdminUsers,
  getAdminListings,
  exportAdminData,
  isAdminAuthenticated,
  getLoggedInAdmin
} from "@/helpers/backend_helper";

const index = () => {
  const [activeMetricTab, setActiveMetricTab] = useState("daily");
  const [option, setOption] = useState("hotel");
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  
  // Backend integration states
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  
  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Analytics", value: "analytics" },
    { label: "Reports", value: "reports" },
  ];

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if admin is authenticated
        if (!isAdminAuthenticated()) {
          setError("Admin authentication required");
          return;
        }

        const admin = getLoggedInAdmin();
        setAdminUser(admin);

        // Load dashboard data based on active tab
        const params = {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          type: option,
          period: activeMetricTab
        };

        const [dashboard, analytics, metrics, bookings] = await Promise.all([
          getAdminDashboard(params),
          getAdminAnalytics(params),
          getAdminMetrics(params),
          getAdminBookings({ limit: 10, status: 'all' })
        ]);

        setDashboardData(dashboard);
        setAnalyticsData(analytics);
        setMetricsData(metrics);
        setRecentBookings(bookings?.data || []);
        
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [activeTab, option, activeMetricTab, startDate, endDate]);

  // Handle export data
  const handleExportData = async () => {
    try {
      const params = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        type: option,
        format: 'csv'
      };
      
      const exportResult = await exportAdminData(params);
      // Handle file download
      console.log("Export data:", exportResult);
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to export data");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Admin Dashboard</h1>
        </div>
        <div className="col-auto ms-auto">
          <button 
            className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8"
            onClick={handleExportData}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Export Data"}
          </button>
        </div>
        <div className="col-auto">
          <button className="button bg-blue-1 text-white px-15 py-10 rounded-8">
            Create Package
          </button>
        </div>
        <div className="col-12 text-16 fw-500">
          Welcome {adminUser?.name || 'Super Admin'}!
        </div>
        {/* <div className="col-12 text-14 text-light-1">Sales Summary</div> */}
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

      <div className="row y-gap-10 x-gap-10 mb-10">
        <div className="col-auto">
          <select
            className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 text-14"
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="all">All</option>
            <optgroup label="Property List">
              <option value="hotel">Hotel</option>
              <option value="vacation">Vacation Rental</option>
              <option value="venue">Event Venue</option>
              <option value="spaces">Spaces</option>
            </optgroup>
            <optgroup label="Non-Property List">
              <option value="tour">Tour</option>
              <option value="activity">Activity</option>
              <option value="event">Event</option>
              <option value="flights">Flights</option>
              <option value="rides">Rides</option>
            </optgroup>
            <option value="travel-packages">Travel Packages</option>
          </select>
        </div>
        {activeTab === "reports" && (
          <div className="col-md-auto col-sm-6">
            <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
              <option value="category">Select Reports</option>
            </select>
          </div>
        )}
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="category">Select Category</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="subcategory">Select Subcategory</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="all">All Vendors</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="all">All Agents</option>
            <option value="reseller">Reseller Agents</option>
            <option value="affiliate">Affiliate Agents</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="all">All Customer Types</option>
            <option value="individul_pros">Individual Prospects</option>
            <option value="business_pros">Business Prospects</option>
            <option value="individual_customer">Individual Customers</option>
            <option value="business_customer">Business Customers</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="all">All Booking Channels</option>
            <option value="reseller_agents">Reseller Agents</option>
            <option value="affiliate_agents">Affiliate Agents</option>
            <option value="saas_agents">SaaS Platform</option>
            <option value="ota_channel">OTA Channel</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="col-md-auto col-sm-6">
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-md-auto col-sm-6">
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-16 text-light-1">Loading dashboard data...</div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-16 text-red-1">Error: {error}</div>
        </div>
      ) : (
        <DashboardCard data={dashboardData || data[option][activeTab]} />
      )}

      <div className="row y-gap-30 pt-20 chart_responsive">
        <div className="col-12">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <div className="d-flex justify-between items-center">
              <div>
                <h2 className="text-18 lh-1 fw-500">Earning Statistics</h2>
                <div className="text-12 text-light-1">
                  Revenue, fees and commissions over time
                </div>
              </div>
              <div className="d-flex bg-light-2 rounded-8 py-5 px-5 gap-2 items-center">
                <div
                  className={
                    "text-14 fw-500 rounded-8 py-5 px-15 cursor-pointer" +
                    (activeMetricTab === "daily"
                      ? " bg-white"
                      : " text-light-1")
                  }
                  onClick={() => setActiveMetricTab("daily")}
                >
                  Daily
                </div>
                <div
                  className={
                    "text-14 fw-500 rounded-8 py-5 px-15 cursor-pointer" +
                    (activeMetricTab === "weekly"
                      ? " bg-white"
                      : " text-light-1")
                  }
                  onClick={() => setActiveMetricTab("weekly")}
                >
                  Weekly
                </div>
                <div
                  className={
                    "text-14 fw-500 rounded-8 py-5 px-15 cursor-pointer" +
                    (activeMetricTab === "monthly"
                      ? " bg-white"
                      : " text-light-1")
                  }
                  onClick={() => setActiveMetricTab("monthly")}
                >
                  Monthly
                </div>
                <div
                  className={
                    "text-14 fw-500 rounded-8 py-5 px-15 cursor-pointer" +
                    (activeMetricTab === "yearly"
                      ? " bg-white"
                      : " text-light-1")
                  }
                  onClick={() => setActiveMetricTab("yearly")}
                >
                  Yearly
                </div>
              </div>
            </div>

            <div className="pt-30">
              <PerformenceMetrics />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
          <div className="d-flex justify-left items-center mb-10">
            <div>
              <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
              <div className="text-12 text-light-1">
                Latest booking transactions
              </div>
            </div>
              {/* <div>
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div> */}
            </div>
            <div className="row y-gap-10 x-gap-10 items-center mb-5">
              <div className="d-flex flex-wrap gap-10 items-center mb-20">
                <div className="position-relative d-flex items-center w-180 sm:w-full">
                  <input
                    type="text"
                    placeholder="Search listings..."
                    className="border-light bg-white rounded-8 px-10 py-5 pl-30"
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
              <div className="col-sm-auto">
                <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-sm-auto">
                <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
                  <option value="all">Listing Type</option>
                </select>
              </div>

              <div className="col-sm-auto">
                <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
                  <option value="all">Category</option>
                </select>
              </div>
              <div className="col-sm-auto">
                <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
                  <option value="all">Sub Category</option>
                </select>
              </div>
              <div className="col-md-auto col-sm-6">
                <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
                  <option value="all">All Vendors</option>
                </select>
              </div>
              <div className="col-md-auto col-sm-6">
                <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
                  <option value="all">All Agents</option>
                  <option value="reseller">Reseller Agents</option>
                  <option value="affiliate">Affiliate Agents</option>
                </select>
              </div>
              <div className="col-md-auto col-sm-6">
                <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
                  <option value="all">All Customer Types</option>
                  <option value="individul_pros">Individual Prospects</option>
                  <option value="business_pros">Business Prospects</option>
                  <option value="individual_customer">Individual Customers</option>
                  <option value="business_customer">Business Customers</option>
                </select>
              </div>
              <div className="col-md-auto col-sm-6">
                <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
                  <option value="all">All Booking Channels</option>
                  <option value="reseller_agents">Reseller Agents</option>
                  <option value="affiliate_agents">Affiliate Agents</option>
                  <option value="saas_agents">SaaS Platform</option>
                  <option value="ota_channel">OTA Channel</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="col-sm-auto ms-auto d-flex">
                <button className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full me-2">
                  Export Listings
                </button>
                <button className="button -md px-15 py-10 fw-400 text-14 text-white bg-blue-1 rounded-8 sm:w-full">
                  View All
                </button>
              </div>
            </div>
            
            <RecentBooking bookings={recentBookings} loading={loading} />
          </div>
        </div>

      </div>
    </AdminDashboardLayout>
  );
};

export default index;
