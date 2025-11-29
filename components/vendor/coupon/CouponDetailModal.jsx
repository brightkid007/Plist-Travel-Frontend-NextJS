"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";

const CouponDetailModal = ({ open, onClose, coupon }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDiscount = (discountType, discountValue) => {
    if (!discountType || !discountValue) return "N/A";
    if (discountType === "fixed") {
      return `$${parseFloat(discountValue).toFixed(2)}`;
    } else {
      return `${parseFloat(discountValue).toFixed(0)}%`;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
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

  if (!coupon) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="coupon-detail-dialog-title"
    >
      <DialogTitle id="coupon-detail-dialog-title" className="d-flex items-center justify-between">
        <span className="text-20 fw-600">Coupon Details</span>
        <button
          onClick={onClose}
          className="border-0 bg-transparent cursor-pointer p-0"
          aria-label="close"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </DialogTitle>
      <DialogContent>
        <div className="py-10">
          {/* Coupon Code & Status */}
          <div className="mb-20">
            <div className="d-flex items-center gap-10 mb-10">
              <span className="text-14 text-light-1">Code:</span>
              <span className="text-18 fw-600 text-blue-1">{coupon.code || "N/A"}</span>
              <span className="text-14 text-light-1 ml-20">Status:</span>
              <span
                className={`rounded-100 px-10 text-center text-14 fw-500 ${
                  coupon.is_active
                    ? "bg-dark-4 text-white"
                    : "bg-light-2 text-dark-1"
                }`}
              >
                {coupon.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="border-top-light mb-20" />

          {/* Description */}
          {coupon.description && (
            <>
              <div className="mb-20">
                <h3 className="text-16 fw-600 mb-15">Description</h3>
                <div className="text-14 text-light-1">{coupon.description}</div>
              </div>
              <div className="border-top-light mb-20" />
            </>
          )}

          {/* Discount Information */}
          <div className="mb-20">
            <h3 className="text-16 fw-600 mb-15">Discount Information</h3>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="d-flex justify-between items-center">
                  <span className="text-14 text-light-1">Discount Type:</span>
                  <span className="text-15 fw-500">
                    {coupon.discount_type === "fixed" ? "Fixed Amount" : "Percentage"}
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex justify-between items-center">
                  <span className="text-14 text-light-1">Discount Value:</span>
                  <span className="text-16 fw-600 text-blue-1">
                    {formatDiscount(coupon.discount_type, coupon.discount_value)}
                  </span>
                </div>
              </div>
              {coupon.min_spend && (
                <div className="col-12">
                  <div className="d-flex justify-between items-center">
                    <span className="text-14 text-light-1">Minimum Spend:</span>
                    <span className="text-15 fw-500">{formatCurrency(coupon.min_spend)}</span>
                  </div>
                </div>
              )}
              {coupon.usage_limit && (
                <div className="col-12">
                  <div className="d-flex justify-between items-center">
                    <span className="text-14 text-light-1">Usage Limit:</span>
                    <span className="text-15 fw-500">{coupon.usage_limit} time(s)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-top-light mb-20" />

          {/* Validity Period */}
          <div className="mb-20">
            <h3 className="text-16 fw-600 mb-15">Validity Period</h3>
            <div className="row y-gap-15">
              <div className="col-md-6">
                <div className="text-14 text-light-1">Valid From:</div>
                <div className="text-15 fw-500">{formatDate(coupon.date_from)}</div>
              </div>
              <div className="col-md-6">
                <div className="text-14 text-light-1">Valid To:</div>
                <div className="text-15 fw-500">{formatDate(coupon.date_to)}</div>
              </div>
            </div>
          </div>

          <div className="border-top-light mb-20" />

          {/* Listing Information */}
          <div className="mb-20">
            <h3 className="text-16 fw-600 mb-15">Listing Information</h3>
            <div className="row y-gap-10">
              {coupon.listing?.subcategory?.category?.type && (
                <div className="col-12">
                  <div className="text-14 text-light-1">Listing Type:</div>
                  <div className="text-15 fw-500">
                    {coupon.listing.subcategory.category.type === "property"
                      ? getSubtypeName(coupon.listing.subcategory.category.subtype)
                      : getListingTypeName(coupon.listing.subcategory.category.type)}
                  </div>
                </div>
              )}
              {coupon.listing?.subcategory?.category?.name && (
                <div className="col-12">
                  <div className="text-14 text-light-1">Category:</div>
                  <div className="text-15 fw-500">
                    {coupon.listing.subcategory.category.name}
                  </div>
                </div>
              )}
              {coupon.listing?.subcategory?.name && (
                <div className="col-12">
                  <div className="text-14 text-light-1">Subcategory:</div>
                  <div className="text-15 fw-500">{coupon.listing.subcategory.name}</div>
                </div>
              )}
              <div className="col-12">
                <div className="text-14 text-light-1">Listing:</div>
                <div className="text-15 fw-500">
                  {coupon.listing?.title || "All Listings"}
                </div>
              </div>
            </div>
          </div>

          <div className="border-top-light mb-20" />

          {/* Additional Information */}
          <div className="mb-20">
            <h3 className="text-16 fw-600 mb-15">Additional Information</h3>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="text-14 text-light-1">Coupon ID:</div>
                <div className="text-15 fw-500">#{coupon.id}</div>
              </div>
              {coupon.created_at && (
                <div className="col-12">
                  <div className="text-14 text-light-1">Created At:</div>
                  <div className="text-15 fw-500">
                    {formatDateTime(coupon.created_at || coupon.createdAt)}
                  </div>
                </div>
              )}
              {coupon.updated_at && (
                <div className="col-12">
                  <div className="text-14 text-light-1">Last Updated:</div>
                  <div className="text-15 fw-500">
                    {formatDateTime(coupon.updated_at || coupon.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="px-20 pb-20">
        <button
          className="text-14 border-light rounded-8 px-20 py-10 fw-500"
          onClick={onClose}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponDetailModal;

