import { useState } from "react";
import ServiceCard from "@/components/vendor/common/ServiceCard";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

const SelectServices = () => {
  const data = [
    {
      name: "Events",
      image: "/img/dashboard/services/attr_events_service.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
    },
    {
      name: "Tours",
      image: "/img/dashboard/services/noproperty_tours.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
    },
    {
      name: "Activities",
      image: "/img/dashboard/services/noproperty_activities.jpg",
      icon: "/img/dashboard/icons/hotel-icon.svg",
    },
  ];

  const [selectedService, setSelectedService] = useState();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const router = useRouter();

  return (
    <>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        <h1 className="text-18 lh-14 fw-500">Select Non-Property Listing Type</h1>
        <div className="text-15 text-light-1">
          Choose one non-property type you will like to list
        </div>
        <div className="col-12">
          <ServiceCard
            data={data}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        </div>
        <div className="col-12 px-30 mt-20 mb-10">
          <div className="row y-gap-20 justify-between items-end">
            <button
              className="button rounded-8 py-10 px-30 text-14 -dark-1 border-light text-light-1 col-auto"
              onClick={() => router.push("/vendor/listings/non-property")}
            >
              <i className="icon icon-chevron-left mr-10" /> Back
            </button>
            <button
              className="button rounded-8 py-10 px-30 text-14 -dark-1 bg-dark-3 text-white col-auto"
              onClick={() => {
                if (selectedService) {
                  // Map service names to type
                  const serviceMap = {
                    "Events": { type: "event" },
                    "Tours": { type: "tour" },
                    "Activities": { type: "activity" },
                    "Flights": { type: "flight" },
                    "Rides": { type: "ride" },
                  };
                  
                  const mapping = serviceMap[selectedService.name];
                  if (mapping) {
                    router.push(
                      `/vendor/listings/add?type=${mapping.type}`
                    );
                  } else {
                    // Fallback to legacy format
                    router.push(
                      "/vendor/listings/add?service=" + selectedService?.name
                    );
                  }
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
