'use client';

import { useState } from "react";
import Header from "@/components/header/dashboard-header";
import Sidebar from "@/components/dashboard/vendor-dashboard/common/Sidebar";
import Footer from "../common/Footer";
import BasicInfo from "./BasicInfo";
import LegalCompliance from "./LegalCompliance";
import TechnicalSupport from "./TechnicalSupport";
import Financial from "./Financial";
import Services from "./Services";
import Integration from "./Integration";

const index = () => {
//   const [activeTab, setActiveTab] = useState("basic-info");
  const [activeTab, setActiveTab] = useState("financial");
  const tabs = [
    { label: "Basic Info", value: "basic-info", content: <BasicInfo key={"basic-info"} /> },
    {
      label: "Legal & Compliance",
      value: "legal-compliance",
      content: <LegalCompliance key={"legal-compliance"} />,
    },
    { label: "Financial", value: "financial", content: <Financial key={"financial"} /> },
    { label: "Services", value: "services", content: <Services key={"services"} /> },
    {
      label: "Technical & Support",
      value: "technical-support",
      content: <TechnicalSupport key={"technical-support"} />,
    },
    { label: "Integration", value: "integration", content: <Integration key={"integration"} /> },
  ];

  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
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

            {tabs.map((item) => (item.value === activeTab && item.content))}

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default index;
