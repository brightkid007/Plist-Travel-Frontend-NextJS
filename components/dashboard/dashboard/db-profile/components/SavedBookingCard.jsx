const SavedBookingCard = ({ name, location, image }) => {
  return (
    <div className="col-md-6 col-sm-12">
      <div className="row mt-10">
        <div className="col-4 px-0">
          <img
            src={image}
            alt=""
            className="rounded-start"
            style={{ width: "100%", height: "135px", objectFit: "fill" }}
          />
        </div>
        <div className="col-8 bg-blue-2 px-15 py-10 rounded-end d-flex flex-column items-start justify-between">
          <div>
            <div className="text-14 lh-16 fw-600">{name}</div>
            <div className="text-12 lh-16 text-light-1 fw-400">{location}</div>
          </div>
          <div className="d-flex justify-between w-100">
            <button className="text-12 lh-16 rounded-4 py-5 px-15 fw-600">
              View
            </button>
            <button className="text-12 lh-16 rounded-4 py-5 px-5 fw-600">
              <i className="icon-close text-10"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedBookingCard;
