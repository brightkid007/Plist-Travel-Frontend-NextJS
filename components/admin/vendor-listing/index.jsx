"use client";

import AdminDashboardLayout from "../common/layout";
import { BookOpen, MoreVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import { getAdminListings, setListingStatus } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/usePermissions";
import ListingDetailModal from "@/components/vendor/common/ListingDetailModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
const index = () => {
  const { hasPermission } = usePermissions();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAnchor, setMenuAnchor] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [listingToReject, setListingToReject] = useState(null);
  const [rejecting, setRejecting] = useState(false);

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


  const filteredListings = useMemo(() => {
    let filtered = listings || [];
    
    // Filter by listing type
    if (typeFilter !== "all") {
      filtered = filtered.filter((item) =>
        (item?.type || item?.listing_type || "").toLowerCase() === typeFilter
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const name = (item?.title || item?.name || "").toLowerCase();
        const type = (item?.type || item?.listing_type || "").toLowerCase();
        const location = [
          item?.location_address?.line1,
          item?.location_address?.city,
          item?.location_address?.state,
          item?.location_address?.country,
          item?.location,
          item?.city,
          item?.address
        ].filter(Boolean).join(" ").toLowerCase();
        const vendor = (item?.vendor?.vendor_profile?.business_name || item?.vendor?.email || item?.vendor_id || "").toLowerCase();
        const status = (item?.status || "").toLowerCase();
        
        return (
          name.includes(search) ||
          type.includes(search) ||
          location.includes(search) ||
          vendor.includes(search) ||
          status.includes(search) ||
          String(item?.id).includes(search)
        );
      });
    }
    
    return filtered;
  }, [listings, typeFilter, searchTerm]);

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
      setMenuAnchor({ [id]: null });
    } catch (e) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  const handleMenuOpen = (event, listingId) => {
    setMenuAnchor({ [listingId]: event.currentTarget });
  };

  const handleMenuClose = (listingId) => {
    setMenuAnchor({ [listingId]: null });
  };

  const handleViewDetails = (listingId) => {
    setSelectedListingId(listingId);
    setDetailModalOpen(true);
    handleMenuClose(listingId);
  };

  const handleRejectClick = (listing) => {
    setListingToReject(listing);
    setRejectModalOpen(true);
    handleMenuClose(listing.id);
  };

  const handleRejectConfirm = async () => {
    if (!listingToReject) return;
    
    try {
      setRejecting(true);
      await onChangeStatus(listingToReject.id, "rejected");
      setRejectModalOpen(false);
      setListingToReject(null);
    } catch (error) {
      // Error is already handled in onChangeStatus
    } finally {
      setRejecting(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectModalOpen(false);
    setListingToReject(null);
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
      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div className="d-flex items-center gap-3">
            <select 
              className="form-select border-light h-45 px-15 w-140" 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="property">Property</option>
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="activity">Activity</option>
            </select>
            <select 
              className="form-select border-light h-45 px-15 w-140" 
              value={statusFilter || ""} 
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search listings..."
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
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 text-14 col-12">
              <thead className="text-nowrap">
                <tr>
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
                    <td colSpan={7} className="text-center py-20">
                      <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                        <CircularProgress size={24} />
                        <span>Loading listings...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                        <BookOpen size={32} className="text-light-1 mb-5" />
                        <span>No listings found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredListings.map((entry, index) => (
                    <tr key={entry?.id || index}>
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
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, entry?.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <Menu
                            anchorEl={menuAnchor[entry?.id]}
                            open={Boolean(menuAnchor[entry?.id])}
                            onClose={() => handleMenuClose(entry?.id)}
                          >
                            <MenuItem
                              onClick={() => handleViewDetails(entry?.id)}
                              disabled={!hasPermission("vendor_listing_management", "view")}
                              className="text-14"
                            >
                              View Details
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (hasPermission("vendor_listing_management", "update")) {
                                  onChangeStatus(entry?.id, "draft");
                                }
                              }}
                              disabled={!hasPermission("vendor_listing_management", "update") || entry?.status === "draft"}
                              className="text-14"
                            >
                              Draft
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (hasPermission("vendor_listing_management", "update")) {
                                  onChangeStatus(entry?.id, "submitted");
                                }
                              }}
                              disabled={!hasPermission("vendor_listing_management", "update") || entry?.status === "submitted"}
                              className="text-14"
                            >
                              Submitted
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (hasPermission("vendor_listing_management", "update")) {
                                  onChangeStatus(entry?.id, "approved");
                                }
                              }}
                              disabled={!hasPermission("vendor_listing_management", "update") || entry?.status === "approved"}
                              className="text-14"
                            >
                              Approve
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (hasPermission("vendor_listing_management", "update")) {
                                  handleRejectClick(entry);
                                }
                              }}
                              disabled={!hasPermission("vendor_listing_management", "update") || entry?.status === "rejected"}
                              className="text-14"
                            >
                              Reject
                            </MenuItem>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ListingDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedListingId(null);
        }}
        listingId={selectedListingId}
      />

      <ConfirmationModal
        open={rejectModalOpen}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        title="Reject Listing"
        message={`Are you sure you want to reject the listing "${listingToReject?.title || listingToReject?.name || `#${listingToReject?.id}`}"? This action cannot be undone.`}
        itemName={listingToReject?.title || listingToReject?.name || `Listing #${listingToReject?.id}`}
        loading={rejecting}
        confirmLabel="Reject"
        confirmingLabel="Rejecting..."
      />
    </AdminDashboardLayout>
  );
};

export default index;