"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, Ellipsis, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@mui/material";
import { Checkbox } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { getAdminListings, approveListing, rejectListing, setListingStatus } from "@/helpers/backend_helper";
const index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = statusFilter ? await getAdminListings({ status: statusFilter }) : await getAdminListings();
      const data = res || {};
      const arr = Array.isArray(data) ? data : (data?.listings || data?.items || []);
      setListings(arr);
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // draft or unknown
    return "bg-light-2 text-dark-1";
  };

  const onApprove = async (id) => {
    try {
      await approveListing(id);
      await fetchListings();
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to approve listing");
    }
  };

  const onReject = async (id) => {
    try {
      await rejectListing(id, {});
      await fetchListings();
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to reject listing");
    }
  };

  const onChangeStatus = async (id, status) => {
    try {
      await setListingStatus(id, status);
      await fetchListings();
    } catch (e) {
      setError(typeof e === "string" ? e : "Failed to update status");
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
        <div className="d-flex items-center gap-3">
          <select className="form-select border-light h-45 px-15 w-140" value={statusFilter || ""} onChange={(e) => setStatusFilter(e.target.value || null)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
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
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-20">Loading...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="text-center py-20 text-red-1">{error}</td>
                  </tr>
                )}
                {!loading && !error && filteredListings.map((entry, index) => (
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
                          <MapPin size={14} /> {
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
                        >
                          <option value="draft">Draft</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
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
