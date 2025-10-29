import { ListingAPIClient } from "./api_helper";
import * as url from "./url_helper";

const api = ListingAPIClient;

// ===========================================
// LISTING MANAGEMENT
// ===========================================

// Get all listings
export const getListings = (params) => api.get(url.GET_ADMIN_LISTINGS, params);

// Get listing by ID
export const getListingById = (id) => api.get(`${url.GET_ADMIN_LISTING_BY_ID}/${id}`);

// Create listing
export const createListing = (data) => api.create(url.ADD_NEW_EVENT, data);

// Update listing
export const updateListing = (id, data) => api.update(`${url.UPDATE_EVENT}/${id}`, data);

// Delete listing
export const deleteListing = (id) => api.delete(`${url.DELETE_EVENT}/${id}`);

// Update listing status
export const updateListingStatus = (id, data) => api.update(`${url.UPDATE_LISTING_STATUS}/${id}/status`, data);

// Approve listing
export const approveListing = (id) => api.update(`${url.APPROVE_LISTING}/${id}/approve`);

// Reject listing
export const rejectListing = (id, data) => api.update(`${url.REJECT_LISTING}/${id}/reject`, data);

// Get listing analytics
export const getListingAnalytics = (params) => api.get(url.GET_LISTING_ANALYTICS, params);

// ===========================================
// CATEGORY MANAGEMENT
// ===========================================

// Get all categories
export const getCategories = (params) => api.get(url.GET_ADMIN_CATEGORIES, params);

// Create category
export const createCategory = (data) => api.create(url.CREATE_ADMIN_CATEGORY, data);

// Update category
export const updateCategory = (id, data) => api.update(`${url.UPDATE_ADMIN_CATEGORY}/${id}`, data);

// Delete category
export const deleteCategory = (id) => api.delete(`${url.DELETE_ADMIN_CATEGORY}/${id}`);

// ===========================================
// VENDOR MANAGEMENT
// ===========================================

// Get all vendors
export const getVendors = (params) => api.get(url.GET_ADMIN_VENDORS, params);

// Get vendor by ID
export const getVendorById = (id) => api.get(`${url.GET_ADMIN_VENDOR_BY_ID}/${id}`);

// Update vendor status
export const updateVendorStatus = (id, data) => api.update(`${url.UPDATE_VENDOR_STATUS}/${id}/status`, data);

// Approve vendor
export const approveVendor = (id) => api.update(`${url.APPROVE_VENDOR}/${id}/approve`);

// Reject vendor
export const rejectVendor = (id, data) => api.update(`${url.REJECT_VENDOR}/${id}/reject`, data);

// Get vendor analytics
export const getVendorAnalytics = (params) => api.get(url.GET_VENDOR_ANALYTICS, params);
