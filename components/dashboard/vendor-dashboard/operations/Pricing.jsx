import svgIcon from "@/components/data/svgIcon";

const Pricing = () => {
  const seasons = [
    { title: "Summer Season", period: "June 1 - August 31, 2023", price: 200 },
    {
      title: "Holiday Season",
      period: "December 15 - January 5, 2024",
      price: 250,
    },
  ];
  const discounts = [
    {
      title: "Weekly Discount",
      description: "For stays of 7 nights or more",
      discount: 10,
    },
    {
      title: "Monthly Discount",
      description: "For stays of 28 nights or more",
      discount: 20,
    },
  ];
  return (
    <div className="col-12 px-5 py-5">
      <div className="row y-gap-10 x-gap-10 bg-white py-15 px-15 rounded-8 border-light">
        <h1 className="text-24 lh-1 fw-500">Pricing Structure</h1>
        <div className="text-14 lh-1 text-light-1">
          Set your base pricing and special rates.
        </div>
        <div className="col-sm-6 mt-10">
          <h1 className="text-15 fw-500">Base Price</h1>
          <div className="d-flex items-center mt-5">
            <div
              className="rounded-left-8 bg-light-2 border-light text-light-1 py-5 px-15"
              style={{ marginRight: "-1px" }}
            >
              $
            </div>
            <input
              className="border-light rounded-right-8 py-5 px-15 w-full"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="col-sm-6 mt-10">
          <h1 className="text-15 fw-500">Base Price</h1>
          <select className="form-select border-light rounded-2 py-2 px-3 w-100 mt-5">
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="gbp">GBP (£)</option>
            <option value="cad">CAD ($)</option>
            <option value="aud">AUD ($)</option>
          </select>
        </div>
        <div className="text-12 lh-1 text-light-1 pb-15 border-bottom-light">
          Standard rate per night/session
        </div>
        <div className="text-14 fw-500 lh-1 mt-10">Seasonal Pricing</div>
        {seasons.map((season, index) => (
          <div className="col-12" key={index}>
            <div className="d-flex justify-between items-center border-light rounded-8 py-15 px-15 bg-white">
              <div className="d-flex flex-column items-start">
                <span className="text-14 lh-1 fw-500 mb-5">{season.title}</span>
                <span className="text-12 text-light-1 lh-1">
                  {season.period}
                </span>
              </div>
              <div className="d-flex items-center">
                <span className="text-14 lh-1 fw-500">${season.price}</span>
                <button className="button -sm border-light text-12 fw-500 rounded-8 px-15 py-10 ml-10">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12 pb-15 border-bottom-light">
          <button className="button -sm border-light text-12 fw-500 rounded-8 px-15 py-10">
            Add Seasonal Pricing
          </button>
        </div>
        <div className="text-14 fw-500 lh-1 mt-10">Special Discounts</div>
        {discounts.map((discount, index) => (
          <div className="col-12" key={index}>
            <div className="d-flex justify-between items-center border-light rounded-8 py-15 px-15 bg-white">
              <div className="d-flex flex-column items-start">
                <span className="text-14 lh-1 fw-500 mb-5">
                  {discount.title}
                </span>
                <span className="text-12 text-light-1 lh-1">
                  {discount.description}
                </span>
              </div>
              <div className="d-flex items-center">
                <span className="text-14 lh-1 fw-500">
                  ${discount.discount}
                </span>
                <button className="button -sm border-light text-12 fw-500 rounded-8 px-15 py-10 ml-10">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12">
          <button className="button -sm border-light text-12 fw-500 rounded-8 px-15 py-10">
            Add Special Discount
          </button>
        </div>
        <div className="col-12 px-15 d-flex justify-end mt-15 mb-15">
          <button className="button -md bg-blue-1 text-white fw-400 rounded-8 px-15 py-10">
            {svgIcon.save}
            <span className="ml-10">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
