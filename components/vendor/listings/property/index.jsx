"use client";

import { useState, useEffect, useRef } from "react";
import VendorDashboardLayout from "../../common/layout";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { getMyListings, deleteListing, updateListing, getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const index = ({ isProperty = true }) => {
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

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    category_id: "all",
    subcategory_id: "all",
  });
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const loadCategories = async () => {
    try {
      const filterParams = { type: 'property' };
      filterParams.subtype = filters.type;
      const catRes = await getListingCategories(filterParams);
      setCategories(catRes?.data || catRes || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };


  // Load categories based on selected type filter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category_id: "all",
      subcategory_id: "all"
    }));
    loadCategories();
  }, [filters.type]);

  const loadSubcategories = async () => {
    try {
      const filterParams = { type: 'property' };
      filterParams.subtype = filters.type;
      if (filters.category_id && filters.category_id !== "all") {
        // Load subcategories for the selected category
        filterParams.category_id = parseInt(filters.category_id, 10);
        const subcatRes = await getListingSubcategories(filterParams);
        const subcats = subcatRes?.data || subcatRes || [];
        setFilteredSubcategories(subcats);

        // Reset subcategory if it's not in the filtered list
        if (filters.subcategory_id !== "all") {
          const subcatExists = subcats.some(
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
    } catch (error) {
      console.error("Error loading subcategories:", error);
      setFilteredSubcategories([]);
    }
  };

  // Load and filter subcategories based on selected category
  useEffect(() => {
    loadSubcategories();
  }, [filters.category_id, filters.type]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadListings();
    }, filters.search ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [filters.status, filters.type, filters.category_id, filters.subcategory_id, filters.search]);

  const loadListings = async () => {
    try {
      setLoading(true);
      // Build filters object, removing "all" values
      const filterParams = { type: 'property' };
      filterParams.subtype = filters.type;
      filterParams.category_id = filters.category_id;
      filterParams.subcategory_id = filters.subcategory_id;

      const response = await getMyListings(filterParams);
      const listingsData = response?.data || response || [];
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

  const getTypeLabel = (type, subtype) => {
    // For property type, show subtype if available
    if (type === "property" && subtype) {
      const subtypeMap = {
        Hotel: "Hotels",
        Space: "Spaces",
        Vacation: "Vacation Rentals",
        EventVenue: "Event Venues",
      };
      return subtypeMap[subtype] || subtype;
    }

    // For other types, show the type label
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
          <h1 className="text-30 lh-14 fw-600">Property Listings Management</h1>
          <div className="text-15 text-light-1">
            Manage your property and service listings.
          </div>
        </div>
        <div className="col-md-auto d-flex justify-content-end">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/listings/select/property")}
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
            <option value="Hotel">Hotels</option>
            <option value="Space">Spaces</option>
            <option value="Vacation">Vacation Rentals</option>
            <option value="EventVenue">Event Venues</option>
          </select>
        </div>

        <div className="col-sm-auto">
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
            value={filters.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            disabled={!filters.type || filters.type === "all"}
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
          <table className="table-2 col-12">
            <thead>
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
                        hotel
                      </span>
                      <div className="text-16 text-light-1">No listings found</div>
                      <div className="text-14 text-light-1 mt-5">
                        Click "Add New {isProperty ? "Property" : "Listing"}" to create your first listing
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="align-middle">{listing.title}</td>
                    <td className="align-middle">{getTypeLabel(listing.type, listing.subtype)}</td>
                    <td className="align-middle">
                      {listing.category?.name || "-"}
                    </td>
                    <td className="align-middle">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="align-middle text-14">
                      {listing.created_at
                        ? new Date(listing.created_at).toLocaleDateString()
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
                        {/* <MenuItem
                            onClick={() => {
                              router.push(
                                `/vendor/property/${listing.id}/manage`
                              );
                              setAnchorEl(null);
                              setSelectedListingId(null);
                            }}
                            className="text-12"
                          >
                            Manage {isProperty ? "Property" : "Listing"}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              router.push(
                                `/vendor/property/${listing.id}/setting`
                              );
                              setAnchorEl(null);
                              setSelectedListingId(null);
                            }}
                            className="text-12"
                          >
                            Setting
                          </MenuItem> */}
                        {listing.status === "draft" && (
                          <MenuItem
                            onClick={() => {
                              handleSubmit(listing.id);
                            }}
                            className="text-12"
                            disabled={submitting && listingToSubmit?.id === listing.id}
                          >
                            {submitting && listingToSubmit?.id === listing.id ? "Submitting..." : "Submit"}
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            router.push(`/vendor/property/${listing.id}/edit`);
                            setAnchorEl(null);
                            setSelectedListingId(null);
                          }}
                          className="text-12"
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDeleteClick(listing.id);
                          }}
                          className="text-12 text-red-1"
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

      <DeleteConfirmationModal
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
    </VendorDashboardLayout>
  );
};
export default index;
