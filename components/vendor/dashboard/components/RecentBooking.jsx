const RecentBooking = ({ bookings = [], loading = false }) => {
  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-16 text-light-1">Loading bookings...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-16 text-light-1">No recent bookings</div>
      </div>
    );
  }

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <tbody>
          {bookings.map((row, index) => (
            <tr key={index}>
              <td className="align-middle">
                <div className="d-flex items-center">
                  <span className="material-symbols-outlined text-light-1 px-5">
                    person
                  </span>
                  <div className="ml-10 d-flex flex-column items-start">
                    <div className="text-16 fw-500 lh-14">{row.name}</div>
                    <div className="text-light-1 lh-14">{row.email}</div>
                  </div>
                </div>
              </td>
              <td className="align-middle" style={{ width: "10%" }}>
                <div
                  className={`rounded-100 px-20 text-center text-14 fw-500 ${row.status == "Pending"
                    ? "bg-white border-light text-dark"
                    : "bg-dark-4 text-white"
                    }`}
                >
                  {row.status}
                </div>
              </td>
              <td className="align-middle text-16 fw-500" style={{ width: "10%" }}>
                <div className="ml-20 d-flex flex-column items-end">
                  <div className="text-16 fw-500 lh-14">{row.price}</div>
                  <div className="text-light-1 lh-14">{row.createdAt}</div>
                </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBooking;
