"use client";

import { useState, useMemo, useCallback } from "react";
import AdminDashboardLayout from "../common/layout";
import { Drawer } from "@mui/material";
import { Filter } from "lucide-react";
import { Add } from "@mui/icons-material";
import List from "./List";
import NotificationComposer from "./Add";
import DatePicker, { DateObject } from "react-multi-date-picker";

// Notification Filter Component
const NotificationFilter = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="d-flex flex-column y-gap-15">
      <div>
        <h3 className="text-14 fw-600 mb-10">Status</h3>
        <select
          className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
          value={filters.status || "all"}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      <div>
        <h3 className="text-14 fw-600 mb-10">Audience</h3>
        <select
          className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
          value={filters.audience || "all"}
          onChange={(e) => handleChange("audience", e.target.value)}
        >
          <option value="all">All Audiences</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="agent">Agents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div>
        <h3 className="text-14 fw-600 mb-10">Date Range</h3>
        <div className="d-flex flex-column y-gap-10">
          <div>
            <label className="text-12 text-light-1 mb-5 d-block">Start Date</label>
            <div className="border-light rounded-8 py-10 px-15 w-100">
              <DatePicker
                inputClass="custom_input-picker w-100"
                containerClassName="custom_container-picker"
                value={filters.startDate ? new DateObject(filters.startDate) : null}
                onChange={(date) => {
                  handleChange("startDate", date ? date.format("YYYY-MM-DD") : null);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="YYYY-MM-DD"
                placeholder="Select start date"
              />
            </div>
          </div>
          <div>
            <label className="text-12 text-light-1 mb-5 d-block">End Date</label>
            <div className="border-light rounded-8 py-10 px-15 w-100">
              <DatePicker
                inputClass="custom_input-picker w-100"
                containerClassName="custom_container-picker"
                value={filters.endDate ? new DateObject(filters.endDate) : null}
                onChange={(date) => {
                  handleChange("endDate", date ? date.format("YYYY-MM-DD") : null);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="YYYY-MM-DD"
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    status: "all",
    audience: "all",
    startDate: null,
    endDate: null,
  });

  const handleClose = () => {
    setOpenFilter(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      audience: "all",
      startDate: null,
      endDate: null,
    });
  };

  const handleApplyFilters = () => {
    setOpenFilter(false);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.status && filters.status !== "all") ||
      (filters.audience && filters.audience !== "all") ||
      filters.startDate ||
      filters.endDate
    );
  }, [filters]);

  const [activeTab, setActiveTab] = useState("list");

  const handleNotificationCreated = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("list");
  }, []);

  const tabs = useMemo(() => [
    { label: "List", value: "list", content: <List key={refreshKey} filters={filters} /> },
    { label: "Add", value: "add", content: <NotificationComposer key="composer" onSuccess={handleNotificationCreated} /> },
  ], [refreshKey, handleNotificationCreated, filters]);

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-20">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">
            Push Notifications & Announcements
          </h1>
          <div className="text-14 text-light-1 lh-14">
            Create and send notifications to users across the platform.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className={`button px-15 py-10 rounded-8 ${
              hasActiveFilters 
                ? "bg-blue-1 text-white" 
                : "border-light bg-white"
            }`}
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={18} className="mr-10" /> Filter
            {hasActiveFilters && (
              <span className="ml-5">
                ({Object.values(filters).filter(v => v !== "all" && v !== null).length})
              </span>
            )}
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-400 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <div className="overflow-y-auto flex-grow-1">
                <h2 className="text-20 fw-600 mb-20">Filter Notifications</h2>
                <NotificationFilter filters={filters} onFilterChange={handleFilterChange} />
              </div>
              <div className="col-12 d-flex justify-end gap-2 mt-20 pt-20 border-top-light">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button
            className="button bg-dark-blue text-white px-20 py-10 rounded-8"
            onClick={() => setActiveTab("add")}
          >
            <Add className="text-18 mr-10" /> Create New Notification
          </button>
        </div>
      </div>

      <div className="py-15 px-30 rounded-8 bg-white shadow-3 h-100">
        {tabs.find((item) => item.value === activeTab)?.content}
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
