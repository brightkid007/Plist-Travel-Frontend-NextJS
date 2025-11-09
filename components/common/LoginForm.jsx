"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import logo from "/public/img/general/plist logo 1.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const { checkRoles, login } = useAuth();
  const router = useRouter();

  // Role display options
  const roleLabels = {
    customer: "Customer",
    vendor: "Vendor",
    agent: "Agent",
    admin: "Admin"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // First, check available roles for this email/password
      const rolesResponse = await checkRoles(credentials.email, credentials.password);
      
      if (rolesResponse?.roles && rolesResponse.roles.length > 1) {
        // Multiple roles - show selection
        setAvailableRoles(rolesResponse.roles);
        setShowRoleSelection(true);
        setLoading(false);
      } else if (rolesResponse?.roles && rolesResponse.roles.length === 1) {
        // Single role - auto-login
        const singleRole = rolesResponse.roles[0].role;
        const response = await login({
          ...credentials,
          role: singleRole
        });
        const role = response?.user?.role;

        toast.success("Signed in successfully");
        redirectByRole(role);
      } else {
        toast.error("No roles found for this account");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
      setShowRoleSelection(false);
      setAvailableRoles(null);
      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role) => {
    setSelectedRole(role);
    setLoading(true);
    
    try {
      const response = await login({
        ...credentials,
        role: role
      });
      const userRole = response?.user?.role;

      toast.success("Signed in successfully");
      redirectByRole(userRole);
    } catch (err) {
      toast.error(err?.message || "Login failed");
      setSelectedRole(null);
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "vendor":
        router.push("/vendor/dashboard");
        break;
      case "agent":
        router.push("/agent/dashboard");
        break;
      case "customer":
      default:
        router.push("/customer");
        break;
    }
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset role selection when credentials change
    if (showRoleSelection) {
      setShowRoleSelection(false);
      setAvailableRoles(null);
      setSelectedRole(null);
    }
  };

  const handleBack = () => {
    setShowRoleSelection(false);
    setAvailableRoles(null);
    setSelectedRole(null);
  };

  return (
    <div className="d-flex flex-column items-center">
      <Image src={logo} width={150} height={40} alt="" unoptimized />
      <h1 className="fw-600 mt-20">Welcome Back</h1>
      <div className="text-light-1 fw-400 mb-30">Sign in to your account</div>
      
      {showRoleSelection && availableRoles ? (
        // Role Selection View
        <div className="row y-gap-20 rounded-22 border-light-1 bg-white shadow-1 px-30 py-30 w-100">
          <div className="col-12">
            <h1 className="fw-600">Select User Type</h1>
            <div className="text-light-1 fw-400">
              This email is associated with multiple accounts. Please select which account you want to access.
            </div>
          </div>
          
          <div className="col-12 d-flex flex-column gap-10">
            {availableRoles.map((roleData) => {
              const isSelected = selectedRole === roleData.role;
              const isProcessing = loading && isSelected;
              
              return (
                <button
                  key={roleData.id}
                  type="button"
                  onClick={() => handleRoleSelection(roleData.role)}
                  disabled={loading}
                  className={`rounded-8 py-15 px-20 w-100 border d-flex items-center justify-between ${
                    isSelected
                      ? "border-blue-1 bg-blue-1 text-white"
                      : "border-light bg-white"
                  } ${loading && !isSelected ? "opacity-50" : ""}`}
                  style={{ cursor: loading ? "not-allowed" : "pointer" }}
                >
                  <div className="text-16 fw-600">{roleLabels[roleData.role] || roleData.role}</div>
                  {isProcessing && (
                    <div className="text-14">Signing in...</div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="col-12">
            <button
              type="button"
              onClick={handleBack}
              className="text-14 fw-500 text-light-1 bg-transparent border-0 cursor-pointer"
              disabled={loading}
            >
              ← Back
            </button>
          </div>
        </div>
      ) : (
        // Login Form View
        <form onSubmit={handleSubmit} className="row y-gap-20 rounded-22 border-light-1 bg-white shadow-1 px-30 py-30">
          <div className="col-12">
            <h1 className="fw-600">Sign in</h1>
            <div className="text-light-1 fw-400">
              Enter your credentials to access your account
            </div>
          </div>

          {/* Email */}
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500">Email</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="col-12">
            <h1 className="text-15 lh-14 fw-500">Password</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-10"
              type="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              disabled={loading}
            />
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
      )}
    </div>
  );
};

export default LoginForm;
