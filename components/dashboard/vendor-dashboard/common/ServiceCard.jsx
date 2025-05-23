const ServiceCard = ({ selectedService, setSelectedService }) => {
  const data = [
    {
      name: "Flights",
      image: "/img/dashboard/services/flight_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Properties",
      image: "/img/dashboard/services/property_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Rides",
      image: "/img/dashboard/services/ride_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Tours",
      image: "/img/dashboard/services/tour_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Attractions/Events",
      image: "/img/dashboard/services/attr_events_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
  ];

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div
            className={
              "py-30 px-30 rounded-8 bg-white shadow-3 " +
              (item.name == selectedService?.name
                ? "border-blue-1"
                : "border-light")
            }
            onClick={() => {
              setSelectedService(item);
            }}
          >
            <div className="row y-gap-20 justify-between items-center">
              <div className="row-auto">
                {item.name == selectedService?.name ? (
                  <img src="/img/dashboard/icons/checked.svg" alt="icon" />
                ) : (
                  <img src={item.icon} alt="icon" />
                )}
                <div className="text-15 lh-14 fw-500 mt-5">{item.name}</div>
              </div>
              <div className="col-12 blogCard -type-1">
                <div className="blogCard__image">
                  <div className="rounded-8 d-flex justify-center">
                    <img
                      style={{ height: "150px", objectFit: "fill" }}
                      className="cover img-fluid"
                      src={item.image}
                      alt="image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
