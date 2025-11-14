"use client";

import { useState } from "react";
import VendorDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { Menu, MenuItem } from "@mui/material";

const index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const router = useRouter();

  const data = [
    {
      id: 1,
      image: "/img/testimonials/1/4.png",
      name: "Hotel Executive Suite",
      property: "Hotel",
      maxAdults: 2,
      maxChildren: 1,
      maxOccupancy: 3,
      rooms: "3 rooms",
      status: "Active",
    },
    {
      id: 2,
      image: "/img/testimonials/1/4.png",
      name: "Deluxe Room",
      property: "House",
      maxAdults: 2,
      maxChildren: 2,
      maxOccupancy: 4,
      rooms: "5 rooms",
      status: "Active",
    },
    {
      id: 3,
      image: "/img/testimonials/1/4.png",
      name: "Standard Room",
      property: "Accommodation",
      maxAdults: 2,
      maxChildren: 0,
      maxOccupancy: 2,
      rooms: "8 rooms",
      status: "Inactive",
    },
  ];

  const tabs = [
    { label: "All Room Types", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const [listings, setListings] = useState(data);

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-md-auto">
          <h1 className="text-30 lh-14 fw-600">Room Type</h1>
          <div className="text-15 text-light-1">
            Manage your room types and details.
          </div>
        </div>
        <div className="col-md-auto d-flex justify-content-end">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/room-type/add?subtype=Hotel")}
          >
            <i className="icon-plus mr-10"></i> Add New Room Type
          </button>
        </div>
      </div>

      <div className="row px-10 mb-20">
        {tabs.map((item) => (
          <div className="col-auto px-5" key={item.value}>
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                activeTab === item.value ? "bg-white" : "text-light-1"
              }`}
              onClick={() => {
                setActiveTab(item.value);
                
                switch (item.value) {
                  case "active":
                    setListings(data.filter((item) => item.status == "Active"));
                    break;
                  case "inactive":
                    setListings(
                      data.filter((item) => item.status == "Inactive")
                    );
                    break;
                  default:
                    setListings(data);
                    break;
                }
              }}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-8 border-light px-15 py-15">
        <div className="row y-gap-10 x-gap-10 items-center mb-5">
          <div className="col-sm-auto d-flex">
            <div className="position-relative d-flex items-center w-180 sm:w-full">
              <input
                type="text"
                placeholder="Search listings..."
                className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              />
              <i
                className="icon-search text-light-1 position-absolute"
                style={{
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              ></i>
            </div>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">Property Type</option>
            </select>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">Category</option>
            </select>
          </div>
          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">Sub Category</option>
            </select>
          </div>
          <div className="col-sm-auto ms-auto">
            <button className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full">
              Export Room Types
            </button>
          </div>
        </div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-2 col-12">
            <thead>
              <tr className="text-light-1 fw-600">
                <th>Image</th>
                <th>Room Type</th>
                <th>Property Type</th>
                <th>Max Adults</th>
                <th>Max Children</th>
                <th>Max Occupancy</th>
                <th>Rooms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((row, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    <img
                      className="rounded-8"
                      src={row.image}
                      alt={row.name}
                      style={{
                        height: "50px",
                        width: "60px",
                        objectFit: "fill",
                      }}
                    />
                  </td>
                  <td className="align-middle fw-500">{row.name}</td>
                  <td className="align-middle">{row.property}</td>
                  <td className="align-middle">{row.maxAdults}</td>
                  <td className="align-middle">{row.maxChildren}</td>
                  <td className="align-middle">{row.maxOccupancy}</td>
                  <td className="align-middle">{row.rooms}</td>
                  <td className="align-middle">
                    <span
                      className={`rounded-100 px-10 text-center text-14 ${
                        row.status === "Active"
                          ? "bg-dark-4 text-white"
                          : "border-light"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="align-middle">
                    <span
                      id={row.id}
                      className="material-symbols-outlined cursor-pointer"
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                      more_horiz
                    </span>
                    <Menu
                      id="more-menu"
                      anchorEl={anchorEl}
                      open={showMoreMenu}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => {
                          router.push("/vendor/room-type/add");
                        }}
                        className="text-12"
                      >
                        Manage Room Type
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};
export default index;
