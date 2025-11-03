import { useMemo } from "react";

const BookingList = ({ bookings = [] }) => {
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-40">
                <div className="text-16 text-light-1">No Booking is existing.</div>
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
                  <span className="material-symbols-outlined">more_horiz</span>
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
