import { AuthAPIClient, setAuthorization, clearAuthorization } from "./api_helper";
import * as url from "./url_helper";

const api = AuthAPIClient;

// ===========================================
// AUTHENTICATION & USER MANAGEMENT
// ===========================================

/**
 * Set user authentication token
 * @param {string} token - User JWT token
 */
export const setUserAuth = (token) => {
  setAuthorization(token);
  localStorage.setItem("authToken", token);
};

/**
 * Get user authentication token
 * @returns {string|null} User token or null
 */
export const getUserToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Clear user authentication
 */
export const clearUserAuth = () => {
  clearAuthorization();
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

/**
 * Get logged in user
 * @returns {Object|null} User data or null
 */
export const getLoggedInUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  }
  return JSON.parse(user);
};

/**
 * Set logged in user
 * @param {Object} user - User data
 */
export const setLoggedInUser = (user) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isUserAuthenticated = () => {
  const token = getUserToken();
  const user = getLoggedInUser();
  return !!(token && user);
};

// ===========================================
// AUTH API METHODS
// ===========================================

// User Registration
export const registerUser = (data) => api.create(url.POST_FAKE_REGISTER, data);

// User Login
export const loginUser = (data) => api.create(url.POST_FAKE_LOGIN, data);

// JWT Login
export const jwtLogin = (data) => api.create(url.POST_FAKE_JWT_LOGIN, data);

// Password Reset
export const forgotPassword = (data) => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// JWT Password Reset
export const jwtForgotPassword = (data) => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// Social Login
export const socialLogin = (data) => api.create(url.SOCIAL_LOGIN, data);

// Profile Management
export const updateProfile = (data) => api.create(url.POST_EDIT_PROFILE, data);
export const updateJwtProfile = (data) => api.create(url.POST_EDIT_JWT_PROFILE, data);

// User Management
export const getUsers = (params) => api.get(url.GET_ADMIN_USERS, params);
export const getUserById = (id) => api.get(`${url.GET_ADMIN_USER_BY_ID}/${id}`);
export const createUser = (data) => api.create(url.CREATE_ADMIN_USER, data);
export const updateUser = (id, data) => api.update(`${url.UPDATE_ADMIN_USER}/${id}`, data);
export const deleteUser = (id) => api.delete(`${url.DELETE_ADMIN_USER}/${id}`);
export const updateUserStatus = (id, data) => api.update(`${url.UPDATE_USER_STATUS}/${id}/status`, data);
export const getUserRoles = () => api.get(url.GET_USER_ROLES);
export const assignUserRole = (id, data) => api.update(`${url.ASSIGN_USER_ROLE}/${id}/role`, data);
