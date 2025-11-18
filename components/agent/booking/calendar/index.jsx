"use client";

import AgentDashboardLayout from "../../common/layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState, useEffect, useMemo } from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import Filter from "../../common/Filter";
import CustomEventCalendar from "../../common/CustomEventCalendar";
import { getAvailabilities } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch availabilities from backend
  useEffect(() => {
    const loadAvailabilities = async () => {
      try {
        setLoading(true);
        const response = await getAvailabilities();
        if (response?.data?.data) {
          setAvailabilities(response.data.data);
        }
      } catch (error) {
        console.error("Error loading availabilities:", error);
        toast.error("Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    loadAvailabilities();
  }, []);

  // Transform availability data into FullCalendar events format
  const events = useMemo(() => {
    if (!availabilities || availabilities.length === 0) return [];

    return availabilities.map((availability) => {
      const date = new Date(availability.date);
      const dateStr = date.toISOString().split("T")[0];
      const roomTypeName = availability.room_type?.name || "Room Type";
      const isAvailable = availability.is_available;

      return {
        id: availability.id,
        title: `${roomTypeName}: ${isAvailable ? "Available" : "Not Available"}`,
        start: dateStr,
        color: isAvailable ? "#28a745" : "#dc3545",
        extendedProps: {
          availability: availability,
        },
      };
    });
  }, [availabilities]);

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
  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 justify-between items-end mb-10">
        <div className="col-12">
          <h1 className="text-30 lh-14 fw-600">Booking Calendar</h1>
          <div className="text-15 text-light-1">
            Manage and track bookings for your listings in calendar view.
          </div>
        </div>
      </div>

      <div className="bg-white border-light rounded-8 py-20 px-20">
        {/* <div className="row y-gap-10 x-gap-10 justify-between items-center mb-10">
          <div className="col-auto">
            <h1 className="text-24 fw-600">Booking Calendar</h1>
          </div>
          <div className="col-md-auto d-flex justify-end items-center">
            <button className="border-light text-16 h-50 px-15 rounded-8 mr-10 d-flex items-center">
              {svgIcon.filter_alt}&nbsp;<span>Status Filter</span>
            </button>
            <select className="form-select rounded-8 border-light justify-between text-16 px-15 h-50 w-140 text-14">
              <option value="" defaultValue>
                All Statuses
              </option>
            </select>
          </div>
        </div> */}
        {/* <div className="d-flex items-center mb-20">
          <span className="bg-blue-1 text-white text-10 rounded-100 px-10 mr-5">
            Confirmed
          </span>
          <span className="bg-dark-yellow text-white text-10 rounded-100 px-10 mr-5">
            Pending
          </span>
          <span className="bg-red-1 text-white text-10 rounded-100 px-10 mr-5">
            Cancelled
          </span>
        </div> */}
        <div className="d-flex">
          <div className="px-5 mt-10 mb-10 py-5 bg-light-2 rounded-8">
            {tabs.map((item) => (
              <button
                className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                  activeTab === item.value ? "bg-white" : "text-light-1"
                }`}
                key={item.value}
                onClick={() => setActiveTab(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <Filter />
        <div className="border-light rounded-8 py-20">
          {tabs.map((item) => item.value == activeTab && item.content)}
        </div>
      </div>
    </AgentDashboardLayout>
  );
};

export default index;
