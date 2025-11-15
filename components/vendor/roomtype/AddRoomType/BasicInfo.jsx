"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/common/form/FormInput";
import { Alert, Snackbar, Checkbox } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { getMyListings, getListingById, getMediaAssets } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ImageGallery from "@/components/vendor/listings/common/ImageGallery";

const BasicInfo = ({ bookingType, setBookingType, listingId, subtype, roomTypeData, updateRoomTypeData }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomTypeId = searchParams.get("roomTypeId");
  // Use shared state from parent, with local state as fallback
  const maxAdults = roomTypeData?.occupancy_adults || 2;
  const maxChildren = roomTypeData?.occupancy_children || 1;
  const maxOccupancy = maxAdults + maxChildren;
  const rooms = roomTypeData?.number_of_rooms || 1;
  const roomNumbers = roomTypeData?.room_numbers || [];
  
  const [property, setProperty] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [propertyListings, setPropertyListings] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(listingId ? String(listingId) : "");
  const [loading, setLoading] = useState(false);
  const [listingAmenities, setListingAmenities] = useState([]); // Amenities from the selected listing
  const [loadingListingDetails, setLoadingListingDetails] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // Existing images from backend
  const [loadingImages, setLoadingImages] = useState(false);

  // Load listing details including amenities when a listing is selected
  const loadListingDetails = async (listingId) => {
    if (!listingId) {
      setListingAmenities([]);
      updateRoomTypeData({ amenities: [] });
      return;
    }

    try {
      setLoadingListingDetails(true);
      const response = await getListingById(listingId);
      const listing = response?.data || response;

      if (listing && listing.amenity && Array.isArray(listing.amenity)) {
        // Extract amenities from the listing
        const amenities = listing.amenity.map((a) => ({
          id: a.id,
          name: a.name,
        }));
        setListingAmenities(amenities);
      } else {
        setListingAmenities([]);
        updateRoomTypeData({ amenities: [] });
      }
    } catch (error) {
      console.error("Error loading listing details:", error);
      toast.error(error?.message || "Failed to load listing amenities");
      setListingAmenities([]);
    } finally {
      setLoadingListingDetails(false);
    }
  };

  // Helper function to handle property selection and routing
  const handlePropertySelection = async (listings, targetListingId) => {
    if (targetListingId) {
      setSelectedPropertyId(String(targetListingId));
      const foundProperty = listings.find((p) => p.id === targetListingId);
      setProperty(foundProperty || null);
      updateRoomTypeData({ listing_id: targetListingId });

      // Load listing details including amenities
      await loadListingDetails(targetListingId);

      // Build URL params, preserving roomTypeId if it exists
      const queryParams = new URLSearchParams();
      queryParams.set("subtype", foundProperty && foundProperty.subtype !== subtype ? foundProperty.subtype : subtype);
      queryParams.set("listingId", foundProperty?.id || targetListingId);
      if (roomTypeId) {
        queryParams.set("roomTypeId", roomTypeId);
      }

      // Redirect if property subtype doesn't match current subtype
      if (
        foundProperty &&
        (foundProperty.subtype !== subtype)
      ) {
        router.push(`/vendor/room-type/add?${queryParams.toString()}`);
        return true; // Indicate redirect happened
      }
      router.push(`/vendor/room-type/add?${queryParams.toString()}`);
    } else {
      // Clear selection - remove listingId from URL but preserve roomTypeId
      setSelectedPropertyId("");
      setProperty(null);
      setListingAmenities([]);
      updateRoomTypeData({ listing_id: null, amenities: [] });
      
      // Build URL params, preserving roomTypeId if it exists
      const queryParams = new URLSearchParams();
      queryParams.set("subtype", subtype);
      if (roomTypeId) {
        queryParams.set("roomTypeId", roomTypeId);
      }
      router.push(`/vendor/room-type/add?${queryParams.toString()}`);
      return true; // Indicate redirect happened
    }
    return false; // No redirect
  };

  useEffect(() => {
    // Only load listings if not loaded
    if (propertyListings.length === 0) {
      loadPropertyListings();
    } else if (listingId) {
      handlePropertySelection(propertyListings, listingId);
    } else {
      setProperty(null);
      setListingAmenities([]);
    }
  }, [listingId, subtype]);

  // Load listing details when listingId changes
  useEffect(() => {
    if (listingId) {
      loadListingDetails(listingId);
    } else {
      setListingAmenities([]);
      updateRoomTypeData({ amenities: [] });
    }
  }, [listingId]);

  // Load existing images when editing (roomTypeId exists)
  useEffect(() => {
    if (roomTypeId) {
      loadExistingImages();
    } else {
      setExistingImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTypeId]);

  const loadExistingImages = async () => {
    if (!roomTypeId) return;

    try {
      setLoadingImages(true);
      const response = await getMediaAssets({ room_type_id: roomTypeId, type: "image" });
      const mediaData = response?.data || response || [];
      const images = Array.isArray(mediaData) ? mediaData : [];
      
      // Transform to include id for deletion tracking
      const formattedImages = images.map((img) => ({
        id: img.id,
        url: img.url,
        isExisting: true, // Flag to identify existing images
      }));
      
      setExistingImages(formattedImages);
    } catch (error) {
      console.error("Error loading existing images:", error);
      // Don't show error toast, just log it - images might not exist yet
      setExistingImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  // Handle existing images change (track deletions instead of deleting immediately)
  const handleExistingImagesChange = (updatedExisting) => {
    // Find removed images and add to deletion list
    const removedImages = existingImages.filter(
      (img) => !updatedExisting.find((u) => u.id === img.id)
    );
    
    if (removedImages.length > 0) {
      // Update local state
      setExistingImages(updatedExisting);
      
      // Add removed image IDs to deletion list
      const currentToDelete = roomTypeData?.imagesToDelete || [];
      const removedIds = removedImages.map((img) => img.id);
      const newToDelete = [
        ...currentToDelete,
        ...removedIds.filter((id) => !currentToDelete.includes(id))
      ];
      updateRoomTypeData({ imagesToDelete: newToDelete });
    } else {
      // Just update state if no deletions
      setExistingImages(updatedExisting);
    }
  };

  // Handle custom existing image removal for room types (track deletion, don't delete immediately)
  const handleExistingImageRemove = (imageId, index) => {
    if (!imageId) return;

    // Remove from existing images display
    const imageToRemove = existingImages.find((img) => img.id === imageId);
    if (imageToRemove) {
      const updatedExisting = existingImages.filter((img) => img.id !== imageId);
      handleExistingImagesChange(updatedExisting);
    }
  };

  const loadPropertyListings = async () => {
    setLoading(true);
    try {
      const filterParams = { type: "property" };
      if (subtype) filterParams.subtype = subtype;

      const response = await getMyListings(filterParams);
      const listings = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      setPropertyListings(listings);

      // Handle property selection after loading
      handlePropertySelection(listings, listingId);
    } catch (error) {
      console.error("Error loading property listings:", error);
      toast.error(error?.message || "Failed to load property listings");
      setPropertyListings([]);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="row y-gap-10 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Basic Information</h1>
      <div className="row y-gap-20 x-gap-10 justify-between items-center">
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-1 fw-500">
            Property
            <span className="text-red-1">*</span>
            {loading && (
              <span className="text-12 text-light-1 ml-10 align-middle">(Loading...)</span>
            )}
          </h1>
          <select
            className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10"
            value={selectedPropertyId}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "create-new-property") {
                const subtypeParam = subtype || "Hotel";
                router.push(`/vendor/listings/add?subtype=${subtypeParam}`);
              } else {
                const selectedId = value ? parseInt(value, 10) : null;
                setSelectedPropertyId(value || "");
                // Use helper function to handle property selection and routing
                handlePropertySelection(propertyListings, selectedId);
              }
            }}
            disabled={loading}
          >
            <option value="">Select property</option>
            {propertyListings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title}
              </option>
            ))}
            <option value="create-new-property">Create New Property</option>
          </select>
        </div>
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-1 fw-500">Booking Type</h1>
          <select
            className="form-select rounded-8 border-light px-15 py-10 justify-between w-full mt-10"
            value={bookingType}
            onChange={(event) => {
              setShowSnackbar(true);
              setBookingType(event.target.value);
            }}
          >
            <option value="day-night">Book by Day/Night</option>
            <option value="hour">Book by Hour</option>
          </select>

          <Snackbar
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={showSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowSnackbar(false)}
          >
            <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
              All prices would need to be reviewed.
            </Alert>
          </Snackbar>
        </div>
        <FormInput
          label={
            <>
              Room Type <span className="text-red-1">*</span>
            </>
          }
          type="text"
          name="name"
          placeholder="Hotel ABC Executive Suite"
          value={roomTypeData?.name || ""}
          onChange={(e) => updateRoomTypeData({ name: e.target.value })}
        />
        <FormInput
          onChange={(e) => {
            const adults = Number(e.target.value);
            updateRoomTypeData({ occupancy_adults: adults });
          }}
          label="Max no. of Adults"
          type="number"
          name="occupancy_adults"
          gridClass="col-sm-4"
          placeholder="2"
          min={1}
          value={maxAdults}
        />
        <FormInput
          onChange={(e) => {
            const children = Number(e.target.value);
            updateRoomTypeData({ occupancy_children: children });
          }}
          label="Max no. of Children"
          type="number"
          name="occupancy_children"
          gridClass="col-sm-4"
          placeholder="1"
          min={0}
          value={maxChildren}
        />
        <FormInput
          label="Max no. of Occupancy"
          type="number"
          name="maxOccupancy"
          gridClass="col-sm-4"
          placeholder="3"
          value={maxOccupancy}
          readOnly={true}
        />
        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">
            Amenities
            {loadingListingDetails && (
              <span className="text-12 text-light-1 ml-10 align-middle">(Loading...)</span>
            )}
          </h1>
          {!selectedPropertyId ? (
            <div className="text-14 text-light-1 mt-10">
              Please select a property to see its amenities
            </div>
          ) : listingAmenities.length === 0 ? (
            <div className="text-14 text-light-1 mt-10">
              No amenities available for this property
            </div>
          ) : (
            <div className="row mt-10">
              {listingAmenities.map((amenity) => {
                const isSelected = roomTypeData?.amenities?.includes(amenity.id) || false;
                return (
                  <div key={amenity.id} className="col-sm-6 form-checkbox d-flex items-center mt-5">
                    <Checkbox
                      className="px-0 py-0"
                      checked={isSelected}
                      onChange={(e) => {
                        const currentAmenities = roomTypeData?.amenities || [];
                        let newAmenities;
                        if (e.target.checked) {
                          newAmenities = [...currentAmenities, amenity.id];
                        } else {
                          newAmenities = currentAmenities.filter((id) => id !== amenity.id);
                        }
                        updateRoomTypeData({ amenities: newAmenities });
                      }}
                    />
                    <div className="text-14 fw-500 ml-5">{amenity.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <FormInput
          label={
            <>
              Description <span className="text-red-1">*</span>
            </>
          }
          rows={3}
          type="textarea"
          name="description"
          placeholder="Enter description for the room"
          gridClass="col-12"
          value={roomTypeData?.description || ""}
          onChange={(e) => updateRoomTypeData({ description: e.target.value })}
        />
        <div className="col-12">
          <h1 className="text-14 lh-12 fw-500">Photos</h1>
          {loadingImages && (
            <div className="text-14 text-light-1 mt-10 mb-10">Loading existing images...</div>
          )}
          <ImageGallery
            images={roomTypeData?.images || []}
            existingImages={existingImages}
            onImagesChange={(newImages) => updateRoomTypeData({ images: newImages })}
            onExistingImagesChange={handleExistingImagesChange}
            listingId={roomTypeId} // Pass roomTypeId for conditional rendering
            title="" // Hide title since we're using our own above
            showUploadForm={true}
            multiple={true}
            onExistingImageRemove={handleExistingImageRemove}
          />
        </div>
        <div className="col-sm-6 mt-5">
          <h1 className="text-14 lh-12 fw-500">
            Number of Available Rooms of this Type
          </h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="number"
            min={1}
            placeholder="Enter number of rooms available"
            value={rooms}
            onChange={(e) => {
              const numRooms = Number(e.target.value);
              updateRoomTypeData({ number_of_rooms: numRooms });
              // Adjust room_numbers array if needed
              const currentRoomNumbers = roomTypeData?.room_numbers || [];
              if (numRooms > currentRoomNumbers.length) {
                const newRoomNumbers = [...currentRoomNumbers];
                for (let i = currentRoomNumbers.length; i < numRooms; i++) {
                  newRoomNumbers.push("");
                }
                updateRoomTypeData({ room_numbers: newRoomNumbers });
              } else if (numRooms < currentRoomNumbers.length) {
                updateRoomTypeData({ room_numbers: currentRoomNumbers.slice(0, numRooms) });
              }
            }}
          />
        </div>
        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Room Numbers</h1>
          <div className="row">
            {Array(rooms)
              .fill(null)
              .map((_, index) => (
                <FormInput
                  key={index}
                  placeholder={"Room " + (index + 1)}
                  gridClass="col-sm-6"
                  value={roomNumbers[index] || ""}
                  onChange={(e) => {
                    const newRoomNumbers = [...(roomNumbers || [])];
                    newRoomNumbers[index] = e.target.value;
                    updateRoomTypeData({ room_numbers: newRoomNumbers });
                  }}
                />
              ))}
          </div>
          <button
            className="button rounded-8 text-14 fw-500 mt-10 border-light px-15 py-10"
            onClick={() => {
              const newRooms = rooms + 1;
              const newRoomNumbers = [...(roomNumbers || [])];
              newRoomNumbers.push("");
              updateRoomTypeData({ 
                number_of_rooms: newRooms,
                room_numbers: newRoomNumbers
              });
            }}
          >
            <i className="icon-plus mr-15 text-14 fw-400"></i> Add Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;


