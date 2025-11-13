import {
  APIClient,
  AuthAPIClient,
  ListingAPIClient,
  BookingAPIClient,
  CommunicationAPIClient,
  PricingAPIClient,
  PaymentAPIClient,
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

// Get current user profile
export const getCurrentUser = () => AuthAPIClient.get("/users/me");

// Update current user profile
export const updateCurrentUser = (data) => AuthAPIClient.update("/users/me", data);

// Get user by ID
export const getAdminUserById = (id) => AuthAPIClient.get(`/users/${id}`);

// Get user addresses
export const getUserAddresses = (userId) => AuthAPIClient.get(`/users/${userId}/address`);

// Create new address
export const createAddress = (data) => AuthAPIClient.create("/address", data);

// Update address
export const updateAddress = (id, data) => AuthAPIClient.update(`/address/${id}`, data);

// Delete address
export const deleteAddress = (id) => AuthAPIClient.delete(`/address/${id}`);

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

// ROLE MANAGEMENT
// Get all admin roles
export const getAdminRoles = (params) => AuthAPIClient.get("/admin/roles", params);

// Get role by ID
export const getAdminRoleById = (id) => AuthAPIClient.get(`/admin/roles/${id}`);

// Create new role
export const createAdminRole = (data) => AuthAPIClient.create("/admin/roles", data);

// Update role
export const updateAdminRole = (id, data) => AuthAPIClient.update(`/admin/roles/${id}`, data);

// Delete role
export const deleteAdminRole = (id) => AuthAPIClient.delete(`/admin/roles/${id}`);

// BOOKING MANAGEMENT
// Get all bookings (admin) - using BookingAPIClient
export const getAdminBookings = (params) => BookingAPIClient.get(url.GET_ADMIN_BOOKINGS, params);

// Get booking by ID
export const getAdminBookingById = (id) => BookingAPIClient.get(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}`);

// Update booking status (PATCH /bookings/:id/status)
export const updateBookingStatus = (id, data) => BookingAPIClient.patch(`/bookings/${id}/status`, data);

// Delete booking
export const deleteBooking = (id) => BookingAPIClient.delete(`/bookings/${id}`);

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

// VENDOR LISTING MANAGEMENT
// Create new listing
export const createListing = (data) => ListingAPIClient.create("/listings", data);

// Get my listings (vendor's own listings)
export const getMyListings = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/listings/me", sanitized)
      : ListingAPIClient.get("/listings/me");
  }
  return ListingAPIClient.get("/listings/me");
};

// Get listing by ID
export const getListingById = (id) => ListingAPIClient.get(`/listings/${id}`);

// Update listing
export const updateListing = (id, data) => ListingAPIClient.update(`/listings/${id}`, data);

// Delete listing
export const deleteListing = (id) => ListingAPIClient.delete(`/listings/${id}`);

// Get all listings (public)
export const getAllListings = (params) => ListingAPIClient.get("/listings", params);

// LISTING CATEGORY MANAGEMENT
// Get all listing categories
export const getListingCategories = (params) => ListingAPIClient.get("/listing-categories", params);

// Get listing category by ID
export const getListingCategoryById = (id) => ListingAPIClient.get(`/listing-categories/${id}`);

// Create listing category (admin only)
export const createListingCategory = (data) => ListingAPIClient.create("/listing-categories", data);

// Update listing category (admin only)
export const updateListingCategory = (id, data) => ListingAPIClient.update(`/listing-categories/${id}`, data);

// Delete listing category (admin only)
export const deleteListingCategory = (id) => ListingAPIClient.delete(`/listing-categories/${id}`);

// LISTING SUBCATEGORY MANAGEMENT
// Get all listing subcategories
export const getListingSubcategories = (params) => ListingAPIClient.get("/listing-subcategories", params);

// Get listing subcategory by ID
export const getListingSubcategoryById = (id) => ListingAPIClient.get(`/listing-subcategories/${id}`);

// Create listing subcategory (admin only)
export const createListingSubcategory = (data) => ListingAPIClient.create("/listing-subcategories", data);

// Update listing subcategory (admin only)
export const updateListingSubcategory = (id, data) => ListingAPIClient.update(`/listing-subcategories/${id}`, data);

// Delete listing subcategory (admin only)
export const deleteListingSubcategory = (id) => ListingAPIClient.delete(`/listing-subcategories/${id}`);

// AMENITY MANAGEMENT
// Get all amenities
export const getAmenities = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/amenities", sanitized)
      : ListingAPIClient.get("/amenities");
  }
  return ListingAPIClient.get("/amenities");
};

// Get amenity by ID
export const getAmenityById = (id) => ListingAPIClient.get(`/amenities/${id}`);

// Create amenity (admin only)
export const createAmenity = (data) => ListingAPIClient.create("/amenities", data);

// Update amenity (admin only)
export const updateAmenity = (id, data) => ListingAPIClient.update(`/amenities/${id}`, data);

// Delete amenity (admin only)
export const deleteAmenity = (id) => ListingAPIClient.delete(`/amenities/${id}`);

// MEDIA MANAGEMENT
// Upload media asset (image, video, pdf)
export const uploadMedia = (file, listingId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("listing_id", listingId.toString());
  
  return ListingAPIClient.service.post("/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all media assets
export const getMediaAssets = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/media", sanitized)
      : ListingAPIClient.get("/media");
  }
  return ListingAPIClient.get("/media");
};

// Get media asset by ID
export const getMediaAssetById = (id) => ListingAPIClient.get(`/media/${id}`);

// Update media asset (admin only)
export const updateMediaAsset = (id, data) => ListingAPIClient.update(`/media/${id}`, data);

// Delete media asset (admin only)
export const deleteMediaAsset = (id) => ListingAPIClient.delete(`/media/${id}`);

// FAQ MANAGEMENT
// Get all FAQs
export const getFAQs = (params) => ListingAPIClient.get("/faqs", params);

// Get FAQ by ID
export const getFAQById = (id) => ListingAPIClient.get(`/faqs/${id}`);

// Create FAQ
export const createFAQ = (data) => ListingAPIClient.create("/faqs", data);

// Update FAQ
export const updateFAQ = (id, data) => ListingAPIClient.update(`/faqs/${id}`, data);

// Delete FAQ
export const deleteFAQ = (id) => ListingAPIClient.delete(`/faqs/${id}`);

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
// Get all commissions
export const getAdminCommissions = (params) => PricingAPIClient.get(url.GET_ADMIN_COMMISSIONS, params);

// Get commission by ID
export const getAdminCommissionById = (id) => PricingAPIClient.get(`${url.GET_ADMIN_COMMISSIONS}/${id}`);

// Create commission
export const createAdminCommission = (data) => PricingAPIClient.post(url.GET_ADMIN_COMMISSIONS, data);

// Update commission
export const updateAdminCommission = (id, data) => PricingAPIClient.put(`${url.GET_ADMIN_COMMISSIONS}/${id}`, data);

// Delete commission
export const deleteAdminCommission = (id) => PricingAPIClient.delete(`${url.GET_ADMIN_COMMISSIONS}/${id}`);

// Update commission status (activate/deactivate)
export const updateCommissionStatus = (id, is_active) => PricingAPIClient.patch(`${url.GET_ADMIN_COMMISSIONS}/${id}/status`, { is_active });

// FINANCIAL MANAGEMENT
// Get all transactions (admin)
export const getAdminTransactions = (params) => api.get(url.GET_ADMIN_TRANSACTIONS, params);
export const getTransactions = (params) => PaymentAPIClient.get(url.GET_TRANSACTIONS, params);
export const getPaymentAnalytics = () => PaymentAPIClient.get(url.GET_PAYMENT_ANALYTICS);
export const refundTransaction = (id) => PaymentAPIClient.patch(`${url.REFUND_TRANSACTION}/${id}/refund`);

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

// ===========================================
// EMAIL TEMPLATES (Communication Service)
// ===========================================

// Get all email templates
export const getEmailTemplates = (params) => CommunicationAPIClient.get(url.GET_EMAIL_TEMPLATES, params);

// Get email template by ID
export const getEmailTemplateById = (id) => CommunicationAPIClient.get(`${url.GET_EMAIL_TEMPLATE_BY_ID}/${id}`);

// Create new email template
export const createEmailTemplate = (data) => CommunicationAPIClient.create(url.CREATE_EMAIL_TEMPLATE, data);

// Update email template
export const updateEmailTemplate = (id, data) => CommunicationAPIClient.update(`${url.UPDATE_EMAIL_TEMPLATE}/${id}`, data);

// Delete email template
export const deleteEmailTemplate = (id) => CommunicationAPIClient.delete(`${url.DELETE_EMAIL_TEMPLATE}/${id}`);

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

// ===========================================
// NOTIFICATIONS (Admin)
// ===========================================

// Get all notifications
export const getNotifications = (params) => CommunicationAPIClient.get(url.GET_ADMIN_NOTIFICATIONS, params);

// Create new notification
export const createNotification = (data) => CommunicationAPIClient.create(url.CREATE_ADMIN_NOTIFICATION, data);

// Get notification by ID
export const getNotificationById = (id) => CommunicationAPIClient.get(`${url.GET_ADMIN_NOTIFICATION_BY_ID}/${id}`);

// Update notification
export const updateNotification = (id, data) => CommunicationAPIClient.update(`${url.UPDATE_ADMIN_NOTIFICATION}/${id}`, data);

// Delete notification
export const deleteNotification = (id) => CommunicationAPIClient.delete(`${url.DELETE_ADMIN_NOTIFICATION}/${id}`);

// Send notification
export const sendNotification = (id) => CommunicationAPIClient.update(`${url.SEND_NOTIFICATION}/${id}/send`);

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

// ===========================================
// PACKAGE PLANS (Pricing-Loyalty Service)
// ===========================================

export const getPackagePlans = (params) => PricingAPIClient.get(url.GET_PACKAGE_PLANS, params);
export const getPackagePlanById = (id) => PricingAPIClient.get(`${url.GET_PACKAGE_PLANS}/${id}`);
export const createPackagePlan = (data) => PricingAPIClient.create(url.CREATE_PACKAGE_PLAN, data);
export const updatePackagePlan = (id, data) => PricingAPIClient.update(`${url.UPDATE_PACKAGE_PLAN}/${id}`, data);
export const deletePackagePlan = (id) => PricingAPIClient.delete(`${url.DELETE_PACKAGE_PLAN}/${id}`);

// Package Subscriptions
export const getPackageSubscriptions = (params) => PricingAPIClient.get(url.GET_PACKAGE_SUBSCRIPTIONS, params);
export const exportPackageSubscriptionsPdf = (data) => PricingAPIClient.create(url.EXPORT_PACKAGE_SUBSCRIPTIONS_PDF, data);
export const updatePackageSubscriptionStatus = (id, data) => PricingAPIClient.patch(`${url.UPDATE_PACKAGE_SUBSCRIPTION_STATUS}/${id}/status`, data);
export const updatePackageSubscription = (id, data) => PricingAPIClient.update(`${url.UPDATE_PACKAGE_SUBSCRIPTION}/${id}`, data);