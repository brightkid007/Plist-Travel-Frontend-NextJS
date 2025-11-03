import {
  APIClient,
  AuthAPIClient,
  ListingAPIClient,
  BookingAPIClient,
  CommunicationAPIClient,
  PricingAPIClient,
  setAuthorization,
  clearAuthorization
} from "./api_helper";
import * as url from "./url_helper";

// Use APIClient for all operations
const api = APIClient;

// ===========================================
// AUTHENTICATION & SESSION MANAGEMENT (GLOBAL)
// ===========================================

/**
 * Set authentication token (global)
 * @param {string} token - JWT token
 */
export const setAuth = (token) => {
  setAuthorization(token);
  localStorage.setItem("authToken", token);
};

/**
 * Get authentication token (global)
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Clear authentication
 */
export const clearAuth = () => {
  clearAuthorization();
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

/**
 * Get logged in user object
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
 * Set logged in user object
 * @param {Object} user
 */
export const setLoggedInUser = (user) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

/**
 * Check if the user is authenticated (global)
 * @returns {boolean} True if logged in
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getLoggedInUser();
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
// Get all users (admin) - uses GET /users endpoint
export const getAdminUsers = (params) => {
  return AuthAPIClient.get("/users", params);
};

// Get user by ID
export const getAdminUserById = (id) => AuthAPIClient.get(`/users/${id}`);

// Create new user - uses /auth/register endpoint
export const createAdminUser = (data) => AuthAPIClient.create("/auth/register", data);

// Update user - uses PUT /users/:id endpoint
export const updateAdminUser = (id, data) => AuthAPIClient.update(`/users/${id}`, data);

// Delete user - uses DELETE /users/:id to permanently delete user
export const deleteAdminUser = (id) => {
  return AuthAPIClient.delete(`/users/${id}`).then(response => {
    // Handle response structure: { status, message, data }
    if (response?.data) return response.data;
    if (response?.status === 200) return response;
    return response;
  });
};

// Update user status (disable/enable)
export const updateUserStatus = (id, data) => {
  // Use PATCH to disable user
  if (data.status === 'Inactive' || data.is_active === false) {
    return AuthAPIClient.patch(`/users/${id}`, {}).then(response => {
      if (response?.data) return response.data;
      return response;
    });
  } else {
    // Re-enable by setting disabledAt to null
    return AuthAPIClient.update(`/users/${id}`, { disabledAt: null });
  }
};

// Get user roles - Returns static roles list
export const getUserRoles = () => {
  return Promise.resolve({
    data: [
      { name: "Admin", value: "admin" },
      { name: "Vendor", value: "vendor" },
      { name: "Agent", value: "agent" },
      { name: "Customer", value: "customer" }
    ]
  });
};

// Assign role to user
export const assignUserRole = (id, data) => AuthAPIClient.update(`/users/${id}`, { role: data.role });

// BOOKING MANAGEMENT
// Get all bookings (admin) - using BookingAPIClient
export const getAdminBookings = (params) => BookingAPIClient.get(url.GET_ADMIN_BOOKINGS, params);

// Get booking by ID
export const getAdminBookingById = (id) => BookingAPIClient.get(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}`);

// Update booking status
export const updateBookingStatus = (id, data) => BookingAPIClient.update(`${url.UPDATE_BOOKING_STATUS}/${id}/status`, data);

// Force booking status (admin override)
export const forceBookingStatus = (id, status) => BookingAPIClient.update(`${url.FORCE_BOOKING_STATUS}/${id}/${status}`);

// Get booking analytics - using BookingAPIClient
export const getBookingAnalytics = (params) => BookingAPIClient.get(url.GET_BOOKING_ANALYTICS, params);

// LISTING MANAGEMENT
// Get all listings (admin) - Listing Service
export const getAdminListings = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get(url.GET_ADMIN_LISTINGS, sanitized)
      : ListingAPIClient.get(url.GET_ADMIN_LISTINGS);
  }
  return ListingAPIClient.get(url.GET_ADMIN_LISTINGS);
};

// Get listing by ID - Listing Service
export const getAdminListingById = (id) => ListingAPIClient.get(`${url.GET_ADMIN_LISTING_BY_ID}/${id}`);

// Update listing status (generic) - Listing Service
export const updateListingStatus = (id, data) => ListingAPIClient.update(`${url.UPDATE_LISTING_STATUS}/${id}/status`, data);

// Approve listing (PATCH /admin/listings/:id/approved) - Listing Service
export const approveListing = (id) => ListingAPIClient.patch(`${url.APPROVE_LISTING}/${id}/approved`);

// Reject listing (PATCH /admin/listings/:id/rejected) - Listing Service
export const rejectListing = (id, data) => ListingAPIClient.patch(`${url.REJECT_LISTING}/${id}/rejected`, data);

// Set listing status flexibly (PATCH /admin/listings/:id/:status)
export const setListingStatus = (id, status) => {
  const normalized = (status || "").toString().toLowerCase();
  if (!id || !normalized) throw new Error("id and status are required");
  return ListingAPIClient.patch(`${url.UPDATE_LISTING_STATUS}/${id}/${normalized}`);
};

// Get listing analytics - Listing Service
export const getListingAnalytics = (params) => ListingAPIClient.get(url.GET_LISTING_ANALYTICS, params);

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

// COUPON & PROMOTION MANAGEMENT (Pricing Service)
// Use PricingAPIClient because coupons are served by Pricing & Loyalty service
export const getAdminCoupons = (params) => PricingAPIClient.get(url.GET_ADMIN_COUPONS, params);

// Create coupon
export const createAdminCoupon = (data) => PricingAPIClient.create(url.CREATE_ADMIN_COUPON, data);

// Update coupon
export const updateAdminCoupon = (id, data) => PricingAPIClient.update(`${url.UPDATE_ADMIN_COUPON}/${id}`, data);

// Delete coupon
export const deleteAdminCoupon = (id) => PricingAPIClient.delete(`${url.DELETE_ADMIN_COUPON}/${id}`);

// Get coupon analytics
export const getCouponAnalytics = (params) => PricingAPIClient.get(url.GET_COUPON_ANALYTICS, params);

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
export const getSystemSettings = () => BookingAPIClient.get(url.GET_SYSTEM_SETTINGS);

// Update system settings
export const updateSystemSettings = (data) => BookingAPIClient.update(url.UPDATE_SYSTEM_SETTINGS, data);

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

// ===========================================
// SUPPORT TICKETS / CONVERSATIONS (Communication Service)
// ===========================================

// Get all conversations/tickets
export const getConversations = (params) => CommunicationAPIClient.get(url.GET_CONVERSATIONS, params);

// Create new conversation/ticket
export const createConversation = (data) => CommunicationAPIClient.create(url.CREATE_CONVERSATION, data);

// Get conversation by ID
export const getConversationById = (id) => CommunicationAPIClient.get(`${url.GET_CONVERSATION_BY_ID}/${id}`);

// Update conversation
export const updateConversation = (id, data) => CommunicationAPIClient.update(`${url.UPDATE_CONVERSATION}/${id}`, data);

// Delete conversation
export const deleteConversation = (id) => CommunicationAPIClient.delete(`${url.DELETE_CONVERSATION}/${id}`);

// Get conversations by user
export const getConversationsByUser = (userId) => CommunicationAPIClient.get(`${url.GET_CONVERSATIONS_BY_USER}/${userId}`);

// ===========================================
// MESSAGES (Communication Service)
// ===========================================

// Get all messages
export const getMessages = (params) => CommunicationAPIClient.get(url.GET_MESSAGES, params);

// Create new message
export const createMessage = (data) => CommunicationAPIClient.create(url.CREATE_MESSAGE, data);

// Get message by ID
export const getMessageById = (id) => CommunicationAPIClient.get(`${url.GET_MESSAGE_BY_ID}/${id}`);

// Update message
export const updateMessage = (id, data) => CommunicationAPIClient.update(`${url.UPDATE_MESSAGE}/${id}`, data);

// Delete message
export const deleteMessage = (id) => CommunicationAPIClient.delete(`${url.DELETE_MESSAGE}/${id}`);

// Get messages by conversation
export const getMessagesByConversation = (conversationId) => CommunicationAPIClient.get(`${url.GET_MESSAGES_BY_CONVERSATION}/${conversationId}`);