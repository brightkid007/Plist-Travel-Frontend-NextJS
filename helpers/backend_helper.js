import {
  APIClient,
  AuthAPIClient,
  ListingAPIClient,
  BookingAPIClient,
  CommunicationAPIClient,
  PricingAPIClient,
  PaymentAPIClient,
  ReviewAPIClient,
  setAuthorization,
  clearAuthorization
} from "./api_helper";
import { paymentAPI } from "./api_helper";
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
// AUTHENTICATION API METHODS
// ===========================================

// Check available roles for an email/password combination
export const checkRoles = (email, password) => {
  return AuthAPIClient.create("/auth/check-roles", {
    email,
    password,
  });
};

// Login user with credentials
export const login = (credentials) => {
  return AuthAPIClient.create("/auth/login", credentials);
};

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

// Get address by ID
export const getAddressById = (id) => AuthAPIClient.get(`/address/${id}`);

// Register new user - uses /auth/register endpoint
export const register = (data) => AuthAPIClient.create("/auth/register", data);

// Create new user - uses /auth/register endpoint (for admin)
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
  // Use PUT to update user status with both is_active and disabledAt
  const updateData = {
    is_active: data.is_active !== undefined ? data.is_active : (data.status === 'Active'),
    disabledAt: data.status === 'Inactive' || data.is_active === false ? new Date().toISOString() : null
  };
  return AuthAPIClient.update(`/users/${id}`, updateData);
};

// Search customers (for vendors to add internal customers)
export const searchCustomers = (searchTerm) => {
  return AuthAPIClient.get("/users/search/customers", { search: searchTerm });
};

// Associate customer with vendor
export const associateCustomerWithVendor = (customerId) => {
  return AuthAPIClient.create(`/users/${customerId}/associate-vendor`, {});
};

// Remove customer association from vendor
export const removeCustomerAssociation = (customerId) => {
  return AuthAPIClient.delete(`/users/${customerId}/vendor-association`);
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

// ===========================================
// VENDOR ROLE MANAGEMENT (Auth-User Service)
// ===========================================

// Get all vendor roles
export const getVendorRoles = (params) => AuthAPIClient.get("/vendor/roles", params);

// Get vendor role by ID
export const getVendorRoleById = (id) => AuthAPIClient.get(`/vendor/roles/${id}`);

// Create vendor role
export const createVendorRole = (data) => AuthAPIClient.create("/vendor/roles", data);

// Update vendor role
export const updateVendorRole = (id, data) => AuthAPIClient.update(`/vendor/roles/${id}`, data);

// Delete vendor role
export const deleteVendorRole = (id) => AuthAPIClient.delete(`/vendor/roles/${id}`);

// BOOKING MANAGEMENT
// Get all bookings (admin) - using BookingAPIClient
export const getAdminBookings = (params) => BookingAPIClient.get(url.GET_ADMIN_BOOKINGS, params);

// Get vendor bookings
export const getVendorBookings = (params) => BookingAPIClient.get("/vendor/my-bookings", params);

// Get vendor booking detail
export const getVendorBookingDetail = (id) => BookingAPIClient.get(`/vendor/my-bookings/${id}`);

// Update vendor booking
export const updateVendorBooking = (id, data) => BookingAPIClient.update(`/vendor/my-bookings/${id}`, data);

// Update vendor booking status
export const updateVendorBookingStatus = (id, status) => BookingAPIClient.patch(`/vendor/my-bookings/${id}/status`, { status });

// Check-in vendor booking
export const checkInVendorBooking = (id) => BookingAPIClient.service.post(`/vendor/my-bookings/${id}/checkin`);

// Check-out vendor booking
export const checkOutVendorBooking = (id) => BookingAPIClient.service.post(`/vendor/my-bookings/${id}/checkout`);

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
// Upload media asset (image, video, pdf) for listing
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

// Upload media asset for room type (separate from listing images)
export const uploadRoomTypeMedia = (file, roomTypeId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("room_type_id", roomTypeId.toString());
  
  return ListingAPIClient.service.post("/media", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get all media assets (for listing or room type)
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
export const getTransactionById = (id) => PaymentAPIClient.get(`${url.GET_TRANSACTION_BY_ID}/${id}`);

// Download invoice
export const downloadTransactionInvoice = async (id) => {
  try {
    // Use the underlying axios instance directly for blob response
    const response = await paymentAPI.get(`${url.DOWNLOAD_TRANSACTION_INVOICE}/${id}/invoice`, {
      responseType: 'blob', // Important for downloading files
    });
    return response;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Download all invoices as zip
export const downloadAllInvoices = async (params) => {
  try {
    // Use the underlying axios instance directly for blob response
    const response = await paymentAPI.get(url.DOWNLOAD_ALL_INVOICES, {
      params,
      responseType: 'blob', // Important for downloading files
    });
    return response;
  } catch (error) {
    console.error('Error downloading all invoices:', error);
    throw error;
  }
};

export const getPaymentAnalytics = (params) => PaymentAPIClient.get(url.GET_PAYMENT_ANALYTICS, params);
export const refundTransaction = (id) => PaymentAPIClient.patch(`${url.REFUND_TRANSACTION}/${id}/refund`);

// Vendor Subscriptions (Payment Service)
export const initiateSubscription = (data) => PaymentAPIClient.create(url.INITIATE_SUBSCRIPTION, data);
export const getCurrentSubscription = () => PaymentAPIClient.get(url.GET_CURRENT_SUBSCRIPTION);
export const updateVendorSubscription = (data) => PaymentAPIClient.update(url.UPDATE_VENDOR_SUBSCRIPTION, data);

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

// VENDOR COUPON MANAGEMENT
// Get my coupons (vendor's own coupons)
export const getMyCoupons = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? PricingAPIClient.get("/coupons/me", sanitized)
      : PricingAPIClient.get("/coupons/me");
  }
  return PricingAPIClient.get("/coupons/me");
};

// Create vendor coupon
export const createVendorCoupon = (data) => PricingAPIClient.create("/coupons", data);

// Update vendor coupon
export const updateVendorCoupon = (id, data) => PricingAPIClient.update(`/coupons/${id}`, data);

// Delete vendor coupon
export const deleteVendorCoupon = (id) => PricingAPIClient.delete(`/coupons/${id}`);

// Get coupon by ID
export const getCouponById = (id) => PricingAPIClient.get(`/coupons/${id}`);

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

// Mark conversation as read
export const markConversationAsRead = (id) => CommunicationAPIClient.update(`${url.UPDATE_CONVERSATION}/${id}/read`);

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
// MESSAGE TEMPLATES (Communication Service)
// ===========================================

// Get all message templates
export const getMessageTemplates = (params) => CommunicationAPIClient.get(url.GET_MESSAGE_TEMPLATES, params);

// Create new message template
export const createMessageTemplate = (data) => CommunicationAPIClient.create(url.CREATE_MESSAGE_TEMPLATE, data);

// Get message template by ID
export const getMessageTemplateById = (id) => CommunicationAPIClient.get(`${url.GET_MESSAGE_TEMPLATE_BY_ID}/${id}`);

// Update message template
export const updateMessageTemplate = (id, data) => CommunicationAPIClient.update(`${url.UPDATE_MESSAGE_TEMPLATE}/${id}`, data);

// Delete message template
export const deleteMessageTemplate = (id) => CommunicationAPIClient.delete(`${url.DELETE_MESSAGE_TEMPLATE}/${id}`);

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

// Rate Plans (Pricing-Loyalty Service)
export const getRatePlans = (params) => PricingAPIClient.get(url.GET_RATE_PLANS, params);
export const getRatePlanById = (id) => PricingAPIClient.get(`${url.GET_RATE_PLANS}/${id}`);
export const createRatePlan = (data) => PricingAPIClient.create(url.CREATE_RATE_PLAN, data);
export const updateRatePlan = (id, data) => PricingAPIClient.update(`${url.UPDATE_RATE_PLAN}/${id}`, data);
export const deleteRatePlan = (id) => PricingAPIClient.delete(`${url.DELETE_RATE_PLAN}/${id}`);

// ===========================================
// ROOM TYPE MANAGEMENT (Listing Service)
// ===========================================

// Get all room types (with optional filters)
export const getRoomTypes = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/room-types", sanitized)
      : ListingAPIClient.get("/room-types");
  }
  return ListingAPIClient.get("/room-types");
};

// Get room type by ID
export const getRoomTypeById = (id) => ListingAPIClient.get(`/room-types/${id}`);

// Create new room type
export const createRoomType = (data) => ListingAPIClient.create("/room-types", data);

// Update room type
export const updateRoomType = (id, data) => ListingAPIClient.update(`/room-types/${id}`, data);

// Delete room type
export const deleteRoomType = (id) => ListingAPIClient.delete(`/room-types/${id}`);

// ===========================================
// AVAILABILITY MANAGEMENT (Listing Service)
// ===========================================

// Get all availabilities (with optional filters: room_type_id, add_on_service_id, date, is_available)
export const getAvailabilities = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/availability", sanitized)
      : ListingAPIClient.get("/availability");
  }
  return ListingAPIClient.get("/availability");
};

// Get availability by ID
export const getAvailabilityById = (id) => ListingAPIClient.get(`/availability/${id}`);

// Create new availability
export const createAvailability = (data) => ListingAPIClient.create("/availability", data);

// Update availability
export const updateAvailability = (id, data) => ListingAPIClient.update(`/availability/${id}`, data);

// Delete availability
export const deleteAvailability = (id) => ListingAPIClient.delete(`/availability/${id}`);

// ===========================================
// CANCELLATION POLICY MANAGEMENT (Listing Service)
// ===========================================

// Get all cancellation policies (with optional filters)
export const getCancellationPolicies = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/cancellation-policies", sanitized)
      : ListingAPIClient.get("/cancellation-policies");
  }
  return ListingAPIClient.get("/cancellation-policies");
};

// Get cancellation policy by ID
export const getCancellationPolicyById = (id) => ListingAPIClient.get(`/cancellation-policies/${id}`);

// Get cancellation policy by listing ID
export const getCancellationPolicyByListingId = (listingId) => ListingAPIClient.get(`/cancellation-policies/listing/${listingId}`);

// Create cancellation policy
export const createCancellationPolicy = (data) => ListingAPIClient.create("/cancellation-policies", data);

// Update cancellation policy
export const updateCancellationPolicy = (id, data) => ListingAPIClient.update(`/cancellation-policies/${id}`, data);

// Delete cancellation policy
export const deleteCancellationPolicy = (id) => ListingAPIClient.delete(`/cancellation-policies/${id}`);

// ===========================================
// ADD-ON SERVICES (Listing Service)
// ===========================================

// Get all add-on services (with optional filters: listing_id, type, name)
export const getAddOnServices = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ListingAPIClient.get("/add-on-services", sanitized)
      : ListingAPIClient.get("/add-on-services");
  }
  return ListingAPIClient.get("/add-on-services");
};

// Get add-on service by ID
export const getAddOnServiceById = (id) => ListingAPIClient.get(`/add-on-services/${id}`);

// Create add-on service
export const createAddOnService = (data) => ListingAPIClient.create("/add-on-services", data);

// Update add-on service
export const updateAddOnService = (id, data) => ListingAPIClient.update(`/add-on-services/${id}`, data);

// Delete add-on service
export const deleteAddOnService = (id) => ListingAPIClient.delete(`/add-on-services/${id}`);

// ===========================================
// REVIEW & RATING (Review-Rating Service)
// ===========================================

// Get all reviews (vendor can see reviews for their listings)
export const getReviews = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ReviewAPIClient.get("/reviews", sanitized)
      : ReviewAPIClient.get("/reviews");
  }
  return ReviewAPIClient.get("/reviews");
};

// Get review by ID
export const getReviewById = (id) => ReviewAPIClient.get(`/reviews/${id}`);

// Get reviews by listing ID
export const getReviewsByListingId = (listingId, params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ReviewAPIClient.get(`/reviews/by-listing/${listingId}`, sanitized)
      : ReviewAPIClient.get(`/reviews/by-listing/${listingId}`);
  }
  return ReviewAPIClient.get(`/reviews/by-listing/${listingId}`);
};

// Create review
export const createReview = (data) => ReviewAPIClient.create("/reviews", data);

// Update review
export const updateReview = (id, data) => ReviewAPIClient.update(`/reviews/${id}`, data);

// Delete review
export const deleteReview = (id) => ReviewAPIClient.delete(`/reviews/${id}`);

// ===========================================
// REVIEW REPLY (Review-Rating Service)
// ===========================================

// Create review reply (general)
export const createReviewReply = (data) => ReviewAPIClient.create("/review-replies", data);

// Create review reply with comment only
export const createReviewReplyComment = (data) => ReviewAPIClient.create("/review-replies/comment", data);

// Create review reply with ratings (for rating guests)
export const createReviewReplyRating = (data) => ReviewAPIClient.create("/review-replies/rating", data);

// Get review replies
export const getReviewReplies = (params) => {
  if (params && typeof params === 'object') {
    const sanitized = {};
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== undefined && v !== null && v !== "") sanitized[k] = v;
    });
    const hasParams = Object.keys(sanitized).length > 0;
    return hasParams
      ? ReviewAPIClient.get("/review-replies", sanitized)
      : ReviewAPIClient.get("/review-replies");
  }
  return ReviewAPIClient.get("/review-replies");
};

// Get review reply by ID
export const getReviewReplyById = (id) => ReviewAPIClient.get(`/review-replies/${id}`);

// Update review reply
export const updateReviewReply = (id, data) => ReviewAPIClient.update(`/review-replies/${id}`, data);

// Delete review reply
export const deleteReviewReply = (id) => ReviewAPIClient.delete(`/review-replies/${id}`);