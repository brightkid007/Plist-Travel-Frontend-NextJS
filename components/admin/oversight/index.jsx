"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import AdminDashboardLayout from "../common/layout";
import DashboardCard from "../common/DashboardCard";
import data from "./data";
import Filter from "../common/Filter";
import BookingList from "./BookingList";
import { getAdminBookings, exportAdminData, deleteBooking, updateBookingStatus, refundTransaction } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const index = () => {
  const [cards, setCards] = useState(data);
  const [filters, setFilters] = useState({});
  const [bookings, setBookings] = useState([]);
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Reject confirmation modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [bookingToReject, setBookingToReject] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  
  // Refund confirmation modal state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [bookingToRefund, setBookingToRefund] = useState(null);
  const [refunding, setRefunding] = useState(false);
  
  // Action loading state
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = async () => {
    try {
      await exportAdminData({ scope: "bookings", ...filters });
      toast.success("Export started");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Export failed");
    }
  };

  const loadBookings = async () => {
    try {
      const res = await getAdminBookings(filters);
      const summary = res?.summary || res?.data?.summary;
      const bookingsList = res?.bookings || res?.data?.bookings || [];
      setBookings(bookingsList);
      
      const total = summary?.total ?? bookingsList.length ?? cards[0].amount;
      const confirmed = summary?.confirmed ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "confirmed").length ?? cards[1].amount;
      const pending = summary?.pending ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "pending").length ?? cards[2].amount;
      const canceled = summary?.cancelled ?? summary?.canceled ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "cancelled").length ?? cards[3].amount;
      setCards([
        { ...cards[0], amount: String(total) },
        { ...cards[1], amount: String(confirmed) },
        { ...cards[2], amount: String(pending) },
        { ...cards[3], amount: String(canceled) },
      ]);
    } catch (_) {
      setBookings([]);
    }
  };

  const handleDeleteClick = (id, name) => {
    setBookingToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      setDeleting(true);
      await deleteBooking(bookingToDelete.id);
      toast.success("Booking deleted successfully");
      setDeleteModalOpen(false);
      setBookingToDelete(null);
      await loadBookings(); // Refresh the list
    } catch (error) {
      toast.error(error?.message || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  // Handle accept booking
  const handleAcceptBooking = async (id, name) => {
    try {
      setActionLoading(true);
      await updateBookingStatus(id, { status: "confirmed" });
      toast.success(`Booking "${name || `#${id}`}" has been accepted`);
      await loadBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to accept booking");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject booking
  const handleRejectClick = (id, name) => {
    setBookingToReject({ id, name });
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!bookingToReject) return;

    try {
      setRejecting(true);
      await updateBookingStatus(bookingToReject.id, { status: "cancelled" });
      toast.success(`Booking "${bookingToReject.name || `#${bookingToReject.id}`}" has been rejected`);
      setRejectModalOpen(false);
      setBookingToReject(null);
      await loadBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to reject booking");
    } finally {
      setRejecting(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setBookingToReject(null);
  };

  // Handle refund booking
  const handleRefundClick = (id, name, transactionId) => {
    setBookingToRefund({ id, name, transactionId });
    setRefundModalOpen(true);
  };

  const handleRefundConfirm = async () => {
    if (!bookingToRefund || !bookingToRefund.transactionId) {
      toast.error("Transaction ID not found for this booking");
      return;
    }

    try {
      setRefunding(true);
      await refundTransaction(bookingToRefund.transactionId);
      toast.success(`Refund processed for booking "${bookingToRefund.name || `#${bookingToRefund.id}`}"`);
      setRefundModalOpen(false);
      setBookingToRefund(null);
      await loadBookings();
    } catch (error) {
      toast.error(error?.message || "Failed to process refund");
    } finally {
      setRefunding(false);
    }
  };

  const handleRefundCancel = () => {
    setRefundModalOpen(false);
    setBookingToRefund(null);
  };
  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Booking Oversight</h1>
          <div className="text-14 text-light-1 lh-14">
            Manage and monitor all bookings across the platform.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button onClick={handleExport} className="button border-light bg-white px-20 py-10 rounded-8">
            <Download size={18} className="mr-10" /> Export
          </button>
        </div>
      </div>

      <Filter onFilterChange={handleFilterChange} />

      <DashboardCard data={cards} />

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
        <BookingList 
          bookings={bookings} 
          onDelete={handleDeleteClick}
          onAccept={handleAcceptBooking}
          onReject={handleRejectClick}
          onRefund={handleRefundClick}
          actionLoading={actionLoading}
        />
      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking "${bookingToDelete?.name || `#${bookingToDelete?.id}`}"?`}
        itemName={bookingToDelete?.name || `Booking #${bookingToDelete?.id}`}
        loading={deleting}
      />

      <DeleteConfirmationModal
        open={rejectModalOpen}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        title="Reject Booking"
        message={`Are you sure you want to reject the booking "${bookingToReject?.name || `#${bookingToReject?.id}`}"? This will cancel the booking.`}
        itemName={bookingToReject?.name || `Booking #${bookingToReject?.id}`}
        loading={rejecting}
      />

      <DeleteConfirmationModal
        open={refundModalOpen}
        onClose={handleRefundCancel}
        onConfirm={handleRefundConfirm}
        title="Refund Booking"
        message={`Are you sure you want to process a refund for the booking "${bookingToRefund?.name || `#${bookingToRefund?.id}`}"? This action cannot be undone.`}
        itemName={bookingToRefund?.name || `Booking #${bookingToRefund?.id}`}
        loading={refunding}
      />
    </AdminDashboardLayout>
  );
};

export default index;
