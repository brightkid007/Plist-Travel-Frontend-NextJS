"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, MenuItem } from "@mui/material";
import { getMyCoupons, deleteVendorCoupon } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";
import { Tag } from "lucide-react";

const CouponList = ({ onEdit, onView, onRefresh, coupons = [], loading = false }) => {
  const { hasPermission } = useVendorPermissions();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter coupons based on search term
  const filteredCoupons = useMemo(() => {
    if (!searchTerm) return coupons;

    const search = searchTerm.toLowerCase();
    return coupons.filter((coupon) => {
      const code = (coupon.code || "").toLowerCase();
      const description = (coupon.description || "").toLowerCase();
      const listingTitle = (coupon.listing?.title || "").toLowerCase();
      const categoryName = (coupon.listing?.subcategory?.category?.name || "").toLowerCase();
      const subcategoryName = (coupon.listing?.subcategory?.name || "").toLowerCase();
      const discountValue = String(coupon.discount_value || "").toLowerCase();
      const discountType = (coupon.discount_type || "").toLowerCase();
      const status = (coupon.is_active ? "active" : "inactive").toLowerCase();

      return (
        code.includes(search) ||
        description.includes(search) ||
        listingTitle.includes(search) ||
        categoryName.includes(search) ||
        subcategoryName.includes(search) ||
        discountValue.includes(search) ||
        discountType.includes(search) ||
        status.includes(search)
      );
    });
  }, [coupons, searchTerm]);

  return (
    <>
      <div className="d-flex items-center justify-end mb-10">
        <div className="position-relative d-flex items-center w-180 sm:w-full">
          <input
            type="text"
            placeholder="Search coupons..."
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
      <div className="border-light rounded-8 px-15 py-5">
        <div className="overflow-scroll scroll-bar-1 pt-0">
          <table className="table-2 col-12 text-14">
            <thead className="text-nowrap">
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
                  <td colSpan="11" className="align-middle py-40">
                    <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                      <CircularProgress size={24} />
                      <span>Loading coupons...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="11" className="align-middle py-40">
                    <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                      <Tag size={18} />
                      <span>{searchTerm ? "No coupons found matching your search" : "No coupons found"}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
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
                          onClick={() => {
                            if (hasPermission("coupon_promotion_management", "view")) {
                              handleViewClick(coupon.id);
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("coupon_promotion_management", "view")}
                        >
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("coupon_promotion_management", "update")) {
                              handleEditClick(coupon.id);
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("coupon_promotion_management", "update")}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("coupon_promotion_management", "delete")) {
                              handleDeleteClick(coupon.id);
                            }
                          }}
                          className="text-12 text-red-1"
                          disabled={!hasPermission("coupon_promotion_management", "delete")}
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
