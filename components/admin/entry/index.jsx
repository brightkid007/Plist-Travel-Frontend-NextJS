"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, Ellipsis, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@mui/material";
import { Checkbox } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    setShowModal(false);
  };
  const entries = [
    {
      id: 1,
      name: "John Smith",
      listing_type: "Hotel",
      location: "New York, USA",
      vendor: "Apple",
      status: "Active",
      submitted_at: "2025-05-22T08:20:00Z"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      listing_type: "Vacation Rental",
      location: "Miami, USA",
      vendor: "Xiaomi",
      status: "Active",
      submitted_at: "2025-05-22T08:20:00Z"
    },
    {
      id: 3,
      name: "Michael Brown",
      listing_type: "Event Venue",
      location: "Los Angeles, USA",
      vendor: "NASDAQ",
      status: "Active",
      submitted_at: "2025-05-22T08:20:00Z"
    },
    {
      id: 4,
      name: "Emily Davis",
      listing_type: "Activity",
      location: "Chicago, USA",
      vendor: "NASDAQ",
      status: "Inactive",
      submitted_at: "2025-05-22T08:20:00Z"
    },
    {
      id: 5,
      name: "Robert Wilson",
      listing_type: "Tours",
      location: "Dallas, USA",
      vendor: "NASDAQ",
      status: "Active",
      submitted_at: "2025-05-22T08:20:00Z"
    }
  ];
  
  const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Hotel",
      value: "hotel",
    },
    {
      label: "Spaces",
      value: "spaces",
    },
    {
      label: "Vacation Rental",
      value: "vacation_rental",
    },
    {
      label: "Event Venue",
      value: "event_venue",
    },
    {
      label: "Tours",
      value: "tours",
    },
    {
      label: "Event",
      value: "event",
    },
    {
      label: "Activity",
      value: "activity",
    },
  ];
  

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Monitor and Approve Manual Entries</h1>
          {/* <div className="text-14 lh-14 text-light-1">
            Manage all users across the platform
          </div> */}
        </div>
      </div>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                    activeTab === item.value ? "bg-white" : "text-light-1"
                  }`}
                  onClick={() => {
                    setActiveTab(item.value);
                  }}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div>
            <h1 className="text-24 lh-14 fw-500"> Manual Entries</h1>
            <div className="text-14 lh-14 text-light-1">
              Review and approve manually entered listing from vendors
            </div>
          </div>
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search entries..."
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Listing Type</th>
                  <th>Location</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .filter((item) => {
                    const tabMatch = activeTab === "all"
                      ? true
                      : item.listing_type.toLowerCase() === activeTab;
                    if (!tabMatch) return false;
                    if (!searchTerm) return true;
                    const search = searchTerm.toLowerCase();
                    return (
                      item.name?.toLowerCase().includes(search) ||
                      item.listing_type?.toLowerCase().includes(search) ||
                      item.location?.toLowerCase().includes(search) ||
                      item.vendor?.toLowerCase().includes(search) ||
                      String(item.id).includes(search)
                    );
                  })
                  .map((entry, index) => (
                    <tr key={index}>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {entry.id}
                      </td>
                      <td className="align-middle">
                        {entry.name}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">  
                        {entry.listing_type}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12">
                          <MapPin size={14} /> {entry.location}
                        </div>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">  
                        {entry.vendor}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${
                            entry.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {new Date(entry.submitted_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="align-middle">
                        <Ellipsis size={16} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
