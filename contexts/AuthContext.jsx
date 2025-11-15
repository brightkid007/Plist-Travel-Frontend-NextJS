"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  setAuth,
  getAuthToken,
  clearAuth,
  getLoggedInUser,
  setLoggedInUser,
  isAuthenticated,
  checkRoles as checkRolesAPI,
  login as loginAPI
} from "@/helpers/backend_helper";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  // Restore session on mount
  useEffect(() => {
    try {
      const token = getAuthToken();
      const sessionUser = getLoggedInUser();
      const authed = isAuthenticated();
      if (authed && sessionUser) {
        setUser(sessionUser);
        setIsAuthenticatedState(true);
      } else {
        setUser(null);
        setIsAuthenticatedState(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticatedState(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check available roles for an email/password combination
  const checkRoles = async (email, password) => {
    try {
      const response = await checkRolesAPI(email, password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      // POST to /auth/login on auth backend with { email, password, role }
      const response = await loginAPI(credentials);
      const responseData = response?.data || response;
      if (responseData && responseData.accessToken) {
        setAuth(responseData.accessToken); // saves token
        setLoggedInUser(responseData); // saves user data
        setUser(responseData);
        setIsAuthenticatedState(true);
        return { success: true, user: responseData };
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticatedState(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuth();
    setUser(null);
    setIsAuthenticatedState(false);
  };

  // Update user in memory and storage
  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      setLoggedInUser(updated);
      return updated;
    });
  };

  const value = {
    user,
    isAuthenticated: isAuthenticatedState,
    loading,
    checkRoles,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
