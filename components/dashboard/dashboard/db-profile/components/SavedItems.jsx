import SavedBookingCard from "./SavedBookingCard";
import SearchItem from "./SearchItem";

const SavedItems = () => {
  return (
    <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-15">
      <div className="text-20 lh-14 fw-600 px-0">Saved Searches</div>
      <div className="text-14 text-light-1 lh-14 fw-400 mb-10 px-0">
        Your saved hotels and searches
      </div>

      <SearchItem name={"Hotels in Paris"} date={"2023-05-15"} />
      <SearchItem name={"Flights to Tokyo"} date={"2023-05-10"} />
      <SearchItem name={"Car rentals in Barcelona"} date={"2023-05-05"} />
    </div>
  );
};

export default SavedItems;
