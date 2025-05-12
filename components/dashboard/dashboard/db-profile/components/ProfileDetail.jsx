const ProfileDetail = () => {
  return (
    <>
      <div className="row mt-30 border-light rounded-8 bg-white shadow-3 px-15 py-15">
        <div className="text-20 lh-14 fw-600 px-0">Profile Information</div>
        <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
          Update your personal information and contact details
        </div>
        <div className="col-12 mb-20">
          <div className="row mb-20 y-gap-10">
            <div className="col-6">
              <h1 className="text-15 lh-14 fw-500">Name</h1>
              <input
                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                type="text"
                placeholder="asf"
              />
            </div>
            <div className="col-6">
              <h1 className="text-15 lh-14 fw-500">Email</h1>
              <input
                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                type="text"
                placeholder="asdfasdf@asdfasdf.com"
              />
            </div>
          </div>
          <div className="col-12 mb-20">
            <h1 className="text-15 lh-14 fw-500">Bio</h1>
            <input
              className="border-light rounded-8 py-5 px-20 w-full mt-10"
              type="text"
              placeholder="Travel enthusiast and foodie. Love exploring new places and cultures."
            />
          </div>

          <div className="row mb-20 y-gap-10">
            <div className="col-6">
              <h1 className="text-15 lh-14 fw-500">Phone Number</h1>
              <input
                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                type="text"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="col-6">
              <h1 className="text-15 lh-14 fw-500">Address</h1>
              <input
                className="border-light rounded-8 py-5 px-20 w-full mt-10"
                type="text"
                placeholder="123 Main St, New York, NY 10001"
              />
            </div>
          </div>
          <div className="col-12 d-flex justify-end">
            <button className="button rounded-8 py-10 px-30 text-12 -dark-1 bg-dark-3 text-white col-auto">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetail;
