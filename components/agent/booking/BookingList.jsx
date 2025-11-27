const BookingList = () => {
  const data = [
    {
      id: 1,
      image: "/img/testimonials/1/4.png",
      name: "Luxury Beach Resort",
      type: "Hotel",
      category: "Boutique Hotels",
      subcategory: "Design",
      orderDate: "06/15/2025",
      exeTime: "06/18/2025 ~ 06/23/2025",
      totalPrice: "$130",
      paid: "$0",
      status: "Pending",
    },
    {
      id: 2,
      image: "/img/testimonials/1/4.png",
      name: "City Walking Tour",
      type: "Activities",
      category: "Classes & Learning",
      subcategory: "Education Training",
      orderDate: "06/15/2025",
      exeTime: "06/18/2025 ~ 06/23/2025",
      totalPrice: "$200",
      paid: "$0",
      status: "Confirmed",
    },
    {
      id: 3,
      image: "/img/testimonials/1/4.png",
      name: "Wine Tasting Experience",
      type: "Events",
      category: "Festivals",
      subcategory: "Film",
      orderDate: "06/15/2025",
      exeTime: "06/18/2025 ~ 06/23/2025",
      totalPrice: "$200",
      paid: "$0",
      status: "Cancelled",
    },
    {
      id: 4,
      image: "/img/testimonials/1/4.png",
      name: "Mountain Cabin Retreat",
      type: "Hotel",
      category: "Business Hotels",
      subcategory: "Executive Suites",
      orderDate: "06/15/2025",
      exeTime: "06/18/2025 ~ 06/23/2025",
      totalPrice: "$130",
      paid: "$50",
      status: "Pending",
    },
  ];

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12 text-14">
        <thead className="text-nowrap">
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
          {data.map((row, index) => (
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
              <td className="align-middle">{row.totalPrice}</td>
              <td className="align-middle">{row.paid}</td>
              <td className="align-middle">
                <span
                  className={`rounded-100 py-4 px-10 text-center text-14 fw-500 ${
                    {
                      Pending: "bg-yellow-4 text-yellow-3",
                      // Approved: "bg-green-4 text-green-3",
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
