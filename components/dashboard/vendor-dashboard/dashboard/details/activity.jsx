import DashboardCard from "../components/DashboardCard";
import ChartMain from "../components/ChartMain";
import RercentBooking from "../components/RercentBooking";
import PopularList from "../components/PopularList";
import Link from "next/link";

const Activity = () => {
  const data = [
    {
      title: "Conversion Rate",
      amount: "9.3%",
      improve: "+2.1% from last month",
      icon: "/img/dashboard/icons/1.svg",
      description: "Percentage of visitors who book",
    },
    {
      title: "Attendance Rate",
      amount: "91.2%",
      improve: "+2.8% from last month",
      icon: "/img/dashboard/icons/3.svg",
      description: "Percentage of booked spots attended",
    },
    {
      title: "Revenue/Activity",
      amount: "$420.00",
      improve: "+5.7% from last month",
      icon: "/img/dashboard/icons/2.svg",
      description: "Average revenue per activity",
    },
    {
      title: "Avg Rating",
      amount: "4.8/5",
      improve: "+0.3 from last month",
      icon: "/img/dashboard/icons/4.svg",
      description: "Average customer rating",
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

export default Activity;
