import { BookingAPIClient } from "./api_helper";
import * as url from "./url_helper";

const api = BookingAPIClient;

// ===========================================
// BOOKING MANAGEMENT
// ===========================================

// Get all bookings
export const getBookings = (params) => api.get(url.GET_ADMIN_BOOKINGS, params);

// Get booking by ID
export const getBookingById = (id) => api.get(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}`);

// Create booking
export const createBooking = (data) => api.create(url.ADD_NEW_ORDER, data);

// Update booking
export const updateBooking = (id, data) => api.update(`${url.UPDATE_ORDER}/${id}`, data);

// Delete booking
export const deleteBooking = (id) => api.delete(`${url.DELETE_ORDER}/${id}`);

// Update booking status
export const updateBookingStatus = (id, data) => api.update(`${url.UPDATE_BOOKING_STATUS}/${id}/status`, data);

// Force booking status (admin override)
export const forceBookingStatus = (id, status) => api.update(`${url.FORCE_BOOKING_STATUS}/${id}/${status}`);

// Get booking analytics
export const getBookingAnalytics = (params) => api.get(url.GET_BOOKING_ANALYTICS, params);

// Check-in booking
export const checkInBooking = (id) => api.create(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}/checkin`);

// Check-out booking
export const checkOutBooking = (id) => api.create(`${url.GET_ADMIN_BOOKING_BY_ID}/${id}/checkout`);

// Get booking statistics
export const getBookingStatistics = (params) => api.get(url.GET_TRANSACTION_STATISTICS, params);
