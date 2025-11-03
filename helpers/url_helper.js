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

// System Settings
export const GET_SYSTEM_SETTINGS = "/admin/settings";
export const UPDATE_SYSTEM_SETTINGS = "/admin/settings";
export const GET_EMAIL_TEMPLATES = "/admin/email-templates";
export const UPDATE_EMAIL_TEMPLATE = "/admin/email-templates";

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