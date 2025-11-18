"use client";

import VendorDashboardLayout from "../../common/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect, useMemo } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import Filter from "../../common/Filter";
import CustomEventCalendar from "../../common/CustomEventCalendar";
import { getVendorBookings, getMyListings, getRoomTypes } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    is_active: "all",
    status: "all",
    date_from: "",
    date_to: "",
    listing_type: "all",
  });

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, listingsRes, roomTypesRes] = await Promise.all([
          getVendorBookings().catch(() => ({ data: { bookings: [] } })),
          getMyListings({ type: "property" }).catch(() => ({ data: [] })),
          getRoomTypes().catch(() => ({ data: [] }))
        ]);

        setBookings(bookingsRes?.data?.bookings || bookingsRes?.bookings || []);
        setListings(listingsRes?.data || listingsRes || []);
        setRoomTypes(roomTypesRes?.data || roomTypesRes || []);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (key, date) => {
    if (date && date.isValid) {
      const dateString = date.format("YYYY-MM-DD");
      handleFilterChange(key, dateString);
    } else {
      handleFilterChange(key, "");
    }
  };

  // Apply filters to data
  const filteredListings = useMemo(() => {
    if (filters.listing_type === "all") return listings;
    return listings.filter((listing) => listing.type === filters.listing_type);
  }, [listings, filters.listing_type]);

  const filteredRoomTypes = useMemo(() => {
    if (filters.listing_type === "all") return roomTypes;
    const filteredListingIds = new Set(filteredListings.map((l) => parseInt(l.id, 10)));
    return roomTypes.filter((rt) => {
      const listingId = parseInt(rt.listing_id || rt.listing?.id, 10);
      return filteredListingIds.has(listingId);
    });
  }, [roomTypes, filteredListings, filters.listing_type]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by status
    if (filters.is_active !== "all") {
      // For bookings, we might want to filter by status instead
      // This depends on what "active" means for bookings
      if (filters.is_active === "true") {
        filtered = filtered.filter((b) => b.status === "confirmed");
      } else if (filters.is_active === "false") {
        filtered = filtered.filter((b) => b.status !== "confirmed");
      }
    }

    // Filter by date range
    if (filters.date_from) {
      const fromDate = new Date(filters.date_from);
      filtered = filtered.filter((b) => {
        if (!b.endDate) return false;
        const endDate = new Date(b.endDate);
        return endDate >= fromDate;
      });
    }

    if (filters.date_to) {
      const toDate = new Date(filters.date_to);
      filtered = filtered.filter((b) => {
        if (!b.startDate) return false;
        const startDate = new Date(b.startDate);
        return startDate <= toDate;
      });
    }

    // Filter by listing type (through room type or listing)
    if (filters.listing_type !== "all") {
      const filteredListingIds = new Set(filteredListings.map((l) => parseInt(l.id, 10)));
      filtered = filtered.filter((b) => {
        const listingId = parseInt(b.listingId || b.listing_id, 10);
        return filteredListingIds.has(listingId);
      });
    }

    return filtered;
  }, [bookings, filters, filteredListings]);

  // Helper function to get all dates between two dates
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Calculate availability events based on bookings and room type calendar settings
  const events = useMemo(() => {
    if (loading || filteredRoomTypes.length === 0) return [];

    const events = [];
    
    // Determine date range for events
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Default: 1 month ago
    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 12); // Default: 12 months ahead

    // Override with filter dates if provided
    if (filters.date_from) {
      const fromDate = new Date(filters.date_from);
      if (fromDate > startDate) startDate = fromDate;
    }
    if (filters.date_to) {
      const toDate = new Date(filters.date_to);
      if (toDate < endDate) endDate = toDate;
    }

    // Get all booked dates grouped by room type
    const bookedDatesByRoomType = {};
    filteredBookings
      .filter(booking => booking.startDate && booking.endDate && booking.status !== "cancelled")
      .forEach(booking => {
        const roomTypeId = booking.roomTypeId || booking.room_type_id;
        if (roomTypeId) {
          const bookedDates = getDatesBetween(booking.startDate, booking.endDate);
          if (!bookedDatesByRoomType[roomTypeId]) {
            bookedDatesByRoomType[roomTypeId] = new Set();
          }
          bookedDates.forEach(date => bookedDatesByRoomType[roomTypeId].add(date));
        }
      });

    // Process each room type
    filteredRoomTypes.forEach(roomType => {
      const roomTypeId = parseInt(roomType.id, 10);
      const roomTypeName = roomType.name || `Room Type ${roomTypeId}`;
      const calendarType = roomType.calendar_type || 1; // 1 = Open, 2 = Blocked
      const calendarStartDate = roomType.calendar_start_date ? new Date(roomType.calendar_start_date) : null;
      const calendarEndDate = roomType.calendar_end_date ? new Date(roomType.calendar_end_date) : null;
      const blockedDates = Array.isArray(roomType.blocked_dates) ? roomType.blocked_dates : [];
      const availableDates = Array.isArray(roomType.available_dates) ? roomType.available_dates : [];
      const bookedDates = bookedDatesByRoomType[roomTypeId] || new Set();

      // Generate dates for the calendar period
      const currentDate = new Date(startDate);
      const calendarEnd = endDate;

      while (currentDate <= calendarEnd) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const dateObj = new Date(currentDate);

        // Check if date is within calendar period
        let isWithinPeriod = true;
        if (calendarStartDate && dateObj < calendarStartDate) {
          isWithinPeriod = false;
        }
        if (calendarEndDate && dateObj > calendarEndDate) {
          isWithinPeriod = false;
        }

        if (!isWithinPeriod) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // Determine availability based on calendar type
        let isAvailable = false;

        if (calendarType === 1) {
          // Open Calendar: Available by default, except blocked dates and booked dates
          isAvailable = !blockedDates.includes(dateStr) && !bookedDates.has(dateStr);
        } else if (calendarType === 2) {
          // Blocked Calendar: Only available dates are available, minus booked dates
          isAvailable = availableDates.includes(dateStr) && !bookedDates.has(dateStr);
        }

        events.push({
          id: `availability-${roomTypeId}-${dateStr}`,
          title: `${roomTypeName}: ${isAvailable ? "Available" : "Not Available"}`,
          start: dateStr,
          color: isAvailable ? "#28a745" : "#dc3545",
          extendedProps: {
            roomTypeId: roomTypeId,
            roomTypeName: roomTypeName,
            date: dateStr,
            isAvailable: isAvailable,
          },
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return events;
  }, [filteredBookings, filteredListings, filteredRoomTypes, loading, filters.date_from, filters.date_to]);

  function renderEventContent(eventInfo) {
    return <span className="text-14 fw-500 lh-1">{eventInfo.event.title}</span>;
  }

  const [activeTab, setActiveTab] = useState("events");
  const tabs = [
    {
      label: "Events",
      value: "events",
      content: <CustomEventCalendar />,
    },
    {
      label: "Availability",
      value: "availability",
      content: (
        <div className="px-20">
          {loading ? (
            <div className="d-flex justify-center items-center py-40">
              <div className="text-16 text-light-1">Loading availability data...</div>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              headerToolbar={{
                start: "prev,next,today",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventContent={renderEventContent}
            />
          )}
        </div>
      ),
    },
  ];

  // Determine status based on dates and is_active
  const getStatusValue = () => {
    if (filters.is_active !== undefined && filters.is_active !== "all") {
      return filters.is_active === "true" || filters.is_active === true ? "active" : "inactive";
    }
    return filters.status || "all";
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-10 justify-between items-end mb-10">
        <div className="col-12">
          <h1 className="text-30 lh-14 fw-600">Booking Calendar</h1>
          <div className="text-15 text-light-1">
            Manage and track bookings for your listings in calendar view.
          </div>
        </div>
      </div>

      <div className="bg-white border-light rounded-8 py-20 px-20">
        <div className="d-flex">
          <div className="px-5 mt-10 mb-10 py-5 bg-light-2 rounded-8">
            {tabs.map((item) => (
              <button
                className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"}`}
                key={item.value}
                onClick={() => setActiveTab(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">
          <div className="col-sm-auto">
            <select
              className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
              value={getStatusValue()}
              onChange={(e) => {
                const status = e.target.value;
                if (status === "all") {
                  handleFilterChange("is_active", "all");
                  handleFilterChange("status", "all");
                } else if (status === "active") {
                  handleFilterChange("is_active", "true");
                } else if (status === "inactive") {
                  handleFilterChange("is_active", "false");
                } else {
                  handleFilterChange("status", status);
                }
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>


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
              />
            </div>
          </div>

          <div className="col-sm-auto">
            <select
              className="form-select rounded-8 border-light justify-between py-10 px-15 w-140 sm:w-full text-14"
              value={filters.listing_type || "all"}
              onChange={(e) => handleFilterChange("listing_type", e.target.value)}
            >
              <option value="all">All Types</option>
              <optgroup label="Property List">
                <option value="property">Property</option>
              </optgroup>
              <optgroup label="Non-Property List">
                <option value="tour">Tour</option>
                <option value="activity">Activity</option>
                <option value="event">Event</option>
              </optgroup>
            </select>
          </div>
        </div>
        <div className="border-light rounded-8 py-20">
          {tabs.map((item) => item.value == activeTab && item.content)}
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
