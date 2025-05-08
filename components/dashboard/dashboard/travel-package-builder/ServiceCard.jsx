"use client";

const ServiceCard = () => {
  const data = [
    {
      name: "Flights",
      image: "/img/destinations/4/1.png",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: true,
    },
    {
      name: "Hotels",
      image: "/img/destinations/4/2.png",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Ground Transportation",
      image: "/img/destinations/4/2.png",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: true,
    },
    {
      name: "Tours",
      image: "/img/destinations/4/2.png",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: true,
    },
    {
      name: "Activities/Events",
      image: "/img/destinations/4/2.png",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: true,
    },
  ];
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-4 col-md-6">
          <div className={"py-30 px-30 rounded-8 bg-white shadow-3 " + (item.selected ? "border-blue-1" : "border-light")}>
            <div className="row y-gap-20 justify-between items-center">
              <div className="row-auto">
                {item.selected ? <img src="/img/dashboard/icons/checked.svg" alt="icon" /> : <img src={item.icon} alt="icon" />}
                <div className="text-15 lh-14 fw-500 mt-5">
                  {item.name}
                </div>
              </div>
              <div className="col-auto">
                <img src={item.image} alt="image" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCard;
