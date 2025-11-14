import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Radio } from "@mui/material";

const Calendar = () => {
  const [activeType, setActiveType] = useState(1);
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  const [events, setEvents] = useState([{ title: "Event" }]);

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
                setActiveType(type.id);
                setEvents([{ ...events[0], title: type.label }]);
              }}
              name="discount-option"
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
              setStartDate(date);
              setEvents([{ ...events[0], start: date.format("YYYY-MM-DD") }]);
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
              setEndDate(date);
              const endDateString = new DateObject(date)
                .add(1, "day")
                .format("YYYY-MM-DD");
              setEvents([{ ...events[0], end: endDateString }]);
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
