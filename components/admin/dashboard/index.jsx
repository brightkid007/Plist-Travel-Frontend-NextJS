"use client";

import DashboardCard from "./components/DashboardCard";
// import ChartMain from "./components/ChartMain";
import RecentBooking from "./components/RecentBooking";
import { useState, useEffect, useCallback, useMemo } from "react";
import PerformenceMetrics from "./components/PerformenceMetrics";
import AdminDashboardLayout from "../common/layout";
import data from "./data";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast } from "react-toastify";
import {
  getAdminBookings,
  exportAdminData,
  getPaymentAnalytics,
  getListingCategories,
  getListingSubcategories,
} from "@/helpers/backend_helper";
import { useAuth } from "@/contexts/AuthContext";
import { Drawer } from "@mui/material";
import BookingList from "../oversight/BookingList";
import { Filter } from "lucide-react";

const index = () => {
  const { user } = useAuth();
  const [activeMetricTab, setActiveMetricTab] = useState("daily");
  const [option, setOption] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [reportsFilter, setReportsFilter] = useState("category");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  // Backend integration states
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filterVersion, setFilterVersion] = useState(0); // Trigger for applying filters

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Analytics", value: "analytics" },
    { label: "Reports", value: "reports" },
  ];

  // Map frontend option to backend type
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
    return undefined;
  };

  // Map frontend option to subtype for property types
  const mapOptionToSubtype = (opt) => {
    const subtypeMap = {
      hotel: "Hotel",
      vacation: "Vacation",
      venue: "EventVenue",
      spaces: "Space",
    };
    return subtypeMap[opt] || null;
  };

  // Load categories and subcategories
  const loadCategoriesData = useCallback(async () => {
    try {
      const backendType = mapTypeToBackend(option);
      const params = backendType ? { type: backendType } : {};
      
      const [catRes, subcatRes] = await Promise.all([
        getListingCategories(params),
        getListingSubcategories(params),
      ]);

      let categoriesData = catRes?.data || catRes || [];
      let subcategoriesData = subcatRes?.data || subcatRes || [];
      
      // Filter categories by subtype if option is a property type
      if (["hotel", "vacation", "venue", "spaces"].includes(option)) {
        const subtype = mapOptionToSubtype(option);
        if (subtype) {
          categoriesData = categoriesData.filter(
            (cat) => cat.subtype === subtype
          );
          // Also filter subcategories by subtype (they inherit from parent category)
          const categoryIds = categoriesData.map(cat => cat.id);
          subcategoriesData = subcategoriesData.filter(
            (sub) => categoryIds.includes(sub.category_id || sub.listing_category_id)
          );
        }
      }
      
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error(error?.message || "Failed to load categories");
      setCategories([]);
      setSubcategories([]);
    }
  }, [option]);

  // Load categories when option changes
  useEffect(() => {
    loadCategoriesData();
    // Reset filters when option changes
    setCategoryFilter("all");
    setSubcategoryFilter("all");
  }, [loadCategoriesData]);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredSubcategories(subcategories);
    } else {
      const filtered = subcategories.filter(
        (sub) => String(sub.category_id || sub.listing_category_id) === String(categoryFilter)
      );
      setFilteredSubcategories(filtered);
      // Reset subcategory filter if current selection is not in filtered list
      if (subcategoryFilter !== "all" && !filtered.find(s => String(s.id) === String(subcategoryFilter))) {
        setSubcategoryFilter("all");
      }
    }
  }, [categoryFilter, subcategories, subcategoryFilter]);

  // Memoize date strings to ensure proper dependency tracking
  const startDateStr = useMemo(() => startDate?.format?.("YYYY-MM-DD"), [startDate]);
  const endDateStr = useMemo(() => endDate?.format?.("YYYY-MM-DD"), [endDate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Get current filter values (not from dependencies, so they don't trigger reload)
        const currentStartDateStr = startDate?.format?.("YYYY-MM-DD");
        const currentEndDateStr = endDate?.format?.("YYYY-MM-DD");

        const params = {
          startDate: currentStartDateStr,
          endDate: currentEndDateStr,
          type: mapTypeToBackend(option),
        };

        const filters = {
          limit: 10,
          type: mapTypeToBackend(option),
          start_date: currentStartDateStr,
          end_date: currentEndDateStr,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          subcategory: subcategoryFilter !== "all" ? subcategoryFilter : undefined,
          vendor: vendorFilter !== "all" ? vendorFilter : undefined,
          agent: agentFilter !== "all" ? agentFilter : undefined,
          customer_type: customerTypeFilter !== "all" ? customerTypeFilter : undefined,
          channel: channelFilter !== "all" ? channelFilter : undefined,
        };
        // Remove undefined values
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
        
        // Prepare payment analytics params
        const paymentParams = {
          start_date: currentStartDateStr,
          end_date: currentEndDateStr,
          type: mapTypeToBackend(option),
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          subcategory: subcategoryFilter !== "all" ? subcategoryFilter : undefined,
          vendor: vendorFilter !== "all" ? vendorFilter : undefined,
          customer_type: customerTypeFilter !== "all" ? customerTypeFilter : undefined,
          channel: channelFilter !== "all" ? channelFilter : undefined,
        };
        Object.keys(paymentParams).forEach(key => paymentParams[key] === undefined && delete paymentParams[key]);
        
        const [paymentAn, bookingsRes] = await Promise.all([
          getPaymentAnalytics(paymentParams),
          getAdminBookings(filters)
        ]);

        const an = paymentAn?.data || paymentAn || {};
        const cards = [
          { title: 'Total Revenue', amount: `$${Number(an.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: '', icon: '/img/dashboard/icons/1.svg', description: 'Total income from all sources' },
          { title: 'Pending Payments', amount: `$${Number(an.pending_payments?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: `${an.pending_payments?.count || 0} pending`, icon: '/img/dashboard/icons/3.svg', description: 'Amount yet to be paid' },
          { title: 'Refund Requests', amount: `$${Number(an.refund_requests?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: `${an.refund_requests?.count || 0} requests`, icon: '/img/dashboard/icons/2.svg', description: 'Requests awaiting refund processing' },
          { title: 'Agent Wallet Balance', amount: `$${Number(an.agent_wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: '', icon: '/img/dashboard/icons/4.svg', description: 'Total wallet balance of all agents' },
        ];

        setDashboardData(cards);
        setMetricsData(an.metrics || null);
        // Normalise bookings to RecentBooking shape expectations
        const rawBookings = bookingsRes?.data ?? bookingsRes;
        const bookingsArray = Array.isArray(rawBookings)
          ? rawBookings
          : Array.isArray(rawBookings?.data)
            ? rawBookings.data
            : Array.isArray(rawBookings?.rows)
              ? rawBookings.rows
              : Array.isArray(rawBookings?.results)
                ? rawBookings.results
                : [];
        const bk = bookingsArray.map((b) => ({
          id: b.id,
          service: b.service || b.listing_type || b.type || '-',
          status: b.status || b.payment_status || '-',
          total: b.total_amount || b.amount || b.total || '-',
          paid: b.payment_status === 'paid' ? 'Paid' : 'Unpaid',
          customer_type: b.customer_type || '-',
          vendor: b.vendor_name || b.vendor || '-',
          agent: b.agent_name || b.agent || '-',
          booking_channel: b.booking_channel || '-',
          location: b.location || '-',
          created_at: b.created_at || b.createdAt || Date.now(),
        }));
        setRecentBookings(bk);

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        toast.error(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [
    activeTab, 
    activeMetricTab, 
    filterVersion // Only reload when filterVersion changes (Apply button clicked)
  ]);

  // Handle export data
  const handleExportData = async () => {
    try {
      const params = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        type: mapTypeToBackend(option),
        format: 'csv'
      };

      const exportResult = await exportAdminData(params);
      // Handle file download
      console.log("Export data:", exportResult);
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(err?.message || "Failed to export data");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Admin Dashboard</h1>
        </div>
        <div className="col-auto ms-auto">
          <button className="button bg-white border-blue-1 text-blue-1 px-15 py-10 rounded-8" onClick={() => setShowFilters(true)}>
            <Filter size={18} className="mr-10" /> Filters
          </button>
        </div>
        <div className="col-auto">
          <button
            className="button bg-blue-1 text-white px-15 py-10 rounded-8"
            onClick={handleExportData}
            disabled={loading}
          >
            Export Data
          </button>
        </div>
        {/* <div className="col-auto">
          <button className="button bg-blue-1 text-white px-15 py-10 rounded-8">
            Create Package
          </button>
        </div> */}
        <div className="col-12 text-16 fw-500">
          Welcome {user?.first_name || ''} {user?.last_name || ''}!
        </div>
        {/* <div className="col-12 text-14 text-light-1">Sales Summary</div> */}
      </div>
      <div className="row px-10 mb-20">
        {tabs.map((item) => (
          <div className="col-auto px-5" key={item.value}>
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
                }`}
              onClick={() => setActiveTab(item.value)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-16 text-light-1">Loading dashboard data...</div>
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
              <PerformenceMetrics metrics={metricsData} />
            </div>
          </div>
        </div>

        {/* <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
          <BookingList bookings={recentBookings} />
        </div> */}

      </div>

      <Drawer anchor="right" open={showFilters} onClose={() => setShowFilters(false)}>
        <div className="px-20 py-20 w-400 sm:w-full" style={{ height: '100vh', maxWidth: '400px' }}>
          <h2 className="text-16 fw-500 mb-10">Dashboard Filters</h2>
          <div className="row y-gap-10 x-gap-10">
            <div className="col-12">
              <label className="text-12 fw-500">Data Type</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={option} onChange={(e) => setOption(e.target.value)}>
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
            {/* {activeTab === "reports" && (
              <div className="col-12">
                <label className="text-12 fw-500">Reports</label>
                <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={reportsFilter} onChange={(e) => setReportsFilter(e.target.value)}>
                  <option value="category">Select Reports</option>
                </select>
              </div>
            )} */}
            <div className="col-sm-6">
              <label className="text-12 fw-500">Category</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <label className="text-12 fw-500">Subcategory</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)}>
                <option value="all">All Subcategories</option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="col-sm-6">
              <label className="text-12 fw-500">Vendors</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)}>
                <option value="all">All Vendors</option>
              </select>
            </div>
            <div className="col-sm-6">
              <label className="text-12 fw-500">Agents</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                <option value="all">All Agents</option>
                <option value="reseller">Reseller Agents</option>
                <option value="affiliate">Affiliate Agents</option>
              </select>
            </div>
            <div className="col-sm-6">
              <label className="text-12 fw-500">Customer Types</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={customerTypeFilter} onChange={(e) => setCustomerTypeFilter(e.target.value)}>
                <option value="all">All Customer Types</option>
                <option value="individul_pros">Individual Prospects</option>
                <option value="business_pros">Business Prospects</option>
                <option value="individual_customer">Individual Customers</option>
                <option value="business_customer">Business Customers</option>
              </select>
            </div>
            <div className="col-sm-6">
              <label className="text-12 fw-500">Booking Channels</label>
              <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14 mt-5" value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)}>
                <option value="all">All Booking Channels</option>
                <option value="reseller_agents">Reseller Agents</option>
                <option value="affiliate_agents">Affiliate Agents</option>
                <option value="saas_agents">SaaS Platform</option>
                <option value="ota_channel">OTA Channel</option>
                <option value="others">Others</option>
              </select>
            </div> */}
            <div className="col-sm-6">
              <label className="text-12 fw-500">Start Date</label>
              <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white mt-5">
                <DatePicker
                  inputClass="custom_input-picker"
                  containerClassName="custom_container-picker"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  numberOfMonths={1}
                  offsetY={10}
                  placeholder="Start Date"
                  format="MMMM DD"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <label className="text-12 fw-500">End Date</label>
              <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white mt-5">
                <DatePicker
                  inputClass="custom_input-picker"
                  containerClassName="custom_container-picker"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  numberOfMonths={1}
                  offsetY={10}
                  placeholder="End Date"
                  format="MMMM DD"
                />
              </div>
            </div>
            <div className="col-12 d-flex justify-end gap-2 mt-10">
              <button 
                className="button border-light px-15 py-10 rounded-8" 
                onClick={() => {
                  // Reset filters to current applied values
                  setCategoryFilter("all");
                  setSubcategoryFilter("all");
                  setVendorFilter("all");
                  setAgentFilter("all");
                  setCustomerTypeFilter("all");
                  setChannelFilter("all");
                  setStartDate(null);
                  setEndDate(null);
                  setOption("all");
                }}
              >
                Reset
              </button>
              <button 
                className="button border-light px-15 py-10 rounded-8" 
                onClick={() => setShowFilters(false)}
              >
                Close
              </button>
              <button 
                className="button bg-blue-1 text-white px-15 py-10 rounded-8" 
                onClick={() => { 
                  setFilterVersion(prev => prev + 1); // Trigger data reload
                  setShowFilters(false); 
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </AdminDashboardLayout>
  );
};

export default index;
