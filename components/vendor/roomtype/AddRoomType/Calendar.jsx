import { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Radio } from "@mui/material";

const Calendar = ({ roomTypeData, updateRoomTypeData }) => {
  // Calendar type: 1 = Open Calendar, 2 = Blocked Calendar
  const activeType = roomTypeData?.calendar_type || 1;
  
  // Start and end dates for date range selection
  const startDate = roomTypeData?.calendar_start_date 
    ? new DateObject(roomTypeData.calendar_start_date)
    : new DateObject();
  const endDate = roomTypeData?.calendar_end_date
    ? new DateObject(roomTypeData.calendar_end_date)
    : new DateObject();
  
  // Blocked/available dates (array of date strings)
  const blockedDates = roomTypeData?.blocked_dates || [];
  const availableDates = roomTypeData?.available_dates || [];
  
  const [events, setEvents] = useState([]);
  
  // Update events when calendar data changes
  useEffect(() => {
    const calendarEvents = [];
    
    // Add start/end date range event if set
    if (roomTypeData?.calendar_start_date && roomTypeData?.calendar_end_date) {
      calendarEvents.push({
        title: activeType === 1 ? "Open Calendar Period" : "Blocked Calendar Period",
        start: roomTypeData.calendar_start_date,
        end: roomTypeData.calendar_end_date,
        backgroundColor: activeType === 1 ? "#4CAF50" : "#F44336",
      });
    }
    
    // Add blocked dates as events (only if calendar type is Open)
    if (activeType === 1 && blockedDates.length > 0) {
      blockedDates.forEach(date => {
        calendarEvents.push({
          title: "Blocked",
          start: date,
          backgroundColor: "#F44336",
          display: "background",
        });
      });
    }
    
    // Add available dates as events (only if calendar type is Blocked)
    if (activeType === 2 && availableDates.length > 0) {
      availableDates.forEach(date => {
        calendarEvents.push({
          title: "Available",
          start: date,
          backgroundColor: "#4CAF50",
          display: "background",
        });
      });
    }
    
    setEvents(calendarEvents);
  }, [activeType, roomTypeData?.calendar_start_date, roomTypeData?.calendar_end_date, blockedDates, availableDates]);

  const calendarTypes = [
    {
      id: 1,
      label: "Open Calendar",
      description:
        "An open calendar means your place is available most of the time. You can block off any dates you’d like.",
    },
    {
      id: 2,
      label: "Blocked Calendar",
      description:
        "A blocked calendar means your place has limited availability. You can open any dates you’d like.",
    },
  ];

  function renderEventContent(eventInfo) {
    return <span className="text-14 fw-500 lh-1">{eventInfo.event.title}</span>;
  }

  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Availability Calendar</h1>
      <div className="col-12">
        {calendarTypes.map((type, index) => (
          <div className="d-flex items-end gap-2" key={index}>
            <Radio
              className="flex-shrink-0" 
              checked={activeType === type.id}
              onChange={() => {
                updateRoomTypeData({ calendar_type: type.id });
              }}
              name="calendar-type"
              value={type.id}
            />
            <div className="flex-grow-1">
              <div className="text-14 fw-500 lh-1">{type.label}</div>
              <div className="text-12 text-light-1 lh-1 mt-5">
                {type.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">Start Date</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={startDate}
            onChange={(date) => {
              const dateString = date ? date.format("YYYY-MM-DD") : null;
              updateRoomTypeData({ calendar_start_date: dateString });
            }}
            placeholder="Start Date"
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>
      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">End Date</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={endDate}
            onChange={(date) => {
              const dateString = date ? date.format("YYYY-MM-DD") : null;
              updateRoomTypeData({ calendar_end_date: dateString });
            }}
            placeholder="End Date"
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>
      <div className="col-12 mt-10">
        <div className="border-light rounded-8 py-15 px-15">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={events}
            eventContent={renderEventContent}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
