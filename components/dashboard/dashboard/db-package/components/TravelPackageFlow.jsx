"use client";

import { useState } from "react";

import { PackageSummary } from "./PackageSummary";
import SelectService from "./SelectService";
import { ServiceDetail } from "./ServiceDetail";

const TravelPackageFlow = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [data, setData] = useState([
    {
      name: "Flights",
      image: "/img/dashboard/services/flight_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Properties",
      image: "/img/dashboard/services/property_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Rides",
      image: "/img/dashboard/services/ride_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Tours",
      image: "/img/dashboard/services/tour_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
    {
      name: "Attractions/Events",
      image: "/img/dashboard/services/attr_events_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
      selected: false,
    },
  ]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const tabItems = [
    {
      label: "Select Services",
      content: (
        <SelectService
          data={data}
          setData={setData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ),
    },
    {
      label: "Service Detail",
      content: (
        <ServiceDetail
          selectedItems={data.filter((item) => item.selected)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ),
    },
    {
      label: "Package Summary",
      content: (
        <PackageSummary selectedItems={data.filter((item) => item.selected)} />
      ),
    },
  ];
  return (
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
        <div className="tabs__pane -tab-item-1 is-tab-el-active">
          {tabItems.map((item, index) =>
            activeTab === index ? item.content : null
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPackageFlow;
