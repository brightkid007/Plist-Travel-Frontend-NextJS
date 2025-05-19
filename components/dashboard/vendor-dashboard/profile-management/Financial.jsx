const Financial = () => {
  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Financial Information</div>
      <div className="text-12 text-light-1 lh-1">
        Manage your banking and payment details.
      </div>
      <div className="text-18 fw-500 lh-1 mt-15">Bank Account Details</div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Account Holder Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter account holder name"
        />
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Bank Name</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter bank name"
        />
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Account Number</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter account number"
        />
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Routing Number</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter routing number"
        />
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Account Type</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="">Select account type</option>
        </select>
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Currency</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="usd">USD - US Dollar</option>
          <option value="cad">CAD - Canadian Dollar</option>
          <option value="aud">AUD - Australian Dollar</option>
          <option value="gbp">GBP - British Pound</option>
          <option value="eur">EUR - Euro</option>
        </select>
      </div>

      <div className="col-md-6 col-sm-12 px-30 mt-10">
        <div className="row border-light rounded-8 px-15 py-15">
          <div className="text-18 fw-600 lh-1 px-0">Payment Terms</div>
          <div className="col-12 d-flex items-center border-light rounded-8 py-15 px-15 mt-20">
            <span className="material-symbols-outlined text-14">info</span>
            <div className="text-14 lh-1 ml-10">
              Payment terms are set by the Super Admin.
            </div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Payment Cycle</div>
            <div className="text-14 lh-1">Monthly</div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Payment Method</div>
            <div className="text-14 lh-1">Direct Deposit</div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Payment Processing Time</div>
            <div className="text-14 lh-1">Net 30</div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-sm-12 px-30 mt-10">
        <div className="row border-light rounded-8 px-15 py-15">
          <div className="text-18 fw-600 lh-1 px-0">Pricing Structure</div>
          <div className="col-12 d-flex items-center border-light rounded-8 py-15 px-15 mt-20">
            <span className="material-symbols-outlined text-14">info</span>
            <div className="text-14 lh-1 ml-10">
              Pricing structure is set by the Super Admin.
            </div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Commission Rate</div>
            <div className="text-14 lh-1">15%</div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Transaction Fee</div>
            <div className="text-14 lh-1">2.9% + $0.30</div>
          </div>
          <div className="col-12 d-flex justify-between px-0 mt-10">
            <div className="text-14 fw-500 lh-1">Subscription Fee</div>
            <div className="text-14 lh-1">$49.99/month</div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button className="button border-light rounded-8 text-12 py-10 px-15 mr-10">
          Cancel
        </button>
        <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Financial;
