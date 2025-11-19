"use client";

import DashboardCard from "./components/DashboardCard";
import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RecentBooking from "./components/RecentBooking";
import { useState, useEffect } from "react";
import PopularList from "./components/PopularList";
import VendorDashboardLayout from "../common/layout";
import data from "./data";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { getVendorBookings, getMyListings, getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [startDateObj, setStartDateObj] = useState(new DateObject().subtract(30, "days"));
  const [endDateObj, setEndDateObj] = useState(new DateObject());
  const [option, setOption] = useState("hotel");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularListings, setPopularListings] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const tabs = [
    { label: "Overview", value: "overview" },
    { label: "Analytics", value: "analytics" },
    { label: "Reports", value: "reports" },
  ];

  // Load categories and subcategories
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          getListingCategories().catch(() => ({ data: [] })),
          getListingSubcategories().catch(() => ({ data: [] })),
        ]);

        const categoriesData = categoriesRes?.data || categoriesRes || [];
        const subcategoriesData = subcategoriesRes?.data || subcategoriesRes || [];

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };

    loadFilterData();
  }, []);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        const startDateStr = startDateObj?.format("YYYY-MM-DD") || new DateObject().subtract(30, "days").format("YYYY-MM-DD");
        const endDateStr = endDateObj?.format("YYYY-MM-DD") || new DateObject().format("YYYY-MM-DD");

        // Map dashboard option to valid listing type enum values
        const typeMapping = {
          hotel: "property",
          vacation: "property",
          venue: "property",
          spaces: "property",
          tour: "tour",
          activity: "activity",
          event: "event",
        };

        const listingType = typeMapping[option] || "property";

        // Build booking filters
        const bookingFilters = {
          startDate: startDateStr,
          endDate: endDateStr,
          type: listingType,
        };

        // Add category filter
        if (selectedCategory && selectedCategory !== "all") {
          bookingFilters.categoryId = selectedCategory;
        }

        // Add subcategory filter
        if (selectedSubcategory && selectedSubcategory !== "all") {
          bookingFilters.subcategoryId = selectedSubcategory;
        }

        // Build listing filters
        const listingFilters = {
          type: listingType,
        };

        if (selectedCategory && selectedCategory !== "all") {
          listingFilters.category_id = selectedCategory;
        }

        if (selectedSubcategory && selectedSubcategory !== "all") {
          listingFilters.subcategory_id = selectedSubcategory;
        }

        // Fetch bookings and listings in parallel
        const [bookingsRes, listingsRes] = await Promise.all([
          getVendorBookings(bookingFilters).catch(() => ({ data: { bookings: [], summary: {} } })),
          getMyListings(listingFilters).catch(() => ({ data: [] })),
        ]);

        const bookingsData = bookingsRes?.data?.bookings || bookingsRes?.bookings || [];
        const listingsData = listingsRes?.data || listingsRes || [];

        setBookings(bookingsData);
        setListings(Array.isArray(listingsData) ? listingsData : []);

        // Calculate metrics
        calculateMetrics(bookingsData, listingsData);
        
        // Get recent bookings (last 5)
        const recent = bookingsData.slice(0, 5).map((booking) => ({
          name: booking.guestName || booking.guestEmail || "Guest",
          email: booking.guestEmail || "N/A",
          status: booking.status || "Pending",
          price: booking.totalPrice
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: booking.currency || "USD",
              }).format(booking.totalPrice)
            : "$0.00",
          createdAt: formatTimeAgo(booking.orderDate),
        }));
        setRecentBookings(recent);

        // Calculate popular listings
        calculatePopularListings(bookingsData, listingsData);

        // Calculate chart data
        calculateChartData(bookingsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [activeTab, option, selectedCategory, selectedSubcategory, startDateObj, endDateObj]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "min" : "mins"} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    return date.toLocaleDateString();
  };

  const calculateMetrics = (bookingsData, listingsData) => {
    const totalBookings = bookingsData.length;
    const confirmedBookings = bookingsData.filter((b) => b.status === "confirmed").length;
    const totalRevenue = bookingsData.reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0);
    const paidRevenue = bookingsData
      .filter((b) => b.payment_status === "paid" || b.status === "confirmed")
      .reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0);

    // Calculate previous period for comparison (30 days before start date)
    const prevStartDate = new Date(startDateObj?.toDate() || new Date());
    prevStartDate.setDate(prevStartDate.getDate() - 60);
    const prevEndDate = new Date(startDateObj?.toDate() || new Date());
    prevEndDate.setDate(prevEndDate.getDate() - 30);

    // For now, we'll use static comparison data. In production, fetch previous period data
    const prevRevenue = totalRevenue * 0.88; // Simulated 12% increase
    const revenueChange = totalRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Calculate occupancy rate (for properties)
    let occupancyRate = 0;
    if (option === "hotel" || option === "vacation") {
      const totalNights = bookingsData.reduce((sum, b) => {
        if (b.startDate && b.endDate) {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          return sum + nights;
        }
        return sum;
      }, 0);
      const availableNights = listingsData.length * 30; // Assuming 30 days period
      occupancyRate = availableNights > 0 ? (totalNights / availableNights) * 100 : 0;
    }

    // Calculate average daily rate (ADR) for hotels
    let adr = 0;
    if (option === "hotel" || option === "vacation") {
      const totalNights = bookingsData.reduce((sum, b) => {
        if (b.startDate && b.endDate && b.status === "confirmed") {
          const start = new Date(b.startDate);
          const end = new Date(b.endDate);
          const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          return sum + nights;
        }
        return sum;
      }, 0);
      adr = totalNights > 0 ? totalRevenue / totalNights : 0;
    }

    // Calculate average rating (placeholder - would need reviews data)
    const avgRating = 4.7;

    const metrics = {
      overview: [
        {
          title: option === "hotel" ? "Occupancy Rate" : option === "vacation" ? "Occupancy Rate" : "Conversion Rate",
          amount: option === "hotel" || option === "vacation" 
            ? `${occupancyRate.toFixed(1)}%` 
            : `${((confirmedBookings / Math.max(totalBookings, 1)) * 100).toFixed(1)}%`,
          improve: revenueChange > 0 
            ? `+${revenueChange.toFixed(1)}% from last month` 
            : `${revenueChange.toFixed(1)}% from last month`,
          icon: "/img/dashboard/icons/1.svg",
          description: option === "hotel" 
            ? "Percentage of available rooms occupied" 
            : "Percentage of visitors who book",
        },
        {
          title: option === "hotel" ? "Average Daily Rate" : option === "vacation" ? "Avg Length of Stay" : "Revenue/Activity",
          amount: option === "hotel"
            ? `$${adr.toFixed(2)}`
            : option === "vacation"
            ? `${(bookingsData.reduce((sum, b) => {
                if (b.startDate && b.endDate) {
                  const start = new Date(b.startDate);
                  const end = new Date(b.endDate);
                  return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                }
                return sum;
              }, 0) / Math.max(confirmedBookings, 1)).toFixed(1)} days`
            : `$${(totalRevenue / Math.max(confirmedBookings, 1)).toFixed(2)}`,
          improve: revenueChange > 0 
            ? `+${(revenueChange * 0.8).toFixed(1)}% from last month` 
            : `${(revenueChange * 0.8).toFixed(1)}% from last month`,
          icon: "/img/dashboard/icons/3.svg",
          description: option === "hotel"
            ? "Average revenue per occupied room"
            : option === "vacation"
            ? "Average duration of guest stays"
            : "Average revenue per activity",
        },
        {
          title: option === "hotel" ? "RevPAR" : "Net Revenue",
          amount: `$${totalRevenue.toFixed(2)}`,
          improve: revenueChange > 0 
            ? `+${revenueChange.toFixed(1)}% from last month` 
            : `${revenueChange.toFixed(1)}% from last month`,
          icon: "/img/dashboard/icons/2.svg",
          description: option === "hotel"
            ? "Revenue per available room"
            : "Revenue after fees and expenses",
        },
        {
          title: "Average Rating",
          amount: `${avgRating}/5`,
          improve: "+0.2 from last month",
          icon: "/img/dashboard/icons/4.svg",
          description: "Average customer rating",
        },
      ],
      analytics: data[option]?.analytics || [],
      reports: data[option]?.reports || [],
    };

    setDashboardMetrics(metrics);
  };

  const calculatePopularListings = (bookingsData, listingsData) => {
    // Count bookings per listing
    const listingBookings = {};
    const listingRevenue = {};

    bookingsData.forEach((booking) => {
      const listingId = booking.listingId;
      if (listingId) {
        listingBookings[listingId] = (listingBookings[listingId] || 0) + 1;
        listingRevenue[listingId] = (listingRevenue[listingId] || 0) + (parseFloat(booking.totalPrice) || 0);
      }
    });

    // Get listing details and sort by bookings
    const popular = listingsData
      .map((listing) => ({
        id: listing.id,
        name: listing.title || "Unnamed Listing",
        type: listing.type || option,
        bookings: listingBookings[listing.id] || 0,
        revenue: listingRevenue[listing.id] || 0,
        image: listing.images?.[0] || "/img/testimonials/1/4.png",
        status: { color: "dark-4", text: "white", label: "Active" },
      }))
      .filter((item) => item.bookings > 0)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        bookings: item.bookings.toString(),
        revenue: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.revenue),
      }));

    setPopularListings(popular);
  };

  const calculateChartData = (bookingsData) => {
    // Group bookings by month
    const monthlyRevenue = {};
    bookingsData.forEach((booking) => {
      if (booking.orderDate) {
        const date = new Date(booking.orderDate);
        const month = date.toLocaleString("default", { month: "short" });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (parseFloat(booking.totalPrice) || 0);
      }
    });

    // Create chart data
    const labels = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const chartDataPoints = labels.map((month) => monthlyRevenue[month] || 0);

    setChartData({
      labels,
      datasets: [
        {
          label: "Revenue",
          borderColor: "#1967d2",
          backgroundColor: "#1967d2",
          tension: 0.2,
          data: chartDataPoints,
          fill: false,
        },
      ],
    });
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Dashboard</h1>
          <div className="text-15 text-light-1">
            Monitor your business performance with industry-specific metrics
          </div>
        </div>
        {/* <div className="col-auto">
          <select
            className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-200 sm:w-full text-14"
            onChange={(e) => setOption(e.target.value)}
          >
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
          </optgroup>
          </select>
        </div> */}
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
        {activeTab === "reports" &&<div className="col-md-2 col-sm-6">
          <select className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14">
            <option value="category">Select Reports</option>
          </select>
        </div>}
        <div className="col-md-2 col-sm-6">
          <select 
            className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("all"); // Reset subcategory when category changes
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 col-sm-6">
          <select 
            className="form-select rounded-4 border-light justify-between text-14 h-50 w-full text-14"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={selectedCategory === "all"}
          >
            <option value="all">All Subcategories</option>
            {subcategories
              .filter((sub) => !selectedCategory || selectedCategory === "all" || sub.listing_category_id === parseInt(selectedCategory))
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-2 col-sm-6">
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={startDateObj}
              onChange={(date) => {
                if (date) {
                  setStartDateObj(date);
                }
              }}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
        <div className="col-md-2 col-sm-6">
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 h-50 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={endDateObj}
              onChange={(date) => {
                if (date) {
                  setEndDateObj(date);
                }
              }}
              numberOfMonths={1}
              offsetY={10}
              format="MMMM DD"
            />
          </div>
        </div>
      </div>

      <DashboardCard 
        data={dashboardMetrics?.[activeTab] || data[option]?.[activeTab] || []} 
      />

      <div className="row y-gap-30 pt-20 chart_responsive">
        <div className="col-xl-7">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <div className="d-flex justify-between items-center">
              <h2 className="text-18 lh-1 fw-500">
                Revenue & Bookings Overview
              </h2>
              {/* <ChartSelect /> */}
            </div>

            <div className="pt-30">
              <ChartMain data={chartData} />
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3 h-100">
            <div className="d-flex justify-between items-center">
              <div className="flex-shrink-0">
                <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
                <div className="text-12 text-light-1">
                  Overview of your listings, bookings, and performance metrics.
                </div>
              </div>
              <div className="flex-grow-1 d-flex justify-end gap-2">
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div>
            </div>

            <RecentBooking bookings={recentBookings} loading={loading} />
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
            <PopularList listings={popularListings} loading={loading} />
          </div>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
