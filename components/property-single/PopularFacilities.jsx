const PopularFacilities = ({ name }) => {
  return (
    <>
      <h3 className="text-22 fw-500 pt-40 border-top-light">
        Most Popular Facilities in {name}
      </h3>
      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-no-smoke"></i>
          <div className="text-15">Non-smoking rooms</div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-wifi"></i>
          <div className="text-15">Free WiFi</div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-parking"></i>
          <div className="text-15">Parking</div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-kitchen"></i>
          <div className="text-15">Kitchen</div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-living-room"></i>
          <div className="text-15">Living Area</div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="d-flex x-gap-15 y-gap-15 items-center">
          <i className="icon-shield"></i>
          <div className="text-15">Safety &amp; security</div>
        </div>
      </div>
    </>
  );
};

export default PopularFacilities;
