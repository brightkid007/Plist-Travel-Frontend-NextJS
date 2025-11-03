import { MapPin } from "lucide-react";

const RecentBooking = ({ bookings = [], loading = false }) => {

  const statusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-4 text-green-2";
      case "Unpaid":
        return "bg-red-4 text-red-1";
      case "Process":
        return "bg-yellow-4 text-dark-yellow";
      default:
        return "bg-light-2 text-light-1";
    }
  };

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
      <thead>
        <tr className="text-light-1 fw-600">
          <th>ID</th>
          <th>Service</th>
          <th>Status</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Customer Type</th>
          <th>Vendor</th>
          <th>Agent</th>
          <th>Booking Channel</th>
          <th>Location</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={11} className="text-12 text-light-1 py-10">Loading...</td></tr>
        ) : bookings.length === 0 ? (
          <tr><td colSpan={11} className="text-12 text-light-1 py-10">No bookings found.</td></tr>
        ) : (
          bookings.map((row, index) => (
            <tr key={row.id || index}>
              <td className="align-middle">{row.id || index + 1}</td>
              <td className="align-middle fw-600">{row.service || row.listing_type || '-'}</td>
              <td className="align-middle fw-500">
                <span className={`rounded-100 px-10 text-center text-12 ${statusColor(row.status || row.payment_status)}`}>
                  {(row.status || row.payment_status || '-').toString()}
                </span>
              </td>
              <td className="align-middle fw-500">{typeof row.total !== 'undefined' ? row.total : (row.total_amount || row.amount || '-')}</td>
              <td className="align-middle fw-500">{row.paid || (row.payment_status === 'paid' ? 'Paid' : 'Unpaid')}</td>
              <td className="align-middle fw-500">{row.customer_type || '-'}</td>
              <td className="align-middle fw-500">{row.vendor || row.vendor_name || '-'}</td>
              <td className="align-middle fw-500">{row.agent || row.agent_name || '-'}</td>
              <td className="align-middle fw-500">{row.booking_channel || '-'}</td>
              <td className="align-middle fw-500"><MapPin size={14} />{row.location || '-'}</td>
              <td className="align-middle fw-500">{new Date(row.created_at || row.createdAt || Date.now()).toLocaleDateString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  );
};

export default RecentBooking;
