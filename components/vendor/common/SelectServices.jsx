import { useState } from "react";
import ServiceCard from "@/components/vendor/common/ServiceCard";
import AddProperty from "../listings/property/AddHotel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

const SelectServices = ({ setIsListings }) => {
  const [selectedService, setSelectedService] = useState();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const router = useRouter();

  // Map service names to type/subtype
  const serviceMap = {
    "Hotels": { type: "property", subtype: "Hotel" },
    "Spaces": { type: "property", subtype: "Space" },
    "Vacation Rentals": { type: "property", subtype: "Vacation" },
    "Event Venues": { type: "property", subtype: "EventVenue" },
    "Events": { type: "event" },
    "Tours": { type: "tour" },
    "Activities": { type: "activity" },
    "Flights": { type: "flight" },
    "Rides": { type: "ride" },
  };

  // Navigate to add listing page based on service
  const navigateToAddListing = (service) => {
    const mapping = serviceMap[service.name];
    if (mapping) {
      if (mapping.subtype) {
        // Property type with subtype
        router.push(
          `/vendor/listings/add?type=${mapping.type}&subtype=${mapping.subtype}`
        );
      } else {
        // Non-property type
        router.push(
          `/vendor/listings/add?type=${mapping.type}`
        );
      }
    } else {
      // Fallback to legacy format
      router.push(
        "/vendor/listings/add?service=" + service?.name
      );
    }
  };

  return (
    <>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        <h1 className="text-20 lh-14 fw-600">Select Services</h1>
        <h1 className="text-18 lh-14 fw-500">Select Type of Services</h1>
        <div className="text-15 text-light-1">
          Choose one or more services to include in your booking. Selecting
          multiple services will create a package.
        </div>
        <div className="col-12">
          <ServiceCard
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        </div>
        <div className="col-12 px-30 mt-20 mb-10">
          <div className="row y-gap-20 justify-between items-end">
            <button
              className="button rounded-8 py-10 px-30 text-14 -dark-1 border-light text-light-1 col-auto"
              onClick={() => setIsListings(true)}
            >
              <i className="icon icon-chevron-left mr-10" /> Back
            </button>
            <button
              className="button rounded-8 py-10 px-30 text-14 -dark-1 bg-dark-3 text-white col-auto"
              onClick={() => {
                if (selectedService) {
                  navigateToAddListing(selectedService);
                } else {
                  setShowSnackbar(true);
                }
              }}
            >
              Continue
              <i className="icon icon-chevron-right ml-10" />
            </button>
          </div>
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
          Please select a service to continue.
        </Alert>
      </Snackbar>
    </>
  );
};

export default SelectServices;
