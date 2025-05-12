const SearchItem = ({name, date}) => {
  return (
    <div className="col-12 mt-10 bg-gray-700 px-15 py-10 rounded-md bg-light rounded-8">
      <div className="row justify-between items-center">
        <div className="col-sm-12 col-md-auto">
          <div className="text-14 lh-16 rounded-4 fw-600">{name}</div>
          <div className="text-12 text-light-1 lh-16 fw-400">
            Saved on {date}
          </div>
        </div>

        <div className="col-auto">
          <button className="text-12 lh-16 rounded-4 mr-15 fw-600">
            Search Again
          </button>
          <button className="text-12 lh-16 rounded-4 fw-600">
            <i className="icon-close text-10"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
