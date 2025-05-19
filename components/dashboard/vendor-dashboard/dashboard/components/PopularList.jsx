const PopularList = ({ detail = false }) => {
  const data = [
    {
      image: "/img/testimonials/1/4.png",
      name: "Luxury Beach Resort",
      type: "Hotel",
      bookings: "45",
      revenue: "$15,750",
      status: { color: "dark-4", text: "white", label: "Active" },
    },
    {
      image: "/img/testimonials/1/4.png",
      name: "City Walking Tour",
      type: "Tour",
      bookings: "32",
      revenue: "$3,840",
      status: { color: "dark-4", text: "white", label: "Active" },
    },
    {
      image: "/img/testimonials/1/4.png",
      name: "Mountain Cabin Retreat",
      type: "Hotel",
      bookings: "28",
      revenue: "$9,800",
      status: { color: "dark-4", text: "white", label: "Active" },
    },
    {
      image: "/img/testimonials/1/4.png",
      name: "Wine Tasting Experience",
      type: "Event",
      bookings: "22",
      revenue: "$2,640",
      status: { color: "dark-4", text: "white", label: "Active" },
    },
    {
      image: "/img/testimonials/1/4.png",
      name: "Desert Safari Adventure",
      type: "Tuor",
      bookings: "18",
      revenue: "$2,160",
      status: { color: "dark-4", text: "white", label: "Active" },
    },
  ];
  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
            {!detail && <th>Image</th>}
            <th>Name</th>
            <th>Type</th>
            <th>Bookings</th>
            <th>Revenue</th>
            {!detail && <th>Status</th>}
            {!detail && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
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
                  <div
                    className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                  >
                    {row.status.label}
                  </div>
                </td>
              )}
              {!detail && (
                <td className="align-middle">
                  <span className="material-symbols-outlined">more_horiz</span>
                  <span className="material-symbols-outlined">north_east</span>
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
