const RercentBooking = () => {
  const data = [
    {
      name: "John Smith",
      email: "john@example.com",
      status: "Confirmed",
      price: "$345.00",
      createdAt: "2 mins ago",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Pending",
      price: "$120.00",
      createdAt: "40 mins ago",
    },
    {
      name: "Michael Brown",
      email: "michael@example.com",
      status: "Confirmed",
      price: "$560.00",
      createdAt: "3 hours ago",
    },
    {
      name: "Emily Davis",
      email: "emily@example.com",
      status: "Confirmed",
      price: "$85.00",
      createdAt: "5 hours ago",
    },
  ];

  return (
    <div className="overflow-scroll scroll-bar-1 pt-30">
      {data.map((row, index) => (
        <div key={index} className="d-flex items-center justify-between mb-20">
          <div className="d-flex items-center">
            <span className="material-symbols-outlined text-light-1 px-5">
              person
            </span>
            <div className="ml-10 d-flex flex-column items-start">
              <div className="text-16 fw-500 lh-14">{row.name}</div>
              <div className="text-light-1 lh-14">{row.email}</div>
            </div>
          </div>
          <div className="d-flex items-center">
            <div>
              <div
                className={`rounded-100 px-20 text-center col-12 text-14 fw-500 ${
                  row.status == "Pending"
                    ? "bg-white border-light text-dark"
                    : "bg-dark-4 text-white"
                }`}
              >
                {row.status}
              </div>
            </div>
            <div className="ml-20 d-flex flex-column items-end">
              <div className="text-16 fw-500 lh-14">{row.price}</div>
              <div className="text-light-1 lh-14">{row.createdAt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RercentBooking;
