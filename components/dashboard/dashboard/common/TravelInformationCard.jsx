const TravelerInformationCard = ({ index }) => {
  return (
    <div className="col-12 border-light rounded-8 py-20 px-20 w-full ml-15 mt-10">
      <div className="d-flex justify-between items-center mb-10">
        <h1 className="text-15 lh-14 fw-500">Traveler {index + 1}</h1> 
        {index != 0 && <div className="text-13 lh-14 fw-500 w-25">Remove</div>}
      </div>
      <div className="row y-gap-10">
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">First Name</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="John"
          />
        </div>
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Last Name</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="text"
            placeholder="Doe"
          />
        </div>
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Email</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="email"
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="col-6">
          <h1 className="text-15 lh-14 fw-500">Phone Number</h1>
          <input
            className="border-light rounded-8 py-5 px-20 w-full mt-10"
            type="tel"
            placeholder="+1 123 456 7890"
          />
        </div>
      </div>
    </div>
  );
};

export default TravelerInformationCard;