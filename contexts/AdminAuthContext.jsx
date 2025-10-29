"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  setAdminAuth,
  getAdminToken,
  clearAdminAuth,
  getLoggedInAdmin,
  isAdminAuthenticated
} from "@/helpers/backend_helper";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    try {
      const token = getAdminToken();
      const adminUser = getLoggedInAdmin();
      const authenticated = isAdminAuthenticated();

      if (authenticated && adminUser) {
        setAdmin(adminUser);
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);

      // Call your admin login API here
      // const response = await adminLogin(credentials);

      // For now, simulate login
      const mockAdmin = {
        id: 1,
        name: "Super Admin",
        email: credentials.email,
        role: "admin",
        permissions: ["all"]
      };

      const mockToken = "mock-admin-token-" + Date.now();

      setAdminAuth(mockToken);
      setAdmin(mockAdmin);
      setIsAuthenticated(true);

      return { success: true, admin: mockAdmin };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      clearAdminAuth();
      setAdmin(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateAdmin = (adminData) => {
    setAdmin(prev => ({ ...prev, ...adminData }));
  };

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    updateAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
