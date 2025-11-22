import { Eventcalendar, setOptions } from "@mobiscroll/react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getVendorBookings, getMyListings, getRoomTypes } from "@/helpers/backend_helper";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

setOptions({
  theme: "ios",
  themeVariant: "light",
});

// Color palette for different listings/room types
const COLORS = [
  "#e20000", "#76e083", "#4981d6", "#e25dd2", "#1dab2f",
  "#d6d145", "#34c8e0", "#9dde46", "#166f6f", "#f7961e",
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7",
  "#a29bfe", "#fd79a8", "#fdcb6e", "#e17055", "#00b894"
];

const CustomEventCalendar = () => {
  const [viewType, setViewType] = useState("month");
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const myView = useMemo(
    () => ({
      timeline: {
        type: viewType,
        resolutionHorizontal:
          viewType == "month" ? "week" : viewType == "week" ? "day" : "hour",
      },
    }),
    [viewType]
  );

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch bookings, listings, and room types in parallel
      const [bookingsRes, listingsRes, roomTypesRes] = await Promise.all([
        getVendorBookings().catch(() => ({ data: { bookings: [] } })),
        getMyListings({ type: "property" }).catch(() => ({ data: [] })),
        getRoomTypes().catch(() => ({ data: [] }))
      ]);

      setBookings(bookingsRes?.data?.bookings || bookingsRes?.bookings || []);
      setListings(listingsRes?.data || listingsRes || []);
      setRoomTypes(roomTypesRes?.data || roomTypesRes || []);
    } catch (error) {
      console.error("Error loading calendar data:", error);
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  // Map bookings to calendar events
  const myEvents = useMemo(() => {
    if (loading || bookings.length === 0) return [];
    const events = [];

    bookings
      .filter(booking => booking.startDate && booking.endDate)
      .map((booking) => {
        // Format dates for calendar
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);

        // Determine resource ID - use room type if available, otherwise use listing
        const listingId = booking.listingId || booking.listing_id;
        const roomTypeId = booking.roomTypeId || booking.room_type_id;

        // Create event title with booking info
        const guestName = booking.guestName || "Guest";
        const bookingNumber = booking.bookingNumber || `#${booking.id}`;
        const status = booking.status || "pending";
        const roomTypeName = booking.roomTypeName;

        // Include room type in title if available
        const title = roomTypeName
          ? `${guestName} (${bookingNumber}) - ${roomTypeName} - ${status}`
          : `${guestName} (${bookingNumber}) - ${status}`;

        let resourceId;
        if (roomTypeId) {
          const listingIdNum = parseInt(listingId, 10);
          const roomTypeIdNum = parseInt(roomTypeId, 10);

          const roomType = roomTypes.find(rt => parseInt(rt.id, 10) === roomTypeIdNum);
          const listing = listings.find(l => parseInt(l.id, 10) === listingIdNum);
          if (roomType && listing) {
            resourceId = `${String(listing.id)}-${String(roomType.id)}`;
            events.push({
              id: booking.id,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              title: title,
              resource: resourceId,
            });
          }
          resourceId = String(listingId);
        } else {
          // No room type - use listing directly
          resourceId = String(listingId);
        }
        events.push({
          id: booking.id,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          title: title,
          resource: resourceId,
        });

        return events;
      });
    return events;
  }, [bookings, listings, roomTypes, loading]);

  // Map listings and room types to calendar resources (hierarchical structure)
  const myResources = useMemo(() => {
    if (loading || listings.length === 0) return [];

    const resources = listings.map((listing, index) => {
      const color = COLORS[index % COLORS.length];

      // Get room types for this listing
      const listingRoomTypes = roomTypes.filter(rt => rt.listing_id === listing.id);

      // If listing has room types, create hierarchical structure
      if (listingRoomTypes.length > 0) {
        const children = listingRoomTypes.map((roomType) => {
          // Ensure consistent ID format (convert to string to match event resource IDs)
          const resourceId = `${String(listing.id)}-${String(roomType.id)}`;
          return {
            id: resourceId,
            name: roomType.name,
            color: color,
          };
        });

        return {
          id: String(listing.id),
          name: listing.title || listing.name || `Listing ${listing.id}`,
          color: color,
          children: children,
        };
      } else {
        // Listing without room types - use listing as resource
        return {
          id: String(listing.id),
          name: listing.title || listing.name || `Listing ${listing.id}`,
          color: color,
        };
      }
    });
    return resources;
  }, [listings, roomTypes, loading]);

  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-14 text-light-1">Loading calendar data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-end items-center mb-10 mr-10">
        <select
          className="form-select rounded-8 border-light justify-between text-16 px-15 w-140 text-14"
          onChange={(event) => setViewType(event.target.value)}
          value={viewType}
        >
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="day">Day</option>
        </select>
      </div>
      {myResources.length === 0 ? (
        <div className="d-flex justify-center items-center py-40">
          <div className="text-14 text-light-1">No listings or bookings found</div>
        </div>
      ) : (
        <Eventcalendar
          clickToCreate={false}
          dragToCreate={false}
          dragToMove={false}
          dragToResize={false}
          eventDelete={false}
          view={myView}
          data={myEvents}
          resources={myResources}
        />
      )}
    </>
  );
};

export default CustomEventCalendar;
