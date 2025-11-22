"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { getListingById, getMediaAssets } from "@/helpers/backend_helper";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";
import StarRating from "../listings/common/StarRating";

const ListingDetailModal = ({ open, onClose, listingId }) => {
  const [listing, setListing] = useState(null);
  const [listingImages, setListingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (open && listingId) {
      loadListingDetail();
    } else {
      setListing(null);
      setListingImages([]);
      setError(null);
      setSelectedImageIndex(0);
    }
  }, [open, listingId]);

  const loadListingDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch listing and images in parallel
      const [listingResponse, imagesResponse] = await Promise.all([
        getListingById(listingId),
        getMediaAssets({ listing_id: listingId, asset_type: "image" }).catch(() => ({ data: [] })) // Don't fail if images fail to load
      ]);
      
      const listingData = listingResponse?.data || listingResponse;
      setListing(listingData);
      
      // Extract images from response
      const imagesData = imagesResponse?.data || imagesResponse || [];
      const imagesArray = Array.isArray(imagesData) ? imagesData : [];
      setListingImages(imagesArray);
    } catch (err) {
      console.error("Error loading listing detail:", err);
      setError(typeof err === "string" ? err : err?.message || "Failed to load listing details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "draft":
        return "bg-light-2 text-dark-1";
      case "submitted":
        return "bg-blue-1 text-white";
      case "approved":
        return "bg-dark-4 text-white";
      case "rejected":
        return "bg-red-1 text-white";
      default:
        return "bg-gray-4 text-gray-3";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      draft: "Draft",
      submitted: "Submitted",
      approved: "Active",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  const getTypeLabel = (type, subtype) => {
    if (type === "property" && subtype) {
      const subtypeMap = {
        Hotel: "Hotels",
        Space: "Spaces",
        Vacation: "Vacation Rentals",
        EventVenue: "Event Venues",
      };
      return subtypeMap[subtype] || subtype;
    }
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

  // Get main image from fetched images
  const getMainImage = () => {
    if (listingImages.length === 0) return null;
    const selectedImage = listingImages[selectedImageIndex] || listingImages[0];
    if (!selectedImage) return null;
    const url = getImageUrl(selectedImage);
    console.log("url", url);
    return url || null;
  };
  
  const mainImage = getMainImage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="listing-detail-dialog-title"
      PaperProps={{
        style: {
          borderRadius: "16px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle 
        id="listing-detail-dialog-title" 
        className="d-flex items-center justify-between pb-15"
        style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "15px" }}
      >
        <div className="d-flex items-center gap-3">
          <span className="material-symbols-outlined text-24 text-blue-1">info</span>
          <span className="text-20 fw-600">Listing Details</span>
        </div>
        <button
          onClick={onClose}
          className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
          aria-label="close"
          style={{ width: "32px", height: "32px", borderRadius: "8px" }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
        >
          <span className="material-symbols-outlined text-20">close</span>
        </button>
      </DialogTitle>
      <DialogContent style={{ padding: "0", maxHeight: "calc(90vh - 120px)", overflowY: "auto" }}>
        {loading ? (
          <div className="d-flex justify-center items-center py-60">
            <div className="d-flex flex-column items-center gap-5">
              <CircularProgress />
              <div className="text-14 text-light-1">Loading listing details...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-60">
            <div className="d-flex flex-column items-center gap-5">
              <span className="material-symbols-outlined text-48 text-red-1">error</span>
              <div className="text-16 text-red-1 fw-500">{error}</div>
            </div>
          </div>
        ) : listing ? (
          <div>
            {/* Hero Section with Image and Status */}
            <div className="position-relative" style={{ minHeight: "200px", backgroundColor: "#f9fafb" }}>
              {mainImage ? (
                <div className="position-relative" style={{ width: "100%", height: "250px" }}>
                  <Image
                    src={mainImage}
                    alt={listing.title || "Listing image"}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/img/testimonials/1/1.png";
                    }}
                    unoptimized
                  />
                  <div className="position-absolute" style={{ top: "15px", right: "15px" }}>
                    <span
                      className={`rounded-100 px-10 text-center text-13 fw-600 ${getStatusColor(
                        listing.status
                      )}`}
                    >
                      {getStatusLabel(listing.status)}
                    </span>
                  </div>
                </div>
              ) : (
                <div 
                  className="d-flex items-center justify-center"
                  style={{ width: "100%", height: "250px", backgroundColor: "#e5e7eb" }}
                >
                  <div className="d-flex flex-column items-center gap-10">
                    <span className="material-symbols-outlined text-48 text-light-1">image</span>
                    <div className="text-14 text-light-1">No image available</div>
                  </div>
                </div>
              )}
              
              {/* Image Gallery Thumbnails */}
              {listingImages.length > 1 && (
                <div className="px-20 py-15" style={{ backgroundColor: "#ffffff" }}>
                  <div className="d-flex gap-10 overflow-x-auto scroll-bar-1" style={{ paddingBottom: "5px" }}>
                    {listingImages.slice(0, 6).map((img, index) => {
                      const imageUrl = getImageUrl(img);
                      // Skip rendering if imageUrl is null or undefined
                      if (!imageUrl) return null;
                      
                      return (
                        <div
                          key={index}
                          className="cursor-pointer"
                          onClick={() => setSelectedImageIndex(index)}
                          style={{
                            minWidth: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: selectedImageIndex === index ? "2px solid #1967d2" : "2px solid transparent",
                            opacity: selectedImageIndex === index ? 1 : 0.7,
                          }}
                          onMouseEnter={(e) => {
                            if (selectedImageIndex !== index) e.currentTarget.style.opacity = "0.9";
                          }}
                          onMouseLeave={(e) => {
                            if (selectedImageIndex !== index) e.currentTarget.style.opacity = "0.7";
                          }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Listing image ${index + 1}`}
                            width={80}
                            height={80}
                            onError={(e) => {
                              e.target.src = "/img/testimonials/1/1.png";
                            }}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            unoptimized
                          />
                        </div>
                      );
                    }).filter(Boolean)}
                    {listingImages.length > 6 && (
                      <div
                        className="d-flex items-center justify-center bg-light-2"
                        style={{
                          minWidth: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                        }}
                      >
                        <span className="text-12 text-light-1 fw-500">+{listingImages.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-30 py-20">
              {/* Title and Basic Info */}
              <div className="mb-20">
                <h2 className="text-24 fw-600 mb-10">{listing.title || "Untitled Listing"}</h2>
                <div className="d-flex items-center gap-5 flex-wrap">
                  <div className="d-flex items-center gap-2">
                    <span className="material-symbols-outlined text-16 text-light-1">category</span>
                    <span className="text-14 text-light-1">{getTypeLabel(listing.type, listing.subtype)}</span>
                  </div>
                  {listing.category && (
                    <>
                      <span className="text-light-1">•</span>
                      <div className="d-flex items-center gap-2">
                        <span className="material-symbols-outlined text-16 text-light-1">label</span>
                        <span className="text-14 text-light-1">{listing.category.name}</span>
                      </div>
                    </>
                  )}
                  {listing.subcategory && (
                    <>
                      <span className="text-light-1">•</span>
                      <div className="d-flex items-center gap-2">
                        <span className="material-symbols-outlined text-16 text-light-1">bookmark</span>
                        <span className="text-14 text-light-1">{listing.subcategory.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-20">
                  <h3 className="text-16 fw-600 mb-10 d-flex items-center gap-2">
                    <span className="material-symbols-outlined text-18 text-blue-1">description</span>
                    Description
                  </h3>
                  <div className="text-15 fw-400 lh-24 text-dark-1" style={{ lineHeight: "1.6" }}>
                    {listing.description}
                  </div>
                </div>
              )}

              {/* Location Information */}
              {listing.location_address && (
                <div className="mb-20">
                  <h3 className="text-16 fw-600 mb-15 d-flex items-center gap-2">
                    <span className="material-symbols-outlined text-18 text-blue-1">location_on</span>
                    Location
                  </h3>
                  <div className="bg-light-2 rounded-8 px-15 py-10">
                    <div className="row y-gap-10">
                      {listing.location_address.address_line1 && (
                        <div className="col-12">
                          <div className="text-13 text-light-1 mb-5">Address</div>
                          <div className="text-15 fw-500">
                            {listing.location_address.address_line1}
                            {listing.location_address.address_line2 && `, ${listing.location_address.address_line2}`}
                          </div>
                        </div>
                      )}
                      <div className="col-md-6 col-12">
                        {listing.location_address.city && (
                          <>
                            <div className="text-13 text-light-1 mb-5">City</div>
                            <div className="text-15 fw-500">{listing.location_address.city}</div>
                          </>
                        )}
                      </div>
                      <div className="col-md-6 col-12">
                        {listing.location_address.state && (
                          <>
                            <div className="text-13 text-light-1 mb-5">State/Province</div>
                            <div className="text-15 fw-500">{listing.location_address.state}</div>
                          </>
                        )}
                      </div>
                      <div className="col-md-6 col-12">
                        {listing.location_address.country && (
                          <>
                            <div className="text-13 text-light-1 mb-5">Country</div>
                            <div className="text-15 fw-500">{listing.location_address.country}</div>
                          </>
                        )}
                      </div>
                      <div className="col-md-6 col-12">
                        {listing.location_address.postal_code && (
                          <>
                            <div className="text-13 text-light-1 mb-5">Postal Code</div>
                            <div className="text-15 fw-500">{listing.location_address.postal_code}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Property Specific Information */}
              {listing.type === "property" && (listing.star_rating || listing.accessibility_info) && (
                <div className="mb-20">
                  <h3 className="text-16 fw-600 mb-15 d-flex items-center gap-2">
                    <span className="material-symbols-outlined text-18 text-blue-1">hotel</span>
                    Property Details
                  </h3>
                  <div className="row x-gap-15 y-gap-15">
                    {listing.star_rating && (
                      <div className="col-md-6 col-12">
                        <div className="bg-light-2 rounded-8 px-15 py-10 h-100">
                          <div className="text-13 text-light-1 mb-5">Star Rating</div>
                          <div className="d-flex items-center gap-10">
                            <div className="text-18 fw-600">{listing.star_rating}</div>
                            <StarRating value={listing.star_rating} />
                          </div>
                        </div>
                      </div>
                    )}
                    {listing.accessibility_info && (
                      <div className="col-md-6 col-12">
                        <div className="bg-light-2 rounded-8 px-15 py-10 h-100">
                          <div className="text-13 text-light-1 mb-5">Accessibility</div>
                          <div className="text-15 fw-400">{listing.accessibility_info}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {listing.amenity && listing.amenity.length > 0 && (
                <div className="mb-20">
                  <h3 className="text-16 fw-600 mb-15 d-flex items-center gap-2">
                    <span className="material-symbols-outlined text-18 text-blue-1">spa</span>
                    Amenities
                  </h3>
                  <div className="d-flex flex-wrap gap-3">
                    {listing.amenity.map((amenity, index) => (
                      <div
                        key={amenity.id || index}
                        className="d-flex items-center gap-2 bg-light-2 rounded-8 py-5 px-10"
                      >
                        <span className="material-symbols-outlined text-16 text-blue-1">check_circle</span>
                        <span className="text-14 fw-500 text-dark-1">
                          {amenity.name || amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="mb-20">
                <h3 className="text-16 fw-600 mb-15 d-flex items-center gap-2">
                  <span className="material-symbols-outlined text-18 text-blue-1">info</span>
                  Additional Information
                </h3>
                <div className="row y-gap-10">
                  <div className="col-md-6 col-12">
                    <div className="d-flex items-center gap-3">
                      <span className="material-symbols-outlined text-18 text-light-1">tag</span>
                      <div>
                        <div className="text-13 text-light-1">Listing ID</div>
                        <div className="text-15 fw-500">#{listing.id}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="d-flex items-center gap-3">
                      <span className="material-symbols-outlined text-18 text-light-1">calendar_today</span>
                      <div>
                        <div className="text-13 text-light-1">Created At</div>
                        <div className="text-15 fw-500">{formatDateTime(listing.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  {listing.updatedAt && (
                    <div className="col-md-6 col-12">
                      <div className="d-flex items-center gap-3">
                        <span className="material-symbols-outlined text-18 text-light-1">update</span>
                        <div>
                          <div className="text-13 text-light-1">Last Updated</div>
                          <div className="text-15 fw-500">{formatDateTime(listing.updatedAt)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
      <DialogActions className="px-30 pb-20 pt-15" style={{ borderTop: "1px solid #e5e7eb" }}>
        <button
          className="text-14 border-light rounded-8 px-15 py-5 fw-500 hover:bg-light-2 transition-all"
          onClick={onClose}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ListingDetailModal;
