"use client";

import { useState } from "react";
import VendorDashboardLayout from "../common/layout";
import Subscription from "./Subscription";
import PaymentHistory from "./PaymentHistory";
import BillingInfo from "./BillingInfo";

const index = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const tabs = [
    {
      label: "Subscription",
      value: "subscription",
      content: <Subscription key={"subscription"} />,
    },
    {
      label: "Payment History",
      value: "payment-history",
      content: <PaymentHistory key={"payment-history"} />,
    },
    // {
    //   label: "Billing Info",
    //   value: "billing-info",
    //   content: <BillingInfo key={"billing-info"} />,
    // },
  ];

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">
            Subscription & Payment Management
          </h1>
          <div className="text-15 text-light-1">
            Manage your subscription plan, view payment history, and update
            billing information.
          </div>
        </div>
      </div>

      <div className="row px-10 mb-20">
        {tabs.map((item) => (
          <div className="col-auto px-5" key={item.value}>
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                activeTab === item.value ? "bg-white" : "text-light-1"
              }`}
              onClick={() => setActiveTab(item.value)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {tabs.map((item) => item.value === activeTab && item.content)}
    </VendorDashboardLayout>
  );
};
export default index;
