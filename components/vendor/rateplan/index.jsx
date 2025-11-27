"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Checkbox } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import DatePicker, { DateObject } from "react-multi-date-picker";

import VendorDashboardLayout from "../common/layout";
import { getRatePlans, getMyListings, getRoomTypes, deleteRatePlan } from "@/helpers/backend_helper";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { MoreVertical } from "lucide-react";
import { Menu, MenuItem } from "@mui/material";

const index = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [ratePlans, setRatePlans] = useState([]);
  const [listings, setListings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  
  const [filters, setFilters] = useState({
    listing_id: "",
    room_type_id: "",
  });
  const [hideInactive, setHideInactive] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ratePlanToDelete, setRatePlanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({});

  // Menu handlers for dropdown actions
  const handleMenuOpen = (event, ratePlanId) => {
    setMenuAnchor({ [ratePlanId]: event.currentTarget });
  };

  const handleMenuClose = (ratePlanId) => {
    setMenuAnchor({ [ratePlanId]: null });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadRatePlans();
  }, [filters.listing_id, filters.room_type_id, hideInactive]);

  useEffect(() => {
    if (filters.listing_id) {
      loadRoomTypes(filters.listing_id);
    } else {
      setFilteredRoomTypes([]);
      setFilters((prev) => ({ ...prev, room_type_id: "" }));
    }
  }, [filters.listing_id]);

  const loadData = async () => {
    try {
      // Fetch listings in parallel
      const listingsRes = await getMyListings({ type: "property" }).catch(() => ({ data: [] }));
      setListings(listingsRes?.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(error?.message || "Failed to load data");
    }
  };

  const loadRoomTypes = async (listingId) => {
    try {
      const response = await getRoomTypes({ listing_id: listingId }).catch(() => ({ data: [] }));
      setFilteredRoomTypes(response?.data || []);
    } catch (error) {
      console.error("Error loading room types:", error);
      setFilteredRoomTypes([]);
    }
  };

  const loadRatePlans = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.listing_id) {
        params.listing_id = filters.listing_id;
      }
      if (filters.room_type_id) {
        params.room_type_id = filters.room_type_id;
      }
      if (hideInactive) {
        params.is_active = true;
      }

      const response = await getRatePlans(params);
      // Handle response structure: { data: { rate_plans: [...] } }
      const plansData = response?.data?.rate_plans || response?.rate_plans || response?.data || [];
      setRatePlans(Array.isArray(plansData) ? plansData : []);
    } catch (error) {
      console.error("Error loading rate plans:", error);
      toast.error(error?.message || "Failed to load rate plans");
      setRatePlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      // Reset room_type_id if listing_id changes
      if (field === "listing_id") {
        newFilters.room_type_id = "";
      }
      return newFilters;
    });
  };

  const formatMeals = (ratePlan) => {
    if (!ratePlan.includes_breakfast && !ratePlan.includes_add_ons) {
      return "None";
    }
    const meals = [];
    if (ratePlan.includes_breakfast) {
      meals.push("Breakfast");
    }
    if (ratePlan.includes_add_ons) {
      meals.push("Add-ons");
    }
    return meals.join(" & ");
  };

  const formatRateDetails = (ratePlan) => {
    const details = [];
    if (ratePlan.special_offer) {
      details.push(ratePlan.special_offer);
    }
    if (ratePlan.management_mode === "derived") {
      details.push("Synchronized with base plan");
    }
    return details.length > 0 ? details.join(", ") : "Set in the Calendar";
  };

  const formatCancellationPolicy = (policyId) => {
    // For now, return the policy ID or a placeholder
    // This can be enhanced later to fetch and display the actual policy name
    return policyId ? `Policy ID: ${policyId}` : "Not set";
  };

  const formatPrepayId = (ratePlan) => {
    if (ratePlan.payment_method === "prepay") {
      return `CM Prepay ID: ${ratePlan.id}`;
    }
    return ratePlan.payment_method === "prepay" ? "Prepay" : "Pay at property";
  };

  const handleEdit = (ratePlan) => {
    const planType = ratePlan.plan_type || "custom";
    router.push(`/vendor/rateplan/${ratePlan.id}/edit/${planType}`);
  };

  const handleDeleteClick = (ratePlan) => {
    setRatePlanToDelete(ratePlan);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ratePlanToDelete) return;

    try {
      setDeleting(true);
      await deleteRatePlan(ratePlanToDelete.id);
      toast.success("Rate plan deleted successfully");
      setDeleteModalOpen(false);
      setRatePlanToDelete(null);
      // Reload rate plans
      loadRatePlans();
    } catch (error) {
      console.error("Error deleting rate plan:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete rate plan");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRatePlanToDelete(null);
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-10 justify-between items-end mb-10">
        <div className="col-12">
          <h1 className="text-30 lh-14 fw-600">Rate Plan</h1>
          <div className="text-15 text-light-1">
            Create and review different types of rate plans for different
            guests. You can manage availability and pricing in the Calendar.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-8 py-20 px-20 col-12">
        <div className="row y-gap-10 x-gap-10 items-center">
          <div className="col-sm-auto">
            <select
              className="form-select rounded-8 border-light justify-between px-15 h-50 w-180 sm:w-full text-14"
              value={filters.listing_id}
              onChange={(e) => handleFilterChange("listing_id", e.target.value)}
            >
              <option value="">All listings</option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title || listing.name || `Listing ${listing.id}`}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-auto">
            <select
              className="form-select rounded-8 border-light justify-between px-15 h-50 w-180 sm:w-full text-14"
              value={filters.room_type_id}
              onChange={(e) => handleFilterChange("room_type_id", e.target.value)}
              disabled={!filters.listing_id}
            >
              <option value="">All room types</option>
              {filteredRoomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name || `Room Type ${roomType.id}`}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="position-relative col-sm-auto">
            <div className="border-light rounded-8 pt-15 px-15 w-full h-50 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMMM DD"
              />
            </div>
            <label
              className="position-absolute lh-1 text-12 text-light-1 px-5"
              style={{ left: "15px", top: "0px", backgroundColor: "white" }}
            >
              Start date
            </label>
          </div>
          <div className="position-relative col-sm-auto">
            <div className="border-light rounded-8 pt-15 px-15 w-full h-50 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMMM DD"
              />
            </div>
            <label
              className="position-absolute lh-1 text-12 text-light-1 px-5"
              style={{ left: "15px", top: "0px", backgroundColor: "white" }}
            >
              End date
            </label>
          </div> */}
          <div className="col-auto d-flex items-center">
            <Checkbox
              checked={hideInactive}
              onChange={(e) => setHideInactive(e.target.checked)}
            />
            <div className="text-14 lh-14">Hide inactive rate plans</div>
          </div>
          <div className="col-auto ms-auto">
            <button
              className="bg-blue-1 text-white text-14 rounded-8 px-15 py-5"
              onClick={() => router.push("/vendor/rateplan/add")}
            >
              Add
            </button>
          </div>

          <div className="overflow-scroll scroll-bar-1 pt-10">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr>
                  <th style={{ width: "25%" }}>Rate plan name</th>
                  <th>Cancellation policy</th>
                  <th>Rate, room status & restrictions</th>
                  <th>Meals</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-40">
                      <CircularProgress size={30} />
                      <p className="text-14 text-light-1 mt-10">Loading rate plans...</p>
                    </td>
                  </tr>
                ) : ratePlans.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-40">
                      <p className="text-14 text-light-1">No rate plans found</p>
                    </td>
                  </tr>
                ) : (
                  ratePlans.map((ratePlan) => (
                    <tr key={ratePlan.id}>
                      <td className="text-12">
                        <div className="text-blue-1">{ratePlan.title || ratePlan.name || "Rate Plan"}</div>
                        <div className="text-light-1">{formatPrepayId(ratePlan)}</div>
                      </td>
                      <td className="text-12">
                        {formatCancellationPolicy(ratePlan.cancellation_policy_id)}
                      </td>
                      <td className="text-12">{formatRateDetails(ratePlan)}</td>
                      <td className="text-12">{formatMeals(ratePlan)}</td>
                      <td>
                        <span
                          className={
                            "rounded-100 px-10 text-center col-12 text-12 fw-500 " +
                            (ratePlan.is_active
                              ? "bg-dark-blue text-white"
                              : "bg-light-2 text-light-1")
                          }
                        >
                          {ratePlan.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, ratePlan.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <Menu
                            anchorEl={menuAnchor[ratePlan.id]}
                            open={Boolean(menuAnchor[ratePlan.id])}
                            onClose={() => handleMenuClose(ratePlan.id)}
                          >
                            <MenuItem 
                              onClick={() => {
                                handleEdit(ratePlan);
                                handleMenuClose(ratePlan.id);
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem 
                              onClick={() => {
                                handleDeleteClick(ratePlan);
                                handleMenuClose(ratePlan.id);
                              }}
                              className="text-red-2"
                            >
                              Delete
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

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Rate Plan"
        message={`Are you sure you want to delete the rate plan "${ratePlanToDelete?.title || ratePlanToDelete?.name || 'this rate plan'}"?`}
        itemName={ratePlanToDelete?.title || ratePlanToDelete?.name}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
        loading={deleting}
      />
    </VendorDashboardLayout>
  );
};

export default index;
