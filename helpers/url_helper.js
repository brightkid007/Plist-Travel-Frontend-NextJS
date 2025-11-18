// ADMIN ENDPOINTS
// Dashboard & Analytics
export const GET_ADMIN_DASHBOARD = "/admin/dashboard";
export const GET_ADMIN_ANALYTICS = "/admin/analytics";
export const GET_ADMIN_METRICS = "/admin/metrics";
export const EXPORT_ADMIN_DATA = "/admin/export";

// User Management
export const GET_ADMIN_USERS = "/admin/users";
export const GET_ADMIN_USER_BY_ID = "/admin/users";
export const CREATE_ADMIN_USER = "/admin/users";
export const UPDATE_ADMIN_USER = "/admin/users";
export const DELETE_ADMIN_USER = "/admin/users";
export const UPDATE_USER_STATUS = "/admin/users";
export const GET_USER_ROLES = "/admin/roles";
export const ASSIGN_USER_ROLE = "/admin/users";

// Booking Management
export const GET_ADMIN_BOOKINGS = "/admin/bookings";
export const GET_ADMIN_BOOKING_BY_ID = "/admin/bookings";
export const UPDATE_BOOKING_STATUS = "/admin/bookings";
export const FORCE_BOOKING_STATUS = "/admin/bookings";
export const GET_BOOKING_ANALYTICS = "/admin/bookings/analytics";

// Listing Management
export const GET_ADMIN_LISTINGS = "/admin/listings";
export const GET_ADMIN_LISTING_BY_ID = "/admin/listings";
export const UPDATE_LISTING_STATUS = "/admin/listings";
export const APPROVE_LISTING = "/admin/listings";
export const REJECT_LISTING = "/admin/listings";
export const GET_LISTING_ANALYTICS = "/admin/listings/analytics";

// Category Management
export const GET_ADMIN_CATEGORIES = "/admin/categories";
export const CREATE_ADMIN_CATEGORY = "/admin/categories";
export const UPDATE_ADMIN_CATEGORY = "/admin/categories";
export const DELETE_ADMIN_CATEGORY = "/admin/categories";

// Commission Management
export const GET_ADMIN_COMMISSIONS = "/admin/commissions";
export const UPDATE_COMMISSION_RATE = "/admin/commissions";
export const GET_COMMISSION_ANALYTICS = "/admin/commissions/analytics";

// Financial Management
export const GET_ADMIN_TRANSACTIONS = "/admin/transactions";
export const GET_ADMIN_REVENUE = "/admin/revenue";
export const GET_ADMIN_PAYOUTS = "/admin/payouts";
export const PROCESS_PAYOUT = "/admin/payouts";
export const GET_FINANCIAL_ANALYTICS = "/admin/financial/analytics";
export const GET_TRANSACTIONS = "/transactions";
export const GET_TRANSACTION_BY_ID = "/transactions";
export const DOWNLOAD_TRANSACTION_INVOICE = "/transactions"; // Added for downloading invoice
export const DOWNLOAD_ALL_INVOICES = "/transactions/invoices/all"; // Added for downloading all invoices as zip
export const GET_PAYMENT_ANALYTICS = "/analytics";
export const REFUND_TRANSACTION = "/transactions";

// Vendor Management
export const GET_ADMIN_VENDORS = "/admin/vendors";
export const GET_ADMIN_VENDOR_BY_ID = "/admin/vendors";
export const UPDATE_VENDOR_STATUS = "/admin/vendors";
export const APPROVE_VENDOR = "/admin/vendors";
export const REJECT_VENDOR = "/admin/vendors";
export const GET_VENDOR_ANALYTICS = "/admin/vendors/analytics";

// Coupon & Promotion Management (Pricing Service)
// These endpoints live in the Pricing & Loyalty service and are not under /admin
export const GET_ADMIN_COUPONS = "/coupons";
export const CREATE_ADMIN_COUPON = "/coupons";
export const UPDATE_ADMIN_COUPON = "/coupons";
export const DELETE_ADMIN_COUPON = "/coupons";
export const GET_COUPON_ANALYTICS = "/coupons/analytics";

// Content Management
export const GET_ADMIN_CONTENT = "/admin/content";
export const CREATE_ADMIN_CONTENT = "/admin/content";
export const UPDATE_ADMIN_CONTENT = "/admin/content";
export const DELETE_ADMIN_CONTENT = "/admin/content";
export const GET_BANNERS = "/admin/banners";
export const CREATE_BANNER = "/admin/banners";
export const UPDATE_BANNER = "/admin/banners";
export const DELETE_BANNER = "/admin/banners";

// Package Plans (Pricing-Loyalty Service)
export const GET_PACKAGE_PLANS = "/package-plans";
export const CREATE_PACKAGE_PLAN = "/package-plans";
export const UPDATE_PACKAGE_PLAN = "/package-plans";
export const DELETE_PACKAGE_PLAN = "/package-plans";

// Rate Plans (Pricing-Loyalty Service)
export const GET_RATE_PLANS = "/rate-plans";
export const CREATE_RATE_PLAN = "/rate-plans";
export const UPDATE_RATE_PLAN = "/rate-plans";
export const DELETE_RATE_PLAN = "/rate-plans";

// Package Subscriptions (Pricing-Loyalty Service)
export const GET_PACKAGE_SUBSCRIPTIONS = "/package-subscriptions";
export const EXPORT_PACKAGE_SUBSCRIPTIONS_PDF = "/package-subscriptions/export";
export const UPDATE_PACKAGE_SUBSCRIPTION_STATUS = "/package-subscriptions";
export const UPDATE_PACKAGE_SUBSCRIPTION = "/package-subscriptions";

// Vendor Subscriptions (Payment Service)
export const INITIATE_SUBSCRIPTION = "/subscription/initiate";
export const GET_CURRENT_SUBSCRIPTION = "/subscription/current";
export const UPDATE_VENDOR_SUBSCRIPTION = "/subscription/update";

// System Settings
export const GET_SYSTEM_SETTINGS = "/admin/settings";
export const UPDATE_SYSTEM_SETTINGS = "/admin/settings";

// Email Templates (Communication Service)
export const GET_EMAIL_TEMPLATES = "/email-templates";
export const GET_EMAIL_TEMPLATE_BY_ID = "/email-templates";
export const CREATE_EMAIL_TEMPLATE = "/email-templates";
export const UPDATE_EMAIL_TEMPLATE = "/email-templates";
export const DELETE_EMAIL_TEMPLATE = "/email-templates";

// Reports & Analytics
export const GET_ADMIN_REPORTS = "/admin/reports";
export const GENERATE_REPORT = "/admin/reports/generate";
export const GET_PLATFORM_STATISTICS = "/admin/statistics";

// Support Tickets / Conversations (Communication Service)
export const GET_CONVERSATIONS = "/conversations";
export const CREATE_CONVERSATION = "/conversations";
export const GET_CONVERSATION_BY_ID = "/conversations";
export const UPDATE_CONVERSATION = "/conversations";
export const DELETE_CONVERSATION = "/conversations";
export const GET_CONVERSATIONS_BY_USER = "/conversations/by-user";

// Messages (Communication Service)
export const GET_MESSAGES = "/messages";
export const CREATE_MESSAGE = "/messages";
export const GET_MESSAGE_BY_ID = "/messages";
export const UPDATE_MESSAGE = "/messages";
export const DELETE_MESSAGE = "/messages";
export const GET_MESSAGES_BY_CONVERSATION = "/messages/by-conversation";

// Message Templates (Communication Service)
export const GET_MESSAGE_TEMPLATES = "/message-templates";
export const CREATE_MESSAGE_TEMPLATE = "/message-templates";
export const GET_MESSAGE_TEMPLATE_BY_ID = "/message-templates";
export const UPDATE_MESSAGE_TEMPLATE = "/message-templates";
export const DELETE_MESSAGE_TEMPLATE = "/message-templates";

// Notifications (Admin)
export const GET_ADMIN_NOTIFICATIONS = "/admin/notifications";
export const CREATE_ADMIN_NOTIFICATION = "/admin/notifications";
export const GET_ADMIN_NOTIFICATION_BY_ID = "/admin/notifications";
export const UPDATE_ADMIN_NOTIFICATION = "/admin/notifications";
export const DELETE_ADMIN_NOTIFICATION = "/admin/notifications";
export const SEND_NOTIFICATION = "/admin/notifications";