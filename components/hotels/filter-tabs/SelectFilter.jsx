const SelectFilter = () => {
  return (
    <select className="form-select rounded-4 border-light justify-between text-16 fw-500 px-20 h-50 w-140 sm:w-full text-14">
      <option defaultValue>All</option>
      <option value="properties">Properties</option>
      <option value="animation">Flights</option>
      <option value="design">Rides</option>
      <option value="illustration">Attractions & Events</option>
      <option value="lifestyle">Tours</option>
      <option value="business">Travel Packages</option>
    </select>
  );
};

export default SelectFilter;
