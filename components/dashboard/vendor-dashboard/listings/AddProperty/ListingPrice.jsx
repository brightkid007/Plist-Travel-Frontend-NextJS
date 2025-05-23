const ListingPrice = () => {
  return (
    <div className="row y-gap-10 x-gap-20">
      <h1 className="text-20 lh-14 fw-600">Listing Price</h1>
      <div className="col-12 mt-5">
        <div className="border-light rounded-8 px-15 py-15">
          <div className="d-flex justify-between items-center">
            <div className="d-flex flex-column items-start">
              <span className="text-16 fw-500 mb-5 lh-1">Single Room</span>
              <span className="text-14 fw-400 text-light-1 lh-1">2 Person</span>
            </div>
            <span className="text-20 fw-700 lh-1">$50.00</span>
          </div>
          <div className="d-flex justify-between items-center mt-20">
            <div className="d-flex flex-column items-start">
              <span className="text-16 fw-500 mb-5 lh-1">Single Room</span>
              <span className="text-14 fw-400 text-light-1 lh-1">2 Person</span>
            </div>
            <span className="text-20 fw-700 lh-1">$50.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPrice;
