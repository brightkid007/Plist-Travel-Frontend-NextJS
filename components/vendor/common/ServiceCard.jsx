const ServiceCard = ({ selectedService, setSelectedService, data = [] }) => {
  const handleCardClick = (item) => {
    // Update selected service state only (no navigation)
    if (setSelectedService) {
      setSelectedService(item);
    }
  };

  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
          <div
            className={
              "py-30 px-30 rounded-8 bg-white shadow-3 cursor-pointer transition-all hover:shadow-4 " +
              (item.name == selectedService?.name
                ? "border-blue-1 border-2"
                : "border-light")
            }
            onClick={() => handleCardClick(item)}
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
