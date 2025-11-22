"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, MenuItem } from "@mui/material";
import { getMyCoupons, deleteVendorCoupon } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const CouponList = ({ onEdit, onView, onRefresh, coupons = [], loading = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleMenuClick = (event, couponId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCouponId(couponId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCouponId(null);
  };

  const handleDeleteClick = (couponId) => {
    const coupon = coupons.find((c) => c.id === couponId);
    setCouponToDelete(coupon);
    setDeleteModalOpen(true);
    setAnchorEl(null);
    setSelectedCouponId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      setDeleting(true);
      await deleteVendorCoupon(couponToDelete.id);
      toast.success("Coupon deleted successfully");
      if (onRefresh) {
        onRefresh();
      }
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(error?.message || "Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (couponId) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (onEdit && coupon) {
      onEdit(coupon);
    }
    setAnchorEl(null);
    setSelectedCouponId(null);
  };

  const handleViewClick = (couponId) => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (onView && coupon) {
      onView(coupon);
    }
    setAnchorEl(null);
    setSelectedCouponId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (error) {
      return dateString;
    }
  };

  const formatDiscount = (discountType, discountValue) => {
    if (discountType === "fixed") {
      return `$${parseFloat(discountValue).toFixed(2)}`;
    } else {
      return `${parseFloat(discountValue).toFixed(0)}%`;
    }
  };

  const getSubtypeName = (subtype) => {
    if (!subtype) return "N/A";
    
    const subtypeMap = {
      "Hotel": "Hotels",
      "Space": "Spaces",
      "Vacation": "Vacation Rentals",
      "EventVenue": "Event Venues",
    };

    return subtypeMap[subtype] || subtype.charAt(0).toUpperCase() + subtype.slice(1);
  };

  const getListingTypeName = (listingType) => {
    if (!listingType) return "N/A";
    
    const typeMap = {
      "property": "Property",
      "tour": "Tour",
      "event": "Event",
      "activity": "Activity",
    };

    return typeMap[listingType] || listingType.charAt(0).toUpperCase() + listingType.slice(1);
  };

  return (
    <>
      <div className="overflow-scroll scroll-bar-1 pt-0">
        <table className="table-2 col-12">
          <thead>
            <tr className="text-light-1 fw-600 text-14">
              <th>Code</th>
              <th>Description</th>
              <th>Listing Type</th>
              <th>Listing Category</th>
              <th>Listing Subcategory</th>
              <th>Listing</th>
              <th>Discount</th>
              <th>Date from</th>
              <th>Date to</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-40">
                  <CircularProgress size={24} />
                  <p className="text-14 text-light-1 mt-10">Loading coupons...</p>
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-40">
                  <p className="text-14 text-light-1">No coupons found. Create your first coupon to get started.</p>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="align-middle text-12 fw-500">{coupon.code}</td>
                  <td className="align-middle text-12">{coupon.description || "N/A"}</td>
                  <td className="align-middle text-12">
                    {coupon.listing?.subcategory?.category?.type === "property"
                      ? getSubtypeName(coupon.listing?.subcategory?.category?.subtype)
                      : getListingTypeName(coupon.listing?.subcategory?.category?.type)
                    }
                  </td>
                  <td className="align-middle text-12">
                    {coupon.listing?.subcategory?.category?.name || "N/A"}
                  </td>
                  <td className="align-middle text-12">
                    {coupon.listing?.subcategory?.name || "N/A"}
                  </td>
                  <td className="align-middle text-12">
                    {coupon.listing?.title || "All Listings"}
                  </td>
                  <td className="align-middle text-12 fw-500">
                    {formatDiscount(coupon.discount_type, coupon.discount_value)}
                  </td>
                  <td className="align-middle text-12">{formatDate(coupon.date_from)}</td>
                  <td className="align-middle text-12">{formatDate(coupon.date_to)}</td>
                  <td className="align-middle">
                    <span
                      className={`rounded-100 px-10 text-center text-12 ${coupon.is_active
                        ? "bg-dark-4 text-white"
                        : "bg-light-2 text-dark-1"
                        }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="align-middle">
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      onClick={(e) => handleMenuClick(e, coupon.id)}
                    >
                      more_horiz
                    </span>
                    <Menu
                      anchorEl={anchorEl}
                      open={showMoreMenu && selectedCouponId === coupon.id}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem
                        onClick={() => handleViewClick(coupon.id)}
                        className="text-12"
                      >
                        View
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleEditClick(coupon.id)}
                        className="text-12"
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteClick(coupon.id)}
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

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${couponToDelete?.code || `#${couponToDelete?.id}`}"?`}
        itemName={couponToDelete?.code || `Coupon #${couponToDelete?.id}`}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />
    </>
  );
};

export default CouponList;
