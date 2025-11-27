const RecentBooking = ({ detail = false }) => {
  const data = [
    {
      service: "Hotel Name",
      total: "$600",
      paid: "$600",
      status: "Paid",
      created_at: "16/04/25",
    },
    {
      service: "Hotel Name",
      total: "$600",
      paid: "$600",
      status: "Unpaid",
      created_at: "16/04/25",
    },
    {
      service: "Hotel Name",
      total: "$600",
      paid: "$600",
      status: "Paid",
      created_at: "16/04/25",
    },
    {
      service: "Hotel Name",
      total: "$600",
      paid: "$600",
      status: "Process",
      created_at: "16/04/25",
    },
  ];

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
      <table className="table-2 col-12 text-14">
        <thead className="text-nowrap">
          <tr className="text-light-1 fw-600">
            <th>#</th>
            <th>Service</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle fw-600">{row.service}</td>
              <td className="align-middle fw-500">{row.total}</td>
              <td className="align-middle fw-500">{row.paid}</td>
              <td className="align-middle fw-500">
                <span
                  className={`rounded-100 px-10 text-center text-12 ${statusColor(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="align-middle">
                {row.created_at}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBooking;
