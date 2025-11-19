"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "/public/img/general/plist logo 1.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

import svgIcon from "../data/svgIcon";

const SignUpForm = () => {
  const accountType = [
    {
      id: 1,
      name: "Vendor",
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 20H12C11.4696 20 10.9609 20.2107 10.5858 20.5858C10.2107 20.9609 10 21.4696 10 22V28C10 28.5304 10.2107 29.0391 10.5858 29.4142C10.9609 29.7893 11.4696 30 12 30H14"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M26 17H28C28.5304 17 29.0391 17.2107 29.4142 17.5858C29.7893 17.9609 30 18.4696 30 19V28C30 28.5304 29.7893 29.0391 29.4142 29.4142C29.0391 29.7893 28.5304 30 28 30H26"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 14H22"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 18H22"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 22H22"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 26H22"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 19C19.2091 19 21 17.2091 21 15C21 12.7909 19.2091 11 17 11C14.7909 11 13 12.7909 13 15C13 17.2091 14.7909 19 17 19Z"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 28.9999V26.9999C29.9993 26.1136 29.7044 25.2527 29.1614 24.5522C28.6184 23.8517 27.8581 23.3515 27 23.1299"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 11.1299C24.8604 11.3502 25.623 11.8506 26.1676 12.5522C26.7122 13.2538 27.0078 14.1167 27.0078 15.0049C27.0078 15.8931 26.7122 16.756 26.1676 17.4576C25.623 18.1592 24.8604 18.6596 24 18.8799"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  const [formType, setFormType] = useState(0);

  const getFormContent = () => {
    switch (formType) {
      case 1:
        return <VendorSignUpForm setFormType={setFormType} />;
      case 2:
        return <AgentSignUpForm setFormType={setFormType} />;
      case 3:
        return <CustomerSignUpForm setFormType={setFormType} />;
      default:
        return <BasicSignUpForm accountType={accountType} setFormType={setFormType} />;
    }
  };

  return (
    <div className="d-flex flex-column items-center">
      <Image src={logo} width={150} height={40} alt="" className="mb-10" unoptimized />
      {formType == 0 && (
        <>
          <h1 className="fw-600">Hey There</h1>
          <div className="text-light-1 fw-400 mb-20">Create your account</div>
        </>
      )}
      {getFormContent()}
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

const VendorSignUpForm = ({ setFormType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    business_name: "",
    business_type: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.business_name.trim()) {
      newErrors.business_name = "Business name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const registerData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        password: formData.password,
        role: "vendor",
        business_name: formData.business_name,
      };

      const response = await register(registerData);
      
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = typeof error === "string" ? error : error?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-20 mt-0">
        <div className="col-12 d-flex items-center">
          <div className="mr-10 cursor-pointer" onClick={() => setFormType(0)}>
            {svgIcon.back}
          </div>
          <div>
            <h1 className="text-26 fw-600">Vendor Registration</h1>
            <div className="text-light-1 fw-400">Create your vendor account </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="text-14 lh-1 fw-500">First Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.first_name ? "border-red-1" : ""}`}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter First Name"
            required
          />
          {errors.first_name && (
            <div className="text-12 text-red-1 mt-5">{errors.first_name}</div>
          )}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="text-14 lh-1 fw-500">Last Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.last_name ? "border-red-1" : ""}`}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter Last Name"
            required
          />
          {errors.last_name && (
            <div className="text-12 text-red-1 mt-5">{errors.last_name}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Business Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.business_name ? "border-red-1" : ""}`}
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="Enter Business Name"
            required
          />
          {errors.business_name && (
            <div className="text-12 text-red-1 mt-5">{errors.business_name}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Business Type</div>
          <select
            className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 w-full text-15 mt-15"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
          >
            <option value="">Select Business Type</option>
            <option value="properties">Properties</option>
            <option value="flights">Flights</option>
            <option value="rides">Rides</option>
            <option value="attractions_events">Attractions & Events</option>
            <option value="tours">Tours</option>
            <option value="travel_packages">Travel Packages</option>
          </select>
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Email *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.email ? "border-red-1" : ""}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
          {errors.email && (
            <div className="text-12 text-red-1 mt-5">{errors.email}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Phone Number *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.phone ? "border-red-1" : ""}`}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            required
          />
          {errors.phone && (
            <div className="text-12 text-red-1 mt-5">{errors.phone}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.password ? "border-red-1" : ""}`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a Password"
            required
          />
          {errors.password && (
            <div className="text-12 text-red-1 mt-5">{errors.password}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Confirm Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.confirmPassword ? "border-red-1" : ""}`}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your Password"
            required
          />
          {errors.confirmPassword && (
            <div className="text-12 text-red-1 mt-5">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="col-12 d-flex flex-column items-center">
          <button
            type="submit"
            className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mt-10">
            Already have an account?
            <Link href="/login" className="ml-5 text-blue-1">
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

const AgentSignUpForm = ({ setFormType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    business_name: "",
    specialization: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const registerData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        password: formData.password,
        role: "agent",
        business_name: formData.business_name || undefined,
      };

      const response = await register(registerData);
      
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = typeof error === "string" ? error : error?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-30 mt-0">
        <div className="col-12 d-flex items-center">
          <div className="mr-10 cursor-pointer" onClick={() => setFormType(0)}>
            {svgIcon.back}
          </div>
          <div>
            <h1 className="text-26 fw-600">Agent Registration</h1>
            <div className="text-light-1 fw-400">Create your agent account </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="text-14 lh-1 fw-500">First Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.first_name ? "border-red-1" : ""}`}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter First Name"
            required
          />
          {errors.first_name && (
            <div className="text-12 text-red-1 mt-5">{errors.first_name}</div>
          )}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="text-14 lh-1 fw-500">Last Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.last_name ? "border-red-1" : ""}`}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter Last Name"
            required
          />
          {errors.last_name && (
            <div className="text-12 text-red-1 mt-5">{errors.last_name}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Agency Name (Optional)</div>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="Enter Business Name"
          />
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Specialization</div>
          <select
            className="form-select rounded-8 border-light px-15 justify-between fw-400 py-10 w-full text-15 mt-15"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          >
            <option value="">Select Specialization</option>
            <option value="properties">Properties</option>
            <option value="flights">Flights</option>
            <option value="rides">Rides</option>
            <option value="attractions_events">Attractions & Events</option>
            <option value="tours">Tours</option>
            <option value="travel_packages">Travel Packages</option>
          </select>
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Email *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.email ? "border-red-1" : ""}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
          {errors.email && (
            <div className="text-12 text-red-1 mt-5">{errors.email}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Phone Number *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.phone ? "border-red-1" : ""}`}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            required
          />
          {errors.phone && (
            <div className="text-12 text-red-1 mt-5">{errors.phone}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.password ? "border-red-1" : ""}`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a Password"
            required
          />
          {errors.password && (
            <div className="text-12 text-red-1 mt-5">{errors.password}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Confirm Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.confirmPassword ? "border-red-1" : ""}`}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your Password"
            required
          />
          {errors.confirmPassword && (
            <div className="text-12 text-red-1 mt-5">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="col-12 d-flex flex-column items-center">
          <button
            type="submit"
            className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mt-10">
            Already have an account?
            <Link href="/login" className="ml-5 text-blue-1">
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

const CustomerSignUpForm = ({ setFormType }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const registerData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        password: formData.password,
        role: "customer",
      };

      const response = await register(registerData);
      
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = typeof error === "string" ? error : error?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row bg-white y-gap-20 rounded-22 border-light-1 shadow-1 px-30 py-30 mt-0">
        <div className="col-12 d-flex items-center">
          <div className="mr-10 cursor-pointer" onClick={() => setFormType(0)}>
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
          <div className="text-14 lh-1 fw-500">First Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.first_name ? "border-red-1" : ""}`}
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter First Name"
            required
          />
          {errors.first_name && (
            <div className="text-12 text-red-1 mt-5">{errors.first_name}</div>
          )}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="text-14 lh-1 fw-500">Last Name *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.last_name ? "border-red-1" : ""}`}
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter Last Name"
            required
          />
          {errors.last_name && (
            <div className="text-12 text-red-1 mt-5">{errors.last_name}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Email *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.email ? "border-red-1" : ""}`}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
          {errors.email && (
            <div className="text-12 text-red-1 mt-5">{errors.email}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Phone Number *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.phone ? "border-red-1" : ""}`}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            required
          />
          {errors.phone && (
            <div className="text-12 text-red-1 mt-5">{errors.phone}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.password ? "border-red-1" : ""}`}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a Password"
            required
          />
          {errors.password && (
            <div className="text-12 text-red-1 mt-5">{errors.password}</div>
          )}
        </div>
        <div className="col-12">
          <div className="text-14 lh-1 fw-500">Confirm Password *</div>
          <input
            className={`border-light rounded-8 py-5 px-15 w-full mt-10 ${errors.confirmPassword ? "border-red-1" : ""}`}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your Password"
            required
          />
          {errors.confirmPassword && (
            <div className="text-12 text-red-1 mt-5">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="col-12 d-flex flex-column items-center">
          <button
            type="submit"
            className="button py-20 -dark-1 bg-dark-4 text-white w-100 mt-15"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="mt-10">
            Already have an account?
            <Link href="/login" className="ml-5 text-blue-1">
              Login
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};
