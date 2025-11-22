"use client";

import { useState, useEffect, useRef } from "react";
import VendorDashboardLayout from "../../common/layout";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { getMyListings, deleteListing, updateListing, getListingCategories, getListingSubcategories } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import ListingDetailModal from "../../common/ListingDetailModal";

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
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const loadAllData = async () => {
    try {
      // Load all categories (property type)
      const catRes = await getListingCategories({ type: 'property' });
      const allCats = catRes?.data || catRes || [];
      setAllCategories(allCats);

      // Load all subcategories (property type)
      const subcatRes = await getListingSubcategories({ type: 'property' });
      const allSubcats = subcatRes?.data || subcatRes || [];
      setAllSubcategories(allSubcats);
    } catch (error) {
      console.error("Error loading categories/subcategories:", error);
    }
  };

  // Pre-load all categories and subcategories once on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Filter categories on frontend based on type (subtype filter)
  useEffect(() => {
    let filtered = [...allCategories];

    // Filter by subtype if not "all"
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((cat) => cat.subtype === filters.type);
    }

    setCategories(filtered);

    // Reset category and subcategory filters when type changes
    setFilters((prev) => ({
      ...prev,
      category_id: "all",
      subcategory_id: "all"
    }));
  }, [filters.type, allCategories]);

  // Filter subcategories on frontend based on category_id and type (subtype filter)
  useEffect(() => {
    let filtered = [...allSubcategories];

    // Filter by subtype if not "all"
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((subcat) => subcat.subtype === filters.type);
    }

    // Filter by category_id if selected
    if (filters.category_id && filters.category_id !== "all") {
      const categoryId = parseInt(filters.category_id, 10);
      filtered = filtered.filter((subcat) => {
        const subcatCategoryId = subcat.category_id || subcat.listing_category_id;
        return subcatCategoryId === categoryId;
      });
    }
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
  }, [filters.category_id, filters.type, allSubcategories, filters.subcategory_id]);

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
      
      // Add subtype filter
      if (filters.type && filters.type !== "all") {
        filterParams.subtype = filters.type;
      }
      
      // Add category_id filter
      if (filters.category_id && filters.category_id !== "all") {
        filterParams.category_id = filters.category_id;
      }
      
      // Add subcategory_id filter
      if (filters.subcategory_id && filters.subcategory_id !== "all") {
        filterParams.subcategory_id = filters.subcategory_id;
      }
      
      // Add status filter
      if (filters.status && filters.status !== "all") {
        filterParams.status = filters.status;
      }
      
      // Add search filter
      if (filters.search && filters.search.trim() !== "") {
        filterParams.search = filters.search.trim();
      }

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
                            setSelectedListingIdForDetail(listing.id);
                            setDetailModalOpen(true);
                            setAnchorEl(null);
                            setSelectedListingId(null);
                          }}
                          className="text-12"
                        >
                          View Details
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            router.push(`/vendor/property/${listing.id}/edit?subtype=${listing.subtype}`);
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
