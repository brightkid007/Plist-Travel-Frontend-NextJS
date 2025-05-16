const data = [
  {
    title: "Total Sales",
    amount: "$24,231.89",
    description: "+15.2% from last month",
    icon: "/img/dashboard/icons/1.svg",
  },
  {
    title: "Total Bookings",
    amount: "432",
    description: "+8.2% from last month",
    icon: "/img/dashboard/icons/3.svg",
  },
  {
    title: "Net Earnings",
    amount: "$18,565.00",
    description: "+12.5% from last month",
    icon: "/img/dashboard/icons/2.svg",
  },
  {
    title: "Active Listings",
    amount: "12",
    description: "+2 new listings this month",
    icon: "/img/dashboard/icons/4.svg",
  },
];

const DashboardCard = () => {
  return (
    <div className="row y-gap-30">
      {data.map((item, index) => (
        <div key={index} className="col-xl-3 col-md-6">
          <div className="py-30 px-30 rounded-4 bg-white shadow-3">
            <div className="row y-gap-20 justify-between items-start">
              <div className="col-auto">
                <div className="fw-500 lh-14">{item.title}</div>
                <div className="text-26 lh-16 fw-600 mt-5">{item.amount}</div>
                <div className="text-15 lh-14 text-light-1 mt-5">
                  {item.description}
                </div>
              </div>
              <div className="col-auto">
                <img src={item.icon} alt="icon" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
