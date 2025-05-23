import MapFinder from "@/components/common/MapFinder";

const Location = () => {
  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Listing Location</h1>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Address</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter address"
        />
      </div>

      <div className="col-sm-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Postal Code</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter postal code"
        />
      </div>

      <div className="col-12 mt-5">
        <div
          className="border-light rounded-8 px-10"
          style={{ height: "300px"}}
        >
          <MapFinder />
        </div>
      </div>
    </div>
  );
};

export default Location;
