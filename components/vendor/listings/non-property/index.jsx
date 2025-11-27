"use client";

import { useState, useEffect } from "react";
import VendorDashboardLayout from "../../common/layout";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { getMyListings, deleteListing, updateListing, getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ListingDetailModal from "../../common/ListingDetailModal";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";

const index = ({ isProperty = false }) => {
  const { hasPermission } = useVendorPermissions();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [listingToSubmit, setListingToSubmit] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedListingIdForDetail, setSelectedListingIdForDetail] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    category_id: "all",
    subcategory_id: "all",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const loadCategories = async () => {
    try {
      // Load categories for tour, event, and activity types
      const [tourRes, eventRes, activityRes, subcatRes] = await Promise.all([
        getListingCategories({ type: "tour" }),
        getListingCategories({ type: "event" }),
        getListingCategories({ type: "activity" }),
        getListingSubcategories(),
      ]);
      
      // Combine all non-property categories
      const allCategories = [
        ...(tourRes?.data || tourRes || []),
        ...(eventRes?.data || eventRes || []),
        ...(activityRes?.data || activityRes || []),
      ];
      
      // Remove duplicates based on ID
      const uniqueCategories = allCategories.filter((cat, index, self) =>
        index === self.findIndex((c) => c.id === cat.id)
      );
      
      setCategories(uniqueCategories);
      setSubcategories(subcatRes?.data || subcatRes || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Load categories and subcategories (filter for non-property types)
  useEffect(() => {
    loadCategories();
  }, []);

  // Filter subcategories based on selected category
  useEffect(() => {
    if (filters.category_id && filters.category_id !== "all") {
      const filtered = subcategories.filter(
        (sub) => sub.listing_category_id === parseInt(filters.category_id, 10)
      );
      setFilteredSubcategories(filtered);
      // Reset subcategory if it's not in the filtered list
      if (filters.subcategory_id !== "all") {
        const subcatExists = filtered.some(
          (sub) => sub.id === parseInt(filters.subcategory_id, 10)
        );
        if (!subcatExists) {
          setFilters((prev) => ({ ...prev, subcategory_id: "all" }));
        }
      }
    } else {
      setFilteredSubcategories([]);
      setFilters((prev) => ({ ...prev, subcategory_id: "all" }));
    }
  }, [filters.category_id, subcategories]);

  // Load listings on mount and when filters change (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadListings();
    }, filters.search ? 500 : 0);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.type, filters.category_id, filters.subcategory_id, filters.search]);

  const loadListings = async () => {
    try {
      setLoading(true);
      // Build filters object, removing "all" values
      const filterParams = {};
      
      if (filters.search && filters.search.trim()) {
        filterParams.search = filters.search.trim();
      }
      if (filters.status && filters.status !== "all") {
        filterParams.status = filters.status;
      }
      if (filters.type && filters.type !== "all") {
        filterParams.type = filters.type;
      }
      if (filters.category_id && filters.category_id !== "all") {
        filterParams.category_id = filters.category_id;
      }
      if (filters.subcategory_id && filters.subcategory_id !== "all") {
        filterParams.subcategory_id = filters.subcategory_id;
      }

      const response = await getMyListings(filterParams);
      let listingsData = response?.data || response || [];
      
      // Filter out property type listings on frontend if no specific type is selected
      // (to show only non-property listings by default)
      if (!filterParams.type) {
        listingsData = listingsData.filter(
          (listing) => listing.type !== "property"
        );
      }
      
      setListings(Array.isArray(listingsData) ? listingsData : []);
    } catch (error) {
      console.error("Error loading listings:", error);
      if (error?.response?.status === 404 || error?.status === 404) {
        setListings([]);
      } else {
        toast.error(error?.message || "Failed to load listings");
        setListings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteClick = (listingId) => {
    const listing = listings.find((l) => l.id === listingId);
    setListingToDelete(listing);
    setDeleteModalOpen(true);
    setAnchorEl(null);
    setSelectedListingId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;

    try {
      setDeleting(true);
      await deleteListing(listingToDelete.id);
      toast.success("Listing deleted successfully");
      loadListings();
      setDeleteModalOpen(false);
      setListingToDelete(null);
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error(error?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (listingId) => {
    if (!listingId) return;

    try {
      setSubmitting(true);
      const listing = listings.find((l) => l.id === listingId);
      setListingToSubmit(listing);
      setAnchorEl(null);
      setSelectedListingId(null);
      
      await updateListing(listingId, { status: "submitted" });
      toast.success("Listing submitted successfully");
      loadListings();
      setListingToSubmit(null);
    } catch (error) {
      console.error("Error submitting listing:", error);
      toast.error(error?.message || "Failed to submit listing");
      setListingToSubmit(null);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: "Draft", className: "bg-light-2 text-dark-1" },
      submitted: { label: "Submitted", className: "bg-blue-1 text-white" },
      approved: { label: "Active", className: "bg-dark-4 text-white" },
      rejected: { label: "Rejected", className: "bg-red-1 text-white" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-light-2 text-dark-1" };
    return (
      <span className={`rounded-100 px-10 text-center text-14 ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      property: "Property",
      tour: "Tour",
      event: "Event",
      activity: "Activity",
      flight: "Flight",
      ride: "Ride",
    };
    return typeMap[type] || type;
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-md-auto">
          <h1 className="text-30 lh-14 fw-600">
            Non-Property Listings Management
          </h1>
          <div className="text-15 text-light-1">
            Manage your non-property and service listings.
          </div>
        </div>
        <div className="col-md-auto d-flex justify-content-end">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/listings/select/non-property")}
            disabled={!hasPermission("listings_management", "create")}
            style={{ opacity: !hasPermission("listings_management", "create") ? 0.5 : 1, cursor: !hasPermission("listings_management", "create") ? "not-allowed" : "pointer" }}
          >
            <i className="icon-plus mr-10"></i> Add New{" "}
            {isProperty ? "Property" : "Listing"}
          </button>
        </div>
      </div>

      <div className="row y-gap-10 x-gap-10 items-center mb-5">
        <div className="col-sm-auto d-flex">
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search listings..."
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
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
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Active</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="col-sm-auto">
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="tour">Tour</option>
            <option value="event">Event</option>
            <option value="activity">Activity</option>
            <option value="flight">Flight</option>
            <option value="ride">Ride</option>
          </select>
        </div>

        <div className="col-sm-auto">
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.category_id}
            onChange={(e) => {
              handleFilterChange("category_id", e.target.value);
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-auto">
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.subcategory_id}
            onChange={(e) => handleFilterChange("subcategory_id", e.target.value)}
            disabled={!filters.category_id || filters.category_id === "all"}
          >
            <option value="all">All Subcategories</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-auto ms-auto">
          <button
            className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full"
            onClick={() => {
              setFilters({
                search: "",
                status: "all",
                type: "all",
                category_id: "all",
                subcategory_id: "all",
              });
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-15 py-5">
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-2 col-12 text-14">
            <thead className="text-nowrap">
              <tr className="text-light-1 fw-600">
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <div className="d-flex justify-center items-center">
                      <CircularProgress />
                      <span className="ml-10 text-14">Loading listings...</span>
                    </div>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <div className="d-flex flex-column items-center justify-center">
                      <span className="material-symbols-outlined text-48 text-light-1 mb-10">
                        tour
                      </span>
                      <div className="text-16 text-light-1">No listings found</div>
                      <div className="text-14 text-light-1 mt-5">
                        Click "Add New Listing" to create your first listing
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="align-middle">{listing.title}</td>
                    <td className="align-middle">{getTypeLabel(listing.type)}</td>
                    <td className="align-middle">
                      {listing.category?.name || "-"}
                    </td>
                    <td className="align-middle">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="align-middle text-14">
                      {listing.createdAt
                        ? new Date(listing.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="align-middle">
                      <span
                        className="material-symbols-outlined cursor-pointer"
                        onClick={(event) => {
                          setAnchorEl(event.currentTarget);
                          setSelectedListingId(listing.id);
                        }}
                      >
                        more_horiz
                      </span>
                      <Menu
                        id="more-menu"
                        anchorEl={anchorEl}
                        open={showMoreMenu && selectedListingId === listing.id}
                        onClose={() => {
                          setAnchorEl(null);
                          setSelectedListingId(null);
                        }}
                      >
                        {listing.status === "draft" && (
                          <MenuItem
                            onClick={() => {
                              if (hasPermission("listings_management", "update")) {
                                handleSubmit(listing.id);
                              }
                            }}
                            className="text-12"
                            disabled={!hasPermission("listings_management", "update") || (submitting && listingToSubmit?.id === listing.id)}
                          >
                            {submitting && listingToSubmit?.id === listing.id ? "Submitting..." : "Submit"}
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("listings_management", "view")) {
                              setSelectedListingIdForDetail(listing.id);
                              setDetailModalOpen(true);
                              setAnchorEl(null);
                              setSelectedListingId(null);
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("listings_management", "view")}
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("listings_management", "update")) {
                              router.push(`/vendor/property/${listing.id}/edit?type=${listing.type}`);
                              setAnchorEl(null);
                              setSelectedListingId(null);
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("listings_management", "update")}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("listings_management", "delete")) {
                              handleDeleteClick(listing.id);
                            }
                          }}
                          className="text-12 text-red-1"
                          disabled={!hasPermission("listings_management", "delete")}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Listing"
        message={`Are you sure you want to delete the listing "${listingToDelete?.title || `#${listingToDelete?.id}`}"?`}
        itemName={listingToDelete?.title || `Listing #${listingToDelete?.id}`}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />

      <ListingDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedListingIdForDetail(null);
        }}
        listingId={selectedListingIdForDetail}
      />
    </VendorDashboardLayout>
  );
};
export default index;
