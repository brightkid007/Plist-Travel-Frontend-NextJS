import React, { useState } from "react";
import svgIcon from "@/components/data/svgIcon";

const Integration = () => {
  const categoryList = [
    { label: "API Access", content: <APIAccess /> },
    { label: "System Compatibility", content: <SystemCompatibility /> },
    {
      label: "User Access and Permissions",
      content: <UserAccessAndPermissions />,
    },
  ];

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Technical Integration</div>
      <div className="text-14 text-light-1 lh-1">
        Manage your API access and system compatibility settings.
      </div>

      {categoryList.map((category, index) => (
        <React.Fragment key={"category_" + index}>
          <div className="text-18 fw-500 mt-10">{category.label}</div>
          <div className="col-12 px-30">
            <div className="row y-gap-10 justify-between py-10 border-light rounded-8">
              {category.content}
            </div>
          </div>
        </React.Fragment>
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

const APIAccess = () => {
  const [apiKey, setApiKey] = useState(randomString());
  const [apiSecret, setApiSecret] = useState(randomString());

  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

  function randomString() {
    return (
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    ).slice(0, 40);
  }

  const events = [
    "Booking Created",
    "Booking Updated",
    "Booking Cancelled",
    "Payment Received",
  ];

  return (
    <>
      <div className="d-flex justify-between items-center mb-10">
        <div>
          <div className="text-16 fw-500 lh-1">API Access</div>
          <div className="text-14 text-light-1">
            Enable API access for your vendor account
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="form-check form-switch">
            <input
              className="form-check-input border-light"
              type="checkbox"
              role="switch"
              id="flexSwitchCheck"
            />
          </div>
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-14 lh-14 fw-500">API Key</h1>
        <div className="position-relative d-flex items-center mt-5">
          <input
            className="border-light rounded-8 py-5 pr-30 px-15 w-full"
            value={apiKey}
            readOnly
            type={showApiKey ? "text" : "password"}
          />

          <span
            onClick={() => setShowApiKey(!showApiKey)}
            className="btn px-0 py-0 position-absolute text-15 material-symbols-outlined text-light-1"
            style={{
              right: "115px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            vpn_key
          </span>

          <div className="flex-shrink-0">
            <button
              className="py-10 px-15 button border-light rounded-8 ml-10 text-13 lh-15 fw-500"
              onClick={() => setApiKey(randomString())}
            >
              Regenerate
            </button>
          </div>
        </div>
        <div className="text-12 text-light-1">
          Your API key is secret. Never share it publicly.
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-14 lh-14 fw-500">API Secret</h1>
        <div className="position-relative d-flex items-center mt-5">
          <input
            className="border-light rounded-8 py-5 pr-30 px-15 w-full"
            value={apiSecret}
            readOnly
            type={showApiSecret ? "text" : "password"}
          />

          <span
            onClick={() => setShowApiSecret(!showApiSecret)}
            className="btn px-0 py-0 position-absolute text-15 material-symbols-outlined text-light-1"
            style={{
              right: "115px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            lock
          </span>

          <div className="flex-shrink-0">
            <button
              className="py-10 px-15 button border-light rounded-8 ml-10 text-13 lh-15 fw-500"
              onClick={() => setApiSecret(randomString())}
            >
              Regenerate
            </button>
          </div>
        </div>
        <div className="text-12 text-light-1">
          Your API secret is used to authenticate requests.
        </div>
      </div>

      <div className="col-12 mt-10">
        <h1 className="text-14 lh-14 fw-500">Webhook URL</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="https://your-domain.com/webhook"
        />
        <div className="text-12 text-light-1">
          We'll send notifications to this URL when events occur.
        </div>
      </div>

      <div className="col-12 mt-10">
        <h1 className="text-14 lh-14 fw-500">Webhook Events</h1>
        <div className="row items-center mt-10">
          {events.map((event, index) => (
            <div className="col-sm-6" key={"event_" + index}>
              <div className="form-checkbox d-flex items-center">
                <input type="checkbox" />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
                <div className="text-15 ml-10">{event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SystemCompatibility = () => {
  return (
    <>
      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Booking System Information</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-15 w-full text-14">
          <option value="">Select your booking system</option>
        </select>
      </div>

      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500 mt-10">System Details</h1>
        <textarea
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          rows={3}
          type="text"
          placeholder="Provide details about your booking system..."
        />
      </div>

      <div className="col-12">
        <h1 className="text-15 lh-14 fw-500">Integration Preference</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 mt-5 px-15 w-full text-14">
          <option value="">Select integration preference</option>
        </select>
      </div>
    </>
  );
};

const UserAccessAndPermissions = () => {
  const roles = [
    {
      title: "Administrator",
      role: "Full access to all settings and functions",
    },
    {
      title: "Manager",
      role: "Can manage bookings and content, but not financial settings",
    },
    {
      title: "Booking Agent",
      role: "Can only manage bookings and availability",
    },
    {
      title: "Read Only",
      role: "Can view information but cannot make changes",
    },
  ];

  return (
    <>
      <div className="d-flex justify-between items-center mb-10">
        <div>
          <div className="text-14 fw-500 lh-1">Enable User Management</div>
          <div className="text-14 text-light-1">
            Allow multiple users to access your vendor account
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="form-check form-switch">
            <input
              className="form-check-input border-light"
              type="checkbox"
              role="switch"
              id="flexSwitchCheck"
            />
          </div>
        </div>
      </div>
      <div className="col-12 px-15">
        <div className="border-light rounded-8">
          <div className="d-flex items-center px-15 py-10">
            {svgIcon.users}
            <span className="text-14 fw-500 ml-5">User Accounts</span>
          </div>
          <div className="border-top-light py-10 px-15 py-30 d-flex flex-column items-center">
            <div className="text-14 text-light-1 text-center mb-10">
              Enable user management to add team members
            </div>
            <button className="button border-light rounded-8 text-14 fw-500 text-light-1 py-10 px-15">
              Add User
            </button>
          </div>
        </div>
      </div>
      <div className="text-14 fw-500 lh-1 mt-20">
        Available Permission Roles
      </div>
      {roles.map((role, idx) => (
        <div key={"role_" + idx} className="col-sm-6 px-15">
          <div className="py-15 px-15 d-flex flex-column border-light border-dashed rounded-8">
            <div className="text-14 fw-500 lh-1 mb-10">{role.title}</div>
            <div className="text-14 text-light-1 lh-1">{role.role}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Integration;
