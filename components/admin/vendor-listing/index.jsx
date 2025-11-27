"use client";

import AdminDashboardLayout from "../common/layout";
import { BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircularProgress } from "@mui/material";
import { getAdminListings, setListingStatus } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/usePermissions";
const index = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = statusFilter ? await getAdminListings({ status: statusFilter }) : await getAdminListings();
      const data = res || {};
      const arr = Array.isArray(data) ? data : (data?.listings || data?.items || []);
      setListings(arr);
    } catch (e) {
      toast.error(e?.message || "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [statusFilter]);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Property", value: "property" },
    { label: "Tour", value: "tour" },
    { label: "Event", value: "event" },
    { label: "Activity", value: "activity" },
  ];

  const filteredListings = useMemo(() => {
    if (activeTab === "all") return listings;
    return (listings || []).filter((item) =>
      (item?.type || item?.listing_type || "").toLowerCase() === activeTab
    );
  }, [listings, activeTab]);

  const getStatusClasses = (status) => {
    const s = (status || "").toString().toLowerCase();
    if (s === "approved") return "bg-green-1 text-green-2";
    if (s === "rejected") return "bg-red-1 text-white";
    if (s === "submitted") return "bg-yellow-1 text-dark-1";
    return "bg-light-2 text-dark-1";
  };

  const onChangeStatus = async (id, status) => {
    if (!hasPermission("vendor_listing_management", "update")) {
      toast.error("You don't have permission to update listing status");
      return;
    }
    try {
      await setListingStatus(id, status);
      toast.success("Listing status updated successfully");
      await fetchListings();
    } catch (e) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Vendor Listing Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Review and manage listings from vendors across the platform
          </div>
        </div>
      </div>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
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
        <div className="d-flex items-center gap-3">
          <select className="form-select border-light h-45 px-15 w-140" value={statusFilter || ""} onChange={(e) => setStatusFilter(e.target.value || null)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 text-14 col-12">
              <thead className="text-nowrap">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Listing Type</th>
                  <th>Location</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                        <CircularProgress size={24} />
                        <span>Loading listings...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                        <BookOpen size={32} className="text-light-1 mb-5" />
                        <span>No listings found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((entry, index) => (
                    <tr key={entry?.id || index}>
                      <td className="align-middle">
                        <img
                          className="rounded-8"
                          src={entry?.thumbnail_url || entry?.image || "/img/testimonials/1/4.png"}
                          alt={entry?.title || entry?.name || "Listing"}
                          style={{
                            height: "50px",
                            width: "60px",
                            objectFit: "fill",
                          }}
                        />
                      </td>
                      <td className="align-middle">{entry?.title || entry?.name || "-"}</td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {(entry?.type || entry?.listing_type || "").toString()}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12">
                          {
                            entry?.location_address
                              ? [
                                entry.location_address.line1,
                                entry.location_address.city,
                                entry.location_address.state,
                                entry.location_address.country,
                              ].filter(Boolean).join(", ")
                              : (entry?.location || entry?.city || entry?.address || "-")
                          }
                        </div>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {entry?.vendor?.vendor_profile?.business_name || entry?.vendor?.email || entry?.vendor_id || "-"}
                      </td>
                      <td className="align-middle">
                        <span className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${getStatusClasses(entry?.status)}`}>
                          {(() => { const s = (entry?.status || "").toString(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-"; })()}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {entry?.createdAt || entry?.created_at ? new Date(entry?.createdAt || entry?.created_at).toLocaleString() : "-"}
                        </div>
                      </td>
                      <td className="align-middle">
                        <select
                          className="form-select border-light h-36 px-10 w-160"
                          value={(entry?.status || "").toString().toLowerCase()}
                          onChange={(e) => onChangeStatus(entry?.id, e.target.value)}
                          disabled={!hasPermission("vendor_listing_management", "update")}
                          style={{
                            opacity: !hasPermission("vendor_listing_management", "update") ? 0.5 : 1,
                            cursor: !hasPermission("vendor_listing_management", "update") ? "not-allowed" : "pointer"
                          }}
                        >
                          <option value="draft">Draft</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
