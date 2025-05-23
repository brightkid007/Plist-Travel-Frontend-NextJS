const TechnicalSupport = () => {
  const supportFields = [
    {
      section: "Technical Support",
      fields: [
        {
          label: "Contact Name",
          placeholder: "Enter contact name",
          type: "text",
        },
        { label: "Email", placeholder: "Enter email address", type: "text" },
        { label: "Phone", placeholder: "Enter phone number", type: "text" },
        { label: "Expected Response Time", type: "select" },
      ],
    },
    {
      section: "Customer Service",
      fields: [
        {
          label: "Contact Name",
          placeholder: "Enter contact name",
          type: "text",
        },
        { label: "Email", placeholder: "Enter email address", type: "text" },
        { label: "Phone", placeholder: "Enter phone number", type: "text" },
        { label: "Expected Response Time", type: "select" },
      ],
    },
  ];

  const escalationFields = [
    {
      label: "Primary Escalation Contact",
      placeholder: "Enter contact name",
      type: "text",
    },
    { label: "Escalation Email", placeholder: "Enter email address", type: "text" },
    { label: "Escalation Phone", placeholder: "Enter phone number", type: "text" },
    { label: "Expected Response Time", type: "select" },
  ];

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Technical & Support Details</div>
      <div className="text-12 text-light-1 lh-1 mb-20">
        Manage your technical support and customer service information.
      </div>

      {supportFields.map((group, groupIdx) =>
        group.fields.map((field, idx) => (
          <div className="col-sm-6" key={`${groupIdx}-${idx}`}>
            <h1 className="text-13 lh-14 fw-500">
              {field.type === "select" ? "" : group.section} {field.label}
            </h1>
            {field.type === "select" ? (
              <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
                <option value="">Select response time</option>
              </select>
            ) : (
              <input
                className="border-light rounded-8 py-5 px-15 w-full mt-5"
                type={field.type}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))
      )}

      {/* Support Hours */}
      <div className="text-18 fw-500 mt-10 col-auto">Support Hours</div>
      <div className="col-12 px-30">
        <div className="row y-gap-10 py-10 border-light rounded-8">
          <div className="col-md-6 col-sm-12">
            <div className="row y-gap-5">
              <div className="text-16 lh-1 fw-500">Technical Support Hours</div>
              <SupportHours />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="row y-gap-5">
              <div className="text-16 lh-1 fw-500">Customer Service Hours</div>
              <SupportHours />
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Procedures */}
      <div className="text-18 fw-500 mt-15 col-auto">Escalation Procedures</div>
      <div className="col-12 py-0">
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full"
          rows={5}
          type="text"
          placeholder="Describe your escalation procedures..."
        />
      </div>

      {escalationFields.map((field, idx) => (
        <div className="col-sm-6" key={idx}>
          <h1 className="text-13 lh-14 fw-500">{field.label}</h1>
          {field.type === "select" ? (
            <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
              <option value="">Select response time</option>
            </select>
          ) : (
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type={field.type}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}

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

const SupportHours = () => {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <>
      <div className="text-15 lh-15 fw-500 mt-10">Days Available</div>
      {weekdays.map((day, index) => (
        <div className="col-xl-3 col-lg-6 col-sm-6" key={index}>
          <div className="form-checkbox d-flex items-center">
            <input type="checkbox" />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
            <div className="text-15 ml-10">{day.substring(0, 3)}</div>
          </div>
        </div>
      ))}
      <div className="col-xl-3 col-lg-6 col-sm-6"></div>

      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">Start Time</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="">Select time</option>
        </select>
      </div>

      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">End Time</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="">Select time</option>
        </select>
      </div>

      <div className="col-12 mt-10">
        <h1 className="text-15 lh-14 fw-500">Time Zone</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14">
          <option value="">Select time zone</option>
        </select>
      </div>
    </>
  );
};

export default TechnicalSupport;
