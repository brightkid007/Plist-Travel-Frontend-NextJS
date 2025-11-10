import { useMemo } from "react";
import { MoreVertical, Trash2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { Menu, MenuItem, CircularProgress } from "@mui/material";
import { useState } from "react";

const BookingList = ({ bookings = [], loading = false, hasPermission = () => false, onDelete, onAccept, onReject, onRefund, actionLoading = false }) => {
  const [menuAnchor, setMenuAnchor] = useState({});
  const [actionOpenIndex, setActionOpenIndex] = useState(null);

  const handleMenuOpen = (event, id) => {
    setMenuAnchor({ [id]: event.currentTarget });
    setActionOpenIndex(id);
  };

  const handleMenuClose = (id) => {
    setMenuAnchor({ [id]: null });
    setActionOpenIndex(null);
  };
  const rows = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    return list.map((b, i) => {
      const start = b.start_date || b.startDate;
      const end = b.end_date || b.endDate;
      const listing = b.listing || {};
      const category = listing.category || {};
      const subcategory = listing.subcategory || {};

      return {
        id: b.id ?? b._id ?? i,
        image: b.image || "/img/testimonials/1/4.png",
        name: listing.title || b.title || b.name || b.listingName || "—",
        type: listing.type || b.type || b.listingType || b.category_type || "—",
        category: category.name || b.category || b.listingCategory || "—",
        subcategory: subcategory.name || b.subcategory || b.listingSubcategory || "—",
        orderDate: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.orderDate || "—",
        exeTime:
          start && end
            ? `${new Date(start).toLocaleDateString()} ~ ${new Date(end).toLocaleDateString()}`
            : b.exeTime || "—",
        totalPrice:
          b.total_price != null
            ? Number(b.total_price)
            : b.totalPrice != null
            ? Number(b.totalPrice)
            : b.amount || b.price || 0,
        paid: b.payment_status != null ? b.payment_status : 'unpaid',
        status: (b.status || b.bookingStatus || "pending").replace(/^./, (c) => c.toUpperCase()),
        originalStatus: b.status || b.bookingStatus || "pending",
        transactionId: b.transaction_id || b.transactionId || b.payment_id || b.paymentId,
      };
    });
  }, [bookings]);

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
            <th>Image</th>
            <th>Name</th>
            <th>Listing Type</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Order Date</th>
            <th>Execution Time</th>
            <th>Total Price</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={11} className="text-center py-20">
                <div className="d-inline-flex items-center justify-center gap-2 text-14 text-light-1">
                  <CircularProgress size={24} />
                  <span>Loading bookings...</span>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-20">
                <div className="d-inline-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                  <Calendar size={32} className="text-light-1 mb-5" />
                  <span>No bookings found</span>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                <td className="align-middle">
                  <img
                    className="rounded-8"
                    src={row.image}
                    alt={row.name}
                    style={{
                      height: "50px",
                      width: "60px",
                      objectFit: "fill",
                    }}
                  />
                </td>
                <td className="align-middle">{row.name}</td>
                <td className="align-middle">{row.type}</td>
                <td className="align-middle">{row.category}</td>
                <td className="align-middle">{row.subcategory}</td>
                <td className="align-middle">{row.orderDate}</td>
                <td className="align-middle">{row.exeTime}</td>
                <td className="align-middle">{String(row.totalPrice)}</td>
                <td className="align-middle">
                  <span
                    className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${
                      {
                        Paid: "bg-green-4 text-green-3",
                        Unpaid: "bg-yellow-4 text-yellow-3",
                        Refunded: "bg-blue-1-05 text-blue-1",
                      }[(String(row.paid) || "Unpaid").replace(/^./, (c) => c.toUpperCase())] ||
                      "bg-gray-4 text-gray-3"
                    }`}
                  >
                    {(String(row.paid) || "unpaid").replace(/^./, (c) => c.toUpperCase())}
                  </span>
                </td>
                <td className="align-middle">
                  <span
                    className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${
                      {
                        Pending: "bg-yellow-4 text-yellow-3",
                        Approved: "bg-green-4 text-green-3",
                        Cancelled: "bg-red-3 text-red-2",
                        Confirmed: "bg-blue-1-05 text-blue-1",
                      }[row.status] || "bg-gray-4 text-gray-3"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="align-middle">
                  <div className="position-relative">
                    <button
                      className="border-0 bg-transparent cursor-pointer  px-5 py-5"
                      onClick={(e) => handleMenuOpen(e, row.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    <Menu
                      anchorEl={menuAnchor[row.id]}
                      open={Boolean(menuAnchor[row.id])}
                      onClose={() => handleMenuClose(row.id)}
                    >
                      {onAccept && row.originalStatus === "pending" && (
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("booking_oversight", "update")) {
                              onAccept(row.id, row.name);
                              handleMenuClose(row.id);
                            }
                          }}
                          disabled={actionLoading || !hasPermission("booking_oversight", "update")}
                          className="text-green-1"
                        >
                          <CheckCircle2 size={16} className="mr-10" />
                          Accept
                        </MenuItem>
                      )}
                      {onReject && (row.originalStatus === "pending" || row.originalStatus === "confirmed") && (
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("booking_oversight", "update")) {
                              onReject(row.id, row.name);
                              handleMenuClose(row.id);
                            }
                          }}
                          disabled={actionLoading || !hasPermission("booking_oversight", "update")}
                          className="text-yellow-3"
                        >
                          <XCircle size={16} className="mr-10" />
                          Reject
                        </MenuItem>
                      )}
                      {onRefund && row.transactionId && (row.originalStatus !== "confirmed" || row.originalStatus === "cancelled") && (
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("booking_oversight", "update")) {
                              onRefund(row.id, row.name, row.transactionId);
                              handleMenuClose(row.id);
                            }
                          }}
                          disabled={actionLoading || row.paid !== "refunded" || !hasPermission("booking_oversight", "update")}
                          className="text-blue-1"
                        >
                          Refund
                        </MenuItem>
                      )}
                      {onDelete && (
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("booking_oversight", "delete")) {
                              onDelete(row.id, row.name);
                              handleMenuClose(row.id);
                            }
                          }}
                          disabled={actionLoading || !hasPermission("booking_oversight", "delete")}
                          className="text-red-2"
                        >
                          <Trash2 size={16} className="mr-10" />
                          Delete
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
