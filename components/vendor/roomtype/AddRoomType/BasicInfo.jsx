"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/common/form/FormInput";
import { Alert, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { getMyListings } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ImageUploadForm from "@/components/vendor/common/ImageUploadForm";

const BasicInfo = ({ bookingType, setBookingType, listingId, subtype, roomTypeData, updateRoomTypeData }) => {
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

  const router = useRouter();

  // Helper function to handle property selection and routing
  const handlePropertySelection = (listings, targetListingId) => {
    if (targetListingId) {
      setSelectedPropertyId(String(targetListingId));
      const foundProperty = listings.find((p) => p.id === targetListingId);
      setProperty(foundProperty || null);
      updateRoomTypeData({ listing_id: targetListingId });

      // Redirect if property subtype doesn't match current subtype
      if (
        foundProperty &&
        (foundProperty.subtype !== subtype)
      ) {
        router.push(
          `/vendor/room-type/add?subtype=${foundProperty.subtype}&listingId=${foundProperty.id}`
        );
        return true; // Indicate redirect happened
      }
      router.push(
        `/vendor/room-type/add?subtype=${subtype}&listingId=${targetListingId}`
      );
    } else {
      // Clear selection - remove listingId from URL
      setSelectedPropertyId("");
      setProperty(null);
      updateRoomTypeData({ listing_id: null });
      // Remove listingId from URL if it exists
      router.push(`/vendor/room-type/add?subtype=${subtype}`);
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
    }
  }, [listingId, subtype]);

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
          label="Room Type"
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
        <FormInput
          label="Description"
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
          <div className="border-light rounded-8 px-15 py-15 mt-10">
            <ImageUploadForm 
              onFileSelect={(file) => {
                const currentImages = roomTypeData?.images || [];
                updateRoomTypeData({ images: [...currentImages, file] });
              }} 
              multiple={true} 
            />
          </div>
          {roomTypeData?.images && roomTypeData.images.length > 0 && (
            <div className="mt-10">
              <div className="text-14 fw-500 mb-10">
                Selected Images ({roomTypeData.images.length})
              </div>
              <div className="d-flex flex-wrap y-gap-10 x-gap-10">
                {roomTypeData.images.map((image, index) => (
                  <div key={index} className="position-relative">
                    <div className="border-light rounded-8 overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Room image ${index + 1}`}
                        className="w-full h-120 object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = roomTypeData.images.filter((_, i) => i !== index);
                        updateRoomTypeData({ images: newImages });
                      }}
                      className="absolute bg-red-1 text-white rounded-full size-25 flex-center cursor-pointer border-none"
                      style={{ top: "10px", right: "10px" }}
                    >
                      <span className="material-symbols-outlined text-14">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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


