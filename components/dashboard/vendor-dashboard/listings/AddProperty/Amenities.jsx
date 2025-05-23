const Amenities = () => {
  return (
    <div className="row y-gap-10 x-gap-20">
      <h1 className="text-20 lh-14 fw-600">Amenities and Features</h1>
      <div className="text-16 lh-14 fw-500">Other Features</div>
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <div className="col-sm-4 mt-5" key={"air" + index}>
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Air Conditioner</div>
            </div>
          </div>
        ))}
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <div className="col-sm-4 mt-5" key={"bar/restaurant" + index}>
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Bar / Restaurant</div>
            </div>
          </div>
        ))}
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <div className="col-sm-4 mt-5" key={"breakfast" + index}>
            <div className="form-checkbox d-flex items-center">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
              <div className="text-14 fw-500 ml-10">Breakfast Included</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Amenities;
