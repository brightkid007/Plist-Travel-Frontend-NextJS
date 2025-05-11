const DiscountCard = ({ name, description, points, image }) => {
    return (
      <div className="col-md-6 col-sm-12 row mr-10 mb-10">
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
            <div className="text-12 lh-16 text-light-1 fw-400">{description}</div>
            <div className="text-12 lh-16 text-blue-1 fw-500 mt-5">
              {points} points
            </div>
          </div>
          <button className="text-12 lh-16 rounded-4 py-5 px-15 text-white bg-blue-1 fw-400">
            Not Enough Points
          </button>
        </div>
      </div>
    );
};

export default DiscountCard;