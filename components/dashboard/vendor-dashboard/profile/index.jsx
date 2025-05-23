"use client";

import { useState } from "react";
import BasicInfo from "./BasicInfo";
import LegalCompliance from "./LegalCompliance";
import TechnicalSupport from "./TechnicalSupport";
import Financial from "./Financial";
import Services from "./Services";
import Integration from "./Integration";
import VenderDashboardLayout from "../common/layout";

const index = () => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const tabs = [
    {
      label: "Basic Info",
      value: "basic-info",
      content: <BasicInfo key={"basic-info"} />,
    },
    {
      label: "Legal & Compliance",
      value: "legal-compliance",
      content: <LegalCompliance key={"legal-compliance"} />,
    },
    {
      label: "Financial",
      value: "financial",
      content: <Financial key={"financial"} />,
    },
    {
      label: "Services",
      value: "services",
      content: <Services key={"services"} />,
    },
    {
      label: "Technical & Support",
      value: "technical-support",
      content: <TechnicalSupport key={"technical-support"} />,
    },
    {
      label: "Integration",
      value: "integration",
      content: <Integration key={"integration"} />,
    },
  ];

  return (
    <VenderDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Profile Management</h1>
          <div className="text-15 text-light-1">
            Manage your vendor profile and business information.
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

      <div className="px-15">
        {tabs.map((item) => item.value === activeTab && item.content)}
      </div>
    </VenderDashboardLayout>
  );
};
export default index;
