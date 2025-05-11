import SavedBookingCard from "./SavedBookingCard";
import SearchItem from "./SearchItem";

const SavedItems = () => {
    return (
        <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-10">
            <div className="text-20 lh-14 fw-600 px-0">Saved Searches</div>
            <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
                Your saved hotels and searches
            </div>
            
            <div className="row border-light">
                <SearchItem />
                <SearchItem />
            </div>

            <div className="d-flex border-light justify-between">
                <SavedBookingCard
                    name="Hotel California"
                    location="Los Angeles, CA"
                    image="/img/dashboard/hotel1.jpg"
                />
                <SavedBookingCard
                    name="The Grand Budapest Hotel"
                    location="Budapest, Hungary"
                    image="/img/dashboard/hotel2.jpg"
                />
            </div>
        </div>
    )
}

export default SavedItems;