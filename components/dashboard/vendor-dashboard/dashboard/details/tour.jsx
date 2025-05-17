import DashboardCard from "../components/DashboardCard";
import ChartMain from "../components/ChartMain";
import RercentBooking from "../components/RercentBooking";
import PopularList from "../components/PopularList";
import Link from "next/link";

const Tour = () => {
  const data = [
    {
      title: "Conversion Rate",
      amount: "8.7%",
      improve: "+1.2% from last month",
      icon: "/img/dashboard/icons/1.svg",
      description: "Percentage of visitors who book",
    },
    {
      title: "Occupancy Rate",
      amount: "82.4%",
      improve: "+6.5% from last month",
      icon: "/img/dashboard/icons/3.svg",
      description: "Percentage of tour spots booked",
    },
    {
      title: "Revenue per Tour",
      amount: "$560.00",
      improve: "+4.8% from last month",
      icon: "/img/dashboard/icons/2.svg",
      description: "Average revenue per tour",
    },
    {
      title: "Cancellation Rate",
      amount: "4.2%",
      improve: "-1.5% from last month",
      icon: "/img/dashboard/icons/4.svg",
      description: "Percentage of tours canceled",
    },
  ];

  return (
    <>
      <DashboardCard data={data} />

      <div className="row y-gap-30 pt-20 chart_responsive">
        <div className="col-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <h2 className="text-18 lh-1 fw-500">Revenue & Bookings Overview</h2>
            <div className="text-12 text-light-1">
              Monthly revenue trend for the current year
            </div>

            <div className="pt-30">
              <ChartMain />
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3">
            <h2 className="text-18 lh-1 fw-500">Booking Sources</h2>
            <div className="text-12 text-light-1">
              Distribution of bookings by channel
            </div>

            <div className="pt-30">
              <ChartMain />
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3 h-100">
            <div className="d-flex justify-between items-center">
              <div>
                <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
                <div className="text-12 text-light-1">
                  Overview of your listings, bookings, and performance metrics.
                </div>
              </div>
              <div>
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div>
            </div>

            <RercentBooking />
          </div>
        </div>

        <div className="col-6">
          <div className="py-30 px-30 rounded-8 bg-white shadow-3 h-100">
            <div className="d-flex justify-between items-center">
              <div>
                <h2 className="text-18 lh-1 fw-500">Popular Listings</h2>
                <div className="text-12 text-light-1">
                  Your most booked listings this month
                </div>
              </div>
              <div>
                <Link href="#" className="text-14 text-blue-1 fw-500 underline">
                  View All
                </Link>
              </div>
            </div>

            <PopularList detail={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Tour;
