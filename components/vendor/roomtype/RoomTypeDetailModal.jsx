"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { getRoomTypeById, getMediaAssets } from "@/helpers/backend_helper";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";

const RoomTypeDetailModal = ({ open, onClose, roomTypeId }) => {
  const [roomType, setRoomType] = useState(null);
  const [roomTypeImages, setRoomTypeImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (open && roomTypeId) {
      loadRoomTypeDetail();
    } else {
      setRoomType(null);
      setRoomTypeImages([]);
      setError(null);
      setSelectedImageIndex(0);
    }
  }, [open, roomTypeId]);

  const loadRoomTypeDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch room type and images in parallel
      const [roomTypeResponse, imagesResponse] = await Promise.all([
        getRoomTypeById(roomTypeId),
        getMediaAssets({ room_type_id: roomTypeId, asset_type: "image" }).catch(() => ({ data: [] })) // Don't fail if images fail to load
      ]);
      
      const roomTypeData = roomTypeResponse?.data || roomTypeResponse;
      setRoomType(roomTypeData);
      
      // Extract images from response
      const imagesData = imagesResponse?.data || imagesResponse || [];
      const imagesArray = Array.isArray(imagesData) ? imagesData : [];
      setRoomTypeImages(imagesArray);
    } catch (err) {
      console.error("Error loading room type detail:", err);
      setError(typeof err === "string" ? err : err?.message || "Failed to load room type details");
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

  const getBookingTypeLabel = (bookingType) => {
    const typeMap = {
      by_day: "By Day",
      by_night: "By Night",
      by_hour: "By Hour",
    };
    return typeMap[bookingType] || bookingType;
  };

  // Get main image from fetched images
  const getMainImage = () => {
    if (roomTypeImages.length === 0) return null;
    const selectedImage = roomTypeImages[selectedImageIndex] || roomTypeImages[0];
    if (!selectedImage) return null;
    const url = getImageUrl(selectedImage);
    return url || null;
  };
  
  const mainImage = getMainImage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="room-type-detail-dialog-title"
      PaperProps={{
        style: {
          borderRadius: "16px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle 
        id="room-type-detail-dialog-title" 
        className="d-flex items-center justify-between pb-15"
        style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "15px" }}
      >
        <div className="d-flex items-center gap-2">
          <span className="material-symbols-outlined text-24 text-blue-1">bed</span>
          <span className="text-20 fw-600">Room Type Details</span>
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
            <div className="d-flex flex-column items-center gap-15">
              <CircularProgress />
              <div className="text-14 text-light-1">Loading room type details...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-60">
            <div className="d-flex flex-column items-center gap-15">
              <span className="material-symbols-outlined text-48 text-red-1">error</span>
              <div className="text-16 text-red-1 fw-500">{error}</div>
            </div>
          </div>
        ) : roomType ? (
          <div>
            {/* Hero Section with Image */}
            <div className="position-relative" style={{ minHeight: "200px", backgroundColor: "#f9fafb" }}>
              {mainImage ? (
                <div className="position-relative" style={{ width: "100%", height: "250px" }}>
                  <Image
                    src={mainImage}
                    alt={roomType.name || "Room type image"}
                    fill
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/img/testimonials/1/4.png";
                    }}
                    unoptimized
                  />
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
              {roomTypeImages.length > 1 && (
                <div className="px-20 py-15" style={{ backgroundColor: "#ffffff" }}>
                  <div className="d-flex gap-10 overflow-x-auto scroll-bar-1" style={{ paddingBottom: "5px" }}>
                    {roomTypeImages.slice(0, 6).map((img, index) => {
                      const imageUrl = getImageUrl(img);
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
                            alt={`Room type image ${index + 1}`}
                            width={80}
                            height={80}
                            onError={(e) => {
                              e.target.src = "/img/testimonials/1/4.png";
                            }}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            unoptimized
                          />
                        </div>
                      );
                    }).filter(Boolean)}
                    {roomTypeImages.length > 6 && (
                      <div
                        className="d-flex items-center justify-center bg-light-2"
                        style={{
                          minWidth: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                        }}
                      >
                        <span className="text-12 text-light-1 fw-500">+{roomTypeImages.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-30 py-20">
              {/* Title and Basic Info */}
              <div className="mb-20">
                <h2 className="text-24 fw-600 mb-10">{roomType.name || "Untitled Room Type"}</h2>
                <div className="d-flex items-center gap-5 flex-wrap">
                  {roomType.listing && (
                    <div className="d-flex items-center gap-2">
                      <span className="material-symbols-outlined text-16 text-light-1">hotel</span>
                      <span className="text-14 text-light-1">{roomType.listing.title || "Unknown Property"}</span>
                    </div>
                  )}
                  {roomType.booking_type && (
                    <>
                      <span className="text-light-1">•</span>
                      <div className="d-flex items-center gap-2">
                        <span className="material-symbols-outlined text-16 text-light-1">schedule</span>
                        <span className="text-14 text-light-1">{getBookingTypeLabel(roomType.booking_type)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {roomType.description && (
                <div className="mb-20">
                  <div className="d-flex items-center gap-2 mb-10">
                    <span className="material-symbols-outlined text-20 text-blue-1">description</span>
                    <span className="text-16 fw-600">Description</span>
                  </div>
                  <div className="bg-light-2 rounded-8 px-15 py-10">
                    <p className="text-14 text-light-1 lh-20">{roomType.description}</p>
                  </div>
                </div>
              )}

              {/* Room Details Grid */}
              <div className="row y-gap-15 x-gap-20 mb-20">
                {roomType.occupancy_adults !== null && roomType.occupancy_adults !== undefined && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Max Adults</div>
                      <div className="text-18 fw-600">{roomType.occupancy_adults}</div>
                    </div>
                  </div>
                )}
                {roomType.occupancy_children !== null && roomType.occupancy_children !== undefined && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Max Children</div>
                      <div className="text-18 fw-600">{roomType.occupancy_children}</div>
                    </div>
                  </div>
                )}
                {roomType.number_of_rooms !== null && roomType.number_of_rooms !== undefined && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Number of Rooms</div>
                      <div className="text-18 fw-600">{roomType.number_of_rooms}</div>
                    </div>
                  </div>
                )}
                {roomType.size && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Size</div>
                      <div className="text-18 fw-600">{roomType.size}</div>
                    </div>
                  </div>
                )}
                {roomType.bedrooms && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Bedrooms</div>
                      <div className="text-18 fw-600">{roomType.bedrooms}</div>
                    </div>
                  </div>
                )}
                {roomType.bathrooms && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Bathrooms</div>
                      <div className="text-18 fw-600">{roomType.bathrooms}</div>
                    </div>
                  </div>
                )}
                {roomType.base_price !== null && roomType.base_price !== undefined && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Base Price</div>
                      <div className="text-18 fw-600">${parseFloat(roomType.base_price || 0).toFixed(2)}</div>
                    </div>
                  </div>
                )}
                {roomType.cleaning_fee !== null && roomType.cleaning_fee !== undefined && (
                  <div className="col-md-6">
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <div className="text-13 text-light-1 mb-5">Cleaning Fee</div>
                      <div className="text-18 fw-600">
                        ${parseFloat(roomType.cleaning_fee || 0).toFixed(2)}
                        {roomType.cleaning_fee_type && ` (${roomType.cleaning_fee_type.replace("_", " ")})`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Policies and Rules */}
              <div className="row y-gap-15 x-gap-20 mb-20">
                <div className="col-md-6">
                  <div className="d-flex items-center gap-2 mb-10">
                    <span className="material-symbols-outlined text-20 text-blue-1">policy</span>
                    <span className="text-16 fw-600">Policies</span>
                  </div>
                  <div className="bg-light-2 rounded-8 px-15 py-10">
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex items-center gap-2">
                        <span className={`material-symbols-outlined text-16 ${roomType.smoking_allowed ? "text-green-3" : "text-red-1"}`}>
                          {roomType.smoking_allowed ? "check_circle" : "cancel"}
                        </span>
                        <span className="text-14">Smoking {roomType.smoking_allowed ? "Allowed" : "Not Allowed"}</span>
                      </div>
                      <div className="d-flex items-center gap-2">
                        <span className={`material-symbols-outlined text-16 ${roomType.pets_allowed ? "text-green-3" : "text-red-1"}`}>
                          {roomType.pets_allowed ? "check_circle" : "cancel"}
                        </span>
                        <span className="text-14">Pets {roomType.pets_allowed ? "Allowed" : "Not Allowed"}</span>
                      </div>
                      <div className="d-flex items-center gap-2">
                        <span className={`material-symbols-outlined text-16 ${roomType.party_allowed ? "text-green-3" : "text-red-1"}`}>
                          {roomType.party_allowed ? "check_circle" : "cancel"}
                        </span>
                        <span className="text-14">Parties {roomType.party_allowed ? "Allowed" : "Not Allowed"}</span>
                      </div>
                      <div className="d-flex items-center gap-2">
                        <span className={`material-symbols-outlined text-16 ${roomType.children_allowed !== false ? "text-green-3" : "text-red-1"}`}>
                          {roomType.children_allowed !== false ? "check_circle" : "cancel"}
                        </span>
                        <span className="text-14">Children {roomType.children_allowed !== false ? "Allowed" : "Not Allowed"}</span>
                      </div>
                      <div className="d-flex items-center gap-2">
                        <span className={`material-symbols-outlined text-16 ${roomType.instant_booking ? "text-green-3" : "text-red-1"}`}>
                          {roomType.instant_booking ? "check_circle" : "cancel"}
                        </span>
                        <span className="text-14">Instant Booking {roomType.instant_booking ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {roomType.rules && (
                  <div className="col-md-6">
                    <div className="d-flex items-center gap-2 mb-10">
                      <span className="material-symbols-outlined text-20 text-blue-1">rule</span>
                      <span className="text-16 fw-600">Rules</span>
                    </div>
                    <div className="bg-light-2 rounded-8 px-15 py-10">
                      <p className="text-14 text-light-1 lh-20">{roomType.rules}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              {roomType.additional_note && (
                <div className="mb-20">
                  <div className="d-flex items-center gap-2 mb-10">
                    <span className="material-symbols-outlined text-20 text-blue-1">note</span>
                    <span className="text-16 fw-600">Additional Notes</span>
                  </div>
                  <div className="bg-light-2 rounded-8 px-15 py-10">
                    <p className="text-14 text-light-1 lh-20">{roomType.additional_note}</p>
                  </div>
                </div>
              )}

              {/* Check-in/Check-out Times */}
              {(roomType.check_in_hour || roomType.check_out_hour) && (
                <div className="mb-20">
                  <div className="d-flex items-center gap-2 mb-10">
                    <span className="material-symbols-outlined text-20 text-blue-1">schedule</span>
                    <span className="text-16 fw-600">Check-in/Check-out</span>
                  </div>
                  <div className="row y-gap-10 x-gap-20">
                    {roomType.check_in_hour && (
                      <div className="col-md-6">
                        <div className="bg-light-2 rounded-8 px-15 py-10">
                          <div className="text-13 text-light-1 mb-5">Check-in Time</div>
                          <div className="text-16 fw-600">{roomType.check_in_hour}</div>
                        </div>
                      </div>
                    )}
                    {roomType.check_out_hour && (
                      <div className="col-md-6">
                        <div className="bg-light-2 rounded-8 px-15 py-10">
                          <div className="text-13 text-light-1 mb-5">Check-out Time</div>
                          <div className="text-16 fw-600">{roomType.check_out_hour}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Created Date */}
              {roomType.created_at && (
                <div className="mb-20">
                  <div className="bg-light-2 rounded-8 px-15 py-10">
                    <div className="text-13 text-light-1 mb-5">Created Date</div>
                    <div className="text-14 fw-500">{formatDate(roomType.created_at)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
      <DialogActions className="px-20 pb-20">
        <button
          className="text-14 bg-blue-1 text-white rounded-8 px-15 py-10 fw-500"
          onClick={onClose}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomTypeDetailModal;

