"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, MenuItem } from "@mui/material";
import { getMyCoupons, deleteVendorCoupon } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const CouponList = ({ detail = false, onEdit, refreshTrigger, filters = {} }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCoupons = async (filterParams = {}) => {
    try {
      setLoading(true);
      // Build query parameters from filters
      const params = {};
      
      if (filterParams.is_active !== undefined && filterParams.is_active !== "all") {
        params.is_active = filterParams.is_active === "true" || filterParams.is_active === true;
      }
      
      if (filterParams.listing_category_id && filterParams.listing_category_id !== "all") {
        params.listing_category_id = filterParams.listing_category_id;
      }
      
      if (filterParams.listing_subcategory_id && filterParams.listing_subcategory_id !== "all") {
        params.listing_subcategory_id = filterParams.listing_subcategory_id;
      }
      
      if (filterParams.listing_type && filterParams.listing_type !== "all") {
        params.listing_type = filterParams.listing_type;
      }
      
      if (filterParams.date_from) {
        params.date_from = filterParams.date_from;
      }
      
      if (filterParams.date_to) {
        params.date_to = filterParams.date_to;
      }

      const response = await getMyCoupons(params);
      const couponsData = response?.data?.data || response?.data || response || [];
      setCoupons(Array.isArray(couponsData) ? couponsData : []);
    } catch (error) {
      console.error("Error loading coupons:", error);
      if (error?.response?.status === 404 || error?.status === 404) {
        setCoupons([]);
      } else {
        toast.error(error?.message || "Failed to load coupons");
        setCoupons([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a stable filter key for dependency tracking
  const filterKey = useMemo(() => {
    return `${filters.is_active || ''}_${filters.listing_category_id || ''}_${filters.listing_subcategory_id || ''}_${filters.listing_type || ''}_${filters.date_from || ''}_${filters.date_to || ''}`;
  }, [filters.is_active, filters.listing_category_id, filters.listing_subcategory_id, filters.listing_type, filters.date_from, filters.date_to]);

  useEffect(() => {
    loadCoupons(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, filterKey]);

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
      loadCoupons();
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

  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <CircularProgress />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-center">
          <p className="text-14 text-light-1">No coupons found. Create your first coupon to get started.</p>
        </div>
      </div>
    );
  }

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
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="align-middle text-12 fw-500">{coupon.code}</td>
                <td className="align-middle text-12">{coupon.description || "N/A"}</td>
                <td className="align-middle text-12">
                  {coupon.listing_type ? coupon.listing_type.charAt(0).toUpperCase() + coupon.listing_type.slice(1) : "N/A"}
                </td>
                <td className="align-middle text-12">
                  {coupon.category?.name || "N/A"}
                </td>
                <td className="align-middle text-12">
                  {coupon.subcategory?.name || "N/A"}
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
                    className={`rounded-100 px-10 text-center text-12 ${
                      coupon.is_active
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
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
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
