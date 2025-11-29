"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import AdminDashboardLayout from "../common/layout";
import DashboardCard from "../common/DashboardCard";
import data from "./data";
import Filter from "../common/Filter";
import BookingList from "./BookingList";
import { getAdminBookings, deleteBooking, updateBookingStatus, refundTransaction } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { usePermissions } from "@/hooks/usePermissions";

const index = () => {
  const { hasPermission } = usePermissions();
  const [cards, setCards] = useState(data);
  const [filters, setFilters] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    categories: [],
    subcategories: [],
    types: [],
  });

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

  const handleExport = () => {
    try {
      if (bookings.length === 0) {
        toast.error("No bookings to export");
        return;
      }

      // Define CSV columns
      const cols = [
        { key: 'id', label: 'Booking ID' },
        { key: 'name', label: 'Listing Name' },
        { key: 'type', label: 'Listing Type' },
        { key: 'category', label: 'Category' },
        { key: 'subcategory', label: 'Subcategory' },
        { key: 'orderDate', label: 'Order Date' },
        { key: 'exeTime', label: 'Execution Time' },
        { key: 'totalPrice', label: 'Total Price' },
        { key: 'currency', label: 'Currency' },
        { key: 'paid', label: 'Payment Status' },
        { key: 'status', label: 'Booking Status' },
        { key: 'guestName', label: 'Guest Name' },
        { key: 'guestEmail', label: 'Guest Email' },
        { key: 'guestCount', label: 'Guest Count' },
      ];

      // Process bookings data similar to BookingList component
      const processedBookings = bookings.map((b) => {
        const start = b.start_date || b.startDate;
        const end = b.end_date || b.endDate;
        const listing = b.listing || {};
        const category = listing.category || {};
        const subcategory = listing.subcategory || {};
        const user = b.user || {};
        const userProfile = user.user_profile || {};

        return {
          id: b.id ?? b._id ?? '',
          name: listing.title || b.title || b.name || b.listingName || '',
          type: listing.type || b.type || b.listingType || b.category_type || '',
          category: category.name || b.category || b.listingCategory || '',
          subcategory: subcategory.name || b.subcategory || b.listingSubcategory || '',
          orderDate: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.orderDate || '',
          exeTime: start && end
            ? `${new Date(start).toLocaleDateString()} ~ ${new Date(end).toLocaleDateString()}`
            : b.exeTime || '',
          totalPrice: b.total_price != null
            ? Number(b.total_price)
            : b.totalPrice != null
              ? Number(b.totalPrice)
              : b.amount || b.price || 0,
          currency: b.currency || 'USD',
          paid: (b.payment_status || 'unpaid').replace(/^./, (c) => c.toUpperCase()),
          status: (b.status || b.bookingStatus || "pending").replace(/^./, (c) => c.toUpperCase()),
          guestName: userProfile.first_name && userProfile.last_name
            ? `${userProfile.first_name} ${userProfile.last_name}`
            : user.email || '',
          guestEmail: user.email || '',
          guestCount: b.guest_count || b.guestCount || '',
        };
      });

      // Create CSV header
      const header = cols.map(c => '"' + c.label.replace(/"/g, '""') + '"').join(',');

      // Create CSV rows
      const lines = processedBookings.map((r) =>
        cols.map(c => {
          const v = r[c.key];
          return '"' + (v instanceof Date ? v.toISOString() : (v ?? '')).toString().replace(/"/g, '""') + '"';
        }).join(',')
      );

      // Combine header and rows
      const csv = [header, ...lines].join('\n');

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `bookings_export_${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${bookings.length} booking(s) to CSV`);
    } catch (e) {
      toast.error(e?.message || "Export failed");
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getAdminBookings(filters);
      const summary = res?.summary || res?.data?.summary;
      const bookingsList = res?.bookings || res?.data?.bookings || [];
      setBookings(bookingsList);

      // Build filter options from fetched data
      try {
        const statusSet = new Set();
        const typeSet = new Set();
        const categoriesMap = new Map(); // id -> { id, name }
        const subcategoriesMap = new Map(); // id -> { id, name, listing_category_id }

        bookingsList.forEach((b) => {
          // Status
          const status = (b.status || b.bookingStatus || "").toString().toLowerCase();
          if (status) statusSet.add(status);

          // Type
          const listing = b.listing || {};
          const typeVal = (listing.type || b.type || b.listingType || b.category_type || "").toString().toLowerCase();
          if (typeVal) typeSet.add(typeVal);

          // Category
          const category = listing.category || {};
          if (category && (category.id != null || category.name)) {
            const cid = category.id ?? category.listing_category_id;
            if (cid != null && !categoriesMap.has(cid)) {
              categoriesMap.set(cid, { id: cid, name: category.name || `Category ${cid}` });
            }
          }

          // Subcategory
          const subcategory = listing.subcategory || {};
          if (subcategory && (subcategory.id != null || subcategory.name)) {
            const sid = subcategory.id;
            if (sid != null && !subcategoriesMap.has(sid)) {
              subcategoriesMap.set(sid, {
                id: sid,
                name: subcategory.name || `Subcategory ${sid}`,
                listing_category_id: subcategory.listing_category_id ?? subcategory.category_id,
              });
            }
          }
        });

        setFilterOptions({
          statuses: Array.from(statusSet),
          types: Array.from(typeSet),
          categories: Array.from(categoriesMap.values()),
          subcategories: Array.from(subcategoriesMap.values()),
        });
      } catch (e) {
        // Safe fallback if option building fails
        setFilterOptions({
          statuses: [],
          types: [],
          categories: [],
          subcategories: [],
        });
      }

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
    } catch (error) {
      toast.error(error?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    if (!hasPermission("booking_oversight", "delete")) {
      toast.error("You don't have permission to delete bookings");
      return;
    }
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
    if (!hasPermission("booking_oversight", "update")) {
      toast.error("You don't have permission to accept bookings");
      return;
    }
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
    if (!hasPermission("booking_oversight", "update")) {
      toast.error("You don't have permission to reject bookings");
      return;
    }
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
    if (!hasPermission("booking_oversight", "update")) {
      toast.error("You don't have permission to process refunds");
      return;
    }
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

      <Filter onFilterChange={handleFilterChange} options={filterOptions} />

      <DashboardCard data={cards} />

      <div className="py-15 px-15 rounded-8 bg-white shadow-3 h-100 mt-20">
        <div className="d-flex items-center justify-end mb-10">
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search bookings..."
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i
              className="icon-search text-light-1 position-absolute"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            ></i>
          </div>
        </div>
        <div className="border-light rounded-8 px-15 py-5">
          <BookingList
            bookings={searchTerm ? bookings.filter((b) => {
              const search = searchTerm.toLowerCase();
              const listing = b.listing || {};
              const name = (listing.title || b.title || b.name || b.listingName || "").toLowerCase();
              const type = (listing.type || b.type || b.listingType || b.category_type || "").toLowerCase();
              const category = ((listing.category || {}).name || b.category || b.listingCategory || "").toLowerCase();
              const subcategory = ((listing.subcategory || {}).name || b.subcategory || b.listingSubcategory || "").toLowerCase();
              const status = (b.status || b.bookingStatus || "").toLowerCase();
              const paid = (b.payment_status || "").toLowerCase();

              return (
                name.includes(search) ||
                type.includes(search) ||
                category.includes(search) ||
                subcategory.includes(search) ||
                status.includes(search) ||
                paid.includes(search) ||
                String(b.id || b._id || "").includes(search)
              );
            }) : bookings}
            loading={loading}
            hasPermission={hasPermission}
            onDelete={handleDeleteClick}
            onAccept={handleAcceptBooking}
            onReject={handleRejectClick}
            onRefund={handleRefundClick}
            actionLoading={actionLoading}
          />
        </div>
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking "${bookingToDelete?.name || `#${bookingToDelete?.id}`}"?`}
        itemName={bookingToDelete?.name || `Booking #${bookingToDelete?.id}`}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />

      <ConfirmationModal
        open={rejectModalOpen}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        title="Reject Booking"
        message={`Are you sure you want to reject the booking "${bookingToReject?.name || `#${bookingToReject?.id}`}"? This will cancel the booking.`}
        itemName={bookingToReject?.name || `Booking #${bookingToReject?.id}`}
        loading={rejecting}
        confirmLabel="Reject"
        confirmingLabel="Rejecting..."
      />

      <ConfirmationModal
        open={refundModalOpen}
        onClose={handleRefundCancel}
        onConfirm={handleRefundConfirm}
        title="Refund Booking"
        message={`Are you sure you want to process a refund for the booking "${bookingToRefund?.name || `#${bookingToRefund?.id}`}"? This action cannot be undone.`}
        itemName={bookingToRefund?.name || `Booking #${bookingToRefund?.id}`}
        loading={refunding}
        confirmLabel="Refund"
        confirmingLabel="Refunding..."
      />
    </AdminDashboardLayout>
  );
};

export default index;
