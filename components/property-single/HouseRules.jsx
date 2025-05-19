const HouseRules = () => {
  return (
    <div className="rounded-8 border-light px-15 py-15">
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-start">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">login</span>
          <span className="text-16 fw-600 ml-10">Check-in</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">From 15:00</div>
          <div className="text-14 lh-14 text-light-1">
            Guests are required to show a photo identification and credit card
            upon check-in
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-center">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-16 fw-600 ml-10">Check-out</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">Until 11:00</div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-start">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">info</span>
          <span className="text-16 fw-600 ml-10">Cancellation/ prepayment</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">
            Cancellation and prepayment policies vary according to accommodation
            type. <br /> Please check what{" "}
            <span className="text-blue-1 underline">conditions</span> may apply
            to each option when making your selection.
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-start">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">groups</span>
          <span className="text-16 fw-600 ml-10">Children and beds</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-16 fw-600 lh-14 mb-10">Child policies</div>
          <div className="text-14 lh-14 mb-10">
            Children of any age are welcome.
          </div>
          <div className="text-14 lh-14 mb-10">
            Children 18 years and above will be charged as adults at this
            property.
          </div>
          <div className="text-14 lh-14 mb-10">
            To see correct prices and occupancy information, please add the
            number of children in your group and their ages to your search.
          </div>
          <div className="text-16 fw-600 lh-14 mb-10">
            Cot and extra bed policies
          </div>
          <div className="text-14 lh-14 mb-10">
            Cots and extra beds are not available at this property.
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-center">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">man_2</span>
          <span className="text-16 fw-600 ml-10">Age restriction</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">
            The minimum age for check-in is 18
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-center">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">pets</span>
          <span className="text-16 fw-600 ml-10">Pets</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">
            Pets are allowed. No extra charges.
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-center">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">groups</span>
          <span className="text-16 fw-600 ml-10">Groups</span>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="text-14 lh-14">
            When booking more than 10 rooms, different policies and additional
            supplements may apply.
          </div>
        </div>
      </div>
      <div className="border-top-light"></div>
      <div className="row x-gap-20 y-gap-10 px-15 py-15 items-center">
        <div className="col-lg-3 col-md-12 d-flex items-center">
          <span className="material-symbols-outlined">credit_card</span>
          <span className="text-16 fw-600 ml-10">
            Cards accepted at this hotel
          </span>
        </div>
        <div className="col-lg-6 col-md-12">
          
        </div>
      </div>
    </div>
  );
};

export default HouseRules;
