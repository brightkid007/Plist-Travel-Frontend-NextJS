const PopularList = ({ detail = false, listings = [], loading = false }) => {
  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-16 text-light-1">Loading listings...</div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-16 text-light-1">No popular listings</div>
      </div>
    );
  }

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12 text-14">
        <thead className="text-nowrap">
          <tr className="text-light-1 fw-600">
            {!detail && <th>Image</th>}
            <th>Name</th>
            <th>Type</th>
            <th>Bookings</th>
            <th>Revenue</th>
            {!detail && <th>Status</th>}
          </tr>
        </thead>
        <tbody>
          {listings.map((row, index) => (
            <tr key={index}>
              {!detail && (
                <td className="align-middle">
                  <img
                    className="rounded-8"
                    src={row.image}
                    alt={row.name}
                    style={{ height: "50px", width: "60px", objectFit: "fill" }}
                  />
                </td>
              )}
              <td className="align-middle fw-600">{row.name}</td>
              <td className="align-middle fw-500">{row.type}</td>
              <td className="align-middle fw-500">{row.bookings}</td>
              <td className="align-middle fw-500">{row.revenue}</td>
              {!detail && (
                <td className="align-middle fw-500">
                  <span
                    className={`rounded-100 px-10 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                  >
                    {row.status.label}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PopularList;
