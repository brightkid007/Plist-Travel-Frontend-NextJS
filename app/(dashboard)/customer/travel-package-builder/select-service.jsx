import ServiceCard from "@/components/dashboard/dashboard/travel-package-builder/ServiceCard";
export const SelectService = () => {
  return (
    <div className="row y-gap-20 py-30 px-30 rounded-8 bg-white shadow-3">
      <h1 className="text-20 lh-14 fw-600">Select Services</h1>
      <h1 className="text-18 lh-14 fw-500">Select Type of Services</h1>
      <div className="text-15 text-light-1">
        Choose one or more services to include in your booking. Selecting
        multiple services will create a package.
      </div>
      <ServiceCard />
      <div className="border-top-light mt-30 pt-30 row y-gap-20 ">
        <h1 className="text-20 lh-14 fw-500">Package Information</h1>
        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Package Title</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="e.g. Bali Gateway Package"
          />
        </div>
        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Package Description</h1>
          <textarea
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            rows="3"
            placeholder="Describe the unique features of this package..."
          />
        </div>
        <div className="col-12 px-30">
          <div className="row y-gap-20 justify-between items-end">
            <button className="button rounded-8 py-10 px-30 text-12 -dark-1 border-light text-light-1 col-auto">
              <i className="icon icon-chevron-left mr-10" /> Back
            </button>
            <button className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto">
              Continue
              <i className="icon icon-chevron-right ml-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
