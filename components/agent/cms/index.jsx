"use client";

import AgentDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Ellipsis,
  Eye,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import data from "./data";

const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("static");

  const tabs = [
    {
      label: "Static Pages",
      value: "static",
    },
    {
      label: "Banner Management",
      value: "banner",
    },
  ];
  const statusColors = (status) => {
    switch (status) {
      case "Published":
      case "Active":
        return "bg-green-4 text-green-2";
      case "Draft":
        return "bg-yellow-4 text-dark-yellow";
      case "Inactive":
        return "bg-red-4 text-red-1";
      default:
        return "bg-light-2 text-light-1";
    }
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Content Management System</h1>
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
            onClick={() => router.push("/agent/cms/add?service=" + activeTab)}
          >
            <Plus size={20} /> Add New{" "}
            {activeTab == "static" ? "Page" : "Banner"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">
          Manage {activeTab == "static" ? "Static Pages" : "Banners"}
        </h1>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="bg-light-2 text-nowrap">
                <tr>
                  <th>Title</th>
                  {activeTab != "static" && <th>Position</th>}
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data[activeTab].map((row, index) => (
                  <tr key={index}>
                    <td className="align-middle text-14 fw-500 lh-16">
                      {row.title}
                    </td>
                    {activeTab != "static" && (
                      <td className="align-middle text-14 fw-500 lh-16">
                        {row.position}
                      </td>
                    )}
                    <td className="align-middle">
                      <span
                        className={`rounded-100 px-10 text-center text-12 fw-500 ${statusColors(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="align-middle text-12 lh-16 fw-500">
                      {row.last_updated}
                    </td>
                    <td className="align-middle">
                      <button className="size-30 bg-white">
                        <Eye size={16} />
                      </button>
                      <button className="size-30 bg-white">
                        <Pencil size={16} />
                      </button>
                      <button className="size-30 bg-white">
                        <Trash2 size={16} />
                      </button>
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
