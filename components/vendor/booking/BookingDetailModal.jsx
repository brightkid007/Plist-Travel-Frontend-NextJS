"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { getVendorBookingDetail } from "@/helpers/backend_helper";
import { useEffect, useState } from "react";

const BookingDetailModal = ({ open, onClose, bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && bookingId) {
      loadBookingDetail();
    } else {
      setBooking(null);
      setError(null);
    }
  }, [open, bookingId]);

  const loadBookingDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendorBookingDetail(bookingId);
      const bookingData = response?.data?.booking || response?.booking || response;
      setBooking(bookingData);
    } catch (err) {
      console.error("Error loading booking detail:", err);
      setError(typeof err === "string" ? err : err?.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(parseFloat(amount));
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "pending":
        return "bg-yellow-4 text-yellow-3";
      case "confirmed":
        return "bg-blue-1-05 text-blue-1";
      case "completed":
        return "bg-green-4 text-green-3";
      case "cancelled":
        return "bg-red-3 text-red-2";
      default:
        return "bg-gray-4 text-gray-3";
    }
  };

  const getPaymentStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "paid":
        return "bg-green-4 text-green-3";
      case "unpaid":
        return "bg-yellow-4 text-yellow-3";
      case "refunded":
        return "bg-gray-4 text-gray-3";
      default:
        return "bg-gray-4 text-gray-3";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="booking-detail-dialog-title"
    >
      <DialogTitle id="booking-detail-dialog-title" className="d-flex items-center justify-between">
        <span className="text-20 fw-600">Booking Details</span>
        <button
          onClick={onClose}
          className="border-0 bg-transparent cursor-pointer p-0"
          aria-label="close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <div className="d-flex justify-center items-center py-40">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-center py-40 text-red-1">{error}</div>
        ) : booking ? (
          <div className="py-10">
            {/* Booking Status */}
            <div className="mb-20">
              <div className="d-flex items-center gap-10 mb-10">
                <span className="text-14 text-light-1">Status:</span>
                <span
                  className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status || "N/A"}
                </span>
                <span className="text-14 text-light-1 ml-20">Payment:</span>
                <span
                  className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${getPaymentStatusColor(
                    booking.payment_status
                  )}`}
                >
                  {booking.payment_status || "N/A"}
                </span>
              </div>
            </div>

            <div className="border-top-light mb-20" />

            {/* Guest Information */}
            <div className="mb-20">
              <h3 className="text-16 fw-600 mb-15">Guest Information</h3>
              <div className="row y-gap-10">
                <div className="col-12">
                  <div className="text-14 text-light-1">Guest Name:</div>
                  <div className="text-15 fw-500">
                    {booking.user?.user_profile?.first_name || booking.user?.user_profile?.last_name
                      ? `${booking.user?.user_profile?.first_name || ""} ${booking.user?.user_profile?.last_name || ""}`.trim()
                      : booking.user?.email || "N/A"}
                  </div>
                </div>
                {booking.user?.email && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Email:</div>
                    <div className="text-15 fw-500">{booking.user.email}</div>
                  </div>
                )}
                {booking.user?.user_profile?.phone && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Phone:</div>
                    <div className="text-15 fw-500">{booking.user.user_profile.phone}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-top-light mb-20" />

            {/* Listing Information */}
            <div className="mb-20">
              <h3 className="text-16 fw-600 mb-15">Listing Information</h3>
              <div className="row y-gap-10">
                <div className="col-12">
                  <div className="text-14 text-light-1">Listing:</div>
                  <div className="text-15 fw-500">{booking.listing?.title || "N/A"}</div>
                </div>
                <div className="col-12">
                  <div className="text-14 text-light-1">Type:</div>
                  <div className="text-15 fw-500">{booking.listing?.type || "N/A"}</div>
                </div>
                {booking.listing?.category && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Category:</div>
                    <div className="text-15 fw-500">{booking.listing.category.name || "N/A"}</div>
                  </div>
                )}
                {booking.listing?.subcategory && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Subcategory:</div>
                    <div className="text-15 fw-500">{booking.listing.subcategory.name || "N/A"}</div>
                  </div>
                )}
                {booking.room_type && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Room Type:</div>
                    <div className="text-15 fw-500">{booking.room_type.name || "N/A"}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-top-light mb-20" />

            {/* Booking Dates */}
            <div className="mb-20">
              <h3 className="text-16 fw-600 mb-15">Booking Dates</h3>
              <div className="row y-gap-15">
                <div className="col-md-6">
                  <div className="text-14 text-light-1">Check-in:</div>
                  <div className="text-15 fw-500">{formatDate(booking.start_date)}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-14 text-light-1">Check-out:</div>
                  <div className="text-15 fw-500">{formatDate(booking.end_date)}</div>
                </div>
                {booking.guest_count && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Guest Count:</div>
                    <div className="text-15 fw-500">{booking.guest_count} guest(s)</div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-top-light mb-20" />

            {/* Pricing Information */}
            <div className="mb-20">
              <h3 className="text-16 fw-600 mb-15">Pricing Information</h3>
              <div className="row y-gap-10">
                <div className="col-12">
                  <div className="d-flex justify-between items-center">
                    <span className="text-14 text-light-1">Total Price:</span>
                    <span className="text-16 fw-600">
                      {formatCurrency(booking.total_price, booking.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-top-light mb-20" />

            {/* Additional Information */}
            <div className="mb-20">
              <h3 className="text-16 fw-600 mb-15">Additional Information</h3>
              <div className="row y-gap-10">
                <div className="col-12">
                  <div className="text-14 text-light-1">Booking ID:</div>
                  <div className="text-15 fw-500">#{booking.id}</div>
                </div>
                <div className="col-12">
                  <div className="text-14 text-light-1">Created At:</div>
                  <div className="text-15 fw-500">{formatDateTime(booking.created_at || booking.createdAt)}</div>
                </div>
                {booking.updated_at && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Last Updated:</div>
                    <div className="text-15 fw-500">{formatDateTime(booking.updated_at || booking.updatedAt)}</div>
                  </div>
                )}
                {booking.check_in_time && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Check-in Time:</div>
                    <div className="text-15 fw-500">{formatDateTime(booking.check_in_time)}</div>
                  </div>
                )}
                {booking.check_out_time && (
                  <div className="col-12">
                    <div className="text-14 text-light-1">Check-out Time:</div>
                    <div className="text-15 fw-500">{formatDateTime(booking.check_out_time)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
      <DialogActions className="px-20 pb-20">
        <button
          className="text-14 border-light rounded-8 px-20 py-10 fw-500"
          onClick={onClose}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailModal;

