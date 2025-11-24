"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

import BookingCard from "./BookingCard";
import VendorDashboardLayout from "../common/layout";
import BookingList from "./BookingList";
import svgIcon from "@/components/data/svgIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Filter from "../common/Filter";
import { getVendorBookings, getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";

const index = () => {
  const { hasPermission } = useVendorPermissions();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const showBookingMenu = Boolean(anchorEl);

  const tabs = [
    { label: "All Bookings", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "Cancelled", value: "cancelled" },
    // { label: "Walk-in", value: "walk-in" },
  ];

  // Load categories and subcategories for filter mapping
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          getListingCategories(),
          getListingSubcategories(),
        ]);

        const categoriesData = categoriesRes?.data || categoriesRes || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        const subcategoriesData = subcategoriesRes?.data || subcategoriesRes || [];
        setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };
    loadFilterData();
  }, []);

  // Fetch bookings from backend
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);

      // Map filter keys to API parameter names
      const params = {};

      // Status filter - prioritize filter status over tab, but respect tab if no filter is set
      if (filters.status && filters.status !== "all") {
        // If user has selected a status filter, use it
        params.status = filters.status;
      } else if (activeTab === "cancelled") {
        // If no status filter but cancelled tab is active, use cancelled status
        params.status = "cancelled";
      }
      // Note: "upcoming" and "past" tabs are handled by date filtering on frontend, not status

      // Listing type filter
      if (filters.listing_type && filters.listing_type !== "all") {
        params.type = filters.listing_type;
      }

      // Category filter - send category ID directly
      if (filters.listing_category_id && filters.listing_category_id !== "all") {
        params.categoryId = filters.listing_category_id;
      }

      // Date filters
      if (filters.date_from) {
        params.startDate = filters.date_from;
      }
      if (filters.date_to) {
        params.endDate = filters.date_to;
      }

      // Search filter
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Subcategory filter - send subcategory ID directly
      if (filters.listing_subcategory_id && filters.listing_subcategory_id !== "all") {
        params.subcategoryId = filters.listing_subcategory_id;
      }

      const response = await getVendorBookings(params);
      let bookingsData = response?.data?.bookings || response?.bookings || [];

      // Filter by tab on frontend (only if no status filter is applied, or for date-based tabs)
      // Note: Status filter from dropdown takes precedence over tab status filtering
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Apply tab-based filtering only if it's a date-based tab (upcoming/past) or if no status filter is set
      if (activeTab === "upcoming" && (!filters.status || filters.status === "all")) {
        // Upcoming bookings are those with startDate in the future
        bookingsData = bookingsData.filter((booking) => {
          if (!booking.startDate) return false;
          const startDate = new Date(booking.startDate);
          startDate.setHours(0, 0, 0, 0);
          return startDate >= today;
        });
      } else if (activeTab === "past" && (!filters.status || filters.status === "all")) {
        // Past bookings are those with endDate in the past
        bookingsData = bookingsData.filter((booking) => {
          if (!booking.endDate) return false;
          const endDate = new Date(booking.endDate);
          endDate.setHours(0, 0, 0, 0);
          return endDate < today;
        });
      }
      // Note: "cancelled" tab is handled by status filter in params above
      // "all" tab shows all bookings (no additional filtering needed)

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters, searchTerm]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    return {
      total,
      confirmed,
      pending,
      cancelled,
    };
  }, [bookings]);

  // Prepare card data
  const cardData = useMemo(() => {
    const total = summary.total;
    const confirmed = summary.confirmed;
    const pending = summary.pending;
    const cancelled = summary.cancelled;

    return [
      {
        title: "Total Bookings",
        amount: total.toString(),
        improve: `${total > 0 ? "100%" : "0%"} of all bookings`,
        icon: (
          <span className="material-symbols-outlined text-blue-1">
            calendar_today
          </span>
        ),
      },
      {
        title: "Confirmed",
        amount: confirmed.toString(),
        improve: total > 0 ? `${((confirmed / total) * 100).toFixed(1)}% of total bookings` : "0% of total bookings",
        icon: (
          <span className="material-symbols-outlined text-green-3">check</span>
        ),
      },
      {
        title: "Pending",
        amount: pending.toString(),
        improve: total > 0 ? `${((pending / total) * 100).toFixed(1)}% of total bookings` : "0% of total bookings",
        icon: (
          <span className="material-symbols-outlined text-yellow-1">
            calendar_today
          </span>
        ),
      },
      {
        title: "Cancelled",
        amount: cancelled.toString(),
        improve: total > 0 ? `${((cancelled / total) * 100).toFixed(1)}% of total bookings` : "0% of total bookings",
        icon: <span className="material-symbols-outlined text-red-1">close</span>,
      },
    ];
  }, [summary]);

  // Filter and transform bookings for BookingList
  const filteredBookings = useMemo(() => {
    // Search is already handled by API, so we just transform the data
    // Transform to BookingList format
    return bookings.map((booking) => {
      const startDate = booking.startDate
        ? new Date(booking.startDate).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        : "";
      const endDate = booking.endDate
        ? new Date(booking.endDate).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        : "";
      const exeTime = startDate && endDate ? `${startDate} ~ ${endDate}` : "";

      const orderDate = booking.orderDate
        ? new Date(booking.orderDate).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        : "";

      return {
        id: booking.id,
        image: "/img/testimonials/1/4.png", // Default image, can be replaced with listing image
        name: booking.listingName || "N/A",
        type: booking.listingType || "N/A",
        category: booking.category || "N/A",
        subcategory: booking.subcategory || "N/A",
        orderDate: orderDate,
        exeTime: exeTime,
        totalPrice: `$${booking.totalPrice || 0}`,
        paid: `$${booking.amountPaid || 0}`,
        status: booking.status
          ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
          : "Pending",
        booking: booking, // Store full booking data for reference
      };
    });
  }, [bookings, searchTerm]);

  // Handle filter changes from Filter component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Booking Management </h1>
          <div className="text-15 text-light-1">
            Manage and track bookings for your listings.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            id="booking-button"
            aria-controls={showBookingMenu ? "booking-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={showBookingMenu ? "true" : undefined}
            onClick={(event) => {
              if (hasPermission("bookings_calendar_management", "create")) {
                setAnchorEl(event.currentTarget);
              }
            }}
            className="bg-dark-blue text-white fw-400 text-14 py-10 px-15 rounded-8"
            disabled={!hasPermission("bookings_calendar_management", "create")}
            style={{ opacity: !hasPermission("bookings_calendar_management", "create") ? 0.5 : 1, cursor: !hasPermission("bookings_calendar_management", "create") ? "not-allowed" : "pointer" }}
          >
            {svgIcon.user_add}&nbsp;&nbsp; New Walk-in Booking
          </button>
          <Menu
            id="booking-menu"
            anchorEl={anchorEl}
            open={showBookingMenu}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "booking-button",
            }}
          >
            <MenuItem
              onClick={() => {
                router.push("/vendor/booking/select-service");
              }}
            >
              Single Booking
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/vendor/booking/process");
              }}
            >
              Travel Package Builder
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="row px-10 mb-10">
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

      <Filter 
        filters={filters} 
        onFilterChange={handleFilterChange}
        statusOptions={[
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "cancelled", label: "Cancelled" },
          { value: "completed", label: "Completed" },
        ]}
      />

      <BookingCard data={cardData} />

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
        <div className="row y-gap-20 x-gap-10 justify-between items-center mb-10">
          <div className="col-md-auto position-relative d-flex items-center">
            <input
              type="text"
              placeholder="Search booking..."
              className="border-light bg-white rounded-8 px-10 py-10 pl-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i
              className="icon-search text-light-1 position-absolute"
              style={{
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          {/* <div className="col-auto ms-auto">
            <button className="size-50 rounded-8 flex-center border-light">
              {svgIcon.filter_alt}
            </button>
          </div> */}
        </div>

        <BookingList 
          bookings={filteredBookings} 
          loading={loading} 
          onRefresh={loadBookings}
        />
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
