"use client";

import { useState } from "react";
import Availability from "./Availability";
import Pricing from "./Pricing";
import Settings from "./Settings";
import VenderDashboardLayout from "../common/layout";

const index = () => {
  const [activeTab, setActiveTab] = useState("availability");
  const tabs = [
    {
      label: "Availability",
      value: "availability",
      content: <Availability key={"availability"} />,
    },
    {
      label: "Pricing",
      value: "pricing",
      content: <Pricing key={"pricing"} />,
    },
    {
      label: "Settings",
      value: "settings",
      content: <Settings key={"settings"} />,
    },
  ];

  return (
    <VenderDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Operations Management</h1>
          <div className="text-15 text-light-1">
            Manage your availability, pricing, and operational settings.
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
    </VenderDashboardLayout>
  );
};
export default index;
