import svgIcon from "@/components/data/svgIcon";

const Settings = () => {
  const checkTimeList = [
    { label: "12:00 AM", value: 0 },
    { label: "1:00 AM", value: 1 },
    { label: "2:00 AM", value: 2 },
    { label: "3:00 AM", value: 3 },
    { label: "4:00 AM", value: 4 },
    { label: "5:00 AM", value: 5 },
    { label: "6:00 AM", value: 6 },
    { label: "7:00 AM", value: 7 },
    { label: "8:00 AM", value: 8 },
    { label: "9:00 AM", value: 9 },
    { label: "10:00 AM", value: 10 },
    { label: "11:00 AM", value: 11 },
    { label: "12:00 PM", value: 12 },
    { label: "1:00 PM", value: 13 },
    { label: "2:00 PM", value: 14 },
    { label: "3:00 PM", value: 15 },
    { label: "4:00 PM", value: 16 },
    { label: "5:00 PM", value: 17 },
    { label: "6:00 PM", value: 18 },
    { label: "7:00 PM", value: 19 },
    { label: "8:00 PM", value: 20 },
    { label: "9:00 PM", value: 21 },
    { label: "10:00 PM", value: 22 },
    { label: "11:00 PM", value: 23 },
  ];

  return (
    <div className="col-12 px-5 py-5">
      <div className="row y-gap-10 x-gap-10 bg-white py-15 px-15 rounded-8 border-light">
        <h1 className="text-24 lh-1 fw-500">Operational Settings</h1>
        <div className="text-14 lh-1 text-light-1">
          Configure your operational preferences and policies.
        </div>
        <div className="col-12 mt-10">
          <h1 className="text-15 fw-500">Minimum Booking Lead Time</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="24-hours">24 hours</option>
          </select>
          <div className="text-12 lh-1 text-light-1 mt-10">
            Minimum time before check-in that bookings can be made
          </div>
        </div>
        <div className="col-12 mt-5 pb-15 border-bottom-light">
          <h1 className="text-15 fw-500">Maximum Advance Booking</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="1-year">1 year</option>
          </select>
          <div className="text-12 lh-1 text-light-1 mt-10">
            How far in advance bookings can be made
          </div>
        </div>

        <div className="col-12 mt-5">
          <h1 className="text-15 fw-500">Minimum Stay</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="1-night">1 night</option>
          </select>
        </div>

        <div className="col-12 pb-15 border-bottom-light mt-5">
          <h1 className="text-15 fw-500">Maximum Stay</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="30-nights">30 nights</option>
          </select>
        </div>

        <div className="col-12 pb-15 border-bottom-light mt-10">
          <h1 className="text-15 fw-500 mb-5">Check-in/Check-out Times</h1>
          <div className="row y-gap-10 x-gap-10">
            <div className="col-sm-6">
              <h1 className="text-14 fw-500">Check-in Time</h1>
              <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
                {checkTimeList.map((time, index) => (
                  <option key={index} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-6">
              <h1 className="text-14 fw-500">Check-out Time</h1>
              <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
                {checkTimeList.map((time, index) => (
                  <option key={index} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="col-12 mt-5">
          <h1 className="text-15 fw-500">Cancellation Policy</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="30-nights">Moderate (5 days before check-in)</option>
          </select>
        </div>

        <div className="col-12 d-flex justify-between items-center">
          <div className="d-flex flex-column items-start">
            <div className="text-14 fw-500">Instant Booking</div>
            <div className="text-12 lh-1 text-light-1">
              Allow guests to book without prior approval
            </div>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input border-light"
              type="checkbox"
              role="switch"
              id="instantBooking"
              checked={true}
            />
          </div>
        </div>

        <div className="col-12 px-15 d-flex justify-end mt-15 mb-15">
          <button className="button -md bg-blue-1 text-white fw-400 rounded-8 px-15 py-10">
            {svgIcon.save}
            <span className="ml-10">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
