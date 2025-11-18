import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  updateVendorBookingStatus,
  checkInVendorBooking,
  checkOutVendorBooking,
} from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import BookingDetailModal from "./BookingDetailModal";

const BookingList = ({ detail = false, bookings = [], loading = false, onRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Use bookings prop if provided, otherwise show empty state
  const data = bookings;

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleAction = async (action) => {
    if (!selectedBooking) return;

    // Get booking ID from the row data
    const bookingId = selectedBooking.booking?.id || selectedBooking.id;
    if (!bookingId) return;

    try {
      setActionLoading(true);
      
      switch (action) {
        case "view":
          setSelectedBookingId(bookingId);
          setDetailModalOpen(true);
          handleMenuClose();
          return; // Don't refresh or show loading for view action
        case "confirm":
          await updateVendorBookingStatus(bookingId, "confirmed");
          toast.success("Booking confirmed successfully");
          break;
        case "cancel":
          await updateVendorBookingStatus(bookingId, "cancelled");
          toast.success("Booking cancelled successfully");
          break;
        case "complete":
          await updateVendorBookingStatus(bookingId, "completed");
          toast.success("Booking marked as completed");
          break;
        case "checkin":
          await checkInVendorBooking(bookingId);
          toast.success("Guest checked in successfully");
          break;
        case "checkout":
          await checkOutVendorBooking(bookingId);
          toast.success("Guest checked out successfully");
          break;
        default:
          break;
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      const errorMessage = typeof error === "string" ? error : error?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  // Determine available actions based on booking status
  const getAvailableActions = (booking) => {
    const status = booking?.status?.toLowerCase() || booking?.booking?.status?.toLowerCase() || "";
    const actions = [];

    // View detail is always available
    actions.push({ label: "View Details", value: "view" });

    // Status-based actions
    if (status === "pending") {
      actions.push({ label: "Confirm", value: "confirm" });
      actions.push({ label: "Cancel", value: "cancel" });
    } else if (status === "confirmed") {
      actions.push({ label: "Check-in", value: "checkin" });
      actions.push({ label: "Cancel", value: "cancel" });
      actions.push({ label: "Mark as Completed", value: "complete" });
    } else if (status === "checked_in" || status === "checked-in") {
      actions.push({ label: "Check-out", value: "checkout" });
    }

    return actions;
  };

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
            <th>#</th>
            <th>Name</th>
            <th>Listing Type</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Order Date</th>
            <th>Execution Time</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={11} className="text-center py-20">
                <div className="d-flex justify-center items-center">
                  <div className="text-16 text-light-1">Loading bookings...</div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-20 text-light-1">
                No bookings found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{row.name}</td>
                <td className="align-middle">{row.type}</td>
                <td className="align-middle">{row.category}</td>
                <td className="align-middle">{row.subcategory}</td>
                <td className="align-middle">{row.orderDate}</td>
                <td className="align-middle">{row.exeTime}</td>
                <td className="align-middle">{row.totalPrice}</td>
                <td className="align-middle">
                  <span
                    className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${{
                      Pending: "bg-yellow-4 text-yellow-3",
                      // Approved: "bg-green-4 text-green-3",
                      Completed: "bg-green-4 text-green-3",
                      Cancelled: "bg-red-3 text-red-2",
                      Confirmed: "bg-blue-1-05 text-blue-1",
                    }[row.status] || "bg-gray-4 text-gray-3"
                      }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="align-middle">
                  <button
                    className="border-0 bg-transparent cursor-pointer"
                    onClick={(e) => handleMenuOpen(e, row)}
                    disabled={actionLoading}
                  >
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "action-button",
        }}
      >
        {selectedBooking &&
          getAvailableActions(selectedBooking).map((action) => (
            <MenuItem
              key={action.value}
              onClick={() => handleAction(action.value)}
              disabled={actionLoading}
            >
              {action.label}
            </MenuItem>
          ))}
      </Menu>

      <BookingDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
      />
    </div>
  );
};

export default BookingList;
