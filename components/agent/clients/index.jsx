"use client";

import AgentDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, Ellipsis, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";

const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const clients = [
    {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      company_name: "Apple",
      location: "New York, USA",
      bookings: 8,
      total_spent: "$12,450",
      status: "Active",
    },
    {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
      company_name: "Xiaomi",
      location: "Miami, USA",
      bookings: 5,
      total_spent: "$8,320",
      status: "Active",
    },
    {
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 (859) 456-7890",
      company_name: "NASDAQ",
      location: "Los Angeles, USA",
      bookings: 3,
      total_spent: "$5,670",
      status: "Active",
    },
    {
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+1 (666) 234-6678",
      company_name: "NASDAQ",
      location: "Chicago, USA",
      bookings: 2,
      total_spent: "$3,450",
      status: "Inactive",
    },
    {
      name: "Robert Wilson",
      email: "robert.w@example.com",
      phone: "+1 (658) 876-5432",
      company_name: "NASDAQ",
      location: "Dallas, USA",
      bookings: 6,
      total_spent: "$9,870",
      status: "Active",
    },
  ];
  const tabs = [
    {
      label: "All Clients",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Client Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Manage your client information for faster bookings
          </div>
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

        <div className="col-auto ms-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => router.push("/agent/clients/add")}
          >
            <Plus size={20} /> Add Client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">Client List</h1>
        <div className="text-14 lh-14 text-light-1">
          View and manage your client database
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="bg-light-2 text-nowrap">
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Bookings</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clients
                  .filter((item) => {
                    return activeTab === "all"
                      ? true
                      : item.status.toLowerCase() === activeTab;
                  })
                  .map((client, index) => (
                    <tr key={index}>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-2">
                          <div className="size-30 rounded-full text-light-1 bg-light-2 flex-center fw-500">
                            JS
                          </div>
                          <div className="text-14 lh-16 fw-500">
                            {client.name}
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-light-1 text-12">
                          <Mail size={14} /> {client.email}
                        </div>
                        <div className="d-flex items-center gap-1 text-light-1 text-12 mt-5">
                          <Phone size={14} /> {client.phone}
                        </div>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {client.company_name}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12">
                          <MapPin size={14} /> {client.location}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          <BookOpen size={14} className="text-light-1" />{" "}
                          {client.bookings}
                        </div>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {client.total_spent}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 px-10 text-center text-12 fw-500 ${
                            client.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                          }`}
                        >
                          {client.status}
                        </span>
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
    </AgentDashboardLayout>
  );
};

export default index;
