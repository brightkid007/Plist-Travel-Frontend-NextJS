"use client";

import VendorDashboardLayout from "@/components/vendor/common/layout";
import { useRouter } from "next/navigation";

const index = ({ type }) => {
  const router = useRouter();
  const hourlySteps =
    type === "hourly"
      ? [
          {
            title: "Stay duration",
            description: "10 hours",
          },
          {
            title: "Earliest check-in time",
            description: "Earliest check-in time is 12:00",
          },
          {
            title: "Latest check-out time",
            description: "Latest check-out time is 22:00",
          },
        ]
      : [];

  const monthlySteps =
    type === "monthly"
      ? [
          {
            title: "Length of stay",
            description:
              "28 night(s) minimum stay and 30 night(s) maximum stay",
          },
        ]
      : [];

  const mealSteps =
    type !== "hourly"
      ? [
          {
            title: "Meals",
            description: "3 × Lunch + Dinner",
          },
        ]
      : [];

  const steps = [
    {
      title: "Rate plan name",
      description: type + " Rate Plan",
    },
    ...hourlySteps,
    ...monthlySteps,
    {
      title: "Cancellation policy",
      description: "Flexible-until 1 day before arrival",
    },
    ...mealSteps,
    {
      title: "Reservation Restrictions",
      items: [
        {
          type: "Booking restrictions",
          value: "2 day(s) and more",
        },
        {
          type: "Length of stay",
          value: "2 night(s) and more",
        },
        {
          type: "Exclusive selling resource",
          value:
            "Ticket booker exclusive (only for the guests who have booked transportation or other ticket services recently)",
        },
      ],
    },
    {
      title: "Payment method",
      description: "Prepay",
    },
    {
      title: "Rate, room status & restrictions",
      description:
        "Rate is 5% higher than breakfast-excluded-Flexible until 1 day before arrival(piepay). Synchronize with the room status and restrictions of breakfast-excluded-Flexible until 1 day before arrival(piepay)",
    },
    {
      title: "Room types",
      description: "Luxurious & Spacious & Bed Duplex Getaway in Denton, TX",
    },
  ];

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-10 justify-between items-end mb-10">
        <h1 className="text-30 lh-14 fw-600">Preview {type} rate plan</h1>
      </div>

      <div className="bg-white rounded-8 py-5 px-20">
        {steps.map((step, index) => (
          <div
            key={index}
            className={
              "row items-start y-gap-10 py-10 " +
              (index !== 0 ? "border-top-light" : "")
            }
          >
            <div className="text-14 fw-500 lh-14 col-md-3 col-sm-4">
              {step.title}
            </div>
            <div className="col-md-9 col-sm-8 d-flex justify-between items-start mt-auto mb-auto">
              {step.description ? (
                <div className="text-12 lh-14">{step.description}</div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {step.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="text-12 lh-14 fw-500">{item.type}</div>
                      <div className="text-12 lh-14">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-12 lh-14 text-blue-1 cursor-pointer">
                Edit
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-15 d-flex justify-end gap-2">
        <button
          className="bg-white border-light rounded-8 px-15 py-5 text-14 fw-500"
          onClick={() => router.push("/vendor/rateplan/add/" + type)}
        >
          Back
        </button>
        <button
          className="text-white bg-blue-1 rounded-8 px-15 py-5 text-14"
          onClick={() => {
            router.push("/vendor/rateplan");
          }}
        >
          Activate the rate plan
        </button>
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
