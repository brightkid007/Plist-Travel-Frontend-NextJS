import PointHistoryCard from "./PointHistoryCard";

const PointHistory = () => {
    const history = [
      {
        label: "Hotel Booking - The Montcalm London",
        points: +250,
        date: "May 15, 2023",
      },
      {
        label: "Flight Booking - New York to Paris",
        points: +350,
        date: "April 28, 2023",
      },
      {
        label: "Redeemed for Hotel Discount",
        points: -500,
        date: "April 10, 2023",
      },
      { label: "Car Rental - Barcelona", points: +150, date: "March 22, 2023" },
      { label: "Welcome Bonus", points: +100, date: "March 5, 2023" },
    ];
    return (
      <>
        <div className="text-20 lh-14 fw-600 mb-20">
          Points Transaction History
        </div>
        <div className="text-14 text-light-1 lh-14 fw-400 mb-20 px-0">
          See how you've earned and spent your loyalty points{" "}
        </div>
        {history.map((item, index) => (
          <PointHistoryCard
            key={index}
            date={item.date}
            label={item.label}
            points={item.points}
          />
        ))}
      </>
    );
};

export default PointHistory;