"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "/public/img/general/plist logo 1.png";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "customer"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login: adminLogin } = useAdminAuth();
  const router = useRouter();

  // Role options
  const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "agent", label: "Agent" },
    { value: "admin", label: "Admin" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Route based on selected role
      switch (credentials.role) {
        case "admin":
          await adminLogin(credentials);
          router.push("/admin/dashboard");
          break;
        case "vendor":
          router.push("/vendor");
          break;
        case "agent":
          router.push("/agent");
          break;
        case "customer":
        default:
          router.push("/customer");
          break;
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="d-flex flex-column items-center">
      <Image src={logo} width={150} height={40} alt="" unoptimized />
      <h1 className="fw-600 mt-20">Welcome Back</h1>
      <div className="text-light-1 fw-400 mb-30">Sign in to your account</div>
      <form onSubmit={handleSubmit} className="row y-gap-20 rounded-22 border-light-1 bg-white shadow-1 px-30 py-30">
        <div className="col-12">
          <h1 className="fw-600">Sign in</h1>
          <div className="text-light-1 fw-400">
            Enter your credentials to access your account
          </div>
        </div>

        {error && (
          <div className="col-12">
            <div className="bg-red-1 text-white rounded-4 p-10 text-14">
              {error}
            </div>
          </div>
        )}

        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Email</h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Password</h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Select Role</h1>
          <select
            className="border-light rounded-8 py-5 px-15 w-full mt-10 bg-white"
            value={credentials.role}
            onChange={(e) => handleChange("role", e.target.value)}
            required
            style={{ 
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 12px center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px'
            }}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <a href="#" className="text-14 fw-500 text-light-1">
            Forgot your password?
          </a>
        </div>

        <div className="col-12 d-flex flex-column items-center">
          <button
            type="submit"
            className="button py-20 -dark-1 bg-dark-4 text-white w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          <div className="mt-10 text-light-1">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-light-1">
              Sign up
            </Link>
          </div>
        </div>
        {/* End .col */}
      </form>
    </div>
  );
};

export default LoginForm;
