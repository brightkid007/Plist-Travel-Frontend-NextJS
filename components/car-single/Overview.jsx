import Amenities from "./Amenities";
import Specifications from "./Specifications";

const Overview = () => {
  return (
    <>
      <div className="border-top-light mt-40 pt-40 mb-40">
        <h3 className="text-22 fw-500">Overview</h3>
        <p className="text-dark-1 text-15 mt-20">
          Unless you hire a car, visiting Stonehenge, Bath, and Windsor Castle
          in one day is next to impossible. Designed specifically for travelers
          with limited time in London, this tour allows you to check off a range
          of southern England&lsquo;s historical attractions in just one day by
          eliminating the hassle of traveling between each one independently.
          Travel by comfortable coach and witness your guide bring each UNESCO
          World Heritage Site to life with commentary. Plus, all admission
          tickets are included in the tour price.
        </p>
        <a
          href="#"
          className="d-block text-14 text-blue-1 fw-500 underline mt-10"
        >
          Show More
        </a>
      </div>
      {/* End overview */}
    </>
  );
};

export default Overview;
