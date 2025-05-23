import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">When is your listing available</h1>
      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">Start Date</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={startDate}
            onChange={setStartDate}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>
      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">End Date</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full mt-10 cursor-text text-gray-900 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={endDate}
            onChange={setEndDate}
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
            // events={events}
            // eventContent={renderEventContent}
          />
        </div>
      </div>
      <div className="col-12 mt-10 d-flex justify-between items-center">
        <button className="button border-light rounded-8 px-15 py-10 fw-500">Cancel</button>
        <button className="button bg-dark-4 rounded-8 px-15 py-10 text-white fw-500">Apply</button>
      </div>
    </div>
  );
};

export default Calendar;
