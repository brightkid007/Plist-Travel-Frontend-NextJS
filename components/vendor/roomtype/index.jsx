"use client";

import { useState, useEffect } from "react";
import VendorDashboardLayout from "../common/layout";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, MenuItem } from "@mui/material";
import { getRoomTypes, deleteRoomType, getMyListings } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");

  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [listings, setListings] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    listingId: listingId || "all",
    status: "all",
  });

  const tabs = [
    { label: "All Room Types", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  // Load listings for filter dropdown
  useEffect(() => {
    loadListings();
  }, []);

  // Load room types from backend
  useEffect(() => {
    loadRoomTypes();
  }, [filters.listingId]);

  // Filter room types based on search and status
  useEffect(() => {
    filterRoomTypes();
  }, [roomTypes, filters.search, activeTab]);

  const loadListings = async () => {
    try {
      const response = await getMyListings({ type: "property" });
      const listingsData = response?.data || response || [];
      setListings(Array.isArray(listingsData) ? listingsData : []);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
  };

  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      
      if (filters.listingId && filters.listingId !== "all") {
        filterParams.listing_id = parseInt(filters.listingId, 10);
      }

      const response = await getRoomTypes(filterParams);
      const roomTypesData = response?.data || response || [];
      const roomTypesArray = Array.isArray(roomTypesData) ? roomTypesData : [];
      
      // Transform backend data to match UI format
      const transformedRoomTypes = roomTypesArray.map((roomType) => {
        const listing = roomType.listing || {};
        const amenities = Array.isArray(roomType.amenities) ? roomType.amenities : [];
        
        // Get first image from images array if available
        const images = Array.isArray(roomType.images) ? roomType.images : [];
        const firstImage = images.length > 0 ? images[0] : null;
        
        // Construct image URL from first image
        let image = "/img/testimonials/1/4.png"; // Default placeholder
        if (firstImage && firstImage.url) {
          // Check if URL is already complete (absolute URL)
          if (firstImage.url.startsWith("http://") || firstImage.url.startsWith("https://")) {
            image = firstImage.url;
          } else {
            // Construct full URL from relative path
            const baseUrl = process.env.NEXT_PUBLIC_LISTING_SERVICE_URL || "http://localhost:8081";
            const cleanUrl = baseUrl.endsWith('/api') ? baseUrl.slice(0, -4) : baseUrl;
            // Ensure image URL doesn't already include /api
            const imagePath = firstImage.url.startsWith('/api') ? firstImage.url.slice(4) : firstImage.url;
            image = `${cleanUrl}${imagePath}`;
          }
        }
        
        return {
          id: roomType.id,
          image: image,
          name: roomType.name || "",
          property: listing.title || listing.type || "Unknown",
          propertyType: listing.subtype || "",
          listingId: roomType.listing_id,
          maxAdults: roomType.occupancy_adults || 0,
          maxChildren: roomType.occupancy_children || 0,
          maxOccupancy: (roomType.occupancy_adults || 0) + (roomType.occupancy_children || 0),
          rooms: roomType.number_of_rooms ? `${roomType.number_of_rooms} ${roomType.number_of_rooms === 1 ? 'room' : 'rooms'}` : "0 rooms",
          status: "Active", // You may need to add status field to room type model
          bookingType: roomType.booking_type || "",
          description: roomType.description || "",
          basePrice: roomType.base_price || 0,
          listing: listing,
          amenities: amenities,
          rawData: roomType, // Keep raw data for edit
        };
      });
      
      setRoomTypes(transformedRoomTypes);
    } catch (error) {
      console.error("Error loading room types:", error);
      if (error?.response?.status === 404 || error?.status === 404) {
        setRoomTypes([]);
      } else {
        toast.error(error?.message || "Failed to load room types");
        setRoomTypes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterRoomTypes = () => {
    let filtered = [...roomTypes];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (rt) =>
          rt.name.toLowerCase().includes(searchLower) ||
          rt.property.toLowerCase().includes(searchLower) ||
          rt.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status tab
    if (activeTab === "active") {
      filtered = filtered.filter((rt) => rt.status === "Active");
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((rt) => rt.status === "Inactive");
    }

    setFilteredRoomTypes(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleDeleteClick = (roomTypeId) => {
    const roomType = roomTypes.find((rt) => rt.id === roomTypeId);
    setRoomTypeToDelete(roomType);
    setDeleteModalOpen(true);
    setAnchorEl(null);
    setSelectedRoomTypeId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRoomTypeToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!roomTypeToDelete) return;

    try {
      setDeleting(true);
      await deleteRoomType(roomTypeToDelete.id);
      toast.success("Room type deleted successfully!");
      await loadRoomTypes();
      setDeleteModalOpen(false);
      setRoomTypeToDelete(null);
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast.error(error?.message || "Failed to delete room type");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (roomTypeId) => {
    const roomType = roomTypes.find((rt) => rt.id === roomTypeId);
    if (roomType) {
      const queryParams = new URLSearchParams();
      if (roomType.listingId) {
        queryParams.set("listingId", roomType.listingId);
      }
      queryParams.set("roomTypeId", roomTypeId);
      if (roomType.propertyType) {
        queryParams.set("subtype", roomType.propertyType);
      }
      router.push(`/vendor/room-type/add?${queryParams.toString()}`);
    }
    setAnchorEl(null);
    setSelectedRoomTypeId(null);
  };

  const handleMenuOpen = (event, roomTypeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoomTypeId(roomTypeId);
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-md-auto">
          <h1 className="text-30 lh-14 fw-600">Room Type</h1>
          <div className="text-15 text-light-1">
            Manage your room types and details.
          </div>
        </div>
        <div className="col-md-auto d-flex justify-content-end">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/room-type/add?subtype=Hotel")}
          >
            <i className="icon-plus mr-10"></i> Add New Room Type
          </button>
        </div>
      </div>

      <div className="row px-10 mb-20">
        {tabs.map((item) => (
          <div className="col-auto px-5" key={item.value}>
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                activeTab === item.value ? "bg-white" : "text-light-1"
              }`}
              onClick={() => handleTabChange(item.value)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-8 border-light px-15 py-15">
        <div className="row y-gap-10 x-gap-10 items-center mb-5">
          <div className="col-sm-auto d-flex">
            <div className="position-relative d-flex items-center w-180 sm:w-full">
              <input
                type="text"
                placeholder="Search room types..."
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
              value={filters.listingId}
              onChange={(e) => handleFilterChange("listingId", e.target.value)}
            >
              <option value="all">All Properties</option>
              
              {/* Hotel Properties */}
              {listings.filter(listing => listing.subtype === "Hotel").length > 0 && (
                <optgroup label="Hotels">
                  {listings
                    .filter(listing => listing.subtype === "Hotel")
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}

              {/* Space Properties */}
              {listings.filter(listing => listing.subtype === "Space").length > 0 && (
                <optgroup label="Spaces">
                  {listings
                    .filter(listing => listing.subtype === "Space")
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}

              {/* Vacation Rentals */}
              {listings.filter(listing => listing.subtype === "Vacation").length > 0 && (
                <optgroup label="Vacation Rentals">
                  {listings
                    .filter(listing => listing.subtype === "Vacation")
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}

              {/* Event Venues */}
              {listings.filter(listing => listing.subtype === "EventVenue").length > 0 && (
                <optgroup label="Event Venues">
                  {listings
                    .filter(listing => listing.subtype === "EventVenue")
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}

              {/* Other/Unknown Types */}
              {listings.filter(listing => 
                listing.subtype && 
                !["Hotel", "Space", "Vacation", "EventVenue"].includes(listing.subtype)
              ).length > 0 && (
                <optgroup label="Other">
                  {listings
                    .filter(listing => 
                      listing.subtype && 
                      !["Hotel", "Space", "Vacation", "EventVenue"].includes(listing.subtype)
                    )
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}

              {/* Properties without subtype */}
              {listings.filter(listing => !listing.subtype).length > 0 && (
                <optgroup label="Uncategorized">
                  {listings
                    .filter(listing => !listing.subtype)
                    .map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title || `Property #${listing.id}`}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="col-sm-auto ms-auto">
            <button className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full">
              Export Room Types
            </button>
          </div>
        </div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-2 col-12">
            <thead>
              <tr className="text-light-1 fw-600">
                <th>Image</th>
                <th>Room Type</th>
                <th>Property</th>
                <th>Max Adults</th>
                <th>Max Children</th>
                <th>Max Occupancy</th>
                <th>Rooms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-40">
                    <div className="d-flex justify-center items-center">
                      <CircularProgress />
                    </div>
                  </td>
                </tr>
              ) : filteredRoomTypes.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-40">
                    <div className="text-16 text-light-1">
                      {roomTypes.length === 0
                        ? "No room types found. Create your first room type to get started."
                        : "No room types match your filters."}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoomTypes.map((row, index) => (
                  <tr key={row.id || index}>
                    <td className="align-middle">
                      <img
                        className="rounded-8"
                        src={row.image}
                        alt={row.name}
                        style={{
                          height: "50px",
                          width: "60px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/img/testimonials/1/4.png";
                        }}
                      />
                    </td>
                    <td className="align-middle fw-500">{row.name}</td>
                    <td className="align-middle">{row.property}</td>
                    <td className="align-middle">{row.maxAdults}</td>
                    <td className="align-middle">{row.maxChildren}</td>
                    <td className="align-middle">{row.maxOccupancy}</td>
                    <td className="align-middle">{row.rooms}</td>
                    <td className="align-middle">
                      <span
                        className={`rounded-100 px-10 text-center text-14 ${
                          row.status === "Active"
                            ? "bg-dark-4 text-white"
                            : "border-light"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span
                        className="material-symbols-outlined cursor-pointer"
                        onClick={(event) => handleMenuOpen(event, row.id)}
                      >
                        more_horiz
                      </span>
                      <Menu
                        id={`more-menu-${row.id}`}
                        anchorEl={anchorEl}
                        open={showMoreMenu && selectedRoomTypeId === row.id}
                        onClose={() => {
                          setAnchorEl(null);
                          setSelectedRoomTypeId(null);
                        }}
                      >
                        <MenuItem
                          onClick={() => handleEditClick(row.id)}
                          className="text-12"
                        >
                          Edit Room Type
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleDeleteClick(row.id)}
                          className="text-12 text-red-1"
                        >
                          Delete Room Type
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
        title="Delete Room Type"
        message={
          roomTypeToDelete
            ? `Are you sure you want to delete "${roomTypeToDelete.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this room type?"
        }
        loading={deleting}
      />
    </VendorDashboardLayout>
  );
};
export default index;
