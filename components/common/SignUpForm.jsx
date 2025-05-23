import Link from "next/link";
import Image from "next/image";
import logo from "/public/img/general/plist logo 1.png";
import { useEffect, useState } from "react";

import svgIcon from "../data/svgIcon";

const SignUpForm = () => {
  const accountType = [
    {
      id: 1,
      name: "Vender",
      description: "List your properties, tours, or services",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill="#F3F4F6" />
          <path
            d="M14 30V12C14 11.4696 14.2107 10.9609 14.5858 10.5858C14.9609 10.2107 15.4696 10 16 10H24C24.5304 10 25.0391 10.2107 25.4142 10.5858C25.7893 10.9609 26 11.4696 26 12V30H14Z"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 20H12C11.4696 20 10.9609 20.2107 10.5858 20.5858C10.2107 20.9609 10 21.4696 10 22V28C10 28.5304 10.2107 29.0391 10.5858 29.4142C10.9609 29.7893 11.4696 30 12 30H14"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M26 17H28C28.5304 17 29.0391 17.2107 29.4142 17.5858C29.7893 17.9609 30 18.4696 30 19V28C30 28.5304 29.7893 29.0391 29.4142 29.4142C29.0391 29.7893 28.5304 30 28 30H26"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 14H22"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 18H22"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 22H22"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 26H22"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      name: "Agent",
      description: "Manage bookings and client relationships",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill="#F3F4F6" />
          <path
            d="M24 29V27C24 25.9391 23.5786 24.9217 22.8284 24.1716C22.0783 23.4214 21.0609 23 20 23H14C12.9391 23 11.9217 23.4214 11.1716 24.1716C10.4214 24.9217 10 25.9391 10 27V29"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 19C19.2091 19 21 17.2091 21 15C21 12.7909 19.2091 11 17 11C14.7909 11 13 12.7909 13 15C13 17.2091 14.7909 19 17 19Z"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M30 28.9999V26.9999C29.9993 26.1136 29.7044 25.2527 29.1614 24.5522C28.6184 23.8517 27.8581 23.3515 27 23.1299"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24 11.1299C24.8604 11.3502 25.623 11.8506 26.1676 12.5522C26.7122 13.2538 27.0078 14.1167 27.0078 15.0049C27.0078 15.8931 26.7122 16.756 26.1676 17.4576C25.623 18.1592 24.8604 18.6596 24 18.8799"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 3,
      name: "Customer",
      description: "Book travel experiences and services",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="20" fill="#F3F4F6" />
          <path
            d="M27 29V27C27 25.9391 26.5786 24.9217 25.8284 24.1716C25.0783 23.4214 24.0609 23 23 23H17C15.9391 23 14.9217 23.4214 14.1716 24.1716C13.4214 24.9217 13 25.9391 13 27V29"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
            stroke="#6B7280"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  const [formType, setFormType] = useState(0);
  const formContentList = [
    <BasicSignUpForm accountType={accountType} setFormType={setFormType} />,
    <VenderSignUpForm setFormType={setFormType} />,
    <AgentSignUpForm setFormType={setFormType} />,
    <CustomerSignUpForm setFormType={setFormType} />,
  ];
  const [formContent, setFormContent] = useState(formContentList[0]);

  useEffect(() => {
    setFormContent(formContentList[formType]);
  }, [formType]);

  return (
    <div className="d-flex flex-column items-center">
      <Image src={logo} width={150} height={40} alt="" className="mb-10" unoptimized />
      {formType == 0 && (
        <>
          <h1 className="fw-600">Hey There</h1>
          <div className="text-light-1 fw-400 mb-20">Create your account</div>
        </>
      )}
      {formContent}
    </div>
  );
};

export default SignUpForm;

const BasicSignUpForm = ({ accountType, setFormType }) => {
  const [selectedType, setSelectedType] = useState(accountType[0]);
  return (
    <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-30 mt-0">
      <div className="col-12">
        <h1 className="fw-600">Sign up</h1>
        <div className="text-light-1 fw-400">
          Enter your credentials to access your account
        </div>
      </div>

      <div className="col-12 d-flex flex-column items-center">
        {accountType.map((item, index) => (
          <button
            key={index}
            className={
              "rounded-8 py-10 px-15 w-100 mt-20 " +
              (selectedType?.name === item.name
                ? "border-blue-1"
                : "border-light")
            }
            onClick={() => setSelectedType(item)}
          >
            <div className="d-flex">
              {item.icon}
              <div className="d-flex flex-column items-start ml-10">
                <div className="text-14 fw-600">{item.name}</div>
                <div className="text-12 text-light-1 fw-400">
                  {item.description}
                </div>
              </div>
            </div>
          </button>
        ))}
        <button
          className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-20"
          onClick={() => {
            setFormType(selectedType.id);
          }}
        >
          Continue
        </button>
        <div className="mt-10">
          Already have an account?
          <Link href="/login" className="ml-5 text-blue-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const VenderSignUpForm = ({ setFormType }) => {
  return (
    <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-20 mt-0">
      <div className="col-12 d-flex items-center">
        <div className="mr-10" onClick={() => setFormType(0)}>
          {svgIcon.back}
        </div>
        <div>
          <h1 className="text-26 fw-600">Vendor Registration</h1>
          <div className="text-light-1 fw-400">Create your vendor account </div>
        </div>
      </div>
      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">First Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter First Name"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">Last Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Last Name"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Business Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Business Name"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Business Name</div>
        <select className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 w-full text-15 mt-15">
          <option defaultValue>Select Business Type</option>
          <option value="properties">Properties</option>
          <option value="animation">Flights</option>
          <option value="design">Rides</option>
          <option value="illustration">Attractions & Events</option>
          <option value="lifestyle">Tours</option>
          <option value="business">Travel Packages</option>
        </select>
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Email</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Email"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Phone Number</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Phone Number"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="password"
          placeholder="Create a Password"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Confirm Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Confirm your Password"
        />
      </div>
      <div className="col-12 d-flex flex-column items-center">
        <Link
          className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
          href={"/login"}
        >
          Create Account
        </Link>
        <div className="mt-10">
          Already have an account?
          <Link href="/login" className="ml-5 text-blue-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const AgentSignUpForm = ({ setFormType }) => {
  return (
    <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-30 mt-0">
      <div className="col-12 d-flex items-center">
        <div className="mr-10" onClick={() => setFormType(0)}>
          {svgIcon.back}
        </div>
        <div>
          <h1 className="text-26 fw-600">Agent Registration</h1>
          <div className="text-light-1 fw-400">Create your agent account </div>
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">First Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter First Name"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">Last Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Last Name"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Agency Name (Optional)</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Business Name"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Specialization</div>
        <select className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 w-full text-15 mt-15">
          <option defaultValue>Select Specialization</option>
          <option value="properties">Properties</option>
          <option value="animation">Flights</option>
          <option value="design">Rides</option>
          <option value="illustration">Attractions & Events</option>
          <option value="lifestyle">Tours</option>
          <option value="business">Travel Packages</option>
        </select>
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Email</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Email"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Phone Number</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Phone Number"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="password"
          placeholder="Create a Password"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Confirm Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Confirm your Password"
        />
      </div>
      <div className="col-12 d-flex flex-column items-center">
        <Link
          className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
          href={"/login"}
        >
          Create Account
        </Link>
        <div className="mt-10">
          Already have an account?
          <Link href="/login" className="ml-5 text-blue-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const CustomerSignUpForm = ({ setFormType }) => {
  return (
    <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-30 mt-0">
      <div className="col-12 d-flex items-center">
        <div className="mr-10" onClick={() => setFormType(0)}>
          {svgIcon.back}
        </div>
        <div>
          <h1 className="text-26 fw-600">Customer Registration</h1>
          <div className="text-light-1 fw-400">
            Create your customer account{" "}
          </div>
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">First Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter First Name"
        />
      </div>
      <div className="col-md-6 col-sm-12">
        <div className="text-14 lh-1 fw-500">Last Name</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Last Name"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Email</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Email"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Phone Number</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Phone Number"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="password"
          placeholder="Create a Password"
        />
      </div>
      <div className="col-12">
        <div className="text-14 lh-1 fw-500">Confirm Password</div>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Confirm your Password"
        />
      </div>
      <div className="col-12 d-flex flex-column items-center">
        <Link
          className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
          href={"/login"}
        >
          Create Account
        </Link>
        <div className="mt-10">
          Already have an account?
          <Link href="/login" className="ml-5 text-blue-1">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
