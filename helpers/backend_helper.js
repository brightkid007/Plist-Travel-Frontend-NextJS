import { 
  AdminAPIClient, 
  AuthAPIClient, 
  ListingAPIClient, 
  BookingAPIClient,
  setAdminAuthorization, 
  clearAuthorization 
} from "./api_helper";
import * as url from "./url_helper";

// Use AdminAPIClient for admin operations
const api = AdminAPIClient;

// ===========================================
// ADMIN AUTHENTICATION & SESSION MANAGEMENT
// ===========================================

/**
 * Set admin authentication token
 * @param {string} token - Admin JWT token
 */
export const setAdminAuth = (token) => {
  setAdminAuthorization(token);
  localStorage.setItem("adminToken", token);
};

/**
 * Get admin authentication token
 * @returns {string|null} Admin token or null
 */
export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

/**
 * Clear admin authentication
 */
export const clearAdminAuth = () => {
  clearAuthorization();
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

/**
 * Get logged in admin user
 * @returns {Object|null} Admin user data or null
 */
export const getLoggedInAdmin = () => {
  const user = localStorage.getItem("adminUser");
  if (!user) {
    return null;
  }
  return JSON.parse(user);
};

/**
 * Set logged in admin user
 * @param {Object} user - Admin user data
 */
export const setLoggedInAdmin = (user) => {
  localStorage.setItem("adminUser", JSON.stringify(user));
};

/**
 * Check if admin is authenticated
 * @returns {boolean} True if admin is logged in
 */
export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  const user = getLoggedInAdmin();
  return !!(token && user);
};
// Gets the logged in user data from local session


// ===========================================
// ADMIN API METHODS
// ===========================================

// DASHBOARD & ANALYTICS
// Get admin dashboard overview
export const getAdminDashboard = (params) => api.get(url.GET_ADMIN_DASHBOARD, params);

// Get admin analytics data
export const getAdminAnalytics = (params) => api.get(url.GET_ADMIN_ANALYTICS, params);

// Get admin metrics
export const getAdminMetrics = (params) => api.get(url.GET_ADMIN_METRICS, params);

// Export admin data
export const exportAdminData = (params) => api.get(url.EXPORT_ADMIN_DATA, params);

// USER MANAGEMENT
// Get all users (admin)
export const getAdminUsers = (params) => api.get(url.GET_ADMIN_USERS, params);

// Get user by ID
export const getAdminUserById = (id) => api.get(`${url.GET_ADMIN_USER_BY_ID}/${id}`);

// Create new user
export const createAdminUser = (data) => api.create(url.CREATE_ADMIN_USER, data);

// Update user
export const updateAdminUser = (id, data) => api.update(`${url.UPDATE_ADMIN_USER}/${id}`, data);

// Delete user
export const deleteAdminUser = (id) => api.delete(`${url.DELETE_ADMIN_USER}/${id}`);

// Update user status
export const updateUserStatus = (id, data) => api.update(`${url.UPDATE_USER_STATUS}/${id}/status`, data);

// Get user roles
export const getUserRoles = () => api.get(url.GET_USER_ROLES);

// Assign role to user
export const assignUserRole = (id, data) => api.update(`${url.ASSIGN_USER_ROLE}/${id}/role`, data);

// BOOKING MANAGEMENT
// Get all bookings (admin)
export const getAdminBookings = (params) => api.get(url.GET_ADMIN_BOOKINGS, params);

// Get booking by ID
export const getAdminBookingById = (id) => api.get(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}`);

// Update booking status
export const updateBookingStatus = (id, data) => api.update(`${url.UPDATE_BOOKING_STATUS}/${id}/status`, data);

// Force booking status (admin override)
export const forceBookingStatus = (id, status) => api.update(`${url.FORCE_BOOKING_STATUS}/${id}/${status}`);

// Get booking analytics
export const getBookingAnalytics = (params) => api.get(url.GET_BOOKING_ANALYTICS, params);

// LISTING MANAGEMENT
// Get all listings (admin)
export const getAdminListings = (params) => api.get(url.GET_ADMIN_LISTINGS, params);

// Get listing by ID
export const getAdminListingById = (id) => api.get(`${url.GET_ADMIN_LISTING_BY_ID}/${id}`);

// Update listing status
export const updateListingStatus = (id, data) => api.update(`${url.UPDATE_LISTING_STATUS}/${id}/status`, data);

// Approve listing
export const approveListing = (id) => api.update(`${url.APPROVE_LISTING}/${id}/approve`);

// Reject listing
export const rejectListing = (id, data) => api.update(`${url.REJECT_LISTING}/${id}/reject`, data);

// Get listing analytics
export const getListingAnalytics = (params) => api.get(url.GET_LISTING_ANALYTICS, params);

// CATEGORY MANAGEMENT
// Get all categories (admin)
export const getAdminCategories = (params) => api.get(url.GET_ADMIN_CATEGORIES, params);

// Create category
export const createAdminCategory = (data) => api.create(url.CREATE_ADMIN_CATEGORY, data);

// Update category
export const updateAdminCategory = (id, data) => api.update(`${url.UPDATE_ADMIN_CATEGORY}/${id}`, data);

// Delete category
export const deleteAdminCategory = (id) => api.delete(`${url.DELETE_ADMIN_CATEGORY}/${id}`);

// COMMISSION MANAGEMENT
// Get commission settings
export const getAdminCommissions = (params) => api.get(url.GET_ADMIN_COMMISSIONS, params);

// Update commission rate
export const updateCommissionRate = (id, data) => api.update(`${url.UPDATE_COMMISSION_RATE}/${id}`, data);

// Get commission analytics
export const getCommissionAnalytics = (params) => api.get(url.GET_COMMISSION_ANALYTICS, params);

// FINANCIAL MANAGEMENT
// Get all transactions (admin)
export const getAdminTransactions = (params) => api.get(url.GET_ADMIN_TRANSACTIONS, params);

// Get revenue data
export const getAdminRevenue = (params) => api.get(url.GET_ADMIN_REVENUE, params);

// Get payouts
export const getAdminPayouts = (params) => api.get(url.GET_ADMIN_PAYOUTS, params);

// Process payout
export const processPayout = (id, data) => api.create(`${url.PROCESS_PAYOUT}/${id}`, data);

// Get financial analytics
export const getFinancialAnalytics = (params) => api.get(url.GET_FINANCIAL_ANALYTICS, params);

// VENDOR MANAGEMENT
// Get all vendors (admin)
export const getAdminVendors = (params) => api.get(url.GET_ADMIN_VENDORS, params);

// Get vendor by ID
export const getAdminVendorById = (id) => api.get(`${url.GET_ADMIN_VENDOR_BY_ID}/${id}`);

// Update vendor status
export const updateVendorStatus = (id, data) => api.update(`${url.UPDATE_VENDOR_STATUS}/${id}/status`, data);

// Approve vendor
export const approveVendor = (id) => api.update(`${url.APPROVE_VENDOR}/${id}/approve`);

// Reject vendor
export const rejectVendor = (id, data) => api.update(`${url.REJECT_VENDOR}/${id}/reject`, data);

// Get vendor analytics
export const getVendorAnalytics = (params) => api.get(url.GET_VENDOR_ANALYTICS, params);

// COUPON & PROMOTION MANAGEMENT
// Get all coupons (admin)
export const getAdminCoupons = (params) => api.get(url.GET_ADMIN_COUPONS, params);

// Create coupon
export const createAdminCoupon = (data) => api.create(url.CREATE_ADMIN_COUPON, data);

// Update coupon
export const updateAdminCoupon = (id, data) => api.update(`${url.UPDATE_ADMIN_COUPON}/${id}`, data);

// Delete coupon
export const deleteAdminCoupon = (id) => api.delete(`${url.DELETE_ADMIN_COUPON}/${id}`);

// Get coupon analytics
export const getCouponAnalytics = (params) => api.get(url.GET_COUPON_ANALYTICS, params);

// CONTENT MANAGEMENT
// Get all content (admin)
export const getAdminContent = (params) => api.get(url.GET_ADMIN_CONTENT, params);

// Create content
export const createAdminContent = (data) => api.create(url.CREATE_ADMIN_CONTENT, data);

// Update content
export const updateAdminContent = (id, data) => api.update(`${url.UPDATE_ADMIN_CONTENT}/${id}`, data);

// Delete content
export const deleteAdminContent = (id) => api.delete(`${url.DELETE_ADMIN_CONTENT}/${id}`);

// Banner management
export const getBanners = (params) => api.get(url.GET_BANNERS, params);
export const createBanner = (data) => api.create(url.CREATE_BANNER, data);
export const updateBanner = (id, data) => api.update(`${url.UPDATE_BANNER}/${id}`, data);
export const deleteBanner = (id) => api.delete(`${url.DELETE_BANNER}/${id}`);

// SYSTEM SETTINGS
// Get system settings
export const getSystemSettings = () => api.get(url.GET_SYSTEM_SETTINGS);

// Update system settings
export const updateSystemSettings = (data) => api.update(url.UPDATE_SYSTEM_SETTINGS, data);

// Email templates
export const getEmailTemplates = () => api.get(url.GET_EMAIL_TEMPLATES);
export const updateEmailTemplate = (id, data) => api.update(`${url.UPDATE_EMAIL_TEMPLATE}/${id}`, data);

// REPORTS & ANALYTICS
// Get admin reports
export const getAdminReports = (params) => api.get(url.GET_ADMIN_REPORTS, params);

// Generate report
export const generateReport = (data) => api.create(url.GENERATE_REPORT, data);

// Get platform statistics
export const getPlatformStatistics = (params) => api.get(url.GET_PLATFORM_STATISTICS, params);