import svgIcon from "@/components/data/svgIcon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const Availability = () => {
  const operatingHours = [
    { day: "Monday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Tuesday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Wednesday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Thursday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Friday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Saturday", open: "9:00 AM", close: "5:00 PM", isOpen: true },
    { day: "Sunday", open: "9:00 AM", close: "5:00 PM", isOpen: false },
  ];

  const closures = [
    { title: "Holiday Closure", period: "December 24-26, 2023" },
    { title: "Maintenance", period: "January 15-17, 2024" },
  ];

  return (
    <div className="row y-gap-20 x-gap-10 justify-between">
      <div className="col-xl-6 col-lg-12 px-20">
        <div className="row y-gap-10 border-light rounded-8 py-15 px-5 bg-white h-100">
          <h1 className="text-24 lh-1 fw-500">Service Availability</h1>
          <div className="text-14 lh-1 text-light-1">
            Set your overall service availability status.
          </div>
          <div className="col-12 d-flex justify-between items-center py-15 border-bottom-light">
            <div className="d-flex flex-column items-start">
              <div className="text-14 fw-500">Service Active</div>
              <div className="text-14 lh-1 text-light-1">
                When turned off, all your listings will be marked as
                unavailable.
              </div>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input border-light"
                type="checkbox"
                role="switch"
                id="serviceActive"
                checked={true}
              />
            </div>
          </div>
          <div className="text-14 fw-500 mt-5">Operating Hours</div>
          {operatingHours.map((item, index) => (
            <div
              className="col-12 d-flex justify-between items-center"
              key={index}
            >
              <div className="d-flex items-center">
                <div className="text-12 text-white bg-dark-3 rounded-100 py-0 px-10 mr-10">
                  {item.day}
                </div>
                <div className="text-14 lh-1">
                  {item.isOpen ? `${item.open} - ${item.close}` : "Closed"}
                </div>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input border-light"
                  type="checkbox"
                  role="switch"
                  id="serviceActive"
                  checked={item.isOpen}
                />
              </div>
            </div>
          ))}
          <div className="text-14 fw-500 mt-5">Special Closures</div>
          {closures.map((item, index) => (
            <div className="col-12 px-15" key={index}>
              <div className="d-flex justify-between items-center px-10 py-10 rounded-8 border-light">
                <div className="d-flex flex-column items-start">
                  <div className="text-16 lh-1 fw-500">{item.title}</div>
                  <div className="text-14 lh-1 text-light-1 mt-5">
                    {item.period}
                  </div>
                </div>
                <button className="button -md border-light rounded-8 px-15 py-10">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="col-12 px-15">
            <button className="button -md border-light rounded-8 w-100 py-10">
              Add Special Closure
            </button>
          </div>
          <div className="col-12 px-15 d-flex justify-end mt-15 mb-15">
            <button className="button -md bg-blue-1 text-white fw-400 rounded-8 px-15 py-10">
              {svgIcon.save}
              <span className="ml-10">Save Changes</span>
            </button>
          </div>
        </div>
      </div>
      <div className="col-xl-6 col-lg-12">
        <div className="d-flex flex-column y-gap-10 border-light rounded-8 py-15 px-20 bg-white h-100">
          <h1 className="text-24 lh-1 fw-500">Calendar View</h1>
          <div className="text-14 lh-1 text-light-1">
            View and manage your availability by date.
          </div>
          <div className="pt-20 mt-10 border-light rounded-8 bg-white">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>

          <div className="px-15 mt-10 d-flex justify-start items-center">
            <span className="bg-green-2 px-5 py-5 rounded-full mr-10"></span>
            <span className="text-14 lh-1 text-light-1">Available</span>
          </div>
          <div className="px-15 mt-10 d-flex justify-start items-center">
            <span className="bg-red-1 px-5 py-5 rounded-full mr-10"></span>
            <span className="text-14 lh-1 text-light-1">Unavailable</span>
          </div>
          <div className="px-15 mt-10 d-flex justify-start items-center">
            <span className="bg-yellow-3 px-5 py-5 rounded-full mr-10"></span>
            <span className="text-14 lh-1 text-light-1">Partially Booked</span>
          </div>
          <div className="px-15 mt-10 d-flex justify-start items-center">
            <span className="bg-blue-1 px-5 py-5 rounded-full mr-10"></span>
            <span className="text-14 lh-1 text-light-1">Fully Booked</span>
          </div>
          <div className="px-15 mt-30 text-14 lh-1 fw-500">
            Selected Date: November 15, 2023
          </div>
          <div className="px-15 mt-10 d-flex justify-start items-center">
            <select className="form-select rounded-8 border-light px-15 justify-between fw-400 w-180 py-10 text-15">
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="partially-booked">Partially Booked</option>
              <option value="fully-booked">Fully Booked</option>
            </select>
            <button className="button -md bg-blue-1 text-white fw-400 rounded-8 px-15 py-10 ml-10">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
