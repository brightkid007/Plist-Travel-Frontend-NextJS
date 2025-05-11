import MainFilterSearchBox from "./MainFilterSearchBox";

const index = () => {
  return (
    <section className="masthead -type-1 z-5">
      <div className="masthead__bg">
        <img alt="image" src="/Images/Group-254.png" className="js-lazy" />
      </div>
      <div className="container">
        <div className="row justify-center">
          <div className="col-auto">
            <div className="text-center">
              <h1
                className="text-60 lg:text-40 md:text-30 text-white"
                data-aos="fade-up"
              >
                Find Your Perfect Travel Experience
              </h1>
              <p
                className="text-white mt-6 md:mt-10"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Discover the best properties, flights, rides, attractions & events, and more at unbeatable prices
              </p>
            </div>
            {/* End hero title */}

            <div
              className="tabs -underline mt-60 js-tabs"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <MainFilterSearchBox />
            </div>
            {/* End tab-filter */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
