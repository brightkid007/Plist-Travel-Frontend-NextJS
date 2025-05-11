
const SearchItem = () => {
    return (
        <div className="col-12 row bg-gray-700 p-2 rounded-md border-light rounded-8">
            <div className="col-8 flex">
                <p className="text-14 text-black">Hotels in Paris</p>
                <p className="text-12 text-gray-500">Saved on 2023-05-15</p>
            </div>

            <div className="col-4 justify-between">
                <button className="text-14 text-black">
                    Search Again
                </button>
                <button className="text-14 text-black">
                    X
                </button>
            </div>
        </div>
    )
}

export default SearchItem;