import Link from "next/link";

const CitiesLandmarks = ({ service }) => {
  const landmarks = [
    "AT&T Stadium",
    "American Airlines Center",
    "Six Flags Over Texas",
    "Globe Life Park in Arlington",
    "Medieval Times",
    "University of Texas Southwestern Medical Center",
    "Great Wolf Lodge Dallas",
    "Galleria Dallas",
    "Legoland Discovery Center Dallas Fort Worth",
    "Dallas Mavericks Arena",
    "Billy Bob's Texas",
    "The University of Texas at Arlington",
    "George W Bush Presidential Library",
    "Ford Center at the Star",
    "Sundance Square",
    "Preston Center",
    "The Shops at Legacy",
    "Southern Methodist University",
    "Highland Park Village",
    "Bass Performance Hall",
    "Six Flags Hurricane Harbor",
    "Las Colinas",
    "Stockyards Rodeo",
    "Mockingbird Station",
    "Perot Museum of Nature and Science",
  ];

  const cities = ["Plano", "Irving", "Frisco", "Denton", "McKinney"];

  const airports = [
    "Dallas Love Field Airport",
    "Addison Airport",
    "Dallas-Fort Worth International Airport",
  ];

  return (
    <div className="accordion -simple row y-gap-20 js-accordion">
      <div className="accordion__item">
        <div
          className="accordion__button d-flex justify-between items-center px-20 py-20 rounded-8 bg-light-2"
          data-bs-toggle="collapse"
          data-bs-target={`#cities_landmarks`}
        >
          <div>
            <h2 className="text-22 text-start fw-500">
              Cities and Landmarks near {service?.title}
            </h2>
            <div className="text-12 text-light-1">
              Click here to see more hotels and accommodation near popular
              landmarks in Denton
            </div>
          </div>
          <div className="accordion__icon size-40 flex-center rounded-full">
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </div>
        </div>
        {/* End accordion button */}

        <div
          className="accordion-collapse collapse"
          id="cities_landmarks"
          data-bs-parent="#Faq1"
        >
          <div className="px-15 py-15">
            <div className="row">
              <div className="col-lg-2 col-md-6 col-sm-12">
                <div className="text-16 fw-600 mb-10">Cities</div>
                {cities.map((name, index) => (
                  <div key={index}>
                    <Link href={"/customer/search"} className="text-blue-1">
                      {name}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="text-16 fw-600 mb-10">Airports</div>
                {airports.map((name, index) => (
                  <div key={index}>
                    <Link href={"/customer/search"} className="text-blue-1">
                      {name}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="text-16 fw-600 mb-10">Landmarks</div>
                {landmarks.map((name, index) => (
                  <div key={index}>
                    <Link href={"/customer/search"} className="text-blue-1">
                      {name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* End accordion conent */}
      </div>
    </div>
  );
};

export default CitiesLandmarks;
