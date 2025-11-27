"use client";

import AgentDashboardLayout from "../common/layout";
import { Drawer } from "@mui/material";
import Filter from "@/components/agent/common/Filter";
import { useState } from "react";
import { useRouter } from "next/navigation";

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const handleClose = () => {
    setOpenFilter(false);
  };
  const router = useRouter();
  const links = [
    {
      name: "London Hotels Package",
      type: "Hotel",
      clicks: 145,
      conversions: 12,
      earnings: 360.0,
      status: "Active",
    },
    {
      name: "NYC Weekend Getaway",
      type: "Package",
      clicks: 87,
      conversions: 5,
      earnings: 175.5,
      status: "Active",
    },
    {
      name: "Paris Flights Promo",
      type: "Flight",
      clicks: 210,
      conversions: 18,
      earnings: 540.0,
      status: "Expired",
    },
    {
      name: "Barcelona Tour Special",
      type: "Tour",
      clicks: 122,
      conversions: 8,
      earnings: 280.0,
      status: "Expired",
    },
  ];

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Sales Links</h1>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8"
            onClick={() => setOpenFilter(true)}
          >
            Filter
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-300 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <Filter />
              <div className="col-12 d-flex justify-end gap-2">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Save
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => router.push("/agent/sales-links/add")}
          >
            Generate
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">Sales Links</h1>
        <div className="text-14 lh-14 text-light-1">
          View and manage your sales links
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="bg-light-2 text-nowrap">
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Clicks</th>
                  <th>Earnings</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, index) => (
                  <tr key={index}>
                    <td className="align-middle">
                      <div className="text-14 lh-16 fw-500">{link.name}</div>
                      <div className="text-12 lh-16 fw-500 text-light-1">
                        https://plistravels.com/r/london-hot…
                      </div>
                    </td>
                    <td className="align-middle">
                      <span className="border-light text-center px-10 rounded-100 text-12 fw-500 mr-20">
                        {link.type}
                      </span>
                    </td>
                    <td className="align-middle">
                      <div className="text-12 lh-16 fw-500">{link.clicks}</div>
                      <div className="text-12 lh-16 fw-500 text-light-1">
                        {link.conversions} conversions
                      </div>
                    </td>
                    <td className="lh-16 align-middle">${link.earnings}</td>
                    <td className="align-middle">
                      {link.status == "Active" ? (
                        <span className="rounded-100 px-10 text-center text-12 fw-500 bg-green-1 text-green-2">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-100 px-10 text-center text-12 fw-500 bg-light-2 text-dark-1">
                          Expired
                        </span>
                      )}
                    </td>
                    <td className="fw-500 align-middle">
                      <div className="d-flex">
                        <div className="px-5 py-5">
                          <img src="/img/dashboard/icons/paste.svg" />
                        </div>
                        <div className="px-5 py-5">
                          <img src="/img/dashboard/icons/link.svg" />
                        </div>
                        <div className="px-5 py-5">
                          <img src="/img/dashboard/icons/delete.svg" />
                        </div>
                      </div>
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
