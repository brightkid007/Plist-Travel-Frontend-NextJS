const PopularList = () => {
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
    <div className="overflow-scroll scroll-bar-1 pt-30">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Bookings</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="align-middle">
                <img
                className="rounded-8"
                  src={row.image}
                  alt={row.name}
                  style={{ height: "50px", width: "60px", objectFit: "fill" }}
                />
              </td>
              <td className="align-middle">{row.name}</td>
              <td className="align-middle">{row.type}</td>
              <td className="align-middle">{row.bookings}</td>
              <td className="align-middle">{row.revenue}</td>
              <td className="align-middle">
                <div
                  className={`rounded-100 py-4 text-center col-12 text-14 fw-500 bg-${row.status.color} text-${row.status.text}`}
                >
                  {row.status.label}
                </div>
              </td>
              <td className="align-middle">
                <i className="icon icon-more-horiz"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PopularList;
