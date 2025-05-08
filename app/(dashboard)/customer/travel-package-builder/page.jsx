"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Header1 from "@/components/header/header-1";
import DefaultFooter from "@/components/footer/default";
import { SelectService } from "./select-service";
import { ServiceDetail } from "./service-detail";
import { PackageSummary } from "./package-summary";

// export const metadata = {
//   title: "Plist || Travel Platform",
//   description: "Plist - Travel Package Builder",
// };

const TravelPackageBuilder = () => {
  const [activeTab, setActiveTab] = useState(2);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const tabItems = [
    { label: "Select Services", content: <SelectService /> },
    { label: "Service Detail", content: <ServiceDetail /> },
    { label: "Package Summary", content: <PackageSummary /> },
  ];
  return (
    <>
      <Header1 />
      <div className="py-40"></div>
      <div className="dashboard">
        <div className="dashboard__content bg-light-2 pb-30">
          <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
            <div className="col-12">
              <h1 className="text-30 lh-14 fw-600">Travel Package Builder</h1>
              <div className="text-15 text-light-1">
                Design personalized travel packages.
              </div>
            </div>
          </div>
          <div className="tabs -underline-2 js-tabs">
            <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
              {tabItems.map((item, index) => (
                <div className="col-auto" key={index}>
                  <button
                    className={`tabs__button text-14 lg:text-14 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                      activeTab === index ? "is-tab-el-active" : ""
                    }`}
                    onClick={() => handleTabClick(index)}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>

            <div className="tabs__content pt-30 js-tabs-content">
              <div className="tabs__pane -tab-item-1 is-tab-el-active">{
                tabItems.map((item, index) => (activeTab === index ? item.content : null))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DefaultFooter />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(TravelPackageBuilder), {
  ssr: false,
});
